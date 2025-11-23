/*
  # Fix Security and Performance Issues

  1. Performance Fixes
    - Optimize RLS policies to use (select auth.uid()) instead of auth.uid()
    - This prevents re-evaluation of auth.uid() for each row
    - Add missing index for dashboard_summaries.top_content_id foreign key

  2. Security Fixes
    - Fix function search_path to be immutable and secure
    - Use SET search_path = public, pg_temp for all functions

  3. Impact
    - Improves query performance at scale
    - Enhances security of database functions
    - Ensures foreign key lookups are optimized
*/

-- =====================================================
-- 1. ADD MISSING INDEX FOR FOREIGN KEY
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_dashboard_summaries_top_content_id 
  ON public.dashboard_summaries(top_content_id);

-- =====================================================
-- 2. FIX RLS POLICIES - PROFILES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 3. FIX RLS POLICIES - BRANDS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own brands" ON public.brands;
CREATE POLICY "Users can view own brands"
  ON public.brands FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own brands" ON public.brands;
CREATE POLICY "Users can insert own brands"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own brands" ON public.brands;
CREATE POLICY "Users can update own brands"
  ON public.brands FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own brands" ON public.brands;
CREATE POLICY "Users can delete own brands"
  ON public.brands FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 4. FIX RLS POLICIES - CONNECTIONS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own connections" ON public.connections;
CREATE POLICY "Users can view own connections"
  ON public.connections FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own connections" ON public.connections;
CREATE POLICY "Users can insert own connections"
  ON public.connections FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own connections" ON public.connections;
CREATE POLICY "Users can update own connections"
  ON public.connections FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own connections" ON public.connections;
CREATE POLICY "Users can delete own connections"
  ON public.connections FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 5. FIX RLS POLICIES - CONTENT_ITEMS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own content" ON public.content_items;
CREATE POLICY "Users can view own content"
  ON public.content_items FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own content" ON public.content_items;
CREATE POLICY "Users can insert own content"
  ON public.content_items FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own content" ON public.content_items;
CREATE POLICY "Users can update own content"
  ON public.content_items FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own content" ON public.content_items;
CREATE POLICY "Users can delete own content"
  ON public.content_items FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 6. FIX RLS POLICIES - CONTENT_SCHEDULES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own schedules" ON public.content_schedules;
CREATE POLICY "Users can view own schedules"
  ON public.content_schedules FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own schedules" ON public.content_schedules;
CREATE POLICY "Users can insert own schedules"
  ON public.content_schedules FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own schedules" ON public.content_schedules;
CREATE POLICY "Users can update own schedules"
  ON public.content_schedules FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own schedules" ON public.content_schedules;
CREATE POLICY "Users can delete own schedules"
  ON public.content_schedules FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 7. FIX RLS POLICIES - CONTENT_METRICS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view metrics for own content" ON public.content_metrics;
CREATE POLICY "Users can view metrics for own content"
  ON public.content_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = content_metrics.content_id
      AND content_items.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert metrics for own content" ON public.content_metrics;
CREATE POLICY "Users can insert metrics for own content"
  ON public.content_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = content_metrics.content_id
      AND content_items.user_id = (select auth.uid())
    )
  );

-- =====================================================
-- 8. FIX RLS POLICIES - DASHBOARD_SUMMARIES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own summaries" ON public.dashboard_summaries;
CREATE POLICY "Users can view own summaries"
  ON public.dashboard_summaries FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own summaries" ON public.dashboard_summaries;
CREATE POLICY "Users can insert own summaries"
  ON public.dashboard_summaries FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own summaries" ON public.dashboard_summaries;
CREATE POLICY "Users can update own summaries"
  ON public.dashboard_summaries FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own summaries" ON public.dashboard_summaries;
CREATE POLICY "Users can delete own summaries"
  ON public.dashboard_summaries FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 9. FIX FUNCTION SECURITY - SET SEARCH PATH
-- =====================================================

-- Recreate handle_updated_at with secure search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate handle_new_user with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate handle_display_name with secure search_path
CREATE OR REPLACE FUNCTION public.handle_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    IF NEW.raw_user_meta_data->>'display_name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{full_name}',
        to_jsonb(NEW.raw_user_meta_data->>'display_name')
      );
    ELSIF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{full_name}',
        to_jsonb(NEW.raw_user_meta_data->>'name')
      );
    ELSIF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{display_name}',
        to_jsonb(NEW.raw_user_meta_data->>'full_name')
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
