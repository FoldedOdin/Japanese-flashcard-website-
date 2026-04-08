import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Webhook secret not set or signature missing.', { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider)
  } catch (err: unknown) {
    console.error(`Webhook Error: ${(err as Error).message}`)
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  // Create a Supabase client to update the user's subscription
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const handleSubscriptionChange = async (
    status: 'free' | 'premium',
    customerId: string,
    subscriptionId: string,
    userId?: string
  ) => {
    try {
      if (userId) {
        // If we know the user from client_reference_id (e.g. during checkout session complete)
        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_status: status,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq('id', userId)
      } else {
        // Otherwise, locate user by stripe_customer_id
        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_status: status,
            stripe_subscription_id: subscriptionId,
          })
          .eq('stripe_customer_id', customerId)
      }
    } catch (error) {
      console.error('Error updating subscription in Supabase:', error)
      throw error
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          await handleSubscriptionChange(
            'premium',
            session.customer as string,
            session.subscription as string,
            session.client_reference_id as string
          )
        }
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free'
        await handleSubscriptionChange(status, subscription.customer as string, subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange('free', subscription.customer as string, subscription.id)
        break
      }
    }
  } catch (error) {
    return new Response('Unhandled error processing webhook.', { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
