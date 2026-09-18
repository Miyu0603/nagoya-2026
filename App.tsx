
import React, { useState, useEffect } from 'react';
import { Tab, ShoppingItem, ExpenseRecord, ChecklistItem } from './types';
import { LOCATION_DETAILS, GOOGLE_SCRIPT_URL, GOOGLE_SHEET_NAME, TODO_LIST, PACKING_CARRY_ON, PACKING_CHECKED, WEATHER_SPOTS } from './constants';
import { ItineraryView } from './views/ItineraryView';
import { PrepView } from './views/PrepView';
import { PackingView } from './views/PackingView';
import { DetailView } from './views/DetailView';
import { InfoView } from './views/InfoView';
import { ShoppingView } from './views/ShoppingView';
import { CostView } from './views/CostView';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';

// 換行程、或行前清單內容整份改寫時都要 bump，否則裝置上的舊清單會一直留著
const TRIP_KEY = 'nagoya-2026-r2';

function getTripStorage<T>(key: string, fallback: T): T {
  try {
    const tripKey = localStorage.getItem('trip_key');
    if (tripKey !== TRIP_KEY) {
      // New trip — wipe all old data
      ['checked_items', 'dynamic_todo_list', 'dynamic_carryon_list', 'dynamic_checkedbag_list', 'shopping_list'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('trip_key', TRIP_KEY);
      return fallback;
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) { return fallback; }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ITINERARY);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = getTripStorage<string[] | null>('checked_items', null);
      if (saved) return new Set(saved);
    } catch (e) { console.error(e); }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem('checked_items', JSON.stringify(Array.from(checkedItems)));
    } catch (e) { console.error(e); }
  }, [checkedItems]);

  const [todoList, setTodoList] = useState<ChecklistItem[]>(() =>
    getTripStorage('dynamic_todo_list', TODO_LIST)
  );

  const [carryOnList, setCarryOnList] = useState<ChecklistItem[]>(() =>
    getTripStorage('dynamic_carryon_list', PACKING_CARRY_ON)
  );

  const [checkedBagList, setCheckedBagList] = useState<ChecklistItem[]>(() =>
    getTripStorage('dynamic_checkedbag_list', PACKING_CHECKED)
  );

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() =>
    getTripStorage('shopping_list', [])
  );

  useEffect(() => { localStorage.setItem('dynamic_todo_list', JSON.stringify(todoList)); }, [todoList]);
  useEffect(() => { localStorage.setItem('dynamic_carryon_list', JSON.stringify(carryOnList)); }, [carryOnList]);
  useEffect(() => { localStorage.setItem('dynamic_checkedbag_list', JSON.stringify(checkedBagList)); }, [checkedBagList]);
  useEffect(() => { localStorage.setItem('shopping_list', JSON.stringify(shoppingList)); }, [shoppingList]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isExpensesLoading, setIsExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ temp: number; code: number; label: string } | null>(null);

  useEffect(() => {
    // Scroll the main content area back to top on tab switch
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    // 行程橫跨名古屋→東京→橫濱，天氣依當天日期切換城市
    const today = new Date().toISOString().slice(0, 10);
    const spot = WEATHER_SPOTS.find(s => today <= s.untilDate) ?? WEATHER_SPOTS[0];

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${spot.latitude}&longitude=${spot.longitude}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
        );
        const data = await res.json();
        if (data.current) setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code, label: spot.label });
      } catch (e) { console.error(e); }
    };
    fetchWeather();
  }, []);

  const fetchExpenses = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsExpensesLoading(true);
    setExpensesError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}&sheetName=${encodeURIComponent(GOOGLE_SHEET_NAME)}`);
      const json = await response.json();
      if (json.status === 'error' || json.result === 'error') throw new Error(json.message);

      const parsedData: ExpenseRecord[] = (json.data || [])
        .map((row: any) => ({
          rowIndex: Number(row.rowIndex),
          date: row.date,
          item: row.item,
          payer: row.payer,
          amountTwd: Number(String(row.twd || 0).replace(/[^0-9.-]/g, '')),
          amountJpy: Number(String(row.jpy || 0).replace(/[^0-9.-]/g, '')),
          note: row.note,
          splitType: (() => {
            if (row.splitType === 'equal' || row.splitType === 'manual') return row.splitType as 'equal' | 'manual';
            // 舊資料可能存過已移除的 65:35；金額欄是實際負擔額，當成自訂就好
            if (row.splitType === 'split65') return 'manual';
            // 沒存 splitType 的舊紀錄：從兩人負擔金額反推
            const xT = Number(row.splitXiangTwd || 0); const qT = Number(row.splitQianTwd || 0);
            const xJ = Number(row.splitXiangJpy || 0); const qJ = Number(row.splitQianJpy || 0);
            const total = (xT + qT) || (xJ + qJ);
            if (total <= 0) return 'equal';
            const xFrac = (xT || xJ) / total;
            return Math.abs(xFrac - 0.5) < 0.02 ? 'equal' : 'manual';
          })(),
          splitXiangTwd: Number(row.splitXiangTwd || 0),
          splitXiangJpy: Number(row.splitXiangJpy || 0),
          splitQianTwd: Number(row.splitQianTwd || 0),
          splitQianJpy: Number(row.splitQianJpy || 0)
        }))
        .filter((r: any) => r.rowIndex >= 3 && !r.date.includes('日期'));

      parsedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.rowIndex - a.rowIndex);
      setExpenses(parsedData);
    } catch (err: any) { setExpensesError(err.message || "讀取失敗"); }
    finally { setIsExpensesLoading(false); }
  };

  useEffect(() => { if (activeTab === Tab.COST && expenses.length === 0) fetchExpenses(); }, [activeTab]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col overflow-hidden font-sans text-ink bg-washi-white" style={{ height: 'var(--app-height, 100dvh)' }}>
      {selectedLocationId && LOCATION_DETAILS[selectedLocationId] && (
        <div className="absolute inset-0 z-50">
          <DetailView location={LOCATION_DETAILS[selectedLocationId]} onBack={() => setSelectedLocationId(null)} />
        </div>
      )}

      <Header weather={weather} />

      <main
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-washi-white"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {activeTab === Tab.ITINERARY && (
          <ItineraryView
            onNavigateToDetail={setSelectedLocationId}
            selectedDateIdx={selectedDateIdx}
            setSelectedDateIdx={setSelectedDateIdx}
          />
        )}
        {activeTab !== Tab.ITINERARY && (
          <div className="px-4">
            {activeTab === Tab.PREP && (
              <PrepView checkedItems={checkedItems} toggleItem={toggleItem} list={todoList} setList={setTodoList} />
            )}
            {activeTab === Tab.PACKING && (
              <PackingView
                checkedItems={checkedItems}
                toggleItem={toggleItem}
                carryOnList={carryOnList}
                setCarryOnList={setCarryOnList}
                checkedBagList={checkedBagList}
                setCheckedBagList={setCheckedBagList}
              />
            )}
            {activeTab === Tab.SHOPPING && (
              <ShoppingView items={shoppingList} setItems={setShoppingList} />
            )}
            {activeTab === Tab.COST && (
              <CostView expenses={expenses} isLoading={isExpensesLoading} fetchError={expensesError} onRefresh={fetchExpenses} onAddSuccess={fetchExpenses} />
            )}
            {activeTab === Tab.INFO && (
              <InfoView />
            )}
          </div>
        )}
      </main>

      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
