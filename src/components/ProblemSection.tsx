import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress95, setProgress95] = useState(0);
  const [progress5, setProgress5] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setProgress95(95), 300);
          setTimeout(() => setProgress5(5), 600);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('problem-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem-section" className="relative py-32 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            The Invisibility Trap
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We studied 10,000+ AI founders. The biggest bottleneck isn't code — it's visibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-96 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-700/30">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-3xl" />

            <div className="relative h-full flex flex-col justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-8 tracking-wider">REVENUE DISTRIBUTION</div>
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-200 font-medium">95% of founders</span>
                      <span className="text-red-400 font-bold text-lg">&lt; $10k/mo</span>
                    </div>
                    <div className="relative h-16 bg-gray-800/60 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 transition-all duration-1500 ease-out relative"
                        style={{ width: `${progress95}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-200 font-medium">5% of founders</span>
                      <span className="text-green-400 font-bold text-lg">&gt; $20k/mo</span>
                    </div>
                    <div className="relative h-16 bg-gray-800/60 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 transition-all duration-1500 ease-out delay-300 relative"
                        style={{ width: `${progress5}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 italic font-medium">
                Source: Analysis of 10,000+ AI-first businesses
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="group flex gap-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-red-500/30 hover:bg-gray-800/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/10">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Generic content = low ROI</h3>
                <p className="text-gray-400">Your message gets lost in the noise. No differentiation, no traction.</p>
              </div>
            </div>
            <div className="group flex gap-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-orange-500/30 hover:bg-gray-800/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10">
              <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Random networking = slow growth</h3>
                <p className="text-gray-400">No strategy, no consistency, no compounding effects.</p>
              </div>
            </div>
            <div className="group flex gap-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-orange-500/30 hover:bg-gray-800/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">No system = no scale</h3>
                <p className="text-gray-400">You're stuck trading time for content. That's not sustainable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
