/**
 * Database Helper Functions
 * 
 * CRUD operations for LinkedIn post generator tables
 */

import { supabase } from './supabase';
import type {
  Brand,
  BrandInsert,
  BrandUpdate,
  ContentItem,
  ContentItemInsert,
  ContentItemUpdate,
  MediaAsset,
  MediaAssetInsert,
  MediaAssetUpdate,
  CarouselSlide,
  CarouselSlideInsert,
  CarouselSlideUpdate,
  Connection,
  ConnectionInsert,
  ConnectionUpdate,
  ContentSchedule,
  ContentScheduleInsert,
  ContentScheduleUpdate,
  LinkedInOAuthToken,
  LinkedInOAuthTokenInsert,
  LinkedInOAuthTokenUpdate,
  PostTypeCatalog,
} from '../types/database';

// =====================================================
// BRANDS
// =====================================================

export async function createBrand(data: BrandInsert): Promise<Brand> {
  const { data: brand, error } = await supabase
    .from('brands')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return brand;
}

export async function getBrand(id: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getBrandsByUser(userId: string): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateBrand(id: string, updates: BrandUpdate): Promise<Brand> {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findOrCreateBrand(userId: string, name: string, websiteUrl: string): Promise<Brand> {
  // Try to find existing brand
  const { data: existing } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .eq('website_url', websiteUrl)
    .single();

  if (existing) return existing;

  // Create new brand
  return createBrand({
    user_id: userId,
    name,
    website_url: websiteUrl,
    metadata: {},
  });
}

// =====================================================
// CONTENT ITEMS
// =====================================================

export async function createContentItem(data: ContentItemInsert): Promise<ContentItem> {
  const { data: content, error } = await supabase
    .from('content_items')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return content;
}

export async function getContentItem(id: string): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getContentItemsByUser(userId: string, type?: string): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function updateContentItem(id: string, updates: ContentItemUpdate): Promise<ContentItem> {
  const { data, error } = await supabase
    .from('content_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// MEDIA ASSETS
// =====================================================

export async function createMediaAsset(data: MediaAssetInsert): Promise<MediaAsset> {
  const { data: asset, error } = await supabase
    .from('media_assets')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return asset;
}

export async function getMediaAssetsByContent(contentId: string): Promise<MediaAsset[]> {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('content_id', contentId)
    .eq('is_attached', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getSuggestedMediaAssets(brandId: string): Promise<MediaAsset[]> {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_suggested', true)
    .is('content_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function attachMediaToContent(mediaAssetId: string, contentId: string): Promise<MediaAsset> {
  const { data, error } = await supabase
    .from('media_assets')
    .update({
      content_id: contentId,
      is_attached: true,
      is_suggested: false,
    })
    .eq('id', mediaAssetId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMediaAsset(id: string, updates: MediaAssetUpdate): Promise<MediaAsset> {
  const { data, error } = await supabase
    .from('media_assets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// CAROUSEL SLIDES
// =====================================================

export async function createCarouselSlide(data: CarouselSlideInsert): Promise<CarouselSlide> {
  const { data: slide, error } = await supabase
    .from('carousel_slides')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return slide;
}

export async function createCarouselSlides(slides: CarouselSlideInsert[]): Promise<CarouselSlide[]> {
  const { data, error } = await supabase
    .from('carousel_slides')
    .insert(slides)
    .select();

  if (error) throw error;
  return data || [];
}

export async function getCarouselSlidesByContent(contentId: string): Promise<CarouselSlide[]> {
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .eq('content_id', contentId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateCarouselSlide(id: string, updates: CarouselSlideUpdate): Promise<CarouselSlide> {
  const { data, error } = await supabase
    .from('carousel_slides')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCarouselSlidesByContent(contentId: string): Promise<void> {
  const { error } = await supabase
    .from('carousel_slides')
    .delete()
    .eq('content_id', contentId);

  if (error) throw error;
}

// =====================================================
// CONNECTIONS
// =====================================================

export async function createConnection(data: ConnectionInsert): Promise<Connection> {
  const { data: connection, error } = await supabase
    .from('connections')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return connection;
}

export async function getConnectionByBrandAndPlatform(
  brandId: string,
  platform: string
): Promise<Connection | null> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('brand_id', brandId)
    .eq('platform', platform)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function findOrCreateConnection(
  userId: string,
  brandId: string,
  platform: string
): Promise<Connection> {
  const existing = await getConnectionByBrandAndPlatform(brandId, platform);
  if (existing) return existing;

  return createConnection({
    user_id: userId,
    brand_id: brandId,
    platform: platform as any,
    status: 'connected',
    metadata: {},
  });
}

export async function updateConnection(
  id: string,
  updates: ConnectionUpdate
): Promise<Connection> {
  const { data, error } = await supabase
    .from('connections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// LINKEDIN OAUTH TOKENS
// =====================================================

export async function createLinkedInOAuthToken(
  data: LinkedInOAuthTokenInsert
): Promise<LinkedInOAuthToken> {
  const { data: token, error } = await supabase
    .from('linkedin_oauth_tokens')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return token;
}

export async function getLinkedInOAuthTokenByConnection(
  connectionId: string
): Promise<LinkedInOAuthToken | null> {
  const { data, error } = await supabase
    .from('linkedin_oauth_tokens')
    .select('*')
    .eq('connection_id', connectionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getValidLinkedInToken(
  brandId: string
): Promise<LinkedInOAuthToken | null> {
  const { data, error } = await supabase
    .from('linkedin_oauth_tokens')
    .select('*, connections!inner(status)')
    .eq('brand_id', brandId)
    .gt('token_expires_at', new Date().toISOString())
    .eq('connections.status', 'connected')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateLinkedInOAuthToken(
  id: string,
  updates: LinkedInOAuthTokenUpdate
): Promise<LinkedInOAuthToken> {
  const { data, error } = await supabase
    .from('linkedin_oauth_tokens')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// CONTENT SCHEDULES
// =====================================================

export async function createContentSchedule(
  data: ContentScheduleInsert
): Promise<ContentSchedule> {
  const { data: schedule, error } = await supabase
    .from('content_schedules')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return schedule;
}

export async function getContentSchedule(id: string): Promise<ContentSchedule | null> {
  const { data, error } = await supabase
    .from('content_schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getScheduledContent(limit = 10): Promise<ContentSchedule[]> {
  const { data, error } = await supabase
    .from('content_schedules')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function updateContentSchedule(
  id: string,
  updates: ContentScheduleUpdate
): Promise<ContentSchedule> {
  const { data, error } = await supabase
    .from('content_schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// POST TYPE CATALOG
// =====================================================

export async function getPostTypes(): Promise<PostTypeCatalog[]> {
  const { data, error } = await supabase
    .from('post_type_catalog')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });

  if (error) throw error;
  return data || [];
}


