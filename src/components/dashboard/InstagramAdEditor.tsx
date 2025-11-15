import { useState } from 'react';
import { X, Send, Video, Image as ImageIcon, Sparkles } from 'lucide-react';
import Foundi from '../Foundii';

interface InstagramAdEditorProps {
  isOpen: boolean;
  onClose: () => void;
  adContent: {
    caption: string;
    cta: string;
    videoUrl: string;
    imageUrl: string;
  };
  onSave: (content: typeof adContent) => void;
  brandName: string;
}

export default function InstagramAdEditor({ isOpen, onClose, adContent, onSave, brandName }: InstagramAdEditorProps) {
  const [content, setContent] = useState(adContent);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; message: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const suggestions = [
    'Make the hook punchier',
    'Add a countdown timer overlay',
    'Change the background color',
    'Rewrite caption in bold founder tone',
    'Add more emojis',
    'Make it more urgent'
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatHistory([...chatHistory, { role: 'user', message: chatInput }]);
    setIsProcessing(true);

    setTimeout(() => {
      let assistantMessage = '';
      let updatedContent = { ...content };

      if (chatInput.toLowerCase().includes('punchier') || chatInput.toLowerCase().includes('hook')) {
        assistantMessage = 'I\'ve made the opening hook more attention-grabbing with a bold statement!';
        updatedContent.caption = '🚨 STOP SCROLLING 🚨\n\n' + content.caption;
      } else if (chatInput.toLowerCase().includes('emoji')) {
        assistantMessage = 'Added strategic emojis to boost engagement!';
        updatedContent.caption = content.caption.replace(/\./g, '. ✨');
      } else if (chatInput.toLowerCase().includes('founder') || chatInput.toLowerCase().includes('bold')) {
        assistantMessage = 'Rewrote in a bold, authentic founder voice!';
        updatedContent.caption = 'Here\'s the truth nobody tells you...\n\n' + content.caption;
      } else if (chatInput.toLowerCase().includes('urgent')) {
        assistantMessage = 'Added urgency to drive immediate action!';
        updatedContent.caption = content.caption + '\n\n⏰ Limited time offer - Act now!';
      } else {
        assistantMessage = 'Great idea! I\'ve updated your ad content based on your feedback.';
      }

      setContent(updatedContent);
      setChatHistory(prev => [...prev, { role: 'assistant', message: assistantMessage }]);
      setIsProcessing(false);
      setChatInput('');
    }, 1500);
  };

  const handleSave = () => {
    onSave(content);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden animate-scale-in flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Edit Instagram Ad</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden grid md:grid-cols-2 gap-6 p-8">
          <div className="space-y-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Ad Preview</h3>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl aspect-[9/16] flex items-center justify-center">
                {content.videoUrl ? (
                  <div className="text-center">
                    <Video className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-700 font-medium">Video Content</p>
                    <p className="text-xs text-gray-600 mt-1">Reel-style vertical video</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-700 font-medium">Image Content</p>
                    <p className="text-xs text-gray-600 mt-1">1080x1350 optimal size</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Caption</h3>
              <textarea
                value={content.caption}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A] resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">{content.caption.length} characters</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Call-to-Action</h3>
              <select
                value={content.cta}
                onChange={(e) => setContent({ ...content, cta: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
              >
                <option value="Shop Now">Shop Now</option>
                <option value="Learn More">Learn More</option>
                <option value="Sign Up">Sign Up</option>
                <option value="Book Now">Book Now</option>
                <option value="Get Started">Get Started</option>
                <option value="Download">Download</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Foundi size={40} animate={false} gesture="idle" />
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">Refine with Foundi</h3>
                  <p className="text-xs text-gray-600">Ask me to improve your ad</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Try asking me to:</p>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatInput(suggestion);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="w-full text-left px-4 py-3 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-sm text-gray-700"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {chat.role === 'assistant' && (
                        <Foundi size={32} animate={false} gesture="idle" />
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-xl ${
                          chat.role === 'user'
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{chat.message}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex gap-3 justify-start">
                      <Foundi size={32} animate={true} gesture="thinking" />
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl">
                        <p className="text-sm text-gray-600">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Foundi to refine your ad..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isProcessing}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
