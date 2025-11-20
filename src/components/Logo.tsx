interface LogoProps {
  variant?: 'dark' | 'light' | 'color';
  iconSize?: number;
  showWordmark?: boolean;
}

export default function Logo({ variant = 'dark', iconSize = 32, showWordmark = true }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1A1A1A]';

  const getIconFill = () => {
    if (variant === 'light') return '#FFFFFF';
    if (variant === 'color') return 'url(#logo-gradient)';
    return '#1A1A1A';
  };

  return (
    <div className="flex items-center gap-1">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        <path
          d="M 30 25 L 70 25 L 70 40 L 45 40 L 45 50 L 65 50 L 65 65 L 45 65 L 45 82 L 55 82 L 55 92 L 50 92 L 30 92 L 30 82 L 40 82 L 40 25 Z"
          fill={getIconFill()}
          opacity="0.95"
        />

        <path
          d="M 55 70 L 70 55 L 75 60 L 60 75 Z"
          fill={getIconFill()}
          opacity="0.85"
        />

        <circle
          cx="72"
          cy="72"
          r="3"
          fill={getIconFill()}
          opacity="0.9"
        />
      </svg>

      {showWordmark && (
        <span
          className={`text-2xl font-bold tracking-tight ${textColor}`}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          <span className="font-bold">oundrly</span>
        </span>
      )}
    </div>
  );
}
