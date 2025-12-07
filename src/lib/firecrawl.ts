/**
 * Firecrawl API Integration Service
 * 
 * Provides comprehensive website scraping and crawling capabilities
 * including images, videos, and structured content extraction.
 */

import FirecrawlApp from '@mendable/firecrawl-js';

// Get Firecrawl API key from environment
const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;

// Initialize Firecrawl client
const firecrawl = apiKey ? new FirecrawlApp({ apiKey }) : null;

if (!apiKey) {
  console.warn('⚠️ VITE_FIRECRAWL_API_KEY is not set. Firecrawl features will not work. Add it to your .env file.');
}

export interface FirecrawlScrapeResult {
  success: boolean;
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    author?: string;
    publisher?: string;
    image?: string;
    logo?: string;
    [key: string]: any;
  };
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  videos?: Array<{
    url: string;
    title?: string;
    thumbnail?: string;
  }>;
  links?: Array<{
    url: string;
    text?: string;
  }>;
  error?: string;
}

export interface FirecrawlCrawlResult {
  success: boolean;
  pages?: Array<{
    url: string;
    markdown?: string;
    html?: string;
    metadata?: Record<string, any>;
    images?: Array<{ url: string; alt?: string }>;
    videos?: Array<{ url: string; title?: string }>;
  }>;
  error?: string;
}

/**
 * Scrape a single website URL using Firecrawl
 * Extracts content, images, videos, and metadata
 */
export async function scrapeWebsite(
  url: string,
  options?: {
    includeTags?: string[];
    excludeTags?: string[];
    onlyMainContent?: boolean;
    waitFor?: number;
  }
): Promise<FirecrawlScrapeResult> {
  if (!firecrawl) {
    return {
      success: false,
      error: 'Firecrawl API key is not configured',
    };
  }

  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Scrape the website
    const scrapeResponse = await firecrawl.scrapeUrl(normalizedUrl, {
      formats: ['markdown', 'html', 'links'],
      onlyMainContent: options?.onlyMainContent ?? true,
      includeTags: options?.includeTags,
      excludeTags: options?.excludeTags,
      waitFor: options?.waitFor,
    });

    if (!scrapeResponse || !scrapeResponse.success) {
      return {
        success: false,
        error: scrapeResponse?.error || 'Failed to scrape website',
      };
    }

    // Extract images from the response
    const images: Array<{ url: string; alt?: string; caption?: string }> = [];
    if (scrapeResponse.markdown) {
      // Extract image markdown syntax: ![alt](url)
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      while ((match = imageRegex.exec(scrapeResponse.markdown)) !== null) {
        images.push({
          url: match[2],
          alt: match[1] || undefined,
        });
      }
    }

    // Extract videos (common video embed patterns)
    const videos: Array<{ url: string; title?: string; thumbnail?: string }> = [];
    if (scrapeResponse.html) {
      // Extract video URLs from iframe src attributes
      const videoIframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = videoIframeRegex.exec(scrapeResponse.html)) !== null) {
        videos.push({
          url: match[1],
        });
      }
    }

    return {
      success: true,
      markdown: scrapeResponse.markdown || '',
      html: scrapeResponse.html || '',
      metadata: scrapeResponse.metadata || {},
      images,
      videos,
      links: scrapeResponse.links?.map((link: any) => ({
        url: link.url || link,
        text: link.text,
      })) || [],
    };
  } catch (error: any) {
    console.error('Firecrawl scrape error:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred while scraping',
    };
  }
}

/**
 * Crawl a website comprehensively using Firecrawl
 * Crawls multiple pages to get comprehensive brand information
 */
export async function crawlWebsite(
  url: string,
  options?: {
    maxPages?: number;
    maxDepth?: number;
    includePaths?: string[];
    excludePaths?: string[];
    allowExternalLinks?: boolean;
  }
): Promise<FirecrawlCrawlResult> {
  if (!firecrawl) {
    return {
      success: false,
      error: 'Firecrawl API key is not configured',
    };
  }

  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Start crawl job
    const crawlResponse = await firecrawl.crawlUrl(normalizedUrl, {
      limit: options?.maxPages || 10,
      maxDepth: options?.maxDepth || 2,
      includePaths: options?.includePaths,
      excludePaths: options?.excludePaths,
      allowExternalLinks: options?.allowExternalLinks || false,
      scrapeOptions: {
        formats: ['markdown', 'html', 'links'],
        onlyMainContent: true,
      },
    });

    if (!crawlResponse || !crawlResponse.success) {
      return {
        success: false,
        error: crawlResponse?.error || 'Failed to crawl website',
      };
    }

    // Process crawled pages
    const pages = crawlResponse.data?.map((page: any) => {
      const images: Array<{ url: string; alt?: string }> = [];
      if (page.markdown) {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = imageRegex.exec(page.markdown)) !== null) {
          images.push({
            url: match[2],
            alt: match[1] || undefined,
          });
        }
      }

      const videos: Array<{ url: string; title?: string }> = [];
      if (page.html) {
        const videoIframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let match;
        while ((match = videoIframeRegex.exec(page.html)) !== null) {
          videos.push({
            url: match[1],
          });
        }
      }

      return {
        url: page.url || page.sourceURL || '',
        markdown: page.markdown || '',
        html: page.html || '',
        metadata: page.metadata || {},
        images,
        videos,
      };
    }) || [];

    return {
      success: true,
      pages,
    };
  } catch (error: any) {
    console.error('Firecrawl crawl error:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred while crawling',
    };
  }
}

/**
 * Extract comprehensive website data using Firecrawl
 * Combines scraping and crawling for best results
 */
export async function extractWebsiteData(
  url: string,
  options?: {
    useCrawl?: boolean;
    maxPages?: number;
    maxDepth?: number;
  }
): Promise<{
  success: boolean;
  content?: string;
  markdown?: string;
  html?: string;
  metadata?: Record<string, any>;
  images?: Array<{ url: string; alt?: string }>;
  videos?: Array<{ url: string; title?: string }>;
  pages?: Array<{
    url: string;
    markdown?: string;
    metadata?: Record<string, any>;
  }>;
  error?: string;
}> {
  // If crawl is requested, use crawl; otherwise use scrape
  if (options?.useCrawl) {
    const crawlResult = await crawlWebsite(url, {
      maxPages: options?.maxPages || 10,
      maxDepth: options?.maxDepth || 2,
      includePaths: ['/about', '/products', '/features', '/blog', '/pricing'],
      excludePaths: ['/privacy', '/terms', '/legal'],
    });

    if (!crawlResult.success) {
      // Fallback to scrape if crawl fails
      const scrapeResult = await scrapeWebsite(url);
      return {
        success: scrapeResult.success,
        content: scrapeResult.markdown,
        markdown: scrapeResult.markdown,
        html: scrapeResult.html,
        metadata: scrapeResult.metadata,
        images: scrapeResult.images,
        videos: scrapeResult.videos,
        error: scrapeResult.error,
      };
    }

    // Combine all crawled pages into a single content string
    const combinedMarkdown = crawlResult.pages
      ?.map((page) => {
        const pageHeader = `\n\n## Page: ${page.url}\n\n`;
        return pageHeader + (page.markdown || '');
      })
      .join('\n\n---\n\n') || '';

    // Aggregate images and videos from all pages
    const allImages = crawlResult.pages?.flatMap((page) => page.images || []) || [];
    const allVideos = crawlResult.pages?.flatMap((page) => page.videos || []) || [];

    return {
      success: true,
      content: combinedMarkdown,
      markdown: combinedMarkdown,
      metadata: crawlResult.pages?.[0]?.metadata || {},
      images: allImages,
      videos: allVideos,
      pages: crawlResult.pages?.map((page) => ({
        url: page.url,
        markdown: page.markdown,
        metadata: page.metadata,
      })),
    };
  } else {
    // Use simple scrape
    const scrapeResult = await scrapeWebsite(url, {
      onlyMainContent: true,
    });

    return {
      success: scrapeResult.success,
      content: scrapeResult.markdown,
      markdown: scrapeResult.markdown,
      html: scrapeResult.html,
      metadata: scrapeResult.metadata,
      images: scrapeResult.images,
      videos: scrapeResult.videos,
      error: scrapeResult.error,
    };
  }
}

/**
 * Check if Firecrawl is available
 */
export function isFirecrawlAvailable(): boolean {
  return firecrawl !== null && apiKey !== undefined && apiKey !== '';
}

