import React, { useState } from 'react';
import { CountryItem } from '../types';
import { ChevronDown } from 'lucide-react';

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
  const [currency, setCurrency] = useState(initialData?.currency || '');
  const [defaultLanguage, setDefaultLanguage] = useState(
    initialData?.defaultLanguage || 'العربية'
  );
  const [curriculumSystem, setCurriculumSystem] = useState(
    initialData?.curriculumSystem || 'منهج وزاري'
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialData?.status ? initialData.status === 'نشط' : true
  );

  const [isLangOpen, setIsLangOpen] = useState(false);

  const languageOptions = ['العربية', 'الإنجليزية', 'العربية/الإنجليزية', 'الفرنسية'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !code.trim()) return;

    onSave({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      code: code.trim().toUpperCase(),
      currency: currency.trim() || 'ر.س SAR',
      defaultLanguage,
      curriculumSystem,
      gradesCount: initialData?.gradesCount || 12,
      status: isActive ? 'نشط' : 'قريباً',
    });
  };

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto font-cairo" dir="rtl">
      {/* Form Card */}
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
                className="w-full bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#19223c] placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none transition-colors"
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
                className="w-full bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#19223c] placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none transition-colors text-right"
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
                className="w-full bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#19223c] placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none transition-colors text-right"
              />
            </div>
          </div>

          {/* Row 2: Default Language | Currency | Curriculum System (3 columns in RTL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* 1. Default Language (Select) */}
            <div className="relative">
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اللغة الافتراضية
              </label>
              <div
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-full bg-white border border-[#48877b]/80 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
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
                className="w-full bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#19223c] placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none transition-colors"
              />
            </div>

            {/* 3. Curriculum System (Pill Selectors matching screenshot) */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                نظام المنهج المعتمد <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <div className="flex items-center gap-2.5">
                {/* Option 1: منهج وزاري */}
                <button
                  type="button"
                  onClick={() => setCurriculumSystem('منهج وزاري')}
                  className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    curriculumSystem === 'منهج وزاري'
                      ? 'bg-[#eef8f5] border-2 border-[#559185] text-[#3d7a6e] shadow-2xs'
                      : 'bg-[#f1f5f9] border-2 border-transparent text-[#19223c] hover:bg-slate-200/80'
                  }`}
                >
                  منهج وزاري
                </button>

                {/* Option 2: منهج دولي فقط */}
                <button
                  type="button"
                  onClick={() => setCurriculumSystem('منهج دولي فقط')}
                  className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    curriculumSystem === 'منهج دولي فقط'
                      ? 'bg-[#eef8f5] border-2 border-[#559185] text-[#3d7a6e] shadow-2xs'
                      : 'bg-[#f1f5f9] border-2 border-transparent text-[#19223c] hover:bg-slate-200/80'
                  }`}
                >
                  منهج دولي فقط
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Status Toggle Switch */}
          <div className="flex items-center justify-start gap-3 mt-4 mb-2">
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

          {/* Danger Zone: Delete Country Notice & Action (Shown when editing) */}
          {isEditing && initialData?.id && (
            <div className="mt-8 bg-[#fef4f2] border border-dashed border-[#fbdcd6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                onClick={() => {
                  if (initialData.id && onDelete) {
                    onDelete(initialData.id);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
              >
                حذف الدولة
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Bottom Floating Action Buttons (Left-aligned in RTL, matching screenshot) */}
      <div className="flex items-center justify-end gap-3 mt-6">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          إلغاء
        </button>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          {isEditing ? 'حفظ التعديلات' : 'إضافة الدولة'}
        </button>
      </div>
    </div>
  );
};
