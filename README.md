# 秋の名古屋と最高イルマ 2026

名古屋・東京・橫濱 2026.09.23–29 的行程 App（React + Vite + Tailwind，iOS PWA）。

## 本地開發

```bash
npm install
npm run dev
```

環境變數放在 `.env`（不進版控）：

```env
VITE_GOOGLE_SCRIPT_URL=...   # 記帳用 GAS 的 /exec 網址
VITE_GOOGLE_SHEET_NAME=2026名古屋
VITE_GOOGLE_SHEET_URL=...    # 試算表連結（記帳頁底部的「開啟試算表」）
```

`VITE_GOOGLE_SCRIPT_URL` 沒填時，記帳頁會顯示「尚未設定」的提示，不會靜默失敗。

## GitHub Pages 部署

推上 `main` 就會由 GitHub Actions 自動編譯部署到 `https://<帳號>.github.io/nagoya-2026/`。

1. Repo 名稱要是 **nagoya-2026**（對應 `vite.config.ts` 的 `base` 與 `manifest.json` 的 `scope`）。
2. **Settings → Secrets and variables → Actions** 加入：
   - `VITE_GOOGLE_SCRIPT_URL`
   - `VITE_GOOGLE_SHEET_NAME`
   - `VITE_GOOGLE_SHEET_URL`
3. **Settings → Pages → Source** 設為 **GitHub Actions**。

## 紙本行程表

```bash
npm run build:docx
```

從 `constants.ts` 生成 `日本行程表-2026.09.23-29.docx`（舊檔會自動備份，備份不進版控）。
行程資料只有 `constants.ts` 一份，App 與這份 Word 都從它生成，不會出現改了 App 但文件還是舊的。

文件結構：每天一頁的四欄表格（時間／★○／行程／備註），備註欄會把轉乘各段與備選班次攤開；
表格後面的「今日要點」只收有營業時間、或描述裡帶警語的景點，不是把景點說明整段倒出來。
最後一頁是待確認清單、旅途叮嚀、緊急聯絡與憑證連結。

腳本副檔名是 `.cjs`——`package.json` 設了 `type: module`，`.js` 會被當 ESM，`require` 會失敗。

## 換行程時要改的地方

| 項目 | 位置 |
|---|---|
| 行程時間軸、景點詳情 | `constants.ts` |
| 旅遊憑證連結 | `constants.ts` 的 `VOUCHERS` |
| 天氣城市切換 | `constants.ts` 的 `WEATHER_SPOTS` |
| localStorage 重置 | `App.tsx` 的 `TRIP_KEY` |
| 主色 | `index.html` 的 `mag-gold` |
| 內建清單推到裝置 | `App.tsx` 的 `SEED_VERSION` |
| 紙本行程表 | `npm run build:docx` |
