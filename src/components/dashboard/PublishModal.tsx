import { useState } from 'react';
import { X, Linkedin, Calendar, Clock, Check, Sparkles } from 'lucide-react';
import Foundii from '../Foundii';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (scheduled: boolean, date?: string, time?: string) => void;
}

export default function PublishModal({ isOpen, onClose, onPublish }: PublishModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const recommendedTimes = [
    { time: 'Tuesday, 10:00 AM', reason: 'Peak engagement for B2B' },
    { time: 'Wednesday, 3:00 PM', reason: 'High click-through rate' },
    { time: 'Thursday, 9:00 AM', reason: 'Best for thought leadership' },
  ];

  const handleConnect = () => {
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onPublish(publishMode === 'schedule', selectedDate, selectedTime);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsConnected(false);
    setPublishMode('now');
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
            {publishMode === 'now' ? 'Your post is live!' : 'Your post is scheduled!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {publishMode === 'now'
              ? 'Successfully published to LinkedIn'
              : `Will be published on ${selectedDate} at ${selectedTime}`}
          </p>
          <div className="flex justify-center">
            <Foundii size={80} animate={true} gesture="celebrate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
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
          {!isConnected ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto">
                <Linkedin className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Connect your LinkedIn account
                </h3>
                <p className="text-gray-600">
                  Authorize Foundrly to post on your behalf
                </p>
              </div>
              <button
                onClick={handleConnect}
                className="bg-[#0A66C2] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#004182] transition-all hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
              >
                <Linkedin className="w-5 h-5" />
                Connect LinkedIn
              </button>
              <div className="flex justify-center mt-8">
                <Foundii size={60} animate={true} gesture="wave" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">LinkedIn account connected</span>
              </div>

              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Choose when to publish</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPublishMode('now')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      publishMode === 'now'
                        ? 'border-[#1A1A1A] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sparkles className={`w-6 h-6 mb-2 ${publishMode === 'now' ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                    <p className="font-medium text-[#1A1A1A]">Publish Now</p>
                    <p className="text-sm text-gray-600">Go live immediately</p>
                  </button>

                  <button
                    onClick={() => setPublishMode('schedule')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      publishMode === 'schedule'
                        ? 'border-[#1A1A1A] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className={`w-6 h-6 mb-2 ${publishMode === 'schedule' ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                    <p className="font-medium text-[#1A1A1A]">Schedule</p>
                    <p className="text-sm text-gray-600">Pick the perfect time</p>
                  </button>
                </div>
              </div>

              {publishMode === 'schedule' && (
                <div className="space-y-4 animate-slide-in">
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
                      <h4 className="font-semibold text-[#1A1A1A]">AI Recommendations</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Best times to post based on industry benchmarks</p>
                    <div className="space-y-2">
                      {recommendedTimes.map((rec, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const [day, timeStr] = rec.time.split(', ');
                            setSelectedTime(timeStr);
                          }}
                          className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all text-left"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#1A1A1A]">{rec.time}</p>
                            <p className="text-xs text-gray-600">{rec.reason}</p>
                          </div>
                          <Clock className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -bottom-2 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                      <p className="text-xs text-gray-700">I'll publish it at the perfect moment.</p>
                    </div>
                    <div className="flex justify-end">
                      <Foundii size={60} animate={true} gesture="thinking" />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePublish}
                disabled={publishMode === 'schedule' && (!selectedDate || !selectedTime)}
                className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishMode === 'now' ? 'Publish Now' : 'Schedule Post'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
