import { Star, ArrowRight } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI SaaS Founder',
      company: 'DataFlow AI',
      content: 'Foundrly helped us go from 0 to 10K followers in 3 months. The content just works.',
      rating: 5,
      image: '👩‍💼',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Solo Developer',
      company: 'BuildFast',
      content: 'Finally, someone who understands my brand better than I do. Game changer.',
      rating: 5,
      image: '👨‍💻',
    },
    {
      name: 'Emily Park',
      role: 'Product Designer',
      company: 'DesignKit Pro',
      content: 'I was invisible for 2 years. Foundrly made me undeniable in 60 days.',
      rating: 5,
      image: '👩‍🎨',
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-slate-200/15 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Founders Love Foundrly
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Join hundreds of founders who've transformed their visibility
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-slate-300/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200/50">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed text-lg font-medium">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-slate-500 rounded-full blur-md" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-slate-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {testimonial.image}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="group relative bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-bold transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Join Beta Access</span>
            <ArrowRight className="relative z-10 w-5 h-5 transform transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-sm text-gray-600 mt-4 font-medium">Limited spots available • No credit card required</p>
        </div>
      </div>
    </section>
  );
}
