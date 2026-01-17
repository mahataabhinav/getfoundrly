import { useState } from 'react';
import { refinePostContent } from '../../lib/openai';
import { Undo2, Send, Sparkles, XCircle, MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Send as SendIcon, Globe } from 'lucide-react';
import VoiceInput from '../VoiceInput';
import type { GeneratedImage } from '../../lib/asset-generator';
import { motion } from 'framer-motion';

interface PostEditorProps {
  initialPost: string;
  brandName: string;
  selectedImage?: GeneratedImage | null;
  onClose: () => void;
  onSave: (post: string, image?: GeneratedImage | null) => void;
  onImageChange?: (image: GeneratedImage | null) => void;
}

export default function PostEditor({
  initialPost,
  brandName,
  selectedImage,
  onClose,
  onSave,
  onImageChange
}: PostEditorProps) {
  const [editedPost, setEditedPost] = useState(initialPost);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(selectedImage || null);
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

  const handleSendMessage = async (message?: string) => {
    const msgToSend = message || userMessage;
    if (!msgToSend.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', text: msgToSend }]);
    setUserMessage('');
    setIsProcessing(true);

    try {
      // Use AI to refine the post
      const refinedPost = await refinePostContent(editedPost, msgToSend, brandName);
      setEditedPost(refinedPost);

      setChatMessages(prev => [...prev, {
        role: 'foundii',
        text: 'Done! I\'ve updated your post. Check the preview on the left. Want any other changes?'
      }]);
    } catch (error) {
      console.error('Error refining post:', error);
      setChatMessages(prev => [...prev, {
        role: 'foundii',
        text: 'Sorry, I encountered an error. Please try again or rephrase your request.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    setEditedPost(initialPost);
    setChatMessages([...chatMessages, {
      role: 'foundii',
      text: 'Reverted to the original version!'
    }]);
  };

  const handleSaveAndClose = () => {
    onSave(editedPost, currentImage);
    onClose();
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
    onImageChange?.(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Edit Post</h2>
            <button
              onClick={handleUndo}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 transition-all"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-500 hover:text-[#1A1A1A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-6 py-2 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-black transition-all shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
          {/* Left Column: Post Preview/Editor */}
          <div className="p-8 overflow-y-auto bg-[#F3F2EF] border-r border-gray-200">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">LinkedIn Preview</h3>
                <span className="text-xs text-gray-400">{editedPost.length} chars</span>
              </div>

              {/* LinkedIn Post Card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Post Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {brandName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-[#1A1A1A] text-[15px] truncate">{brandName}</span>
                      <span className="text-gray-500 text-sm">• Following</span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">12,453 followers</p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                      <span>1h • </span>
                      <Globe className="w-3 h-3" />
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-[#1A1A1A] p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content (Editable) */}
                <div className="px-4 pb-2">
                  <textarea
                    value={editedPost}
                    onChange={(e) => setEditedPost(e.target.value)}
                    className="w-full bg-transparent border-none text-[#1A1A1A] text-[15px] leading-relaxed resize-none focus:ring-0 p-0 min-h-[150px] placeholder-gray-400 focus:outline-none"
                    placeholder="What do you want to talk about?"
                    spellCheck={false}
                    style={{ fieldSizing: 'content' } as any}
                  />
                </div>

                {/* Post Image */}
                {currentImage && (
                  <div className="relative group mt-2">
                    <img
                      src={currentImage.url}
                      alt="Post content"
                      className="w-full object-cover max-h-[500px]"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      title="Remove image"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-xs text-white rounded-full backdrop-blur-sm">
                      {currentImage.variation || 'Generated Image'}
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                        <ThumblikeIcon className="w-2.5 h-2.5 text-white fill-current" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-white">
                        <HeartIcon className="w-2.5 h-2.5 text-white fill-current" />
                      </div>
                    </div>
                    <span>148</span>
                  </div>
                  <div className="flex gap-2">
                    <span>32 comments</span>
                    <span>•</span>
                    <span>12 reposts</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-2 py-1 flex items-center justify-between">
                  <ActionButton icon={ThumbsUp} label="Like" />
                  <ActionButton icon={MessageSquare} label="Comment" />
                  <ActionButton icon={Repeat2} label="Repost" />
                  <ActionButton icon={SendIcon} label="Send" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Chat */}
          <div className="flex flex-col bg-white h-full relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">Refine with Foundi</h3>
                  <p className="text-sm text-gray-500">Ask me to adjust your post</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
              {chatMessages.length <= 1 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                  <div className="relative mb-6 group cursor-pointer" onClick={() => handleQuickAction("Vibe check check this post")}>
                    <img
                      src="/foundi-mascot-v3.png"
                      alt="Foundi Mascot"
                      className="relative w-40 h-40 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-300 ease-out mix-blend-multiply"
                    />
                    <div className="absolute -right-4 -top-2 bg-white px-3 py-1 rounded-full shadow-lg border border-gray-100 transform rotate-12 animate-bounce hover:rotate-6 transition-all">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">slay! ✨</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3 tracking-tight">
                    Yo! I'm Foundi <span className="inline-block animate-wave">👋</span>
                  </h3>

                  <p className="text-gray-600 font-medium max-w-sm leading-relaxed mb-8 text-[15px]">
                    Let me help you cook up something fire! 🔥 Just ask me to tweak the vibe or fix the grammar, fr fr.
                  </p>

                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm opacity-90">
                    <button onClick={() => handleQuickAction("Make this go viral")} className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#CCFF00] hover:shadow-md transition-all text-sm font-medium text-left flex items-center gap-2 group">
                      <span className="text-lg group-hover:scale-125 transition-transform">🚀</span>
                      <span className="text-gray-600 group-hover:text-[#1A1A1A]">Make it viral</span>
                    </button>
                    <button onClick={() => handleQuickAction("Add more riz")} className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#CCFF00] hover:shadow-md transition-all text-sm font-medium text-left flex items-center gap-2 group">
                      <span className="text-lg group-hover:scale-125 transition-transform">✨</span>
                      <span className="text-gray-600 group-hover:text-[#1A1A1A]">Add more rizz</span>
                    </button>
                    <button onClick={() => handleQuickAction("Fix the grammar")} className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#CCFF00] hover:shadow-md transition-all text-sm font-medium text-left flex items-center gap-2 group">
                      <span className="text-lg group-hover:scale-125 transition-transform">📝</span>
                      <span className="text-gray-600 group-hover:text-[#1A1A1A]">Fix grammar</span>
                    </button>
                    <button onClick={() => handleQuickAction("Roast this post")} className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#CCFF00] hover:shadow-md transition-all text-sm font-medium text-left flex items-center gap-2 group">
                      <span className="text-lg group-hover:scale-125 transition-transform">🔥</span>
                      <span className="text-gray-600 group-hover:text-[#1A1A1A]">Roast my post</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.role === 'foundii' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-md overflow-hidden">
                            {index === 0 ? (
                              <img src="/foundi-mascot.png" className="w-full h-full object-cover scale-150 mt-1" alt="Foundi" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl p-4 max-w-[85%] leading-relaxed text-sm shadow-sm ${msg.role === 'user'
                          ? 'bg-[#1A1A1A] text-white rounded-tr-sm font-medium'
                          : 'bg-white text-gray-700 rounded-tl-sm border border-gray-100'
                          }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-gray-100 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white space-y-4 relative z-10">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs text-gray-600 border border-gray-200 transition-all hover:border-gray-400 hover:text-[#1A1A1A]"
                  >
                    {action}
                  </button>
                ))}
              </div>
              <div className="relative">
                <VoiceInput
                  value={userMessage}
                  onChange={(value) => setUserMessage(value)}
                  placeholder="Ask Foundi to refine your post..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm text-[#1A1A1A] placeholder-gray-400 focus:ring-2 focus:ring-black/5 focus:border-[#1A1A1A] transition-all shadow-sm"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!userMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#1A1A1A] group w-full justify-center sm:w-auto">
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Simple icons for the reactions
function ThumblikeIcon(props: any) {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path d="M4 7h10.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm0 0V4a3 3 0 0 1 3-3h1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon(props: any) {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path d="M8 3.5l-1-1C5.5 1 2 2.5 2 6c0 4 6 8 6 8s6-4 6-8c0-3.5-3.5-5-5-3.5l-1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
