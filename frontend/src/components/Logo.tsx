import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center group"
        style={{ width: size, height: size }}
      >
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
        
        {/* Main Logo Container */}
        <div className="relative w-full h-full bg-[#0d1321] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Inner Gradient Shape */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 opacity-50"></div>
          
          {/* SVG Icon */}
          <svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
          >
            {/* Abstract Arbitrage Arrows / Growth Symbol */}
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              fill="url(#logo-gradient)"
              stroke="white"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="logo-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-bl-lg opacity-80"></div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
              CRYPTO
            </span>
            <span className="text-xl font-black tracking-tighter text-emerald-400">
              ARB
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-[-2px]">
            <div className="h-[1px] w-4 bg-emerald-500/50"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
              QUANT TRADING
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
