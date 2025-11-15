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

          <div className="relative h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 65, 71, 68, 78, 82, 76, 89, 92, 88].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${value}%` }}
                />
                {index === 11 && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    +45% this month
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Week 1</span>
            <span>Week 6</span>
            <span>Week 12</span>
          </div>
        </div>
      </div>
    </section>
  );
}
