import React, { useState, useRef, useEffect } from 'react';
import { SubjectItem } from '../types';
import { ChevronDown, Check } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface SubjectFormViewProps {
  initialData?: SubjectItem | null;
  defaultGrade?: string;
  defaultCountry?: string;
  onSave: (subjectData: Partial<SubjectItem>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

interface ColorOption {
  name: string;
  labelAr: string;
  hex: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Purple', labelAr: 'بنفسجي داكن', hex: '#53389e' },
  { name: 'Navy', labelAr: 'كحلي داكن', hex: '#19223c' },
  { name: 'Brick', labelAr: 'أحمر قرميدي', hex: '#ba5139' },
  { name: 'Teal', labelAr: 'أخضر مائي', hex: '#48877b' },
  { name: 'Slate', labelAr: 'رمادي نيلي', hex: '#4b556b' },
  { name: 'Gold', labelAr: 'ذهبي / خردلي', hex: '#d99b26' },
  { name: 'Sky Blue', labelAr: 'أزرق سماوي', hex: '#0284c7' },
  { name: 'Rose', labelAr: 'وردي ياقوتي', hex: '#e11d48' },
  { name: 'Emerald', labelAr: 'أخضر زمردي', hex: '#059669' },
];

const GRADE_OPTIONS = [
  'الأول الابتدائي',
  'الثاني الابتدائي',
  'الثالث الابتدائي',
  'الرابع الابتدائي',
  'الخامس الابتدائي',
  'السادس الابتدائي',
  'الأول المتوسط',
  'الثاني المتوسط',
  'الثالث المتوسط',
  'الأول الثانوي',
  'الثاني الثانوي',
  'الثالث الثانوي',
];

const POPULAR_EMOJIS = [
  '🌐', '📖', '🔬', '📘', '🔢', '🕌', '🗺️', '🎨', '💻', '📐', '🧪', '⚽', '📜', '🧬', '🎵'
];

export const SubjectFormView: React.FC<SubjectFormViewProps> = ({
  initialData,
  defaultGrade = 'السادس الابتدائي',
  defaultCountry = 'SA',
  onSave,
  onCancel,
  onDelete,
}) => {
  const isEditing = Boolean(initialData?.id);
  const unitsCount = initialData?.unitsCount !== undefined ? initialData.unitsCount : 0;

  const [nameAr, setNameAr] = useState(initialData?.nameAr || '');
  const [nameEn, setNameEn] = useState(initialData?.nameEn || '');
  const [selectedGrade, setSelectedGrade] = useState(initialData?.gradeId || defaultGrade);
  const [selectedColorName, setSelectedColorName] = useState(
    initialData?.iconColorName || (isEditing ? 'Purple' : 'Navy')
  );
  const [emoji, setEmoji] = useState(initialData?.emoji || (isEditing ? '🌐' : '📘'));
  const [isActive, setIsActive] = useState<boolean>(
    initialData?.status !== undefined ? initialData.status : true
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const gradeRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setIsGradeOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setIsColorOpen(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setIsEmojiPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentColorObj =
    COLOR_OPTIONS.find((c) => c.name === selectedColorName) || COLOR_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    onSave({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || 'Subject',
      gradeId: selectedGrade,
      iconColorName: currentColorObj.name,
      iconBgColor: currentColorObj.hex,
      emoji: emoji.trim() || '📘',
      status: isActive,
      countryCode: initialData?.countryCode || defaultCountry,
      unitsCount: initialData?.unitsCount !== undefined ? initialData.unitsCount : 6,
    });
  };

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xs">
        {/* Top Header inside Card: Title on Right, Icon Preview on Left */}
        <div className="flex items-center justify-between mb-8">
          {/* Right: Section Title */}
          <div>
            <h3 className="text-base sm:text-[18px] font-black text-[#19223c]">
              البيانات الأساسية
            </h3>
          </div>

          {/* Left: Icon Preview */}
          <div className="flex items-center gap-3.5">
            <span className="text-xs sm:text-[13px] font-bold text-slate-500">
              معاينة الأيقونة
            </span>
            <div
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs transition-all duration-200"
              style={{ backgroundColor: currentColorObj.hex }}
            >
              <span className="text-2xl sm:text-3xl select-none leading-none flex items-center justify-center">
                {emoji || '📘'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Grade | Arabic Name | English Name (3 columns in RTL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* 1. Grade Select (الصف *) */}
            <div className="relative" ref={gradeRef}>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                الصف <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <div
                onClick={() => {
                  setIsGradeOpen(!isGradeOpen);
                  setIsColorOpen(false);
                  setIsEmojiPickerOpen(false);
                }}
                className="w-full bg-white border border-[#48877b] hover:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                    isGradeOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
                <span>{selectedGrade}</span>
              </div>

              {isGradeOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
                  {GRADE_OPTIONS.map((grade) => (
                    <div
                      key={grade}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setIsGradeOpen(false);
                      }}
                      className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right flex items-center justify-between ${
                        selectedGrade === grade
                          ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                          : 'text-[#19223c]'
                      }`}
                    >
                      <span>{grade}</span>
                      {selectedGrade === grade && (
                        <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Arabic Name (اسم المادة (عربي) *) */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اسم المادة (عربي) <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: رياضيات"
                className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors text-right"
              />
            </div>

            {/* 3. English Name (اسم المادة (إنجليزي) *) */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                اسم المادة (إنجليزي) <span className="text-[#e0564c] font-normal">*</span>
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Mathematics"
                dir="ltr"
                className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] placeholder:text-slate-400 focus:outline-none transition-colors text-right"
              />
            </div>
          </div>

          {/* Row 2: Icon Color | Icon Emoji | Units Count (3 columns in RTL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* 1. Icon Color (لون الأيقونة) */}
            <div className="relative" ref={colorRef}>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                لون الأيقونة
              </label>
              <div
                onClick={() => {
                  setIsColorOpen(!isColorOpen);
                  setIsGradeOpen(false);
                  setIsEmojiPickerOpen(false);
                }}
                className="w-full bg-white border border-[#48877b] hover:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                    isColorOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-200"
                    style={{ backgroundColor: currentColorObj.hex }}
                  />
                  <span>{currentColorObj.name}</span>
                </div>
              </div>

              {isColorOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 max-h-56 overflow-y-auto">
                  {COLOR_OPTIONS.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => {
                        setSelectedColorName(c.name);
                        setIsColorOpen(false);
                      }}
                      className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right flex items-center justify-between ${
                        selectedColorName === c.name
                          ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                          : 'text-[#19223c]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name} ({c.labelAr})</span>
                      </div>
                      {selectedColorName === c.name && (
                        <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Icon Emoji (رمز الأيقونة (Emoji)) */}
            <div className="relative" ref={emojiRef}>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                رمز الأيقونة (Emoji)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  onFocus={() => setIsEmojiPickerOpen(true)}
                  placeholder="🌐"
                  className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2 text-base font-bold text-[#19223c] focus:outline-none transition-colors text-center cursor-pointer"
                />
              </div>

              {/* Emoji quick suggestions popup */}
              {isEmojiPickerOpen && (
                <div className="absolute top-full right-0 left-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-3 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="text-[11px] font-bold text-slate-400 mb-2 text-right">
                    رموز سريعة ومقترحة:
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {POPULAR_EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setEmoji(em);
                          setIsEmojiPickerOpen(false);
                        }}
                        className={`text-xl p-2 rounded-xl hover:bg-slate-100 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                          emoji === em ? 'bg-[#eef7f5] border border-[#48877b]' : ''
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Linked Units Count (عدد الوحدات الدراسية المرتبطة) */}
            <div>
              <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                عدد الوحدات الدراسية المرتبطة
              </label>
              <input
                type="text"
                disabled
                value={`${unitsCount} وحدات`}
                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 cursor-not-allowed select-none text-right"
              />
            </div>
          </div>

          {/* Row 3: Status Toggle Switch */}
          <div className="flex items-center justify-start gap-3 mt-6 mb-2">
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

      {/* Danger Zone: Delete Subject (حذف المادة) Card matching screenshot */}
      {isEditing && (
        <div className="bg-[#fff8f7] border border-dashed border-[#f4cfc8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Right side: Delete Warnings and Info */}
          <div className="space-y-1 text-right">
            <h4 className="text-sm sm:text-base font-bold text-[#d45645]">
              حذف المادة
            </h4>
            <p className="text-xs sm:text-[13px] text-[#e06d5e] leading-relaxed">
              {unitsCount > 0
                ? `لا يمكن حذف مادة مرتبطة بوحدات دراسية — يجب حذف أو نقل الوحدات المرتبطة بها أولاً (${unitsCount} وحدات حالياً)`
                : 'سيتم حذف المادة بشكل نهائي من النظام.'}
            </p>
          </div>

          {/* Left side: Delete Button */}
          <div className="shrink-0">
            <button
              type="button"
              disabled={unitsCount > 0}
              onClick={() => {
                if (unitsCount === 0 && initialData?.id && onDelete) {
                  setIsDeleteModalOpen(true);
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-2xs ${
                unitsCount > 0
                  ? 'bg-[#e5a298] opacity-90 cursor-not-allowed'
                  : 'bg-[#d45645] hover:bg-[#b84333] cursor-pointer'
              }`}
              title={unitsCount > 0 ? 'لا يمكن الحذف لوجود وحدات مرتبطة' : 'حذف المادة'}
            >
              حذف المادة
            </button>
          </div>
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

        {/* Save / Add Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          {isEditing ? 'حفظ المادة' : 'إضافة المادة'}
        </button>
      </div>

      {/* Standard Delete Confirmation Modal */}
      {isEditing && initialData?.id && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          title={`حذف المادة: ${initialData.nameAr}`}
          warningMessage={`هل أنت متأكد من رغبتك في حذف مادة (${initialData.nameAr})؟ — لا يمكن التراجع عن هذا الإجراء وسيتم إزالتها نهائياً.`}
          confirmLabel="حذف المادة"
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
