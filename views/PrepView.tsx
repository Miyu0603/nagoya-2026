
import React, { useState } from 'react';
import { PRE_TRIP_NOTES, VOUCHERS } from '../constants';
import { ChecklistItem } from '../types';
import { CheckIcon, TrashIcon, EditIcon, PlusIcon, SheetIcon, ExternalLinkIcon, BedIcon, TrainIcon, TicketIcon } from '../components/Icons';
import { TextInputSheet, ConfirmDeleteSheet } from '../components/TextInputSheet';

interface PrepViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
  list: ChecklistItem[];
  setList: (list: ChecklistItem[]) => void;
}


export const PrepView: React.FC<PrepViewProps> = ({ checkedItems, toggleItem, list, setList }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalText, setModalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setModalMode('add'); setModalText(''); setEditingId(null); setShowModal(true);
  };
  const handleOpenEdit = (item: ChecklistItem) => {
    setModalMode('edit'); setModalText(item.text); setEditingId(item.id); setShowModal(true);
  };
  const handleSubmit = (text: string) => {
    if (modalMode === 'add') {
      setList([...list, { id: `todo_${Date.now()}`, text }]);
    } else if (editingId) {
      setList(list.map(i => i.id === editingId ? { ...i, text } : i));
    }
  };
  const confirmDelete = () => {
    if (deleteId) { setList(list.filter(i => i.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div className="pb-4 pt-4 animate-fade-in-soft space-y-9">

      {/* Travel Notes */}
      <section className="bg-ios-card border border-ios-separator shadow-ios-card rounded-ios-lg overflow-hidden">
        <div className="px-5 pt-5 pb-3.5 flex items-center gap-2.5">
          <div className="w-1 h-4 bg-mag-gold rounded-full" />
          <h3 className="text-[17px] font-semibold text-ios-label leading-none tracking-tight">旅途叮嚀</h3>
        </div>
        <div className="px-5 pb-6 space-y-4">
          {PRE_TRIP_NOTES.map((note, idx) => (
            <div key={idx} className="flex gap-3.5 items-start">
              <div className="w-6 h-6 rounded-full bg-mag-gold-light flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold font-mono text-mag-gold leading-none">{idx + 1}</span>
              </div>
              <p className="text-[14px] text-ios-label leading-relaxed flex-1 pt-0.5 tracking-tight">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vouchers */}
      {VOUCHERS.length > 0 && (
        <section>
          <div className="px-1 mb-2 flex items-center gap-2">
            <div className="w-1 h-3.5 bg-mag-gold rounded-full" />
            <h2 className="text-[13px] font-semibold text-ios-label-2">旅遊憑證</h2>
          </div>
          <div className="bg-ios-card rounded-ios-lg shadow-ios-card border border-ios-separator overflow-hidden divide-y divide-ios-separator">
            {VOUCHERS.map((voucher, idx) => (
              <a key={idx} href={voucher.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 active:bg-ios-fill-3 transition-colors">
                {voucher.type === 'hotel'
                  ? <BedIcon className="w-5 h-5 text-mag-gold shrink-0" />
                  : voucher.type === 'train'
                    ? <TrainIcon className="w-5 h-5 text-mag-gold shrink-0" />
                    : voucher.type === 'ticket'
                      ? <TicketIcon className="w-5 h-5 text-mag-gold shrink-0" />
                      : <SheetIcon className="w-5 h-5 text-mag-gold shrink-0" />
                }
                <span className="flex-1 text-[15px] font-medium text-ios-label">{voucher.name}</span>
                <ExternalLinkIcon className="w-4 h-4 text-ios-label-3 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Todo Checklist */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[13px] font-semibold text-ios-label-2 tracking-wide">待辦事項</h2>
          <button
            onClick={handleOpenAdd}
            aria-label="新增待辦"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-mag-gold active:opacity-60"
          >
            <div className="w-9 h-9 rounded-full bg-mag-gold-light flex items-center justify-center">
              <PlusIcon className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="bg-ios-card rounded-ios-lg shadow-ios-card border border-ios-separator overflow-hidden divide-y divide-ios-separator">
          {list.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <div key={item.id} className="flex items-center pl-3 pr-1">
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-label={isChecked ? '取消勾選' : '勾選'}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 active:opacity-60"
                >
                  <span className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-mag-gold border-mag-gold' : 'bg-white border-ios-separator-strong'}`}>
                    {isChecked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                  </span>
                </button>
                <span
                  onClick={() => toggleItem(item.id)}
                  className={`flex-1 text-[15px] py-3.5 leading-snug cursor-pointer select-none tracking-tight ${isChecked ? 'text-ios-label-3 line-through' : 'text-ios-label font-medium'}`}
                >
                  {item.text}
                </span>
                <button onClick={() => handleOpenEdit(item)} aria-label="編輯" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ios-label-3 active:text-mag-gold">
                  <EditIcon className="w-[18px] h-[18px]" />
                </button>
                <button onClick={() => setDeleteId(item.id)} aria-label="刪除" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ios-label-3 active:text-ios-red">
                  <TrashIcon className="w-[18px] h-[18px]" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <TextInputSheet
        open={showModal}
        mode={modalMode}
        initialText={modalText}
        title={{ add: '新增待辦事項', edit: '編輯待辦事項' }}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteSheet
        open={!!deleteId}
        title="確定要刪除此項目？"
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
