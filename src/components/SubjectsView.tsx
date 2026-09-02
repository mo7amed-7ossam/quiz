import React, { useState, useRef, useEffect } from 'react';
import { SubjectItem } from '../types';
import { initialSubjectsData } from '../data/mockData';
import {
  Globe2,
  BookOpen,
  ChevronDown,
  Check,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { SubjectFormView } from './SubjectFormView';

interface SubjectsViewProps {
  onFormStateChange?: (state: {
    isForm: boolean;
    isEditing: boolean;
    subjectName?: string;
    onBack: () => void;
  } | null) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ onFormStateChange }) => {
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjectsData);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);

  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [selectedGrade, setSelectedGrade] = useState('السادس الابتدائي');
  const [selectedCurriculum, setSelectedCurriculum] = useState('منهج وزاري');

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isCurriculumFilterOpen, setIsCurriculumFilterOpen] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  const curriculumDropdownRef = useRef<HTMLDivElement>(null);

  // Sync form state with App header breadcrumbs
  useEffect(() => {
    if (onFormStateChange) {
      if (viewMode === 'form') {
        onFormStateChange({
          isForm: true,
          isEditing: Boolean(editingSubject),
          subjectName: editingSubject?.nameAr,
          onBack: () => {
            setViewMode('list');
            setEditingSubject(null);
          },
        });
      } else {
        onFormStateChange(null);
      }
    }
  }, [viewMode, editingSubject, onFormStateChange]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target as Node)) {
        setIsGradeOpen(false);
      }
      if (curriculumDropdownRef.current && !curriculumDropdownRef.current.contains(event.target as Node)) {
        setIsCurriculumFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Countries and Grades options
  const countryOptions = [
    { code: 'SA', label: 'SA السعودية' },
    { code: 'EG', label: 'EG مصر' },
    { code: 'AE', label: 'AE الإمارات' },
    { code: 'KW', label: 'KW الكويت' },
    { code: 'QA', label: 'QA قطر' },
  ];

  const gradeOptions = [
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

  const curriculumFilterOptions = [
    'منهج وزاري',
    'منهج دولي (IB)',
    'منهج دولي (أمريكي)',
    'منهج دولي (بريطاني)',
    'منهج دولي فقط',
    'الكل (جميع المناهج)',
  ];

  // Helper to render Subject Icon/Emoji
  const renderSubjectEmojiOrIcon = (subject: SubjectItem) => {
    return (
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 select-none"
        style={{ backgroundColor: subject.iconBgColor }}
      >
        {subject.emoji ? (
          <span className="text-2xl sm:text-3xl leading-none flex items-center justify-center">
            {subject.emoji}
          </span>
        ) : (
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.8]" />
        )}
      </div>
    );
  };

  // Toggle single subject status
  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  // Switch to Add Form view
  const handleOpenAddForm = () => {
    setEditingSubject(null);
    setViewMode('form');
  };

  // Switch to Edit Form view
  const handleOpenEditForm = (subject: SubjectItem) => {
    setEditingSubject(subject);
    setViewMode('form');
  };

  // Save subject (Add or Update)
  const handleSaveSubject = (formData: Partial<SubjectItem>) => {
    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubject.id
            ? ({
                ...s,
                ...formData,
              } as SubjectItem)
            : s
        )
      );
    } else {
      const newSubject: SubjectItem = {
        id: `subj-${Date.now()}`,
        nameAr: formData.nameAr || '',
        nameEn: formData.nameEn || '',
        unitsCount: formData.unitsCount || 6,
        iconBgColor: formData.iconBgColor || '#19223c',
        iconColorName: formData.iconColorName || 'Navy',
        emoji: formData.emoji || '📘',
        status: formData.status !== undefined ? formData.status : true,
        countryCode: selectedCountry,
        gradeId: formData.gradeId || selectedGrade,
      };
      setSubjects((prev) => [...prev, newSubject]);
    }
    setViewMode('list');
    setEditingSubject(null);
  };

  // Delete subject
  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setViewMode('list');
    setEditingSubject(null);
  };

  const selectedCountryLabel =
    countryOptions.find((c) => c.code === selectedCountry)?.label || 'SA السعودية';

  // If in Form View (Add / Edit Subject screen matching the screenshot)
  if (viewMode === 'form') {
    return (
      <SubjectFormView
        initialData={editingSubject}
        defaultGrade={selectedGrade}
        defaultCountry={selectedCountry}
        onSave={handleSaveSubject}
        onCancel={() => {
          setViewMode('list');
          setEditingSubject(null);
        }}
        onDelete={editingSubject ? () => handleDeleteSubject(editingSubject.id) : undefined}
      />
    );
  }

  // List View
  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* Top Filter Bar and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right side: Dropdowns (Country, Grade, Curriculum) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Country Selector */}
          <div className="relative" ref={countryDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsCountryOpen(!isCountryOpen);
                setIsGradeOpen(false);
                setIsCurriculumFilterOpen(false);
              }}
              className="bg-white border border-[#48877b]/80 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center gap-2.5 cursor-pointer transition-colors shadow-2xs min-w-[160px] justify-between"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                  isCountryOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
              <span className="truncate">{selectedCountryLabel}</span>
            </button>

            {isCountryOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
                {countryOptions.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setIsCountryOpen(false);
                    }}
                    className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right flex items-center justify-between ${
                      selectedCountry === country.code
                        ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                        : 'text-[#19223c]'
                    }`}
                  >
                    <span>{country.label}</span>
                    {selectedCountry === country.code && (
                      <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grade Selector */}
          <div className="relative" ref={gradeDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsGradeOpen(!isGradeOpen);
                setIsCountryOpen(false);
                setIsCurriculumFilterOpen(false);
              }}
              className="bg-white border border-[#48877b]/80 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center gap-2.5 cursor-pointer transition-colors shadow-2xs min-w-[190px] justify-between"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                  isGradeOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
              <span className="truncate">الصف: {selectedGrade}</span>
            </button>

            {isGradeOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
                {gradeOptions.map((grade) => (
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
                    <span>الصف: {grade}</span>
                    {selectedGrade === grade && (
                      <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Curriculum Selector (المنهج) */}
          <div className="relative" ref={curriculumDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsCurriculumFilterOpen(!isCurriculumFilterOpen);
                setIsCountryOpen(false);
                setIsGradeOpen(false);
              }}
              className="bg-white border border-[#48877b]/80 hover:border-[#48877b] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] flex items-center gap-2.5 cursor-pointer transition-colors shadow-2xs min-w-[180px] justify-between"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#19223c] stroke-[2.2] transition-transform duration-150 ${
                  isCurriculumFilterOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
              <span className="truncate">المنهج: {selectedCurriculum}</span>
            </button>

            {isCurriculumFilterOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
                {curriculumFilterOptions.map((curr) => (
                  <div
                    key={curr}
                    onClick={() => {
                      setSelectedCurriculum(curr);
                      setIsCurriculumFilterOpen(false);
                    }}
                    className={`px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors text-right flex items-center justify-between ${
                      selectedCurriculum === curr
                        ? 'font-bold text-[#48877b] bg-[#eef7f5]'
                        : 'text-[#19223c]'
                    }`}
                  >
                    <span>{curr}</span>
                    {selectedCurriculum === curr && (
                      <Check className="w-3.5 h-3.5 text-[#48877b] stroke-[3]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left side: "+ إضافة مادة" Button */}
        <div>
          <button
            type="button"
            onClick={handleOpenAddForm}
            className="w-full sm:w-auto bg-[#48877b] hover:bg-[#3d756a] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>+ إضافة مادة</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid (Matching design: 4 cards per row on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => handleOpenEditForm(subject)}
            className="group bg-white rounded-3xl p-6 border border-slate-100/90 hover:border-[#48877b]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center cursor-pointer relative"
          >
            {/* Subject Icon in Rounded Square */}
            <div className="mt-2 mb-4">
              {renderSubjectEmojiOrIcon(subject)}
            </div>

            {/* Subject Arabic Name */}
            <h4 className="text-base sm:text-[17px] font-black text-[#19223c] mb-0.5 tracking-tight group-hover:text-[#48877b] transition-colors">
              {subject.nameAr}
            </h4>

            {/* Subject English Name */}
            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1.5">
              {subject.nameEn}
            </p>

            {/* Units Count */}
            <p className="text-xs sm:text-[13px] font-bold text-slate-400 mb-5">
              {subject.unitsCount} وحدات
            </p>

            {/* Status Toggle Switch */}
            <div
              className="mt-auto pt-1"
              onClick={(e) => handleToggleStatus(subject.id, e)}
              title={subject.status ? 'نشط (انقر للتعطيل)' : 'غير نشط (انقر للتفعيل)'}
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  subject.status ? 'bg-[#559185]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    subject.status ? 'translate-x-0' : '-translate-x-5'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State if No Subjects */}
      {subjects.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-[#19223c] mb-1">لا توجد مواد دراسية</h4>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            لم يتم إضافة مواد دراسية بعد لهذا الصف. انقر على «+ إضافة مادة» للبدء.
          </p>
          <button
            onClick={handleOpenAddForm}
            className="bg-[#48877b] hover:bg-[#3d756a] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>+ إضافة مادة الآن</span>
          </button>
        </div>
      )}
    </div>
  );
};
