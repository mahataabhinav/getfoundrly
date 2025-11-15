import { Sparkles, Target, TrendingUp } from 'lucide-react';

export default function SolutionSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Content Generator',
      description: 'Create posts, ads, and emails instantly.',
      gradient: 'from-blue-500 to-slate-600',
      accentColor: 'blue',
    },
    {
      icon: Target,
      title: 'Brand DNA Engine',
      description: 'Understands your tone, audience, and style.',
      gradient: 'from-slate-500 to-blue-600',
      accentColor: 'slate',
    },
    {
      icon: TrendingUp,
      title: 'Performance Dashboard',
      description: 'See what works. Scale what matters.',
      gradient: 'from-blue-600 to-slate-700',
      accentColor: 'blue',
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            The Visibility Engine
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to go from invisible to irresistible
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-slate-300/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />

              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-slate-400/30 rounded-2xl blur-lg" />
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            From invisible to irresistible — in one platform.
          </p>
        </div>
      </div>
    </section>
  );
}
