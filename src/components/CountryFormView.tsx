import React, { useState, useRef, useEffect } from 'react';
import { CountryItem } from '../types';
import { ChevronDown, Check } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CustomSelect } from './CustomSelect';

interface CountryFormViewProps {
  initialData?: CountryItem | null;
  onSave: (countryData: Partial<CountryItem>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const CountryFormView: React.FC<CountryFormViewProps> = ({
  initialData,
  onSave,
  onCancel,
  onDelete,
}) => {
  const isEditing = Boolean(initialData?.id);

  const [nameAr, setNameAr] = useState(initialData?.nameAr || '');
  const [nameEn, setNameEn] = useState(initialData?.nameEn || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [currency, setCurrency] = useState(initialData?.currency || (isEditing ? 'ر.س SAR' : ''));
  const [defaultLanguage, setDefaultLanguage] = useState(
    initialData?.defaultLanguage || 'العربية'
  );

  const curriculumOptions = [
    'منهج وزاري',
    'منهج دولي (IB)',
    'منهج دولي (أمريكي)',
    'منهج دولي (بريطاني)',
    'منهج دولي فقط',
  ];

  const getInitialCurriculums = (val?: string): string[] => {
    if (!val) return ['منهج وزاري'];
    const selected: string[] = [];
    curriculumOptions.forEach((opt) => {
      if (
        val.includes(opt) ||
        (opt === 'منهج وزاري' && val.includes('وزاري')) ||
        (opt === 'منهج دولي (IB)' && val.includes('IB'))
      ) {
        if (!selected.includes(opt)) selected.push(opt);
      }
    });
    return selected.length > 0 ? selected : ['منهج وزاري'];
  };

  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>(
    getInitialCurriculums(initialData?.curriculumSystem)
  );

  const toggleCurriculum = (curr: string) => {
    setSelectedCurriculums((prev) =>
      prev.includes(curr) ? prev.filter((item) => item !== curr) : [...prev, curr]
    );
  };

  const [isActive, setIsActive] = useState<boolean>(
    initialData?.status ? initialData.status === 'نشط' : true
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setIsCurriculumOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = ['العربية', 'الإنجليزية', 'العربية/الإنجليزية', 'الفرنسية'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !code.trim()) return;

    const finalCurriculum =
      selectedCurriculums.length > 0
        ? selectedCurriculums.join(' + ')
        : 'غير محدد';

    onSave({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      code: code.trim().toUpperCase(),
      currency: currency.trim() || 'ر.س SAR',
      defaultLanguage,
      curriculumSystem: finalCurriculum,
      gradesCount: initialData?.gradesCount || 12,
      status: isActive ? 'نشط' : 'قريباً',
    });
  };

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xs">
        {/* Card Section Title */}
        <div className="text-right mb-6">
          <h3 className="text-base sm:text-[17px] font-black text-[#19223c]">
            البيانات الأساسية
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Arabic Name | English Name | Code (3 columns in RTL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* 1. Arabic Name */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اسم الدولة (عربي) <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: السعودية"
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] focus:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* 2. English Name */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اسم الدولة (إنجليزي) <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Saudi Arabia"
                dir="ltr"
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] focus:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors text-right"
              />
            </div>

            {/* 3. Code */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                الكود <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SA"
                dir="ltr"
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] focus:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors text-right"
              />
            </div>
          </div>

          {/* Row 2: Default Language | Currency | Curriculum System (3 columns in RTL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* 1. Default Language (Select) */}
            <div className="relative" ref={langRef}>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اللغة الافتراضية
              </label>
              <div
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCurriculumOpen(false);
                }}
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-[#19223c] stroke-[2.2]" />
                <span>{defaultLanguage}</span>
              </div>

              {isLangOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
                  {languageOptions.map((lang) => (
                    <div
                      key={lang}
                      onClick={() => {
                        setDefaultLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right ${
                        defaultLanguage === lang
                          ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                          : 'text-[#19223c]'
                      }`}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Currency */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                العملة
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="ر.س SAR"
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] focus:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* 3. Curriculum System (Drop List with Checkboxes) */}
            <div className="relative" ref={currRef}>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                نظام المنهج المعتمد
              </label>
              <div
                onClick={() => {
                  setIsCurriculumOpen(!isCurriculumOpen);
                  setIsLangOpen(false);
                }}
                className="w-full bg-white border border-[#48877b]/60 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                    isCurriculumOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
                <span className="truncate max-w-[200px] text-right">
                  {selectedCurriculums.length === 0
                    ? 'اختر نظام المنهج (اختياري)'
                    : selectedCurriculums.length <= 2
                    ? selectedCurriculums.join('، ')
                    : `تم تحديد (${selectedCurriculums.length}) أنظمة`}
                </span>
              </div>

              {isCurriculumOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-2 animate-in fade-in slide-in-from-top-1 duration-100 divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {curriculumOptions.map((curr) => {
                    const isChecked = selectedCurriculums.includes(curr);
                    return (
                      <div
                        key={curr}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCurriculum(curr);
                        }}
                        className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                          isChecked ? 'bg-[#f4faf8]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Custom Checkbox */}
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#48877b] border-[#48877b] text-white shadow-2xs'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs sm:text-sm text-right ${
                              isChecked
                                ? 'font-bold text-[#19223c]'
                                : 'font-medium text-slate-700'
                            }`}
                          >
                            {curr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 3 (ONLY in Edit Mode): Linked Grades Count */}
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                  عدد الصفوف الدراسية المرتبطة
                </label>
                <div className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 text-right cursor-not-allowed select-none">
                  {initialData?.gradesCount || 12} صف
                </div>
              </div>
              <div className="hidden md:block" />
              <div className="hidden md:block" />
            </div>
          )}

          {/* Row 4: Status Toggle Switch */}
          <div className="flex items-center justify-start gap-3 mt-4 mb-1">
            <span className="text-xs sm:text-[13px] font-semibold text-[#19223c]">
              {isActive
                ? 'الحالة: نشط (فعّال ومرئي للمستخدمين)'
                : 'الحالة: غير نشط (موقوف مؤقتاً)'}
            </span>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus:outline-none ${
                isActive ? 'bg-[#559185]' : 'bg-slate-300'
              }`}
              title="تبديل الحالة"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  isActive ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Delete Country Notice & Action (Shown ONLY in Edit mode, as separate card) */}
      {isEditing && initialData?.id && (
        <div className="bg-[#fff8f7] border border-dashed border-[#f4cfc8] rounded-2xl p-5 sm:px-7 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="text-sm sm:text-base font-bold text-[#b93822] mb-1">
              حذف الدولة
            </h4>
            <p className="text-xs sm:text-[13px] text-[#b93822]/90 leading-relaxed font-semibold">
              لا يمكن حذف دولة مرتبطة بصفوف دراسية — يجب حذف أو نقل الصفوف المرتبطة بها أولاً ({initialData.gradesCount || 12} صف حالياً)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-[#e5a298] hover:bg-[#dc9287] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            حذف الدولة
          </button>
        </div>
      )}

      {/* Bottom Floating Action Buttons (Left-aligned in RTL, matching screenshot) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          إلغاء
        </button>

        {/* Save / Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          {isEditing ? 'حفظ الدولة' : 'إضافة الدولة'}
        </button>
      </div>

      {/* Standard Delete Confirmation Modal */}
      {isEditing && initialData?.id && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          title={`حذف الدولة: ${initialData.nameAr}`}
          warningMessage={`لا يمكن حذف دولة مرتبطة بصفوف دراسية — يجب حذف أو نقل الصفوف المرتبطة بها أولاً (${initialData.gradesCount || 12} صف حالياً)`}
          confirmLabel="حذف الدولة"
          onConfirm={() => {
            if (initialData.id && onDelete) {
              onDelete(initialData.id);
            }
            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};
