
export interface LocationDetail {
  id: string;
  title: string;
  description: string;
  address?: string;
  openingHours?: string;
  mapUrl?: string;
  websiteUrl?: string;
  carNaviPhone?: string; // For Japanese Car GPS
  mapCode?: string;      // Japanese car navi map code (マップコード)
  imageUrl?: string;
  reservation?: {
    id: string;
    sections: ReservationSection[];
  };
}

export interface ReservationSection {
  title: string;
  items: { label: string; value: string; isFullWidth?: boolean }[];
}

/** 同一段路的替代班次：落地快慢不同就搭不同班 */
export interface TransitAlternative {
  /** 什麼狀況下選這班：很順／正常／偏慢／很慢 */
  when: string;
  /** 班次內容 */
  detail: string;
  /** 目前行程採用的那班 */
  isPlan?: boolean;
}

/** 轉乘的其中一段。卡片只顯示頭尾，這些中間段只在詳情彈窗展開。 */
export interface TransitLeg {
  /** 搭什麼：中央線快速、小田急、新幹線、步行 10 分… */
  via: string;
  /** 這一段到哪 */
  to: string;
  /** 抵達時間，原始行程沒寫就留空 */
  arrive?: string;
}

/** 詳情彈窗左上角的分類標籤 */
export type EventCategory = 'transit' | 'food' | 'event' | 'spot' | 'stay';

export interface ItineraryEvent {
  time: string;
  description: string;
  isHighlight?: boolean; // 朱砂紅：時間與菱形節點
  note?: string;
  locationId?: string; // Link to LocationDetail
  /** 省略時由 ItineraryView 依關鍵字推斷 */
  category?: EventCategory;
  /** 轉乘起點；有 legs 時必填 */
  origin?: string;
  /** 中間各段轉乘，只在詳情彈窗顯示 */
  legs?: TransitLeg[];
  /** 同一段的其他可選班次，只在詳情彈窗顯示 */
  alternatives?: TransitAlternative[];
}

export interface DaySchedule {
  date: string;
  weekday: string;
  title: string;
  accommodation?: string;
  accommodationMapUrl?: string; // New: Link for accommodation
  mapUrl?: string;
  events: ItineraryEvent[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
}

export interface Voucher {
  name: string;
  url: string;
  type?: 'hotel' | 'train' | 'tour' | 'ticket';
}

/** 天氣顯示的城市；untilDate 之前（含）套用這個座標 */
export interface WeatherSpot {
  untilDate: string; // YYYY-MM-DD
  label: string;
  latitude: number;
  longitude: number;
}

export interface UsefulLink {
  title: string;
  url: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  note?: string;
}

export interface ShoppingItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ExpenseRecord {
  rowIndex: number; // Important for Edit/Delete
  date: string;
  item: string;
  payer: '想想' | 'Yian';
  amountTwd: number;
  amountJpy: number;
  note: string;
  // Split fields — Xiang = 想想, Qian = Yian（沿用試算表既有欄位名）
  splitType: 'equal' | 'manual';
  splitXiangTwd: number;
  splitXiangJpy: number;
  splitQianTwd: number;
  splitQianJpy: number;
}

export enum Tab {
  ITINERARY = 'Itinerary',
  PREP = 'Prep',
  COST = 'Cost',
  PACKING = 'Packing',
  SHOPPING = 'Shopping',
  INFO = 'Info'
}
