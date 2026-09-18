
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
  transitLegs?: TransitLeg[];
  reservation?: {
    id: string;
    sections: ReservationSection[];
  };
}

export interface ReservationSection {
  title: string;
  items: { label: string; value: string; isFullWidth?: boolean }[];
}

export interface TransitLeg {
  type: 'bus' | 'walk' | 'train' | 'wait';
  transport: string;
  depTime: string;
  depStop: string;
  arrTime: string;
  arrStop: string;
  details: string[];
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
  splitType: 'equal' | 'split65' | 'manual';
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
