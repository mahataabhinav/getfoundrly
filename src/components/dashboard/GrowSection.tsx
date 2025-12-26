import { Globe, Gift, Award, Calendar, Lock } from 'lucide-react';

export default function GrowSection() {
  const features = [
    {
      title: 'Website Analyzer',
      description: 'Get instant feedback on your brand messaging and SEO',
      icon: Globe,
      status: 'available',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Offer Builder',
      description: 'Create irresistible lead magnets and offers',
      icon: Gift,
      status: 'coming-soon',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Authority Score',
      description: 'Track your industry credibility and thought leadership',
      icon: Award,
      status: 'available',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Content Calendar',
      description: 'Plan and schedule content across all platforms',
      icon: Calendar,
      status: 'coming-soon',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Grow Your Visibility</h1>
        <p className="text-zinc-400">Tools to amplify your brand and reach</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-[#18181B] rounded-2xl p-8 border border-white/5 hover:border-white/10 hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {feature.status === 'coming-soon' && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/5 text-zinc-400 rounded-full text-xs font-medium flex items-center gap-1 border border-white/5">
                    <Lock className="w-3 h-3" />
                    Coming Soon
                  </span>
                </div>
              )}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 mb-6">{feature.description}</p>
              {feature.status === 'available' ? (
                <button className="bg-white/10 text-white px-6 py-2.5 rounded-lg hover:bg-white/20 transition-all text-sm font-medium border border-white/5">
                  Launch Tool
                </button>
              ) : (
                <button className="bg-white/5 text-zinc-500 px-6 py-2.5 rounded-lg cursor-not-allowed text-sm font-medium">
                  Notify Me
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20">
          <div className="text-3xl font-bold text-blue-400 mb-2">2.4M+</div>
          <p className="text-sm text-zinc-400">Total impressions generated</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-500/20">
          <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
          <p className="text-sm text-zinc-400">Pieces of content created</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20">
          <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
          <p className="text-sm text-zinc-400">Average engagement increase</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-semibold mb-3">Ready to Scale?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl">
          Upgrade to Pro and unlock advanced features like competitor tracking, white-label reports, and priority support from Foundii.
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-all hover:shadow-lg">
          View Plans
        </button>
      </div>
    </div>
  );
}
