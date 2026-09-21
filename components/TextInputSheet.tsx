import React from 'react';
import { Sheet } from './Sheet';

interface TextInputSheetProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialText: string;
  title: { add: string; edit: string };
  placeholder?: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

/**
 * Shared bottom-sheet for simple add/edit-text flows used by
 * PrepView, PackingView, and ShoppingView.
 */
export const TextInputSheet: React.FC<TextInputSheetProps> = ({
  open, mode, initialText, title, placeholder, onClose, onSubmit,
}) => {
  const [text, setText] = React.useState(initialText);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setText(initialText);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialText]);

  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={mode === 'add' ? title.add : title.edit}>
      <div className="px-5 pb-5 pt-1">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || '輸入內容...'}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          className="w-full bg-ios-fill-4 rounded-ios px-4 py-3.5 text-[16px] font-medium text-ios-label outline-none placeholder:text-ios-label-3 focus:bg-white focus:ring-2 focus:ring-mag-gold/40 transition-all"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-ios-fill-3 text-ios-label rounded-ios font-semibold text-[15px] active:opacity-60 transition-opacity"
          >
            取消
          </button>
          <button
            onClick={submit}
            className="flex-1 py-3.5 bg-mag-gold text-white rounded-ios font-semibold text-[15px] active:opacity-80 transition-opacity"
          >
            {mode === 'add' ? '新增' : '儲存'}
          </button>
        </div>
      </div>
    </Sheet>
  );
};

interface ConfirmDeleteSheetProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  isProcessing?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteSheet: React.FC<ConfirmDeleteSheetProps> = ({
  open, title = '確定要刪除？', message, confirmText = '刪除', isProcessing, onClose, onConfirm,
}) => {
  return (
    <Sheet open={open} onClose={onClose} variant="alert" maxWidth="max-w-[280px]">
      <div className="px-5 pt-5 pb-2 text-center">
        <h3 className="text-[17px] font-semibold text-ios-label">{title}</h3>
        {message && <p className="text-[13px] text-ios-label-2 mt-2 leading-snug">{message}</p>}
      </div>
      <div className="border-t border-ios-separator flex">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 text-[17px] text-ios-blue font-medium active:bg-ios-fill-3"
        >
          取消
        </button>
        <div className="w-px bg-ios-separator" />
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-1 py-3.5 text-[17px] text-ios-red font-semibold active:bg-ios-fill-3"
        >
          {isProcessing ? '...' : confirmText}
        </button>
      </div>
    </Sheet>
  );
};
