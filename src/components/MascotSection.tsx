import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import RobotChatbot from './RobotChatbot';

export default function MascotSection() {
  const [isHovered, setIsHovered] = useState(false);

  const taglines = [
    "Finally, a co-founder who gets your brand.",
    "You build. I amplify.",
    "Your story, told intelligently."
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-slate-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-slate-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Meet Your AI Co-Founder
            </h2>
            <p className="text-2xl text-gray-300 mb-8 font-medium">
              Your creative companion, always ready to help.
            </p>

            <div className="space-y-4 mb-10">
              {taglines.map((tagline, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all hover:transform hover:translate-x-2 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <p className="text-lg text-gray-200 font-medium leading-relaxed">{tagline}</p>
                </div>
              ))}
            </div>

            <button className="group relative bg-white text-gray-900 px-10 py-5 rounded-full text-lg font-bold transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Meet Your Co-Founder</span>
              <span className="relative z-10 transform transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <div className="absolute -inset-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />

              <div className="relative transform transition-all duration-500 hover:scale-105">
                <RobotChatbot
                  size={300}
                  animate={true}
                  gesture={isHovered ? 'wave' : 'idle'}
                />
              </div>

              {isHovered && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-8 py-4 rounded-2xl shadow-2xl animate-fade-in whitespace-nowrap font-bold border-2 border-blue-200">
                  <span className="text-2xl mr-2">👋</span>
                  Hey I'm Foundi, your AI assistant!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
