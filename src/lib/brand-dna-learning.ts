/**
 * BrandDNA Learning Module
 * 
 * Handles continuous learning from user interactions, content performance,
 * and document uploads to improve BrandDNA over time.
 */

import { getBrandDNA, updateBrandDNAByBrandId } from './database';
import type { BrandDNA, BrandDNAData } from '../types/database';

/**
 * Update BrandDNA based on content performance metrics
 * Higher performing content styles get weighted more in future generations
 */
export async function updateFromContentPerformance(
  brandId: string,
  contentId: string,
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagement_rate?: number;
  }
): Promise<void> {
  const brandDNA = await getBrandDNA(brandId);
  if (!brandDNA) return;

  const interactionHistory = brandDNA.dna_data.interaction_history || {
    post_performance: [],
    favorite_post_styles: [],
    content_calendar_preferences: {},
  };

  // Add performance data
  if (!interactionHistory.post_performance) {
    interactionHistory.post_performance = [];
  }

  interactionHistory.post_performance.push({
    post_id: contentId,
    platform: 'linkedin', // Could be dynamic
    metrics,
    date: new Date().toISOString(),
  });

  // Update favorite styles based on high performance
  const highPerformanceThreshold = 1000; // views
  if (metrics.views && metrics.views > highPerformanceThreshold) {
    // Extract post style from content metadata (would need content item)
    // For now, just track that this was a high performer
    if (!interactionHistory.favorite_post_styles) {
      interactionHistory.favorite_post_styles = [];
    }
    // In future, extract actual style from content metadata
  }

  await updateBrandDNAByBrandId(brandId, {
    dna_data: {
      ...brandDNA.dna_data,
      interaction_history: interactionHistory,
    },
  });
}

/**
 * Update BrandDNA from user edits
 * User edits increase field weight for content generation
 */
export async function updateFromUserEdits(
  brandId: string,
  fieldPath: string,
  value: any
): Promise<void> {
  // This is handled by updateBrandDNAField in brand-dna.ts
  // This function exists for future learning enhancements
  // e.g., tracking which fields users edit most often
  const brandDNA = await getBrandDNA(brandId);
  if (!brandDNA) return;

  // Could track edit frequency, patterns, etc.
  // For now, the provenance system handles this
}

/**
 * Suggest field updates based on active learning
 * If model is unsure about a claim, surface questions to user
 */
export async function suggestFieldUpdates(brandId: string): Promise<Array<{
  field: string;
  currentValue: any;
  suggestedValue: any;
  confidence: number;
  reason: string;
}>> {
  const brandDNA = await getBrandDNA(brandId);
  if (!brandDNA) return [];

  const suggestions: Array<{
    field: string;
    currentValue: any;
    suggestedValue: any;
    confidence: number;
    reason: string;
  }> = [];

  // Check provenance for low-confidence fields
  brandDNA.provenance.forEach(p => {
    if (p.trust_score < 50 && p.extraction_method === 'auto') {
      const currentValue = getNestedField(brandDNA.dna_data, p.field);
      suggestions.push({
        field: p.field,
        currentValue,
        suggestedValue: currentValue, // Would be enhanced with AI suggestions
        confidence: p.trust_score,
        reason: `Low confidence extraction (${p.trust_score}%). Please verify.`,
      });
    }
  });

  return suggestions;
}

/**
 * Parse uploaded document (PDF, brand deck, press release) and extract BrandDNA
 * This would integrate with document parsing service
 */
export async function parseUploadedDocument(
  brandId: string,
  documentUrl: string,
  documentType: 'brand_deck' | 'press_release' | 'brand_guidelines' | 'other'
): Promise<{
  extractedFields: Record<string, any>;
  suggestions: Array<{ field: string; value: any; confidence: number }>;
}> {
  // This is a placeholder for future document parsing integration
  // Would use OpenAI vision API or document parsing service
  
  const brandDNA = await getBrandDNA(brandId);
  if (!brandDNA) {
    throw new Error('BrandDNA not found');
  }

  // Placeholder: In production, this would:
  // 1. Download/access document from URL
  // 2. Parse text/images from document
  // 3. Use AI to extract BrandDNA fields
  // 4. Return extracted fields with confidence scores

  return {
    extractedFields: {},
    suggestions: [],
  };
}

/**
 * Get nested field using dot notation
 */
function getNestedField(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

