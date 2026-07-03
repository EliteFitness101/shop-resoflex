
-- ResoFit AI Coach — Phase 1 schema

-- health_profiles: one per user
CREATE TABLE public.health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INT,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  body_fat_pct NUMERIC,
  goal TEXT,
  medical_conditions TEXT,
  food_allergies TEXT,
  workout_experience TEXT,
  occupation TEXT,
  daily_schedule TEXT,
  wake_time TEXT,
  sleep_time TEXT,
  stress_level TEXT,
  budget_ngn NUMERIC,
  location TEXT,
  preferred_foods TEXT,
  foods_to_avoid TEXT,
  religious_restrictions TEXT,
  equipment TEXT,
  training_venue TEXT,
  target_weight_kg NUMERIC,
  target_date DATE,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_profiles TO authenticated;
GRANT ALL ON public.health_profiles TO service_role;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own health_profiles" ON public.health_profiles FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- daily_logs
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  water_ml INT DEFAULT 0,
  calories INT DEFAULT 0,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  weight_kg NUMERIC,
  mood TEXT,
  sleep_hours NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own daily_logs" ON public.daily_logs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- habits
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  target_per_day INT DEFAULT 1,
  streak INT DEFAULT 0,
  xp INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own habits" ON public.habits FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- habit_logs
CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (habit_id, log_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_logs TO authenticated;
GRANT ALL ON public.habit_logs TO service_role;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own habit_logs" ON public.habit_logs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- meal_plans
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  plan JSONB NOT NULL,
  total_calories INT,
  total_protein_g NUMERIC,
  estimated_cost_ngn NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_plans TO authenticated;
GRANT ALL ON public.meal_plans TO service_role;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own meal_plans" ON public.meal_plans FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- workout_plans
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  plan JSONB NOT NULL,
  duration_min INT,
  estimated_calories INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_plans TO authenticated;
GRANT ALL ON public.workout_plans TO service_role;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workout_plans" ON public.workout_plans FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ceo_tasks
CREATE TABLE public.ceo_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  category TEXT,
  priority INT DEFAULT 1,
  is_done BOOLEAN DEFAULT false,
  deep_work BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ceo_tasks TO authenticated;
GRANT ALL ON public.ceo_tasks TO service_role;
ALTER TABLE public.ceo_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ceo_tasks" ON public.ceo_tasks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai_conversations
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai_conversations" ON public.ai_conversations FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai_messages
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai_messages" ON public.ai_messages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger reuses existing touch_updated_at()
CREATE TRIGGER trg_health_profiles_updated BEFORE UPDATE ON public.health_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_daily_logs_updated BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_habits_updated BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ceo_tasks_updated BEFORE UPDATE ON public.ceo_tasks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ai_conversations_updated BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, log_date DESC);
CREATE INDEX idx_habit_logs_habit_date ON public.habit_logs(habit_id, log_date DESC);
CREATE INDEX idx_meal_plans_user_date ON public.meal_plans(user_id, plan_date DESC);
CREATE INDEX idx_workout_plans_user_date ON public.workout_plans(user_id, plan_date DESC);
CREATE INDEX idx_ceo_tasks_user_date ON public.ceo_tasks(user_id, task_date DESC);
CREATE INDEX idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at ASC);
