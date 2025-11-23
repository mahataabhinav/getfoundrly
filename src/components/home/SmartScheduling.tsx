import { TrendingUp, Sparkles, Moon } from 'lucide-react';

export default function SmartScheduling() {
  const schedulingExamples = [
    {
      icon: Sparkles,
      platform: 'LinkedIn',
      day: 'Tuesday',
      date: 'Oct 22',
      time: '9:14 AM',
      reachLift: '+24% reach',
      engagementLift: '+18% likes',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      platform: 'Instagram',
      day: 'Friday',
      date: 'Oct 25',
      time: '11:32 AM',
      reachLift: '+31% more completions',
      engagementLift: '',
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Moon,
      platform: 'Blog',
      day: 'Wednesday',
      date: 'Oct 23',
      time: '10:04 AM',
      reachLift: '+19% more organic traffic',
      engagementLift: '',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smarter timing. Better results.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Foundrly doesn't just create content — it predicts when to post it.
            AI-powered scheduling suggests the best day, date, and time for each channel,
            with expected lift in reach and engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {schedulingExamples.map((example) => {
            const Icon = example.icon;
            return (
              <div
                key={example.platform}
                className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${example.bgColor}`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${example.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                  </div>
                  <div className="font-bold text-gray-900">{example.platform}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <Icon className="w-5 h-5 text-yellow-500" />
                    <div className="text-2xl font-bold text-gray-900">
                      {example.day}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="text-lg font-semibold">{example.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-lg font-semibold">{example.time}</span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">{example.reachLift}</span>
                    </div>
                    {example.engagementLift && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">{example.engagementLift}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    AI Recommended
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Visibility Score Over Time</h3>
            <p className="text-gray-600">Your brand's reach and engagement, trending up</p>
          </div>

          <div className="relative h-80 bg-gradient-to-b from-blue-50/50 to-transparent rounded-2xl p-8">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <path
                d="M 0,150 L 50,140 L 100,145 L 150,125 L 200,115 L 250,120 L 300,100 L 350,85 L 400,95 L 450,70 L 500,55 L 550,60 L 600,50"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M 0,150 L 50,140 L 100,145 L 150,125 L 200,115 L 250,120 L 300,100 L 350,85 L 400,95 L 450,70 L 500,55 L 550,60 L 600,50 L 600,200 L 0,200 Z"
                fill="url(#areaGradient)"
              />

              <circle cx="450" cy="70" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
            </svg>

            <div className="absolute top-16 right-16 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
              +24% Lift with AI Scheduling
            </div>

            <div className="absolute bottom-4 left-8 right-8 flex justify-between text-xs text-gray-500 font-medium">
              <span>Last 30 Days</span>
              <span className="text-gray-400">Visibility Score</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
