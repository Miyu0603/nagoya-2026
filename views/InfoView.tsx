
import React, { useState, useRef } from 'react';
import { USEFUL_LINKS, EMERGENCY_CONTACTS, JAPANESE_PHRASES } from '../constants';

const SpeakerIcon: React.FC<{ playing: boolean; className?: string }> = ({ playing, className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={playing ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    {playing && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
  </svg>
);

export const InfoView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (audioPath: string, id: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (isPlaying === id) { setIsPlaying(null); return; }
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    setIsPlaying(id);
    audio.play().catch(err => { console.error(err); setIsPlaying(null); });
    audio.onended = () => { setIsPlaying(null); audioRef.current = null; };
  };

  const getLinkEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('japan web')) return '🛂';
    if (t.includes('城')) return '🏯';
    if (t.includes('lights')) return '💡';
    if (t.includes('プラネタリア')) return '🌌';
    if (t.includes('skyliner') || t.includes('特急') || t.includes('新幹線')) return '🚄';
    if (t.includes('機場') || t.includes('空港')) return '✈️';
    if (t.includes('時刻表') || t.includes('乗換') || t.includes('轉乘')) return '🚉';
    if (t.includes('天氣') || t.includes('預報')) return '🌤️';
    if (t.includes('地圖')) return '🗺️';
    return '🔗';
  };


  return (
    <div className="pb-4 pt-4 animate-fade-in-soft space-y-10">

      {/* Emergency Contacts */}
      <section>
        <h2 className="text-ios-title2 font-bold text-ios-label tracking-tight mb-3">緊急聯絡</h2>
        <div className="bg-ios-card border border-ios-separator rounded-ios-lg overflow-hidden shadow-ios-card">
          <div className="grid grid-cols-2 divide-x divide-ios-separator border-b border-ios-separator">
            {EMERGENCY_CONTACTS.slice(0, 2).map((c, idx) => (
              <a key={idx} href={`tel:${c.number}`} className="p-4 text-center active:bg-ios-fill-3">
                <div className="text-[13px] font-medium text-ios-label-2">{c.title}</div>
                <div className="text-[26px] font-mono font-bold text-ios-red mt-1">{c.number}</div>
              </a>
            ))}
          </div>
          {EMERGENCY_CONTACTS.slice(2).map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.number}`}
              className="block px-5 py-4 active:bg-ios-fill-3 border-b border-ios-separator last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-ios-label">{c.title}</div>
                  {c.note && <div className="text-[11px] text-ios-label-2 mt-0.5">{c.note}</div>}
                </div>
                <div className="text-[17px] font-mono font-bold text-ios-red shrink-0">{c.number}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Useful Links */}
      <section>
        <h2 className="text-ios-title2 font-bold text-ios-label tracking-tight mb-3">實用連結</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {USEFUL_LINKS.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-ios-card p-4 rounded-ios-lg border border-ios-separator shadow-ios-card active:bg-ios-fill-3 text-center transition-colors">
              <div className="text-3xl mb-2">{getLinkEmoji(link.title)}</div>
              <h4 className="text-[13px] font-semibold text-ios-label leading-tight">
                {link.title.split('(')[0].trim()}
              </h4>
              {link.title.includes('(') && (
                <span className="text-[11px] text-ios-label-2 mt-1">
                  {link.title.match(/\(([^)]+)\)/)?.[1]}
                </span>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Japanese phrases */}
      <section>
        <h2 className="text-ios-title2 font-bold text-ios-label tracking-tight mb-3">實用日文</h2>
        <div className="space-y-5">
          {JAPANESE_PHRASES.map((section, sIdx) => (
            <div key={sIdx} className="bg-ios-card border border-ios-separator rounded-ios-lg overflow-hidden shadow-ios-card">
              <div className="bg-mag-gold-light text-mag-gold px-5 py-2.5 text-[13px] font-semibold flex justify-between items-center">
                <span>{section.category}</span>
              </div>

              <div className="px-5 py-4">
                <div className={section.sentences && section.sentences.length > 0 ? 'mb-5' : ''}>
                  <h4 className="text-[11px] font-semibold text-mag-gold uppercase tracking-wider mb-2.5">關鍵單字</h4>
                  <div className="divide-y divide-ios-separator">
                    {section.vocab.map((v: any, vIdx: number) => (
                      <div key={vIdx} className="flex items-center justify-between py-2.5 group">
                        <div className="flex items-baseline gap-3 flex-1 min-w-0">
                          <span className="text-[15px] font-semibold text-ios-label truncate">{v.jp}</span>
                          <span className="text-[12px] text-ios-label-2">{v.cn}</span>
                        </div>
                        {v.audio && (
                          <button
                            onClick={() => playAudio(v.audio!, `vocab-${sIdx}-${vIdx}`)}
                            aria-label="播放發音"
                            className={`min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center active:opacity-60 ${isPlaying === `vocab-${sIdx}-${vIdx}` ? 'text-mag-gold' : 'text-ios-label-3'}`}
                          >
                            <SpeakerIcon playing={isPlaying === `vocab-${sIdx}-${vIdx}`} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {section.sentences && section.sentences.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-mag-gold uppercase tracking-wider mb-2.5 pt-2 border-t border-ios-separator">實用句子</h4>
                    <div className="space-y-4">
                      {section.sentences.map((sent, pIdx) => (
                        <div key={pIdx} className="flex gap-3">
                          <div className="mt-2 w-1.5 h-1.5 bg-mag-gold rounded-full shrink-0" />
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex justify-between items-start gap-2">
                              <div className="text-[15px] font-semibold text-ios-label leading-snug">{sent.jp}</div>
                              {sent.audio && (
                                <button
                                  onClick={() => playAudio(sent.audio!, `sent-${sIdx}-${pIdx}`)}
                                  aria-label="播放句子"
                                  className={`min-w-[36px] min-h-[36px] -mr-1 flex items-center justify-center shrink-0 active:opacity-60 ${isPlaying === `sent-${sIdx}-${pIdx}` ? 'text-mag-gold' : 'text-ios-label-3'}`}
                                >
                                  <SpeakerIcon playing={isPlaying === `sent-${sIdx}-${pIdx}`} />
                                </button>
                              )}
                            </div>
                            <div className="text-[12px] text-ios-label-2 leading-snug">{sent.cn}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
