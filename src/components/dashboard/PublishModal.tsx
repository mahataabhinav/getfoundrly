import { useState } from 'react';
import { X, Linkedin, Calendar, Clock, Check, Sparkles, ArrowLeft } from 'lucide-react';
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
    { time: '9:12 AM', reason: 'Highest engagement in your industry' },
    { time: '12:58 PM', reason: 'Best for founder-led content' },
    { time: '5:21 PM', reason: 'Peak visibility window for your audience' },
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
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Preview Your LinkedIn Post
                </h3>
                <p className="text-gray-600">
                  Review how your post will appear on LinkedIn
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Founder at {brandName}</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-[#1A1A1A] leading-relaxed text-[15px]">
                      {post}
                    </pre>
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
                  onClick={handlePublishNow}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  Publish Now
                </button>
                <button
                  onClick={() => setStep('schedule')}
                  className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Schedule for Later
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors"
                >
                  Back to Edit
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
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-[#1A1A1A]">AI Recommended Times</h4>
                </div>
                <div className="space-y-3">
                  {recommendedTimes.map((rec, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(rec.time)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A] mb-0.5">{rec.time}</p>
                          <p className="text-xs text-gray-600">{rec.reason}</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
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
