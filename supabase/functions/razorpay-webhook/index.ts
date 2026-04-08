import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

serve(async (req) => {
  try {
    const signature = req.headers.get('X-Razorpay-Signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    if (!signature || !webhookSecret) {
      return new Response('Missing signature or secret', { status: 400 })
    }

    const payload = await req.text()
    
    // Verify Razorpay signature
    const expectedSignature = hmac("sha256", webhookSecret, payload, "utf8", "hex")
    
    if (expectedSignature !== signature) {
       return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(payload)

    // We need service role to modify user_profiles
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (event.event === 'subscription.authenticated' || event.event === 'subscription.activated') {
       const userId = event.payload.subscription.entity.notes?.user_id;

       if (userId) {
          // Upgrade user to Premium
          await supabaseAdmin
            .from('user_profiles')
            .update({ subscription_status: 'premium' })
            .eq('id', userId)
       }
    } else if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
       const userId = event.payload.subscription.entity.notes?.user_id;

       if (userId) {
          // Downgrade user back to free
          await supabaseAdmin
            .from('user_profiles')
            .update({ subscription_status: 'free' })
            .eq('id', userId)
       }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
