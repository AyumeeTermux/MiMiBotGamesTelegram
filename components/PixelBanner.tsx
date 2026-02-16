
import React from 'react';

interface PixelBannerProps {
  type: 'profile' | 'battle' | 'inventory' | 'shop' | 'bot';
  title: string;
  subtitle?: string;
}

const PixelBanner: React.FC<PixelBannerProps> = ({ type, title, subtitle }) => {
  const configs = {
    profile: {
      icon: 'fa-user-shield',
      gradient: 'from-indigo-600 via-indigo-800 to-slate-900',
      accent: 'bg-indigo-400',
      pattern: 'opacity-20'
    },
    battle: {
      icon: 'fa-skull-crossbones',
      gradient: 'from-rose-600 via-rose-900 to-black',
      accent: 'bg-rose-500',
      pattern: 'opacity-30'
    },
    inventory: {
      icon: 'fa-box-open',
      gradient: 'from-emerald-600 via-emerald-900 to-slate-950',
      accent: 'bg-emerald-400',
      pattern: 'opacity-20'
    },
    shop: {
      icon: 'fa-shop',
      gradient: 'from-amber-500 via-amber-800 to-slate-950',
      accent: 'bg-amber-400',
      pattern: 'opacity-20'
    },
    bot: {
      icon: 'fa-tower-broadcast',
      gradient: 'from-slate-700 via-slate-800 to-slate-950',
      accent: 'bg-indigo-400',
      pattern: 'opacity-10'
    }
  };

  const config = configs[type];

  return (
    <div className={`relative w-full h-32 md:h-44 rounded-xl overflow-hidden mb-6 border-4 border-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.5)] group`}>
      {/* Background with Pixel-like pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}></div>
      
      {/* Pixel Grid Pattern */}
      <div className={`absolute inset-0 ${config.pattern} bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]`}></div>
      
      {/* CRT Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] [background-size:100%_4px,3px_100%]"></div>

      {/* Animated Glow Accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${config.accent} opacity-50 group-hover:opacity-100 transition-opacity animate-pulse`}></div>
      
      {/* Decorative Large Icon (Pixelated look) */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
        <i className={`fa-solid ${config.icon} text-[14rem] md:text-[18rem]`}></i>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-10 z-10">
        <div className="flex items-center gap-4">
           {/* Mini Icon Box */}
           <div className={`w-12 h-12 md:w-16 md:h-16 bg-black/40 border-2 border-white/20 flex items-center justify-center shadow-lg group-hover:border-white/40 transition-colors`}>
              <i className={`fa-solid ${config.icon} text-xl md:text-3xl text-white`}></i>
           </div>
           
           <div className="flex flex-col">
              <h2 className="text-2xl md:text-4xl font-black medieval-font tracking-widest text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase mt-1">
                  {subtitle}
                </p>
              )}
           </div>
        </div>
      </div>

      {/* Inner Corner Accents */}
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-white/20"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-white/20"></div>
    </div>
  );
};

export default PixelBanner;
