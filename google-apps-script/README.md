# 記帳後端設定

App 的「記帳」分頁透過一支 Google Apps Script 讀寫試算表。
這支 script 綁在試算表上，**複製試算表不會連部署一起複製**，所以換行程要重新部署一次。

## 步驟

1. 打開這趟的試算表 → **擴充功能 → Apps Script**
   （一定要從試算表裡開，這樣才是容器繫結指令碼，`getActiveSpreadsheet()` 才抓得到檔案）
2. 把 `Code.gs` 整份貼進去，存檔
3. **部署 → 新增部署作業 → 類型選「網頁應用程式」**
   - 執行身分：**我**
   - 誰可以存取：**所有人**
4. 複製結尾是 `/exec` 的網址
5. 填進專案根目錄的 `.env`：

   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   VITE_GOOGLE_SHEET_NAME=2026名古屋
   ```

6. GitHub Actions 也要同樣三個 secret（見專案 README）

## 核對欄位順序

`Code.gs` 預設分頁長這樣，**第 1 列標題、第 2 列欄位名、第 3 列起是資料**：

| 欄 | A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 內容 | 日期 | 項目 | 付款人 | 台幣 | 日幣 | 備註 | 分帳方式 | 想想台幣 | 想想日幣 | Yian台幣 | Yian日幣 |

部署完可以直接在瀏覽器打開下面這個網址核對，它會回傳分頁清單與前 3 列原始內容：

```
<你的 /exec 網址>?sheetName=2026名古屋&action=inspect
```

欄位順序如果跟上表不同，改 `Code.gs` 最上面的 `COL` 常數就好（1 = A 欄），不用動 App。

## 前端契約

| 動作 | 請求 | 回應 |
|---|---|---|
| 讀取 | `GET ?sheetName=<分頁>` | `{ data: [...] }` |
| 核對 | `GET ?sheetName=<分頁>&action=inspect` | 分頁清單 + 前 3 列 |
| 新增 | `POST {action:'add', ...}` | `{ result:'success' }` |
| 修改 | `POST {action:'edit', rowIndex, ...}` | `{ result:'success' }` |
| 刪除 | `POST {action:'delete', rowIndex}` | `{ result:'success' }` |

POST 的 `Content-Type` 是 `text/plain`，這是為了避開 CORS preflight——Apps Script 不會回應 OPTIONS。

讀取回來的金額欄位叫 `twd` / `jpy`，寫入時卻叫 `amountTwd` / `amountJpy`，這是九州版留下的不對稱，`Code.gs` 兩邊都照做了，不要「順手統一」。
