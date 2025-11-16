import { useState, useEffect, useRef } from 'react';

interface FoundiiProps {
  size?: number;
  animate?: boolean;
  gesture?: 'idle' | 'wave' | 'typing' | 'thinking' | 'excited' | 'celebrate';
}

export default function Foundii({ size = 200, animate = true, gesture = 'idle' }: FoundiiProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }, 2500 + Math.random() * 2500);

      return () => {
        clearInterval(blinkInterval);
      };
    }
  }, [animate]);

  useEffect(() => {
    if (!animate) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 400) {
        const maxMove = 6;
        const moveX = (deltaX / distance) * Math.min(distance / 40, maxMove);
        const moveY = (deltaY / distance) * Math.min(distance / 40, maxMove);
        setEyePosition({ x: moveX, y: moveY });
      } else {
        setEyePosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      style={{ width: size, height: size * 1.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 300 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? 'animate-foundii-float' : ''}
      >
        <defs>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.25" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="metallicShine">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="-1" dy="2" result="offsetblur" />
            <feFlood floodColor="#FFFFFF" floodOpacity="0.6" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="bodyGradient" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F1F5F9" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          <radialGradient id="metallicGradient" cx="35%" cy="25%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          <radialGradient id="eyeGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <radialGradient id="eyeGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="eyeShine" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="shadowGradient">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="accentGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx="150"
          cy="345"
          rx="70"
          ry="10"
          fill="url(#shadowGradient)"
          className={animate ? 'animate-shadow-pulse' : ''}
          opacity={gesture === 'celebrate' ? '0.15' : '0.3'}
        />

        <g className={animate ? 'animate-body-bounce' : ''} transform={gesture === 'celebrate' ? 'translate(0, -15)' : ''}>
          <rect
            x="115"
            y="245"
            width="70"
            height="75"
            rx="35"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />

          <rect
            x="120"
            y="250"
            width="60"
            height="65"
            rx="30"
            fill="url(#metallicGradient)"
            filter="url(#metallicShine)"
          />

          <circle cx="135" cy="275" r="4" fill="#3B82F6" opacity="0.6" />
          <circle cx="165" cy="275" r="4" fill="#3B82F6" opacity="0.6" />

          <rect x="140" y="285" width="20" height="3" rx="1.5" fill="#CBD5E1" opacity="0.5" />
          <rect x="140" y="292" width="20" height="3" rx="1.5" fill="#CBD5E1" opacity="0.5" />
          <rect x="140" y="299" width="20" height="3" rx="1.5" fill="#CBD5E1" opacity="0.5" />

          <ellipse cx="130" cy="325" rx="14" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          <ellipse cx="170" cy="325" rx="14" ry="10" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

        <g className={gesture === 'wave' || gesture === 'celebrate' ? 'animate-left-arm-wave' : gesture === 'excited' ? 'animate-arm-excited' : ''}>
          <rect
            x="85"
            y="260"
            width="20"
            height="35"
            rx="10"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
            transform-origin="95 265"
          />

          <circle cx="95" cy="270" r="8" fill="#94A3B8" />

          <g className={gesture === 'wave' ? 'animate-hand-wave' : ''}>
            <rect
              x="80"
              y="225"
              width="18"
              height="30"
              rx="9"
              fill="url(#metallicGradient)"
              filter="url(#softShadow)"
            />

            <circle cx="85" cy="215" r="6" fill="url(#bodyGradient)" />
            <circle cx="93" cy="215" r="6" fill="url(#bodyGradient)" />
            <circle cx="89" cy="208" r="5" fill="url(#bodyGradient)" />
          </g>
        </g>

        <g className={gesture === 'wave' || gesture === 'celebrate' ? 'animate-right-arm-wave' : gesture === 'excited' ? 'animate-arm-excited' : ''}>
          <rect
            x="195"
            y="260"
            width="20"
            height="35"
            rx="10"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
            transform-origin="205 265"
          />

          <circle cx="205" cy="270" r="8" fill="#94A3B8" />

          <rect
            x="202"
            y="225"
            width="18"
            height="30"
            rx="9"
            fill="url(#metallicGradient)"
            filter="url(#softShadow)"
          />

          <circle cx="207" cy="215" r="6" fill="url(#bodyGradient)" />
          <circle cx="215" cy="215" r="6" fill="url(#bodyGradient)" />
          <circle cx="211" cy="208" r="5" fill="url(#bodyGradient)" />
        </g>

        <g className={animate ? (gesture === 'excited' ? 'animate-head-excited' : 'animate-head-tilt') : ''}>
          <circle
            cx="150"
            cy="235"
            r="12"
            fill="#CBD5E1"
            opacity="0.6"
          />

          <rect
            x="85"
            y="115"
            width="130"
            height="120"
            rx="65"
            fill="url(#bodyGradient)"
            filter="url(#softShadow)"
          />

          <rect
            x="90"
            y="120"
            width="120"
            height="110"
            rx="60"
            fill="url(#metallicGradient)"
            filter="url(#metallicShine)"
          />

          <rect
            x="100"
            y="130"
            width="100"
            height="3"
            rx="1.5"
            fill="#3B82F6"
            opacity="0.4"
          />

          <g>
            <rect
              x="110"
              y="155"
              width="30"
              height="35"
              rx="15"
              fill="#0F172A"
              opacity="0.9"
            />
            <ellipse
              cx="125"
              cy={isBlinking ? 172 : 172}
              rx="20"
              ry={isBlinking ? 2 : 24}
              fill="url(#eyeGradient)"
              className="transition-all duration-200"
              filter="url(#softShadow)"
            />
            <circle
              cx={125 + eyePosition.x}
              cy={172 + eyePosition.y}
              r={isBlinking ? 0 : 18}
              fill="url(#eyeGradient)"
              className="transition-all duration-200"
            />
            <circle
              cx={125 + eyePosition.x}
              cy={172 + eyePosition.y}
              r={isBlinking ? 0 : 8}
              fill="#60A5FA"
              opacity="0.6"
              className={animate ? 'animate-eye-glow' : ''}
            />
            <ellipse
              cx={120 + eyePosition.x * 0.7}
              cy={167 + eyePosition.y * 0.7}
              rx={isBlinking ? 0 : 8}
              ry={isBlinking ? 0 : 10}
              fill="url(#eyeShine)"
              className="transition-all duration-200"
            />
            <circle
              cx={129 + eyePosition.x * 0.5}
              cy={170 + eyePosition.y * 0.5}
              r={isBlinking ? 0 : 3}
              fill="white"
              className="transition-all duration-200"
            />
          </g>

          <g>
            <rect
              x="160"
              y="155"
              width="30"
              height="35"
              rx="15"
              fill="#0F172A"
              opacity="0.9"
            />
            <ellipse
              cx="175"
              cy={isBlinking ? 172 : 172}
              rx="20"
              ry={isBlinking ? 2 : 24}
              fill="url(#eyeGradient)"
              className="transition-all duration-200"
              filter="url(#softShadow)"
            />
            <circle
              cx={175 + eyePosition.x}
              cy={172 + eyePosition.y}
              r={isBlinking ? 0 : 18}
              fill="url(#eyeGradient)"
              className="transition-all duration-200"
            />
            <circle
              cx={175 + eyePosition.x}
              cy={172 + eyePosition.y}
              r={isBlinking ? 0 : 8}
              fill="#60A5FA"
              opacity="0.6"
              className={animate ? 'animate-eye-glow' : ''}
            />
            <ellipse
              cx={170 + eyePosition.x * 0.7}
              cy={167 + eyePosition.y * 0.7}
              rx={isBlinking ? 0 : 8}
              ry={isBlinking ? 0 : 10}
              fill="url(#eyeShine)"
              className="transition-all duration-200"
            />
            <circle
              cx={179 + eyePosition.x * 0.5}
              cy={170 + eyePosition.y * 0.5}
              r={isBlinking ? 0 : 3}
              fill="white"
              className="transition-all duration-200"
            />
          </g>

          {(gesture === 'wave' || gesture === 'excited' || isHovered) && (
            <g>
              <path
                d="M 115 150 Q 110 145, 108 140"
                stroke="#475569"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className="animate-eyebrow-raise"
              />
              <path
                d="M 185 150 Q 190 145, 192 140"
                stroke="#475569"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className="animate-eyebrow-raise"
              />
            </g>
          )}

          {gesture === 'thinking' ? (
            <ellipse
              cx="150"
              cy="205"
              rx="12"
              ry="8"
              fill="#475569"
              opacity="0.4"
            />
          ) : (
            <path
              d={gesture === 'celebrate' || gesture === 'excited' || isHovered
                ? "M 130 200 Q 150 215, 170 200"
                : "M 135 205 Q 150 210, 165 205"
              }
              stroke="#475569"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300"
            />
          )}

          <rect
            x="145"
            y="195"
            width="10"
            height="4"
            rx="2"
            fill="#64748B"
            opacity="0.3"
          />
        </g>

        {gesture === 'thinking' && (
          <g className="animate-thinking-bubbles">
            <circle cx="220" cy="130" r="5" fill="#60A5FA" opacity="0.4" />
            <circle cx="235" cy="110" r="7" fill="#3B82F6" opacity="0.35" />
            <circle cx="248" cy="88" r="10" fill="#2563EB" opacity="0.3" />
          </g>
        )}

        {(animate || gesture === 'celebrate' || gesture === 'excited') && (
          <g opacity={gesture === 'celebrate' ? '0.8' : '0.4'}>
            <circle cx="80" cy="160" r="3" fill="#60A5FA" className="animate-particle-float" />
            <circle cx="220" cy="180" r="3" fill="#3B82F6" className="animate-particle-float animation-delay-400" />
            <circle cx="75" cy="240" r="2" fill="#93C5FD" className="animate-particle-float animation-delay-800" />
            <circle cx="225" cy="250" r="2.5" fill="#60A5FA" className="animate-particle-float animation-delay-600" />
            {gesture === 'celebrate' && (
              <>
                <circle cx="150" cy="100" r="4" fill="#FBBF24" className="animate-sparkle" />
                <circle cx="120" cy="120" r="3" fill="#F59E0B" className="animate-sparkle animation-delay-200" />
                <circle cx="180" cy="115" r="3" fill="#FBBF24" className="animate-sparkle animation-delay-400" />
              </>
            )}
          </g>
        )}

        {isHovered && (
          <circle
            cx="150"
            cy="180"
            r="90"
            fill="url(#accentGlow)"
            className="animate-glow-pulse"
          />
        )}
      </svg>
    </div>
  );
}
