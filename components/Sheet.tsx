import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Variant 'sheet' = bottom sheet (default); 'alert' = centered iOS-style alert */
  variant?: 'sheet' | 'alert';
  /** Max width on tablet/desktop */
  maxWidth?: string;
}

/**
 * iOS-style modal container. Defaults to bottom-sheet with grab handle.
 * Locks body scroll while open and dismisses on backdrop tap.
 * Renders via Portal to bypass any ancestor containing-block (transform/filter/etc).
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  title,
  children,
  variant = 'sheet',
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const node = variant === 'alert' ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in-soft">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white/95 backdrop-blur-ios ${maxWidth} w-full rounded-ios-lg shadow-ios-elevated overflow-hidden`}>
        {children}
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in-soft">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`relative ${maxWidth} w-full bg-ios-card rounded-t-ios-xl sm:rounded-ios-xl shadow-ios-elevated overflow-hidden flex flex-col max-h-[88vh] animate-sheet-up sm:animate-fade-in-soft`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Grab handle */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden">
          <div className="w-9 h-[5px] rounded-full bg-ios-label-3" />
        </div>
        {title && (
          <div className="px-5 pt-2 pb-3">
            <h3 className="text-ios-headline font-semibold text-ios-label">{title}</h3>
          </div>
        )}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
