import { Link, Sparkles, Edit3, Calendar } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Link,
      number: '01',
      title: 'Connect Your Brand',
      description: 'Paste your website URL. Foundrly + Foundi learn your tone, audience, and keywords.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      number: '02',
      title: 'Create Content',
      description: 'Choose LinkedIn, Instagram ad, newsletter, or blog. Speak or type what you want — Foundi drafts it.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Edit3,
      number: '03',
      title: 'Edit & Collaborate',
      description: 'Refine content with an editor + AI chat. Customize tone, add visuals, tweak CTAs.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Calendar,
      number: '04',
      title: 'Schedule & Publish',
      description: 'Publish now or schedule. Foundrly recommends best day, date, and time for each channel.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How Foundrly Works
            <span className="block text-gray-600 text-2xl font-normal mt-4">(End-to-End)</span>
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-orange-200 to-green-200 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-105 group">
                    <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-6xl font-bold text-gray-100 mb-4">{step.number}</div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-lg">
                        <span className="text-gray-400 text-sm">→</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-full px-8 py-4 shadow-lg border-2 border-gray-100">
            <p className="text-gray-600 font-medium">
              <span className="font-bold text-gray-900">From idea to published</span> in minutes, not hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
