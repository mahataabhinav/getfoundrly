interface LogoProps {
  variant?: 'dark' | 'light';
  iconSize?: number;
  showWordmark?: boolean;
}

export default function Logo({ variant = 'dark', iconSize = 32, showWordmark = true }: LogoProps) {
  const iconColor = variant === 'light' ? '#FFFFFF' : '#1A1A1A';
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1A1A1A]';

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="38"
          stroke={iconColor}
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />

        <path
          d="M 50 32 L 60 50 L 50 58 L 40 50 Z"
          fill={iconColor}
        />

        <circle
          cx="50"
          cy="50"
          r="2.5"
          fill={iconColor}
        />
      </svg>

      {showWordmark && (
        <span className={`text-2xl font-medium tracking-[-0.03em] ${textColor}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif' }}>
          Foundrly
        </span>
      )}
    </div>
  );
}
