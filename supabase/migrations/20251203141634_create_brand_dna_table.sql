/*
  # Create BrandDNA Table

  1. Overview
    Comprehensive brand knowledge base that stores extracted and user-edited brand information.
    Supports versioning, provenance tracking, and continuous learning from user interactions.

  2. Table Structure
    - Core fields: id, brand_id, user_id, status, completion_score
    - dna_data: JSONB field containing all BrandDNA sections
    - provenance: JSONB array tracking source URLs, trust scores, and edit history
    - versions: JSONB array for version history with diffs
    - Timestamps: created_at, updated_at, last_crawled_at

  3. Security
    - RLS enabled
    - Users can only access their own BrandDNA records
    - Foreign key to brands table with CASCADE delete
*/

-- =====================================================
-- BRAND_DNA TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.brand_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'needs_review' NOT NULL CHECK (status IN ('complete', 'needs_review', 'in_progress')),
  completion_score INTEGER DEFAULT 0 CHECK (completion_score >= 0 AND completion_score <= 100),
  
  -- Comprehensive BrandDNA data stored as JSONB
  dna_data JSONB DEFAULT '{
    "identity": {},
    "voice": {},
    "messaging": {},
    "products": [],
    "audience": {},
    "proof": {},
    "visual_identity": {},
    "creative_guidelines": {},
    "seo": {},
    "competitive": {},
    "compliance": {},
    "interaction_history": {}
  }'::jsonb NOT NULL,
  
  -- Provenance tracking: array of objects with field, source_url, last_updated, trust_score, edited_by
  provenance JSONB DEFAULT '[]'::jsonb NOT NULL,
  
  -- Version history: array of objects with version_id, date, diff_summary, author
  versions JSONB DEFAULT '[]'::jsonb NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_crawled_at TIMESTAMPTZ,
  
  -- Ensure one BrandDNA per brand
  CONSTRAINT unique_brand_dna UNIQUE(brand_id)
);

-- Enable RLS
ALTER TABLE public.brand_dna ENABLE ROW LEVEL SECURITY;

-- BrandDNA policies
CREATE POLICY "Users can view own brand DNA"
  ON public.brand_dna FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand DNA"
  ON public.brand_dna FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand DNA"
  ON public.brand_dna FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand DNA"
  ON public.brand_dna FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brand_dna_brand_id ON public.brand_dna(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_dna_user_id ON public.brand_dna(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_dna_status ON public.brand_dna(status);
CREATE INDEX IF NOT EXISTS idx_brand_dna_updated_at ON public.brand_dna(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_brand_dna_dna_data ON public.brand_dna USING GIN (dna_data);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brand_dna_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_brand_dna_updated_at
  BEFORE UPDATE ON public.brand_dna
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_dna_updated_at();

