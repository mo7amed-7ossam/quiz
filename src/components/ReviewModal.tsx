import React, { useState } from 'react';
import { ReviewItem } from '../types';
import { X, CheckCircle2, XCircle, FileText, User, Calendar, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ReviewItem | null;
  allItems: ReviewItem[];
  onUpdateStatus: (id: string, newStatus: ReviewItem['status']) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  allItems,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'draft'>('all');
  const [currentSelected, setCurrentSelected] = useState<ReviewItem | null>(selectedItem);

  if (!isOpen) return null;

  const itemToDisplay = currentSelected || selectedItem || allItems[0];

  const filteredList = allItems.filter((it) => {
    if (filter === 'pending') return it.status === 'قيد المراجعة';
    if (filter === 'draft') return it.status === 'مسودة';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="review-details-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-lg">
              {selectedItem ? 'تفاصيل المراجعة' : 'جميع العناصر بانتظار المراجعة'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
          {/* If viewing all items list */}
          {!selectedItem && (
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  الكل ({allItems.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  قيد المراجعة ({allItems.filter((x) => x.status === 'قيد المراجعة').length})
                </button>
                <button
                  onClick={() => setFilter('draft')}
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    filter === 'draft' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  مسودة ({allItems.filter((x) => x.status === 'مسودة').length})
                </button>
              </div>

              <div className="space-y-2">
                {filteredList.map((it) => (
                  <div
                    key={it.id}
                    onClick={() => setCurrentSelected(it)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      itemToDisplay?.id === it.id
                        ? 'border-teal-500 bg-teal-50/30 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{it.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {it.type} • بواسطة {it.author}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        it.status === 'قيد المراجعة'
                          ? 'bg-amber-100 text-amber-800'
                          : it.status === 'مسودة'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {it.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Item Details Card */}
          {itemToDisplay && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70 space-y-4">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-md inline-block mb-1.5">
                  {itemToDisplay.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {itemToDisplay.title}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>المعد: <strong className="text-slate-800">{itemToDisplay.author}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>التاريخ: <strong className="text-slate-800">{itemToDisplay.date || 'اليوم'}</strong></span>
                </div>
              </div>

              {itemToDisplay.details && (
                <div className="text-xs leading-relaxed text-slate-600 bg-white p-3.5 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-teal-600" />
                    تفاصيل وملاحظات المحتوى:
                  </div>
                  {itemToDisplay.details}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        {itemToDisplay && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              الحالة الحالية: <strong className="text-slate-800">{itemToDisplay.status}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(itemToDisplay.id, 'مرفوض');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>طلب تعديل</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(itemToDisplay.id, 'معتمد');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد ونشر</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
