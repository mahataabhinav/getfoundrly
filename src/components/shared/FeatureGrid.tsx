import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  onFeatureClick?: (index: number) => void;
}

export default function FeatureGrid({ features, columns = 3, onFeatureClick }: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isClickable = !!onFeatureClick;

        return (
          <div
            key={index}
            onClick={() => onFeatureClick?.(index)}
            className={`group bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-300 ${
              isClickable ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:border-gray-200' : 'hover:shadow-lg'
            }`}
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color || 'from-blue-500 to-blue-600'} bg-opacity-10 mb-4 transform transition-transform group-hover:scale-110`}>
              <Icon className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>

            {isClickable && (
              <div className="mt-4 flex items-center text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Learn more</span>
                <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
