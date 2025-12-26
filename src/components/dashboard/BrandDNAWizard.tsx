import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Eye, CheckCircle2, Search, Palette, MessageSquare, Smartphone } from 'lucide-react';
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

const LOADING_STEPS = [
  { id: 1, label: 'Scanning website content...', icon: Search, duration: 2000 },
  { id: 2, label: 'Analyzing visual identity & colors...', icon: Palette, duration: 2500 },
  { id: 3, label: 'Extracting tone of voice...', icon: MessageSquare, duration: 2500 },
  { id: 4, label: 'Identifying value propositions...', icon: CheckCircle2, duration: 2000 },
  { id: 5, label: 'Finalizing brand profile...', icon: Smartphone, duration: 1500 },
];

export default function BrandDNAWizard({ onComplete, onCancel }: BrandDNAWizardProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({ name: '', url: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [extractedBrandDNA, setExtractedBrandDNA] = useState<BrandDNA | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);

  // Gamified loading effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isCreating && currentLoadingStep < LOADING_STEPS.length - 1) {
      // Advance to next step based on duration, but stop at the last step until actual completion
      const stepDuration = LOADING_STEPS[currentLoadingStep].duration;
      timeout = setTimeout(() => {
        setCurrentLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, stepDuration);
    }

    return () => clearTimeout(timeout);
  }, [isCreating, currentLoadingStep]);

  const handleCreate = async () => {
    if (!brandData.name || !brandData.url) {
      setError('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    setCurrentLoadingStep(0);
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
        // Create BrandDNA from extraction (firecrawl happens in backend)
        brandDNA = await createBrandDNAFromExtraction(brand.id, user.id, brandData.name, brandData.url);
      }

      // Ensure we show the final step completed before showing results
      setCurrentLoadingStep(LOADING_STEPS.length - 1);

      // Small delay to let user see "Finalizing..." completion
      setTimeout(() => {
        setExtractedBrandDNA(brandDNA);
        setStep(2); // Show preview
        setIsCreating(false);
      }, 1000);

    } catch (err: any) {
      console.error('Error creating BrandDNA:', err);
      setError(err.message || 'Failed to create BrandDNA. Please try again.');
      setIsCreating(false);
    }
  };

  if (step === 2 && extractedBrandDNA) {
    return (
      <div className="space-y-6 max-h-[calc(100vh-200px)] flex flex-col">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-semibold text-white mb-2">BrandDNA Extracted Successfully</h1>
          <p className="text-zinc-400">Review the extracted brand information below</p>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#18181B] rounded-2xl border border-white/5">
          <BrandDNAPreview
            brandDNA={extractedBrandDNA}
            compact={true}
            onViewFull={() => {
              // Navigate to full profile view - this would need to be handled by parent
              onComplete();
            }}
          />
        </div>

        <div className="flex-shrink-0 flex gap-3 pt-4 border-t border-white/5">
          <button
            onClick={() => {
              setStep(1);
              setExtractedBrandDNA(null);
              setIsCreating(false);
              setCurrentLoadingStep(0);
            }}
            className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/5"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
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
        <h1 className="text-3xl font-semibold text-white mb-2">Create BrandDNA Profile</h1>
        <p className="text-zinc-400">Enter your website to automatically extract brand information</p>
      </div>

      <div className="bg-[#18181B] rounded-2xl border border-white/5 p-8 max-w-2xl">
        {isCreating ? (
          <div className="py-8">
            <div className="mb-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#CCFF00] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {(() => {
                    const CurrentIcon = LOADING_STEPS[currentLoadingStep].icon;
                    return <CurrentIcon className="w-8 h-8 text-[#CCFF00]" />;
                  })()}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {LOADING_STEPS[currentLoadingStep].label}
              </h3>
              <p className="text-zinc-400 text-sm">
                This process typically takes 30-60 seconds. Please do not close this window.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              {LOADING_STEPS.map((step, index) => {
                const isActive = index === currentLoadingStep;
                const isCompleted = index < currentLoadingStep;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${isActive
                      ? 'bg-white/5 border-[#CCFF00]/30'
                      : isCompleted
                        ? 'bg-white/5 border-white/5 opacity-50'
                        : 'border-transparent opacity-30'
                      }`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                      ${isActive ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-zinc-500'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <Loader2 className="w-4 h-4 text-[#CCFF00] animate-spin" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Website Name
              </label>
              <VoiceInput
                value={brandData.name}
                onChange={(value) => setBrandData({ ...brandData, name: value })}
                placeholder="e.g., Acme Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Website URL
              </label>
              <VoiceInput
                value={brandData.url}
                onChange={(value) => setBrandData({ ...brandData, url: value })}
                placeholder="https://example.com"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!brandData.name || !brandData.url}
                className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Step Inside Your Brand</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
