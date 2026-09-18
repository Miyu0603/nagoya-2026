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

## 換行程時要改的地方

| 項目 | 位置 |
|---|---|
| 行程時間軸、景點詳情 | `constants.ts` |
| 旅遊憑證連結 | `constants.ts` 的 `VOUCHERS` |
| 天氣城市切換 | `constants.ts` 的 `WEATHER_SPOTS` |
| localStorage 重置 | `App.tsx` 的 `TRIP_KEY` |
| 主色 | `index.html` 的 `mag-gold` |
