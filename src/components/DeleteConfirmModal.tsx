import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  warningMessage: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  warningMessage,
  confirmLabel = 'حذف',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-cairo"
      dir="rtl"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg p-7 sm:p-9 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Trash Icon */}
        <div className="flex items-center justify-center mb-5 text-[#2c3e50]">
          <Trash2 className="w-11 h-11 stroke-[1.4] text-slate-700" />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#19223c] mb-4">
          {title}
        </h3>

        {/* Warning Notice Box */}
        <div className="bg-[#fef4f2] border border-[#fbdcd6] rounded-2xl p-4 sm:p-5 mb-7 text-center">
          <p className="text-xs sm:text-[13px] text-[#b93822] font-semibold leading-relaxed">
            {warningMessage}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onConfirm}
            className="px-8 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
