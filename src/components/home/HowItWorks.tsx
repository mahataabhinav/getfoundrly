import { Sparkles, BarChart3, TrendingUp, Bot } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Sparkles,
      title: 'Create',
      description: 'Generate branded posts, ads, newsletters, and blogs using your website + voice.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'See how your content performs with visibility score, insights, and recommendations.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Grow',
      description: 'Use AI-guided scheduling to maximize reach, engagement, and consistency.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Bot,
      title: 'Foundi',
      description: 'Your personal co-founder: learns your style, helps refine content, and guides your growth.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-105 group h-full">
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
