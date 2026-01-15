import { useState, useEffect } from 'react';
import { X, ArrowRight, Instagram, Video, Image as ImageIcon, LayoutGrid, Users, Sparkles, RefreshCw, Edit, Save, TrendingUp, Clock, Target, BarChart3, ArrowLeft } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import VoiceInput from '../VoiceInput';
import InstagramAdEditor from './InstagramAdEditor';
import InstagramPreviewModal from './InstagramPreviewModal';
import { supabase } from '../../lib/supabase';
import { findOrCreateBrand } from '../../lib/database';
import { extractBrandProfile, getCachedBrandProfile, saveBrandProfile, type BrandProfile } from '../../lib/brand-extractor';
import { createBrandDNAFromExtraction, getBrandDNA } from '../../lib/brand-dna';
import type { BrandDNA, Brand } from '../../types/database';
import { generateVideo, type GeneratedVideo } from '../../lib/asset-generator';
import { generateInstagramCaptions } from '../../lib/instagram-generator';
// import { sendInstagramPostToN8n } from '../../lib/n8n-webhook';

interface InstagramAdGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstagramAdGenerator({ isOpen, onClose }: InstagramAdGeneratorProps) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [extractedBrandDNA, setExtractedBrandDNA] = useState<BrandDNA | null>(null);

  const [brandData, setBrandData] = useState({
    name: 'Seven Oaks Coffee',
    website: 'https://sevenoakscoffee.com/',
    tone: 'Professional & Engaging',
    colors: ['#1A1A1A', '#4A90E2', '#F5F5F5'],
    keywords: ['Innovation', 'Growth', 'Results'],
    valueProps: ['Fast delivery', 'Expert team', 'Proven results']
  });
  const [selectedAdType, setSelectedAdType] = useState('');
  const [preferences, setPreferences] = useState({
    goal: 'Awareness',
    audience: 'Coffee Enthusiasts',
    brandMessage: 'Showcase our signature Guatemala Antigua blend - smooth, chocolatey notes, medium roast. Perfect for both espresso and drip. Highlight the unique sourcing and flavor profile.',
    tone: 'Bold',
    cta: 'Learn More'
  });
  const [adContent, setAdContent] = useState({
    caption: '',
    cta: '',
    videoUrl: '',
    imageUrl: ''
  });
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const adTypes = [
    {
      id: 'video-reel',
      title: 'Short-Form Video Ad',
      subtitle: 'Reel Style',
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      description: 'Engaging vertical video optimized for Instagram Reels'
    },
    {
      id: 'image-text',
      title: 'Image + Text Ad',
      subtitle: 'Classic Format',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-500',
      description: 'Static image with compelling copy and CTA'
    },
    {
      id: 'carousel',
      title: 'Carousel Ad',
      subtitle: '3-5 Frames',
      icon: LayoutGrid,
      color: 'from-orange-500 to-red-500',
      description: 'Multiple images telling a story or showcasing products'
    },
    {
      id: 'ugc-testimonial',
      title: 'UGC-Style Testimonial',
      subtitle: 'Authentic Voice',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'User-generated style testimonial video'
    }
  ];

  const ctaOptions = [
    'Shop Now',
    'Learn More',
    'Sign Up',
    'Book Now',
    'Get Started',
    'Download'
  ];

  const handleContinue = async () => {
    if (!userId || !brandData.name || !brandData.website) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // 1. Find or create brand
      const brandRecord = await findOrCreateBrand(userId, brandData.name, brandData.website);
      setBrand(brandRecord);

      // 2. Extarct Brand Profile
      let profile = await getCachedBrandProfile(brandRecord.id);
      if (!profile) {
        try {
          profile = await extractBrandProfile(brandData.name, brandData.website);
          await saveBrandProfile(brandRecord.id, profile);
        } catch (e) {
          console.error("Profile extraction failed", e);
          profile = {} as BrandProfile; // Fallback
        }
      }
      setBrandProfile(profile);

      // 3. Extract/Get Brand DNA
      let dna = await getBrandDNA(brandRecord.id);
      if (!dna) {
        try {
          dna = await createBrandDNAFromExtraction(brandRecord.id, userId, brandData.name, brandData.website);
        } catch (e) {
          console.error("Brand DNA creation failed", e);
        }
      }
      setExtractedBrandDNA(dna);

      // Update local state with extracted info for UI display
      if (profile) {
        // Extract some colors if available, else standard fallback
        const colors = profile.brandColors ? Object.values(profile.brandColors).filter(Boolean) as string[] : brandData.colors;

        setBrandData(prev => ({
          ...prev,
          tone: profile.brandTone || prev.tone,
          colors: colors.length > 0 ? colors : prev.colors,
          // keywords: ... could extract from DNA
        }));
      }

      setStep(2);

    } catch (error: any) {
      console.error("Error in Step 1:", error);
      setGenerationError("Failed to analyze brand. Please check URL and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdTypeSelect = (typeId: string) => {
    setSelectedAdType(typeId);
    setStep(3);
  };

  const handleGenerateFromPreferences = () => {
    setIsGenerating(true);
    // Move to step 4 immediately to show loading state there if preferred, or wait. 
    // Implementing wait pattern used in previous code:
    setTimeout(() => {
      handleGenerateAd();
      setStep(4);
    }, 500);
  };

  /* New state for advanced captions */
  const [captionVariations, setCaptionVariations] = useState<{
    short: string;
    medium: string;
    long: string;
  } | null>(null);
  const [captionHashtags, setCaptionHashtags] = useState<any>(null);
  const [selectedCaptionType, setSelectedCaptionType] = useState<'short' | 'medium' | 'long'>('medium');

  const handleGenerateAd = async () => {
    if (!brand || !brandProfile || !userId) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // 1. Generate Advanced Captions
      try {
        const captionResult = await generateInstagramCaptions({
          brandName: brandData.name,
          brandWebsite: brandData.website,
          industry: brandProfile.industry,
          location: undefined,
          postType: selectedAdType.includes('video') ? 'Reel' : 'Image Post',
          topic: preferences.goal + ' for ' + preferences.audience,
          keyPoints: preferences.brandMessage,
          targetAudience: preferences.audience,
          brandVoice: brandData.tone,
          brandProfile: brandProfile
        });

        setCaptionVariations(captionResult.captions);
        setCaptionHashtags(captionResult.hashtags);

        // Default to medium
        const defaultCaption = captionResult.captions.medium + '\n\n' + captionResult.hashtags.tier1.join(' ') + ' ' + captionResult.hashtags.tier2.join(' ');

        setAdContent(prev => ({
          ...prev,
          caption: defaultCaption,
          cta: preferences.cta
        }));

      } catch (captionErr) {
        console.error("Caption generation failed", captionErr);
        // Fallback to basic logic if AI fails
        const baseCaption = `🚀 ${preferences.brandMessage || 'Check this out!'} \n\n👉 ${preferences.cta} link in bio!`;
        setAdContent(prev => ({ ...prev, caption: baseCaption, cta: preferences.cta }));
      }

      // 2. Generate Video if Video Type selected (Mock Logic)
      if (selectedAdType.includes('video') || selectedAdType === 'ugc-testimonial') {
        try {
          await new Promise(resolve => setTimeout(resolve, 7000)); // Simulate 7s generation delay
          const mockVideoUrl = '/mock-video-instagram.mp4';
          setAdContent(prev => ({ ...prev, videoUrl: mockVideoUrl, imageUrl: '' }));
        } catch (vidError: any) {
          console.error("Video generation failed:", vidError);
          setGenerationError(`Video generation failed: ${vidError.message}`);
        }
      } else {
        setAdContent(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', videoUrl: '' }));
      }

    } catch (error: any) {
      console.error("Ad Generation Error:", error);
      setGenerationError("Failed to generate ad content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCaptionSelection = (type: 'short' | 'medium' | 'long') => {
    if (!captionVariations || !captionHashtags) return;
    setSelectedCaptionType(type);

    let hashtags = '';
    // Use fewer hashtags for short, more for others
    if (type === 'short') {
      hashtags = captionHashtags.tier1.slice(0, 5).join(' ') + ' ' + captionHashtags.tier4.slice(0, 1).join(' '); // Niche + Brand
    } else {
      hashtags = captionHashtags.tier1.join(' ') + ' ' + captionHashtags.tier2.slice(0, 5).join(' '); // Niche + Medium
    }

    setAdContent(prev => ({
      ...prev,
      caption: captionVariations[type] + '\n\n' + hashtags
    }));
  };

  const handleSaveAndPreview = () => {
    setShowPreview(true);
  };

  if (!isOpen) return null;

  if (showEditor) {
    return (
      <InstagramAdEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        adContent={adContent}
        onSave={(updatedContent) => {
          setAdContent(updatedContent);
          setShowEditor(false);
        }}
        brandName={brandData.name}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Create Instagram Ad</h2>
                <p className="text-xs text-gray-500">Step {step} of 4</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
            {step === 1 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    Let's create your Instagram ad
                  </h3>
                  <p className="text-gray-600">
                    Enter your brand details to get started
                  </p>
                </div>

                {generationError && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                    {generationError}
                  </div>
                )}

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <VoiceInput
                      value={brandData.name}
                      onChange={(value) => setBrandData({ ...brandData, name: value })}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <VoiceInput
                      value={brandData.website}
                      onChange={(value) => setBrandData({ ...brandData, website: value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={!brandData.name || !brandData.website || isGenerating}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Analyzing your brand...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Robot/Previous content ... */}

                {isGenerating && (
                  <div className="flex justify-center mt-8">
                    <div className="relative">
                      <RobotChatbot size={60} animate={true} gesture="thinking" />
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                        <p className="text-xs text-gray-700">Perfect. Let me pull your brand essence to craft high-performing Instagram ads.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    Select Your Ad Type
                  </h3>
                  <p className="text-gray-600">
                    Choose the format that best fits your campaign goal
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {adTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleAdTypeSelect(type.id)}
                        className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all hover:-translate-y-1 text-left"
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="font-semibold text-[#1A1A1A] text-lg mb-1">{type.title}</h4>
                        <p className="text-sm font-medium text-gray-500 mb-2">{type.subtitle}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center mt-8">
                  <RobotChatbot size={60} animate={true} gesture="wave" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-8 space-y-6 animate-slide-in">
                {/* Step 3 content largely same, keeping existing fields... */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep(2)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="text-center flex-1">
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                      Help Foundi Personalize Your Ad
                    </h3>
                    <p className="text-gray-600">
                      Answer a few questions to create your perfect ad
                    </p>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What is the goal of this ad?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Awareness', 'Traffic', 'Sales', 'Leads'].map((goal) => (
                          <button
                            key={goal}
                            onClick={() => setPreferences({ ...preferences, goal })}
                            className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${preferences.goal === goal
                              ? 'border-[#1A1A1A] bg-gray-50 text-[#1A1A1A]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who is the target audience?
                      </label>
                      <VoiceInput
                        value={preferences.audience}
                        onChange={(value) => setPreferences({ ...preferences, audience: value })}
                        placeholder="e.g., Tech founders, Marketing professionals..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Any must-include brand messages?
                      </label>
                      <VoiceInput
                        value={preferences.brandMessage}
                        onChange={(value) => setPreferences({ ...preferences, brandMessage: value })}
                        placeholder="e.g., We're trusted by 10,000+ customers..."
                        multiline
                        rows={3}
                      />
                    </div>
                    {/* Tone and CTA selects remain same */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred ad tone?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Bold', 'Friendly', 'Founder-Story', 'Emotional'].map((tone) => (
                          <button
                            key={tone}
                            onClick={() => setPreferences({ ...preferences, tone })}
                            className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${preferences.tone === tone
                              ? 'border-[#1A1A1A] bg-gray-50 text-[#1A1A1A]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred CTA?
                      </label>
                      <select
                        value={preferences.cta}
                        onChange={(e) => setPreferences({ ...preferences, cta: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                      >
                        {ctaOptions.map((cta) => (
                          <option key={cta} value={cta}>{cta}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <button
                    onClick={handleGenerateFromPreferences}
                    disabled={isGenerating}
                    className="w-full bg-[#1A1A1A] text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Crafting your personalized ad...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate My Ad</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-8 space-y-6 animate-slide-in">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw className="w-12 h-12 text-[#1A1A1A] animate-spin mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Generating Media with OpenAI Sora...</h3>
                    <p className="text-gray-500">Creating a custom video reel for your brand.</p>
                  </div>
                ) : (
                  <div>
                    {generationError && (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                        {generationError}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <div className="relative">
                        <RobotChatbot size={40} animate={true} gesture="celebrate" />
                        <div className="absolute -top-12 left-12 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                          <p className="text-xs text-gray-700">Here's your personalized Instagram ad. Want to tweak it?</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGenerateAd}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate
                        </button>
                        <button
                          onClick={() => setShowEditor(true)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit in Editor
                        </button>
                        <button
                          onClick={handleSaveAndPreview}
                          className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Preview Ad
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Brand Summary Column */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                          <h4 className="font-semibold text-[#1A1A1A] mb-4">Brand Summary</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Tone</p>
                              <p className="text-gray-800 font-medium">{brandData.tone}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Brand Colors</p>
                              <div className="flex gap-2">
                                {brandData.colors.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Website</p>
                              <p className="text-gray-800 shrink truncate">{brandData.website}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A]">Call-to-Action</h4>
                          </div>
                          <select
                            value={adContent.cta}
                            onChange={(e) => setAdContent({ ...adContent, cta: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                          >
                            {ctaOptions.map((cta) => (
                              <option key={cta} value={cta}>{cta}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Preview Column */}
                      <div className="space-y-4">
                        <div className="bg-black rounded-2xl overflow-hidden aspect-[9/16] flex items-center justify-center relative shadow-xl">
                          {selectedAdType.includes('video') && adContent.videoUrl ? (
                            <video
                              src={adContent.videoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : adContent.imageUrl ? (
                            <img src={adContent.imageUrl} className="w-full h-full object-cover" alt="Ad preview" />
                          ) : (
                            <div className="text-center text-white/50 p-6">
                              <p>Generating preview...</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A]">Caption</h4>
                            {captionVariations && (
                              <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                                <button
                                  onClick={() => updateCaptionSelection('short')}
                                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${selectedCaptionType === 'short'
                                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                  Short
                                </button>
                                <button
                                  onClick={() => updateCaptionSelection('medium')}
                                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${selectedCaptionType === 'medium'
                                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                  Medium
                                </button>
                                <button
                                  onClick={() => updateCaptionSelection('long')}
                                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${selectedCaptionType === 'long'
                                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                  Long
                                </button>
                              </div>
                            )}
                          </div>
                          <VoiceInput
                            value={adContent.caption}
                            onChange={(value) => setAdContent({ ...adContent, caption: value })}
                            multiline
                            rows={8}
                          />
                          <p className="text-xs text-gray-500 mt-2">{adContent.caption.length} characters</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <InstagramPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        adContent={adContent}
        brandName={brandData.name}
        adType={selectedAdType}
        userId={userId || ''}
        brandId={brand?.id || ''}
      />
    </>
  );
}
