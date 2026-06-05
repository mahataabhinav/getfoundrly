/**
 * Onboarding Service
 *
 * Functions to check and manage user onboarding status
 */

import { getBrandsByUser, getBrandDNA } from './database';
import type { BrandDNA } from '../types/database';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  needsBrandDNA: boolean;
  currentStep?: 'brand_creation' | 'brand_dna_extraction';
  brandId?: string;
  brandDNA?: BrandDNA | null;
}

/**
 * Check if user has completed onboarding (has Brand DNA)
 */
export async function checkUserOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  // Check if user has any brands
  const brands = await getBrandsByUser(userId);

  if (!brands || brands.length === 0) {
    return {
      hasCompletedOnboarding: false,
      needsBrandDNA: true,
      currentStep: 'brand_creation'
    };
  }

  // Check if first brand has Brand DNA
  const brandDNA = await getBrandDNA(brands[0].id);

  // User is considered onboarded if they have a brand
  // Even if Brand DNA is incomplete, allow dashboard access
  return {
    hasCompletedOnboarding: true,
    needsBrandDNA: !brandDNA || (brandDNA.completion_score ?? 0) < 50,
    brandId: brands[0].id,
    brandDNA: brandDNA || null
  };
}
