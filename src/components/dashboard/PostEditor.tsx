import { useState } from 'react';
import { X, Undo2, Send, Sparkles } from 'lucide-react';
import Foundii from '../Foundii';

interface PostEditorProps {
  initialPost: string;
  brandName: string;
  onClose: () => void;
  onSave: (post: string) => void;
}

export default function PostEditor({ initialPost, brandName, onClose, onSave }: PostEditorProps) {
  const [editedPost, setEditedPost] = useState(initialPost);
  const [chatMessages, setChatMessages] = useState([
    { role: 'foundii', text: 'Hi! I can help refine your post. Try asking me to make it shorter, more bold, add a CTA, or anything else!' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickActions = [
    'Make it more bold',
    'More professional tone',
    'Make it shorter',
    'Add a strong CTA',
    'Rewrite the intro',
    'Add more personality'
  ];

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSendMessage = (message?: string) => {
    const msgToSend = message || userMessage;
    if (!msgToSend.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', text: msgToSend }]);
    setUserMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      let newPost = editedPost;
      const lowerMsg = msgToSend.toLowerCase();

      if (lowerMsg.includes('shorter') || lowerMsg.includes('concise')) {
        newPost = editedPost.split('\n').slice(0, 15).join('\n') + '\n\n#Leadership #Growth';
      } else if (lowerMsg.includes('bold') || lowerMsg.includes('confident')) {
        newPost = editedPost.replace('Here\'s what', '💥 Here\'s what').replace('Over the past', '🔥 Over the past');
      } else if (lowerMsg.includes('professional')) {
        newPost = editedPost.replace(/🚀|💥|🔥|👇/g, '');
      } else if (lowerMsg.includes('cta') || lowerMsg.includes('call to action')) {
        newPost = editedPost + '\n\n📩 Want help with your visibility strategy? DM me "GROW" and let\'s talk.';
      } else if (lowerMsg.includes('intro') || lowerMsg.includes('beginning')) {
        newPost = `💡 ${context.topic}\n\nLet me share something that changed everything for my clients:\n\n` + editedPost.split('\n').slice(2).join('\n');
      }

      setEditedPost(newPost);
      setChatMessages(prev => [...prev, {
        role: 'foundii',
        text: 'Done! I\'ve updated your post. Check the preview on the left. Want any other changes?'
      }]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleUndo = () => {
    setEditedPost(initialPost);
    setChatMessages([...chatMessages, {
      role: 'foundii',
      text: 'Reverted to the original version!'
    }]);
  };

  const handleSaveAndClose = () => {
    onSave(editedPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Edit Post</h2>
            <button
              onClick={handleUndo}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6 p-8 overflow-hidden">
          <div className="space-y-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Post Editor</h3>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Founder at {brandName}</p>
                </div>
              </div>
              <textarea
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                className="w-full min-h-[400px] text-[#1A1A1A] leading-relaxed resize-none outline-none font-sans"
                placeholder="Write your post here..."
              />
            </div>
            <div className="text-sm text-gray-500">
              {editedPost.length} characters
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Foundii size={40} animate={true} gesture="thinking" />
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">Refine with Foundii</h3>
                  <p className="text-sm text-gray-600">Ask me to adjust your post</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'foundii' && (
                    <div className="flex-shrink-0">
                      <Foundii size={32} animate={false} gesture="idle" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 max-w-md ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                        : 'bg-white text-gray-700 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Foundii size={32} animate={true} gesture="thinking" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg text-xs text-gray-700 border border-gray-200 transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Foundii to refine your post..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-sm"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!userMessage.trim()}
                  className="p-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
