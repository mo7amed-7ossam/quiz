import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CountryItem } from '../types';
import { CountryFormView } from './CountryFormView';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface CountriesViewProps {
  onFormStateChange?: (state: {
    isForm: boolean;
    isEditing: boolean;
    countryName?: string;
    onBack: () => void;
  } | null) => void;
}

const DEFAULT_COUNTRIES: CountryItem[] = [
  {
    id: 'sa',
    code: 'SA',
    nameAr: 'السعودية',
    nameEn: 'Saudi Arabia',
    defaultLanguage: 'العربية',
    curriculumSystem: 'منهج وزاري',
    gradesCount: 12,
    status: 'نشط',
  },
  {
    id: 'eg',
    code: 'EG',
    nameAr: 'مصر',
    nameEn: 'Egypt',
    defaultLanguage: 'العربية',
    curriculumSystem: 'منهج وزاري',
    gradesCount: 12,
    status: 'نشط',
  },
  {
    id: 'ae',
    code: 'AE',
    nameAr: 'الإمارات',
    nameEn: 'United Arab Emirates',
    defaultLanguage: 'العربية/الإنجليزية',
    curriculumSystem: 'وزاري + دولي (IB)',
    gradesCount: 13,
    status: 'نشط',
  },
  {
    id: 'jo',
    code: 'JO',
    nameAr: 'الأردن',
    nameEn: 'Jordan',
    defaultLanguage: 'العربية',
    curriculumSystem: 'منهج وزاري',
    gradesCount: 12,
    status: 'قريباً',
  },
];

export const CountriesView: React.FC<CountriesViewProps> = ({
  onFormStateChange,
}) => {
  const [countries, setCountries] = useState<CountryItem[]>(DEFAULT_COUNTRIES);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingCountry, setEditingCountry] = useState<CountryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Notify parent of form state for topbar title & breadcrumb sync
  React.useEffect(() => {
    if (onFormStateChange) {
      if (viewMode === 'form') {
        onFormStateChange({
          isForm: true,
          isEditing: Boolean(editingCountry?.id),
          countryName: editingCountry?.nameAr,
          onBack: () => {
            setViewMode('list');
            setEditingCountry(null);
          },
        });
      } else {
        onFormStateChange(null);
      }
    }
  }, [viewMode, editingCountry, onFormStateChange]);

  const handleOpenAdd = () => {
    setEditingCountry(null);
    setViewMode('form');
  };

  const handleOpenEdit = (country: CountryItem) => {
    setEditingCountry(country);
    setViewMode('form');
  };

  const handleSaveCountry = (countryData: Partial<CountryItem>) => {
    if (editingCountry?.id) {
      // Update existing
      setCountries((prev) =>
        prev.map((c) => (c.id === editingCountry.id ? { ...c, ...countryData } : c))
      );
    } else {
      // Add new
      const newCountry: CountryItem = {
        id: 'country-' + Date.now(),
        code: countryData.code || 'XX',
        nameAr: countryData.nameAr || 'دولة جديدة',
        nameEn: countryData.nameEn || '',
        currency: countryData.currency || 'ر.س SAR',
        defaultLanguage: countryData.defaultLanguage || 'العربية',
        curriculumSystem: countryData.curriculumSystem || 'منهج وزاري',
        gradesCount: countryData.gradesCount || 12,
        status: countryData.status || 'نشط',
      };
      setCountries((prev) => [newCountry, ...prev]);
    }
    setViewMode('list');
    setEditingCountry(null);
  };

  const handleDelete = (id: string) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    if (viewMode === 'form') {
      setViewMode('list');
      setEditingCountry(null);
    }
  };

  // Render Delete Confirmation Modal
  const renderDeleteModal = () => {
    if (!deleteConfirmId) return null;
    const targetCountry = countries.find((c) => c.id === deleteConfirmId);
    const countryName = targetCountry ? targetCountry.nameAr : 'الدولة المحددة';
    const gradesCount = targetCountry ? targetCountry.gradesCount : 12;

    return (
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title={`حذف الدولة: ${countryName}`}
        warningMessage={`لا يمكن حذف دولة مرتبطة بصفوف دراسية — يجب حذف أو نقل الصفوف المرتبطة بها أولاً (${gradesCount} صف حالياً)`}
        confirmLabel="حذف الدولة"
        onConfirm={() => handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    );
  };

  if (viewMode === 'form') {
    return (
      <>
        <CountryFormView
          initialData={editingCountry}
          onSave={handleSaveCountry}
          onCancel={() => {
            setViewMode('list');
            setEditingCountry(null);
          }}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
        {renderDeleteModal()}
      </>
    );
  }

  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo" dir="rtl">
      {/* Main Countries Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xs">
        {/* Header: Title (Right) & Add Button (Left) */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-black text-[#19223c] tracking-tight">
            إدارة الدول ({countries.length})
          </h2>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#48877b] hover:bg-[#3c7268] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>+</span>
            <span>إضافة دولة</span>
          </button>
        </div>

        {/* Table View matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[#64748b] text-xs sm:text-[13px] font-bold">
                <th className="pb-3.5 pr-2 font-bold">الدولة</th>
                <th className="pb-3.5 px-3 font-bold text-center sm:text-right">الكود</th>
                <th className="pb-3.5 px-3 font-bold text-center sm:text-right">اللغة الافتراضية</th>
                <th className="pb-3.5 px-3 font-bold text-center sm:text-right">نظام المنهج</th>
                <th className="pb-3.5 px-3 font-bold text-center sm:text-right">عدد الصفوف</th>
                <th className="pb-3.5 px-3 font-bold text-center">الحالة</th>
                <th className="pb-3.5 pl-2 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
              {countries.map((country) => (
                <tr
                  key={country.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Country Name (Arabic & English) */}
                  <td className="py-4 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#19223c] text-sm">
                        {country.code} {country.nameAr}
                      </span>
                    </div>
                    {country.nameEn && (
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {country.nameEn}
                      </div>
                    )}
                  </td>

                  {/* Code */}
                  <td className="py-4 px-3 font-bold text-[#19223c] text-center sm:text-right">
                    {country.code}
                  </td>

                  {/* Default Language */}
                  <td className="py-4 px-3 text-[#334155] font-medium text-center sm:text-right">
                    {country.defaultLanguage}
                  </td>

                  {/* Curriculum System */}
                  <td className="py-4 px-3 text-[#334155] font-medium text-center sm:text-right">
                    {country.curriculumSystem}
                  </td>

                  {/* Grades Count */}
                  <td className="py-4 px-3 font-bold text-[#19223c] text-center sm:text-right">
                    {country.gradesCount}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-3 text-center">
                    {country.status === 'نشط' ? (
                      <span className="inline-block bg-[#e6f7f4] text-[#2c7a6e] font-bold text-xs px-3.5 py-1 rounded-xl">
                        نشط
                      </span>
                    ) : country.status === 'قريباً' ? (
                      <span className="inline-block bg-[#f1edfb] text-[#6d54ab] font-bold text-xs px-3.5 py-1 rounded-xl">
                        قريباً
                      </span>
                    ) : (
                      <span className="inline-block bg-slate-100 text-slate-500 font-bold text-xs px-3.5 py-1 rounded-xl">
                        معطل
                      </span>
                    )}
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="py-4 pl-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Delete button (soft peach square) */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(country.id)}
                        className="w-8 h-8 rounded-xl bg-[#fdebe7] text-[#c54b38] hover:bg-[#fadbd4] flex items-center justify-center transition-colors cursor-pointer"
                        title="حذف الدولة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit button (soft blue square) */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(country)}
                        className="w-8 h-8 rounded-xl bg-[#eef3f9] text-[#2d4e78] hover:bg-[#dfe9f5] flex items-center justify-center transition-colors cursor-pointer"
                        title="تعديل الدولة"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info: Rows 1-4 of 4 */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end text-xs text-slate-400 font-medium">
          <span>Rows 1–{countries.length} of {countries.length}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {renderDeleteModal()}
    </div>
  );
};
