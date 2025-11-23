import { Globe, Sparkles, Send } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Globe,
      title: 'Enter your website URL',
      description: 'Foundrly extracts your brand DNA automatically',
      gradient: 'from-blue-400 to-slate-500',
      previewBg: 'from-blue-50 to-slate-50',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Generate instant content',
      description: 'Blogs, LinkedIn posts, ads, videos — all on-brand',
      gradient: 'from-slate-400 to-blue-500',
      previewBg: 'from-slate-50 to-blue-50',
    },
    {
      number: '03',
      icon: Send,
      title: 'Swipe, edit, or publish',
      description: 'Review, refine, and share instantly across platforms',
      gradient: 'from-blue-500 to-slate-600',
      previewBg: 'from-blue-50 to-slate-100',
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your visibility
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300/40 via-slate-300/40 to-blue-300/40 transform -z-10" />

          <div className="grid md:grid-cols-3 gap-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-slate-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className={`relative w-28 h-28 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <step.icon className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{step.number}</span>
                    </div>
                  </div>

                  <div className={`mb-6 p-6 bg-gradient-to-br ${step.previewBg} rounded-2xl border border-gray-200/50 shadow-sm group-hover:shadow-md transition-all`}>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-300/50 rounded w-3/4 mx-auto" />
                      <div className="h-2 bg-gray-300/50 rounded w-full" />
                      <div className="h-2 bg-gray-300/50 rounded w-5/6 mx-auto" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 right-0 transform translate-x-1/2 z-10">
                    <div className="text-4xl text-slate-300 font-light">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <button className="group relative bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Get Started Now</span>
            <span className="relative z-10 transform transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
