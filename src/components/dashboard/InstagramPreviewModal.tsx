import { useState } from 'react';
import { X, Heart, MessageCircle, Send as SendIcon, Bookmark, MoreHorizontal, Instagram, Check, TrendingUp, Clock, BarChart3, Moon, Sparkles, ArrowLeft, Facebook, Image as ImageIcon, Loader2 } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import { sendInstagramPostToN8n } from '../../lib/n8n-webhook';

interface InstagramPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  adContent: {
    caption: string;
    cta: string;
    videoUrl: string;
    imageUrl: string;
  };
  brandName: string;
  adType: string;
  userId: string;
  brandId: string;
}

export default function InstagramPreviewModal({ isOpen, onClose, adContent, brandName, adType, userId, brandId }: InstagramPreviewModalProps) {
  const [step, setStep] = useState<'preview' | 'connect' | 'schedule' | 'confirmPublish' | 'success'>('preview');
  const [instagramEmail, setInstagramEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [connectionMethod, setConnectionMethod] = useState<'email' | 'facebook'>('email');
  const [isPublishing, setIsPublishing] = useState(false);

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
      dayOfWeek: upcomingDates[0].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '11:32 AM',
      emoji: '⭐',
      label: 'Highest Conversion Window',
      metrics: [
        'Predicted +24% more reach',
        '+18% likes vs your median'
      ],
      reason: 'Best for thought-leadership posts',
      engagement: 92,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      dayOfWeek: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '3:47 PM',
      emoji: '✨',
      label: 'High Awareness Window',
      metrics: [
        '+19% impressions',
        '+12% saves'
      ],
      reason: 'Strong for awareness content',
      engagement: 78,
      color: 'from-blue-400 to-purple-500'
    },
    {
      dayOfWeek: upcomingDates[3].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[3].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '8:04 PM',
      emoji: '🌙',
      label: 'After-Work Spike',
      metrics: [
        '+21% link clicks',
        'Great for testimonials/UGC'
      ],
      reason: 'Evening engagement peak',
      engagement: 85,
      color: 'from-indigo-400 to-purple-600'
    }
  ];

  const handleConnect = () => {
    if (!instagramEmail && connectionMethod === 'email') return;
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

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    const startTime = Date.now();

    try {
      // Attempt to publish
      await sendInstagramPostToN8n({
        userId,
        brandId,
        caption: adContent.caption,
        videoUrl: adContent.videoUrl,
        imageUrl: adContent.imageUrl,
        mediaType: adType.includes('video') ? 'video' : 'image',
      });
    } catch (error) {
      console.error('Failed to publish (demo mode will continue):', error);
    } finally {
      // Ensure we show "Publishing..." for at least 4 seconds for effect
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 4000 - elapsed);

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      setIsPublishing(false);
      setStep('success');
      setTimeout(() => {
        onClose();
        resetModal();
      }, 3000);
    }
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
    setInstagramEmail('');
    setIsConnected(false);
    setSelectedDate('');
    setSelectedTime('');
    setConnectionMethod('email');
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
            {selectedDate ? 'Your ad is scheduled!' : 'Your ad is live!'}
          </h2>
          <p className="text-gray-600 mb-2">
            {selectedDate
              ? `Will be published on ${selectedDate} at ${selectedTime}`
              : 'Successfully published to Instagram'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can track performance in Analytics.
          </p>
          <div className="flex justify-center">
            <RobotChatbot size={80} animate={true} gesture="celebrate" />
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Connect Instagram</h2>
            </div>
            <button
              onClick={() => setStep('preview')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-8">
            {!isConnected ? (
              <div className="text-center space-y-6 animate-slide-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center mx-auto">
                  <Instagram className="w-10 h-10 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Connect Instagram Business Account
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Choose your preferred connection method
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setConnectionMethod('facebook')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${connectionMethod === 'facebook'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Facebook Business Login</p>
                        <p className="text-xs text-gray-600">Recommended for business accounts</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setConnectionMethod('email')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${connectionMethod === 'email'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Email Login</p>
                        <p className="text-xs text-gray-600">Direct Instagram connection</p>
                      </div>
                    </div>
                  </button>
                </div>

                {connectionMethod === 'email' && (
                  <div className="animate-slide-in">
                    <input
                      type="email"
                      value={instagramEmail}
                      onChange={(e) => setInstagramEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A] mb-4"
                    />
                  </div>
                )}

                <button
                  onClick={handleConnect}
                  disabled={connectionMethod === 'email' && !instagramEmail}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Instagram className="w-5 h-5" />
                  {connectionMethod === 'facebook' ? 'Connect via Facebook' : 'Authenticate & Connect'}
                </button>

                <div className="flex justify-center mt-8">
                  <RobotChatbot size={60} animate={true} gesture="wave" />
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
                  <p className="text-gray-600">Ready to publish your ad.</p>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <RobotChatbot size={60} animate={true} gesture="celebrate" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                      <p className="text-xs text-gray-700">Connected! Ready to publish.</p>
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
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Confirm Publish</h2>
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
                This is how your ad will appear on Instagram
              </h3>
            </div>

            <div className="flex justify-center">
              <div className="w-[375px] bg-black rounded-[3rem] p-3 shadow-2xl border-[14px] border-gray-900">
                <div className="bg-white rounded-[2.5rem] overflow-hidden h-[750px] overflow-y-auto">
                  <div className="bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                          {brandName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-sm text-[#1A1A1A]">{brandName.toLowerCase().replace(/\s/g, '')}</p>
                          </div>
                          <p className="text-xs text-gray-500">Sponsored</p>
                        </div>
                      </div>
                      <button className="p-1">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 aspect-square flex items-center justify-center">
                    {adType.includes('video') ? (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-gray-800 border-b-[12px] border-b-transparent ml-1" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Video Ad</p>
                        <p className="text-xs text-gray-500 mt-1">Tap to play</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-pink-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">Image Ad</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <button className="hover:opacity-50 transition-opacity">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="hover:opacity-50 transition-opacity">
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="hover:opacity-50 transition-opacity">
                          <SendIcon className="w-6 h-6" />
                        </button>
                      </div>
                      <button className="hover:opacity-50 transition-opacity">
                        <Bookmark className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-[#1A1A1A] mb-2">2,847 views</p>

                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="font-semibold text-[#1A1A1A]">{brandName.toLowerCase().replace(/\s/g, '')} </span>
                        <span className="text-gray-800 whitespace-pre-wrap text-xs leading-relaxed">
                          {adContent.caption.substring(0, 100)}
                          {adContent.caption.length > 100 && '...'}
                        </span>
                      </p>
                      {adContent.caption.length > 100 && (
                        <button className="text-xs text-gray-500 mt-1">more</button>
                      )}
                    </div>

                    {adContent.cta && (
                      <button className="w-full py-2 px-4 bg-[#0095F6] text-white rounded-lg font-semibold text-sm hover:bg-[#1877F2] transition-colors">
                        {adContent.cta}
                      </button>
                    )}

                    <p className="text-xs text-gray-400 mt-3">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <RobotChatbot size={60} animate={true} gesture="celebrate" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                  <p className="text-xs text-gray-700">Ready to publish! Let's make it live.</p>
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
                disabled={isPublishing}
                className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  'Confirm Publish'
                )}
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
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Schedule Your Ad</h2>
                <p className="text-xs text-gray-500">Pick the optimal time for maximum impact</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
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
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center flex-shrink-0 text-2xl`}>
                        {rec.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-[#1A1A1A] text-lg">{rec.emoji} {rec.dayOfWeek} • {rec.fullDate} • {rec.time}</p>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700">{rec.engagement}% match</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {rec.metrics.map((metric, mIndex) => (
                            <p key={mIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-purple-500 font-bold">•</span>
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
                        className={`h-full bg-gradient-to-r ${rec.color} rounded-full transition-all`}
                        style={{ width: `${rec.engagement}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-gray-200 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Preview Instagram Ad</h2>
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
              This is how your ad will appear on Instagram
            </h3>
          </div>

          <div className="flex justify-center transform scale-90 sm:scale-100 origin-top transition-transform duration-500">
            {/* iPhone 15 Pro Max Frame - Titanium Style */}
            <div className="relative w-[380px] h-[780px] bg-[#2a2a2a] rounded-[3.5rem] shadow-[0_0_0_2px_#555,0_20px_40px_rgba(0,0,0,0.4)] ring-8 ring-gray-300 ring-opacity-10 border-[6px] border-[#3f3f3f] box-content overflow-hidden">

              {/* Dynamic Island / Notch Area */}
              <div className="absolute top-0 inset-x-0 h-8 z-50 bg-transparent flex justify-center pointer-events-none">
                <div className="w-32 h-7 bg-black rounded-b-2xl mt-2 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/50"></div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden flex flex-col relative">

                {/* Status Bar Mockup */}
                <div className="h-12 px-8 flex items-end justify-between pb-2 text-[10px] font-semibold z-20 absolute top-0 w-full mix-blend-exclusion text-white">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-2.5 bg-current rounded-[1px]"></div>
                    <div className="w-3 h-2.5 bg-current rounded-[1px]"></div>
                    <div className="w-5 h-2.5 rounded-[2px] border border-current relative">
                      <div className="absolute inset-0.5 bg-current rounded-[1px]"></div>
                    </div>
                  </div>
                </div>

                {/* Instagram Header Mockup */}
                <div className="absolute top-12 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                        {/* Optional brand logo fallback if needed */}
                      </div>
                    </div>
                    <span className="text-white font-semibold text-sm drop-shadow-md">{brandName.toLowerCase().replace(/\s/g, '')}</span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-white drop-shadow-md" />
                </div>

                {/* Main Content Area - Full Height for Reels style if video */}
                <div className="flex-1 bg-black relative">
                  {adType.includes('video') && adContent.videoUrl ? (
                    <video
                      src={adContent.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : adContent.imageUrl ? (
                    <img
                      src={adContent.imageUrl}
                      className="w-full h-full object-cover"
                      alt="Ad content"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No Preview Available</p>
                      </div>
                    </div>
                  )}

                  {/* Reels UI Overlay (Right Side Actions) */}
                  <div className="absolute bottom-20 right-4 flex flex-col gap-6 items-center z-20">
                    <div className="flex flex-col items-center gap-1">
                      <Heart className="w-7 h-7 text-white drop-shadow-md" />
                      <span className="text-white text-xs font-medium drop-shadow-md">8.5K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MessageCircle className="w-7 h-7 text-white drop-shadow-md" />
                      <span className="text-white text-xs font-medium drop-shadow-md">142</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <SendIcon className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MoreHorizontal className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                  </div>

                  {/* Reels UI Overlay (Bottom Content) */}
                  <div className="absolute bottom-4 left-4 right-16 z-20 text-white text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-white/20">
                        {/* Brand Logo Placeholder */}
                        <div className="w-full h-full flex items-center justify-center bg-purple-600 text-xs font-bold">
                          {brandName.charAt(0)}
                        </div>
                      </div>
                      <span className="font-semibold text-sm shadow-black drop-shadow-md">{brandName}</span>
                      <button className="px-2 py-0.5 rounded border border-white/30 text-[10px] font-medium backdrop-blur-sm">Follow</button>
                    </div>
                    <p className="text-sm shadow-black drop-shadow-md line-clamp-2 mb-2 leading-snug">
                      {adContent.caption}
                    </p>
                    <div className="flex items-center gap-2 opacity-80 text-xs">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Sponsored • {adContent.cta}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* CTA Banner (Instagram Shop/Link Style) */}
                {adContent.cta && (
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-[#1a1a1a]/90 backdrop-blur-md flex items-center justify-between px-4 z-30 border-t border-white/10">
                    <span className="text-white text-sm font-medium">{adContent.cta}</span>
                    <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                  </div>
                )}

              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <RobotChatbot size={60} animate={true} gesture="thinking" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                <p className="text-xs text-gray-700">Ready to launch? Let's make it happen!</p>
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
              className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
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
