/**
 * OpenAI Sora Video Generation Module
 * 
 * Generates videos using OpenAI Sora 2 API
 */

import OpenAI from 'openai';
import type { BrandProfile } from './brand-extractor';
import type { BrandDNA } from '../types/database';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export interface GeneratedVideo {
    id: string;
    url: string;
    prompt: string;
    thumbnailUrl?: string; // OpenAI doesn't always return thumbnails yet
    metadata: {
        duration: string;
        style?: string;
        provider: 'sora' | 'minimax' | 'kling' | 'veo';
        aspectRatio?: string;
        createdAt: string;
    };
}

/**
 * Generate a brand video using OpenAI Sora 2
 */
export async function generateVideoWithVeo(
    prompt: string,
    brandProfile: BrandProfile,
    brandName: string,
    brandDNA?: BrandDNA,
    userId?: string,
    brandId?: string,
    aspectRatio?: 'landscape' | 'portrait' | 'square'
): Promise<GeneratedVideo> {
    if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    // Build the enhanced prompt using the user's strategy
    const enhancedPrompt = buildStrategicVideoPrompt(prompt, brandProfile, brandDNA, brandName);
    console.log('Generating video with Sora strategy prompt:', enhancedPrompt);

    const orgId = import.meta.env.VITE_OPENAI_ORG_ID;
    const projectId = import.meta.env.VITE_OPENAI_PROJECT_ID;

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };
    if (orgId) headers['OpenAI-Organization'] = orgId;
    if (projectId) headers['OpenAI-Project'] = projectId;

    // Determine size based on aspect ratio
    // Sora 2 Preview often defaults to 1280x720. Vertical support is limited but we'll try standard resolutions.
    let size = '1280x720';
    if (aspectRatio === 'portrait') {
        size = '720x1280'; // Attempt vertical
    } else if (aspectRatio === 'square') {
        size = '1024x1024'; // Attempt square
    }

    try {
        // 1. Create Video Generation Job
        // Note: As of early 2025, the Node SDK structure for Sora might be `openai.video.generations.create` 
        // or effectively a direct API call if not fully typed yet. 
        // We will use a direct fetch pattern if the SDK method is not available, or assume standard SDK structure.
        // Given current SDK trends, we'll try to use the raw fetch for "sora-2" to be safe with preview features.

        const response = await fetch('https://api.openai.com/v1/videos', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: 'sora-2', // or 'sora-2-pro'
                prompt: enhancedPrompt,
                size: size,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${error?.error?.message || response.statusText}`);
        }

        const data = await response.json();

        // Asynchronous Workflow Handling
        // If the API returns a 'processing' status or a job ID, we must poll.
        // Assuming OpenAI Video API returns a specific job object.
        let videoUrl = data.url;
        let generationId = data.id;
        let status = data.status || 'completed'; // If it returns directly (unlikely for video)

        if (status !== 'completed' && generationId) {
            videoUrl = await pollForVideoCompletion(generationId, apiKey, orgId, projectId);
        }

        if (!videoUrl) {
            throw new Error('No video URL returned from OpenAI Sora.');
        }

        // If we have a blob URL and user details, upload to storage for persistent public access
        if (videoUrl.startsWith('blob:') && userId && brandId) {
            try {
                console.log(`Attempting to upload video for User ${userId}, Brand ${brandId}...`);
                const { uploadFile } = await import('./storage');

                // Fetch the blob data
                const response = await fetch(videoUrl);
                const blob = await response.blob();

                // Create file from blob
                const timestamp = Date.now();
                const file = new File([blob], `sora-${timestamp}.mp4`, { type: 'video/mp4' });

                // Upload
                const { url } = await uploadFile(file, userId, brandId);
                console.log('Video uploaded successfully:', url);
                videoUrl = url;

            } catch (uploadError: any) {
                console.error('Failed to upload video to storage:', uploadError);
                // CRITICAL: Throw this error so the user knows upload failed, rather than returning a blob URL that breaks n8n
                throw new Error(`Video generated but upload failed: ${uploadError.message || uploadError}`);
            }
        } else {
            console.log('Skipping upload. Missing details:', { isBlob: videoUrl.startsWith('blob:'), hasUserId: !!userId, hasBrandId: !!brandId });
            if (videoUrl.startsWith('blob:')) {
                throw new Error('Cannot upload video: Missing User ID or Brand ID (User: ' + userId + ', Brand: ' + brandId + ')');
            }
        }

        return {
            id: `sora_vid_${Date.now()}`,
            url: videoUrl,
            prompt: enhancedPrompt,
            metadata: {
                duration: "10s", // Sora 2 default is often shorter, but we requested... actually API doesn't confirm duration in request often.
                style: "Cinematic Strategy",
                provider: 'sora',
                aspectRatio: "16:9",
                createdAt: new Date().toISOString()
            }
        };

    } catch (error: any) {
        console.error('Error generating video with Sora:', error);
        throw new Error(`Failed to generate video: ${error?.message || 'Unknown error'}`);
    }
}

/**
 * Poll OpenAI API for video completion
 */
async function pollForVideoCompletion(
    id: string,
    key: string,
    orgId?: string,
    projectId?: string
): Promise<string> {
    const maxAttempts = 60; // 2 minutes (assuming 2s interval)
    let attempts = 0;

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${key}`
    };
    if (orgId) headers['OpenAI-Organization'] = orgId;
    if (projectId) headers['OpenAI-Project'] = projectId;

    while (attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s

        const response = await fetch(`https://api.openai.com/v1/videos/${id}`, {
            headers
        });

        if (!response.ok) continue;

        const data = await response.json();

        // Check for various completion states and response shapes
        if (data.status === 'completed' || data.status === 'succeeded') {
            // Check possible URL locations based on API variations
            const url = data.url ||
                data.output?.url ||
                data.data?.[0]?.url ||
                data.result?.url;

            if (url) return url;

            // If status is completed but no URL found, assume we need to fetch the content binary
            console.log('Sora status completed. URL not found in metadata, fetching content binary from /content endpoint...');

            try {
                // Use local proxy to bypass CORS
                const contentResponse = await fetch(`/openai-proxy/videos/${id}/content`, {
                    headers
                });

                if (!contentResponse.ok) {
                    throw new Error(`Failed to fetch video content: ${contentResponse.statusText}`);
                }

                const blob = await contentResponse.blob();
                const objectUrl = URL.createObjectURL(blob);
                return objectUrl;
            } catch (contentError: any) {
                console.error('Error fetching video content:', contentError);
                throw new Error(`Video completed but failed to download content: ${contentError.message}`);
            }
        } else if (data.status === 'failed' || data.status === 'rejected') {
            throw new Error(`Video generation failed: ${data.error?.message || 'Unknown error'}`);
        }

        // Continue polling if 'processing', 'queued', 'pending'
    }

    throw new Error('Video generation timed out.');
}

function buildStrategicVideoPrompt(
    basePrompt: string,
    brandProfile: BrandProfile,
    brandDNA: BrandDNA | undefined,
    brandName: string
): string {
    // Extract Brand DNA elements
    const brandColors = brandDNA?.dna_data?.visual_identity?.color_palette?.primary?.join(', ') || 'neutral, professional';
    const visualStyle = brandDNA?.dna_data?.visual_identity?.image_style_guide?.mood || 'modern, clean';
    const tone = brandDNA?.dna_data?.voice?.tone_descriptors?.join(', ') || 'professional, trustworthy';
    const industry = brandProfile.industry || 'Business';

    // Construct the prompt using the user's specific strategy
    return `Create a high-quality, cinematic 10-second video for ${brandName} (${industry}).
    
    CRITICAL VISUAL STRATEGY:
    
    1. HOOK (0-2s):
    - Immediate visual movement.
    - Theme: ${basePrompt}
    - Style: ${visualStyle}
    - Must feel relevant to the target customer.
    
    2. VALUE MOMENT (2-8s):
    - Showcase the brand's essence.
    - Use real-world imagery, natural motion, and pacing.
    - Reinforce trust and clarity.
    
    3. BRAND ANCHOR (8-10s):
    - Subtle branding integration.
    - Colors: ${brandColors} (Used subtly and tastefully).
    - Tone: ${tone}.
    - Soft call-to-action energy.

    VISUAL DIRECTION:
    - Real people, real environments, natural lighting.
    - Cinematic camera: Slow pans, soft zooms, depth of field.
    - NO stocky or cartoonish looks.
    - NO text overlays (unless critical).
    - Premium, native LinkedIn video feel.
    
    CONTEXT:
    The video is about: ${basePrompt}
    `;
}
