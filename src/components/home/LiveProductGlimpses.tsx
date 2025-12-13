import { useState } from 'react';
import { Linkedin, Instagram, Mail, FileText, ArrowRight } from 'lucide-react';

export default function LiveProductGlimpses() {
  const [activeTab, setActiveTab] = useState('linkedin');

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'blog', label: 'Blog', icon: FileText }
  ];

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            See Foundrly in action
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Watch how each content type flows from idea to published
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-2 gap-2 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab.id
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm">
          {activeTab === 'linkedin' && <LinkedInFlow />}
          {activeTab === 'instagram' && <InstagramFlow />}
          {activeTab === 'newsletter' && <NewsletterFlow />}
          {activeTab === 'blog' && <BlogFlow />}
        </div>
      </div>
    </section>
  );
}

function LinkedInFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Step 1: Input</div>
          <input
            type="text"
            placeholder="paste your website URL..."
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-400"
            disabled
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Step 2: Post Type</div>
          <div className="space-y-2">
            {['Thought Leadership', 'Product Update', 'Case Study'].map((type) => (
              <div key={type} className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Step 3: Your Prompt</div>
          <textarea
            placeholder="Tell Foundi what you want to say..."
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 h-24 resize-none"
            disabled
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-4">Generated Post Preview</div>
        <div className="space-y-4 mb-6">
          <div className="h-4 bg-gray-900 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="flex gap-2 mt-4">
            <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">#AI</div>
            <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">#Startups</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Edit in Editor
          </button>
          <button className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 transition-colors">
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function InstagramFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Ad Type</div>
          <div className="space-y-2">
            {['Story Ad', 'Feed Ad', 'Reel Ad'].map((type) => (
              <div key={type} className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Preferences</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Goal</div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm">Brand Awareness</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Tone</div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm">Bold & Direct</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-80">
          <div className="bg-white rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
            <div className="aspect-[9/16] bg-gradient-to-br from-purple-400 to-pink-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-2xl font-bold mb-2">Your Ad Here</div>
                  <div className="text-sm opacity-90">Video or Image Content</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white font-bold mb-2">Transform Your Business</div>
                <button className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium text-sm">
              Publish
            </button>
            <button className="border-2 border-gray-200 px-6 py-3 rounded-xl font-medium text-sm">
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Template</div>
          <div className="space-y-2">
            {['Weekly Digest', 'Product Announcement', 'Educational Series'].map((type) => (
              <div key={type} className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm flex justify-between items-center">
                {type}
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 text-white font-medium text-sm">
          Email Preview
        </div>
        <div className="p-8 space-y-4">
          <div className="h-8 bg-gray-900 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-4/5"></div>

          <div className="my-6 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl"></div>

          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>

          <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium mt-6">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Blog Type</div>
          <div className="space-y-2">
            {['How-To Guide', 'Thought Leadership', 'Case Study'].map((type) => (
              <div key={type} className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-3">Keywords</div>
          <div className="flex flex-wrap gap-2">
            {['AI automation', 'productivity', 'startups'].map((keyword) => (
              <div key={keyword} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                {keyword}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-4">SEO Article Preview</div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-900 rounded w-4/5"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>

          <div className="space-y-3 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-900 rounded w-2/3"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-900 rounded w-2/3"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-900 rounded w-2/3"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex gap-2 text-xs text-gray-500">
              <span>SEO Score: 92/100</span>
              <span>•</span>
              <span>1,847 words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
