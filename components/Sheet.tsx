import React, { useEffect, useRef, useState } from 'react';
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
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, dy: 0, active: false });
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // 每次重新打開都要歸零，否則會停在上次拖到一半的位置
  useEffect(() => { if (open) { setDragY(0); setDragging(false); } }, [open]);

  /**
   * 下滑關閉（單段，沒有展開檔位）。內容捲到最上面時才接手勢。
   * touchmove 要 preventDefault，所以用 passive: false 自己掛原生監聽。
   */
  useEffect(() => {
    if (!open || variant !== 'sheet') return;
    const el = sheetRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      const scroller = scrollRef.current;
      if (scroller && scroller.scrollTop > 0) { dragRef.current.active = false; return; }
      // 在輸入框上起手就不要攔，讓鍵盤與選字正常運作
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select')) { dragRef.current.active = false; return; }
      dragRef.current = { startY: e.touches[0].clientY, dy: 0, active: true };
    };

    const onMove = (e: TouchEvent) => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      if (dy <= 0) return;
      e.preventDefault();
      dragRef.current.dy = dy;
      setDragging(true);
      setDragY(dy > 120 ? 120 + (dy - 120) * 0.35 : dy);
    };

    const onEnd = () => {
      if (!dragRef.current.active) return;
      const dy = dragRef.current.dy;
      dragRef.current.active = false;
      dragRef.current.dy = 0;
      setDragging(false);
      setDragY(0);
      if (dy > 90) onClose();
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [open, variant, onClose]);

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
        ref={sheetRef}
        className={`relative ${maxWidth} w-full bg-ios-card rounded-t-ios-xl sm:rounded-ios-xl shadow-ios-elevated overflow-hidden flex flex-col max-h-[88vh] ${dragging ? '' : 'animate-sheet-up sm:animate-fade-in-soft'}`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform 300ms ease-in-out',
        }}
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
        <div ref={scrollRef} className="overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
