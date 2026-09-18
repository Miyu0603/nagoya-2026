import React from 'react';
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from './Icons';

interface HeaderProps {
  weather: { temp: number; code: number; label: string } | null;
}

const getWeatherIcon = (code: number) => {
  const cls = 'w-6 h-6 text-wood-600';
  if (code === 0) return <SunIcon className={cls} />;
  if (code >= 1 && code <= 3) return <CloudIcon className={cls} />;
  if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55)) return <CloudIcon className={cls} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={cls} />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={cls} />;
  return <SunIcon className={cls} />;
};

export const Header: React.FC<HeaderProps> = ({ weather }) => {
  return (
    <header
      className="flex-none bg-white border-b border-rule-300"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 19px)' }}
    >
      <div className="flex items-end justify-between gap-3.5 px-5 pb-[15px]">
        <div className="min-w-0">
          <span className="inline-block font-num text-[10px] font-medium tracking-[0.24em] text-washi-white bg-vermillion rounded-tk-xs px-[9px] py-1 mb-[9px]">
            2026
          </span>
          <h1 className="font-noto text-[18px] font-bold leading-[1.4] tracking-[0.03em] text-ink">
            秋の名古屋 · 東京 · 橫濱
          </h1>
        </div>
        {weather && (
          <div className="flex-none flex items-center gap-[9px] bg-washi-white border border-rule-200 rounded-tk pl-[9px] pr-3 py-1.5">
            {getWeatherIcon(weather.code)}
            <div className="flex flex-col items-start leading-none">
              <div className="font-num text-[16px] font-medium tracking-[-0.01em] text-ink">{weather.temp}°</div>
              <div className="text-[9px] text-ink-400 tracking-[0.14em] mt-1">{weather.label}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
