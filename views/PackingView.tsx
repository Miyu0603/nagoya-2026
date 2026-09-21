
import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { CheckIcon, TrashIcon, EditIcon, PlusIcon } from '../components/Icons';
import { TextInputSheet, ConfirmDeleteSheet } from '../components/TextInputSheet';
import { InfoBanner } from '../components/InfoBanner';

interface PackingViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
  carryOnList: ChecklistItem[];
  setCarryOnList: (list: ChecklistItem[]) => void;
  checkedBagList: ChecklistItem[];
  setCheckedBagList: (list: ChecklistItem[]) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({
  checkedItems, toggleItem, carryOnList, setCarryOnList, checkedBagList, setCheckedBagList
}) => {
  const [activeSegment, setActiveSegment] = useState<'carry-on' | 'checked'>('carry-on');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalText, setModalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeList = activeSegment === 'carry-on' ? carryOnList : checkedBagList;
  const setList = activeSegment === 'carry-on' ? setCarryOnList : setCheckedBagList;

  const handleOpenAdd = () => { setModalMode('add'); setModalText(''); setEditingId(null); setShowModal(true); };
  const handleOpenEdit = (item: ChecklistItem) => { setModalMode('edit'); setModalText(item.text); setEditingId(item.id); setShowModal(true); };
  const handleSubmit = (text: string) => {
    if (modalMode === 'add') setList([...activeList, { id: `pack_${Date.now()}`, text }]);
    else if (editingId) setList(activeList.map(i => i.id === editingId ? { ...i, text } : i));
  };
  const confirmDelete = () => { if (deleteId) { setList(activeList.filter(i => i.id !== deleteId)); setDeleteId(null); } };

  return (
    <div className="pb-4 pt-4 animate-fade-in-soft">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-ios-title2 font-bold text-ios-label tracking-tight">行李清單</h2>
        <button
          onClick={handleOpenAdd}
          aria-label="新增項目"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-mag-gold active:opacity-60"
        >
          <div className="w-9 h-9 rounded-full bg-mag-gold-light flex items-center justify-center">
            <PlusIcon className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* iOS Segmented Control */}
      <div className="flex bg-ios-fill-3 p-[3px] rounded-ios mb-5">
        {(['carry-on', 'checked'] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`flex-1 py-2 text-[14px] font-semibold rounded-[11px] transition-all tracking-tight ${activeSegment === seg ? 'bg-white text-ios-label shadow-soft' : 'text-ios-label-2'}`}
          >
            {seg === 'carry-on' ? '隨身行李' : '托運行李'}
          </button>
        ))}
      </div>

      <div className="mb-5">
        {activeSegment === 'carry-on' ? (
          <InfoBanner variant="warning">液體容器限 100ml 以內，且需裝入透明夾鏈袋</InfoBanner>
        ) : (
          <InfoBanner variant="danger">嚴禁攜帶行動電源、鋰電池於托運行李</InfoBanner>
        )}
      </div>

      <div className="bg-ios-card rounded-ios-lg shadow-ios-card border border-ios-separator overflow-hidden divide-y divide-ios-separator">
        {activeList.map((item) => {
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

      <TextInputSheet
        open={showModal}
        mode={modalMode}
        initialText={modalText}
        title={{
          add: `新增${activeSegment === 'carry-on' ? '隨身' : '托運'}項目`,
          edit: '編輯行李項目',
        }}
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
