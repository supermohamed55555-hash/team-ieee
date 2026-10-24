import React from 'react';

export const ProductAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full max-w-md aspect-square mx-auto flex items-center justify-center p-6 ${className}`}
      aria-label="رسم توضيحي متحرك لعمليات الطباعة والتصميم الرقمي"
      role="img"
    >
      {/* Decorative Glow */}
      <div className="absolute inset-4 rounded-full bg-linear-to-tr from-blue-400/20 via-purple-300/20 to-amber-300/20 blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id="cmykGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="33%" stopColor="#e0218a" />
            <stop offset="66%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Circular Track (slow rotation) */}
        <circle
          cx="200"
          cy="200"
          r="170"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeDasharray="6 8"
          className="animate-[spin_40s_linear_infinite] motion-reduce:animate-none origin-center"
        />

        {/* Orbiting CMYK Color Dots */}
        <g className="animate-[spin_16s_linear_infinite] motion-reduce:animate-none origin-center">
          {/* Cyan */}
          <circle cx="200" cy="30" r="10" fill="#00c0f0" filter="url(#shadow)" />
          {/* Magenta */}
          <circle cx="370" cy="200" r="10" fill="#f43f5e" filter="url(#shadow)" />
          {/* Yellow */}
          <circle cx="200" cy="370" r="10" fill="#fbbf24" filter="url(#shadow)" />
          {/* Key/Black */}
          <circle cx="30" cy="200" r="10" fill="#1e293b" filter="url(#shadow)" />
        </g>

        {/* Main Printer / Design Press Body */}
        <g filter="url(#shadow)">
          <rect
            x="90"
            y="130"
            width="220"
            height="140"
            rx="20"
            fill="url(#pressGrad)"
            stroke="#1d4ed8"
            strokeWidth="3"
          />
          {/* Display screen */}
          <rect x="120" y="150" width="80" height="36" rx="6" fill="#0f172a" />
          <circle cx="135" cy="168" r="4" fill="#22c55e" className="animate-pulse motion-reduce:animate-none" />
          <line x1="148" y1="164" x2="185" y2="164" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="148" y1="172" x2="175" y2="172" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

          {/* Action LEDs */}
          <circle cx="250" cy="162" r="5" fill="#38bdf8" />
          <circle cx="270" cy="162" r="5" fill="#e0218a" />
          <circle cx="250" cy="176" r="5" fill="#ffd166" />
          <circle cx="270" cy="176" r="5" fill="#ffffff" opacity="0.8" />

          {/* Paper Output Slot */}
          <rect x="110" y="210" width="180" height="12" rx="4" fill="#0f172a" />
        </g>

        {/* Animated Moving Paper Sheet */}
        <g className="animate-[bounce_3s_ease-in-out_infinite] motion-reduce:animate-none">
          <rect
            x="125"
            y="216"
            width="150"
            height="100"
            rx="8"
            fill="url(#paperGrad)"
            stroke="#cbd5e1"
            strokeWidth="2"
            filter="url(#shadow)"
          />
          {/* Printed Content on Paper */}
          {/* CMYK Test Bar */}
          <rect x="140" y="232" width="120" height="6" rx="3" fill="url(#cmykGrad)" />
          {/* Logo stamp shape */}
          <circle cx="155" cy="260" r="12" fill="#2563eb" />
          <path d="M151 260 L154 264 L161 256" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Text lines */}
          <line x1="175" y1="254" x2="245" y2="254" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="175" y1="264" x2="225" y2="264" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="140" y1="285" x2="245" y2="285" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          <line x1="140" y1="295" x2="210" y2="295" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Creative Tool (Pen / Stylus) */}
        <g className="animate-[wiggle_4s_ease-in-out_infinite] motion-reduce:animate-none origin-bottom-left">
          <g transform="translate(290, 80) rotate(35)">
            <rect x="0" y="0" width="16" height="70" rx="8" fill="#e11d48" filter="url(#shadow)" />
            <polygon points="0,70 16,70 8,88" fill="#0f172a" />
            <circle cx="8" cy="88" r="2" fill="#38bdf8" />
            <rect x="3" y="10" width="10" height="20" rx="3" fill="#ffffff" opacity="0.4" />
          </g>
        </g>

        {/* Floating Creative Sparkles */}
        <g className="animate-pulse motion-reduce:animate-none">
          <polygon points="80,95 84,80 88,95 103,99 88,103 84,118 80,103 65,99" fill="#f59e0b" />
          <polygon points="310,290 312,280 314,290 324,292 314,294 312,304 310,294 300,292" fill="#8b5cf6" />
        </g>
      </svg>
    </div>
  );
};
