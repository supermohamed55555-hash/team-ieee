import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gold' | 'compact';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-9',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#073B35';
  const accentColor = '#E3A92F';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Arabic Calligraphy Emblem with Feather Flourish */}
      <svg
        viewBox="0 0 160 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-[150px] shrink-0"
        aria-label="يوزرسيف - طباعة وتخصيص"
      >
        {/* Background pill subtle glow if light */}
        <defs>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3A92F" />
            <stop offset="100%" stopColor="#D4971A" />
          </linearGradient>
        </defs>

        {/* Artistic Calligraphic Leaf / Feather Motif representing craftsmanship */}
        <path
          d="M 148 10 C 130 14, 120 28, 126 38 C 129 42, 137 44, 142 38 C 146 32, 148 22, 148 10 Z"
          fill="url(#logoGoldGrad)"
          opacity="0.95"
        />
        <path
          d="M 126 38 C 134 32, 142 22, 148 10"
          stroke={isLight ? '#FFFFFF' : '#073B35'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Calligraphic wordmark representation of 'يوزرسيف' in harmonious vector curves */}
        <text
          x="118"
          y="35"
          textAnchor="end"
          fontFamily="'Reem Kufi', 'Cairo', sans-serif"
          fontWeight="700"
          fontSize="27"
          fill={textColor}
          letterSpacing="0.5px"
        >
          يوزرسيف
        </text>

        {/* Subtle decorative dot & accent */}
        <circle cx="123" cy="18" r="2.5" fill={accentColor} />
      </svg>

      {showSubtitle && (
        <div className="flex flex-col justify-center border-r border-[#073B35]/20 pr-2 mr-1">
          <span
            className={`text-[10px] tracking-wider font-semibold uppercase leading-tight ${
              isLight ? 'text-[#F6F1E7]/80' : 'text-[#0B5F55]'
            }`}
          >
            أسوان
          </span>
          <span
            className={`text-[9px] font-medium leading-none ${
              isLight ? 'text-[#E3A92F]' : 'text-[#073B35]/60'
            }`}
          >
            طباعة وتخصيص
          </span>
        </div>
      )}
    </div>
  );
};
