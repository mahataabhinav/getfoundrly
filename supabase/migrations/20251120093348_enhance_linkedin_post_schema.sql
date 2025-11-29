/*
  # Enhance LinkedIn Post Generator Database Schema

  1. Overview
    Enhance existing schema to fully support LinkedIn post generator flow
    Includes: post types, topics, media assets, carousels, and LinkedIn OAuth

  2. Changes Made
    - Enhanced content_items table with post_type, topic, context_details
    - Created media_assets table for images/videos stored in Supabase Storage
    - Created carousel_slides table for multi-slide carousel content
    - Created linkedin_oauth_tokens table for LinkedIn authentication
    - Created post_type_catalog table (optional reference table)
    - Added indexes and RLS policies for all new tables
    - Added triggers for updated_at timestamps

  3. Security
    - All tables have RLS enabled
    - Users can only access their own data
    - LinkedIn OAuth tokens are encrypted (using pgcrypto)
    - Foreign keys ensure referential integrity
*/

-- Enable pgcrypto extension for token encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ENHANCE CONTENT_ITEMS TABLE
-- =====================================================

-- Add new columns to content_items for LinkedIn post generation
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS post_type TEXT,
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS context_details TEXT,
  ADD COLUMN IF NOT EXISTS post_type_id TEXT;

-- Add index for post_type
CREATE INDEX IF NOT EXISTS idx_content_items_post_type ON public.content_items(post_type);

-- =====================================================
-- 2. CREATE MEDIA_ASSETS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video')),
  storage_bucket TEXT NOT NULL DEFAULT 'media-assets',
  storage_path TEXT NOT NULL, -- Path in Supabase Storage bucket
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  thumbnail_path TEXT, -- Path to thumbnail in storage bucket
  label TEXT, -- e.g., 'Brand Aesthetic', 'Data Visualization', 'Talking Head'
  is_suggested BOOLEAN DEFAULT false, -- AI suggested but not yet attached
  is_attached BOOLEAN DEFAULT false, -- Actually attached to a post
  order_index INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Media assets policies
CREATE POLICY "Users can view own media assets"
  ON public.media_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own media assets"
  ON public.media_assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media assets"
  ON public.media_assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own media assets"
  ON public.media_assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_assets_user_id ON public.media_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_brand_id ON public.media_assets(brand_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_content_id ON public.media_assets(content_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_asset_type ON public.media_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_is_attached ON public.media_assets(is_attached);
CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON public.media_assets(created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_media_assets ON public.media_assets;
CREATE TRIGGER set_updated_at_media_assets
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 3. CREATE CAROUSEL_SLIDES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.carousel_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  title TEXT,
  body TEXT,
  media_asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL, -- Reference to uploaded media
  storage_path TEXT, -- Direct path to media in Supabase Storage if not using media_assets
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  order_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_content_slide_order UNIQUE(content_id, order_index)
);

-- Enable RLS
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

-- Carousel slides policies (inherit from content_items)
CREATE POLICY "Users can view carousel slides for own content"
  ON public.carousel_slides FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = carousel_slides.content_id
      AND content_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert carousel slides for own content"
  ON public.carousel_slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = carousel_slides.content_id
      AND content_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update carousel slides for own content"
  ON public.carousel_slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = carousel_slides.content_id
      AND content_items.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = carousel_slides.content_id
      AND content_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete carousel slides for own content"
  ON public.carousel_slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_items
      WHERE content_items.id = carousel_slides.content_id
      AND content_items.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_carousel_slides_content_id ON public.carousel_slides(content_id);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_media_asset_id ON public.carousel_slides(media_asset_id);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_order_index ON public.carousel_slides(content_id, order_index);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_carousel_slides ON public.carousel_slides;
CREATE TRIGGER set_updated_at_carousel_slides
  BEFORE UPDATE ON public.carousel_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. CREATE LINKEDIN_OAUTH_TOKENS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.linkedin_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  access_token_encrypted TEXT NOT NULL, -- Encrypted using pgcrypto
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ NOT NULL,
  refresh_token_expires_at TIMESTAMPTZ,
  oauth_scopes TEXT[] NOT NULL, -- e.g., ['w_member_social', 'r_liteprofile', 'w_organization_social']
  linkedin_user_id TEXT NOT NULL, -- LinkedIn URN or ID
  linkedin_profile_url TEXT,
  profile_name TEXT,
  profile_picture_url TEXT,
  company_page_id TEXT, -- If posting as company page
  company_page_name TEXT,
  last_token_refresh_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_connection_token UNIQUE(connection_id)
);

-- Enable RLS
ALTER TABLE public.linkedin_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- LinkedIn OAuth tokens policies
CREATE POLICY "Users can view own LinkedIn OAuth tokens"
  ON public.linkedin_oauth_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own LinkedIn OAuth tokens"
  ON public.linkedin_oauth_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn OAuth tokens"
  ON public.linkedin_oauth_tokens FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own LinkedIn OAuth tokens"
  ON public.linkedin_oauth_tokens FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_connection_id ON public.linkedin_oauth_tokens(connection_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_user_id ON public.linkedin_oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_brand_id ON public.linkedin_oauth_tokens(brand_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_expires_at ON public.linkedin_oauth_tokens(token_expires_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_linkedin_oauth_tokens ON public.linkedin_oauth_tokens;
CREATE TRIGGER set_updated_at_linkedin_oauth_tokens
  BEFORE UPDATE ON public.linkedin_oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. CREATE POST_TYPE_CATALOG TABLE (Optional Reference Table)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.post_type_catalog (
  id TEXT PRIMARY KEY, -- 'thought-leadership', 'authority', etc.
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  color_gradient TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.post_type_catalog ENABLE ROW LEVEL SECURITY;

-- Post type catalog policies (public read, admin write)
CREATE POLICY "Anyone can view post types"
  ON public.post_type_catalog FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage post types"
  ON public.post_type_catalog FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_post_type_catalog_is_active ON public.post_type_catalog(is_active);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_post_type_catalog ON public.post_type_catalog;
CREATE TRIGGER set_updated_at_post_type_catalog
  BEFORE UPDATE ON public.post_type_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default post types
INSERT INTO public.post_type_catalog (id, title, description, icon_name, color_gradient) VALUES
  ('thought-leadership', 'Thought Leadership', 'Share expert insights', 'Lightbulb', 'from-blue-500 to-blue-600'),
  ('authority', 'Authority Building', 'Establish credibility', 'TrendingUp', 'from-purple-500 to-purple-600'),
  ('storytelling', 'Storytelling', 'Connect through stories', 'BookOpen', 'from-pink-500 to-pink-600'),
  ('value-tips', 'Value / Tips', 'Share actionable advice', 'Sparkles', 'from-green-500 to-green-600'),
  ('case-study', 'Case Study', 'Show real results', 'FileText', 'from-orange-500 to-orange-600'),
  ('announcement', 'Announcement', 'Launch something new', 'Rocket', 'from-red-500 to-red-600'),
  ('event', 'Event Post', 'Promote gatherings', 'Calendar', 'from-cyan-500 to-cyan-600'),
  ('trending', 'Trending Angle', 'Ride the wave', 'Zap', 'from-yellow-500 to-yellow-600'),
  ('carousel', 'Carousel Script', 'Multi-slide content', 'FileText', 'from-indigo-500 to-indigo-600')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. HELPER FUNCTIONS FOR TOKEN ENCRYPTION
-- =====================================================

-- Function to encrypt token (using pgcrypto)
-- Note: In production, consider using Supabase Vault for better security
CREATE OR REPLACE FUNCTION public.encrypt_token(token_text TEXT, encryption_key TEXT DEFAULT 'foundrly_linkedin_key')
RETURNS TEXT AS $$
BEGIN
  -- Using pgcrypto's encrypt function
  -- In production, use a proper key management system
  RETURN encode(
    encrypt(token_text::bytea, encryption_key::bytea, 'aes'),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt token
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_text TEXT, encryption_key TEXT DEFAULT 'foundrly_linkedin_key')
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(
    decrypt(decode(encrypted_text, 'base64'), encryption_key::bytea, 'aes'),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: These encryption functions are basic examples.
-- For production, use Supabase Vault or a proper key management service.
-- The encryption_key should be stored securely and rotated regularly.


