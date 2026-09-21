import { GOOGLE_SCRIPT_URL, GOOGLE_SHEET_NAME } from '../constants';

/**
 * 記帳後端的唯一進出口。
 *
 * 網站是靜態的公開頁面，/exec 網址一定會出現在 bundle 裡，
 * 所以密鑰「不能」寫死在程式碼——寫死等於沒鎖。
 * 改成每台裝置輸入一次，存在自己的 localStorage：
 * bundle 裡沒有鑰匙，別人打開網頁只會看到解鎖畫面。
 */

const ACCESS_KEY_STORAGE = 'expense_access_key';

/** GAS 一律回 HTTP 200，驗證失敗只能從 body 判斷 */
export class UnauthorizedError extends Error {
  constructor() {
    super('存取密鑰不正確');
    this.name = 'UnauthorizedError';
  }
}

export const getAccessKey = (): string => {
  try {
    return localStorage.getItem(ACCESS_KEY_STORAGE) ?? '';
  } catch {
    return ''; // 無痕模式讀不到，當成未解鎖
  }
};

export const setAccessKey = (key: string): void => {
  try {
    localStorage.setItem(ACCESS_KEY_STORAGE, key.trim());
  } catch (e) {
    console.error('存不了存取密鑰', e);
  }
};

export const clearAccessKey = (): void => {
  try {
    localStorage.removeItem(ACCESS_KEY_STORAGE);
  } catch (e) {
    console.error('清不掉存取密鑰', e);
  }
};

/**
 * 從網址 #key=... 收下密鑰並存起來，然後把 hash 清掉。
 * 這樣分享解鎖連結給對方就好，不用口述一串字。
 */
export const consumeKeyFromUrl = (): void => {
  const match = window.location.hash.match(/(?:^#|&)key=([^&]+)/);
  if (!match) return;
  setAccessKey(decodeURIComponent(match[1]));
  history.replaceState(null, '', window.location.pathname + window.location.search);
};

const assertAuthorized = (payload: any) => {
  if (payload && payload.error === 'unauthorized') throw new UnauthorizedError();
  return payload;
};

export const fetchExpenseRows = async (): Promise<any[]> => {
  const params = new URLSearchParams({
    t: String(Date.now()), // 避開快取
    sheetName: GOOGLE_SHEET_NAME,
    key: getAccessKey(),
  });
  const res = await fetch(`${GOOGLE_SCRIPT_URL}?${params}`);
  if (!res.ok) throw new Error(`伺服器回應 ${res.status}`);
  const payload = assertAuthorized(await res.json());
  return payload.data ?? [];
};

/** 新增／編輯／刪除共用；密鑰與分頁名在這裡補上，呼叫端不用記 */
export const postExpense = async (
  payload: Record<string, unknown>
): Promise<void> => {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    // text/plain 才不會觸發 CORS preflight，GAS 不回 preflight
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, sheetName: GOOGLE_SHEET_NAME, key: getAccessKey() }),
  });
  if (!res.ok) throw new Error(`伺服器回應 ${res.status}`);
  assertAuthorized(await res.json().catch(() => null));
};
