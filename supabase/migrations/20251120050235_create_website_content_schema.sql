/*
  # Create Website Content Management Schema

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `category` (text) - e.g., 'Getting Started', 'Billing', 'Features'
      - `question` (text)
      - `answer` (text)
      - `order_index` (integer) - for manual ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `case_studies`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_company` (text)
      - `customer_role` (text)
      - `customer_photo_url` (text)
      - `industry` (text)
      - `challenge` (text)
      - `solution` (text)
      - `results` (jsonb) - array of metric objects with label and value
      - `testimonial` (text)
      - `featured` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_role` (text)
      - `customer_company` (text)
      - `customer_photo_url` (text)
      - `quote` (text)
      - `rating` (integer)
      - `featured` (boolean)
      - `created_at` (timestamptz)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `bio` (text)
      - `photo_url` (text)
      - `linkedin_url` (text)
      - `twitter_url` (text)
      - `order_index` (integer)
      - `is_founder` (boolean)
      - `created_at` (timestamptz)
    
    - `pricing_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price_monthly` (decimal)
      - `price_annual` (decimal)
      - `features` (jsonb) - array of feature strings
      - `is_popular` (boolean)
      - `order_index` (integer)
      - `cta_text` (text)
      - `created_at` (timestamptz)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `author_id` (uuid, references team_members)
      - `category` (text)
      - `tags` (text array)
      - `featured_image_url` (text)
      - `published` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text) - 'template', 'guide', 'video', 'webinar'
      - `file_url` (text)
      - `thumbnail_url` (text)
      - `category` (text)
      - `download_count` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Authenticated admin access for modifications
*/

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage FAQs"
  ON faqs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_company text NOT NULL,
  customer_role text NOT NULL,
  customer_photo_url text,
  industry text NOT NULL,
  challenge text NOT NULL,
  solution text NOT NULL,
  results jsonb DEFAULT '[]'::jsonb,
  testimonial text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case studies"
  ON case_studies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_role text NOT NULL,
  customer_company text NOT NULL,
  customer_photo_url text,
  quote text NOT NULL,
  rating integer DEFAULT 5,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  photo_url text,
  linkedin_url text,
  twitter_url text,
  order_index integer DEFAULT 0,
  is_founder boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pricing Plans Table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price_monthly decimal(10,2) NOT NULL,
  price_annual decimal(10,2) NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  is_popular boolean DEFAULT false,
  order_index integer DEFAULT 0,
  cta_text text DEFAULT 'Get Started',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing plans"
  ON pricing_plans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage pricing plans"
  ON pricing_plans FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES team_members(id),
  category text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  featured_image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_order ON pricing_plans(order_index);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);