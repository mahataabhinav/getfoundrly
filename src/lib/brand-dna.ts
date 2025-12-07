/**
 * BrandDNA Service Layer
 * 
 * High-level service functions for BrandDNA operations including
 * creation, updates, versioning, and provenance tracking.
 */

import { 
  createBrandDNA, 
  getBrandDNA as getBrandDNAFromDB, 
  updateBrandDNAByBrandId,
  getBrandDNAList,
  getBrandDNAVersions,
  getBrand,
} from './database';
import { extractBrandDNA } from './brand-extractor';
import type { 
  BrandDNA, 
  BrandDNAData, 
  BrandDNAProvenance, 
  BrandDNAVersion,
  BrandDNAUpdate,
} from '../types/database';

// Re-export getBrandDNA for convenience
export { getBrandDNAFromDB as getBrandDNA };

/**
 * Create BrandDNA from website extraction
 */
export async function createBrandDNAFromExtraction(
  brandId: string,
  userId: string,
  websiteName: string,
  websiteUrl: string
): Promise<BrandDNA> {
  // Check if BrandDNA already exists
  const existing = await getBrandDNAFromDB(brandId);
  if (existing) {
    throw new Error('BrandDNA already exists for this brand. Use reCrawlBrandDNA to update.');
  }

  // Extract BrandDNA data
  const { dnaData, provenance } = await extractBrandDNA(websiteName, websiteUrl);

  // Calculate completion score
  const completionScore = calculateCompletionScore(dnaData);

  // Create BrandDNA record
  const brandDNA = await createBrandDNA({
    brand_id: brandId,
    user_id: userId,
    status: completionScore >= 70 ? 'complete' : 'needs_review',
    completion_score: completionScore,
    dna_data: dnaData,
    provenance,
    versions: [],
    last_crawled_at: new Date().toISOString(),
  });

  return brandDNA;
}

/**
 * Re-crawl and update BrandDNA, returning diff for review
 */
export async function reCrawlBrandDNA(
  brandId: string
): Promise<{ brandDNA: BrandDNA; diff: Record<string, { old: any; new: any }> }> {
  const existing = await getBrandDNAFromDB(brandId);
  if (!existing) {
    throw new Error('BrandDNA not found. Use createBrandDNAFromExtraction instead.');
  }

  const brand = await getBrand(brandId);
  if (!brand) {
    throw new Error('Brand not found');
  }

  // Extract new BrandDNA data
  const { dnaData: newDnaData, provenance: newProvenance } = await extractBrandDNA(
    brand.name,
    brand.website_url
  );

  // Calculate diff
  const diff = calculateDiff(existing.dna_data, newDnaData);

  // Create new version entry
  const newVersion: BrandDNAVersion = {
    version_id: crypto.randomUUID(),
    date: new Date().toISOString(),
    diff_summary: `Re-crawl: ${Object.keys(diff).length} fields changed`,
    author: existing.user_id,
    changes: diff,
  };

  // Calculate new completion score
  const completionScore = calculateCompletionScore(newDnaData);

  // Update BrandDNA (but don't merge yet - user will review diff)
  const updated = await updateBrandDNAByBrandId(brandId, {
    dna_data: newDnaData,
    provenance: newProvenance,
    versions: [...existing.versions, newVersion],
    completion_score: completionScore,
    last_crawled_at: new Date().toISOString(),
    status: 'needs_review', // Mark as needs review after re-crawl
  });

  return {
    brandDNA: updated,
    diff,
  };
}

/**
 * Approve a field (mark as verified by user)
 */
export async function approveField(
  brandId: string,
  fieldPath: string
): Promise<BrandDNA> {
  const existing = await getBrandDNAFromDB(brandId);
  if (!existing) {
    throw new Error('BrandDNA not found');
  }

  // Update provenance for this field
  const updatedProvenance = existing.provenance.map(p => {
    if (p.field === fieldPath) {
      return {
        ...p,
        trust_score: 100, // User verified = 100% confidence
        edited_by: existing.user_id,
        extraction_method: 'user' as const,
        last_updated: new Date().toISOString(),
      };
    }
    return p;
  });

  // If field not in provenance, add it
  if (!updatedProvenance.find(p => p.field === fieldPath)) {
    updatedProvenance.push({
      field: fieldPath,
      source_url: existing.provenance[0]?.source_url || '',
      last_updated: new Date().toISOString(),
      trust_score: 100,
      edited_by: existing.user_id,
      extraction_method: 'user',
    });
  }

  return await updateBrandDNAByBrandId(brandId, {
    provenance: updatedProvenance,
  });
}

/**
 * Update BrandDNA field with provenance tracking
 */
export async function updateBrandDNAField(
  brandId: string,
  fieldPath: string,
  value: any
): Promise<BrandDNA> {
  const existing = await getBrandDNAFromDB(brandId);
  if (!existing) {
    throw new Error('BrandDNA not found');
  }

  // Update the field in dna_data using dot notation
  const updatedData = { ...existing.dna_data };
  setNestedField(updatedData, fieldPath, value);

  // Update provenance
  const updatedProvenance = existing.provenance.filter(p => p.field !== fieldPath);
  updatedProvenance.push({
    field: fieldPath,
    source_url: existing.provenance[0]?.source_url || '',
    last_updated: new Date().toISOString(),
    trust_score: 100, // User edit = 100% confidence
    edited_by: existing.user_id,
    extraction_method: 'user',
  });

  // Create version entry
  const oldValue = getNestedField(existing.dna_data, fieldPath);
  const newVersion: BrandDNAVersion = {
    version_id: crypto.randomUUID(),
    date: new Date().toISOString(),
    diff_summary: `Field updated: ${fieldPath}`,
    author: existing.user_id,
    changes: {
      [fieldPath]: { old: oldValue, new: value },
    },
  };

  // Recalculate completion score
  const completionScore = calculateCompletionScore(updatedData);

  return await updateBrandDNAByBrandId(brandId, {
    dna_data: updatedData,
    provenance: updatedProvenance,
    versions: [...existing.versions, newVersion],
    completion_score: completionScore,
    status: completionScore >= 70 ? 'complete' : existing.status,
  });
}

/**
 * Get BrandDNA version by version ID
 */
export async function getBrandDNAVersion(
  brandId: string,
  versionId: string
): Promise<BrandDNAVersion | null> {
  const versions = await getBrandDNAVersions(brandId);
  return versions.find(v => v.version_id === versionId) || null;
}

/**
 * Calculate completion score based on filled fields (0-100)
 */
function calculateCompletionScore(dnaData: BrandDNAData): number {
  const sections = [
    'identity',
    'voice',
    'messaging',
    'products',
    'audience',
    'proof',
    'visual_identity',
    'creative_guidelines',
    'seo',
    'competitive',
    'compliance',
  ];

  let filledSections = 0;
  let totalFields = 0;
  let filledFields = 0;

  sections.forEach(section => {
    const sectionData = (dnaData as any)[section];
    if (sectionData && typeof sectionData === 'object') {
      const fields = Object.keys(sectionData);
      totalFields += fields.length;
      const filled = fields.filter(key => {
        const value = sectionData[key];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== null && value !== undefined && value !== '';
      });
      filledFields += filled.length;
      if (filled.length > 0) filledSections++;
    }
  });

  // Weight: 40% sections filled, 60% fields filled
  const sectionScore = (filledSections / sections.length) * 40;
  const fieldScore = totalFields > 0 ? (filledFields / totalFields) * 60 : 0;

  return Math.round(sectionScore + fieldScore);
}

/**
 * Calculate diff between old and new BrandDNA data
 */
function calculateDiff(
  oldData: BrandDNAData,
  newData: BrandDNAData
): Record<string, { old: any; new: any }> {
  const diff: Record<string, { old: any; new: any }> = {};

  const compareObjects = (oldObj: any, newObj: any, path: string = '') => {
    if (typeof oldObj !== typeof newObj) {
      diff[path] = { old: oldObj, new: newObj };
      return;
    }

    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
        diff[path] = { old: oldObj, new: newObj };
      }
      return;
    }

    if (typeof oldObj === 'object' && oldObj !== null && newObj !== null) {
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      allKeys.forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        if (!(key in oldObj)) {
          diff[newPath] = { old: undefined, new: newObj[key] };
        } else if (!(key in newObj)) {
          diff[newPath] = { old: oldObj[key], new: undefined };
        } else {
          compareObjects(oldObj[key], newObj[key], newPath);
        }
      });
    } else if (oldObj !== newObj) {
      diff[path] = { old: oldObj, new: newObj };
    }
  };

  compareObjects(oldData, newData);
  return diff;
}

/**
 * Set nested field using dot notation
 */
function setNestedField(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
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

