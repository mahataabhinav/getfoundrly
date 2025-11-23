import { Users, Mic, Zap } from 'lucide-react';

export default function BuiltForFounders() {
  const features = [
    {
      icon: Users,
      text: 'For solopreneurs and small teams',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      text: 'Voice-driven or text-driven creation (talk to Foundi)',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      text: 'One place instead of 10 disconnected tools',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Built for Founders,
            <span className="block mt-2">Not Marketers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center"
              >
                <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} items-center justify-center mb-6 transform transition-transform hover:scale-110 hover:rotate-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium text-gray-900 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border-2 border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
                <div>
                  <div className="font-bold text-white mb-1">Sarah Chen</div>
                  <div className="text-gray-400 text-sm">Founder, TechFlow AI</div>
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                "I stopped guessing and started posting with purpose. Foundrly feels like hiring a strategist, writer, and media buyer in one."
              </blockquote>

              <div className="mt-8 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
