interface Stat {
  value: string;
  label: string;
  color?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: 'light' | 'dark';
}

export default function StatsBar({ stats, variant = 'light' }: StatsBarProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                isDark ? 'text-white' : stat.color || 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm md:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
