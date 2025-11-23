import { useState } from 'react';
import { X, Mail, Check, ArrowLeft, Sparkles, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';

interface NewsletterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  newsletterContent: {
    subject: string;
    preheader: string;
    title: string;
    intro: string;
    sections: { title: string; content: string }[];
    cta: string;
    ctaUrl: string;
  };
  brandName: string;
}

export default function NewsletterPreview({ isOpen, onClose, newsletterContent, brandName }: NewsletterPreviewProps) {
  const [step, setStep] = useState<'preview' | 'connect' | 'schedule' | 'confirmPublish' | 'success'>('preview');
  const [email, setEmail] = useState('');
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
      dayOfWeek: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '9:14 AM',
      emoji: '⭐',
      label: 'Highest open rate window',
      metrics: [
        'Expected +31% open rate',
        '+24% click-through vs average'
      ],
      reason: 'Best for morning readers',
      engagement: 94
    },
    {
      dayOfWeek: upcomingDates[3].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[3].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '7:42 PM',
      emoji: '✨',
      label: 'Evening engagement peak',
      metrics: [
        '+22% click-through',
        'Strong for newsletters'
      ],
      reason: 'Prime time for long-form content',
      engagement: 87
    },
    {
      dayOfWeek: upcomingDates[6].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '6:10 PM',
      emoji: '🌙',
      label: 'Weekend leisure reading',
      metrics: [
        'High engagement for long-form',
        '+19% read completion'
      ],
      reason: 'Perfect for deep-dive content',
      engagement: 82
    }
  ];

  const handleConnect = () => {
    if (!email) return;
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
    setEmail('');
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
            Newsletter Sent!
          </h2>
          <p className="text-gray-600">
            Your newsletter is on its way to your subscribers.
          </p>
          <div className="flex justify-center mt-6">
            <RobotChatbot size={60} animate={true} gesture="celebrate" />
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
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Connect Email Provider</h2>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    Connect Your Email Platform
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Link Mailchimp, HubSpot, or your SMTP provider
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                  />
                </div>

                <button
                  onClick={handleConnect}
                  disabled={!email}
                  className="w-full bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5" />
                  Connect Email Provider
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
                  <p className="text-gray-600">Ready to send your newsletter.</p>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <RobotChatbot size={60} animate={true} gesture="celebrate" />
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Confirm & Send</h2>
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
                Ready to send this newsletter?
              </h3>
              <p className="text-gray-600">Review before sending to your subscribers</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="font-semibold text-[#1A1A1A]">{newsletterContent.subject}</p>
              </div>
              <div className="border-b border-gray-200 pb-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Preheader</p>
                <p className="text-sm text-gray-600">{newsletterContent.preheader}</p>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">{newsletterContent.title}</h3>
              <p className="text-gray-700 mb-4">{newsletterContent.intro}</p>
              <div className="space-y-3">
                {newsletterContent.sections.slice(0, 2).map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.content.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <RobotChatbot size={60} animate={true} gesture="celebrate" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                  <p className="text-xs text-gray-700">Ready to send! Your subscribers will love this.</p>
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
                Send Newsletter
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
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Schedule Newsletter</h2>
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

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-2xl">
                        {rec.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-[#1A1A1A] text-lg">{rec.emoji} {rec.dayOfWeek} • {rec.fullDate} • {rec.time}</p>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700">{rec.engagement}% match</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {rec.metrics.map((metric, mIndex) => (
                            <p key={mIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 font-bold">•</span>
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
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${rec.engagement}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 border border-gray-200 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Preview Newsletter</h2>
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
              Email Preview
            </h3>
            <p className="text-gray-600">This is how your newsletter will appear in inboxes</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{brandName}</p>
                  <p className="text-xs opacity-90">newsletter@{brandName.toLowerCase().replace(/\s/g, '')}.com</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <p className="text-xs text-gray-500 mb-1">Subject: {newsletterContent.subject}</p>
              <p className="text-xs text-gray-400 mb-6">{newsletterContent.preheader}</p>

              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">{newsletterContent.title}</h1>
              <p className="text-gray-700 leading-relaxed mb-6">{newsletterContent.intro}</p>

              {newsletterContent.sections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}

              <div className="text-center mt-8">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md">
                  {newsletterContent.cta}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>© 2024 {brandName}. All rights reserved.</p>
                <p className="mt-2">
                  <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> | <a href="#" className="text-blue-600 hover:underline">Update Preferences</a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <RobotChatbot size={60} animate={true} gesture="thinking" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                <p className="text-xs text-gray-700">Looking good! Ready to send?</p>
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
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
