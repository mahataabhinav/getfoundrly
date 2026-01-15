import { useState } from 'react';
import { Linkedin, Instagram, Mail, FileText, LayoutDashboard, PenTool, BarChart2, Settings, Bell, Search, User, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">
            See Foundrly in action
          </h2>
          <p className="text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Experience the full dashboard. From idea to published in seconds.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-2 gap-2 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all ${activeTab === tab.id
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Frame */}
        <div className="max-w-7xl mx-auto bg-[#0F0F0F] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden min-h-[800px] flex">
          {/* Sidebar (Mock) */}
          <div className="w-20 lg:w-64 border-r border-white/5 bg-[#141414] hidden md:flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 mr-3"></div>
              <span className="font-bold text-white tracking-tight hidden lg:block">Foundrly</span>
            </div>
            <div className="p-4 space-y-2 flex-1">
              <SidebarItem icon={LayoutDashboard} label="Home" />
              <SidebarItem icon={PenTool} label="Create" active />
              <SidebarItem icon={BarChart2} label="Analyze" />
              <SidebarItem icon={Settings} label="Settings" />
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
                <div className="hidden lg:block">
                  <div className="text-sm text-white font-medium">Abhinav</div>
                  <div className="text-xs text-gray-500">Pro Plan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#0A0A0A]">
            {/* Header (Mock) */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#141414]/50 backdrop-blur">
              <div className="flex items-center text-sm text-gray-400">
                <span>Create</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-white font-medium capitalize">{activeTab}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2 rounded-full text-gray-400"><Search className="w-4 h-4" /></div>
                <div className="bg-white/5 p-2 rounded-full text-gray-400"><Bell className="w-4 h-4" /></div>
              </div>
            </div>

            {/* Dynamic Flow Content */}
            <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'linkedin' && <LinkedInFlow />}
                  {activeTab === 'instagram' && <InstagramFlow />}
                  {activeTab === 'newsletter' && <NewsletterFlow />}
                  {activeTab === 'blog' && <BlogFlow />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon className="w-5 h-5" />
      <span className="hidden lg:block font-medium text-sm">{label}</span>
    </div>
  );
}

// --- FLOWS ---

function LinkedInFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Editor */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Create LinkedIn Post</h3>
          <p className="text-gray-400 text-sm">Turn your ideas into viral professional content.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source Material</label>
            <div className="p-4 bg-[#1A1A1A] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><PenTool className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-white">Manual Input</span>
              </div>
              <textarea
                className="w-full bg-transparent text-gray-300 text-sm resize-none focus:outline-none h-20 placeholder:text-gray-600"
                placeholder="e.g. Share our new Q3 milestones and thank the team for their hard work..."
                defaultValue="Launching our new AI features. We hit 10k users in 3 months. Mention the team's hard work."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Settings</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1A1A1A] border border-white/10 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors">
                <div className="text-xs text-gray-500 mb-1">Tone</div>
                <div className="text-sm text-white font-medium">Thought Leader 🧠</div>
              </div>
              <div className="p-3 bg-[#1A1A1A] border border-white/10 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors">
                <div className="text-xs text-gray-500 mb-1">Format</div>
                <div className="text-sm text-white font-medium">Storytelling 📖</div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Regenerate Content
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <span className="text-sm font-medium text-gray-400">Preview</span>
          <div className="flex gap-2 text-xs">
            <button className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20">Mobile</button>
            <button className="px-3 py-1 text-gray-500 hover:text-white">Desktop</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl max-w-sm mx-auto w-full shadow-xl text-black">
          <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 border border-blue-200">AM</div>
            <div>
              <div className="font-bold text-sm text-gray-900">Abhinav Mahata</div>
              <div className="text-xs text-gray-500">Founder @ Foundrly • 2h • 🌐</div>
            </div>
          </div>
          <div className="p-4 space-y-2 text-sm text-gray-800 leading-relaxed font-sans">
            <p>Just deployed new AI features to Foundrly. 🚀</p>
            <p>Scale your content creation 10x faster. We've seen teams save 20+ hours/week by automating their workflows.</p>
            <p className="font-medium text-indigo-600 mt-2">#AI #Startup #Growth #SaaS</p>
          </div>
          <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden group">
            <video
              src="/mock-video.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-medium">0:15 / 0:45</div>
          </div>
          <div className="h-10 border-t border-gray-100 flex items-center px-4 justify-between text-gray-500">
            <span className="text-xs flex items-center gap-1 hover:bg-gray-50 p-1 rounded cursor-pointer font-medium">👍 Like</span>
            <span className="text-xs flex items-center gap-1 hover:bg-gray-50 p-1 rounded cursor-pointer font-medium">💬 Comment</span>
            <span className="text-xs flex items-center gap-1 hover:bg-gray-50 p-1 rounded cursor-pointer font-medium">↗️ Share</span>
            <span className="text-xs flex items-center gap-1 hover:bg-gray-50 p-1 rounded cursor-pointer font-medium">📨 Send</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 py-2.5 bg-white text-black font-medium rounded-lg text-sm">Post Now</button>
          <button className="px-4 py-2.5 bg-white/10 text-white font-medium rounded-lg text-sm"><Clock className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

function InstagramFlow() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Editor */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Instagram Creator</h3>
          <p className="text-gray-400 text-sm">Design Reels and Stories that convert.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {['Reel', 'Story', 'Post'].map(t => (
              <div key={t} className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${t === 'Reel' ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-[#1A1A1A] border-white/10 text-gray-400'}`}>
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1A1A1A] border border-white/10 rounded-xl space-y-3">
            <label className="text-xs font-medium text-gray-500 uppercase">Visual Style</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Minimal', 'Bold', 'Aesthetic', 'Corporate'].map(s => (
                <div key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 whitespace-nowrap hover:bg-white/10 cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#1A1A1A] border border-white/10 rounded-xl space-y-3">
            <label className="text-xs font-medium text-gray-500 uppercase">Input Script</label>
            <textarea className="w-full bg-transparent text-sm text-gray-300 h-24 focus:outline-none resize-none" defaultValue="POV: You found the perfect AI tool for content creation. Showing dashboard, then results. Fast cuts. Trending audio." />
          </div>
        </div>
      </div>

      {/* Preview */}
      {/* Preview */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden h-[600px] lg:h-auto relative">
        {/* iPhone Frame */}
        <div className="relative w-full h-full bg-black border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-50 flex items-center justify-center border border-[#1a1a1a]">
            <div className="w-20 h-full rounded-full bg-black"></div>
          </div>

          {/* Screen Content */}
          <div className="w-full h-full relative bg-gray-900">
            {/* Mock Screen */}
            <div className="absolute inset-0 bg-gray-900">
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Preview</span>
              </div>
              {/* Overlay UI */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border border-white/50"></div>
                  <div className="text-sm font-bold text-white shadow-black drop-shadow-md">foundrly_app</div>
                  <button className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white font-medium">Follow</button>
                </div>
                <div className="space-y-2 mb-4 text-white/90 text-base leading-tight text-shadow-sm max-w-lg">
                  <p>When you realize AI can do your job better... 😅 <span className="text-blue-400">#AI</span> <span className="text-blue-400">#FutureOfWork</span></p>
                  <div className="flex items-center gap-2 text-xs opacity-70 mt-2">
                    <span className="w-3 h-3 bg-white/20 rounded-sm inline-block"></span>
                    Original Audio - foundrly_app
                  </div>
                </div>
              </div>
              {/* Visual */}
              <video
                src="/mock-video-instagram.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              {/* Side Buttons */}
              <div className="absolute bottom-24 right-4 space-y-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">❤️</div>
                  <span className="text-xs font-bold text-white">42.5K</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">💬</div>
                  <span className="text-xs font-bold text-white">1.2K</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">✈️</div>
                  <span className="text-xs font-bold text-white">Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterFlow() {
  return (
    <div className="flex h-full gap-8">
      <div className="w-1/3 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Newsletter Builder</h3>
          <p className="text-gray-400 text-sm">Curate your weekly digest.</p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-[#1A1A1A] border border-white/10 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg"><LayoutDashboard className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-medium text-white">Template</div>
              <div className="text-xs text-gray-500">Weekly Digest</div>
            </div>
          </div>
          <div className="p-3 bg-[#1A1A1A] border border-white/10 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><User className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-medium text-white">Audience</div>
              <div className="text-xs text-gray-500">All Subscribers (4.2k)</div>
            </div>
          </div>
        </div>

        <div className="h-32 bg-[#1A1A1A] border border-white/10 rounded-xl p-3">
          <div className="text-xs text-gray-500 mb-2 font-medium uppercase">AI Instructions</div>
          <p className="text-sm text-gray-300">Summarize the top 3 tech news of the week. Add a witty intro about robots taking over (jokingly). End with a call to action for our webinar.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col text-black">
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="text-xs font-medium text-gray-500">Subject: 🤖 The Robots are... helpful?</div>
          <div className="w-4"></div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">Weekly Tech Digest ⚡️</h1>
              <p className="text-sm text-gray-500">Curated for Abhinav • Oct 24, 2024</p>
            </div>

            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>Hey Everyone,</p>
              <p>This week we're diving deep into the <strong>new agentic workflows</strong>. It's not just about chat anymore—it's about doing actions.</p>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 my-4">
                <h4 className="font-bold text-indigo-900 mb-1">Key Takeaway</h4>
                <p className="text-indigo-800 text-xs">"Agents perform 40% better when given structured verification steps."</p>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mt-4">Top 3 Tools This Week</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Cursor:</strong> The AI code editor getting everyone talking.</li>
                <li><strong>Foundrly:</strong> (Biased, but true) - New LinkedIn scheduler live.</li>
                <li><strong>Replit Agent:</strong> Building apps from prompts.</li>
              </ul>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
              Read the Full Guide
            </button>

            <div className="text-center text-xs text-gray-400 mt-8">
              You are receiving this because you subscribed to Foundrly Digest. <span className="underline cursor-pointer">Unsubscribe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogFlow() {
  return (
    <div className="flex h-full gap-8">
      <div className="w-64 space-y-4">
        <div className="p-4 bg-[#1A1A1A] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white">SEO Score</span>
            <span className="text-sm font-bold text-green-400">92</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="w-[92%] h-full bg-green-500"></div>
          </div>
        </div>
        <div className="p-4 bg-[#1A1A1A] border border-white/10 rounded-xl space-y-3">
          <div className="text-xs text-gray-500 uppercase font-medium">Keywords</div>
          <div className="flex flex-wrap gap-2">
            {['AI marketing', 'automation', 'growth'].map(k => (
              <span key={k} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/5">{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl p-6 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Saved</span>
        </div>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">How AI is Changing Content Forever</div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>By Foundrly Team</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed font-serif">
            <p>The landscape of digital marketing is shifting. Gone are the days of manual scheduling and guesswork.</p>
            <p>With tools like <span className="text-indigo-400 bg-indigo-500/10 px-1 rounded">Foundrly</span>, creators can now leverage deep learning to understand their audience's DNA.</p>
            <div className="h-40 w-full rounded-lg overflow-hidden my-4">
              <img src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80" alt="Blog Header" className="w-full h-full object-cover" />
            </div>
            <p>Strategies that used to take weeks to formulate can now be iterated on in seconds...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

