import React from 'react';
import { ReviewItem } from '../types';
import { BookOpen, HelpCircle, Globe2, ChevronLeft, Eye } from 'lucide-react';

interface PendingReviewsTableProps {
  items: ReviewItem[];
  onSelectReview: (item: ReviewItem) => void;
  onViewAll: () => void;
}

export const PendingReviewsTable: React.FC<PendingReviewsTableProps> = ({
  items,
  onSelectReview,
  onViewAll,
}) => {
  const getIcon = (iconType: ReviewItem['iconType']) => {
    switch (iconType) {
      case 'curriculum':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      case 'question':
        return <HelpCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'country':
        return <Globe2 className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getStatusBadge = (status: ReviewItem['status'], color: ReviewItem['statusColor']) => {
    if (status === 'قيد المراجعة' || color === 'amber') {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] border border-amber-200/50">
          قيد المراجعة
        </span>
      );
    }
    if (status === 'مسودة' || color === 'purple') {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#ede9fe] text-[#7c3aed] border border-purple-200/50">
          مسودة
        </span>
      );
    }
    if (status === 'معتمد' || color === 'emerald') {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          معتمد
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        مرفوض
      </span>
    );
  };

  return (
    <div
      id="pending-reviews-card"
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs mt-4 mx-4 sm:mx-8 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          بانتظار المراجعة
        </h3>
        <button
          id="view-all-reviews-btn"
          onClick={onViewAll}
          className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <span>عرض الكل</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
              <th className="pb-3 pr-2 font-semibold text-right">الحالة</th>
              <th className="pb-3 px-4 font-semibold text-right">بواسطة</th>
              <th className="pb-3 px-4 font-semibold text-right">العنصر</th>
              <th className="pb-3 pl-2 font-semibold text-right">النوع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
            {items.slice(0, 3).map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectReview(item)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                {/* Status Badge (Left) */}
                <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                  <div className="flex items-center justify-start gap-2">
                    {getStatusBadge(item.status, item.statusColor)}
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-teal-600 transition-opacity"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>

                {/* By Author */}
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-right">
                  {item.author}
                </td>

                {/* Item title */}
                <td className="py-3.5 px-4 font-medium text-slate-800 text-right">
                  <span className="group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </span>
                </td>

                {/* Type & Icon (Right) */}
                <td className="py-3.5 pl-2 whitespace-nowrap text-right">
                  <div className="flex items-center justify-start gap-2">
                    <span className="font-semibold text-slate-700">
                      {item.type}
                    </span>
                    <span className="p-1 rounded-md bg-slate-100/80 group-hover:bg-white group-hover:shadow-2xs transition-colors">
                      {getIcon(item.iconType)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
