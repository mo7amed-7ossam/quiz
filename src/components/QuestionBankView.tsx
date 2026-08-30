import React, { useState, useEffect } from 'react';
import {
  FileUp,
  Edit2,
  Trash2,
  AlertCircle,
  Download,
  X,
} from 'lucide-react';
import { QuestionItem } from '../types';
import { initialQuestionsData } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import { QuestionFormView } from './QuestionFormView';

export interface QuestionBankFormState {
  isForm: boolean;
  isEditing: boolean;
  onBack: () => void;
}

interface QuestionBankViewProps {
  onFormStateChange?: (state: QuestionBankFormState | null) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onFormStateChange }) => {
  // View Mode: 'list' or 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  // Filters State matching screenshot
  const [selectedCountry, setSelectedCountry] = useState('SA السعودية');
  const [selectedGrade, setSelectedGrade] = useState('السادس الابتدائي');
  const [selectedSubject, setSelectedSubject] = useState('رياضيات 🔢');
  const [selectedUnit, setSelectedUnit] = useState('الوحدة 1 — الأعداد والعمليات');
  const [selectedGroup, setSelectedGroup] = useState('الجمع والطرح');

  const [selectedDifficulty, setSelectedDifficulty] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل');

  // Questions List State
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestionsData);
  const [activeRowId, setActiveRowId] = useState<string | null>('q-1');

  // State for adding or editing
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter questions according to secondary dropdowns
  const filteredQuestions = questions.filter((q) => {
    const matchDiff = selectedDifficulty === 'الكل' || q.difficulty === selectedDifficulty;
    const matchType = selectedType === 'الكل' || q.type === selectedType;
    return matchDiff && matchType;
  });

  // Notify parent of sub-view state (title / breadcrumbs)
  useEffect(() => {
    if (onFormStateChange) {
      if (viewMode === 'form') {
        onFormStateChange({
          isForm: true,
          isEditing: !!editingQuestion,
          onBack: () => {
            setViewMode('list');
            setEditingQuestion(null);
          },
        });
      } else {
        onFormStateChange(null);
      }
    }
  }, [viewMode, editingQuestion, onFormStateChange]);

  const handleOpenAddForm = () => {
    setEditingQuestion(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (q: QuestionItem) => {
    setEditingQuestion(q);
    setViewMode('form');
  };

  const handleSaveQuestionData = (formData: Partial<QuestionItem>) => {
    if (editingQuestion) {
      // Update existing
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                ...formData,
              }
            : q
        )
      );
    } else {
      // Add new
      const newQ: QuestionItem = {
        id: `q-${Date.now()}`,
        question: formData.question || 'سؤال جديد',
        type: formData.type || 'اختيار من متعدد',
        difficulty: formData.difficulty || 'سهل',
        skillTag: formData.skillTag || 'فهم',
        country: selectedCountry,
        grade: selectedGrade,
        subject: selectedSubject,
        unit: selectedUnit,
        group: formData.group || selectedGroup,
        options: formData.options,
        correctOptionIndex: formData.correctOptionIndex,
        correctAnswer: formData.correctAnswer,
      };
      setQuestions((prev) => [newQ, ...prev]);
    }
    setViewMode('list');
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setDeleteConfirmId(null);
    if (viewMode === 'form') {
      setViewMode('list');
      setEditingQuestion(null);
    }
  };

  const getDifficultyBadge = (difficulty: QuestionItem['difficulty']) => {
    switch (difficulty) {
      case 'سهل':
        return (
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-[#e6f4ea] text-[#137333]">
            سهل
          </span>
        );
      case 'متوسط':
        return (
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-[#fef7e0] text-[#b06000]">
            متوسط
          </span>
        );
      case 'صعب':
        return (
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-[#fce8e6] text-[#c5221f]">
            صعب
          </span>
        );
    }
  };

  // Helper to render the Delete Confirmation Modal
  const renderDeleteModal = () => {
    if (!deleteConfirmId) return null;
    const targetQuestion = questions.find((q) => q.id === deleteConfirmId);
    const questionSnippet = targetQuestion ? targetQuestion.question : 'السؤال المحدد';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-cairo" dir="rtl">
        <div className="bg-white rounded-3xl w-full max-w-lg p-7 sm:p-9 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
          {/* Trash Icon */}
          <div className="flex items-center justify-center mb-5 text-[#2c3e50]">
            <Trash2 className="w-11 h-11 stroke-[1.4] text-slate-700" />
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#19223c] mb-4">
            حذف السؤال: {questionSnippet.length > 35 ? questionSnippet.slice(0, 35) + '...' : questionSnippet}
          </h3>

          {/* Warning Notice Box */}
          <div className="bg-[#fef4f2] border border-[#fbdcd6] rounded-2xl p-4 sm:p-5 mb-7 text-center">
            <p className="text-xs sm:text-[13px] text-[#b93822] font-semibold leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا السؤال من بنك الأسئلة؟ — لا يمكن التراجع عن هذا الإجراء وسيتم إزالته من جميع المجموعات المرتبطة.
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => handleDelete(deleteConfirmId)}
              className="px-8 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              حذف السؤال
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-8 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If in Form View, render QuestionFormView
  if (viewMode === 'form') {
    return (
      <>
        <QuestionFormView
          initialData={editingQuestion}
          onSave={handleSaveQuestionData}
          onCancel={() => {
            setViewMode('list');
            setEditingQuestion(null);
          }}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
        {renderDeleteModal()}
      </>
    );
  }

  // Otherwise, render Question Bank List View
  return (
    <div className="space-y-6 px-4 sm:px-8 pb-12 font-cairo">
      {/* 1. Top Filter Scope Card ("نطاق الأسئلة المعروضة") */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          نطاق الأسئلة المعروضة
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          اختر الدولة أولاً، ثم الصف، فالمادة، فالوحدة — يتحدّث كل مستوى تلقائياً حسب المستوى الذي قبله، وصولاً للمجموعة الفرعية التي تُضاف إليها الأسئلة.
        </p>

        {/* Cascading Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-end">
          {/* Country */}
          <CustomSelect
            label="الدولة"
            required
            value={selectedCountry}
            onChange={setSelectedCountry}
            options={[
              'SA السعودية',
              'EG مصر',
              'AE الإمارات',
            ]}
          />

          {/* Grade / Class */}
          <CustomSelect
            label="الصف"
            required
            value={selectedGrade}
            onChange={setSelectedGrade}
            options={[
              'السادس الابتدائي',
              'الخامس الابتدائي',
            ]}
          />

          {/* Subject */}
          <CustomSelect
            label="المادة"
            required
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={[
              'رياضيات 🔢',
              'علوم 🔬',
              'لغة عربية 📖',
            ]}
          />

          {/* Unit */}
          <CustomSelect
            label="الوحدة"
            required
            value={selectedUnit}
            onChange={setSelectedUnit}
            options={[
              'الوحدة 1 — الأعداد والعمليات',
              'الوحدة 2 — الكسور',
            ]}
          />

          {/* Group */}
          <CustomSelect
            label="المجموعة"
            required
            value={selectedGroup}
            onChange={setSelectedGroup}
            options={[
              'الجمع والطرح',
              'الضرب والقسمة',
            ]}
          />
        </div>

        {/* Secondary Filter Row: Difficulty & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <CustomSelect
            label="الصعوبة"
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            borderColor="border-slate-200"
            options={['الكل', 'سهل', 'متوسط', 'صعب']}
          />

          <CustomSelect
            label="النوع"
            value={selectedType}
            onChange={setSelectedType}
            borderColor="border-slate-200"
            options={[
              'الكل',
              'اختيار من متعدد',
              'صح / خطأ',
              'مقالي قصير',
            ]}
          />
        </div>
      </div>

      {/* 2. Action Buttons Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Primary Add Question Button */}
        <button
          onClick={handleOpenAddForm}
          className="bg-[#48877b] hover:bg-[#3b7268] active:scale-[0.99] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-[#48877b]/20 flex items-center gap-2 cursor-pointer"
        >
          <span>+ إضافة سؤال</span>
        </button>

        {/* Secondary Import Button */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl border border-slate-300 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
        >
          <span>استيراد ملف</span>
        </button>
      </div>

      {/* 3. Questions Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-slate-900">
            الأسئلة ({filteredQuestions.length || 24})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                <th className="pb-3 pr-4 font-bold text-right">السؤال</th>
                <th className="pb-3 px-4 font-bold text-center">النوع</th>
                <th className="pb-3 px-4 font-bold text-center">الصعوبة</th>
                <th className="pb-3 pl-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredQuestions.map((q) => {
                const isSelected = activeRowId === q.id;

                return (
                  <tr
                    key={q.id}
                    onClick={() => setActiveRowId(q.id)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#edf7f4]'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Question text */}
                    <td className="py-4 pr-4 font-medium text-slate-800">
                      <span className="text-slate-900 group-hover:text-teal-800 transition-colors">
                        {q.question}
                      </span>
                    </td>

                    {/* Question Type */}
                    <td className="py-4 px-4 text-center text-slate-600 whitespace-nowrap text-xs sm:text-[13px]">
                      {q.type}
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {getDifficultyBadge(q.difficulty)}
                    </td>

                    {/* Actions: Edit & Delete buttons */}
                    <td className="py-4 pl-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditForm(q);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="تعديل السؤال"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(q.id);
                          }}
                          className="w-7 h-7 rounded-lg bg-[#fce8e6] hover:bg-rose-200 text-[#c5221f] flex items-center justify-center transition-colors cursor-pointer"
                          title="حذف السؤال"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {renderDeleteModal()}

      {/* Import File Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-cairo">
          <div
            className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl text-right animate-in fade-in zoom-in-95 duration-150"
            dir="rtl"
          >
            {/* 1. Modal Header */}
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#19223c] mb-2">
                استيراد ملف أسئلة
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                استورد مجموعة أسئلة دفعة واحدة عبر ملف Excel بالتنسيق المعتمد، ضمن المادة والوحدة/المجموعة المختارة أعلى الشاشة. جميع الأسئلة المستوردة تُضاف بحالة قابلة للمراجعة قبل ظهورها في الاختبارات.
              </p>
            </div>

            {/* 2. Download Template Notice Box */}
            <div className="bg-[#f0f4f8] rounded-xl py-3 px-4 text-center mb-5 text-xs sm:text-[13px]">
              <span className="text-slate-600">📄 لم تجهّز الملف بعد؟ </span>
              <button
                type="button"
                onClick={() => {
                  alert('تم تنزيل نموذج ملف Excel بنجاح.');
                }}
                className="text-[#3a7c70] hover:text-[#2d6258] font-bold underline decoration-[#3a7c70]/40 hover:decoration-[#3a7c70] cursor-pointer inline-flex items-center gap-1"
              >
                تحميل نموذج Excel الفارغ
              </button>
            </div>

            {/* 3. Choose File Field */}
            <div className="mb-5">
              <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2">
                اختر الملف <span className="text-rose-500">*</span>
              </label>

              <label className="border-2 border-dashed border-slate-300 hover:border-[#48877b] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50/60 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      alert(`تم اختيار الملف: ${e.target.files[0].name}`);
                    }
                  }}
                />
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <span className="text-lg">📁</span>
                  <span>اسحب ملف Excel هنا أو اضغط للاختيار — XLSX, حتى 10MB</span>
                </div>
              </label>
            </div>

            {/* 4. Import Scope Context */}
            <div className="mb-6">
              <label className="block text-xs sm:text-[13px] font-bold text-slate-600 mb-2">
                سيُستورد ضمن
              </label>
              <div className="bg-[#f4f7fa] border border-slate-200/90 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                {selectedSubject.replace(/[^\u0600-\u06FF\s]/g, '').trim()} ← {selectedGrade} ← {selectedGroup}
              </div>
            </div>

            {/* 5. Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#111827] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
              >
                استيراد الأسئلة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
