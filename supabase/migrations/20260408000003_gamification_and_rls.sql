-- 1. Create Gamification Tables
CREATE TABLE IF NOT EXISTS public.gamification_profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    xp integer NOT NULL DEFAULT 0,
    level integer NOT NULL DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('daily', 'weekly')),
    description text NOT NULL,
    target_value integer NOT NULL,
    current_value integer NOT NULL DEFAULT 0,
    is_completed boolean NOT NULL DEFAULT false,
    xp_reward integer NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.streak_shields (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    shield_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_shields ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can read their own gamification data, but CANNOT write it. Writes are done via Edge Functions using Service Role.
CREATE POLICY "Users can view own gamification profile" ON public.gamification_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own missions" ON public.missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own shields" ON public.streak_shields FOR SELECT USING (auth.uid() = user_id);

-- 4. Add RLS to kana_city_districts (Missing from older migrations)
DO $$ BEGIN
    CREATE POLICY "Users can view own districts" ON public.kana_city_districts FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can manage own districts" ON public.kana_city_districts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. Stored Procedure for Midnight Streak Checking
CREATE OR REPLACE FUNCTION process_daily_streaks() RETURNS void AS $$
BEGIN
    -- Decrement shield if user missed yesterday and has shields
    UPDATE public.streak_shields ss
    SET shield_count = shield_count - 1
    FROM public.user_progress up
    WHERE ss.user_id = up.user_id 
      AND up.last_study_date < CURRENT_DATE - INTERVAL '1 day'
      AND ss.shield_count > 0;

    -- Reset streak if missed yesterday and no shields
    UPDATE public.user_progress up
    SET current_streak = 0
    FROM public.streak_shields ss
    WHERE up.user_id = ss.user_id
      AND up.last_study_date < CURRENT_DATE - INTERVAL '1 day'
      AND ss.shield_count = 0;
      
    -- Reset streak if missed yesterday and streak_shields row doesn't even exist
    UPDATE public.user_progress up
    SET current_streak = 0
    WHERE up.last_study_date < CURRENT_DATE - INTERVAL '1 day'
      AND NOT EXISTS (SELECT 1 FROM public.streak_shields ss WHERE ss.user_id = up.user_id AND ss.shield_count > 0);
END;
$$ LANGUAGE plpgsql;

-- 6. Cron Schedule (pg_cron)
-- Only run if pg_cron is enabled. Supabase managed instances support this.
-- select cron.schedule('process_daily_streaks_job', '0 0 * * *', 'SELECT public.process_daily_streaks();');
