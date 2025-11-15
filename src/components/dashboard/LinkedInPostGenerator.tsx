import { useState } from 'react';
import { X, ArrowRight, RefreshCw, Edit, Sparkles, TrendingUp, BookOpen, Lightbulb, FileText, Rocket, Calendar, Zap, Image, Video, LayoutGrid, Send } from 'lucide-react';
import Foundii from '../Foundii';
import PostEditor from './PostEditor';
import PublishModal from './PublishModal';

interface LinkedInPostGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostType = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
};

export default function LinkedInPostGenerator({ isOpen, onClose }: LinkedInPostGeneratorProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({ name: '', url: '' });
  const [selectedType, setSelectedType] = useState<string>('');
  const [context, setContext] = useState({ topic: '', details: '' });
  const [generatedPost, setGeneratedPost] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const postTypes: PostType[] = [
    { id: 'thought-leadership', title: 'Thought Leadership', description: 'Share expert insights', icon: Lightbulb, color: 'from-blue-500 to-blue-600' },
    { id: 'authority', title: 'Authority Building', description: 'Establish credibility', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { id: 'storytelling', title: 'Storytelling', description: 'Connect through stories', icon: BookOpen, color: 'from-pink-500 to-pink-600' },
    { id: 'value-tips', title: 'Value / Tips', description: 'Share actionable advice', icon: Sparkles, color: 'from-green-500 to-green-600' },
    { id: 'case-study', title: 'Case Study', description: 'Show real results', icon: FileText, color: 'from-orange-500 to-orange-600' },
    { id: 'announcement', title: 'Announcement', description: 'Launch something new', icon: Rocket, color: 'from-red-500 to-red-600' },
    { id: 'event', title: 'Event Post', description: 'Promote gatherings', icon: Calendar, color: 'from-cyan-500 to-cyan-600' },
    { id: 'trending', title: 'Trending Angle', description: 'Ride the wave', icon: Zap, color: 'from-yellow-500 to-yellow-600' },
    { id: 'carousel', title: 'Carousel Script', description: 'Multi-slide content', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
  ];

  const suggestedImages = [
    { id: 1, label: 'Brand Aesthetic' },
    { id: 2, label: 'Data Visualization' },
    { id: 3, label: 'Team Photo' },
  ];

  const suggestedVideos = [
    { id: 1, label: 'Talking Head' },
    { id: 2, label: 'B-Roll Montage' },
  ];

  const handleStep1Continue = () => {
    if (brandData.name && brandData.url) {
      setStep(2);
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setTimeout(() => setStep(3), 300);
  };

  const generateMockPost = () => {
    return `🚀 ${context.topic}

Here's what most ${brandData.name} customers don't realize:

Success isn't about having all the answers. It's about asking the right questions.

Over the past 3 years working with 100+ brands, I've noticed a pattern:

→ The most visible companies aren't the loudest
→ They're the most consistent
→ They show up with value, not just volume

${context.details || 'The key is building authentic connections with your audience.'}

3 things that actually move the needle:

1️⃣ Share insights, not just content
2️⃣ Engage genuinely, not transactionally
3️⃣ Build trust through consistency

Your brand's visibility isn't a sprint. It's a marathon with strategic checkpoints.

What's your biggest visibility challenge right now? Drop it in the comments 👇

#Leadership #BrandVisibility #Marketing #GrowthStrategy`;
  };

  const handleGeneratePost = () => {
    setGeneratedPost(generateMockPost());
    setStep(4);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setGeneratedPost(generateMockPost());
      setIsRegenerating(false);
    }, 1000);
  };

  const handleSaveFromEditor = (editedPost: string) => {
    setGeneratedPost(editedPost);
    setShowEditor(false);
  };

  const handlePublish = (scheduled: boolean, date?: string, time?: string) => {
    setShowPublishModal(false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setBrandData({ name: '', url: '' });
    setSelectedType('');
    setContext({ topic: '', details: '' });
    setGeneratedPost('');
    setShowEditor(false);
    setShowPublishModal(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showEditor) {
    return (
      <PostEditor
        initialPost={generatedPost}
        brandName={brandData.name}
        onClose={() => setShowEditor(false)}
        onSave={handleSaveFromEditor}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">LinkedIn Post Generator</h2>
                <p className="text-sm text-gray-500">Step {step} of 4</p>
              </div>
            </div>
            <button
              onClick={handleClose}
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
                    Start by entering your website
                  </h3>
                  <p className="text-gray-600">
                    Foundrly analyzes your brand tone, audience, keywords & positioning.
                  </p>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={brandData.name}
                      onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                      placeholder="e.g., Acme Inc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={brandData.url}
                      onChange={(e) => setBrandData({ ...brandData, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    />
                  </div>

                  <button
                    onClick={handleStep1Continue}
                    disabled={!brandData.name || !brandData.url}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex justify-center mt-8">
                  <div className="relative">
                    <Foundii size={60} animate={true} gesture="wave" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                      <p className="text-xs text-gray-700">Let me scan your brand in seconds.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    Choose Your Post Type
                  </h3>
                  <p className="text-gray-600">
                    Pick the style that matches your message.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all hover:-translate-y-1 text-left"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-1">{type.title}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    What is this post about?
                  </h3>
                  <p className="text-gray-600">
                    Share your topic and any context to help me craft the perfect post.
                  </p>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post topic or idea
                    </label>
                    <input
                      type="text"
                      value={context.topic}
                      onChange={(e) => setContext({ ...context, topic: e.target.value })}
                      placeholder="e.g., Why most startups fail at brand visibility"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Optional context (audience, tone, goal)
                    </label>
                    <textarea
                      value={context.details}
                      onChange={(e) => setContext({ ...context, details: e.target.value })}
                      placeholder="Add any specific details, target audience, or key points you want to include..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGeneratePost}
                    disabled={!context.topic}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Post</span>
                  </button>
                </div>

                <div className="flex justify-center mt-8">
                  <div className="relative">
                    <Foundii size={60} animate={true} gesture="thinking" />
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                      <p className="text-xs text-gray-700">Give me anything — even a rough thought — I'll turn it into gold.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="space-y-6">
                  <div className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-semibold">
                          S
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">Founder at {brandData.name}</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-[#1A1A1A] leading-relaxed">
                          {generatedPost}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                    <button
                      onClick={() => setShowEditor(true)}
                      className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Edit in Editor
                    </button>
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Publish
                    </button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1A1A1A] mb-4">Suggested Assets</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Images
                        </p>
                        {suggestedImages.map((img) => (
                          <div key={img.id} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 flex items-center justify-center border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                            <span className="text-sm text-gray-600">{img.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Videos
                        </p>
                        {suggestedVideos.map((vid) => (
                          <div key={vid.id} className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl h-32 flex items-center justify-center border border-blue-200 hover:shadow-md transition-all cursor-pointer">
                            <span className="text-sm text-blue-700">{vid.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4" />
                          Carousel
                        </p>
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl h-full flex items-center justify-center border border-purple-200 hover:shadow-md transition-all cursor-pointer">
                          <span className="text-sm text-purple-700">5-Slide Layout</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <Foundii size={60} animate={true} gesture="thinking" />
                      <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                        <p className="text-xs text-gray-700">Want something different? Try regenerate or edit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? 'bg-[#1A1A1A] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-gray-600 hover:text-[#1A1A1A] text-sm font-medium transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
      />
    </>
  );
}
