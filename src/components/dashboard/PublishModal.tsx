import { useState } from 'react';
import { X, Linkedin, Calendar, Clock, Check, Sparkles, ArrowLeft, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send as SendIcon, TrendingUp, BarChart3 } from 'lucide-react';
import Foundi from '../Foundii';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (scheduled: boolean, date?: string, time?: string) => void;
  post: string;
  brandName: string;
}

export default function PublishModal({ isOpen, onClose, onPublish, post, brandName }: PublishModalProps) {
  const [step, setStep] = useState<'connect' | 'preview' | 'schedule'>('connect');
  const [linkedinEmail, setLinkedinEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const recommendedTimes = [
    {
      time: '9:12 AM',
      label: 'Highest engagement window',
      metrics: [
        'Predicted +24% more reach',
        '+18% more likes vs your median',
        'Based on your last 10 posts'
      ],
      reason: 'Best for thought leadership'
    },
    {
      time: '12:58 PM',
      label: 'Peak founder visibility',
      metrics: [
        'Predicted +19% more reach',
        '+22% more comments',
        'High decision-maker activity'
      ],
      reason: 'Great for founder stories'
    },
    {
      time: '5:21 PM',
      label: 'Maximum scroll time',
      metrics: [
        'Predicted +16% more reach',
        '+15% higher engagement rate',
        'Evening wind-down period'
      ],
      reason: 'Peak scroll time in your audience region'
    },
  ];

  const handleConnect = () => {
    if (!linkedinEmail) return;
    setTimeout(() => {
      setIsConnected(true);
      setTimeout(() => {
        setStep('preview');
      }, 1000);
    }, 800);
  };

  const handlePublishNow = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onPublish(false);
      handleClose();
    }, 2500);
  };

  const handleScheduleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onPublish(true, selectedDate, selectedTime);
      handleClose();
    }, 2500);
  };

  const handleClose = () => {
    setStep('connect');
    setLinkedinEmail('');
    setIsConnected(false);
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
            {step === 'schedule' ? 'Your post is scheduled!' : 'Your post is live!'}
          </h2>
          <p className="text-gray-600 mb-2">
            {step === 'schedule'
              ? `Will be published on ${selectedDate} at ${selectedTime}`
              : 'Successfully published to LinkedIn'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can track performance in Analytics.
          </p>
          <div className="flex justify-center">
            <Foundi size={80} animate={true} gesture="celebrate" />
          </div>
        </div>
      </div>
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
          {step === 'connect' && !isConnected && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto">
                <Linkedin className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Connect LinkedIn
                </h3>
                <p className="text-gray-600">
                  Enter the email associated with your LinkedIn account
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <input
                  type="email"
                  value={linkedinEmail}
                  onChange={(e) => setLinkedinEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A] mb-4"
                />
                <button
                  onClick={handleConnect}
                  disabled={!linkedinEmail}
                  className="w-full bg-[#0A66C2] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#004182] transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Linkedin className="w-5 h-5" />
                  Authenticate & Connect
                </button>
              </div>
              <div className="flex justify-center mt-8">
                <Foundi size={60} animate={true} gesture="wave" />
              </div>
            </div>
          )}

          {step === 'connect' && isConnected && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Connected!
                </h3>
                <p className="text-gray-600">Ready to publish.</p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <Foundi size={60} animate={true} gesture="celebrate" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Connected! Ready to publish.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Here's how your post will look on LinkedIn
                </h3>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-lg">
                          SJ
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-[#1A1A1A] text-[15px]">Sarah Johnson</p>
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

              <div className="flex justify-center">
                <div className="relative">
                  <Foundi size={60} animate={true} gesture="thinking" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Looks good? Let's publish or schedule it.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Edit in Editor
                </button>
                <button
                  onClick={() => setStep('connect')}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Back
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
          )}

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
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-[#1A1A1A]">{rec.time}</p>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <BarChart3 className="w-3 h-3" />
                              <span>Optimal</span>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-2">⭐ {rec.label}</p>
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
                          style={{ width: `${85 - (index * 10)}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-700 text-center">
                  Pick a recommended time to maximize your visibility. I'll handle the rest.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <Foundi size={60} animate={true} gesture="thinking" />
                  <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                    <p className="text-xs text-gray-700">I'll publish automatically at the optimal time.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleScheduleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Schedule
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
      </div>
    </div>
  );
}
