import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ITINERARY, LOCATION_DETAILS } from '../constants';
import { ItineraryEvent, EventCategory } from '../types';
import { BedIcon, MapIcon, ClockIcon, PinIcon, TicketIcon } from '../components/Icons';

interface ItineraryViewProps {
  /** 只有「訂位詳情」會用到——推到舊的全螢幕 DetailView 看訂位卡 */
  onNavigateToDetail: (id: string) => void;
  selectedDateIdx: number;
  setSelectedDateIdx: (idx: number) => void;
}

const CATEGORY_LABEL: Record<EventCategory, string> = {
  transit: '交通',
  food: '美食',
  event: '活動',
  spot: '景點',
  stay: '住宿',
};

/**
 * 沒有在 constants.ts 標 category 的事件，用關鍵字推一個。
 * 規則沿用設計原型的 categorize()，日後把 category 補進資料就會蓋過這裡。
 */
function inferCategory(description: string): EventCategory {
  const d = description;
  if (/入住|退房|飯店|抵達舞家|放行李|寄行李|取回行李|取行李|行李交櫃檯|宅配/.test(d)) return 'stay';
  if (/→|線|新幹線|特急|ラピート|Skyliner|起飛|下車|集合|解散|步行|走到|走路|前往|回市中心|出發|離開|回飯店|買 Suica/.test(d)) return 'transit';
  if (/早餐|午餐|晚餐|Coffee|蓬萊軒|うな富士|ひつまぶし|釜匠|BEEF|鯛焼|どら焼き|モンブラン|栗りん|ロッキンロビン|Cheese|うさぎや|超商/.test(d)) return 'food';
  if (/盆踊り|ART&LIGHTS|活動|プラネタリア|Sky Garden|夜景|AIR CABIN|整理券|排隊/.test(d)) return 'event';
  return 'spot';
}

const categoryOf = (event: ItineraryEvent): EventCategory =>
  event.category ?? inferCategory(event.description);

/* ── 日期格柵 ── 七天一列排滿，不橫向捲動 ── */
const DayStrip: React.FC<{ selectedIdx: number; onSelect: (idx: number) => void }> = ({
  selectedIdx,
  onSelect,
}) => (
  <div className="sticky top-0 z-[5] bg-washi-white/[0.97] backdrop-blur-tk px-[18px] pt-[13px] pb-3">
    <div className="flex gap-[5px]">
      {ITINERARY.map((day, idx) => {
        const active = idx === selectedIdx;
        return (
          <button
            key={day.date}
            onClick={() => onSelect(idx)}
            aria-current={active ? 'true' : undefined}
            className={`flex-1 min-w-0 h-14 rounded-tk border flex flex-col items-center justify-center gap-[5px] transition-colors duration-[240ms] ease-in-out ${
              active
                ? 'bg-wood-900 border-wood-900 text-white shadow-tk-chip-on'
                : 'bg-white border-rule-300 text-ink-500 shadow-tk-chip'
            }`}
          >
            <span className="text-[10px] font-medium tracking-[0.06em] leading-none">{day.weekday[2]}</span>
            <span className="font-num text-[19px] font-medium leading-none">{day.date.split('/')[1]}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ── 時間軸單列 ── */
const TimelineRow: React.FC<{ event: ItineraryEvent; onOpen: () => void }> = ({ event, onOpen }) => (
  <div className="flex gap-3">
    {/* 格柵導軌 */}
    <div className="flex-none w-11 flex flex-col items-center">
      <span
        className={`font-num text-[12px] font-medium tracking-[0.01em] pt-[15px] ${
          event.isHighlight ? 'text-vermillion' : 'text-ink-600'
        }`}
      >
        {event.time}
      </span>
      <span className="w-0 h-[9px] border-l border-dashed border-rule-rail" />
      <span
        className={`w-[11px] h-[11px] rounded-tk-xs border-[1.5px] box-border rotate-45 ${
          event.isHighlight ? 'bg-vermillion border-vermillion' : 'bg-white border-rule-node'
        }`}
      />
      <span className="flex-1 w-0 border-l border-dashed border-rule-rail" />
    </div>

    {/* 卡片 */}
    <div className="flex-1 min-w-0 pt-2 pb-3.5">
      <button
        onClick={onOpen}
        className="block w-full text-left bg-white border border-rule-200 rounded-tk-md shadow-tk-card px-[15px] py-3.5 transition-shadow duration-[240ms] ease-in-out hover:shadow-tk-card-hover"
      >
        <p className="text-[14.5px] font-medium leading-[1.68] tracking-[0.01em] text-ink">
          {event.description}
        </p>
        {event.note && (
          <p className="text-[12px] leading-[1.78] tracking-[0.01em] text-ink-500 mt-[7px] line-clamp-1">
            {event.note}
          </p>
        )}
      </button>
    </div>
  </div>
);

/* ── 轉乘時間軸：沿用主時間軸的虛線格柵語彙 ── */
const TransitStop: React.FC<{ time?: string; name: string; tone: 'start' | 'mid' | 'end' }> = ({
  time,
  name,
  tone,
}) => (
  <div className="flex items-center gap-2.5">
    <span
      className={`font-num text-[12px] w-[42px] text-right leading-none ${
        tone === 'mid' ? 'text-ink-400' : 'text-vermillion font-medium'
      }`}
    >
      {time ?? ''}
    </span>
    <span className="w-[9px] flex justify-center">
      <span
        className={`w-[9px] h-[9px] rounded-[2px] rotate-45 box-border ${
          tone === 'mid' ? 'bg-white border border-rule-node' : 'bg-vermillion'
        }`}
      />
    </span>
    <span className="text-[12.5px] leading-[1.6] text-ink-700">{name}</span>
  </div>
);

const TransitLink: React.FC<{ via: string }> = ({ via }) => (
  <div className="flex items-stretch gap-2.5">
    <span className="w-[42px]" />
    <span className="w-[9px] flex justify-center">
      <span className="w-0 h-6 border-l border-dashed border-rule-rail" />
    </span>
    <span className="self-center text-[11px] tracking-[0.02em] text-ink-500">{via}</span>
  </div>
);

/* ── 事件詳情：底部彈出的車票式彈窗 ──
 * 兩段高度：collapsed（內容高度，最多 88vh）／expanded（96vh）。
 * 上滑展開，下滑一次收回 collapsed，再下滑一次才關閉。
 * 透過 portal 掛在 body，否則會被 <main> 的堆疊脈絡壓在 TabBar 底下。
 */
const SHEET_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const SHEET_MS = 320;
const COLLAPSED_RATIO = 0.88;
const EXPANDED_RATIO = 0.96;
const DRAG_DOWN_THRESHOLD = 90;
const DRAG_UP_THRESHOLD = 60;

const EventSheet: React.FC<{
  dayIdx: number;
  eventIdx: number;
  onClose: () => void;
  onOpenReservation: (locationId: string) => void;
}> = ({ dayIdx, eventIdx, onClose, onOpenReservation }) => {
  const day = ITINERARY[dayIdx];
  const event = day.events[eventIdx];
  const location = event.locationId ? LOCATION_DETAILS[event.locationId] : undefined;

  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [viewportH, setViewportH] = useState(() => window.innerHeight);
  const [contentH, setContentH] = useState(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, dy: 0, active: false });
  const closeTimer = useRef<number | null>(null);

  const maxH = viewportH * EXPANDED_RATIO;
  const collapsedH = Math.min(contentH || viewportH * 0.5, viewportH * COLLAPSED_RATIO);
  // 只要還沒撐到最高就能往上拉。不要求「內容超出」——多數彈窗內容不到 88vh，
  // 那樣判斷會讓手勢幾乎永遠不能用。
  const canExpand = collapsedH < maxH - 8;
  const baseH = expanded ? maxH : collapsedH;
  const liveH = Math.max(140, Math.min(maxH, baseH - dragY));

  const requestClose = React.useCallback(() => {
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, SHEET_MS);
  }, [onClose]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  // 進場
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // 內容高度：字體載入或內容變動都要重量
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dayIdx, eventIdx]);

  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Esc 關閉，並鎖住下層捲動（body 與行程的 <main> 都要鎖，否則背景會跟著滑）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose(); };
    document.addEventListener('keydown', onKey);

    const main = document.querySelector('main');
    const prevBody = document.body.style.overflow;
    const prevMain = main ? main.style.overflowY : '';
    document.body.style.overflow = 'hidden';
    if (main) main.style.overflowY = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBody;
      if (main) main.style.overflowY = prevMain;
    };
  }, [requestClose]);

  /**
   * 拖曳。只有內容捲到最上面時才接手勢，否則交給正常捲動。
   * touchmove 要 preventDefault，必須自己掛 passive: false，不能走 React 的 onTouchMove。
   */
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (el.scrollTop > 0) { dragRef.current.active = false; return; }
      dragRef.current = { startY: e.touches[0].clientY, dy: 0, active: true };
    };

    const onMove = (e: TouchEvent) => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      // 已經展到最高、或沒東西可展，就不接往上拉
      if (dy < 0 && (expanded || !canExpand)) return;
      e.preventDefault();
      dragRef.current.dy = dy;
      setDragging(true);
      setDragY(dy);
    };

    // 位移記在 ref，不從 setState 的 updater 裡讀——那裡面不能有副作用
    const onEnd = () => {
      if (!dragRef.current.active) return;
      const dy = dragRef.current.dy;
      dragRef.current.active = false;
      dragRef.current.dy = 0;
      setDragging(false);
      setDragY(0);

      if (dy > DRAG_DOWN_THRESHOLD) {
        if (expanded) setExpanded(false);   // 整頁 → 收回原本高度
        else requestClose();                // 原本高度 → 關閉
      } else if (dy < -DRAG_UP_THRESHOLD && canExpand && !expanded) {
        setExpanded(true);                  // → 整頁
      }
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
  }, [expanded, canExpand, requestClose]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const metaRow = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-start gap-2.5">
      <span className="flex-none mt-px text-bamboo">{icon}</span>
      <div>
        <div className="text-[9px] tracking-[0.2em] text-ink-400 mb-[3px]">{label}</div>
        <div className="text-[12.5px] leading-[1.6] text-ink-700">{value}</div>
      </div>
    </div>
  );

  const hasActions = Boolean(location?.mapUrl) || Boolean(location?.reservation && event.locationId);
  const visible = entered && !closing;

  return createPortal(
    <div
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={event.description}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[rgba(43,43,43,0.34)]"
      style={{ opacity: visible ? 1 : 0, transition: `opacity 280ms ${SHEET_EASE}` }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full overflow-y-auto overscroll-contain bg-washi-white shadow-tk-sheet rounded-t-tk-lg"
        style={{
          height: liveH,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: dragging
            ? 'none'
            : `height ${SHEET_MS}ms ${SHEET_EASE}, transform ${SHEET_MS}ms ${SHEET_EASE}`,
        }}
      >
        <div ref={contentRef}>
        {/* 票根頭 */}
        <div className="bg-white border-b border-dashed border-rule-500 px-5 pt-2 pb-3.5">
          {/* 抓握條：上滑展開、下滑收合 */}
          <div className="flex justify-center pb-2.5">
            <span className="w-9 h-[5px] rounded-full bg-rule-500" />
          </div>
          <div className="flex items-center justify-between gap-2.5 mb-3">
            <span className="font-num text-[9px] font-medium tracking-[0.22em] text-wood-500">
              DAY {dayIdx + 1} ・ {day.date}（{day.weekday[2]}）
            </span>
            <span className="font-num text-[9px] tracking-[0.14em] text-ink-400">
              {pad(eventIdx + 1)} / {pad(day.events.length)}
            </span>
          </div>
          <div className="flex items-start gap-[13px]">
            <div className="flex-none flex flex-col items-center gap-[5px] min-w-[56px]">
              <span className="font-num text-[20px] font-medium tracking-[-0.01em] leading-none text-vermillion">
                {event.time}
              </span>
              <span className="text-[9px] font-medium tracking-[0.12em] text-wood-900 border border-rule-400 rounded-tk-xs px-1.5 py-0.5">
                {CATEGORY_LABEL[categoryOf(event)]}
              </span>
            </div>
            <span className="flex-none w-px self-stretch bg-rule-200" />
            <h3 className="flex-1 font-noto text-[17px] font-bold leading-[1.56] tracking-[0.02em] text-ink">
              {event.description}
            </h3>
          </div>
        </div>

        {/* 內容 */}
        <div
          className="px-5 pt-4 flex flex-col gap-3.5"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 22px)' }}
        >
          {event.note && (
            <div>
              <div className="text-[9px] font-medium tracking-[0.24em] text-wood-600 mb-[7px]">メモ ・ 備註</div>
              <div className="bg-white border border-rule-200 border-l-[3px] border-l-vermillion rounded-tk-sm px-[13px] py-3">
                <p className="text-[12.5px] leading-[1.85] tracking-[0.01em] text-ink-700">{event.note}</p>
              </div>
            </div>
          )}

          {event.legs && event.legs.length > 0 && (
            <div>
              <div className="text-[9px] font-medium tracking-[0.24em] text-wood-600 mb-[7px]">乗換 ・ 路線</div>
              <div className="bg-white border border-rule-200 rounded-tk-sm px-[13px] py-3">
                <TransitStop time={event.time} name={event.origin ?? ''} tone="start" />
                {event.legs.map((leg, i) => (
                  <React.Fragment key={i}>
                    <TransitLink via={leg.via} />
                    <TransitStop
                      time={leg.arrive}
                      name={leg.to}
                      tone={i === event.legs!.length - 1 ? 'end' : 'mid'}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {event.alternatives && event.alternatives.length > 0 && (
            <div>
              <div className="text-[9px] font-medium tracking-[0.24em] text-wood-600 mb-[7px]">他の便 ・ 其他班次</div>
              <div className="bg-white border border-rule-200 rounded-tk-sm divide-y divide-rule-200">
                {event.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-[13px] py-2.5 ${alt.isPlan ? 'bg-washi-tint' : ''}`}
                  >
                    <span
                      className={`flex-none w-9 text-[10px] tracking-[0.06em] ${
                        alt.isPlan ? 'text-vermillion font-medium' : 'text-ink-400'
                      }`}
                    >
                      {alt.when}
                    </span>
                    <span className="font-num text-[12px] leading-[1.6] text-ink-700">{alt.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {location?.description && (
            <div>
              <div className="text-[9px] font-medium tracking-[0.24em] text-wood-600 mb-[7px]">案内 ・ 說明</div>
              <p className="text-[12.5px] leading-[1.9] tracking-[0.01em] text-ink-700 whitespace-pre-line">
                {location.description}
              </p>
            </div>
          )}

          {location?.openingHours && (
            <div className="pt-[13px] border-t border-dashed border-rule-400">
              {metaRow(<ClockIcon className="w-[15px] h-[15px]" />, '時間', location.openingHours)}
            </div>
          )}

          {location?.address && metaRow(<PinIcon className="w-[15px] h-[15px]" />, '住所', location.address)}

          {hasActions && (
          <div className="flex gap-[9px] mt-0.5">
            {location?.mapUrl && (
              <a
                href={location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[46px] flex items-center justify-center gap-[7px] rounded-tk bg-wood-900 text-washi-white text-[13px] font-medium tracking-[0.06em] active:opacity-80"
              >
                <MapIcon className="w-[15px] h-[15px]" />
                開啟地圖
              </a>
            )}
            {location?.reservation && event.locationId && (
              <button
                onClick={() => onOpenReservation(event.locationId!)}
                className="flex-1 min-h-[46px] flex items-center justify-center gap-[7px] rounded-tk bg-white border border-rule-500 text-ink-600 text-[13px] font-medium tracking-[0.06em] active:bg-washi-tint"
              >
                <TicketIcon className="w-[15px] h-[15px]" />
                訂位詳情
              </button>
            )}
          </div>
          )}
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  onNavigateToDetail,
  selectedDateIdx,
  setSelectedDateIdx,
}) => {
  const currentDay = ITINERARY[selectedDateIdx];
  const [openEventIdx, setOpenEventIdx] = useState<number | null>(null);

  const selectDay = (idx: number) => {
    setSelectedDateIdx(idx);
    setOpenEventIdx(null);
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  };

  return (
    <>
      <DayStrip selectedIdx={selectedDateIdx} onSelect={selectDay} />

      <div className="px-[18px] pt-2.5 pb-3.5">
        <div className="flex items-center gap-[9px] mb-[11px]">
          <span className="flex-none font-num text-[10px] font-medium tracking-[0.14em] text-vermillion">
            DAY {selectedDateIdx + 1}
          </span>
          <span className="flex-none w-px h-[11px] bg-rule-400" />
          <span className="flex-none font-num text-[10px] tracking-[0.1em] text-ink-400">
            {currentDay.date}　{currentDay.weekday}
          </span>
          <span className="flex-1" />
          <span className="flex-none flex items-center gap-1.5 max-w-[186px]">
            <BedIcon className="flex-none w-[15px] h-[15px] text-wood-600" />
            {currentDay.accommodation && currentDay.accommodationMapUrl ? (
              <a
                href={currentDay.accommodationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] leading-[1.35] tracking-[0.02em] text-ink-600"
              >
                {currentDay.accommodation}
              </a>
            ) : (
              <span className="text-[11px] leading-[1.35] tracking-[0.02em] text-ink-600">
                {currentDay.accommodation ?? '當日返台・無住宿'}
              </span>
            )}
          </span>
        </div>
        <h2 className="font-noto text-[20px] font-bold leading-[1.5] tracking-[0.02em] text-ink">
          {currentDay.title}
        </h2>
      </div>

      <div className="px-[18px] pb-[30px]">
        {currentDay.events.map((event, idx) => (
          <TimelineRow key={idx} event={event} onOpen={() => setOpenEventIdx(idx)} />
        ))}
      </div>

      {openEventIdx !== null && (
        <EventSheet
          dayIdx={selectedDateIdx}
          eventIdx={openEventIdx}
          onClose={() => setOpenEventIdx(null)}
          onOpenReservation={(id) => {
            setOpenEventIdx(null);
            onNavigateToDetail(id);
          }}
        />
      )}
    </>
  );
};
