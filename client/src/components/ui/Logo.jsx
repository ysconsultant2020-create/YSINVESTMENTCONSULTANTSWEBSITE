import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'h-8 w-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'h-10 w-10', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'h-14 w-14', text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 'h-20 w-20', text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="goldGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5e19e" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8962f" />
            </linearGradient>
            <linearGradient id="navyGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#354f8a" />
              <stop offset="100%" stopColor="#0a1628" />
            </linearGradient>
          </defs>

          {/* Glowing Ring */}
          <circle cx="100" cy="100" r="92" fill="#0f1d32" stroke="url(#goldGradLogo)" strokeWidth="6" />

          {/* Bar Chart Bars */}
          <rect x="35" y="105" width="12" height="35" rx="3" fill="url(#goldGradLogo)" opacity="0.8" />
          <rect x="52" y="90" width="12" height="50" rx="3" fill="url(#goldGradLogo)" opacity="0.9" />
          <rect x="69" y="75" width="12" height="65" rx="3" fill="url(#goldGradLogo)" />

          {/* Y Letter */}
          <path d="M 50 55 L 75 95 L 75 145 M 100 55 L 75 95" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* S Letter in Gold */}
          <path d="M 145 65 C 130 50, 105 55, 105 75 C 105 95, 145 95, 145 118 C 145 140, 115 145, 100 130" stroke="url(#goldGradLogo)" strokeWidth="16" strokeLinecap="round" fill="none" />

          {/* Growth Arrow */}
          <path d="M 110 50 L 155 40 L 145 75" fill="none" stroke="url(#goldGradLogo)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1">
            <span className={`font-extrabold font-display ${currentSize.text} bg-clip-text text-transparent bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 tracking-tight`}>
              YS
            </span>
            <span className={`font-bold font-display ${currentSize.text} text-white tracking-tight`}>
              CONSULTANTS
            </span>
          </div>
          <span className={`font-medium ${currentSize.sub} text-gold-400/80 uppercase tracking-[0.2em]`}>
            Investment Consultants
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
