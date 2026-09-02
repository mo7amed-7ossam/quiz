import React, { useState, useEffect } from 'react';
import { AcademicCalendarItem } from '../types';
import { initialAcademicCalendarsData } from '../data/mockData';
import { Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AcademicCalendarFormView } from './AcademicCalendarFormView';

interface AcademicCalendarViewProps {
  onFormStateChange?: (state: {
    isForm: boolean;
    isEditing: boolean;
    calendarYear?: string;
    onBack: () => void;
  } | null) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
  onFormStateChange,
}) => {
  const [calendars, setCalendars] = useState<AcademicCalendarItem[]>(
    initialAcademicCalendarsData
  );
  const [selectedCountry, setSelectedCountry] = useState<string>('SA');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingCalendar, setEditingCalendar] = useState<AcademicCalendarItem | null>(null);

  // Delete Confirm Modal State (from list view)
  const [deleteConfirmCalendar, setDeleteConfirmCalendar] = useState<AcademicCalendarItem | null>(null);

  const countryTabs = [
    { code: 'SA', label: 'SA السعودية', nameAr: 'السعودية' },
    { code: 'EG', label: 'EG مصر', nameAr: 'مصر' },
    { code: 'AE', label: 'AE الإمارات', nameAr: 'الإمارات' },
  ];

  const currentCountryObj =
    countryTabs.find((c) => c.code === selectedCountry) || countryTabs[0];

  const filteredCalendars = calendars.filter(
    (cal) => cal.countryCode === selectedCountry
  );

  // Sync form state with App header breadcrumbs
  useEffect(() => {
    if (onFormStateChange) {
      if (viewMode === 'form') {
        onFormStateChange({
          isForm: true,
          isEditing: Boolean(editingCalendar),
          calendarYear: editingCalendar?.academicYear,
          onBack: () => {
            setViewMode('list');
            setEditingCalendar(null);
          },
        });
      } else {
        onFormStateChange(null);
      }
    }
  }, [viewMode, editingCalendar, onFormStateChange]);

  const handleOpenAdd = () => {
    setEditingCalendar(null);
    setViewMode('form');
  };

  const handleOpenEdit = (cal: AcademicCalendarItem) => {
    setEditingCalendar(cal);
    setViewMode('form');
  };

  const handleDeleteCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
    if (viewMode === 'form') {
      setViewMode('list');
      setEditingCalendar(null);
    }
  };

  const handleSaveCalendar = (calendarData: Partial<AcademicCalendarItem>) => {
    if (editingCalendar) {
      setCalendars((prev) =>
        prev.map((c) =>
          c.id === editingCalendar.id
            ? ({
                ...c,
                ...calendarData,
              } as AcademicCalendarItem)
            : c
        )
      );
    } else {
      const newCal: AcademicCalendarItem = {
        id: `cal-${Date.now()}`,
        countryCode: calendarData.countryCode || selectedCountry,
        academicYear: calendarData.academicYear || '2028 / 2027',
        term1Start: calendarData.term1Start || '2027-08-23',
        term1End: calendarData.term1End || '2027-12-17',
        term2Start: calendarData.term2Start || '2028-01-09',
        term2End: calendarData.term2End || '2028-05-19',
        holidays: calendarData.holidays || [],
      };
      setCalendars((prev) => [newCal, ...prev]);
    }
    setViewMode('list');
    setEditingCalendar(null);
  };

  if (viewMode === 'form') {
    return (
      <AcademicCalendarFormView
        initialData={editingCalendar}
        defaultCountry={selectedCountry}
        onSave={handleSaveCalendar}
        onCancel={() => {
          setViewMode('list');
          setEditingCalendar(null);
        }}
        onDelete={handleDeleteCalendar}
      />
    );
  }

  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* Top Filter and Action Bar matching Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right side: Country Pill Selectors */}
        <div className="flex items-center gap-2.5">
          {countryTabs.map((country) => {
            const isSelected = selectedCountry === country.code;
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => setSelectedCountry(country.code)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#48877b] text-white shadow-xs'
                    : 'bg-[#edf2f7] hover:bg-[#e2e8f0] text-slate-700'
                }`}
              >
                {country.label}
              </button>
            );
          })}
        </div>

        {/* Left side: "+ إضافة تقويم أكاديمي" Button */}
        <div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto bg-[#48877b] hover:bg-[#3d756a] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>+ إضافة تقويم أكاديمي</span>
          </button>
        </div>
      </div>

      {/* Main Table Card matching Screenshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-xs">
        {/* Card Title */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <h3 className="text-base sm:text-lg font-black text-[#19223c]">
            تقاويم {currentCountryObj.nameAr} ({filteredCalendars.length})
          </h3>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs sm:text-[13px] font-bold text-slate-500 pb-4">
                <th className="py-3.5 px-3 text-right font-bold text-[#19223c]">
                  السنة الدراسية
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-[#19223c]">
                  بداية الفصل الأول
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-[#19223c]">
                  نهاية الفصل الأول
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-[#19223c]">
                  بداية الفصل الثاني
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-[#19223c]">
                  نهاية الفصل الثاني
                </th>
                <th className="py-3.5 px-3 text-left font-bold text-[#19223c]">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredCalendars.map((cal) => (
                <tr
                  key={cal.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Academic Year */}
                  <td className="py-4 px-3 text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#19223c] tracking-wide">
                      {cal.academicYear}
                    </span>
                  </td>

                  {/* Term 1 Start */}
                  <td className="py-4 px-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {cal.term1Start}
                    </span>
                  </td>

                  {/* Term 1 End */}
                  <td className="py-4 px-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {cal.term1End}
                    </span>
                  </td>

                  {/* Term 2 Start */}
                  <td className="py-4 px-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {cal.term2Start}
                    </span>
                  </td>

                  {/* Term 2 End */}
                  <td className="py-4 px-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {cal.term2End}
                    </span>
                  </td>

                  {/* Actions (Pencil & Trash matching Screenshot) */}
                  <td className="py-4 px-3 text-left">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cal)}
                        className="w-8 h-8 rounded-xl bg-[#f4f6fa] hover:bg-[#e8ecf4] text-[#da684a] hover:text-[#c45336] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        title="تعديل التقويم"
                      >
                        <Pencil className="w-4 h-4 stroke-[2]" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmCalendar(cal)}
                        className="w-8 h-8 rounded-xl bg-[#feeae6] hover:bg-[#fed9d2] text-[#e0564c] hover:text-[#c73e34] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        title="حذف التقويم"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCalendars.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#48877b]" />
              <p className="text-sm font-bold text-[#19223c]">
                لا توجد تقاويم أكاديمية مضافة لـ {currentCountryObj.nameAr}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                انقر على زر «+ إضافة تقويم أكاديمي» لإضافة سنة دراسية جديدة.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Standard Delete Confirmation Popup */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmCalendar)}
        title={`حذف التقويم الأكاديمي: ${deleteConfirmCalendar?.academicYear || ''}`}
        warningMessage={`هل أنت متأكد من رغبتك في حذف هذا التقويم الأكاديمي (${deleteConfirmCalendar?.academicYear || ''}) لـ ${currentCountryObj.nameAr}؟ — لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف التقويم"
        onConfirm={() => {
          if (deleteConfirmCalendar) {
            handleDeleteCalendar(deleteConfirmCalendar.id);
            setDeleteConfirmCalendar(null);
          }
        }}
        onCancel={() => setDeleteConfirmCalendar(null)}
      />
    </div>
  );
};
