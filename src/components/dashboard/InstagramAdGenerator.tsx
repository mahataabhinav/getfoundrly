import { useState } from 'react';
import { X, ArrowRight, Instagram, Video, Image as ImageIcon, LayoutGrid, Users, Sparkles, RefreshCw, Edit, Save, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import Foundi from '../Foundii';
import InstagramAdEditor from './InstagramAdEditor';
import InstagramPreviewModal from './InstagramPreviewModal';

interface InstagramAdGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstagramAdGenerator({ isOpen, onClose }: InstagramAdGeneratorProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    website: '',
    tone: 'Professional & Engaging',
    colors: ['#1A1A1A', '#4A90E2', '#F5F5F5'],
    keywords: ['Innovation', 'Growth', 'Results'],
    valueProps: ['Fast delivery', 'Expert team', 'Proven results']
  });
  const [selectedAdType, setSelectedAdType] = useState('');
  const [adContent, setAdContent] = useState({
    caption: '',
    cta: '',
    videoUrl: '',
    imageUrl: ''
  });
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleContinue = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 2000);
  };

  const handleAdTypeSelect = (typeId: string) => {
    setSelectedAdType(typeId);
    setStep(3);
  };

  const handleGenerateAd = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockCaptions = {
        'video-reel': '🚀 Ready to transform your brand visibility?\n\nIn just 30 seconds, discover how we help founders like you stand out in a crowded market.\n\n✨ No fluff. Just results.\n\n👉 Tap below to get started',
        'image-text': '💡 Your brand deserves to be seen.\n\nWe help ambitious founders build visibility that converts.\n\n✅ Strategic positioning\n✅ Authentic storytelling\n✅ Measurable growth\n\nReady to make your mark?',
        'carousel': 'Swipe to see how we transform brands 👉\n\n1️⃣ Discover your unique story\n2️⃣ Craft compelling content\n3️⃣ Amplify your reach\n4️⃣ Track real results\n5️⃣ Scale with confidence\n\nYour brand breakthrough starts here.',
        'ugc-testimonial': '"Before working with them, I was invisible in my industry.\n\nNow? I\'m the go-to expert everyone wants to work with."\n\n- Sarah, Tech Founder\n\n✨ Real stories. Real results.\n\nYour transformation is next.'
      };

      setAdContent({
        caption: mockCaptions[selectedAdType as keyof typeof mockCaptions] || mockCaptions['video-reel'],
        cta: 'Learn More',
        videoUrl: selectedAdType.includes('video') ? '/mock-video-url' : '',
        imageUrl: !selectedAdType.includes('video') ? '/mock-image-url' : ''
      });
      setIsGenerating(false);
    }, 3000);
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
                <p className="text-xs text-gray-500">Step {step} of 3</p>
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

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandData.name}
                      onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                      placeholder="Your Company Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={brandData.website}
                      onChange={(e) => setBrandData({ ...brandData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
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

                {isGenerating && (
                  <div className="flex justify-center mt-8">
                    <div className="relative">
                      <Foundi size={60} animate={true} gesture="thinking" />
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
                  <Foundi size={60} animate={true} gesture="wave" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-8 space-y-6 animate-slide-in">
                {!adContent.caption ? (
                  <div className="text-center space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                        Generate Your Ad
                      </h3>
                      <p className="text-gray-600">
                        Let AI create a high-performing ad for your brand
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateAd}
                      disabled={isGenerating}
                      className="w-full max-w-md mx-auto bg-[#1A1A1A] text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Crafting your ad...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Ad Content</span>
                        </>
                      )}
                    </button>

                    {isGenerating && (
                      <div className="flex justify-center mt-8">
                        <div className="relative">
                          <Foundi size={60} animate={true} gesture="thinking" />
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                            <p className="text-xs text-gray-700">Analyzing trends and crafting your perfect ad...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative">
                        <Foundi size={40} animate={true} gesture="celebrate" />
                        <div className="absolute -top-12 left-12 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                          <p className="text-xs text-gray-700">Here's a high-performing Instagram ad crafted for your brand.</p>
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
                              <p className="text-gray-500 mb-1">Keywords</p>
                              <div className="flex flex-wrap gap-2">
                                {brandData.keywords.map((keyword, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
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

                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200 aspect-[9/16] flex items-center justify-center">
                          {selectedAdType.includes('video') ? (
                            <div className="text-center">
                              <Video className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                              <p className="text-sm text-gray-600">Video Preview</p>
                              <p className="text-xs text-gray-500 mt-1">Reel-style vertical video</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                              <p className="text-sm text-gray-600">Image Preview</p>
                              <p className="text-xs text-gray-500 mt-1">1080x1350 optimal size</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <h4 className="font-semibold text-[#1A1A1A] mb-3">Caption</h4>
                          <textarea
                            value={adContent.caption}
                            onChange={(e) => setAdContent({ ...adContent, caption: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A] resize-none text-sm"
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
      />
    </>
  );
}
