import { DaySchedule, ChecklistItem, LocationDetail, UsefulLink, EmergencyContact, Voucher, WeatherSpot } from './types';

// ============================================================
// 2026 名古屋・東京・橫濱（9/23–9/29）
// 沿用九州版 schema，僅替換資料內容。
// JAPANESE_PHRASES 已移除 audio 欄位（九州版音檔在 kyushu-2026 repo），
// 需要語音的話再自行補 audio 路徑。
// ============================================================

/* 記帳：Google Apps Script
 * 沒有預設值是刻意的 —— 九州那份 GAS 綁的是舊試算表，填錯會把這趟的帳寫進上一趟。
 * 新試算表重新部署 GAS 後，把 /exec 網址放進 .env 的 VITE_GOOGLE_SCRIPT_URL。
 * 沒設定時記帳頁會顯示「尚未設定」，不會靜默失敗。 */
export const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
// 試算表裡的分頁名稱（不是檔名）
export const GOOGLE_SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || '2026名古屋';
// repo 是公開的，試算表網址只從 .env 讀，不寫死在原始碼裡
export const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || '';

export const PRE_TRIP_NOTES = [
  "亞運 9/19–10/4 在愛知・名古屋舉行，名古屋段人潮與交通管制都會比平常誇張",
  "9 月下旬日本仍熱，但早晚溫差大，薄外套要帶",
  "護照務必每日隨身攜帶，宅配行李不收護照現金電子產品",
  "9/26 蓬萊軒要一早排隊，前一晚先把行李整理好"
];

export const TODO_LIST: ChecklistItem[] = [
  { id: 'todo_1', text: 'Visit Japan Web 辦好' },
  { id: 'todo_2', text: 'eSIM 開通' },
  { id: 'todo_4', text: '確認 プラネタリア場次（9/23 開放）' },
  { id: 'todo_10', text: '確認 9/24 午餐、25 晚餐、27 晚餐、28 早餐' },
];

export const PACKING_CARRY_ON: ChecklistItem[] = [
  { id: 'co_1', text: '充電用具（手機、手錶、行充）' },
  { id: 'co_2', text: '護照' },
  { id: 'co_3', text: '信用卡' },
  { id: 'co_4', text: '錢包（日幣）' },
  { id: 'co_5', text: '耳機' },
  { id: 'co_6', text: '行動電源' },
  { id: 'co_7', text: '保溫杯' },
  { id: 'co_8', text: '牙線棒' },
  { id: 'co_9', text: '護唇膏' },
  { id: 'co_10', text: '雨傘' },
  { id: 'co_11', text: '袖珍包面紙' },
  { id: 'co_12', text: '口罩' },
  { id: 'co_13', text: '眼藥水' },
  { id: 'co_14', text: '防曬用品（外套袖套）' },
  { id: 'co_15', text: '好走的鞋（清澄庭園飛石、野毛山上坡）' },
];

export const PACKING_CHECKED: ChecklistItem[] = [
  { id: 'ch_1', text: '浴巾、毛巾' },
  { id: 'ch_2', text: '錢包（台幣）' },
  { id: 'ch_3', text: '換洗衣物（衣褲鞋襪）' },
  { id: 'ch_4', text: '行李袋（備用，購物用）' },
  { id: 'ch_5', text: '保養品（卸妝、小藍瓶、凝露）' },
  { id: 'ch_6', text: '化妝品（DD、遮瑕、眼線、腮紅、口紅）' },
  { id: 'ch_7', text: '防曬噴霧' },
  { id: 'ch_8', text: '護髮' },
  { id: 'ch_9', text: '牙刷牙膏' },
  { id: 'ch_10', text: '折疊衣架' },
  { id: 'ch_11', text: '毛夾、髮夾、髮圈' },
  { id: 'ch_12', text: '梳子' },
  { id: 'ch_13', text: '睡衣' },
  { id: 'ch_14', text: '藥品（內外用、痠痛藥）' },
  { id: 'ch_15', text: '小洗衣板' },
  { id: 'ch_16', text: '離子夾' },
  { id: 'ch_17', text: '定型液' },
  { id: 'ch_18', text: '指甲剪' },
  { id: 'ch_19', text: '薄外套' },
];

export const USEFUL_LINKS: UsefulLink[] = [
  { title: 'Visit Japan Web（入境手續）', url: 'https://vjw-lp.digital.go.jp/zh-hant/' },
  { title: '橫濱逛街地圖（9/28）', url: 'https://claude.ai/artifact/TgSNYCbX4AscXqDAKeZiJd' },
  { title: '名古屋城 官網', url: 'https://www.nagoyajo.city.nagoya.jp/' },
  { title: 'AICHI NAGOYA ART&LIGHTS', url: 'https://www.pref.aichi.jp/' },
  { title: 'プラネタリア YOKOHAMA 場次', url: 'https://planetarium.konicaminolta.jp/' },
  { title: '近鐵特急 時刻表', url: 'https://www.kintetsu.co.jp/' },
  { title: '南海電鐵 關西機場', url: 'https://www.nankai.co.jp/' },
  { title: 'Skyliner 時刻表', url: 'https://www.keisei.co.jp/' },
];

/* 旅遊憑證：把訂房／票券的雲端連結貼進來就會出現在「準備」頁，空的話整區不顯示 */
export const VOUCHERS: Voucher[] = [
  { name: 'VIA INN 名古屋新幹線口', url: 'https://drive.google.com/file/d/1BDD0Y1Nu13TfJIU8htOdT4VI85CBYp6p/view', type: 'hotel' },
  { name: '阪急 OURS INN（大井町）', url: 'https://drive.google.com/file/d/1VStByV9HAJrSIwXmBm1Vrp9DPcDb16mv/view', type: 'hotel' },
  { name: 'KKday 高山・白川鄉一日遊', url: 'https://drive.google.com/file/d/1fLWnfRMprUrDgk0X4TBQOP0XDB6worOM/view', type: 'tour' },
  { name: '南海電鐵（Klook・未劃位）', url: 'https://drive.google.com/file/d/1ktRS_ocwUxZtHq_aqx3_UZfqJY0dSL4p/view', type: 'train' },
  { name: '新幹線 名古屋→品川　想想', url: 'https://drive.google.com/file/d/1GFAlIBmP0Nqi2zT_Mx6QOKk99Ul7aA0-/view', type: 'train' },
  { name: 'Skyliner 京成上野→成田', url: 'https://drive.google.com/file/d/1dGCOkT8mJSausVwnRgWdIfqGQyEKb0y_/view', type: 'train' },
  { name: 'Klook 行李宅配（飯店→成田）', url: 'https://drive.google.com/file/d/1xgLHf0ViZK7ZNo5ubUrxRmXanRVH1j76/view', type: 'ticket' },
];

/* 天氣：行程橫跨三個城市，依當天日期自動切換 */
export const WEATHER_SPOTS: WeatherSpot[] = [
  { untilDate: '2026-09-25', label: '名古屋', latitude: 35.1815, longitude: 136.9066 },
  { untilDate: '2026-09-27', label: '東京', latitude: 35.6785, longitude: 139.6823 },
  { untilDate: '2026-09-28', label: '橫濱', latitude: 35.4437, longitude: 139.6380 },
  { untilDate: '2026-12-31', label: '東京', latitude: 35.6785, longitude: 139.6823 },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { title: '警察', number: '110' },
  { title: '救護/火警', number: '119' },
  { title: '訪日外國人急難熱線 (JNTO)', number: '050-3816-2787', note: '24小時多語種對應' },
  { title: '臺北駐日經濟文化代表處', number: '+81-3-3280-7811' },
];

// 音檔放在本專案 audio/，透過 GitHub Raw 讀取（只有文字與錄音一致的才掛 audio）
const BASE_AUDIO_URL = 'https://raw.githubusercontent.com/Miyu0603/nagoya-2026/main/audio';

export const JAPANESE_PHRASES = [
  {
    category: '飯店',
    vocab: [
      { jp: '預かり (あずかり)', cn: '寄放', audio: `${BASE_AUDIO_URL}/Hotel/luggage_storage.mp3` },
      { jp: 'チェックアウト', cn: '退房' },
      { jp: 'コインロッカー', cn: '投幣置物櫃' },
      { jp: 'ヴィアイン名古屋新幹線口', cn: 'VIA INN 名古屋新幹線口' },
      { jp: 'アワーズイン阪急', cn: '阪急 OURS INN（大井町）' },
    ],
    sentences: [
      { jp: '荷物を預かっていただけますか？', cn: '可以幫我寄放行李嗎？', audio: `${BASE_AUDIO_URL}/Hotel/sentence_store_luggage.mp3` },
      { jp: '空港宅配をお願いしたいのですが。', cn: '我想寄送行李到機場。' },
      { jp: '今日の17時ごろに荷物を取りに来ます。', cn: '我今天下午 5 點左右會回來拿行李。', audio: `${BASE_AUDIO_URL}/Hotel/sentence_pickup_time.mp3` },
    ]
  },
  {
    category: '排隊與餐廳',
    vocab: [
      { jp: '整理券 (せいりけん)', cn: '號碼牌' },
      { jp: '待ち時間 (まちじかん)', cn: '等候時間' },
      { jp: '受付 (うけつけ)', cn: '登記處' },
      { jp: '店内 (てんない)', cn: '內用' },
      { jp: '持ち帰り (もちかえり)', cn: '外帶' },
      { jp: 'ひつまぶし', cn: '鰻魚三吃' },
      { jp: '深川めし (ふかがわめし)', cn: '深川丼' },
    ],
    sentences: [
      { jp: '整理券をもらえますか？', cn: '可以給我號碼牌嗎？' },
      { jp: 'どのくらい待ちますか？', cn: '大概要等多久？' },
      { jp: '二名です。', cn: '兩位。' },
      { jp: '持ち帰りできますか？', cn: '可以外帶嗎？' },
      { jp: '何時ごろ戻ればいいですか？', cn: '大概幾點回來比較好？' },
    ]
  },
  {
    category: '交通',
    vocab: [
      { jp: '特急券 (とっきゅうけん)', cn: '特急券' },
      { jp: '自由席 (じゆうせき)', cn: '自由座' },
      { jp: '指定席 (していせき)', cn: '對號座' },
      { jp: '乗り換え (のりかえ)', cn: '轉乘' },
      { jp: '空港第2ビル', cn: '成田第 2 航廈站（本次不搭到這站）' },
    ],
    sentences: [
      { jp: '名古屋までの特急券をお願いします。', cn: '我要一張到名古屋的特急券。' },
      { jp: 'この電車は成田空港まで行きますか？', cn: '這班車有到成田機場嗎？' },
    ]
  },
];

export const LOCATION_DETAILS: Record<string, LocationDetail> = {
  // ===== 住宿 =====
  'via_inn_nagoya': {
    id: 'via_inn_nagoya',
    title: 'VIA INN 名古屋新幹線口',
    description: '連住三晚（9/23–9/26）。位於名古屋站新幹線口側，走到太閤通口銀時計約 5 分鐘。\n早餐在 1F，6:30–10:00（L.O. 9:30）——但要看訂的方案有沒有含，9/24 七點多就要出門，先確認。',
    openingHours: '入住 15:00／退房 10:00',
    address: '愛知県名古屋市中村区椿町6-9',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%B4%E3%82%A3%E3%82%A2%E3%82%A4%E3%83%B3%E5%90%8D%E5%8F%A4%E5%B1%8B%E6%96%B0%E5%B9%B9%E7%B7%9A%E5%8F%A3',
  },
  'maiya_kunitachi': {
    id: 'maiya_kunitachi',
    title: '舞家（国立）',
    description: '9/26 一晚。JR 中央線国立站。隔天 10:30 就要出發才趕得上豪德寺。',
    address: '東京都国立市',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%9B%BD%E7%AB%8B%E9%A7%85',
  },
  'ours_inn_hankyu': {
    id: 'ours_inn_hankyu',
    title: '阪急 OURS INN（大井町）',
    description: '連住兩晚（9/27–9/29）。JR 大井町站步行約 3 分鐘，京濱東北線直達品川、蒲田、橫濱、上野。\n⚠️ 櫃台在 S 館 3F。凌晨 1:00–6:00 大門上鎖，之後回來要用對講機報訂房名字。\n免費寄物在 S 館櫃台，但一人限一件、且只限入住或退房當天。\n9/27 是活動結束後才入住，行李當天傍晚都還在品川置物櫃。',
    openingHours: '入住 15:00／退房 11:00',
    address: '東京都品川区大井1-50-5',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A2%E3%83%AF%E3%83%BC%E3%82%BA%E3%82%A4%E3%83%B3%E9%98%AA%E6%80%A5%E3%80%80%E5%A4%A7%E4%BA%95%E7%94%BA',
  },

  // ===== 交通 =====
  'flight_out': {
    id: 'flight_out',
    title: '去程航班',
    description: '兩人分開飛，9/23 下午在名古屋站會合。',
    address: '桃園國際機場 T1',
    reservation: {
      id: 'IT210 / IT206',
      sections: [
        {
          title: '想想 IT210',
          items: [
            { label: '桃園 T1', value: '9/23 (三) 06:40', isFullWidth: true },
            { label: '關西 KIX T1', value: '9/23 (三) 10:35', isFullWidth: true },
          ]
        },
        {
          title: 'Yian IT206',
          items: [
            { label: '桃園 T1', value: '9/23 (三) 09:00', isFullWidth: true },
            { label: '中部國際 NGO', value: '9/23 (三) 12:55', isFullWidth: true },
          ]
        },
      ]
    }
  },
  'kix_transfer': {
    id: 'kix_transfer',
    title: '關西機場 → 名古屋（落地再決定）',
    description: '南海票已在 Klook 買好，但沒有指定車次——出關後上 Klook 線上選車次＋劃位再進站。\n近鐵整點 = ひのとり（約 125 分），30 分 = アーバンライナー（約 139 分），特急券在月台黃色售票機現買即可。\n空港急行比ラピート慢 7 分鐘，但不用特急券。\n南海難波站走到近鐵大阪難波站要出站步行 8–10 分鐘，每個方案只剩 15 分緩衝，不要在難波逛。',
    address: '南海関西空港駅',
    openingHours: 'ラピート 每小時 05・35 分／空港急行 約每 15 分',
  },
  'shinkansen_tokyo': {
    id: 'shinkansen_tokyo',
    title: '名古屋 → 品川 新幹線',
    description: '已訂。9/26 14:12 名古屋發，15:43 抵品川。13:00 前要取回置物櫃行李。',
    openingHours: '9/26 14:12 發 → 15:43 抵',
    address: 'JR 名古屋駅',
  },
  'klook_baggage': {
    id: 'klook_baggage',
    title: 'Klook 行李宅配（飯店 → 成田）',
    description: '已訂。9/29 當天 9:00 前把行李交給飯店櫃台，成田 16:00 後在第 1 航廈 4F 出境大廳南翼櫃台領（開到 20:00），跟長榮報到櫃台同一層同一側。護照、現金、電子產品隨身。',
    openingHours: '9:00 前交件',
    address: '阪急 OURS INN 大井町 櫃台',
  },
  'flight_home': {
    id: 'flight_home',
    title: '回程 BR195',
    description: '長榮航空，成田第 1 航廈南翼。Skyliner 坐到終點「成田空港」站，不是「空港第2ビル」。關櫃約起飛前 60 分（19:40）。\n\n【Skyliner 底線】京成上野 17:40 → 18:24 是原訂班次。之後只剩 18:20 → 19:04，到站離關櫃只有 36 分鐘，要領宅配行李再報到會很緊。\n再下一班 19:00 → 19:44，已經過了關櫃時間，等於趕不上。\n17:40 與 18:20 之間沒有車，所以 18:20 是絕對底線。',
    openingHours: '20:40 起飛／關櫃 19:40',
    address: '成田國際機場 第 1 航廈',
    reservation: {
      id: 'BR195',
      sections: [
        {
          title: '航班 FLIGHT',
          items: [
            { label: '成田 NRT T1', value: '9/29 (二) 20:40', isFullWidth: true },
            { label: '桃園 TPE', value: '9/29 (二) 23:20', isFullWidth: true },
          ]
        },
        {
          title: '接駁 ACCESS',
          items: [
            { label: 'Skyliner', value: '京成上野 17:40 → 成田空港 18:27', isFullWidth: true },
          ]
        },
      ]
    }
  },

  // ===== 9/23 名古屋 =====
  'nagoya_castle': {
    id: 'nagoya_castle',
    title: '名古屋城 大盆踊り大会',
    description: '秋まつり 大盆踊り 9/19–23，17:30–19:10 於正門附近特設櫓。9/23 是最後一天，當天有「和洋樂器混成樂團 Neo Japanesque」，18:00 頃是平針木遣り音頭。\n入城料大人 ¥500（10/1 起調為 ¥1,000，這趟還是舊價）。地鐵名古屋城站 7 號出口步行 5 分。',
    openingHours: '夜間延長 9/19–10/4：最終入場 19:30、閉門 20:00',
    address: '愛知県名古屋市中区本丸1-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%9F%8E',
  },
  'art_lights': {
    id: 'art_lights',
    title: 'AICHI NAGOYA ART&LIGHTS',
    description: '9/17–10/24 每晚 18:30–21:00，會場是愛知縣廳與名古屋市役所本廳舍（不在城內）。免費免預約，兩棟各投影 5 分鐘交替。18:30–19:30 最擠，看完盆踊り 19:10 再過去剛好錯開。',
    openingHours: '9/17–10/24 每晚 18:30–21:00',
    address: '愛知県名古屋市中区三の丸3-1-2',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%84%9B%E7%9F%A5%E7%9C%8C%E5%BA%81%E6%9C%AC%E5%BA%81%E8%88%8E',
  },

  // ===== 9/24 高山・白川鄉 =====
  'kkday_tour': {
    id: 'kkday_tour',
    title: 'KKday 高山・白川鄉一日遊',
    description: '已訂。8:10 於 JR 名古屋站西口（太閤通口）銀時計前集合，18:30 名古屋站解散。回程塞車是常態，若明顯延遲先通知うな富士。',
    openingHours: '8:10 集合／18:30 解散',
    address: 'JR 名古屋駅 太閤通口 銀の時計前',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E9%8A%80%E3%81%AE%E6%99%82%E8%A8%88%E3%80%80%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%A7%85',
  },
  'unafuji': {
    id: 'unafuji',
    title: 'うな富士 名古屋駅太閤口店',
    description: '已訂位 19:00。離近鐵和飯店都很近，解散後可以先回飯店放東西再出來。',
    openingHours: '已訂位 19:00',
    address: '愛知県名古屋市中村区椿町',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%81%86%E3%81%AA%E5%AF%8C%E5%A3%AB%E3%80%80%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%A7%85%E5%A4%AA%E9%96%A4%E5%8F%A3%E5%BA%97',
  },
  'oasis21': {
    id: 'oasis21',
    title: 'オアシス21 & 中部電力 MIRAI TOWER',
    description: '只看外觀不上塔。水の宇宙船 21:00 就關，要走上玻璃屋頂得在這之前；燈光本身亮到 23:00，銀河の広場也開到 23:00。20:43 與 21:00 各有 1 分鐘特別燈光演出。',
    openingHours: '水の宇宙船 –21:00／燈光 –23:00',
    address: '愛知県名古屋市東区東桜1-11-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%AA%E3%82%A2%E3%82%B7%E3%82%B921',
  },

  // ===== 9/25 清洲・大須・栄 =====
  'aichi_gokoku': {
    id: 'aichi_gokoku',
    title: '愛知縣護國神社',
    description: '鎮座在名古屋城三の丸，就夾在名古屋城與愛知縣廳之間——等於跟晚上的 ART&LIGHTS 同一區，順路。\n地鐵名古屋城站 5 號出口徒步 7 分（往正門是 7 號出口）。御朱印在神門左側的社務所。',
    openingHours: '境內參拜一般到日落；社務所時間官網未公開，需要御朱印先撥 052-201-8078',
    address: '愛知県名古屋市中区三の丸1-7-3',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%84%9B%E7%9F%A5%E7%B8%A3%E8%AD%B7%E5%9C%8B%E7%A5%9E%E7%A4%BE',
  },
  'shimokitazawa': {
    id: 'shimokitazawa',
    title: '下北澤',
    description: '古著店密度全東京最高的一區，小劇場與咖啡店也多。從豪徳寺搭小田急 2 站、約 5 分鐘。\n南口與北口都有商店街，午餐選擇很多，不用先訂位。',
    openingHours: '多數店家 11:00–20:00',
    address: '東京都世田谷区北沢',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E4%B8%8B%E5%8C%97%E6%B2%A2',
  },
  'ameyoko': {
    id: 'ameyoko',
    title: '阿美橫町（アメヤ横丁）',
    description: '上野與御徒町之間高架下的商店街，乾貨、藥妝、雜貨與立食居酒屋混在一起。\n逛完走到京成上野站約 5 分，直接接 Skyliner。',
    openingHours: '多數店家 10:00–20:00，居酒屋更晚',
    address: '東京都台東区上野4丁目',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A2%E3%83%A1%E3%83%A4%E6%A8%AA%E4%B8%81',
  },
  'osu_kannon': {
    id: 'osu_kannon',
    title: '大須観音（北野山 真福寺 寶生院）',
    description: '大須商店街的起點，日本三大觀音之一。境內開放時間長，這個行程時段不會撞到關門。',
    openingHours: '約 6:00–19:00',
    address: '愛知県名古屋市中区大須2-21-47',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%A4%A7%E9%A0%88%E8%A6%B3%E9%9F%B3',
  },
  'nanatsudera': {
    id: 'nanatsudera',
    title: '七寺（稲園山 長福寺）',
    description: '1290 年歷史的真言宗寺院，從大須観音徒步 5 分。堂內拝觀要預約，境內參拜直接進去就好。',
    openingHours: '9:00–17:00（堂內拝觀採預約制）',
    address: '愛知県名古屋市中区大須2-28-5',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E4%B8%83%E5%AF%BA%20%E5%A4%A7%E9%A0%88',
  },
  'banshoji': {
    id: 'banshoji',
    title: '万松寺',
    description: '織田家菩提寺，現在是商店街裡的現代化寺院。境內免費，絵馬堂另收 ¥1,000。',
    openingHours: '10:00–18:00',
    address: '愛知県名古屋市中区大須3-29-12',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E4%B8%87%E6%9D%BE%E5%AF%BA',
  },
  'miwa_jinja': {
    id: 'miwa_jinja',
    title: '三輪神社',
    description: '兔子御守與三角鳥居。參拜無休、24 小時都進得去；御朱印的開放日要看官網行事曆，不是每天都有。',
    openingHours: '參拜 24 小時無休',
    address: '愛知県名古屋市中区大須3-9-32',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E4%B8%89%E8%BC%AA%E7%A5%9E%E7%A4%BE%20%E5%90%8D%E5%8F%A4%E5%B1%8B',
  },
  'wakamiya_hachiman': {
    id: 'wakamiya_hachiman',
    title: '若宮八幡社',
    description: '名古屋總鎮守。從三輪神社徒步 12 分，逛完走去栄約 8 分。',
    openingHours: '社務所 9:00–17:00',
    address: '愛知県名古屋市中区栄3-35-30',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E8%8B%A5%E5%AE%AE%E5%85%AB%E5%B9%A1%E7%A4%BE%20%E5%90%8D%E5%8F%A4%E5%B1%8B',
  },
  'bucyo_coffee': {
    id: 'bucyo_coffee',
    title: 'Bucyo Coffee',
    description: '早餐。名古屋站太閤通口周邊，飯店步行 5–8 分。',
    openingHours: '早餐 08:25–09:10',
    address: '愛知県名古屋市中村区則武',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bucyo+Coffee+Nagoya',
  },
  'kiyosu_castle': {
    id: 'kiyosu_castle',
    title: '清洲城',
    description: '9:00 開館，週一休，週五正常。JR 到清洲駅約 7–10 分＋徒步 15–17 分；累的話 Uber 直達約 5 分車程。',
    openingHours: '9:00 開館，週一休',
    address: '愛知県清須市朝日城屋敷1-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%B8%85%E6%B4%B2%E5%9F%8E',
  },
  'rockin_robin': {
    id: 'rockin_robin',
    title: 'ロッキンロビン 大須店',
    description: '午餐。鐵板漢堡排，在大須商店街內。',
    openingHours: '午餐 13:00–13:50',
    address: '愛知県名古屋市中区大須',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%AD%E3%83%83%E3%82%AD%E3%83%B3%E3%83%AD%E3%83%93%E3%83%B3%E3%80%80%E5%A4%A7%E9%A0%88',
  },
  'kurin': {
    id: 'kurin',
    title: '和栗モンブラン専門店 栗りん',
    description: '11:00–19:00。店內用要當天 10:30 起現場登記、不收電話預約，只有 10 席，中午前通常就滿。直接走外帶窗口買モンブランソフト邊逛邊吃最實際，外帶一樣看得到現場擠栗子泥。',
    openingHours: '11:00–19:00',
    address: '愛知県名古屋市中区大須3-37-40 カノン大須 1F',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%A0%97%E3%82%8A%E3%82%93%E3%80%80%E5%A4%A7%E9%A0%88',
  },
  'sakae_parco': {
    id: 'sakae_parco',
    title: '栄 / 名古屋 PARCO',
    description: 'Tower Records（東館 6F）、SABON（東館 B1F）、LACHIC、松坂屋、久屋大通 Hisaya-odori Park。PARCO 約 21:00 打烊。',
    openingHours: '約 21:00 打烊',
    address: '愛知県名古屋市中区栄3-29-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%90%8D%E5%8F%A4%E5%B1%8BPARCO',
  },

  // ===== 9/26 熱田 =====
  'horaiken_honten': {
    id: 'horaiken_honten',
    title: 'あつた蓬萊軒 本店',
    description: '不收電話訂位，只能現場登記。整理券約 10:00–10:30 開始發，忙的日子會提前。有人 9:40 到時前面已經好幾組，週六＋亞運再提前一點比較安全。\n備案：整理券若排到 13:00 以後，改去神宮店或改買外帶。',
    openingHours: '整理券約 10:00–10:30 開始發',
    address: '愛知県名古屋市熱田区神戸町503',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%81%82%E3%81%A4%E3%81%9F%E8%93%AC%E8%8E%B1%E8%BB%92%E6%9C%AC%E5%BA%97',
  },
  'atsuta_jingu': {
    id: 'atsuta_jingu',
    title: '熱田神宮',
    description: '本店走到南門約 10 分。不要走太深 —— 有人 10:05 領券、10:50 就被叫回去。本宮來回抓 45 分鐘剛好。',
    openingHours: '本宮來回抓 45 分鐘',
    address: '愛知県名古屋市熱田区神宮1-1-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E7%86%B1%E7%94%B0%E7%A5%9E%E5%AE%AE',
  },

  // ===== 9/27 東京 =====
  'gotokuji': {
    id: 'gotokuji',
    title: '豪德寺',
    description: '招財貓。小田急豪徳寺站步行約 10 分，到下北沢只有 2 站。',
    openingHours: '11:35–12:10',
    address: '東京都世田谷区豪徳寺2-24-7',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E8%B1%AA%E5%BE%B3%E5%AF%BA',
  },
  'kogakuin_arena': {
    id: 'kogakuin_arena',
    title: '日本工学院 蒲田校 片柳アリーナ',
    description: '開場 16:00、開演 17:00。開場後不必馬上進場，時間可以彈性用。\n蒲田駅西口出來官網寫徒步 2 分。入口在 2 号館，搭電扶梯往下：地下 3 樓是 2 樓席、地下 4 樓是搖滾區。',
    openingHours: '開場 16:00／開演 17:00',
    address: '東京都大田区西蒲田5-23-22',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%97%A5%E6%9C%AC%E5%B7%A5%E5%AD%A6%E9%99%A2%E3%80%80%E7%89%87%E6%9F%B3%E3%82%A2%E3%83%AA%E3%83%BC%E3%83%8A',
  },
  'naruto_taiyaki': {
    id: 'naruto_taiyaki',
    title: '鳴門鯛焼本舗 蒲田駅前店',
    description: '蒲田駅西口站前，離會場徒步 2 分。排在進場前買，剛好在場外吃掉——場內能不能飲食要看主辦方的注意事項。',
    openingHours: '進場前順路',
    address: '東京都大田区蒲田',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E9%B3%B4%E9%96%80%E9%AF%9B%E7%84%BC%E6%9C%AC%E8%88%97%E3%80%80%E8%92%B2%E7%94%B0',
  },

  // ===== 9/28 橫濱 =====
  'saihoji': {
    id: 'saihoji',
    title: '西方寺',
    description: '彼岸花季末段。地鐵藍線新羽站步行 8 分。離市中心 9 公里、單程 45 分鐘，是全天唯一的遠點。',
    openingHours: '09:00–09:25',
    address: '神奈川県横浜市港北区新羽町2586',
    mapUrl: 'https://maps.google.com/?cid=5323189156766403328',
  },
  'iseyama': {
    id: 'iseyama',
    title: '伊勢山皇大神宮 / 成田山橫濱別院 / 掃部山公園',
    description: '三處在同一個野毛山丘上，彼此步行 3–5 分。從桜木町站走上來約 10 分，有坡。',
    openingHours: '伊勢山皇大神宮 6:00–20:00／社務所 9:00–19:00',
    address: '神奈川県横浜市西区宮崎町64',
    mapUrl: 'https://maps.google.com/?cid=16541305802646519216',
  },
  'center_beef': {
    id: 'center_beef',
    title: 'CENTER BEEF 関内',
    description: '10:30 開店，午市到 14:45。只有約 10 席會等一下。從掃部山走下來約 18 分。',
    openingHours: '10:30 開店，午市到 14:45',
    address: '神奈川県横浜市中区末広町2-5-1 呉ビル 1F',
    mapUrl: 'https://maps.google.com/?cid=4681103572478882018',
  },
  'chinatown': {
    id: 'chinatown',
    title: '橫濱中華街',
    description: '只拍照不久留。朝陽門、關帝廟、中華街大通り走一趟約 20 分，往元町・中華街駅再走 5 分。元町商店街已從行程移除。',
    openingHours: '街區全天可走；店家多為 11:00–21:00',
    address: '神奈川県横浜市中区山下町',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%A8%AA%E6%B5%9C%E4%B8%AD%E8%8F%AF%E8%A1%97',
  },
  'planetaria': {
    id: 'planetaria',
    title: 'プラネタリア YOKOHAMA',
    description: '橫濱Gate Tower 2F，新高島站 1 號出口步行 1 分。場次五天前才開放，行程暫定 13:10–13:50（照 9/25 的場次推）。實際場次若不同，動橫濱站那段，不要動 Sky Garden 的 17:00。',
    openingHours: '暫定 13:10–13:50（場次五天前開放）',
    address: '神奈川県横浜市西区高島1-2-5 横濱ゲートタワー 2F',
    mapUrl: 'https://maps.google.com/?cid=9523900471524728616',
  },
  'yokohama_station': {
    id: 'yokohama_station',
    title: '橫濱站購物（85 分鐘）',
    description: '建議切法：西口ビブレ 45 分（8F 安利美特 → 4F 東京古着／古着屋3peace → B1F GU）→ 走東口 10 分 → そごう 7F LOFT ＋ LUMINE 30 分。西口另有橫濱MORE\'S 3F GRAPEFRUIT MOON（歐美復古）。東西口互走約 10 分鐘。',
    address: '神奈川県横浜市西区南幸2-15-13（ビブレ）',
    mapUrl: 'https://maps.google.com/?cid=12596751285917875243',
  },
  'mark_is': {
    id: 'mark_is',
    title: 'MARK IS みなとみらい',
    description: 'Pokémon Center Yokohama、1F ACTUS（家具與生活雜貨，同館不同層）。平日 10:00–20:00。\nJUMP SHOP（ランドマークプラザ 2F）與 Snoopy Town（みなとみらい東急スクエア）就在走過去的路上，跟 Sky Garden 同一區，可以順著逛。',
    openingHours: '平日 10:00–20:00',
    address: '神奈川県横浜市西区みなとみらい3-5-1',
    mapUrl: 'https://maps.google.com/?cid=15123389883336727787',
  },
  'landmark_queens': {
    id: 'landmark_queens',
    title: 'ランドマークプラザ ＋ みなとみらい東急スクエア',
    description: 'JUMP SHOP 在ランドマークプラザ 2F（少年 JUMP 官方周邊）。\nSNOOPY TOWN 與迪士尼商店在隔壁的みなとみらい東急スクエア（クイーンズスクエア），同層可以一次逛完。\n兩棟與 MARK IS 之間有空橋相連，不用出戶外；Sky Garden 就在ランドマークプラザ 同一棟的 69F，逛完直接上去。',
    openingHours: '約 11:00–20:00（Sky Garden 另計）',
    address: '神奈川県横浜市西区みなとみらい2-2-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%A9%E3%83%B3%E3%83%89%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%97%E3%83%A9%E3%82%B6',
  },
  'world_porters': {
    id: 'world_porters',
    title: '橫濱 World Porters',
    description: '3F 古著區：SPINNS VINTAGE 品項最廣、Mosh Pit 便宜量多、古着屋3peace 約 4,000 件。\n⚠️ JUMP SHOP 與 Snoopy Town 不在這裡——JUMP SHOP 在ランドマークプラザ 2F、Snoopy Town 在隔壁的みなとみらい東急スクエア，兩個都跟 Sky Garden 同一區。\n跟 MARK IS 不同棟，走約 11 分。旁邊就是 AIR CABIN 運河公園站。',
    openingHours: '10:30–21:00',
    address: '神奈川県横浜市中区新港2-2-1',
    mapUrl: 'https://maps.google.com/?cid=15378299174499544579',
  },
  'sky_garden': {
    id: 'sky_garden',
    title: 'Sky Garden（地標塔 69F）',
    description: '當天橫濱日落約 17:28，17:00 這個時間不要動。走到桜木町站約 8 分，AIR CABIN 從那裡發車。',
    openingHours: '17:00 入場（當天日落 17:28）',
    address: '神奈川県横浜市西区みなとみらい2-2-1 69F',
    mapUrl: 'https://maps.google.com/?cid=6607536174985891965',
  },
  'air_cabin': {
    id: 'air_cabin',
    title: 'YOKOHAMA AIR CABIN',
    description: '桜木町 ↔ 運河公園，單程約 5 分。\n現在的排法是逛完 World Porters 之後從運河公園站單程搭回桜木町，剛好順路，不用特地往復一趟。走路回去約 15 分，趕時間再搭。',
    openingHours: 'A 往復 18:45–19:15／B 單程後逛到 19:45',
    address: '神奈川県横浜市中区桜木町1-200',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=YOKOHAMA+AIR+CABIN',
  },

  // ===== 9/29 清澄白河・上野 =====
  'kiyosumi_garden': {
    id: 'kiyosumi_garden',
    title: '清澄庭園',
    description: '9:00–17:00，¥150。清澄白河站 A3 出口出來就是。池邊飛石路要走一下，鞋子好走一點。',
    openingHours: '9:00–17:00｜¥150',
    address: '東京都江東区清澄3-3-9',
    mapUrl: 'https://maps.google.com/?cid=9741550465813907025',
  },
  'takahashi': {
    id: 'takahashi',
    title: '江戶土產屋高橋（江戸みやげ屋たかはし）',
    description: '10:00–19:00，資料館通り上。老夫婦經營，昭和零食、玩具、古物都有，會請客人試吃。',
    openingHours: '10:00–19:00',
    address: '東京都江東区三好1-8-6',
    mapUrl: 'https://maps.google.com/?cid=2952362341513008649',
  },
  'fukagawa_kamasho': {
    id: 'fukagawa_kamasho',
    title: '深川釜匠',
    description: '週一公休、週二只做午市 11:00–15:00。開店即到可避開排隊。深川丼湯汁版蛤蜊滿到溢出來。這是 9/29 唯一有硬性關門時間的點。',
    openingHours: '週二僅午市 11:00–15:00（週一公休）',
    address: '東京都江東区白河2-1-13',
    mapUrl: 'https://maps.google.com/?cid=8107653639708109163',
  },
  'fukagawa_edo_museum': {
    id: 'fukagawa_edo_museum',
    title: '深川江戶資料館',
    description: '9:30–17:00，¥400。就在深川釜匠附近。可以走進江戶町屋裡摸，燈光會從白天變到傍晚還會下雨，志工導覽講得很好。',
    openingHours: '9:30–17:00｜¥400',
    address: '東京都江東区白河1-3-28',
    mapUrl: 'https://maps.google.com/?cid=5532162446945768520',
  },
  'cheese_no_koe': {
    id: 'cheese_no_koe',
    title: 'Cheese no Koe（チーズのこえ）',
    description: '11:00–19:00。專賣北海道起司，霜淇淋奶味很濃。店內和店門口都不能吃，要走開一點。',
    openingHours: '11:00–19:00',
    address: '東京都江東区平野1-7-7',
    mapUrl: 'https://maps.google.com/?cid=617537243635653446',
  },
  'babaghuri': {
    id: 'babaghuri',
    title: 'Babaghuri 清澄本店',
    description: '11:00–19:00，週二有營業。ヨーガンレール 本社一樓，陶器選得很好。逛完走回清澄白河站約 5 分。',
    openingHours: '11:00–19:00（週二有營業）',
    address: '東京都江東区清澄3-1-7',
    mapUrl: 'https://maps.google.com/?cid=5987257113677615030',
  },
  'usagiya': {
    id: 'usagiya',
    title: 'うさぎや（上野）',
    description: 'どら焼き。上野広小路出口旁，順路先買避免下午賣完。週三公休、週二正常，9:00–18:00。',
    openingHours: '9:00–18:00（週三公休）',
    address: '東京都台東区上野1-10-10',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%81%86%E3%81%95%E3%81%8E%E3%82%84%E3%80%80%E4%B8%8A%E9%87%8E',
  },
  'ueno_toshogu': {
    id: 'ueno_toshogu',
    title: '上野東照宮 / 花園稲荷神社 / 不忍池',
    description: '三處都在上野公園內，彼此步行 5–10 分。東照宮社殿拜觀最後入場約 16:00。',
    openingHours: '社殿拜觀最後入場約 16:00',
    address: '東京都台東区上野公園9-88',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E4%B8%8A%E9%87%8E%E6%9D%B1%E7%85%A7%E5%AE%AE',
  },
  'yushima_tenmangu': {
    id: 'yushima_tenmangu',
    title: '湯島天満宮',
    description: '不忍池走過去約 12 分，再走到京成上野站約 12 分。',
    openingHours: '境內 6:00–20:00（寶物殿 9:00–17:00，最後入館 16:30）',
    address: '東京都文京区湯島3-30-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E6%B9%AF%E5%B3%B6%E5%A4%A9%E6%BA%80%E5%AE%AE',
  },
};

export const ITINERARY: DaySchedule[] = [
  {
    date: '9/23',
    weekday: '星期三',
    title: '抵達名古屋・名古屋城夜祭',
    accommodation: 'VIA INN 名古屋新幹線口',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%B4%E3%82%A3%E3%82%A2%E3%82%A4%E3%83%B3%E5%90%8D%E5%8F%A4%E5%B1%8B%E6%96%B0%E5%B9%B9%E7%B7%9A%E5%8F%A3',
    mapUrl: 'https://www.google.com/maps/dir/Kansai+International+Airport/Osaka+Namba+Station/Nagoya+Station/Nagoya+Castle',
    events: [
      { time: '06:40', description: 'IT210 桃園 T1 起飛', category: 'transit', locationId: 'flight_out', isHighlight: true },
      { time: '10:35', description: '抵達關西機場 T1', category: 'transit' },
      { time: '10:35', description: '入境、提行李', category: 'transit', note: '先辦好 Visit Japan Web。KIX 尖峰抓 45 分鐘' },
      { time: '11:25', description: '走到南海關西空港站', category: 'transit', note: '約 5 分' },
      { time: '11:35', description: '関西空港 → 難波 12:13', category: 'transit', locationId: 'kix_transfer', isHighlight: true, note: 'Klook 已購票、尚未劃位，現場再線上選車次與劃位。南海難波走到近鐵大阪難波要 8–10 分',
        origin: '関西空港', legs: [{ via: '南海ラピート', to: '難波', arrive: '12:13' }],
        alternatives: [
          { when: '很順', detail: '11:05 ラピート → 難波 11:43' },
          { when: '正常', detail: '11:35 ラピート → 難波 12:13', isPlan: true },
          { when: '偏慢', detail: '12:05 ラピート → 難波 12:45' },
          { when: '很慢', detail: '12:35 ラピート → 難波 13:14' },
        ] },
      { time: '12:30', description: '大阪難波 → 近鐵名古屋 14:49', category: 'transit', locationId: 'kix_transfer', isHighlight: true,
        origin: '大阪難波', legs: [{ via: '近鐵アーバンライナー', to: '近鐵名古屋', arrive: '14:49' }],
        alternatives: [
          { when: '很順', detail: '12:00 ひのとり → 名古屋 14:05' },
          { when: '正常', detail: '12:30 アーバン → 名古屋 14:49', isPlan: true },
          { when: '偏慢', detail: '13:00 ひのとり → 名古屋 15:05' },
          { when: '很慢', detail: '13:30 アーバン → 名古屋 15:49' },
        ] },
      { time: '15:00', description: '名古屋站與 Yian 會合', category: 'transit', note: 'Yian：12:55 中部國際機場 → 14:00 μ-SKY → 14:28 名鐵名古屋' },
      { time: '15:10', description: '入住 VIA INN 名古屋新幹線口', category: 'stay', locationId: 'via_inn_nagoya' },
      { time: '15:45', description: '名古屋 → 名古屋城站 16:00', category: 'transit', note: '約 15 分', origin: '名古屋', legs: [{ via: '東山線', to: '栄' }, { via: '名城線', to: '名古屋城站', arrive: '16:00' }] },
      { time: '16:10', description: '愛知縣護國神社', category: 'spot', locationId: 'aichi_gokoku', note: '～16:45。5 號出口徒步 7 分' },
      { time: '16:50', description: '步行至名古屋城正門', category: 'transit', note: '約 10 分，夜間入場 17:00 開始' },
      { time: '17:30', description: '名古屋城 大盆踊り大会', category: 'event', locationId: 'nagoya_castle', isHighlight: true, note: '17:30–19:10，18:00 平針木遣り音頭，需入城料' },
      { time: '19:20', description: 'AICHI NAGOYA ART&LIGHTS', category: 'event', locationId: 'art_lights', note: '免費免預約，18:30–19:30 最擠，這時間去剛好錯開' },
      { time: '20:10', description: '回名古屋站附近晚餐', category: 'food' },
    ]
  },
  {
    date: '9/24',
    weekday: '星期四',
    title: '高山老街・白川鄉一日遊',
    accommodation: 'VIA INN 名古屋新幹線口',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%B4%E3%82%A3%E3%82%A2%E3%82%A4%E3%83%B3%E5%90%8D%E5%8F%A4%E5%B1%8B%E6%96%B0%E5%B9%B9%E7%B7%9A%E5%8F%A3',
    mapUrl: 'https://www.google.com/maps/dir/Nagoya+Station/Takayama+Old+Town/Shirakawa-go/Nagoya+Station',
    events: [
      { time: '07:55', description: '出發，飯店走到銀時計約 5 分', category: 'transit' },
      { time: '08:10', description: '集合：JR 名古屋站西口（太閤通口）銀時計前', category: 'transit', locationId: 'kkday_tour', isHighlight: true },
      { time: '11:00', description: '高山老街', category: 'spot', note: '含午餐，約 2.5 小時' },
      { time: '14:30', description: '白川鄉合掌村', category: 'spot', note: '約 2 小時' },
      { time: '18:30', description: '名古屋站解散', category: 'transit' },
      { time: '18:40', description: '回飯店放東西', category: 'stay' },
      { time: '19:00', description: 'うな富士 名古屋駅太閤口店 晚餐', category: 'food', locationId: 'unafuji', isHighlight: true, note: '已訂位。巴士若明顯延遲先通知店家' },
      { time: '20:00', description: 'オアシス21 & MIRAI TOWER 外觀夜景', category: 'spot', locationId: 'oasis21', note: '不上塔。水の宇宙船 21:00 關，燈光到 23:00' },
    ]
  },
  {
    date: '9/25',
    weekday: '星期五',
    title: '清洲城・大須寺社巡禮・栄',
    accommodation: 'VIA INN 名古屋新幹線口',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%83%B4%E3%82%A3%E3%82%A2%E3%82%A4%E3%83%B3%E5%90%8D%E5%8F%A4%E5%B1%8B%E6%96%B0%E5%B9%B9%E7%B7%9A%E5%8F%A3',
    mapUrl: 'https://www.google.com/maps/dir/Nagoya+Station/Kiyosu+Castle/Osu+Kannon/Wakamiya+Hachimansha/Sakae+Nagoya',
    events: [
      { time: '08:25', description: 'Bucyo Coffee 早餐', category: 'food', locationId: 'bucyo_coffee', note: '08:25–09:10' },
      { time: '09:10', description: '前往清洲城', category: 'transit', note: 'JR 到清洲駅約 7–10 分＋徒步 15–17 分，抓 30 分；或 Uber' },
      { time: '10:00', description: '清洲城', category: 'spot', locationId: 'kiyosu_castle', note: '10:00–11:30' },
      { time: '11:30', description: '回市中心', category: 'transit', note: '清洲→名古屋→鶴舞線大須観音，抓 40 分' },
      { time: '12:15', description: '大須観音', category: 'spot', locationId: 'osu_kannon', note: '12:15–12:35' },
      { time: '12:40', description: '七寺', category: 'spot', locationId: 'nanatsudera', note: '徒步 3–5 分，12:40–12:55' },
      { time: '13:00', description: 'ロッキンロビン 大須店 午餐', category: 'food', locationId: 'rockin_robin', note: '13:00–13:50' },
      { time: '13:55', description: '万松寺', category: 'spot', locationId: 'banshoji', note: '13:55–14:15' },
      { time: '14:20', description: '和栗モンブラン専門店 栗りん', category: 'food', locationId: 'kurin', isHighlight: true, note: '店內位子中午前多半滿了，走外帶窗口比較實際' },
      { time: '14:50', description: '三輪神社', category: 'spot', locationId: 'miwa_jinja', note: '14:50–15:05' },
      { time: '15:15', description: '若宮八幡社', category: 'spot', locationId: 'wakamiya_hachiman', note: '徒步 12 分，15:15–15:35' },
      { time: '15:45', description: '栄商圈、PARCO', category: 'spot', locationId: 'sakae_parco', note: 'Tower Records 東館 6F、SABON 東館 B1F' },
      { time: '18:30', description: '栄晚餐', category: 'food' },
      { time: '21:20', description: '回飯店，今晚先把行李整理好', category: 'stay', note: '明天一早要排蓬萊軒' },
    ]
  },
  {
    date: '9/26',
    weekday: '星期六',
    title: '熱田神宮・蓬萊軒 → 東京',
    accommodation: '舞家（国立）',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%9B%BD%E7%AB%8B%E9%A7%85',
    mapUrl: 'https://www.google.com/maps/dir/Nagoya+Station/Atsuta+Jingu/Nagoya+Station/Shinagawa+Station/Kunitachi+Station',
    events: [
      { time: '08:00', description: '退房', category: 'stay' },
      { time: '08:05', description: '名古屋站寄行李＋超商買早餐', category: 'stay', note: '週六＋亞運置物櫃會滿，早點卡位。早餐帶上車吃' },
      { time: '08:30', description: '名鉄名古屋 → 神宮前 08:36', category: 'transit', note: '約 6 分，班次密集' },
      { time: '08:50', description: '蓬萊軒本店 開始排隊', category: 'food', locationId: 'horaiken_honten', isHighlight: true, note: '從神宮前走過來實際約 10–12 分' },
      { time: '10:00', description: '領整理券、指定入座時段', category: 'food', note: '發券約 10:00–10:30，忙的日子會提前' },
      { time: '10:20', description: '熱田神宮 參拜', category: 'spot', locationId: 'atsuta_jingu', note: '不要走太深，本宮來回抓 45 分鐘' },
      { time: '11:30', description: 'ひつまぶし', category: 'food', note: '實際時間依整理券而定，抓 1 小時' },
      { time: '12:35', description: '神宮前 → 名鉄名古屋', category: 'transit', note: '約 9 分＋走路，抓 20 分' },
      { time: '13:00', description: '取回行李，緩衝時間', category: 'stay', note: '離發車還有 70 分鐘' },
      { time: '14:12', description: '名古屋 → 品川 15:43', category: 'transit', locationId: 'shinkansen_tokyo', isHighlight: true, origin: '名古屋', legs: [{ via: '新幹線', to: '品川', arrive: '15:43' }] },
      { time: '15:50', description: '品川站寄行李、買 Suica', category: 'stay', note: '要放到 9/27 晚上 8 點才取，務必確認是 3 天制不是當日制' },
      { time: '16:10', description: '品川 → 国立 17:10', category: 'transit', origin: '品川', legs: [{ via: '山手線', to: '新宿', arrive: '16:30' }, { via: '中央線快速', to: '国立', arrive: '17:10' }] },
      { time: '17:20', description: '抵達舞家', category: 'stay', locationId: 'maiya_kunitachi' },
    ]
  },
  {
    date: '9/27',
    weekday: '星期日',
    title: '豪德寺・下北澤・蒲田聲優活動',
    accommodation: '阪急 OURS INN（大井町）',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A2%E3%83%AF%E3%83%BC%E3%82%BA%E3%82%A4%E3%83%B3%E9%98%AA%E6%80%A5%E3%80%80%E5%A4%A7%E4%BA%95%E7%94%BA',
    mapUrl: 'https://www.google.com/maps/dir/Kunitachi+Station/Gotokuji+Temple/Shimokitazawa/Shinagawa+Station/Oimachi+Station/Kamata+Station',
    events: [
      { time: '10:30', description: '離開舞家', category: 'stay', note: '要趕 11:30 到豪德寺就得 10:30 出門，路上 50 分鐘' },
      { time: '10:40', description: '国立 → 豪徳寺 11:30', category: 'transit', origin: '国立', legs: [{ via: '中央線快速', to: '新宿', arrive: '11:10' }, { via: '小田急', to: '豪徳寺', arrive: '11:30' }] },
      { time: '11:35', description: '豪德寺（招財貓）', category: 'spot', locationId: 'gotokuji', note: '11:35–12:10' },
      { time: '12:15', description: '豪徳寺 → 下北沢 12:20', category: 'transit', note: '2 站', origin: '豪徳寺', legs: [{ via: '小田急', to: '下北沢', arrive: '12:20' }] },
      { time: '12:30', description: '下北澤 午餐＋逛街', category: 'food', locationId: 'shimokitazawa', note: '12:30–15:00' },
      { time: '15:00', description: '下北沢 → 品川 15:30', category: 'transit', origin: '下北沢', legs: [{ via: '井の頭線', to: '渋谷' }, { via: '山手線', to: '品川', arrive: '15:30' }] },
      { time: '15:35', description: '品川 → 蒲田 15:46', category: 'transit', note: '行李續留品川置物櫃，活動後再回頭拿', origin: '品川', legs: [{ via: '京浜東北線', to: '蒲田', arrive: '15:46' }] },
      { time: '15:50', description: '鳴門鯛焼本舗 蒲田駅前店', category: 'food', locationId: 'naruto_taiyaki', note: '就在西口站前，進場前先買先吃掉' },
      { time: '16:20', description: '抵達片柳アリーナ', category: 'transit', locationId: 'kogakuin_arena', note: '西口徒步 2 分。入口在 2 号館，電扶梯往下：B3 是 2 樓席、B4 是搖滾區' },
      { time: '17:00', description: '入間聲優活動 開演', category: 'event', locationId: 'kogakuin_arena', isHighlight: true, note: '16:00 就開場，不必一開場就進去' },
      { time: '19:50', description: '蒲田 → 大井町 20:05', category: 'transit', note: '時間依散場而定。中途在品川下車取回行李，再搭一站', origin: '蒲田', legs: [{ via: '京浜東北線', to: '品川' }, { via: '取行李後再搭', to: '大井町', arrive: '20:05' }] },
      { time: '20:15', description: '阪急 OURS INN 入住、放行李', category: 'stay', locationId: 'ours_inn_hankyu', note: '今天全程帶著隨身物，行李晚上才進飯店' },
    ]
  },
  {
    date: '9/28',
    weekday: '星期一',
    title: '橫濱一日',
    accommodation: '阪急 OURS INN（大井町）',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A2%E3%83%AF%E3%83%BC%E3%82%BA%E3%82%A4%E3%83%B3%E9%98%AA%E6%80%A5%E3%80%80%E5%A4%A7%E4%BA%95%E7%94%BA',
    mapUrl: 'https://www.google.com/maps/dir/Oimachi+Station/Saihoji+Nippa/Iseyama+Kotaijingu/Center+Beef+Kannai/Yokohama+Chinatown/Planetaria+Yokohama/Yokohama+Station/MARK+IS+Minatomirai/Yokohama+Landmark+Tower',
    links: [{ label: '逛街地圖', url: 'https://claude.ai/artifact/TgSNYCbX4AscXqDAKeZiJd' }],
    events: [
      { time: '08:05', description: '大井町 → 新羽 08:53', category: 'transit', origin: '大井町', legs: [{ via: '京浜東北線', to: '横浜', arrive: '08:28' }, { via: 'ブルーライン', to: '新羽', arrive: '08:53' }] },
      { time: '09:00', description: '西方寺', category: 'spot', locationId: 'saihoji', note: '彼岸花季末段，09:00–09:25' },
      { time: '09:33', description: '新羽 → 桜木町 09:55', category: 'transit', origin: '新羽', legs: [{ via: 'ブルーライン', to: '桜木町', arrive: '09:55' }] },
      { time: '10:00', description: '伊勢山皇大神宮 → 成田山橫濱別院 → 掃部山公園', category: 'spot', locationId: 'iseyama', note: '同一個丘上，互距 3–5 分，10:00–10:45' },
      { time: '10:50', description: '步行下坡至関内', category: 'transit', note: '約 18 分' },
      { time: '11:10', description: 'CENTER BEEF 関内 午餐', category: 'food', locationId: 'center_beef', note: '11:10–12:00，現場排隊' },
      { time: '12:05', description: '走路往中華街', category: 'transit', note: '約 12 分' },
      { time: '12:15', description: '橫濱中華街 拍照', category: 'spot', locationId: 'chinatown', note: '12:15–12:35，不久留' },
      { time: '12:40', description: '元町・中華街 → 新高島 12:52', category: 'transit', origin: '橫濱中華街', legs: [{ via: '步行 5 分', to: '元町・中華街駅' }, { via: 'みなとみらい線', to: '新高島', arrive: '12:52' }] },
      { time: '13:10', description: 'プラネタリア YOKOHAMA', category: 'event', locationId: 'planetaria', isHighlight: true, note: '暫定場次，五天前開放後再確認' },
      { time: '13:55', description: '新高島 → 横浜 13:58', category: 'transit', note: '1 站，或走路 9 分' },
      { time: '14:05', description: '橫濱站購物', category: 'spot', locationId: 'yokohama_station', note: '85 分鐘，東西口都排得進去' },
      { time: '15:35', description: '横浜 → みなとみらい 15:39', category: 'transit', origin: '横浜', legs: [{ via: 'みなとみらい線', to: 'みなとみらい', arrive: '15:39' }] },
      { time: '15:45', description: 'MARK IS みなとみらい', category: 'spot', locationId: 'mark_is', note: '15:45–16:10。Pokémon Center、1F ACTUS' },
      { time: '16:15', description: 'JUMP SHOP ＋ SNOOPY TOWN', category: 'spot', locationId: 'landmark_queens', note: '16:15–16:55。空橋相連，不用出戶外' },
      { time: '17:00', description: 'Sky Garden 69F', category: 'spot', locationId: 'sky_garden', isHighlight: true, note: '日落約 17:28，這個時間不要動。就在ランドマークプラザ同一棟' },
      { time: '18:00', description: '地標塔 → World Porters', category: 'transit', note: '步行約 9 分', origin: '横浜ランドマークタワー', legs: [{ via: '步行 9 分', to: 'World Porters' }] },
      { time: '18:10', description: 'World Porters 3F 古著', category: 'spot', locationId: 'world_porters', note: '18:10–18:45。SPINNS VINTAGE、Mosh Pit、古着屋3peace' },
      { time: '18:50', description: 'AIR CABIN 運河公園 → 桜木町', category: 'transit', locationId: 'air_cabin', note: '單程約 5 分，順路回桜木町。走路的話約 15 分', origin: '運河公園', legs: [{ via: 'YOKOHAMA AIR CABIN', to: '桜木町', arrive: '19:00' }] },
      { time: '19:05', description: 'コレットマーレ(.st)、CIAL 桜木町(Pensta)', category: 'spot', note: '19:05–19:45。and ST 在 2F、20:00 打烊，先逛那間' },
      { time: '19:45', description: '桜木町晚餐', category: 'food', note: '～20:45' },
      { time: '20:50', description: '桜木町 → 大井町 21:25', category: 'transit', origin: '桜木町', legs: [{ via: '京浜東北線 直達', to: '大井町', arrive: '21:25' }] },
    ]
  },
  {
    date: '9/29',
    weekday: '星期二',
    title: '清澄白河散策・上野 → 成田',
    mapUrl: 'https://www.google.com/maps/dir/Oimachi+Station/Keisei+Ueno+Station/Kiyosumi+Gardens/Fukagawa+Edo+Museum/Ueno+Toshogu/Yushima+Tenmangu/Narita+Airport+Terminal+1',
    events: [
      { time: '08:40', description: '退房，行李交櫃檯', category: 'stay', locationId: 'klook_baggage', isHighlight: true, note: 'Klook 宅配收件截止 9:00，不要拖' },
      { time: '08:50', description: '大井町 → 清澄白河 09:25', category: 'transit', origin: '大井町', legs: [{ via: '京浜東北線', to: '浜松町' }, { via: '大江戸線（大門）', to: '清澄白河', arrive: '09:25' }] },
      { time: '09:30', description: '清澄庭園', category: 'spot', locationId: 'kiyosumi_garden', note: '09:30–10:25' },
      { time: '10:35', description: '江戶土產屋高橋', category: 'spot', locationId: 'takahashi', note: '10:35–11:00' },
      { time: '11:00', description: '深川釜匠 午餐', category: 'food', locationId: 'fukagawa_kamasho', isHighlight: true, note: '週二只做午市到 15:00，開店即到避開排隊' },
      { time: '12:10', description: '深川江戶資料館', category: 'spot', locationId: 'fukagawa_edo_museum', note: '12:10–13:00' },
      { time: '13:05', description: 'Cheese no Koe', category: 'food', locationId: 'cheese_no_koe', note: '13:05–13:30' },
      { time: '13:40', description: 'Babaghuri 清澄本店', category: 'spot', locationId: 'babaghuri', note: '13:40–14:05，走回清澄白河站約 5 分' },
      { time: '14:15', description: '清澄白河 → 上野広小路 14:35', category: 'transit', origin: '清澄白河', legs: [{ via: '半蔵門線', to: '三越前' }, { via: '銀座線', to: '上野広小路', arrive: '14:35' }] },
      { time: '14:40', description: 'うさぎや 買どら焼き', category: 'food', locationId: 'usagiya', note: '順路先買，避免下午賣完' },
      { time: '15:00', description: '上野東照宮 → 花園稲荷神社 → 不忍池', category: 'spot', locationId: 'ueno_toshogu', note: '15:00–15:55' },
      { time: '16:05', description: '湯島天満宮', category: 'spot', locationId: 'yushima_tenmangu', note: '16:05–16:30' },
      { time: '16:40', description: '阿美橫町、晚餐', category: 'food', locationId: 'ameyoko', note: '～17:20。走到京成上野站約 5 分' },
      { time: '17:40', description: 'Skyliner 京成上野發', category: 'transit', isHighlight: true, note: '⚠️ 最晚只能搭 18:20 那班；17:40 之後就沒車到 18:20' },
      { time: '18:27', description: '「成田空港」站下車', category: 'transit', locationId: 'flight_home', note: '終點站＝第 1 航廈。不要在空港第2ビル下車' },
      { time: '18:35', description: '4F 南翼領回行李 → 報到、託運', category: 'transit', note: '長榮關櫃約起飛前 60 分（19:40）' },
      { time: '20:40', description: 'BR195 起飛 → 桃園 23:20', category: 'transit', isHighlight: true },
    ]
  }
];
