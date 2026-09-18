import React from 'react';
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from './Icons';

interface HeaderProps {
  weather: { temp: number; code: number; label: string } | null;
}

const getWeatherIcon = (code: number) => {
  const cls = 'w-7 h-7';
  if (code === 0) return <SunIcon className={`${cls} text-ios-orange`} />;
  if (code >= 1 && code <= 3) return <CloudIcon className={`${cls} text-ios-label-2`} />;
  if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55)) return <CloudIcon className={`${cls} text-ios-label-3`} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={`${cls} text-ios-blue`} />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={`${cls} text-ios-blue`} />;
  return <SunIcon className={`${cls} text-ios-orange`} />;
};

export const Header: React.FC<HeaderProps> = ({ weather }) => {
  return (
    <header
      className="flex-none bg-white border-b border-ios-separator"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <span className="inline-block bg-mag-gold text-white text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded mb-1.5 font-mono">
            2026.09
          </span>
          <h1 className="text-ios-title3 font-bold text-ios-label leading-tight tracking-normal" style={{ fontFamily: "'Noto Serif JP', serif" }}>秋の名古屋と最高イルマ</h1>
        </div>
        {weather && (
          <div className="flex items-center gap-2 bg-ios-fill-3 pl-2.5 pr-3 py-1.5 rounded-full">
            {getWeatherIcon(weather.code)}
            <div className="flex flex-col items-start leading-none">
              <div className="text-[15px] font-semibold font-mono text-ios-label">{weather.temp}°</div>
              <div className="text-[9px] font-medium text-ios-label-2 mt-1 tracking-wider">{weather.label}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
