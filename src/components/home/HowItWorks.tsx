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
    <section id="how-it-works" className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">
            How Foundrly Works
          </h2>
          <p className="text-gray-400 text-3xl max-w-4xl mx-auto leading-relaxed">
            A simple, automated workflow to turn your ideas into authority-building content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative group h-full">
                <div className="bg-white/5 rounded-[2rem] p-10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 h-full flex flex-col">
                  <div className={`inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} items-center justify-center mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-xl leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
