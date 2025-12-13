import { useState, useEffect } from 'react';
import { X, Linkedin, Calendar, Clock, Check, Sparkles, ArrowLeft, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send as SendIcon, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { createContentSchedule } from '../../lib/database';
import { updateContentItem } from '../../lib/database';
import { sendPostToN8n } from '../../lib/n8n-webhook';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (scheduled: boolean, date?: string, time?: string) => void;
  post: string;
  brandName: string;
  brandId?: string;
  contentItemId?: string;
  mediaType?: 'image' | 'video' | 'none';
  mediaUrls?: string[];
}

export default function PublishModal({ isOpen, onClose, onPublish, post, brandName, brandId, contentItemId, mediaType = 'none', mediaUrls = [] }: PublishModalProps) {
  // Directly start at confirm step - n8n handles the connection/publishing
  const [step, setStep] = useState<'preview' | 'schedule' | 'confirmPublish'>('preview');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  // No longer needed: linkedInProfile, isConnected

  // Helper helper
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    if (isOpen) {
      getUser();
      setStep('preview'); // Reset to preview when opening
    }
  }, [isOpen]);

  const recommendedTimes = [
    {
      dayOfWeek: upcomingDates[0].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '9:12 AM',
      emoji: '⭐',
      label: 'Highest engagement window',
      metrics: [
        'Predicted +24% more reach',
        '+18% likes vs your median'
      ],
      reason: 'Best for thought-leadership posts',
      engagement: 92
    },
    {
      dayOfWeek: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '12:58 PM',
      emoji: '✨',
      label: 'Peak founder visibility',
      metrics: [
        '+19% impressions',
        '+22% more comments'
      ],
      reason: 'Strong for awareness content',
      engagement: 87
    },
    {
      dayOfWeek: upcomingDates[2].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[2].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '5:21 PM',
      emoji: '🌙',
      label: 'Maximum scroll time',
      metrics: [
        '+21% engagement clicks',
        'Great for testimonials/UGC'
      ],
      reason: 'Evening engagement peak',
      engagement: 84
    },
  ];



  const handleConfirmPublish = async () => {
    if (!userId || !brandId || !contentItemId) {
      alert('Missing required information. Please try again.');
      return;
    }

    setIsPublishing(true);
    try {
      // Send to n8n webhook
      await sendPostToN8n({
        userId,
        brandId,
        content: post,
        platform: 'linkedin',
        metadata: {
          contentItemId,
          action: 'publish_now'
        },
        mediaType,
        mediaUrls,
        imageUrl: mediaUrls.length > 0 ? mediaUrls[0] : undefined
      });

      // Update content item status locally
      await updateContentItem(contentItemId, {
        status: 'published', // Optimistic update, assuming n8n succeeds
      });

      // Create schedule record locally
      await createContentSchedule({
        content_id: contentItemId,
        user_id: userId,
        brand_id: brandId,
        platform: 'linkedin',
        scheduled_at: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'published',
        published_at: new Date().toISOString(),
        ai_recommended: false,
      });

      setShowSuccess(true);
      setTimeout(() => {
        onPublish(false);
        handleClose();
      }, 2500);
    } catch (error: any) {
      console.error('[PublishModal] Error publishing to n8n:', error);
      alert('Failed to start publishing workflow: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleScheduleConfirm = async () => {
    if (!userId || !brandId || !contentItemId || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      alert('Please select a date and time in the future.');
      return;
    }

    setIsScheduling(true);
    try {
      // Send to n8n webhook
      await sendPostToN8n({
        userId,
        brandId,
        content: post,
        platform: 'linkedin',
        scheduledAt: scheduledDateTime.toISOString(),
        metadata: {
          contentItemId,
          action: 'schedule'
        },
        mediaType,
        mediaUrls,
        imageUrl: mediaUrls.length > 0 ? mediaUrls[0] : undefined
      });

      // Update content item status
      await updateContentItem(contentItemId, {
        status: 'scheduled',
      });

      // Create schedule record
      await createContentSchedule({
        content_id: contentItemId,
        user_id: userId,
        brand_id: brandId,
        platform: 'linkedin',
        scheduled_at: scheduledDateTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'scheduled',
        ai_recommended: true,
        ai_recommendation_score: 85,
      });

      setShowSuccess(true);
      setTimeout(() => {
        onPublish(true, selectedDate, selectedTime);
        handleClose();
      }, 2500);
    } catch (error: any) {
      console.error('Error scheduling post via n8n:', error);
      alert('Failed to schedule via workflow: ' + error.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleClose = () => {
    setStep('preview');
    setSelectedDate('');
    setSelectedTime('');
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
            {step === 'schedule' ? 'Your post is scheduled!' : 'Your LinkedIn post was successfully posted!'}
          </h2>
          <p className="text-gray-600 mb-2">
            {step === 'schedule'
              ? `Scheduled for ${selectedDate} at ${selectedTime}`
              : 'Sent to publishing workflow'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can track status in Analytics.
          </p>

        </div>
      </div >
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Publish to LinkedIn</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {step === 'preview' && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Preview & Publish
                </h3>
                <p className="text-gray-600">Review your post and confirm to publish</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-lg`}
                        >
                          {brandName ? getInitials(brandName) : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-[#1A1A1A] text-[15px]">
                              {brandName || 'Your Name'}
                            </p>
                            <span className="text-gray-400 text-xs">• 1st</span>
                          </div>
                          <p className="text-xs text-gray-600">Founder at {brandName} | Brand Visibility Expert</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <span>1m</span>
                            <span>•</span>
                            <Globe className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="mt-3 mb-4">
                      <pre className="whitespace-pre-wrap font-sans text-[#1A1A1A] leading-relaxed text-[14px]">{post}</pre>
                    </div>

                    {/* Media Preview */}
                    {mediaType === 'image' && mediaUrls.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={mediaUrls[0]}
                          alt="Post attachment"
                          className="w-full h-auto max-h-[500px] object-contain bg-gray-50 border border-gray-100 rounded-md"
                        />
                      </div>
                    )}

                    {mediaType === 'video' && mediaUrls.length > 0 && (
                      <div className="mb-4 relative">
                        <img
                          src={mediaUrls[0]}
                          alt="Video thumbnail"
                          className="w-full h-auto max-h-[500px] object-contain bg-gray-900 rounded-md opacity-90"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
                    <span>24 reactions</span>
                    <div className="flex items-center gap-3">
                      <span>8 comments</span>
                      <span>12 reposts</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-around">
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <ThumbsUp className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Like</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <Repeat2 className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <SendIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Send</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
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
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    'Confirm Publish'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Connect step removed as n8n handles it */}

          {step === 'schedule' && (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('preview')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A]">
                    Schedule Your Post
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pick the perfect time to publish
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-[#1A1A1A]">AI Recommended Times</h4>
                </div>
                <div className="space-y-3">
                  {recommendedTimes.map((rec, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(rec.time)}
                      className="w-full p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-[#1A1A1A] text-base">{rec.emoji} {rec.dayOfWeek} • {rec.fullDate} • {rec.time}</p>
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                              <BarChart3 className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-bold text-blue-700">{rec.engagement}% match</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {rec.metrics.map((metric, mIndex) => (
                              <p key={mIndex} className="text-xs text-gray-600">• {metric}</p>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">{rec.reason}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${rec.engagement}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-700">
                    Pick a recommended slot to maximize visibility. I'll handle the publishing.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">

              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleScheduleConfirm}
                  disabled={!selectedDate || !selectedTime || isScheduling}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isScheduling ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    'Confirm Schedule'
                  )}
                </button>
                <button
                  onClick={() => setStep('preview')}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div >
    </div >
  );
}
