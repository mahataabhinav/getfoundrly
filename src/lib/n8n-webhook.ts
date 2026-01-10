/**
 * Utility functions for sending data to n8n webhook
 * 
 * NOTE: These webhooks are OPTIONAL and only used for analytics/tracking purposes.
 * They are non-blocking and will not affect core functionality if they fail or are not configured.
 * 
 * Since we're using Firecrawl API directly (via MCP), n8n is not required for core functionality.
 * You can safely remove or disable these webhook calls if you don't need analytics.
 */

interface WebsiteInputData {
  websiteName: string;
  websiteUrl: string;
  userId?: string;
  brandId?: string;
  timestamp?: string;
}

interface PostTypeSelectionData {
  postType: string;
  postTypeTitle: string;
  websiteName: string;
  websiteUrl: string;
}

/**
 * Sends website input data to n8n webhook
 * @param data - Website input data to send
 * @returns Promise that resolves when the request is complete
 */
export async function sendWebsiteDataToN8n(data: WebsiteInputData): Promise<void> {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    console.warn('N8N webhook URL not configured. Skipping webhook call.');
    return;
  }

  try {
    const payload = {
      websiteName: data.websiteName,
      websiteUrl: data.websiteUrl,
      userId: data.userId || null,
      brandId: data.brandId || null,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook request failed with status ${response.status}`);
    }

    console.log('Website data sent to n8n successfully');
  } catch (error) {
    // Log error but don't throw - we don't want to block the user flow
    console.error('Error sending data to n8n webhook:', error);
  }
}

/**
 * Sends post type selection data to webhook endpoint
 * @param data - Post type selection data to send
 * @returns Promise that resolves when the request is complete
 * 
 * NOTE: This is optional and only used for analytics/tracking.
 * If VITE_N8N_POST_TYPE_WEBHOOK_URL is not set, the call is skipped.
 */
export async function sendPostTypeSelectionToN8n(data: PostTypeSelectionData): Promise<void> {
  // Only send if webhook URL is explicitly configured
  const webhookUrl = import.meta.env.VITE_N8N_POST_TYPE_WEBHOOK_URL;

  if (!webhookUrl) {
    // Silently skip if not configured - this is optional analytics only
    return;
  }

  try {
    const payload = {
      postType: data.postType,
      postTypeTitle: data.postTypeTitle,
      websiteName: data.websiteName,
      websiteUrl: data.websiteUrl,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    console.log('Post type selection sent successfully');
  } catch (error) {
    // Log error but don't throw - we don't want to block the user flow
    // This is optional analytics, so failures are non-critical
    console.warn('Failed to send post type selection to webhook (non-critical):', error);
  }
}


export interface PublishToN8nPayload {
  userId: string;
  brandId: string;
  content: string;
  images?: string[];
  mediaType?: 'image' | 'video' | 'none';
  mediaUrls?: string[];
  imageUrl?: string; // Simple string URL for single image
  videoUrl?: string; // Simple string URL for single video
  scheduledAt?: string;
  platform: 'linkedin';
  metadata?: any;
}

/**
 * Sends the final post content to n8n for publishing/scheduling
 * @param data - The post data to publish
 * @returns Promise that resolves if the webhook received the data successfully
 */
export async function sendPostToN8n(data: PublishToN8nPayload): Promise<void> {
  // const webhookUrl = import.meta.env.VITE_N8N_PUBLISH_WEBHOOK_URL;
  const webhookUrl = 'https://foundrly.app.n8n.cloud/webhook-test/linkedin-post';

  // if (!webhookUrl) {
  //   throw new Error('N8N Publish Webhook URL is not configured (VITE_N8N_PUBLISH_WEBHOOK_URL)');
  // }

  try {
    const payload = {
      ...data,
      mediaType: data.mediaType || 'none',
      mediaUrls: data.mediaUrls || data.images || [],
      // Ensure we send a simple imageUrl if available, or extract from array
      imageUrl: (data.mediaType === 'image' || !data.mediaType) ? (data.imageUrl || (data.mediaUrls && data.mediaUrls.length > 0 ? data.mediaUrls[0] : null)) : null,
      videoUrl: data.mediaType === 'video' ? (data.mediaUrls && data.mediaUrls.length > 0 ? data.mediaUrls[0] : null) : null,
      timestamp: new Date().toISOString(),
      source: 'foundrly-app',
    };

    console.log('Preparing to send post to n8n...');
    console.log('Target URL:', webhookUrl);
    console.log('Payload:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Try to get error details from response
      const errorText = await response.text();
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log('Post sent to n8n successfully');
  } catch (error) {
    console.error('Failed to send post to n8n:', error);
    throw error; // Rethrow to let the UI handle the error state
  }
}

export interface LinkedInAnalyticsInput {
  userId: string;
  linkedinAccessToken: string;
  organizationId?: string;
  timeRange: 'last_30_days' | 'last_7_days' | 'last_90_days' | 'last_365_days';
}

export interface LinkedInAnalyticsResponse {
  success: boolean;
  data: {
    summary: {
      totalImpressions: number;
      totalEngagements: number;
      totalFollowers: number;
      engagementRate: string;
      followerGrowth: number;
      totalPosts: number;
    };
    charts: {
      impressionsOverTime: Array<{ date: string; value: number }>;
      engagementsByType: Array<{ type: string; value: number }>;
      followerGrowth: Array<{ date: string; value: number }>;
      engagementTrends: Array<{ date: string; value: number }>;
    };
    topPosts: Array<{
      id: string;
      content: string;
      metrics: {
        likes: number;
        comments: number;
        shares: number;
        impressions: number;
      };
      postedAt: string;
    }>;
    profile: any;
    organization: any;
    aiInsights: {
      insights: string[];
      bestPostingTimes: string[];
      contentTypeRecommendations: Record<string, string>;
      growthTrend: string;
    };
  };
  timestamp: string;
}

/**
 * Fetches LinkedIn analytics via n8n webhook
 * @param data - Input data containing user ID and access token
 * @returns Promise that resolves with analytics data
 */
export async function fetchLinkedInAnalytics(data: LinkedInAnalyticsInput): Promise<LinkedInAnalyticsResponse> {
  // Use the specific analytics webhook URL if defined, otherwise fall back to a default pattern or error
  const analyticsWebhookUrl = "https://amahata96.app.n8n.cloud/webhook/linkedin-analytics";

  try {
    console.log('Fetching analytics from n8n...');

    // Create a timeout controller to abort if it takes too long (e.g., 30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(analyticsWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analytics request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

export interface PublishInstagramToN8nPayload {
  userId: string;
  brandId: string;
  caption: string;
  videoUrl?: string; // For Reels
  imageUrl?: string; // For Image posts
  mediaType: 'video' | 'image' | 'carousel';
  timestamp?: string;
}

/**
 * Sends Instagram Ad content to n8n for publishing/scheduling
 */
export async function sendInstagramPostToN8n(data: PublishInstagramToN8nPayload): Promise<void> {
  // Placeholder URL - User needs to configure this in .env or we use a default test endpoint
  const webhookUrl = import.meta.env.VITE_N8N_INSTAGRAM_WEBHOOK_URL || 'https://foundrly.app.n8n.cloud/webhook-test/instagram-post';

  try {
    const payload = {
      ...data,
      platform: 'instagram',
      timestamp: new Date().toISOString(),
      source: 'foundrly-app',
    };

    console.log('Preparing to send Instagram post to n8n...');
    console.log('Target URL:', webhookUrl);
    console.log('Payload:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log('Instagram post sent to n8n successfully');
  } catch (error) {
    console.error('Failed to send Instagram post to n8n:', error);
    throw error;
  }
}
