import React, { useState, useRef, useEffect } from 'react';
import { AcademicCalendarItem, OfficialHoliday } from '../types';
import { ChevronDown, Check, Pencil, Trash2, X, Plus } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AcademicCalendarFormViewProps {
  initialData?: AcademicCalendarItem | null;
  defaultCountry?: string;
  onSave: (calendarData: Partial<AcademicCalendarItem>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const COUNTRY_OPTIONS = [
  { code: 'SA', label: 'SA السعودية', nameAr: 'السعودية' },
  { code: 'EG', label: 'EG مصر', nameAr: 'مصر' },
  { code: 'AE', label: 'AE الإمارات', nameAr: 'الإمارات' },
  { code: 'KW', label: 'KW الكويت', nameAr: 'الكويت' },
  { code: 'QA', label: 'QA قطر', nameAr: 'قطر' },
];

export const AcademicCalendarFormView: React.FC<AcademicCalendarFormViewProps> = ({
  initialData,
  defaultCountry = 'SA',
  onSave,
  onCancel,
  onDelete,
}) => {
  const isEditing = Boolean(initialData?.id);

  // Form State
  const [selectedCountry, setSelectedCountry] = useState(
    initialData?.countryCode || defaultCountry
  );
  const [academicYear, setAcademicYear] = useState(
    initialData?.academicYear || '2027 / 2026'
  );
  const [term1Start, setTerm1Start] = useState(
    initialData?.term1Start || '2026-08-24'
  );
  const [term1End, setTerm1End] = useState(
    initialData?.term1End || '2026-12-18'
  );
  const [term2Start, setTerm2Start] = useState(
    initialData?.term2Start || '2027-01-10'
  );
  const [term2End, setTerm2End] = useState(
    initialData?.term2End || '2027-05-20'
  );

  // Holidays State
  const [holidays, setHolidays] = useState<OfficialHoliday[]>(
    initialData?.holidays || [
      { id: 'hol-1', name: 'اليوم الوطني', startDate: '09-23', endDate: '09-23' },
      { id: 'hol-2', name: 'إجازة منتصف الفصل', startDate: '10-20', endDate: '10-24' },
      { id: 'hol-3', name: 'إجازة نهاية الفصل الأول', startDate: '12-19', endDate: '01-09' },
    ]
  );

  // Holiday Modal State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<OfficialHoliday | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [holidayStart, setHolidayStart] = useState('');
  const [holidayEnd, setHolidayEnd] = useState('');

  // Dropdown & Modal states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // Delete Modals
  const [isDeleteCalendarModalOpen, setIsDeleteCalendarModalOpen] = useState(false);
  const [deleteConfirmHoliday, setDeleteConfirmHoliday] = useState<OfficialHoliday | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCountryObj =
    COUNTRY_OPTIONS.find((c) => c.code === selectedCountry) || COUNTRY_OPTIONS[0];

  const handleOpenAddHoliday = () => {
    setEditingHoliday(null);
    setHolidayName('');
    setHolidayStart('09-23');
    setHolidayEnd('09-23');
    setIsHolidayModalOpen(true);
  };

  const handleOpenEditHoliday = (h: OfficialHoliday) => {
    setEditingHoliday(h);
    setHolidayName(h.name);
    setHolidayStart(h.startDate);
    setHolidayEnd(h.endDate);
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName.trim()) return;

    if (editingHoliday) {
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === editingHoliday.id
            ? {
                ...h,
                name: holidayName.trim(),
                startDate: holidayStart.trim() || '09-23',
                endDate: holidayEnd.trim() || '09-23',
              }
            : h
        )
      );
    } else {
      const newH: OfficialHoliday = {
        id: `hol-${Date.now()}`,
        name: holidayName.trim(),
        startDate: holidayStart.trim() || '09-23',
        endDate: holidayEnd.trim() || '09-23',
      };
      setHolidays((prev) => [...prev, newH]);
    }
    setIsHolidayModalOpen(false);
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYear.trim()) return;

    onSave({
      countryCode: selectedCountry,
      academicYear: academicYear.trim(),
      term1Start,
      term1End,
      term2Start,
      term2End,
      holidays,
    });
  };

  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo" dir="rtl">
      {/* 2-Column Responsive Grid matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: Main Data, Terms, Danger Zone, Actions (7 Cols in RTL) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xs space-y-7">
            {/* Section 1: البيانات الأساسية */}
            <div>
              <h3 className="text-base sm:text-[18px] font-black text-[#19223c] mb-5 text-right">
                البيانات الأساسية
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Country Select (الدولة *) */}
                <div className="relative" ref={countryRef}>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    الدولة <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <div
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full bg-white border border-[#48877b] hover:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                        isCountryOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                    <span>{currentCountryObj.label}</span>
                  </div>

                  {isCountryOpen && (
                    <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
                      {COUNTRY_OPTIONS.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            setSelectedCountry(c.code);
                            setIsCountryOpen(false);
                          }}
                          className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right flex items-center justify-between ${
                            selectedCountry === c.code
                              ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                              : 'text-[#19223c]'
                          }`}
                        >
                          <span>{c.label}</span>
                          {selectedCountry === c.code && (
                            <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Academic Year (السنة الدراسية *) */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    السنة الدراسية <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="مثال: 2027 / 2026"
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: الفصل الأول */}
            <div>
              <h3 className="text-base sm:text-[18px] font-black text-[#19223c] mb-5 text-right">
                الفصل الأول
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Term 1 Start Date (تاريخ البداية *) */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    تاريخ البداية <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={term1Start}
                    onChange={(e) => setTerm1Start(e.target.value)}
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>

                {/* Term 1 End Date (تاريخ النهاية *) */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    تاريخ النهاية <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={term1End}
                    onChange={(e) => setTerm1End(e.target.value)}
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: الفصل الثاني */}
            <div>
              <h3 className="text-base sm:text-[18px] font-black text-[#19223c] mb-5 text-right">
                الفصل الثاني
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Term 2 Start Date (تاريخ البداية *) */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    تاريخ البداية <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={term2Start}
                    onChange={(e) => setTerm2Start(e.target.value)}
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>

                {/* Term 2 End Date (تاريخ النهاية *) */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#19223c] mb-2 text-right">
                    تاريخ النهاية <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={term2End}
                    onChange={(e) => setTerm2End(e.target.value)}
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone: حذف التقويم الأكاديمي (Matching Screenshot) */}
          {isEditing && (
            <div className="bg-[#fff8f7] border border-dashed border-[#f4cfc8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Right side: Delete Warnings */}
              <div className="space-y-1 text-right">
                <h4 className="text-sm sm:text-base font-bold text-[#d45645]">
                  حذف التقويم الأكاديمي
                </h4>
                <p className="text-xs sm:text-[13px] text-[#e06d5e] leading-relaxed">
                  سيتم حذف هذا التقويم بفصليه وجميع إجازاته الرسمية المرتبطة نهائياً.
                </p>
              </div>

              {/* Left side: Delete Button */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDeleteCalendarModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#c15c48] hover:bg-[#b04f3c] active:scale-[0.98] font-bold text-xs sm:text-sm text-white transition-all shadow-2xs cursor-pointer"
                  title="حذف التقويم"
                >
                  حذف التقويم
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

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              حفظ التقويم
            </button>
          </div>
        </div>

        {/* Left Column: الإجازات الرسمية (5 Cols in RTL) matching Screenshot */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-xs space-y-6">
            {/* Header: Title on Right, "+ إضافة إجازة" Button on Left */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-[#19223c]">
                الإجازات الرسمية
              </h3>

              <button
                type="button"
                onClick={handleOpenAddHoliday}
                className="bg-[#48877b] hover:bg-[#3d756a] active:scale-[0.98] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
              >
                <span>+ إضافة إجازة</span>
              </button>
            </div>

            {/* Holidays Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs sm:text-[13px] font-bold text-slate-500 pb-3">
                    <th className="py-2.5 px-2 text-right font-bold text-[#19223c]">
                      الإجازة
                    </th>
                    <th className="py-2.5 px-2 text-center font-bold text-[#19223c]">
                      من
                    </th>
                    <th className="py-2.5 px-2 text-center font-bold text-[#19223c]">
                      إلى
                    </th>
                    <th className="py-2.5 px-2 text-left font-bold text-[#19223c]">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {holidays.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Holiday Name */}
                      <td className="py-3 px-2 text-right">
                        <span className="text-xs sm:text-sm font-bold text-[#19223c]">
                          {h.name}
                        </span>
                      </td>

                      {/* From Date */}
                      <td className="py-3 px-2 text-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-600 font-sans">
                          {h.startDate}
                        </span>
                      </td>

                      {/* To Date */}
                      <td className="py-3 px-2 text-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-600 font-sans">
                          {h.endDate}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-2 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Holiday */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditHoliday(h)}
                            className="w-7 h-7 rounded-lg bg-[#f4f6fa] hover:bg-[#e8ecf4] text-[#da684a] hover:text-[#c45336] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                            title="تعديل الإجازة"
                          >
                            <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                          </button>

                          {/* Delete Holiday */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmHoliday(h)}
                            className="w-7 h-7 rounded-lg bg-[#feeae6] hover:bg-[#fed9d2] text-[#e0564c] hover:text-[#c73e34] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                            title="حذف الإجازة"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {holidays.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
                  لا توجد إجازات رسمية مسجلة بعد.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Holiday Modal */}
      {isHolidayModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-cairo"
          dir="rtl"
          onClick={() => setIsHolidayModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100/80 space-y-6 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Title & Subtitle */}
            <div className="text-right">
              <h3 className="text-lg sm:text-xl font-bold text-[#19223c]">
                بيانات الإجازة
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
                أضف إجازة رسمية جديدة أو عدّل إجازة قائمة ضمن التقويم الأكاديمي الحالي.
              </p>
            </div>

            <form onSubmit={handleSaveHoliday} className="space-y-5">
              {/* Holiday Name (اسم الإجازة *) */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2 text-right">
                  اسم الإجازة <span className="text-[#e0564c] font-normal">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="اليوم الوطني"
                  className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right"
                />
              </div>

              {/* Start Date (من *) & End Date (إلى *) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2 text-right">
                    من <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={holidayStart}
                    onChange={(e) => setHolidayStart(e.target.value)}
                    placeholder="09-23"
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2 text-right">
                    إلى <span className="text-[#e0564c] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={holidayEnd}
                    onChange={(e) => setHolidayEnd(e.target.value)}
                    placeholder="09-23"
                    className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>
              </div>

              {/* Danger Zone: حذف الإجازة (When Editing an Existing Holiday) */}
              {editingHoliday && (
                <div className="bg-[#fff8f7] border border-dashed border-[#f4cfc8] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-right">
                    <h4 className="text-xs sm:text-sm font-bold text-[#d45645]">
                      حذف الإجازة
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#e06d5e] leading-relaxed">
                      سيُحذف هذا التاريخ نهائياً من التقويم الأكاديمي.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmHoliday(editingHoliday);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#c15c48] hover:bg-[#b04f3c] active:scale-[0.98] font-bold text-xs sm:text-sm text-white transition-all shadow-2xs shrink-0 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  حفظ الإجازة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup for Calendar */}
      {isEditing && initialData?.id && (
        <DeleteConfirmModal
          isOpen={isDeleteCalendarModalOpen}
          title={`حذف التقويم الأكاديمي: ${initialData.academicYear}`}
          warningMessage="سيتم حذف هذا التقويم بفصليه وجميع إجازاته الرسمية المرتبطة نهائياً."
          confirmLabel="حذف التقويم"
          onConfirm={() => {
            if (initialData.id && onDelete) {
              onDelete(initialData.id);
            }
            setIsDeleteCalendarModalOpen(false);
          }}
          onCancel={() => setIsDeleteCalendarModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Popup for Holiday */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmHoliday)}
        title={`حذف الإجازة: ${deleteConfirmHoliday?.name || ''}`}
        warningMessage={`هل أنت متأكد من رغبتك في حذف إجازة (${deleteConfirmHoliday?.name || ''})؟`}
        confirmLabel="حذف الإجازة"
        onConfirm={() => {
          if (deleteConfirmHoliday) {
            handleDeleteHoliday(deleteConfirmHoliday.id);
            setDeleteConfirmHoliday(null);
          }
        }}
        onCancel={() => setDeleteConfirmHoliday(null)}
      />
    </div>
  );
};
