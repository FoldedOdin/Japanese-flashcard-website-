-- Add onboarding_completed field to user_profiles

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;
