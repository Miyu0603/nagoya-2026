import React, { useEffect, useState } from 'react';
import { LocationDetail } from '../types';
import { CopyIcon, BusIcon, WalkIcon, XIcon } from '../components/Icons';

interface DetailViewProps {
  location: LocationDetail;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ location, onBack }) => {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const handleCopy = (text?: string) => {
    if (text) { navigator.clipboard.writeText(text); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in-soft">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onBack} />
      <div
        className="relative z-10 w-full max-w-lg bg-ios-card rounded-t-ios-xl sm:rounded-ios-xl shadow-ios-elevated overflow-hidden max-h-[90vh] flex flex-col animate-sheet-up sm:animate-fade-in-soft"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Grab handle */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden">
          <div className="w-9 h-[5px] rounded-full bg-ios-label-3" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 shrink-0 border-b border-ios-separator">
          <div className="flex justify-between items-start gap-3">
            <h1 className="text-[20px] font-bold text-ios-label leading-tight tracking-tight pr-2">{location.title}</h1>
            <button
              onClick={onBack}
              aria-label="關閉"
              className="shrink-0 w-8 h-8 flex items-center justify-center text-ios-label-2 bg-ios-fill-3 rounded-full active:opacity-60"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 pt-5 pb-8 no-scrollbar">
          {/* Standard Description */}
          {!location.transitLegs && location.description && (
            <p className="text-ios-label leading-relaxed text-[15px] font-medium whitespace-pre-line mb-7">{location.description}</p>
          )}

          {/* Transit Overview */}
          {location.transitLegs && location.description && (
            <div className="mb-6 bg-mag-gold-light border border-mag-gold/20 p-4 rounded-ios">
              <div className="text-[11px] font-semibold text-mag-gold tracking-wide mb-2">交通概覽</div>
              <p className="text-ios-label font-medium text-[14px] leading-relaxed whitespace-pre-line">
                {location.description}
              </p>
            </div>
          )}

          {/* Reservation Voucher */}
          {location.reservation && (
            <div className="mb-7 overflow-hidden rounded-ios-lg border border-ios-separator shadow-ios-card">
              <div className="bg-ios-label text-white p-5 relative">
                <div className="flex justify-between items-start mb-5">
                  <div className="text-[10px] font-semibold uppercase text-mag-gold tracking-widest">Travel Document · 2026</div>
                  <div className="flex gap-[2px] opacity-40">
                    {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2].map((h, i) => (
                      <div key={i} className="bg-white" style={{ width: '2px', height: `${h * 3}px` }} />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-medium text-white/60 mb-0.5 tracking-wide">BOOKING REF</div>
                    <div className="text-[22px] font-mono font-bold tracking-tight leading-none">{location.reservation?.id}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(location.reservation?.id)}
                    aria-label="複製訂位代號"
                    className="min-w-[40px] min-h-[40px] bg-white/15 hover:bg-white/25 flex items-center justify-center rounded-ios-sm transition-colors"
                  >
                    <CopyIcon className="w-4 h-4 text-mag-gold" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 space-y-6">
                {location.reservation?.sections.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-3 bg-mag-gold rounded-full" />
                      <h3 className="text-[12px] font-semibold text-ios-label-2 tracking-wide">{s.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                      {s.items.map((it, idx) => (
                        <div key={idx} className={it.isFullWidth ? 'col-span-2' : 'col-span-1'}>
                          <div className="text-[10px] font-semibold text-ios-label-3 uppercase mb-1 tracking-wider">{it.label}</div>
                          <div className="text-[14px] font-noto font-bold text-ios-label leading-snug">{it.value}</div>
                        </div>
                      ))}
                    </div>
                    {location.reservation && i < location.reservation.sections.length - 1 && (
                      <div className="mt-5 border-b border-ios-separator" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aux Info */}
          {(location.carNaviPhone || location.mapCode || location.address) && (
            <div className="space-y-3 mb-7">
              {location.carNaviPhone && (
                <div className="bg-mag-gold-light p-4 border border-mag-gold/15 rounded-ios flex justify-between items-center">
                  <div>
                    <div className="text-[11px] font-semibold text-mag-gold tracking-wide mb-1">電話導航 · Car GPS</div>
                    <div className="text-[18px] font-mono font-bold text-ios-label leading-none">{location.carNaviPhone}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(location.carNaviPhone)}
                    aria-label="複製電話"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white text-mag-gold rounded-ios-sm shadow-soft active:scale-90 transition-transform"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              {location.mapCode && (
                <div className="bg-ios-fill-3 p-4 border border-ios-separator rounded-ios flex justify-between items-center">
                  <div>
                    <div className="text-[11px] font-semibold text-ios-label-2 tracking-wide mb-1">マップコード · Map Code</div>
                    <div className="text-[20px] font-mono font-bold text-ios-label leading-none tracking-wider">{location.mapCode}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(location.mapCode)}
                    aria-label="複製 Map Code"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white text-ios-label-2 rounded-ios-sm shadow-soft active:scale-90 transition-transform"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              {location.openingHours && (
                <div className="text-[12px] font-medium text-ios-label-2 px-1 leading-relaxed">
                  <span className="text-mag-gold mr-2 font-semibold">營業時間</span>{location.openingHours}
                </div>
              )}
              {location.address && (
                <div className="text-[12px] font-medium text-ios-label-2 px-1 leading-relaxed">
                  <span className="text-mag-gold mr-2 font-semibold">地址</span>{location.address}
                </div>
              )}
            </div>
          )}

          {/* Transit Details */}
          {location.transitLegs && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 bg-mag-gold rounded-full" />
                <h3 className="text-[15px] font-semibold text-ios-label">路線細節</h3>
              </div>

              <div className="space-y-7">
                {location.transitLegs.map((leg, idx) => (
                  <div key={idx} className="relative pl-12 last:pb-0">
                    {location.transitLegs && idx < location.transitLegs.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-[-28px] w-[3px] bg-ios-separator" />
                    )}

                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center z-10 shadow-soft ${leg.type === 'bus' ? 'border-ios-blue' : 'border-ios-separator-strong'}`}>
                      {leg.type === 'bus' && <BusIcon className="w-4 h-4 text-ios-blue" />}
                      {leg.type === 'walk' && <WalkIcon className="w-4 h-4 text-ios-label-2" />}
                      {leg.type === 'train' && <div className="text-[10px] font-black">JR</div>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[15px] font-semibold text-ios-label leading-tight">{leg.transport}</span>
                        <span className="text-[11px] font-mono font-semibold text-white bg-ios-label rounded-md px-2 py-1 shrink-0">
                          {leg.depTime} → {leg.arrTime}
                        </span>
                      </div>

                      <div className="bg-white border border-ios-separator p-3 rounded-ios shadow-soft flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-ios-label-3" />
                          <span className="text-[11px] font-semibold text-ios-label-2 w-10">From</span>
                          <span className="text-[14px] font-semibold text-ios-label">{leg.depStop}</span>
                        </div>
                        <div className="ml-0.5 w-[1px] h-2 border-l border-dashed border-ios-separator-strong" />
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-mag-gold" />
                          <span className="text-[11px] font-semibold text-ios-label-2 w-10">To</span>
                          <span className="text-[14px] font-semibold text-ios-label">{leg.arrStop}</span>
                        </div>
                      </div>

                      <div className="space-y-1 pl-1">
                        {leg.details.map((d, di) => (
                          <div key={di} className="text-[12px] text-ios-label-2 font-medium flex items-center gap-2">
                            <span className="w-1 h-1 bg-mag-gold/40 rounded-full" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-3">
            {location.mapUrl && (
              <a href={location.mapUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 bg-mag-gold text-white text-[15px] font-semibold rounded-ios shadow-soft active:opacity-80 transition-opacity">
                Google Maps
              </a>
            )}
            {location.websiteUrl && (
              <a href={location.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 bg-ios-fill-3 text-ios-label text-[15px] font-semibold rounded-ios active:opacity-60 transition-opacity">
                官方網站
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Copy toast */}
      {isCopied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-ios-label/95 text-white px-5 py-3 text-[13px] font-semibold rounded-full shadow-float">
          已複製
        </div>
      )}
    </div>
  );
};
