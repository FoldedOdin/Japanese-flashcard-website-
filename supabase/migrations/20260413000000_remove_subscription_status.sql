-- Remove premium subscription and stripe columns after open source transition
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS subscription_status,
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id;
