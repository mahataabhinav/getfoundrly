/*
  # Foundrly MVP Database Schema

  1. Overview
    Complete database schema for Foundrly content generation platform
    Supports LinkedIn posts, newsletters, Instagram ads, and blog posts
    Includes scheduling, analytics, and dashboard summaries

  2. Tables Created
    - profiles: User profile information
    - brands: User's brands/websites
    - connections: Platform integrations (LinkedIn, Instagram, Email, CMS)
    - content_items: All generated content (unified table)
    - content_schedules: Publishing schedules
    - content_metrics: Performance analytics
    - dashboard_summaries: Precomputed dashboard data

  3. Security
    - All tables have RLS enabled
    - Policies restrict access to user's own data
    - Foreign keys ensure referential integrity
    - CASCADE deletes for cleanup

  4. Features
    - Unified content table with type discrimination
    - JSONB metadata for platform-specific fields
    - Timestamp tracking for all records
    - AI recommendation scoring for schedules
    - Performance metrics for analytics
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- =====================================================
-- 2. BRANDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  brand_tone TEXT,
  brand_summary TEXT,
  primary_keywords TEXT[],
  logo_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Brands policies
CREATE POLICY "Users can view own brands"
  ON public.brands FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON public.brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON public.brands FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON public.brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_created_at ON public.brands(created_at DESC);

-- =====================================================
-- 3. CONNECTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin','instagram','email','cms')),
  external_account_id TEXT,
  display_name TEXT,
  status TEXT DEFAULT 'connected' NOT NULL CHECK (status IN ('connected','disconnected','error')),
  last_synced_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_brand_platform UNIQUE(brand_id, platform)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Connections policies
CREATE POLICY "Users can view own connections"
  ON public.connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON public.connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON public.connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON public.connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON public.connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_brand_id ON public.connections(brand_id);
CREATE INDEX IF NOT EXISTS idx_connections_platform ON public.connections(platform);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

-- =====================================================
-- 4. CONTENT_ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('linkedin_post','newsletter','instagram_ad','blog_post')),
  platform TEXT NOT NULL CHECK (platform IN ('linkedin','email','instagram','web')),
  title TEXT,
  subtitle TEXT,
  body TEXT,
  excerpt TEXT,
  media_url TEXT,
  media_type TEXT,
  source_website_url TEXT,
  status TEXT DEFAULT 'generated' NOT NULL CHECK (status IN ('generated','edited','scheduled','published','failed')),
  ai_model TEXT,
  ai_prompt TEXT,
  ai_output_raw TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Content items policies
CREATE POLICY "Users can view own content"
  ON public.content_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON public.content_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content"
  ON public.content_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON public.content_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON public.content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_brand_id ON public.content_items(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_platform ON public.content_items(platform);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON public.content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON public.content_items(created_at DESC);

-- =====================================================
-- 5. CONTENT_SCHEDULES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.content_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin','email','instagram','web')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled','publishing','published','failed','cancelled')),
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  ai_recommended BOOLEAN DEFAULT FALSE NOT NULL,
  ai_recommendation_score NUMERIC(5,2),
  ai_recommendation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.content_schedules ENABLE ROW LEVEL SECURITY;

-- Content schedules policies
CREATE POLICY "Users can view own schedules"
  ON public.content_schedules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON public.content_schedules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.content_schedules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.content_schedules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_schedules_user_id ON public.content_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_content_schedules_content_id ON public.content_schedules(content_id);
CREATE INDEX IF NOT EXISTS idx_content_schedules_brand_id ON public.content_schedules(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_schedules_platform ON public.content_schedules(platform);
CREATE INDEX IF NOT EXISTS idx_content_schedules_status ON public.content_schedules(status);
CREATE INDEX IF NOT EXISTS idx_content_schedules_scheduled_at ON public.content_schedules(scheduled_at);

-- =====================================================
-- 6. CONTENT_METRICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.content_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin','email','instagram','web')),
  snapshot_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  impressions BIGINT DEFAULT 0 NOT NULL,
  clicks BIGINT DEFAULT 0 NOT NULL,
  likes BIGINT DEFAULT 0 NOT NULL,
  comments BIGINT DEFAULT 0 NOT NULL,
  shares BIGINT DEFAULT 0 NOT NULL,
  saves BIGINT DEFAULT 0 NOT NULL,
  reactions BIGINT DEFAULT 0 NOT NULL,
  video_views BIGINT DEFAULT 0 NOT NULL,
  ctr NUMERIC(6,4),
  open_rate NUMERIC(5,2),
  click_rate NUMERIC(5,2),
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;

-- Content metrics policies
CREATE POLICY "Users can view metrics for own content"
  ON public.content_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = content_metrics.content_id
      AND content_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert metrics for own content"
  ON public.content_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = content_metrics.content_id
      AND content_items.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_metrics_content_id ON public.content_metrics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_metrics_platform ON public.content_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_content_metrics_snapshot_at ON public.content_metrics(snapshot_at DESC);

-- =====================================================
-- 7. DASHBOARD_SUMMARIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.dashboard_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('7d','30d','90d')),
  visibility_score NUMERIC(5,2),
  top_content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_clicks BIGINT DEFAULT 0 NOT NULL,
  avg_engagement_rate NUMERIC(6,4),
  keyword_opportunities JSONB DEFAULT '[]'::jsonb NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_brand_period UNIQUE(user_id, brand_id, period)
);

-- Enable RLS
ALTER TABLE public.dashboard_summaries ENABLE ROW LEVEL SECURITY;

-- Dashboard summaries policies
CREATE POLICY "Users can view own summaries"
  ON public.dashboard_summaries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries"
  ON public.dashboard_summaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own summaries"
  ON public.dashboard_summaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own summaries"
  ON public.dashboard_summaries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_summaries_user_id ON public.dashboard_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_summaries_brand_id ON public.dashboard_summaries(brand_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_summaries_period ON public.dashboard_summaries(period);
CREATE INDEX IF NOT EXISTS idx_dashboard_summaries_generated_at ON public.dashboard_summaries(generated_at DESC);

-- =====================================================
-- 8. HELPER FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_brands ON public.brands;
CREATE TRIGGER set_updated_at_brands
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_connections ON public.connections;
CREATE TRIGGER set_updated_at_connections
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_content_items ON public.content_items;
CREATE TRIGGER set_updated_at_content_items
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_content_schedules ON public.content_schedules;
CREATE TRIGGER set_updated_at_content_schedules
  BEFORE UPDATE ON public.content_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
