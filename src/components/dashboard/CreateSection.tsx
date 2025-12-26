import { useState, useEffect } from 'react';
import { FileText, Mail, Instagram, Video, Newspaper, MessageSquare, Globe, Sparkles } from 'lucide-react';
import LinkedInPostGenerator from './LinkedInPostGenerator';
import InstagramAdGenerator from './InstagramAdGenerator';
import NewsletterGenerator from './NewsletterGenerator';
import BlogPostGenerator from './BlogPostGenerator';

export default function CreateSection() {
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isBlogPostModalOpen, setIsBlogPostModalOpen] = useState(false);
  const contentTools = [
    { title: 'LinkedIn Posts', icon: FileText, description: 'Professional thought leadership', color: 'from-blue-500 to-blue-600' },
    { title: 'Newsletters', icon: Mail, description: 'Email campaigns that convert', color: 'from-purple-500 to-purple-600' },
    { title: 'Instagram Ads', icon: Instagram, description: 'Visual brand storytelling', color: 'from-pink-500 to-pink-600' },
    { title: 'Video Scripts', icon: Video, description: 'Engaging UGC content', color: 'from-red-500 to-red-600' },
    { title: 'Blog Posts', icon: Newspaper, description: 'SEO-optimized articles', color: 'from-green-500 to-green-600' },
    { title: 'Social Captions', icon: MessageSquare, description: 'Scroll-stopping copy', color: 'from-cyan-500 to-cyan-600' },
    { title: 'Website Copy', icon: Globe, description: 'Landing page content', color: 'from-indigo-500 to-indigo-600' },
    { title: 'Ad Campaigns', icon: Sparkles, description: 'Multi-platform ads', color: 'from-orange-500 to-orange-600' },
  ];

  // Check for LinkedIn OAuth redirect validation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reopenModal = urlParams.get('reopen_modal');
    if (reopenModal === 'true') {
      setIsLinkedInModalOpen(true);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Create Content</h1>
        <p className="text-zinc-400">AI-powered branded content from your website URL</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTools.map((tool) => {
          const Icon = tool.icon;
          const isLinkedIn = tool.title === 'LinkedIn Posts';
          const isInstagram = tool.title === 'Instagram Ads';
          return (
            <div
              key={tool.title}
              className="group bg-[#18181B] rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{tool.title}</h3>
              <p className="text-sm text-zinc-400 mb-4">{tool.description}</p>
              <button
                onClick={() => {
                  if (isLinkedIn) setIsLinkedInModalOpen(true);
                  if (isInstagram) setIsInstagramModalOpen(true);
                  if (tool.title === 'Newsletters') setIsNewsletterModalOpen(true);
                  if (tool.title === 'Blog Posts') setIsBlogPostModalOpen(true);
                }}
                className="w-full bg-white/10 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/5"
              >
                Generate
              </button>
            </div>
          );
        })}
      </div>

      <LinkedInPostGenerator
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />

      <InstagramAdGenerator
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
      />

      <NewsletterGenerator
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />

      <BlogPostGenerator
        isOpen={isBlogPostModalOpen}
        onClose={() => setIsBlogPostModalOpen(false)}
      />

      <div className="bg-gradient-to-br from-[#18181B] to-[#27272A] rounded-2xl p-8 border border-white/5">
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold text-white mb-3">How It Works</h3>
          <div className="space-y-3 text-zinc-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <p>Enter your website URL or upload brand guidelines</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <p>Choose your content format and target platform</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <p>AI generates on-brand content in seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
