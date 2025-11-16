import { useState, useEffect, useRef } from 'react';

interface RobotChatbotProps {
  size?: number;
  animate?: boolean;
  gesture?: 'idle' | 'wave' | 'typing' | 'thinking' | 'excited' | 'celebrate';
}

export default function RobotChatbot({
  size = 200,
  animate = true,
  gesture = 'idle'
}: RobotChatbotProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(blinkInterval);
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

      if (distance < 500) {
        const maxMove = 8;
        const moveX = (deltaX / distance) * Math.min(distance / 50, maxMove);
        const moveY = (deltaY / distance) * Math.min(distance / 50, maxMove);
        setEyePosition({ x: moveX, y: moveY });
      } else {
        setEyePosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animate]);

  const getAnimationClass = () => {
    if (!animate) return '';
    if (gesture === 'wave') return 'animate-robot-wave';
    if (gesture === 'excited') return 'animate-robot-excited';
    if (gesture === 'celebrate') return 'animate-robot-celebrate';
    return 'animate-robot-float';
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      style={{ width: size, height: size * 1.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 300 390"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={getAnimationClass()}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="blur" in2="SourceAlpha" operator="in"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8EDF2" />
            <stop offset="30%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="darkMetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="eyeGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </radialGradient>

          <radialGradient id="energyCoreGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.4" />
          </radialGradient>

          <linearGradient id="panelLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="shadowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx="150"
          cy="375"
          rx="80"
          ry="12"
          fill="url(#shadowGradient)"
          opacity={gesture === 'excited' || gesture === 'celebrate' ? '0.2' : '0.4'}
        />

        <g className={animate ? 'animate-robot-breathing' : ''}>
          <g>
            <rect
              x="110"
              y="270"
              width="35"
              height="85"
              rx="17"
              fill="url(#metalGradient)"
              stroke="#94A3B8"
              strokeWidth="2"
            />
            <circle cx="127" cy="285" r="8" fill="#64748B" />
            <rect x="118" y="345" width="18" height="25" rx="9" fill="url(#darkMetalGradient)" />
            <ellipse cx="127" cy="372" rx="12" ry="6" fill="#475569" opacity="0.8" />
          </g>

          <g>
            <rect
              x="155"
              y="270"
              width="35"
              height="85"
              rx="17"
              fill="url(#metalGradient)"
              stroke="#94A3B8"
              strokeWidth="2"
            />
            <circle cx="172" cy="285" r="8" fill="#64748B" />
            <rect x="164" y="345" width="18" height="25" rx="9" fill="url(#darkMetalGradient)" />
            <ellipse cx="173" cy="372" rx="12" ry="6" fill="#475569" opacity="0.8" />
          </g>

          <rect
            x="100"
            y="200"
            width="100"
            height="90"
            rx="15"
            fill="url(#metalGradient)"
            stroke="#94A3B8"
            strokeWidth="3"
          />

          <rect
            x="107"
            y="207"
            width="86"
            height="76"
            rx="10"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          <rect x="115" y="215" width="70" height="2" rx="1" fill="url(#panelLineGradient)" className="animate-led-pulse" />
          <rect x="115" y="222" width="70" height="2" rx="1" fill="url(#panelLineGradient)" className="animate-led-pulse animation-delay-400" />

          <g className="animate-energy-core">
            <circle cx="150" cy="250" r="18" fill="url(#energyCoreGradient)" filter="url(#glow)" opacity="0.9" />
            <circle cx="150" cy="250" r="12" fill="#60A5FA" opacity="0.6" />
            <circle cx="150" cy="250" r="6" fill="#FFFFFF" opacity="0.8" />
          </g>

          <rect x="115" y="268" width="8" height="8" rx="2" fill="#22C55E" className="animate-led-pulse" opacity="0.8" />
          <rect x="130" y="268" width="8" height="8" rx="2" fill="#EAB308" className="animate-led-pulse animation-delay-600" opacity="0.8" />
          <rect x="145" y="268" width="8" height="8" rx="2" fill="#3B82F6" className="animate-led-pulse animation-delay-200" opacity="0.8" />

          {gesture === 'thinking' && (
            <g opacity="0.7">
              <path d="M 155 235 Q 160 235 165 240" stroke="#60A5FA" strokeWidth="2" fill="none" className="animate-hologram-flicker" />
              <path d="M 155 245 Q 162 245 169 250" stroke="#3B82F6" strokeWidth="2" fill="none" className="animate-hologram-flicker animation-delay-200" />
              <path d="M 155 255 Q 165 255 175 260" stroke="#60A5FA" strokeWidth="2" fill="none" className="animate-hologram-flicker animation-delay-400" />
            </g>
          )}
        </g>

        <g className={gesture === 'wave' ? 'animate-robot-arm-wave' : ''} style={{ transformOrigin: '75px 210px' }}>
          <rect
            x="60"
            y="210"
            width="30"
            height="50"
            rx="15"
            fill="url(#metalGradient)"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <circle cx="75" cy="220" r="10" fill="#64748B" />

          <g className={gesture === 'wave' ? 'animate-robot-hand-rotate' : ''} style={{ transformOrigin: '70px 270px' }}>
            <ellipse cx="70" cy="270" rx="12" ry="18" fill="url(#metalGradient)" stroke="#94A3B8" strokeWidth="2" />
            <rect x="64" y="255" width="3" height="12" rx="1.5" fill="#CBD5E1" />
            <rect x="68" y="252" width="3" height="15" rx="1.5" fill="#CBD5E1" />
            <rect x="72" y="255" width="3" height="12" rx="1.5" fill="#CBD5E1" />
          </g>
        </g>

        <g className={gesture === 'excited' || gesture === 'celebrate' ? 'animate-robot-arm-wave' : ''} style={{ transformOrigin: '225px 210px' }}>
          <rect
            x="210"
            y="210"
            width="30"
            height="50"
            rx="15"
            fill="url(#metalGradient)"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <circle cx="225" cy="220" r="10" fill="#64748B" />

          <ellipse cx="230" cy="270" rx="12" ry="18" fill="url(#metalGradient)" stroke="#94A3B8" strokeWidth="2" />
          <rect x="224" y="255" width="3" height="12" rx="1.5" fill="#CBD5E1" />
          <rect x="228" y="252" width="3" height="15" rx="1.5" fill="#CBD5E1" />
          <rect x="232" y="255" width="3" height="12" rx="1.5" fill="#CBD5E1" />
        </g>

        <g className={animate && gesture === 'idle' ? 'animate-robot-head-nod' : gesture === 'thinking' ? 'animate-robot-thinking' : ''} style={{ transformOrigin: '150px 190px' }}>
          <circle cx="150" cy="195" r="8" fill="#64748B" opacity="0.6" />

          <rect
            x="95"
            y="100"
            width="110"
            height="110"
            rx="25"
            fill="url(#metalGradient)"
            stroke="#94A3B8"
            strokeWidth="3"
          />

          <rect
            x="102"
            y="107"
            width="96"
            height="96"
            rx="20"
            fill="#F8FAFC"
          />

          <g className="animate-antenna-bob" style={{ transformOrigin: '150px 100px' }}>
            <line x1="150" y1="100" x2="150" y2="75" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="150" cy="72" r="5" fill="#60A5FA" filter="url(#glow)" className="animate-led-pulse" />
          </g>

          <rect x="110" y="120" width="80" height="3" rx="1.5" fill="#3B82F6" opacity="0.3" />

          <g>
            <rect
              x="115"
              y="140"
              width="28"
              height="32"
              rx="14"
              fill="#1E293B"
              opacity="0.15"
            />
            <ellipse
              cx="129"
              cy={isBlinking ? 156 : 156}
              rx="18"
              ry={isBlinking ? 2 : 20}
              fill="url(#eyeGradient)"
              filter="url(#innerGlow)"
              className="transition-all duration-150"
            />
            {!isBlinking && (
              <>
                <circle
                  cx={129 + eyePosition.x}
                  cy={156 + eyePosition.y}
                  r="10"
                  fill="#1E40AF"
                />
                <circle
                  cx={129 + eyePosition.x}
                  cy={156 + eyePosition.y}
                  r="5"
                  fill="#000000"
                />
                <circle
                  cx={132 + eyePosition.x * 0.5}
                  cy={153 + eyePosition.y * 0.5}
                  r="3"
                  fill="#FFFFFF"
                  opacity="0.9"
                />
              </>
            )}
          </g>

          <g>
            <rect
              x="157"
              y="140"
              width="28"
              height="32"
              rx="14"
              fill="#1E293B"
              opacity="0.15"
            />
            <ellipse
              cx="171"
              cy={isBlinking ? 156 : 156}
              rx="18"
              ry={isBlinking ? 2 : 20}
              fill="url(#eyeGradient)"
              filter="url(#innerGlow)"
              className="transition-all duration-150"
            />
            {!isBlinking && (
              <>
                <circle
                  cx={171 + eyePosition.x}
                  cy={156 + eyePosition.y}
                  r="10"
                  fill="#1E40AF"
                />
                <circle
                  cx={171 + eyePosition.x}
                  cy={156 + eyePosition.y}
                  r="5"
                  fill="#000000"
                />
                <circle
                  cx={174 + eyePosition.x * 0.5}
                  cy={153 + eyePosition.y * 0.5}
                  r="3"
                  fill="#FFFFFF"
                  opacity="0.9"
                />
              </>
            )}
          </g>

          {(gesture === 'wave' || gesture === 'excited' || gesture === 'celebrate' || isHovered) && (
            <path
              d="M 135 178 Q 150 188, 165 178"
              stroke="#475569"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {gesture === 'thinking' && (
            <ellipse cx="150" cy="180" rx="10" ry="6" fill="#475569" opacity="0.4" />
          )}

          {gesture === 'idle' && !isHovered && (
            <line x1="138" y1="180" x2="162" y2="180" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          )}

          <circle cx="118" cy="145" r="2" fill="#3B82F6" opacity="0.5" />
          <circle cx="182" cy="145" r="2" fill="#3B82F6" opacity="0.5" />
        </g>

        {gesture === 'thinking' && (
          <g className="animate-thinking-bubbles" style={{ animationDuration: '2.5s' }}>
            <circle cx="220" cy="120" r="6" fill="#60A5FA" opacity="0.6" />
            <circle cx="235" cy="95" r="9" fill="#3B82F6" opacity="0.5" />
            <circle cx="248" cy="68" r="12" fill="#2563EB" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {(animate || gesture === 'celebrate' || gesture === 'excited') && (
          <g opacity={gesture === 'celebrate' ? '1' : '0.5'}>
            <circle cx="70" cy="140" r="3" fill="#60A5FA" className="animate-particle-float" />
            <circle cx="230" cy="160" r="3" fill="#3B82F6" className="animate-particle-float animation-delay-400" />
            <circle cx="65" cy="220" r="2" fill="#93C5FD" className="animate-particle-float animation-delay-800" />
            <circle cx="235" cy="240" r="2.5" fill="#60A5FA" className="animate-particle-float animation-delay-600" />

            {gesture === 'celebrate' && (
              <>
                <circle cx="150" cy="80" r="4" fill="#FBBF24" className="animate-sparkle" />
                <circle cx="120" cy="100" r="3" fill="#F59E0B" className="animate-sparkle animation-delay-200" />
                <circle cx="180" cy="95" r="3" fill="#FBBF24" className="animate-sparkle animation-delay-400" />
                <circle cx="110" cy="150" r="3" fill="#EAB308" className="animate-sparkle animation-delay-600" />
                <circle cx="190" cy="155" r="3" fill="#FBBF24" className="animate-sparkle animation-delay-800" />
              </>
            )}
          </g>
        )}

        {isHovered && (
          <circle
            cx="150"
            cy="155"
            r="100"
            fill="#60A5FA"
            opacity="0.1"
            className="animate-glow-pulse"
          />
        )}
      </svg>
    </div>
  );
}
