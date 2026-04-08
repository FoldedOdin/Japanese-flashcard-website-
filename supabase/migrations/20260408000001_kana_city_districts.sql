-- Migration to add kana_city_districts table

CREATE TABLE IF NOT EXISTS public.kana_city_districts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  district_id text NOT NULL,
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'mastered')),
  unlocked_at timestamptz,
  mastered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, district_id)
);

-- RLS policies
ALTER TABLE public.kana_city_districts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Districts are readable by owner" ON public.kana_city_districts;
CREATE POLICY "Districts are readable by owner"
  ON public.kana_city_districts
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Districts are insertable by owner" ON public.kana_city_districts;
CREATE POLICY "Districts are insertable by owner"
  ON public.kana_city_districts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Districts are updatable by owner" ON public.kana_city_districts;
CREATE POLICY "Districts are updatable by owner"
  ON public.kana_city_districts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Districts are deletable by owner" ON public.kana_city_districts;
CREATE POLICY "Districts are deletable by owner"
  ON public.kana_city_districts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update trigger
DROP TRIGGER IF EXISTS trg_kana_city_districts_updated_at ON public.kana_city_districts;
CREATE TRIGGER trg_kana_city_districts_updated_at
BEFORE UPDATE ON public.kana_city_districts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
