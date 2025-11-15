import { useState, useEffect } from 'react';
import Foundii from '../Foundii';

interface FinalCTAProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function FinalCTA({ onSignupClick, onLoginClick }: FinalCTAProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-600/20 via-blue-600/15 to-transparent rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Ready to stop being invisible?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Start your visibility engine in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onSignupClick}
              className="group relative bg-white text-gray-900 px-10 py-5 rounded-full text-lg font-bold transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Try Foundrly Free</span>
              <span className="relative z-10 transform transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={onLoginClick}
              className="group relative bg-transparent text-white px-10 py-5 rounded-full text-lg font-bold border-2 border-white/30 hover:border-white/50 transition-all hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Login</span>
            </button>
          </div>

          <div className={`relative flex justify-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="relative group">
              <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
              <div className="relative">
                <Foundii size={140} animate={true} gesture="wave" />
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl border border-gray-200/50 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">
                      Ready when you are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
