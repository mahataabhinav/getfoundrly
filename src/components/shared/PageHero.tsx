import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'gradient' | 'dark';
  children?: ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  description,
  variant = 'default',
  children
}: PageHeroProps) {
  const backgrounds = {
    default: 'bg-gradient-to-br from-slate-50 via-white to-blue-50/20',
    gradient: 'bg-gradient-to-br from-blue-50 via-slate-50 to-white',
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
  };

  const textColors = {
    default: 'text-gray-900',
    gradient: 'text-gray-900',
    dark: 'text-white'
  };

  const subtitleColors = {
    default: 'text-gray-600',
    gradient: 'text-gray-600',
    dark: 'text-gray-300'
  };

  return (
    <section className={`relative pt-32 pb-20 ${backgrounds[variant]}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {subtitle && (
          <div className="inline-block mb-4 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
            <span className="text-sm font-medium text-gray-700">{subtitle}</span>
          </div>
        )}

        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${textColors[variant]}`}>
          {title}
        </h1>

        {description && (
          <p className={`text-xl md:text-2xl ${subtitleColors[variant]} max-w-3xl mx-auto mb-8 leading-relaxed`}>
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
