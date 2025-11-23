import { Linkedin, Instagram, Mail, FileText } from 'lucide-react';

interface WhatFoundrlyDoesProps {
  onCardClick?: (type: string) => void;
}

export default function WhatFoundrlyDoes({ onCardClick }: WhatFoundrlyDoesProps) {
  const features = [
    {
      icon: Linkedin,
      title: 'LinkedIn Posts',
      description: 'Founder-led posts in your voice.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      type: 'linkedin'
    },
    {
      icon: Instagram,
      title: 'Instagram Ads',
      description: 'Video + image ads with AI-optimized timing.',
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-50',
      type: 'instagram'
    },
    {
      icon: Mail,
      title: 'Newsletters',
      description: 'Conversion-focused campaigns in minutes.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      type: 'newsletter'
    },
    {
      icon: FileText,
      title: 'SEO Blog Posts',
      description: 'Long-form, optimized, and ready to publish.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      type: 'blog'
    }
  ];

  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.type}
                onClick={() => onCardClick?.(feature.type)}
                className={`group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-left transform ${
                  index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                }`}
              >
                <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-4 transform transition-transform group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
