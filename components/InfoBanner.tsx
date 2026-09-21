import React from 'react';

interface InfoBannerProps {
  variant?: 'info' | 'warning' | 'danger';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const VARIANT_STYLES = {
  info: { bg: 'bg-mag-gold-light', border: 'border-mag-gold/30', text: 'text-ios-label', accent: 'text-mag-gold' },
  warning: { bg: 'bg-[#FFF4E5]', border: 'border-ios-orange/30', text: 'text-ios-label', accent: 'text-ios-orange' },
  danger: { bg: 'bg-[#FFEEEC]', border: 'border-ios-red/30', text: 'text-ios-label', accent: 'text-ios-red' },
};

const DEFAULT_ICONS: Record<'info' | 'warning' | 'danger', React.ReactNode> = {
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M12 11v5" /></svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
  ),
  danger: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
  ),
};

export const InfoBanner: React.FC<InfoBannerProps> = ({ variant = 'info', icon, children }) => {
  const s = VARIANT_STYLES[variant];
  return (
    <div className={`${s.bg} ${s.border} border rounded-ios px-3.5 py-3 flex items-start gap-2.5`}>
      <span className={`${s.accent} shrink-0 mt-0.5`}>{icon ?? DEFAULT_ICONS[variant]}</span>
      <div className={`${s.text} text-[13px] font-medium leading-snug flex-1`}>{children}</div>
    </div>
  );
};
