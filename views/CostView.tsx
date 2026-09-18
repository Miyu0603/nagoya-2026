
import React, { useState, useMemo } from 'react';
import { GOOGLE_SCRIPT_URL, GOOGLE_SHEET_NAME, GOOGLE_SHEET_URL } from '../constants';
import { InfoBanner } from '../components/InfoBanner';
import { SheetIcon, PlusIcon, RefreshIcon, EditIcon, TrashIcon } from '../components/Icons';
import { ExpenseRecord } from '../types';
import { Sheet } from '../components/Sheet';
import { ConfirmDeleteSheet } from '../components/TextInputSheet';

interface CostViewProps {
  expenses: ExpenseRecord[];
  isLoading: boolean;
  fetchError: string | null;
  onRefresh: () => void;
  onAddSuccess: () => void;
}

const XIANG_COLOR = '#E91E63';
const QIAN_COLOR = '#B45309'; // Yian（燒橘，白字對比 4.9:1）

type SplitType = 'equal' | 'manual';

const SPLIT_OPTIONS: { value: SplitType; label: string }[] = [
  { value: 'equal', label: '平均' },
  { value: 'manual', label: '自訂' },
];

function calcSplit(total: number, type: SplitType, manualXiang: number): { xA: number; qA: number } {
  if (type === 'equal') { const xA = total / 2; return { xA, qA: total - xA }; }
  return { xA: manualXiang, qA: total - manualXiang };
}

export const CostView: React.FC<CostViewProps> = ({ expenses, isLoading, fetchError, onRefresh, onAddSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [item, setItem] = useState('');
  const [payer, setPayer] = useState<'想想' | 'Yian'>('想想');
  const [note, setNote] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [manualXiangInput, setManualXiangInput] = useState('');
  const [manualQianInput, setManualQianInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showBatchSplitSheet, setShowBatchSplitSheet] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const totalTWD = expenses.reduce((sum, r) => sum + r.amountTwd, 0);
  const totalJPY = expenses.reduce((sum, r) => sum + r.amountJpy, 0);

  const settlement = useMemo(() => {
    let xiangPaidTwd = 0, xiangPaidJpy = 0, xiangShouldPayTwd = 0, xiangShouldPayJpy = 0;
    expenses.forEach(r => {
      if (r.payer === '想想') { xiangPaidTwd += r.amountTwd; xiangPaidJpy += r.amountJpy; }
      xiangShouldPayTwd += r.splitXiangTwd || 0;
      xiangShouldPayJpy += r.splitXiangJpy || 0;
    });
    return { twd: xiangPaidTwd - xiangShouldPayTwd, jpy: xiangPaidJpy - xiangShouldPayJpy };
  }, [expenses]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    // In manual mode: keep xiang fixed, update qian to reflect new total
    if (splitType === 'manual') {
      const total = Number(val) || 0;
      setManualQianInput(String(total - (Number(manualXiangInput) || 0)));
    }
  };

  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);
    // When switching TO manual, pre-fill with the previously computed amounts
    if (type === 'manual') {
      const total = Number(amount) || 0;
      const { xA, qA } = calcSplit(total, splitType, 0);
      setManualXiangInput(String(Math.round(xA)));
      setManualQianInput(String(Math.round(qA)));
    }
  };

  const handleManualXiangChange = (val: string) => {
    setManualXiangInput(val);
    const total = Number(amount) || 0;
    setManualQianInput(String(total - (Number(val) || 0)));
  };
  const handleManualQianChange = (val: string) => {
    setManualQianInput(val);
    const total = Number(amount) || 0;
    setManualXiangInput(String(total - (Number(val) || 0)));
  };

  const handleOpenAdd = () => {
    setMode('add'); setEditingRowIndex(null);
    const today = new Date();
    setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    setAmount(''); setItem(''); setPayer('想想'); setNote(''); setCurrency('JPY'); setSplitType('equal');
    setManualXiangInput(''); setManualQianInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, record: ExpenseRecord) => {
    e.stopPropagation(); setMode('edit'); setEditingRowIndex(record.rowIndex);
    const d = new Date(record.date);
    setDate(!isNaN(d.getTime()) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
    setItem(record.item); setPayer(record.payer); setNote(record.note || ''); setSplitType(record.splitType || 'equal');
    const amt = record.amountTwd > 0 ? record.amountTwd : record.amountJpy;
    setAmount(String(amt));
    setCurrency(record.amountTwd > 0 ? 'TWD' : 'JPY');
    const xVal = record.amountTwd > 0 ? record.splitXiangTwd : record.splitXiangJpy;
    const qVal = record.amountTwd > 0 ? record.splitQianTwd : record.splitQianJpy;
    setManualXiangInput(String(xVal));
    setManualQianInput(String(qVal));
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'delete', rowIndex: deleteConfirmId, sheetName: GOOGLE_SHEET_NAME }) });
      const result = await res.json();
      if (result.result === "success") { setDeleteConfirmId(null); onAddSuccess(); }
    } catch { console.error("刪除失敗"); } finally { setIsDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!amount || !item) return;
    setIsSubmitting(true);
    const total = Number(amount) || 0;
    const { xA, qA } = calcSplit(total, splitType, Number(manualXiangInput) || 0);
    const payload = {
      action: mode, rowIndex: editingRowIndex, date: date.replace(/-/g, '/'), item: item.trim(), payer,
      amountTwd: currency === 'TWD' ? total : 0, amountJpy: currency === 'JPY' ? total : 0, note: note.trim(), splitType,
      splitXiangTwd: currency === 'TWD' ? xA : 0, splitXiangJpy: currency === 'JPY' ? xA : 0,
      splitQianTwd: currency === 'TWD' ? qA : 0, splitQianJpy: currency === 'JPY' ? qA : 0,
      sheetName: GOOGLE_SHEET_NAME
    };
    try { await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); setShowModal(false); onAddSuccess(); }
    catch { console.error("儲存失敗"); } finally { setIsSubmitting(false); }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(v => !v);
    setSelectedRows(new Set());
  };

  const toggleRow = (rowIndex: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(rowIndex) ? next.delete(rowIndex) : next.add(rowIndex);
      return next;
    });
  };

  const handleBatchDelete = async () => {
    if (selectedRows.size === 0) return;
    setIsBatchProcessing(true);
    // Delete from highest rowIndex first to avoid row shifting
    const sorted = Array.from(selectedRows).sort((a, b) => b - a);
    try {
      for (const rowIndex of sorted) {
        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'delete', rowIndex, sheetName: GOOGLE_SHEET_NAME }) });
      }
      setSelectedRows(new Set());
      setIsSelectMode(false);
      onAddSuccess();
    } catch { console.error("批次刪除失敗"); } finally { setIsBatchProcessing(false); }
  };

  const handleBatchSplitConfirm = async () => {
    if (selectedRows.size === 0) return;
    setIsBatchProcessing(true);
    try {
      const selected = expenses.filter(r => selectedRows.has(r.rowIndex));
      for (const record of selected) {
        const total = record.amountTwd > 0 ? record.amountTwd : record.amountJpy;
        const { xA, qA } = calcSplit(total, 'equal', 0);
        const payload = {
          action: 'edit', rowIndex: record.rowIndex,
          date: record.date.replace(/-/g, '/'), item: record.item, payer: record.payer,
          amountTwd: record.amountTwd, amountJpy: record.amountJpy, note: record.note || '',
          splitType: 'equal' as SplitType,
          splitXiangTwd: record.amountTwd > 0 ? xA : 0, splitXiangJpy: record.amountJpy > 0 ? xA : 0,
          splitQianTwd: record.amountTwd > 0 ? qA : 0, splitQianJpy: record.amountJpy > 0 ? qA : 0,
          sheetName: GOOGLE_SHEET_NAME
        };
        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      }
      setShowBatchSplitSheet(false);
      setSelectedRows(new Set());
      setIsSelectMode(false);
      onAddSuccess();
    } catch { console.error("批次更新失敗"); } finally { setIsBatchProcessing(false); }
  };

  const renderSettlementItem = (amount: number, currency: 'TWD' | 'JPY') => {
    const absAmount = Math.abs(Math.round(amount));
    const symbol = currency === 'TWD' ? '$' : '¥';
    if (absAmount === 0) {
      return (
        <div className="bg-ios-fill-4 rounded-ios p-6 flex flex-col items-center">
          <div className="text-[11px] font-semibold text-ios-label-2 tracking-wide mb-2">{currency}</div>
          <div className="text-[20px] font-semibold text-ios-label-3">已結清</div>
        </div>
      );
    }
    const debtor = amount > 0 ? 'Yian' : '想想';
    const creditor = amount > 0 ? '想想' : 'Yian';
    const debtorColor = debtor === '想想' ? XIANG_COLOR : QIAN_COLOR;
    const creditorColor = creditor === '想想' ? XIANG_COLOR : QIAN_COLOR;
    return (
      <div className="bg-ios-fill-4 rounded-ios p-6 flex flex-col items-center">
        <div className="text-[11px] font-semibold text-ios-label-2 tracking-wide mb-3">{currency}</div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[15px] font-semibold" style={{ color: debtorColor }}>{debtor}</span>
          <span className="text-ios-label-3">→</span>
          <span className="text-[15px] font-semibold" style={{ color: creditorColor }}>{creditor}</span>
        </div>
        <div className="text-[28px] font-mono font-bold text-ios-label">
          {symbol}{absAmount.toLocaleString()}
        </div>
      </div>
    );
  };

  const isConfigured = Boolean(GOOGLE_SCRIPT_URL);

  return (
    <div className="pb-4 pt-4 animate-fade-in-soft">
      {!isConfigured && (
        <div className="mb-5">
          <InfoBanner variant="warning">
            記帳服務尚未設定。請在 <span className="font-mono">.env</span> 填入 <span className="font-mono">VITE_GOOGLE_SCRIPT_URL</span>，並確認試算表分頁名稱為「{GOOGLE_SHEET_NAME}」。
          </InfoBanner>
        </div>
      )}
      {isConfigured && fetchError && (
        <div className="mb-5">
          <InfoBanner variant="danger">
            讀取消費紀錄失敗：{fetchError}。請確認網路連線後再試一次。
          </InfoBanner>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-ios-card border border-ios-separator rounded-ios-lg overflow-hidden mb-7 shadow-ios-card">
        <div className="px-5 py-3.5 flex justify-between items-center border-b border-ios-separator">
          <h2 className="text-[17px] font-semibold text-ios-label tracking-tight">旅費總覽</h2>
          <button onClick={onRefresh} aria-label="重新整理" className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-ios-label-2 active:text-ios-label">
            <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-ios-separator border-b border-ios-separator">
          <div className="p-4 text-center">
            <div className="text-[11px] font-semibold text-ios-label-2 mb-1">JPY</div>
            <div className="text-[24px] font-bold text-ios-label font-mono leading-none">¥{totalJPY.toLocaleString()}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[11px] font-semibold text-ios-label-2 mb-1">TWD</div>
            <div className="text-[24px] font-bold text-ios-label font-mono leading-none">${totalTWD.toLocaleString()}</div>
          </div>
        </div>
        <button onClick={() => setShowSettlement(true)} className="w-full bg-mag-gold text-white py-3.5 font-semibold text-[15px] flex items-center justify-center gap-2 active:opacity-80 transition-opacity">
          結算精算
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-[17px] font-semibold text-ios-label tracking-tight">支出明細</h3>
        <div className="flex items-center gap-2">
          <button onClick={toggleSelectMode} className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-colors ${isSelectMode ? 'bg-ios-fill-3 text-ios-label' : 'text-mag-gold'}`}>
            {isSelectMode ? '取消' : '選取'}
          </button>
          {!isSelectMode && (
            <button onClick={handleOpenAdd} aria-label="新增消費" className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-mag-gold active:opacity-60">
              <div className="w-9 h-9 rounded-full bg-mag-gold-light flex items-center justify-center">
                <PlusIcon className="w-5 h-5" />
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 && !isLoading && (
          <div className="text-center py-14 text-ios-label-3 font-medium border border-dashed border-ios-separator-strong rounded-ios-lg bg-ios-card">尚無支出明細</div>
        )}
        {isLoading && expenses.length === 0 && (
          // Skeleton rows
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-ios-card rounded-ios border border-ios-separator p-4 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-10 h-4 bg-ios-fill-3 rounded" />
                <div className="flex-1 h-4 bg-ios-fill-3 rounded" />
                <div className="w-16 h-5 bg-ios-fill-3 rounded" />
              </div>
              <div className="mt-2 w-20 h-3 bg-ios-fill-4 rounded" />
            </div>
          ))
        )}
        {expenses.map((record) => (
          <div
            key={record.rowIndex}
            className={`bg-ios-card p-3.5 rounded-ios border shadow-ios-card flex items-center gap-2 overflow-hidden transition-colors ${isSelectMode ? 'cursor-pointer' : 'active:bg-ios-fill-4'} ${selectedRows.has(record.rowIndex) ? 'border-mag-gold bg-[#FDF6E3]' : 'border-ios-separator'}`}
            onClick={(e) => isSelectMode ? toggleRow(record.rowIndex) : handleOpenEdit(e, record)}
          >
            {isSelectMode && (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedRows.has(record.rowIndex) ? 'bg-mag-gold border-mag-gold' : 'border-ios-label-3'}`}>
                {selectedRows.has(record.rowIndex) && (
                  <svg viewBox="0 0 12 10" className="w-3 h-3 fill-white"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="shrink-0 px-2 py-0.5 text-[10px] font-semibold text-white rounded-full"
                  style={{ backgroundColor: record.payer === '想想' ? XIANG_COLOR : QIAN_COLOR }}
                >
                  {record.payer}
                </span>
                <span className="text-[15px] font-semibold text-ios-label truncate">{record.item}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-ios-label-2">{record.date.split('T')[0].replace(/-/g, '/')}</span>
                {record.splitType === 'manual' && (
                  <span className="bg-[#FFF4D6] text-[#946800] text-[9px] px-1.5 py-0.5 font-semibold rounded shrink-0">手動分帳</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-[17px] font-bold text-ios-label font-mono whitespace-nowrap">
                {record.amountJpy > 0 ? `¥${record.amountJpy.toLocaleString()}` : `$${record.amountTwd.toLocaleString()}`}
              </div>
              {!isSelectMode && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(record.rowIndex); }}
                  aria-label="刪除"
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center text-ios-label-3 active:text-ios-red"
                >
                  <TrashIcon className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        {GOOGLE_SHEET_URL && (
        <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ios-label-2 font-medium text-[12px] active:text-mag-gold">
          <SheetIcon className="w-4 h-4" /> 開啟 Google Sheet
        </a>
        )}
      </div>

      {/* Batch action bar */}
      {isSelectMode && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] left-0 right-0 z-20 flex justify-center px-6">
          <div className="max-w-xl w-full bg-white border border-ios-separator rounded-ios-lg shadow-float flex gap-3 p-3">
            <div className="flex-1 text-center text-[13px] font-semibold text-ios-label-2 self-center">
              {selectedRows.size > 0 ? `已選 ${selectedRows.size} 項` : '請點選項目'}
            </div>
            <button
              disabled={selectedRows.size === 0 || isBatchProcessing}
              onClick={() => setShowBatchSplitSheet(true)}
              className="px-4 py-2 bg-ios-fill-3 text-ios-label text-[13px] font-semibold rounded-ios disabled:opacity-40"
            >
              改平均分帳
            </button>
            <button
              disabled={selectedRows.size === 0 || isBatchProcessing}
              onClick={handleBatchDelete}
              className="px-4 py-2 bg-ios-red text-white text-[13px] font-semibold rounded-ios disabled:opacity-40"
            >
              {isBatchProcessing ? '處理中...' : '刪除'}
            </button>
          </div>
        </div>
      )}

      {/* Settlement Sheet */}
      <Sheet open={showSettlement} onClose={() => setShowSettlement(false)} title="結算面板">
        <div className="px-5 pb-5 space-y-3">
          {renderSettlementItem(settlement.twd, 'TWD')}
          {renderSettlementItem(settlement.jpy, 'JPY')}
          <p className="pt-2 text-[12px] text-ios-label-2 text-center leading-relaxed">
            結算金額由雙方支付總額與應付份額計算所得。<br />箭頭指向為應支付對象。
          </p>
        </div>
      </Sheet>

      {/* Add / Edit Sheet */}
      <Sheet open={showModal} onClose={() => setShowModal(false)} title={mode === 'edit' ? '編輯消費' : '新增消費'}>
        <form onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="flex flex-col min-w-0">
              <label className="text-[12px] font-semibold text-ios-label-2 mb-1.5 block">日期</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full min-w-0 bg-ios-fill-4 px-3 py-2.5 rounded-ios text-[15px] font-medium text-ios-label outline-none" />
            </div>
            <div className="flex flex-col min-w-0">
              <label className="text-[12px] font-semibold text-ios-label-2 mb-1.5 block">支付者</label>
              <div className="flex bg-ios-fill-3 p-[3px] rounded-ios">
                <button type="button" onClick={() => setPayer('想想')}
                  className="flex-1 py-2.5 text-[13px] font-semibold rounded-tk-sm transition-all"
                  style={payer === '想想' ? { backgroundColor: XIANG_COLOR, color: '#fff' } : { color: '#3C3C43' }}>想想</button>
                <button type="button" onClick={() => setPayer('Yian')}
                  className="flex-1 py-2.5 text-[13px] font-semibold rounded-tk-sm transition-all"
                  style={payer === 'Yian' ? { backgroundColor: QIAN_COLOR, color: '#fff' } : { color: '#3C3C43' }}>Yian</button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ios-label-2 mb-1.5 block">內容</label>
            <input type="text" placeholder="輸入消費內容" value={item} onChange={e => setItem(e.target.value)}
              className="w-full bg-ios-fill-4 px-3 py-2.5 rounded-ios text-[15px] font-medium text-ios-label outline-none placeholder:text-ios-label-3" />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ios-label-2 mb-1.5 block">金額</label>
            <div className="flex bg-ios-fill-4 items-center rounded-ios px-3 h-[56px] gap-2">
              <input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={e => handleAmountChange(e.target.value)}
                className="flex-1 min-w-0 bg-transparent py-2 font-bold text-[24px] outline-none text-ios-label placeholder:text-ios-label-3" />
              <div className="flex bg-white border border-ios-separator overflow-hidden rounded-ios-sm shrink-0">
                <button type="button" onClick={() => setCurrency('JPY')} className={`px-3 py-1.5 text-[11px] font-semibold ${currency === 'JPY' ? 'bg-mag-gold text-white' : 'text-ios-label-2'}`}>JPY</button>
                <button type="button" onClick={() => setCurrency('TWD')} className={`px-3 py-1.5 text-[11px] font-semibold ${currency === 'TWD' ? 'bg-mag-gold text-white' : 'text-ios-label-2'}`}>TWD</button>
              </div>
            </div>
          </div>

          <div className="bg-ios-fill-4 rounded-ios p-3 space-y-2.5">
            <label className="text-[13px] font-semibold text-ios-label block mb-1">分帳模式</label>
            <div className="flex rounded-ios-sm overflow-hidden border border-ios-separator">
              {SPLIT_OPTIONS.map((opt, i) => (
                <label
                  key={opt.value}
                  className={`flex-1 text-center cursor-pointer ${i > 0 ? 'border-l border-ios-separator' : ''}`}
                >
                  <input
                    type="radio"
                    name="splitType"
                    value={opt.value}
                    checked={splitType === opt.value}
                    onChange={() => handleSplitTypeChange(opt.value)}
                    className="sr-only"
                  />
                  <span className={`block py-2.5 text-[12px] font-semibold select-none ${splitType === opt.value ? 'bg-mag-gold text-white' : 'bg-white text-ios-label-2'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="h-px bg-ios-separator" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold mb-1 block" style={{ color: XIANG_COLOR }}>想想負擔</label>
                <input type="number" inputMode="decimal" disabled={splitType !== 'manual'}
                  value={splitType === 'manual' ? manualXiangInput : (calcSplit(Number(amount) || 0, splitType, 0).xA || 0)}
                  onChange={e => handleManualXiangChange(e.target.value)}
                  className={`w-full bg-white px-2.5 py-2 text-[15px] font-mono font-bold border border-ios-separator rounded-ios-sm outline-none ${splitType !== 'manual' ? 'opacity-60' : ''}`} />
              </div>
              <div>
                <label className="text-[10px] font-semibold mb-1 block" style={{ color: QIAN_COLOR }}>Yian 負擔</label>
                <input type="number" inputMode="decimal" disabled={splitType !== 'manual'}
                  value={splitType === 'manual' ? manualQianInput : (calcSplit(Number(amount) || 0, splitType, 0).qA || 0)}
                  onChange={e => handleManualQianChange(e.target.value)}
                  className={`w-full bg-white px-2.5 py-2 text-[15px] font-mono font-bold border border-ios-separator rounded-ios-sm outline-none ${splitType !== 'manual' ? 'opacity-60' : ''}`} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ios-label-2 mb-1.5 block">備註</label>
            <input type="text" placeholder="選填項目細節" value={note} onChange={e => setNote(e.target.value)}
              className="w-full bg-ios-fill-4 px-3 py-2.5 rounded-ios text-[14px] font-medium text-ios-label outline-none placeholder:text-ios-label-3" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-ios-fill-3 rounded-ios font-semibold text-[15px] text-ios-label active:opacity-60">取消</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-mag-gold text-white rounded-ios font-semibold text-[15px] active:opacity-80">{isSubmitting ? '儲存中...' : '儲存項目'}</button>
          </div>
        </form>
      </Sheet>

      {/* Batch split type sheet */}
      <Sheet open={showBatchSplitSheet} onClose={() => setShowBatchSplitSheet(false)} title="批次改成平均分攤">
        <div className="px-5 pb-5 space-y-4">
          <p className="text-[13px] text-ios-label-2">將已選的 {selectedRows.size} 筆改成平均分攤，各筆依自己的金額重新計算。</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowBatchSplitSheet(false)} className="flex-1 py-3.5 bg-ios-fill-3 rounded-ios font-semibold text-[15px] text-ios-label">取消</button>
            <button type="button" disabled={isBatchProcessing} onClick={handleBatchSplitConfirm} className="flex-1 py-3.5 bg-mag-gold text-white rounded-ios font-semibold text-[15px] disabled:opacity-60">
              {isBatchProcessing ? '更新中...' : '套用'}
            </button>
          </div>
        </div>
      </Sheet>

      <ConfirmDeleteSheet
        open={!!deleteConfirmId}
        title="確定要刪除此項目？"
        isProcessing={isDeleting}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
