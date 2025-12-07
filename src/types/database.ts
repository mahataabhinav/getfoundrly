/**
 * Database Type Definitions
 * 
 * TypeScript interfaces matching the Supabase database schema
 */

export type PostType = 
  | 'thought-leadership'
  | 'authority'
  | 'storytelling'
  | 'value-tips'
  | 'case-study'
  | 'announcement'
  | 'event'
  | 'trending'
  | 'carousel';

export type ContentType = 
  | 'linkedin_post'
  | 'newsletter'
  | 'instagram_ad'
  | 'blog_post';

export type Platform = 
  | 'linkedin'
  | 'email'
  | 'instagram'
  | 'web';

export type ContentStatus = 
  | 'generated'
  | 'edited'
  | 'scheduled'
  | 'published'
  | 'failed';

export type AssetType = 
  | 'image'
  | 'video';

export type ScheduleStatus = 
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'cancelled';

export type ConnectionStatus = 
  | 'connected'
  | 'disconnected'
  | 'error';

export type BrandDNAStatus = 
  | 'complete'
  | 'needs_review'
  | 'in_progress';

// BrandDNA Section Interfaces
export interface BrandDNAIdentity {
  official_name?: string;
  domains?: string[];
  tagline?: string;
  elevator_pitch?: string;
  year_founded?: number;
  headquarters?: string;
  legal_entity?: string;
  company_size?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  linkedin_bio?: string;
  sources?: Array<{ field: string; url: string }>;
}

export interface BrandDNAVoice {
  tone_descriptors?: string[];
  examples?: {
    micro_hook?: string;
    short_post?: string;
  };
  forbidden_words?: string[];
  preferred_emojis?: string[];
  punctuation_rules?: string;
  tone_intensity?: 'subtle' | 'neutral' | 'emphatic';
  last_updated?: string;
  trust_provenance?: string;
}

export interface BrandDNAMessaging {
  value_props?: Array<{
    text: string;
    proof?: string;
    source?: string;
  }>;
  pillars?: string[];
  target_problems?: string[];
  elevator_benefits?: Record<string, string>; // audience-specific variants
}

export interface BrandDNAProduct {
  name: string;
  description: string;
  pricing_model?: string;
  differentiators?: string[];
  product_url?: string;
  screenshot_url?: string;
  logo_url?: string;
}

export interface BrandDNAPersona {
  name: string;
  role: string;
  pain_points: string[];
  goals: string[];
  channels: string[];
  preferred_messaging?: string;
}

export interface BrandDNAAudience {
  primary_segments?: string[];
  personas?: BrandDNAPersona[];
}

export interface BrandDNAProof {
  metrics?: Array<{
    label: string;
    value: string;
    source_url?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    attribution: string;
    source_url?: string;
  }>;
  case_studies?: Array<{
    problem: string;
    solution: string;
    result: string;
    source_url?: string;
  }>;
  press_mentions?: Array<{
    title: string;
    excerpt: string;
    url: string;
  }>;
  awards?: Array<{
    name: string;
    year?: number;
    url?: string;
  }>;
  compliance_badges?: string[];
}

export interface BrandDNAVisualIdentity {
  logos?: Array<{
    url: string;
    variant: 'light' | 'dark' | 'default';
    format: 'svg' | 'png';
  }>;
  color_palette?: {
    primary?: string[];
    secondary?: string[];
    hex_codes?: Record<string, string>;
    use_cases?: Record<string, string>;
  };
  typography?: {
    font_families?: string[];
    font_substitutes?: string[];
  };
  usage_rules?: {
    clear_space?: string;
    minimal_sizes?: string;
  };
  image_style_guide?: {
    photography_vs_illustration?: string;
    mood?: string;
    filters?: string;
  };
  example_imagery?: string[];
  alt_text_guidelines?: string;
  default_alt_text_templates?: string[];
}

export interface BrandDNACreativeGuidelines {
  post_length_preferences?: 'short' | 'medium' | 'long' | 'mixed';
  preferred_formats?: string[];
  cta_style?: string;
  cta_grammar_rules?: string;
  hashtag_strategy?: {
    branded_hashtags?: string[];
    banned_hashtags?: string[];
  };
  accessibility_rules?: {
    contrast_ratio?: string;
    alt_text_required?: boolean;
  };
}

export interface BrandDNASEO {
  top_keywords?: string[];
  semantic_clusters?: string[];
  negative_keywords?: string[];
  suggested_hashtags?: Record<string, string[]>; // keyword to hashtags mapping
}

export interface BrandDNACompetitive {
  top_competitors?: Array<{
    name: string;
    differentiation?: string;
  }>;
  market_trends?: string[];
  positioning_statement?: string;
}

export interface BrandDNACompliance {
  allowed_claims?: string[];
  restricted_claims?: string[];
  required_disclaimers?: string[];
  ip_trademark_notes?: string;
}

export interface BrandDNAInteractionHistory {
  post_performance?: Array<{
    post_id: string;
    platform: string;
    metrics: Record<string, number>;
    date: string;
  }>;
  favorite_post_styles?: string[];
  content_calendar_preferences?: {
    cadence?: string;
    best_days?: string[];
    best_times?: string[];
  };
}

export interface BrandDNAData {
  identity?: BrandDNAIdentity;
  voice?: BrandDNAVoice;
  messaging?: BrandDNAMessaging;
  products?: BrandDNAProduct[];
  audience?: BrandDNAAudience;
  proof?: BrandDNAProof;
  visual_identity?: BrandDNAVisualIdentity;
  creative_guidelines?: BrandDNACreativeGuidelines;
  seo?: BrandDNASEO;
  competitive?: BrandDNACompetitive;
  compliance?: BrandDNACompliance;
  interaction_history?: BrandDNAInteractionHistory;
}

export interface BrandDNAProvenance {
  field: string; // dot-notation path like "identity.tagline"
  source_url?: string;
  last_updated: string;
  trust_score: number; // 0-100
  edited_by?: string; // user_id if user edited
  extraction_method?: 'auto' | 'user' | 'hybrid';
}

export interface BrandDNAVersion {
  version_id: string;
  date: string;
  diff_summary: string;
  author: string; // user_id
  changes?: Record<string, { old: any; new: any }>;
}

// Database Table Types
export interface Brand {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  brand_tone?: string | null;
  brand_summary?: string | null;
  primary_keywords?: string[] | null;
  logo_url?: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  user_id: string;
  brand_id: string;
  type: ContentType;
  platform: Platform;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  excerpt?: string | null;
  media_url?: string | null;
  media_type?: string | null;
  source_website_url?: string | null;
  status: ContentStatus;
  ai_model?: string | null;
  ai_prompt?: string | null;
  ai_output_raw?: string | null;
  metadata: Record<string, any>;
  // New fields for LinkedIn posts
  post_type?: string | null;
  topic?: string | null;
  context_details?: string | null;
  post_type_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  user_id: string;
  brand_id: string;
  content_id?: string | null;
  asset_type: AssetType;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  thumbnail_path?: string | null;
  label?: string | null;
  is_suggested: boolean;
  is_attached: boolean;
  order_index?: number | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CarouselSlide {
  id: string;
  content_id: string;
  slide_number: number;
  title?: string | null;
  body?: string | null;
  media_asset_id?: string | null;
  storage_path?: string | null;
  media_type?: 'image' | 'video' | null;
  order_index: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  brand_id: string;
  platform: Platform;
  external_account_id?: string | null;
  display_name?: string | null;
  status: ConnectionStatus;
  last_synced_at?: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LinkedInOAuthToken {
  id: string;
  connection_id: string;
  user_id: string;
  brand_id: string;
  access_token_encrypted: string;
  refresh_token_encrypted?: string | null;
  token_expires_at: string;
  refresh_token_expires_at?: string | null;
  oauth_scopes: string[];
  linkedin_user_id: string;
  linkedin_profile_url?: string | null;
  profile_name?: string | null;
  profile_picture_url?: string | null;
  company_page_id?: string | null;
  company_page_name?: string | null;
  last_token_refresh_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentSchedule {
  id: string;
  content_id: string;
  user_id: string;
  brand_id: string;
  platform: Platform;
  scheduled_at: string;
  timezone: string;
  status: ScheduleStatus;
  published_at?: string | null;
  external_post_id?: string | null;
  ai_recommended: boolean;
  ai_recommendation_score?: number | null;
  ai_recommendation_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostTypeCatalog {
  id: string;
  title: string;
  description?: string | null;
  icon_name?: string | null;
  color_gradient?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandDNA {
  id: string;
  brand_id: string;
  user_id: string;
  status: BrandDNAStatus;
  completion_score: number;
  dna_data: BrandDNAData;
  provenance: BrandDNAProvenance[];
  versions: BrandDNAVersion[];
  created_at: string;
  updated_at: string;
  last_crawled_at?: string | null;
}

// Insert Types (for creating new records)
export type BrandInsert = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;
export type ContentItemInsert = Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>;
export type MediaAssetInsert = Omit<MediaAsset, 'id' | 'created_at' | 'updated_at'>;
export type CarouselSlideInsert = Omit<CarouselSlide, 'id' | 'created_at' | 'updated_at'>;
export type ConnectionInsert = Omit<Connection, 'id' | 'created_at' | 'updated_at'>;
export type LinkedInOAuthTokenInsert = Omit<LinkedInOAuthToken, 'id' | 'created_at' | 'updated_at'>;
export type ContentScheduleInsert = Omit<ContentSchedule, 'id' | 'created_at' | 'updated_at'>;
export type BrandDNAInsert = Omit<BrandDNA, 'id' | 'created_at' | 'updated_at'>;

// Update Types (for updating records)
export type BrandUpdate = Partial<Omit<Brand, 'id' | 'user_id' | 'created_at'>>;
export type ContentItemUpdate = Partial<Omit<ContentItem, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type MediaAssetUpdate = Partial<Omit<MediaAsset, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type CarouselSlideUpdate = Partial<Omit<CarouselSlide, 'id' | 'content_id' | 'created_at'>>;
export type ConnectionUpdate = Partial<Omit<Connection, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type LinkedInOAuthTokenUpdate = Partial<Omit<LinkedInOAuthToken, 'id' | 'connection_id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type ContentScheduleUpdate = Partial<Omit<ContentSchedule, 'id' | 'content_id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type BrandDNAUpdate = Partial<Omit<BrandDNA, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;


