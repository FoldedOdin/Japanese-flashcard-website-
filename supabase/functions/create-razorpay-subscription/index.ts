import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { planId } = await req.json()
    // Default to the environment variable if not passed
    const razorpayPlanId = planId || Deno.env.get('RAZORPAY_PLAN_ID')

    if (!razorpayPlanId) {
       throw new Error("Razorpay Plan ID is missing.");
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    // Create a subscription via Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${keyId}:${keySecret}`)
      },
      body: JSON.stringify({
        plan_id: razorpayPlanId,
        total_count: 120, // Example: 10 years if monthly
        customer_notify: 1,
        notes: {
          user_id: user.id, // CRITICAL: This links the payment to the user in our webhook
        }
      })
    })

    const subscription = await response.json()

    if (!response.ok) {
       throw new Error(subscription.error?.description || "Failed to create subscription")
    }

    return new Response(
      JSON.stringify({ 
         subscription_id: subscription.id,
         key_id: keyId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
