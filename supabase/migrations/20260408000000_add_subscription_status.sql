-- Migration to add subscription status and Stripe IDs

-- Create an ENUM type for subscription status if you prefer, but text with a check constraint is often easier to manage
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'trial', 'premium')),
ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;
