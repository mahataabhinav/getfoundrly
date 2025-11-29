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

// Insert Types (for creating new records)
export type BrandInsert = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;
export type ContentItemInsert = Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>;
export type MediaAssetInsert = Omit<MediaAsset, 'id' | 'created_at' | 'updated_at'>;
export type CarouselSlideInsert = Omit<CarouselSlide, 'id' | 'created_at' | 'updated_at'>;
export type ConnectionInsert = Omit<Connection, 'id' | 'created_at' | 'updated_at'>;
export type LinkedInOAuthTokenInsert = Omit<LinkedInOAuthToken, 'id' | 'created_at' | 'updated_at'>;
export type ContentScheduleInsert = Omit<ContentSchedule, 'id' | 'created_at' | 'updated_at'>;

// Update Types (for updating records)
export type BrandUpdate = Partial<Omit<Brand, 'id' | 'user_id' | 'created_at'>>;
export type ContentItemUpdate = Partial<Omit<ContentItem, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type MediaAssetUpdate = Partial<Omit<MediaAsset, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type CarouselSlideUpdate = Partial<Omit<CarouselSlide, 'id' | 'content_id' | 'created_at'>>;
export type ConnectionUpdate = Partial<Omit<Connection, 'id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type LinkedInOAuthTokenUpdate = Partial<Omit<LinkedInOAuthToken, 'id' | 'connection_id' | 'user_id' | 'brand_id' | 'created_at'>>;
export type ContentScheduleUpdate = Partial<Omit<ContentSchedule, 'id' | 'content_id' | 'user_id' | 'brand_id' | 'created_at'>>;


