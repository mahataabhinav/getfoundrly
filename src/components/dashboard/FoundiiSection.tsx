import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import RobotChatbot from '../RobotChatbot';

export default function FoundiiSection() {
  const [message, setMessage] = useState('');

  const conversationExamples = [
    { role: 'user', text: 'Summarize my performance this week' },
    {
      role: 'foundii',
      text: 'Great week, Sarah! Your visibility score jumped 8 points to 72. Your LinkedIn post about AI productivity got 2.4k views—your best performer yet. I found 12 new keyword opportunities. Want me to generate content for the top 3?',
    },
    { role: 'user', text: 'Generate a carousel for SMB visibility tips' },
    {
      role: 'foundii',
      text: 'Perfect! I\'ll create a 5-slide carousel: "5 Visibility Hacks Every SMB Needs." Slides will cover: SEO basics, social proof, content consistency, thought leadership, and community building. Should I use your brand colors and logo?',
    },
  ];

  const quickPrompts = [
    'Analyze my top-performing content',
    'Generate LinkedIn post ideas',
    'Review my competitor landscape',
    'Create a content calendar',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Chat with Foundi</h1>
        <p className="text-gray-600">Your AI creative co-founder, always ready to help</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <RobotChatbot size={48} animate={true} gesture="wave" />
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Foundi</h3>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <RobotChatbot size={32} animate={false} gesture="idle" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-md">
                <p className="text-sm text-gray-700">
                  Hi Sarah! I'm Foundi, your AI assistant. I can help you create content, analyze performance, and grow your visibility. What would you like to work on today?
                </p>
              </div>
            </div>

            {conversationExamples.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'foundii' && (
                  <div className="flex-shrink-0">
                    <RobotChatbot size={32} animate={false} gesture="idle" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-md ${
                    msg.role === 'user'
                      ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Foundii anything..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
              />
              <button className="p-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-gray-800 transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A]">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 hover:text-[#1A1A1A] transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">What Foundi Can Do</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Generate content for any platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Analyze your performance metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Research competitors and trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Suggest optimization strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Plan content calendars</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
