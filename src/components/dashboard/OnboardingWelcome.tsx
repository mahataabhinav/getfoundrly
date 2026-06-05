import { useState, useEffect } from 'react';
import { Sparkles, Search, Palette, MessageSquare, CheckCircle2, Smartphone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { findOrCreateBrand } from '../../lib/database';
import { createBrandDNAFromExtraction } from '../../lib/brand-dna';
import VoiceInput from '../VoiceInput';

interface OnboardingWelcomeProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { id: 1, label: 'Scanning website content...', icon: Search, duration: 2000 },
  { id: 2, label: 'Analyzing visual identity & colors...', icon: Palette, duration: 2500 },
  { id: 3, label: 'Extracting tone of voice...', icon: MessageSquare, duration: 2500 },
  { id: 4, label: 'Identifying value propositions...', icon: CheckCircle2, duration: 2000 },
  { id: 5, label: 'Finalizing brand profile...', icon: Smartphone, duration: 1500 },
];

export default function OnboardingWelcome({ onComplete }: OnboardingWelcomeProps) {
  const [firstName, setFirstName] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Gamified loading effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading && currentLoadingStep < LOADING_STEPS.length - 1) {
      const stepDuration = LOADING_STEPS[currentLoadingStep].duration;
      timeout = setTimeout(() => {
        setCurrentLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, stepDuration);
    }

    return () => clearTimeout(timeout);
  }, [loading, currentLoadingStep]);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const metadata = session.user.user_metadata;
        const fullName = metadata?.full_name || metadata?.name || metadata?.display_name || '';

        if (fullName) {
          const firstNameExtracted = fullName.split(' ')[0];
          setFirstName(firstNameExtracted);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async () => {
    if (!websiteUrl || !websiteName) {
      setError('Please enter both website name and URL');
      return;
    }

    setLoading(true);
    setCurrentLoadingStep(0);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1. Create brand
      const brand = await findOrCreateBrand(user.id, websiteName, websiteUrl);

      // 2. Extract Brand DNA
      await createBrandDNAFromExtraction(brand.id, user.id, websiteName, websiteUrl);

      // Ensure we show the final step completed
      setCurrentLoadingStep(LOADING_STEPS.length - 1);

      // Small delay to let user see completion
      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (err: any) {
      console.error('Error creating Brand DNA:', err);

      // Check error type for better messaging
      const isBillingError = err.message?.includes('BILLING_ERROR') || err.message?.includes('credits exceeded');
      const isAPIKeyError = err.message?.includes('API key') || err.message?.includes('Invalid');

      let errorMessage = err.message?.replace('BILLING_ERROR: ', '') || 'Failed to create Brand DNA.';

      if (isBillingError) {
        errorMessage = 'OpenAI credits exceeded. Please add credits to your OpenAI account to enable Brand DNA extraction.';
      } else if (isAPIKeyError) {
        errorMessage = 'OpenAI API key is invalid or not configured. Please check your .env file.';
      }

      setError(errorMessage);
      setCanSkip(false); // Never allow skip - OpenAI is mandatory
      setLoading(false);
      setCurrentLoadingStep(0);
    }
  };

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create brand only (without Brand DNA)
      const brand = await findOrCreateBrand(user.id, websiteName, websiteUrl);

      // Create minimal Brand DNA to mark onboarding complete
      const { createBrandDNA } = await import('../../lib/database');
      await createBrandDNA({
        brand_id: brand.id,
        user_id: user.id,
        status: 'needs_review',
        completion_score: 0,
        dna_data: {
          identity: {
            official_name: websiteName,
            domains: [websiteUrl],
          },
        },
        provenance: [{
          field: 'identity.official_name',
          source_url: websiteUrl,
          last_updated: new Date().toISOString(),
          trust_score: 100,
          extraction_method: 'user',
        }],
        versions: [],
        last_crawled_at: null,
      });

      onComplete();
    } catch (error: any) {
      console.error('Error skipping Brand DNA:', error);
      setError('Failed to skip. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {loading ? (
          <div className="bg-[#18181B] rounded-[32px] border border-white/5 p-12">
            <div className="py-8">
              <div className="mb-8 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#CCFF00] rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => {
                      const StepIcon = LOADING_STEPS[currentLoadingStep].icon;
                      return <StepIcon className="w-8 h-8 text-[#CCFF00]" />;
                    })()}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Creating Your Brand DNA</h3>
                <p className="text-zinc-400">This will take about 30-45 seconds</p>
              </div>

              <div className="space-y-4">
                {LOADING_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentLoadingStep;
                  const isComplete = index < currentLoadingStep;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#CCFF00]/10 border border-[#CCFF00]/20'
                          : isComplete
                          ? 'bg-white/5 border border-white/5'
                          : 'bg-transparent border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive
                            ? 'bg-[#CCFF00] text-black'
                            : isComplete
                            ? 'bg-white/10 text-white'
                            : 'bg-white/5 text-zinc-500'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-all ${
                          isActive ? 'text-white' : isComplete ? 'text-zinc-400' : 'text-zinc-600'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#9FCC00] mb-4">
              <Sparkles className="w-10 h-10 text-black" />
            </div>

            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                {firstName ? `Welcome to Foundrly, ${firstName}!` : 'Welcome to Foundrly!'}
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl mx-auto">
                Let's create on-brand content in minutes by extracting your brand's DNA from your website.
              </p>
            </div>

            <div className="bg-[#18181B] rounded-[32px] border border-white/5 p-8 text-left">
              <h2 className="text-2xl font-bold text-white mb-6">Step 1: Enter Your Website</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    placeholder="e.g., Foundrly"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Website URL
                  </label>
                  <VoiceInput
                    value={websiteUrl}
                    onChange={setWebsiteUrl}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-3">
                    <p className="text-red-400 text-sm">{error}</p>
                    {canSkip && (
                      <div className="pt-2 border-t border-red-500/20">
                        <p className="text-zinc-400 text-xs mb-3">
                          You can skip Brand DNA extraction for now and complete it later from the dashboard.
                        </p>
                        <button
                          onClick={handleSkip}
                          className="w-full px-4 py-2 bg-white/5 text-white rounded-lg font-medium text-sm hover:bg-white/10 transition-all border border-white/10"
                        >
                          Skip for Now - I'll Set This Up Later
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                  <h3 className="text-white font-medium mb-3">This helps us learn your:</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></div>
                      Brand voice and tone
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></div>
                      Visual identity (colors, logos)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></div>
                      Products and messaging
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></div>
                      Target audience
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!websiteUrl || !websiteName || loading}
                className="w-full mt-6 px-6 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Analyzing your brand...' : 'Continue'}</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
