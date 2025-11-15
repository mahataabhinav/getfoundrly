import { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import Foundi from '../Foundii';
import VoiceInput from '../VoiceInput';

interface BlogPostEditorProps {
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
  onSave: (content: typeof blogContent) => void;
  brandName: string;
}

export default function BlogPostEditor({ isOpen, onClose, blogContent, onSave, brandName }: BlogPostEditorProps) {
  const [content, setContent] = useState(blogContent);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; message: string }[]>([]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user' as const, message: chatInput }];
    setChatMessages(newMessages);

    setTimeout(() => {
      const aiResponse = `I'll help you ${chatInput.toLowerCase()}. Let me update your blog post...`;
      setChatMessages([...newMessages, { role: 'assistant' as const, message: aiResponse }]);
    }, 800);

    setChatInput('');
  };

  const handleSave = () => {
    onSave(content);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Edit Blog Post</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
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

        <div className="grid md:grid-cols-2 gap-0 h-[calc(90vh-88px)]">
          <div className="p-8 overflow-y-auto border-r border-gray-200">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <VoiceInput
                  value={content.metaTitle}
                  onChange={(value) => setContent({ ...content, metaTitle: value })}
                  placeholder="SEO meta title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <VoiceInput
                  value={content.metaDescription}
                  onChange={(value) => setContent({ ...content, metaDescription: value })}
                  multiline
                  rows={2}
                  placeholder="SEO meta description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Article Title (H1)</label>
                <VoiceInput
                  value={content.title}
                  onChange={(value) => setContent({ ...content, title: value })}
                  placeholder="Article title..."
                />
              </div>

              {content.sections.map((section, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {section.level} - {idx + 1}
                  </label>
                  <VoiceInput
                    value={section.heading}
                    onChange={(value) => {
                      const newSections = [...content.sections];
                      newSections[idx].heading = value;
                      setContent({ ...content, sections: newSections });
                    }}
                    placeholder="Section heading..."
                    className="mb-3"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <VoiceInput
                    value={section.content}
                    onChange={(value) => {
                      const newSections = [...content.sections];
                      newSections[idx].content = value;
                      setContent({ ...content, sections: newSections });
                    }}
                    multiline
                    rows={5}
                    placeholder="Section content..."
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Callout Box (Optional)</label>
                <VoiceInput
                  value={content.callout}
                  onChange={(value) => setContent({ ...content, callout: value })}
                  multiline
                  rows={2}
                  placeholder="Highlighted tip or insight..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pull Quote (Optional)</label>
                <VoiceInput
                  value={content.quote}
                  onChange={(value) => setContent({ ...content, quote: value })}
                  multiline
                  rows={2}
                  placeholder="Memorable quote..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                <VoiceInput
                  value={content.cta}
                  onChange={(value) => setContent({ ...content, cta: value })}
                  placeholder="e.g., Get Started Today"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA URL</label>
                <VoiceInput
                  value={content.ctaUrl}
                  onChange={(value) => setContent({ ...content, ctaUrl: value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-br from-slate-50 to-green-50/30">
            <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Foundi size={40} animate={true} gesture="thinking" />
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">Refine with Foundi</h3>
                  <p className="text-sm text-gray-600">Ask me to improve your article</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Ask Foundi to help optimize your blog post
                  </p>
                </div>
              )}

              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <Foundi size={32} animate={false} gesture="wave" />
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['Add statistics', 'Shorten intro', 'More examples', 'Improve SEO'].map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setChatInput(action);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <VoiceInput
                    value={chatInput}
                    onChange={(value) => setChatInput(value)}
                    placeholder="Ask Foundi to refine your article..."
                    className="flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
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
    </div>
  );
}
