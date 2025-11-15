import { useState, useEffect } from 'react';

interface FoundiiProps {
  size?: number;
  animate?: boolean;
  gesture?: 'idle' | 'wave' | 'typing' | 'thinking';
}

export default function Foundii({ size = 200, animate = true, gesture = 'idle' }: FoundiiProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (animate) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(blinkInterval);
    }
  }, [animate]);

  const getWaveArmRotation = gesture === 'wave' ? 'animate-wave-arm' : '';

  return (
    <div className="relative inline-block" style={{ width: size, height: size * 1.3 }}>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 300 390"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? 'animate-foundii-float' : ''}
      >
        <defs>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="10" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="innerShading">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="-2" dy="3" result="offsetblur" />
            <feFlood floodColor="#E2E8F0" floodOpacity="0.5" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="bodyGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>

          <radialGradient id="eyeGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </radialGradient>

          <linearGradient id="eyeShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="shadowGradient">
            <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx="150"
          cy="370"
          rx="60"
          ry="12"
          fill="url(#shadowGradient)"
          className={animate ? 'animate-shadow-pulse' : ''}
        />

        <g className={animate ? 'animate-body-sway' : ''}>
          <ellipse
            cx="150"
            cy="285"
            rx="32"
            ry="38"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />
          <rect
            x="130"
            y="268"
            width="40"
            height="50"
            rx="20"
            fill="url(#bodyGradient)"
            filter="url(#innerShading)"
          />

          <ellipse cx="138" cy="330" rx="12" ry="18" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          <ellipse cx="162" cy="330" rx="12" ry="18" fill="url(#bodyGradient)" filter="url(#softShadow)" />

          <ellipse cx="138" cy="348" rx="14" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          <ellipse cx="162" cy="348" rx="14" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

        <g className={gesture === 'wave' ? '' : ''}>
          <ellipse
            cx="105"
            cy="250"
            rx="18"
            ry="14"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
            className={gesture === 'wave' ? 'origin-[105_250]' : ''}
          />
          <path
            d="M 110 235 Q 108 220, 110 205"
            stroke="url(#bodyGradient)"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            filter="url(#softShadow)"
            className={gesture === 'wave' ? 'origin-[105_250]' : ''}
          />

          <g className={gesture === 'wave' ? getWaveArmRotation + ' origin-[110_195]' : ''}>
            <ellipse
              cx="110"
              cy="185"
              rx="16"
              ry="20"
              fill="url(#bodyGradient)"
              filter="url(#softShadow)"
            />

            <ellipse cx="100" cy="170" rx="8" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
            <ellipse cx="115" cy="168" rx="8" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
            <ellipse cx="108" cy="162" rx="7" ry="9" fill="url(#bodyGradient)" filter="url(#softShadow)" />
            <ellipse cx="120" cy="175" rx="7" ry="8" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          </g>
        </g>

        <g>
          <ellipse
            cx="195"
            cy="250"
            rx="18"
            ry="14"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />
          <path
            d="M 190 235 Q 192 220, 190 205"
            stroke="url(#bodyGradient)"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            filter="url(#softShadow)"
          />

          <ellipse
            cx="190"
            cy="185"
            rx="16"
            ry="20"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />
        </g>

        <g className={animate ? 'animate-head-tilt' : ''}>
          <ellipse
            cx="150"
            cy="230"
            rx="18"
            ry="10"
            fill="#E2E8F0"
            opacity="0.8"
          />

          <ellipse
            cx="150"
            cy="155"
            rx="65"
            ry="75"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />

          <ellipse
            cx="150"
            cy="145"
            rx="62"
            ry="70"
            fill="url(#bodyGradient)"
            filter="url(#innerShading)"
          />

          <g className={animate ? 'animate-eye-shine' : ''}>
            <ellipse
              cx="125"
              cy="150"
              rx="18"
              ry={isBlinking ? 2 : 22}
              fill="url(#eyeGradient)"
              className="transition-all duration-150"
            />
            <ellipse
              cx="120"
              cy="142"
              rx="8"
              ry={isBlinking ? 1 : 10}
              fill="url(#eyeShine)"
              className="transition-all duration-150"
            />
            <circle
              cx="130"
              cy="145"
              r={isBlinking ? 0 : 4}
              fill="white"
              opacity="0.8"
              className="transition-all duration-150"
            />
          </g>

          <g className={animate ? 'animate-eye-shine' : ''}>
            <ellipse
              cx="175"
              cy="150"
              rx="18"
              ry={isBlinking ? 2 : 22}
              fill="url(#eyeGradient)"
              className="transition-all duration-150"
            />
            <ellipse
              cx="170"
              cy="142"
              rx="8"
              ry={isBlinking ? 1 : 10}
              fill="url(#eyeShine)"
              className="transition-all duration-150"
            />
            <circle
              cx="180"
              cy="145"
              r={isBlinking ? 0 : 4}
              fill="white"
              opacity="0.8"
              className="transition-all duration-150"
            />
          </g>

          <path
            d="M 135 180 Q 150 188, 165 180"
            stroke="#64748B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {gesture === 'thinking' && (
            <path
              d="M 140 175 Q 150 178, 160 175"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          )}
        </g>

        {gesture === 'thinking' && (
          <g className="animate-thinking-bubbles">
            <circle cx="210" cy="120" r="6" fill="#3B82F6" opacity="0.3" />
            <circle cx="230" cy="95" r="9" fill="#60A5FA" opacity="0.25" />
            <circle cx="250" cy="70" r="12" fill="#93C5FD" opacity="0.2" />
          </g>
        )}

        {animate && (
          <g opacity="0.5">
            <circle cx="90" cy="180" r="3" fill="#3B82F6" className="animate-particle-float" />
            <circle cx="210" cy="200" r="2.5" fill="#60A5FA" className="animate-particle-float animation-delay-400" />
            <circle cx="85" cy="260" r="2" fill="#93C5FD" className="animate-particle-float animation-delay-800" />
            <circle cx="215" cy="270" r="2.5" fill="#3B82F6" className="animate-particle-float animation-delay-600" />
          </g>
        )}
      </svg>
    </div>
  );
}
