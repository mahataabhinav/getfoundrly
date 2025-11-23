import { ReactNode } from 'react';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryButtonText: string;
  primaryButtonAction: () => void;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  variant?: 'light' | 'dark' | 'gradient';
  children?: ReactNode;
}

export default function CTASection({
  title,
  description,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  variant = 'light',
  children
}: CTASectionProps) {
  const variants = {
    light: {
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50/30',
      text: 'text-gray-900',
      desc: 'text-gray-600',
      primaryBtn: 'bg-gray-900 text-white hover:bg-gray-800',
      secondaryBtn: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300'
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      text: 'text-white',
      desc: 'text-gray-300',
      primaryBtn: 'bg-white text-gray-900 hover:bg-gray-100',
      secondaryBtn: 'bg-transparent text-white border-2 border-white/20 hover:border-white/40'
    },
    gradient: {
      bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-slate-600',
      text: 'text-white',
      desc: 'text-blue-100',
      primaryBtn: 'bg-white text-gray-900 hover:bg-gray-100',
      secondaryBtn: 'bg-transparent text-white border-2 border-white/20 hover:border-white/40'
    }
  };

  const style = variants[variant];

  return (
    <section className={`py-20 ${style.bg}`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${style.text}`}>
          {title}
        </h2>

        {description && (
          <p className={`text-xl ${style.desc} mb-10 leading-relaxed`}>
            {description}
          </p>
        )}

        {children}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={primaryButtonAction}
            className={`group px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 ${style.primaryBtn}`}
          >
            <span>{primaryButtonText}</span>
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </button>

          {secondaryButtonText && secondaryButtonAction && (
            <button
              onClick={secondaryButtonAction}
              className={`px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-lg hover:scale-105 ${style.secondaryBtn}`}
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
