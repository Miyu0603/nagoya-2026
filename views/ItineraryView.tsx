import React, { useEffect, useRef, useState } from 'react';
import { ITINERARY } from '../constants';
import { ItineraryEvent } from '../types';
import { BedIcon, MapIcon } from '../components/Icons';

interface ItineraryViewProps {
  onNavigateToDetail: (id: string) => void;
  selectedDateIdx: number;
  setSelectedDateIdx: (idx: number) => void;
}

const TimelineEvent: React.FC<{
  event: ItineraryEvent;
  isLast: boolean;
  onLocationClick: (id: string) => void;
}> = ({ event, isLast, onLocationClick }) => {
  return (
    <div className="flex items-start relative pb-5">
      {/* Time column */}
      <div className="w-[52px] shrink-0 pt-3.5 text-right pr-3.5">
        <span className="text-[12px] font-mono font-medium text-ios-label-3 leading-none tracking-wider">{event.time}</span>
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0">
        <div
          onClick={() => event.locationId && onLocationClick(event.locationId)}
          className={`relative bg-ios-card rounded-ios border border-ios-separator shadow-ios-card px-4 py-3.5 transition-transform ${event.locationId ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
          <p className="text-[15px] font-semibold text-ios-label leading-relaxed tracking-tight">{event.description}</p>
          {event.note && (
            <p className="text-[13px] text-ios-label-2 mt-1.5 leading-relaxed tracking-tight">{event.note}</p>
          )}
          {event.locationId && (
            <p className="text-[12px] text-mag-gold font-semibold mt-2.5 tracking-wide">查看詳情 ›</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Sticky Date Chip Strip ── */
const DateChipStrip: React.FC<{
  selectedIdx: number;
  onSelect: (idx: number) => void;
}> = ({ selectedIdx, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-idx="${selectedIdx}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedIdx]);

  return (
    <div
      className="sticky top-0 z-20 -mx-4 px-4 bg-ios-bg/95 backdrop-blur-ios border-b border-ios-separator"
    >
      <div ref={containerRef} className="flex gap-3 overflow-x-auto py-3.5 no-scrollbar">
        {ITINERARY.map((day, idx) => {
          const active = idx === selectedIdx;
          return (
            <button
              key={idx}
              data-idx={idx}
              onClick={() => onSelect(idx)}
              className={`shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-full transition-all active:scale-95 ${active ? 'bg-mag-gold text-white shadow-soft' : 'bg-ios-fill-3 text-ios-label'}`}
            >
              <span className={`text-[10px] font-medium leading-none tracking-wider ${active ? 'text-white/90' : 'text-ios-label-2'}`}>
                {day.weekday[2]}
              </span>
              <span className={`text-[19px] font-light font-mono leading-none mt-1.5 tracking-tight ${active ? 'text-white' : 'text-ios-label'}`}>
                {day.date.split('/')[1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onNavigateToDetail, selectedDateIdx, setSelectedDateIdx }) => {
  const currentDay = ITINERARY[selectedDateIdx];
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;
    const handleScroll = () => setShowScrollTop(mainEl.scrollTop > 300);
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animate-fade-in-soft">
      <DateChipStrip selectedIdx={selectedDateIdx} onSelect={setSelectedDateIdx} />

      <div>
        {/* Day Header */}
        <div className="mb-7 relative pt-6">
          <div className="pr-14">
            <h2 className="text-ios-title2 font-semibold text-[#1c1c1e]/90 leading-tight tracking-normal">
              {currentDay.title}
            </h2>
            {currentDay.accommodation && (
              <div className="flex items-center gap-2 mt-3">
                <BedIcon className="w-4 h-4 text-mag-gold" />
                {currentDay.accommodationMapUrl ? (
                  <a
                    href={currentDay.accommodationMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-medium text-ios-label-2 active:text-mag-gold tracking-tight"
                  >
                    {currentDay.accommodation}
                  </a>
                ) : (
                  <span className="text-[14px] font-medium text-ios-label-2 tracking-tight">
                    {currentDay.accommodation}
                  </span>
                )}
              </div>
            )}
          </div>
          {currentDay.mapUrl && (
            <a
              href={currentDay.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-0 top-6 w-11 h-11 flex items-center justify-center bg-mag-gold text-white rounded-ios shadow-float active:scale-90 transition-transform"
              aria-label="開啟地圖"
            >
              <MapIcon className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {currentDay.events.map((event, idx) => (
            <TimelineEvent
              key={idx}
              event={event}
              isLast={idx === currentDay.events.length - 1}
              onLocationClick={onNavigateToDetail}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const mainEl = document.querySelector('main');
          if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="回到頂部"
        className={`fixed right-5 z-40 w-11 h-11 flex items-center justify-center bg-mag-gold text-white rounded-full shadow-float transition-all duration-300 active:scale-90 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 96px)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
};
