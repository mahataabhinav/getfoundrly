import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import Foundii from './Foundii';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.02;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.02;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/20 via-slate-200/20 to-transparent rounded-full blur-3xl animate-float"
          style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-slate-300/20 via-blue-200/15 to-transparent rounded-full blur-3xl animate-float-delayed"
          style={{ transform: `translate(${-parallaxX}px, ${-parallaxY}px)` }}
        />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-slate-100/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
        <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="block mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">95% of AI businesses</span>
            <span className="block mb-3 text-gray-900 relative">
              <span className="relative z-10">stay invisible.</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-slate-500/20 to-blue-500/20 blur-2xl" />
            </span>
            <span className="block mt-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Let's fix that.</span>
          </h1>
        </div>

        <div className={`mb-12 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Meet Foundrly — your AI brand co-pilot turning founders into icons.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button className="group relative bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Try for Free</span>
            <span className="relative z-10 transform transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button className="group relative bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Play className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Watch Demo</span>
          </button>
        </div>

        <div className={`relative mt-32 flex justify-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative group">
            <div className="absolute -inset-10 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl" />
            <div className="relative">
              <Foundii size={160} animate={true} gesture="idle" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
                  <div className="text-xs font-bold text-gray-900">Meet Foundi</div>
                  <div className="text-xs text-gray-600">Your AI co-founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
