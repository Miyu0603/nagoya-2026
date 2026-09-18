import React from 'react';
import { Tab } from '../types';

interface TabBarProps {
  activeTab: Tab;
  onChange: (t: Tab) => void;
}

const TAB_META: Record<Tab, { label: string; Icon: React.FC<{ active: boolean }> }> = {
  [Tab.ITINERARY]: {
    label: '行程',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18" />
        <path d="M8 3v4M16 3v4" />
        {active && <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />}
      </svg>
    ),
  },
  [Tab.PREP]: {
    label: '準備',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="17" rx="3" />
        <path d="M8.5 12.5l2.5 2.5 4.5-4.5" />
      </svg>
    ),
  },
  [Tab.COST]: {
    label: '記帳',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" stroke="none" fill="currentColor" >¥</text>
      </svg>
    ),
  },
  [Tab.PACKING]: {
    label: '行李',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="14" rx="3" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 13h16" />
      </svg>
    ),
  },
  [Tab.SHOPPING]: {
    label: '購物',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  [Tab.INFO]: {
    label: '資訊',
    Icon: ({ active }) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8v.01" />
      </svg>
    ),
  },
};

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChange }) => {
  return (
    <nav
      className="shrink-0 bg-white border-t border-rule-300 px-1.5 pt-[7px]"
      /* iPhone 的 safe-area-inset-bottom 是 34px，整個加上去下方會空 47px。
         只留剛好避開 home indicator 的高度，沒有 indicator 的裝置退回 10px。 */
      style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom) - 10px), 10px)' }}
    >
      <div className="flex">
        {Object.values(Tab).map((tab) => {
          const meta = TAB_META[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`flex-1 flex flex-col items-center gap-[5px] py-1.5 min-h-[52px] active:opacity-60 ${active ? 'text-wood-900' : 'text-ink-400'}`}
              aria-label={meta.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`w-[38px] h-[26px] rounded-tk-sm flex items-center justify-center transition-colors duration-[240ms] ease-in-out ${active ? 'bg-washi-tint' : 'bg-transparent'}`}
              >
                <meta.Icon active={active} />
              </span>
              <span className="text-[10.5px] font-medium tracking-[0.04em] leading-none">
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
