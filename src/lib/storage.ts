/**
 * Supabase Storage Helper Functions
 * 
 * Functions for uploading and managing media files in Supabase Storage
 */

import { supabase } from './supabase';
import { createMediaAsset, type MediaAssetInsert } from './database';

const STORAGE_BUCKET = 'media-assets';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  userId: string,
  brandId: string,
  contentId?: string
): Promise<{ path: string; url: string }> {
  // Generate file path
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = contentId
    ? `${userId}/${brandId}/${contentId}/${timestamp}-${sanitizedFileName}`
    : `${userId}/${brandId}/${timestamp}-${sanitizedFileName}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: urlData.publicUrl,
  };
}

/**
 * Upload a file and create a media asset record
 */
export async function uploadMediaAsset(
  file: File,
  userId: string,
  brandId: string,
  options: {
    label?: string;
    contentId?: string;
    isSuggested?: boolean;
    isAttached?: boolean;
    orderIndex?: number;
  } = {}
): Promise<{ asset: any; url: string }> {
  const { path, url } = await uploadFile(file, userId, brandId, options.contentId);

  // Determine asset type from file
  const assetType = file.type.startsWith('image/') ? 'image' : 'video';

  // Create media asset record
  const assetData: MediaAssetInsert = {
    user_id: userId,
    brand_id: brandId,
    content_id: options.contentId || null,
    asset_type: assetType,
    storage_bucket: STORAGE_BUCKET,
    storage_path: path,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
    label: options.label || null,
    is_suggested: options.isSuggested ?? false,
    is_attached: options.isAttached ?? false,
    order_index: options.orderIndex || null,
    metadata: {},
  };

  const asset = await createMediaAsset(assetData);

  return { asset, url };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) throw error;
}

/**
 * Get public URL for a storage path
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Ensure storage bucket exists and has proper policies
 * Note: This should be run once during setup
 */
export async function ensureStorageBucket(): Promise<void> {
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) throw listError;

  const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);

  if (!bucketExists) {
    // Note: Creating buckets requires admin privileges
    // This should be done via Supabase dashboard or admin API
    console.warn(`Storage bucket "${STORAGE_BUCKET}" does not exist. Please create it in Supabase dashboard.`);
  }
}


