import { useState } from 'react';
import { X, Newspaper, Check, ArrowLeft, Sparkles, Clock, TrendingUp, BarChart3, Calendar, User } from 'lucide-react';
import Foundi from '../Foundii';

interface BlogPostPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  blogContent: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    readingTime: string;
    heroImage: string;
    sections: { heading: string; level: string; content: string }[];
    callout: string;
    quote: string;
    cta: string;
    ctaUrl: string;
    internalLinks: { text: string; url: string }[];
  };
  brandName: string;
}

export default function BlogPostPreview({ isOpen, onClose, blogContent, brandName }: BlogPostPreviewProps) {
  const [step, setStep] = useState<'preview' | 'connect' | 'schedule' | 'confirmPublish' | 'success'>('preview');
  const [cmsType, setCmsType] = useState<'wordpress' | 'webflow' | 'ghost'>('wordpress');
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  const recommendedTimes = [
    {
      dayOfWeek: upcomingDates[2].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[2].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '10:03 AM',
      emoji: '⭐',
      label: 'Peak SEO crawl window',
      metrics: [
        '+19% expected organic traffic',
        'High Google crawl likelihood'
      ],
      reason: 'Optimal for search visibility',
      engagement: 91
    },
    {
      dayOfWeek: upcomingDates[4].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '8:51 AM',
      emoji: '✨',
      label: 'Morning reader traffic',
      metrics: [
        'Strong for SEO indexing',
        '+16% engagement rate'
      ],
      reason: 'Prime time for content discovery',
      engagement: 85
    },
    {
      dayOfWeek: upcomingDates[6].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '9:28 PM',
      emoji: '🌙',
      label: 'Weekend deep-read time',
      metrics: [
        'High for long reads',
        '+21% time on page'
      ],
      reason: 'Perfect for comprehensive content',
      engagement: 82
    }
  ];

  const handleConnect = () => {
    if (!apiKey) return;
    setTimeout(() => {
      setIsConnected(true);
      setTimeout(() => {
        setStep('confirmPublish');
      }, 1500);
    }, 1000);
  };

  const handlePublishNow = () => {
    if (isConnected) {
      setStep('confirmPublish');
    } else {
      setStep('connect');
    }
  };

  const handleConfirmPublish = () => {
    setStep('success');
    setTimeout(() => {
      onClose();
      resetModal();
    }, 3000);
  };

  const handleSchedule = () => {
    setStep('success');
    setTimeout(() => {
      onClose();
      resetModal();
    }, 3000);
  };

  const resetModal = () => {
    setStep('preview');
    setApiKey('');
    setIsConnected(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  if (!isOpen) return null;

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
            Article Published!
          </h2>
          <p className="text-gray-600">
            Your blog post is now live on your website.
          </p>
          <div className="flex justify-center mt-6">
            <Foundi size={60} animate={true} gesture="celebrate" />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'connect') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Connect Your CMS</h2>
            <button
              onClick={() => setStep('preview')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-8">
            {!isConnected ? (
              <div className="space-y-6 animate-slide-in">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Newspaper className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    Connect Your Publishing Platform
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Link WordPress, Webflow, or Ghost to publish directly
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Platform
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['wordpress', 'webflow', 'ghost'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setCmsType(platform as typeof cmsType)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          cmsType === platform
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key / Access Token
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                  />
                </div>

                <button
                  onClick={handleConnect}
                  disabled={!apiKey}
                  className="w-full bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Newspaper className="w-5 h-5" />
                  Connect {cmsType}
                </button>

                <div className="flex justify-center mt-8">
                  <Foundi size={60} animate={true} gesture="wave" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 animate-slide-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Connected!
                  </h3>
                  <p className="text-gray-600">Ready to publish your article.</p>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <Foundi size={60} animate={true} gesture="celebrate" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                      <p className="text-xs text-gray-700">All set! Let's publish.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmPublish') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Confirm & Publish</h2>
            </div>
            <button
              onClick={() => setStep('preview')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Ready to publish this article?
              </h3>
              <p className="text-gray-600">Review before publishing to your website</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Meta Title</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{blogContent.metaTitle}</p>
              </div>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">{blogContent.title}</h1>
              <p className="text-sm text-gray-500 mb-4">{blogContent.readingTime}</p>
              <div className="space-y-3">
                {blogContent.sections.slice(0, 2).map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">{section.heading}</h3>
                    <p className="text-sm text-gray-600">{section.content.substring(0, 120)}...</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <Foundi size={60} animate={true} gesture="celebrate" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                  <p className="text-xs text-gray-700">Ready to publish! Your readers will love this.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
              >
                Edit in Editor
              </button>
              <button
                onClick={handleConfirmPublish}
                className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                Publish Article
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'schedule') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('preview')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Schedule Blog Post</h2>
                <p className="text-xs text-gray-500">Pick the optimal time for maximum SEO impact</p>
              </div>
            </div>
            <button
              onClick={() => setStep('preview')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-[#1A1A1A] text-lg">AI Recommended Times</h4>
              </div>
              <div className="space-y-4">
                {recommendedTimes.map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(rec.time)}
                    className="w-full p-5 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-2xl">
                        {rec.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-[#1A1A1A] text-lg">{rec.emoji} {rec.dayOfWeek} • {rec.fullDate} • {rec.time}</p>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                            <BarChart3 className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-bold text-green-700">{rec.engagement}% match</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {rec.metrics.map((metric, mIndex) => (
                            <p key={mIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 font-bold">•</span>
                              <span>{metric}</span>
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${rec.engagement}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl p-5 border border-gray-200 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Pick a recommended slot to maximize visibility. I'll handle the publishing.
                </p>
              </div>
            </div>

            <div className="flex gap-3 max-w-2xl mx-auto">
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Schedule
              </button>
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Preview Blog Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Article Preview
            </h3>
            <p className="text-gray-600">This is how your blog post will appear on your website</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {blogContent.heroImage && (
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <img src={blogContent.heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{brandName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blogContent.readingTime}</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">{blogContent.title}</h1>

                <div className="prose max-w-none">
                  {blogContent.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h2 className={`font-bold text-[#1A1A1A] mb-3 ${section.level === 'H2' ? 'text-2xl' : 'text-xl'}`}>
                        {section.heading}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                    </div>
                  ))}

                  {blogContent.callout && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
                      <p className="text-gray-800 font-medium">{blogContent.callout}</p>
                    </div>
                  )}

                  {blogContent.quote && (
                    <blockquote className="border-l-4 border-gray-300 pl-6 my-8 italic text-xl text-gray-700">
                      {blogContent.quote}
                    </blockquote>
                  )}
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">{blogContent.cta}</h3>
                  <p className="text-gray-600 mb-6">Ready to get started?</p>
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md">
                    Get Started Today
                  </button>
                </div>
              </div>
            </article>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Related Article {i}</p>
                    <p className="text-xs text-gray-500 mt-1">5 min read</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <Foundi size={60} animate={true} gesture="thinking" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                <p className="text-xs text-gray-700">Ready to publish?</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Edit in Editor
            </button>
            <button
              onClick={() => setStep('schedule')}
              className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Schedule for Later
            </button>
            <button
              onClick={handlePublishNow}
              className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
            >
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
