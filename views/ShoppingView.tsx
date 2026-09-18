
import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon, CheckIcon, ShoppingIcon } from '../components/Icons';
import { TextInputSheet, ConfirmDeleteSheet } from '../components/TextInputSheet';

interface ShoppingViewProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ items, setItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalText, setModalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenAdd = () => { setModalMode('add'); setModalText(''); setEditingId(null); setShowModal(true); };
  const handleOpenEdit = (item: ShoppingItem) => { setModalMode('edit'); setModalText(item.text); setEditingId(item.id); setShowModal(true); };
  const handleSubmit = (text: string) => {
    if (modalMode === 'add') {
      setItems(prev => [{ id: Date.now().toString(), text, isCompleted: false }, ...prev]);
    } else if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, text } : i));
    }
  };
  const handleToggle = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i));
  };
  const confirmDelete = () => { if (deleteId) { setItems(prev => prev.filter(i => i.id !== deleteId)); setDeleteId(null); } };

  return (
    <div className="pb-4 pt-4 animate-fade-in-soft">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-ios-title2 font-bold text-ios-label tracking-tight">購物清單</h2>
        <button
          onClick={handleOpenAdd}
          aria-label="新增購物項目"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-mag-gold active:opacity-60"
        >
          <div className="w-9 h-9 rounded-full bg-mag-gold-light flex items-center justify-center">
            <PlusIcon className="w-5 h-5" />
          </div>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-ios-card rounded-ios-lg border border-dashed border-ios-separator-strong">
          <div className="w-16 h-16 mx-auto rounded-full bg-ios-fill-3 flex items-center justify-center mb-3">
            <ShoppingIcon className="w-7 h-7 text-ios-label-3" />
          </div>
          <p className="text-[15px] font-semibold text-ios-label-2">目前清單為空</p>
          <p className="text-[12px] text-ios-label-3 mt-1">點右上「+」加入想買的東西</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`bg-ios-card rounded-ios border border-ios-separator px-2 flex items-center transition-all ${item.isCompleted ? 'opacity-55' : 'shadow-ios-card'}`}
            >
              <button
                onClick={() => handleToggle(item.id)}
                aria-label={item.isCompleted ? '標記未完成' : '標記完成'}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 active:opacity-60"
              >
                <span className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${item.isCompleted ? 'bg-mag-gold border-mag-gold' : 'bg-white border-ios-separator-strong'}`}>
                  {item.isCompleted && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </span>
              </button>
              <span
                onClick={() => handleToggle(item.id)}
                className={`flex-1 text-[16px] py-3.5 leading-snug cursor-pointer select-none tracking-tight ${item.isCompleted ? 'text-ios-label-3 line-through' : 'text-ios-label font-semibold'}`}
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
          ))}
        </div>
      )}

      <TextInputSheet
        open={showModal}
        mode={modalMode}
        initialText={modalText}
        title={{ add: '新增購物項目', edit: '編輯購物項目' }}
        placeholder="想要買什麼..."
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
