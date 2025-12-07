import { useState } from 'react';
import { X, ArrowRight, Loader2, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { findOrCreateBrand, getBrandDNA } from '../../lib/database';
import { createBrandDNAFromExtraction } from '../../lib/brand-dna';
import BrandDNAPreview from './BrandDNAPreview';
import VoiceInput from '../VoiceInput';
import type { BrandDNA } from '../../types/database';

interface BrandDNAWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function BrandDNAWizard({ onComplete, onCancel }: BrandDNAWizardProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({ name: '', url: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [extractedBrandDNA, setExtractedBrandDNA] = useState<BrandDNA | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!brandData.name || !brandData.url) {
      setError('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Find or create brand
      const brand = await findOrCreateBrand(user.id, brandData.name, brandData.url);
      setBrandId(brand.id);

      // Check if BrandDNA already exists
      let brandDNA = await getBrandDNA(brand.id);
      
      if (!brandDNA) {
        // Create BrandDNA from extraction with Firecrawl
        setExtractionStatus('Scraping website with Firecrawl...');
        brandDNA = await createBrandDNAFromExtraction(brand.id, user.id, brandData.name, brandData.url);
        setExtractionStatus('');
      }

      setExtractedBrandDNA(brandDNA);
      setStep(2); // Show preview
    } catch (err: any) {
      console.error('Error creating BrandDNA:', err);
      setError(err.message || 'Failed to create BrandDNA. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (step === 2 && extractedBrandDNA) {
    return (
      <div className="space-y-6 max-h-[calc(100vh-200px)] flex flex-col">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">BrandDNA Extracted Successfully</h1>
          <p className="text-gray-600">Review the extracted brand information below</p>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200">
          <BrandDNAPreview 
            brandDNA={extractedBrandDNA}
            compact={true}
            onViewFull={() => {
              // Navigate to full profile view - this would need to be handled by parent
              onComplete();
            }}
          />
        </div>

        <div className="flex-shrink-0 flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setStep(1);
              setExtractedBrandDNA(null);
            }}
            className="flex-1 px-6 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <span>View Full Profile</span>
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Create BrandDNA Profile</h1>
        <p className="text-gray-600">Enter your website to automatically extract brand information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Name
            </label>
            <VoiceInput
              value={brandData.name}
              onChange={(value) => setBrandData({ ...brandData, name: value })}
              placeholder="e.g., Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <VoiceInput
              value={brandData.url}
              onChange={(value) => setBrandData({ ...brandData, url: value })}
              placeholder="https://example.com"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!brandData.name || !brandData.url || isCreating}
              className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{extractionStatus || 'Creating BrandDNA with Firecrawl...'}</span>
                </>
              ) : (
                <>
                  <span>Create BrandDNA</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

