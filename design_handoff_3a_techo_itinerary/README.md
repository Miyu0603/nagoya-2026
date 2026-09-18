# Handoff: 行程頁 — 手帳・格柵版（3a / Earth & Washi）

## Overview
Redesign of the itinerary tab (`views/ItineraryView.tsx`) for the **秋の名古屋と最高イルマ 2026** trip PWA.
It replaces the current iOS-system look (gold `#B08542` on `#F2F2F7`, 14px-radius cards) with a Japanese
stationery-notebook ("手帳") aesthetic: warm washi paper neutrals, an earth-brown/vermillion accent pair,
a dashed *koushi* (格柵) timeline rail, small radii, and a bottom-sheet detail popup that replaces the
current full-screen `DetailView` push for timeline events.

Tab bar, header and the 6-tab information architecture are unchanged in structure — only restyled.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the intended
look and behavior. They are **not production code to copy directly**.

The task is to **recreate this design inside the existing app**: React 19 + Vite + Tailwind (CDN config in
`index.html`) + TypeScript, following its established patterns — Tailwind utility classes driven by the
`tailwind.config` token block in `index.html`, function components in `views/` and `components/`,
inline SVG icon components in `components/Icons.tsx`, and `localStorage`-backed state in `App.tsx`.
Do not introduce a CSS-in-JS layer just because the prototype uses inline styles; the inline styles exist
only because the prototype is a single streamed HTML file.

## Fidelity
**High-fidelity (hifi).** Colors, type sizes, weights, letter-spacing, radii, paddings and transition
timings below are final and were measured from the prototype. Recreate pixel-perfectly, expressed through
new Tailwind tokens (see *Design Tokens* → *Suggested tailwind.config additions*).

Viewport the design was authored at: **390 × 844** (iPhone 14/15 logical size), `viewport-fit=cover`,
existing `--app-height` JS height fix retained.

---

## Screens / Views

### 1. Itinerary (行程) — main screen
**Purpose**: browse one day of the trip at a time; scan the time-ordered event rail; open any event for
its full memo, opening hours, address and map link.

**Layout** — vertical flex, full app height, three fixed bands:

| Band | Height | Background | Notes |
|---|---|---|---|
| Header | auto (~86px) | `#FFFFFF` | `padding: 19px 20px 15px`; `border-bottom: 1px solid #E4DBCB`; `padding-top` must add `env(safe-area-inset-top)` in the app |
| `<main>` | `flex: 1; min-height: 0` | `#F9F8F4` | scrolls, `overscroll-contain`, scrollbar hidden |
| Tab bar | auto (~66px) | `#FFFFFF` | `padding: 7px 6px 13px` + `env(safe-area-inset-bottom)`; `border-top: 1px solid #E4DBCB` |

#### 1.1 Header
- **Left column**
  - Year badge: text `2026`, 10px / weight 500 / `letter-spacing: 0.24em`, color `#F9F8F4`,
    background `#A84836`, `border-radius: 3px`, `padding: 4px 9px`, font **DM Sans**. `margin-bottom: 9px`.
  - Title: `秋の名古屋 · 東京 · 橫濱` — 18px / weight 700 / `line-height: 1.4` / `letter-spacing: 0.03em`,
    color `#2B2B2B`, font **Noto Serif JP**.
- **Right: weather capsule** (data source unchanged — Open-Meteo call in `App.tsx`)
  - Container: `background: #F9F8F4`, `border: 1px solid #EFE9DC`, `border-radius: 6px`,
    `padding: 6px 12px 6px 9px`, flex row, `gap: 9px`.
  - Icon: 24×24 sun/cloud/rain/snow — reuse `SunIcon` / `CloudIcon` / `RainIcon` / `SnowIcon` from
    `components/Icons.tsx` and the existing `getWeatherIcon(code)` mapping in `components/Header.tsx`,
    but recolor the stroke to `#8C6239` (`stroke-width: 1.8`).
  - Temp: 16px / weight 500 / `letter-spacing: -0.01em`, **DM Sans**, color `#2B2B2B`.
  - City label: 9px / weight 400 / `letter-spacing: 0.14em`, color `#6E675E`, `margin-top: 4px`.

#### 1.2 Day selector (sticky)
- Wrapper: `position: sticky; top: 0; z-index: 5`, `background: rgba(249,248,244,0.97)`,
  `backdrop-filter: blur(12px)`, `padding: 13px 18px 12px`. **No bottom border.**
- Row: `display: flex; gap: 5px` — all **7 days fit on one line, no horizontal scroll**.
  Each chip is `flex: 1; min-width: 0`.
- Chip: `height: 56px`, `border-radius: 6px`, `border: 1px solid`, column-centered, `gap: 5px`,
  `transition: background 240ms ease-in-out, color 240ms ease-in-out`.
  - Inactive: bg `#FFFFFF`, border `#E4DBCB`, text `#5A5249`, shadow `0 1px 3px rgba(43,43,43,0.05)`.
  - Active: bg `#5C4033`, border `#5C4033`, text `#FFFFFF`, shadow `0 3px 10px rgba(92,64,51,0.26)`.
  - Weekday char (`day.weekday[2]`, e.g. `三`): 10px / weight 500 / `letter-spacing: 0.06em`.
  - Day number (`day.date.split('/')[1]`): 19px / weight 500 / `line-height: 1`, **DM Sans**.

#### 1.3 Day heading block (no card — sits directly on the washi background)
- Wrapper padding: `10px 18px 14px`.
- Meta row (`display: flex; align-items: center; gap: 9px; margin-bottom: 11px`):
  - `DAY {n}` — 10px / weight 500 / `letter-spacing: 0.14em`, `#A84836`, **DM Sans**.
  - 1×11px divider `#E0D8C8`.
  - `9/23　星期三` (ideographic space between) — 10px / `letter-spacing: 0.1em`, `#6E675E`, **DM Sans**.
  - Spacer (`flex: 1`).
  - **Accommodation, right-aligned** (`max-width: 186px`): 15×15 `BedIcon` from `components/Icons.tsx`,
    stroke `#8C6239` / `stroke-width: 1.6`, then the hotel name at 11px / `line-height: 1.35` /
    `letter-spacing: 0.02em`, `#4A443C`. Keep the existing `accommodationMapUrl` anchor behavior.
    When `accommodation` is absent (9/29) render the fallback string `當日返台・無住宿`.
- Day title (`day.title`): 20px / weight 700 / `line-height: 1.5` / `letter-spacing: 0.02em`,
  **Noto Serif JP**, color `#2B2B2B`.
- The old floating gold map button (`day.mapUrl`, 44×44, `shadow-float`) is **not** in this design.
  Either drop it or fold `mapUrl` into an overflow action — confirm with the designer before removing data.

#### 1.4 Timeline rows
Wrapper padding `0 18px 30px`. One row per `ItineraryEvent`, `display: flex; gap: 12px`.

- **Koushi rail** (left, `width: 44px`, column, centered) — children in this order:
  1. Time label: 12px / weight 500 / `letter-spacing: 0.01em`, **DM Sans**, `padding-top: 15px`.
     Color `#A84836` when `isHighlight`, else `#4A443C`. (It must sit at the **top** of the row,
     level with the card title.)
  2. 9px dashed stub: `border-left: 1px dashed #D3C7B2`.
  3. Node: 11×11, `border-radius: 3px`, `transform: rotate(45deg)` (diamond),
     `border: 1.5px solid`, `box-sizing: border-box`.
     Highlight: bg + border `#A84836`. Normal: bg `#FFFFFF`, border `#C9BEA9`.
  4. `flex: 1` dashed filler `border-left: 1px dashed #D3C7B2` — this is what connects rows.
- **Card** (right, `flex: 1; min-width: 0`, wrapper `padding: 8px 0 14px`) — a `<button>`, full width,
  left-aligned text, `cursor: pointer`:
  - `background: #FFFFFF`, `border: 1px solid #EFE9DC`, `border-radius: 7px`,
    `box-shadow: 0 2px 8px rgba(43,43,43,0.05)`, `padding: 14px 15px`,
    `transition: box-shadow 240ms ease-in-out`; hover `box-shadow: 0 4px 14px rgba(43,43,43,0.1)`.
  - Title (`event.description`): 14.5px / weight 500 / `line-height: 1.68` / `letter-spacing: 0.01em`,
    `#2B2B2B`.
  - Note preview (`event.note`, only if present): 12px / `line-height: 1.78` / `letter-spacing: 0.01em`,
    `#5A5249`, **clamped to 1 line** (`-webkit-line-clamp: 1`), `margin-top: 7px`.
  - Tapping opens the detail sheet (1.5). There is no inline "查看詳情 ›" link any more.

#### 1.5 Event detail sheet (popup) — replaces the timeline event's push-to-DetailView
- Backdrop: `position: absolute; inset: 0; z-index: 40`, `background: rgba(43,43,43,0.34)`,
  `display: flex; align-items: flex-end; justify-content: center`,
  `opacity` 0 → 1 with `transition: opacity 260ms ease-in-out`. Click on backdrop closes.
- Sheet: `width: 100%`, `max-height: 92%`, `overflow-y: auto` (scrollbar hidden),
  `background: #F9F8F4`, `border-radius: 8px 8px 26px 26px` (bottom radius matches the device frame),
  `box-shadow: 0 -6px 28px rgba(43,43,43,0.18)`,
  enters with `transform: translateY(16px) → translateY(0)`, `300ms ease-in-out`.
  **The sheet must call `stopPropagation()` on its own click** so taps inside don't dismiss it.
- **Ticket head** — `background: #FFFFFF`, `border-bottom: 1px dashed #DCD3C3`, `padding: 16px 20px 14px`:
  - Row 1 (`space-between`, `margin-bottom: 12px`):
    `DAY 1 ・ 9/23（三）` 9px / weight 500 / `letter-spacing: 0.22em` `#6E5A46` **DM Sans**;
    sequence `04 / 13` (1-based index / day event count, zero-padded) 9px / `letter-spacing: 0.14em`
    `#6E675E` **DM Sans**.
  - Row 2 (`display: flex; align-items: flex-start; gap: 13px`):
    - Left stack (`min-width: 56px`, centered, `gap: 5px`): time 20px / weight 500 /
      `letter-spacing: -0.01em` / `line-height: 1`, `#A84836`, **DM Sans**; category chip 9px /
      weight 500 / `letter-spacing: 0.12em`, `#5C4033`, `border: 1px solid #E0D8C8`,
      `border-radius: 3px`, `padding: 2px 6px`.
    - 1px full-height divider `#EFE9DC`.
    - Title (`event.description`): 17px / weight 700 / `line-height: 1.56` / `letter-spacing: 0.02em`,
      **Noto Serif JP**.
- **Body** — `padding: 16px 20px 22px`, `display: flex; flex-direction: column; gap: 14px`.
  Every block is conditional; a section with no data is omitted entirely.
  - `メモ ・ 備註` (from `event.note`): section label 9px / weight 500 / `letter-spacing: 0.24em`
    `#8C6239`, `margin-bottom: 7px`. Card: `#FFFFFF`, `border: 1px solid #EFE9DC`,
    `border-left: 3px solid #A84836`, `border-radius: 4px`, `padding: 12px 13px`;
    text 12.5px / `line-height: 1.85` `#3E3A33`.
  - `案内 ・ 說明` (from `LOCATION_DETAILS[locationId].description`): same label style;
    plain paragraph 12.5px / `line-height: 1.9` `#3E3A33`.
  - `時間` (from `openingHours` or the curated hours string): row with a 15×15 clock icon,
    stroke `#7A8B7B` / 1.7. Label 9px / `letter-spacing: 0.2em` `#6E675E`; value 12.5px /
    `line-height: 1.6` `#3E3A33`. Preceded by `border-top: 1px dashed #E0D8C8` + `padding-top: 13px`.
  - `住所` (from `address`): same row pattern with a 15×15 map-pin icon.
  - Actions (`display: flex; gap: 9px`), both `min-height: 46px`, `border-radius: 6px`, 13px /
    weight 500 / `letter-spacing: 0.06em`:
    - `開啟地圖` — only when `mapUrl` exists. `<a target="_blank" rel="noopener noreferrer">`,
      bg `#5C4033`, text `#F9F8F4`, with the 15×15 `MapIcon` from `components/Icons.tsx`.
    - `關閉` — bg `#FFFFFF`, `border: 1px solid #DCD3C3`, text `#4A443C`.

#### 1.6 Tab bar
Structure identical to `components/TabBar.tsx` (same 6 tabs, same order:
行程 / 準備 / 記帳 / 行李 / 購物 / 資訊 — note the enum order in `types.ts` is
ITINERARY, PREP, COST, PACKING, SHOPPING, INFO).
- Nav: `background: #FFFFFF`, `border-top: 1px solid #E4DBCB`, `padding: 7px 6px 13px` + safe area.
- Button: `flex: 1`, column, `gap: 5px`, `padding: 6px 0`.
- Icon holder: 38×26, `border-radius: 4px`, `transition: background 240ms ease-in-out`.
  Active `background: #F2ECE1`; inactive transparent.
- Icons: **reuse the existing `TAB_META` inline SVGs** (24-box, `stroke-width` 2.1 active / 1.7 inactive,
  round caps, 22px rendered). Do not draw new icons. `¥` replaces `$` in the 記帳 glyph.
- Label: 10.5px / weight 500 / `letter-spacing: 0.04em`.
- Colors: active `#5C4033`, inactive `#6E675E`.

---

## Interactions & Behavior
- **Day switch** — tap a chip → re-render the day heading + timeline; scroll `<main>` to top
  (the app already does this on tab switch in `App.tsx`; do the same here).
  The current `scrollIntoView` centering of the active chip is no longer needed (all 7 fit).
- **Open detail** — tap a timeline card → sheet animates up (`translateY(16px) → 0`, 300ms ease-in-out)
  while the backdrop fades in (260ms ease-in-out).
- **Close detail** — tap backdrop, tap `關閉`. Clicks inside the sheet must not close it.
  Also wire hardware/gesture back and `Escape` if the platform surfaces them.
- **Map link** — `開啟地圖` opens `LOCATION_DETAILS[id].mapUrl` in a new tab
  (`target="_blank" rel="noopener noreferrer"`), matching existing link behavior.
- **All transitions are ease-in-out** — no spring/bounce. 240ms for color/shadow, 260–300ms for the sheet.
- **Weather** — unchanged: single Open-Meteo fetch on mount, city picked from `WEATHER_SPOTS` by today's date.
- **Touch targets** — day chips 56px tall, sheet buttons 46px, tab buttons ≥52px. Keep ≥44px.
- **Responsive** — single-column phone layout only. Day chips are `flex: 1`, so 390–430px widths are fine.
  Do not fix the timeline card width.

## State Management
Local to the itinerary view (or lifted to `App.tsx` alongside the existing `selectedDateIdx`):

| State | Type | Initial | Trigger |
|---|---|---|---|
| `selectedDateIdx` | `number` | `0` | day chip tap — already exists in `App.tsx` |
| `openEventIdx` | `number \| null` | `null` | card tap sets index; backdrop/關閉 sets `null` |
| `activeTab` | `Tab` | `Tab.ITINERARY` | tab bar — already exists |
| `weather` | `{temp, code, label} \| null` | `null` | existing Open-Meteo effect |

`openEventIdx` is an index into `ITINERARY[selectedDateIdx].events`; reset it to `null` whenever
`selectedDateIdx` or `activeTab` changes. Nothing new needs persisting — no localStorage changes.

Data comes entirely from existing sources in `constants.ts`: `ITINERARY` (`DaySchedule[]`) and
`LOCATION_DETAILS` (`Record<string, LocationDetail>`). No schema change is required. The prototype's
`hours` strings are `LocationDetail.openingHours` where present, otherwise a short string distilled from
`description`/`note` — treat `openingHours` as the field to fill in going forward.

**Category chip** (`交通 / 美食 / 活動 / 景點 / 住宿`) is derived in the prototype by keyword-matching
`event.description`. That is a prototype shortcut. **Recommended**: add an optional
`category?: 'transit' | 'food' | 'event' | 'spot' | 'stay'` to `ItineraryEvent` in `types.ts` and set it
explicitly in `constants.ts`, falling back to `'spot'`. The keyword regexes are in
`3a-techo-itinerary.html` (`categorize()`) if you want to bootstrap the data.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| 和紙白 washi-white | `#F9F8F4` | main scroll background, sheet background, on-brown text |
| 純白棉紙 surface | `#FFFFFF` | header, tab bar, cards, ticket head |
| 鳥之子色 washi-tint | `#F2ECE1` | active tab icon pill |
| 町家木棕 wood-900 | `#5C4033` | primary: active day chip, primary button, active tab |
| 淺木色 wood-600 | `#8C6239` | icon strokes, section labels, meta text on white |
| 朱砂紅 vermillion | `#A84836` | year badge, DAY label, highlight time + node, memo edge |
| 竹青綠 bamboo | `#7A8B7B` | metadata icons (time, address) |
| 墨黑 ink | `#2B2B2B` | titles, body |
| ink-700 | `#3E3A33` | sheet body text |
| ink-600 | `#4A443C` | secondary body, close button label |
| ink-500 | `#5A5249` | note preview, inactive chip text |
| ink-400 | `#6E675E` | small meta, inactive tab labels, sequence counter |
| wood-500 | `#6E5A46` | ticket-head day label |
| line-200 | `#EFE9DC` | card borders, dividers |
| line-300 | `#E4DBCB` | header/nav borders, inactive chip border |
| line-400 | `#E0D8C8` | dashed rules, small dividers |
| rail | `#D3C7B2` | dashed koushi rail |
| line-500 | `#DCD3C3` | sheet dashed edge, close button border |
| node-ring | `#C9BEA9` | inactive timeline node border |
| scrim | `rgba(43,43,43,0.34)` | sheet backdrop |

All body/meta tones were chosen to clear **4.5:1** against their actual backgrounds. Note the original
spec's `#8E8E93` secondary grey only reaches 2.9:1 on `#F9F8F4` and was replaced by `#5A5249`.
Do not lighten these.

### Typography
- **Noto Serif JP** 700 — app title, day title, sheet title. *(Already loaded in `index.html`.)*
- **Noto Sans TC** 400/500 — body, notes, labels. Add to the Google Fonts link.
- **DM Sans** 400/500 — all times, dates, numerals, latin meta. Add to the Google Fonts link.
- Existing `font-noto` Tailwind alias maps to Noto Serif JP; add `sans` → Noto Sans TC and a
  `num`/`mono` alias → DM Sans (it replaces the current `SF Mono` numerals).

Scale used: 9, 10, 10.5, 11, 12, 12.5, 14.5, 16, 17, 18, 19, 20px.

### Spacing
4 / 5 / 6 / 7 / 9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / 18 / 19 / 20 / 22 / 26 / 30px.

### Border radius
`3px` (badge, node, category chip) · `4px` (memo card, tab icon pill) · `6px` (day chip, weather capsule,
buttons) · `7px` (timeline card) · `8px` (sheet top) · `26px` (device frame / sheet bottom).
**The old `ios`/`ios-lg` 14–20px radii are gone — nothing in this design exceeds 8px except the frame.**

### Shadows
- card: `0 2px 8px rgba(43,43,43,0.05)` → hover `0 4px 14px rgba(43,43,43,0.1)`
- chip inactive: `0 1px 3px rgba(43,43,43,0.05)` · chip active: `0 3px 10px rgba(92,64,51,0.26)`
- sheet: `0 -6px 28px rgba(43,43,43,0.18)`

### Suggested `tailwind.config` additions (`index.html`)
```js
colors: {
  washi:      { white:'#F9F8F4', tint:'#F2ECE1' },
  wood:       { 900:'#5C4033', 600:'#8C6239', 500:'#6E5A46' },
  vermillion: '#A84836',
  bamboo:     '#7A8B7B',
  ink:        { DEFAULT:'#2B2B2B', 700:'#3E3A33', 600:'#4A443C', 500:'#5A5249', 400:'#6E675E' },
  rule:       { 200:'#EFE9DC', 300:'#E4DBCB', 400:'#E0D8C8', 500:'#DCD3C3', rail:'#D3C7B2', node:'#C9BEA9' },
},
borderRadius: { 'tk-xs':'3px', 'tk-sm':'4px', 'tk':'6px', 'tk-md':'7px', 'tk-lg':'8px' },
boxShadow: {
  'tk-card':'0 2px 8px rgba(43,43,43,0.05)',
  'tk-card-hover':'0 4px 14px rgba(43,43,43,0.1)',
  'tk-chip':'0 1px 3px rgba(43,43,43,0.05)',
  'tk-chip-on':'0 3px 10px rgba(92,64,51,0.26)',
  'tk-sheet':'0 -6px 28px rgba(43,43,43,0.18)',
},
```

## Assets
No bitmap assets. Every glyph is an inline SVG **already in the repo** —
`BedIcon`, `MapIcon`, `SunIcon`, `CloudIcon`, `RainIcon`, `SnowIcon` in `components/Icons.tsx`,
and the six tab icons in the `TAB_META` map in `components/TabBar.tsx`. The clock and map-pin icons in the
detail sheet are 24-box strokes in the same family; their paths are in `3a-techo-itinerary.html` — add them
to `components/Icons.tsx` as `ClockIcon` and `PinIcon` rather than inlining.
Fonts are Google Fonts (Noto Serif JP, Noto Sans TC, DM Sans). `public/icon-512.png` and
`public/manifest.json` are unchanged.

## Files
In this bundle:
- `3a-techo-itinerary.html` — **standalone runnable reference.** Open in a browser; all 7 days,
  day switching, and the detail sheet work. Inline styles only, no build step.
- `日系風格三案.dc.html` — the full exploration file this design came from; option `3a` is the first
  phone in the top section. Later sections hold the earlier directions (2a 喫茶昭和復古,
  2b 駅サイン, 2c 白川町家和紙簡約, 1a–1c) for context only.

Files in the app this design touches:
- `views/ItineraryView.tsx` — day chip strip, day heading, timeline rows (full restyle + new sheet)
- `components/Header.tsx` — year badge, title, weather capsule
- `components/TabBar.tsx` — colors, radii, icon pill, label sizes (structure unchanged)
- `components/Icons.tsx` — recolor usage; add `ClockIcon`, `PinIcon`
- `index.html` — `tailwind.config` tokens + Google Fonts link
- `constants.ts` — optional: fill `openingHours`, add `category` to events
- `types.ts` — optional: `ItineraryEvent.category`
- `App.tsx` — optional: lift `openEventIdx`; note the timeline no longer routes to `DetailView`
  for events that only need the sheet (`DetailView` is still used by nothing else — confirm before deleting)
