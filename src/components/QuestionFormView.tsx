import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { QuestionItem } from '../types';
import { CustomSelect } from './CustomSelect';

interface QuestionFormViewProps {
  initialData?: QuestionItem | null;
  onSave: (questionData: Partial<QuestionItem>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const QuestionFormView: React.FC<QuestionFormViewProps> = ({
  initialData,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [type, setType] = useState<QuestionItem['type']>(
    initialData?.type || 'اختيار من متعدد'
  );
  const [questionText, setQuestionText] = useState(
    initialData?.question || 'ما ناتج 25 + 17 ؟'
  );
  const [options, setOptions] = useState<string[]>(
    initialData?.options && initialData.options.length === 4
      ? initialData.options
      : ['42', '30', '38', '44']
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(
    initialData?.correctOptionIndex !== undefined ? initialData.correctOptionIndex : 0
  );
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<'صحيح' | 'خطأ'>(
    (initialData?.correctAnswer as 'صحيح' | 'خطأ') || 'صحيح'
  );
  const [essayAnswer, setEssayAnswer] = useState<string>(
    initialData?.correctAnswer || ''
  );
  const [group, setGroup] = useState<string>(
    initialData?.group || 'الجمع والطرح'
  );
  const [difficulty, setDifficulty] = useState<QuestionItem['difficulty']>(
    initialData?.difficulty || 'سهل'
  );
  const [skillTag, setSkillTag] = useState<'فهم' | 'تطبيق' | 'تحليل' | 'تذكّر'>(
    initialData?.skillTag || 'فهم'
  );

  const handleOptionTextChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    let finalCorrectAnswer = '';
    if (type === 'اختيار من متعدد') {
      finalCorrectAnswer = options[correctOptionIndex] || '';
    } else if (type === 'صح / خطأ') {
      finalCorrectAnswer = trueFalseAnswer;
    } else {
      finalCorrectAnswer = essayAnswer;
    }

    onSave({
      question: questionText,
      type,
      options: type === 'اختيار من متعدد' ? options : type === 'صح / خطأ' ? ['صحيح', 'خطأ'] : undefined,
      correctOptionIndex: type === 'اختيار من متعدد' ? correctOptionIndex : undefined,
      correctAnswer: finalCorrectAnswer,
      group,
      difficulty,
      skillTag,
    });
  };

  return (
    <div className="px-4 sm:px-8 pb-16 font-cairo" dir="rtl">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
        {/* Section Header matching reference image: "البيانات الأساسية" */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
            البيانات الأساسية
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          {/* 1. Question Type */}
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2.5">
              نوع السؤال <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {(['اختيار من متعدد', 'صح / خطأ', 'مقالي قصير'] as const).map((t) => {
                const isSelected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#48877b] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Question Text */}
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2">
              نص السؤال <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="اكتب نص السؤال هنا..."
              className="w-full bg-white text-slate-800 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl border border-[#48877b] focus:border-[#48877b] focus:ring-2 focus:ring-[#48877b]/20 outline-hidden shadow-2xs transition-all"
            />
          </div>

          {/* 3. Options (for Multiple Choice) */}
          {type === 'اختيار من متعدد' && (
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2.5">
                الخيارات <span className="text-rose-500">*</span> — حدّد الإجابة الصحيحة
              </label>

              <div className="space-y-3">
                {options.map((optVal, idx) => {
                  const isCorrect = correctOptionIndex === idx;

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      {/* Input Box */}
                      <input
                        type="text"
                        value={optVal}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`الخيار ${idx + 1}`}
                        className="flex-1 bg-white text-slate-800 text-xs sm:text-sm font-medium py-2.5 px-4 rounded-xl border border-[#48877b] focus:border-[#48877b] focus:ring-2 focus:ring-[#48877b]/20 outline-hidden shadow-2xs transition-all"
                      />

                      {/* Correct Answer Indicator Radio / Check */}
                      <button
                        type="button"
                        onClick={() => setCorrectOptionIndex(idx)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isCorrect
                            ? 'bg-[#48877b] text-white ring-2 ring-[#48877b]/20 shadow-xs'
                            : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                        }`}
                        title="تحديد كإجابة صحيحة"
                      >
                        {isCorrect && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3b. Options (for True / False) */}
          {type === 'صح / خطأ' && (
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2.5">
                الإجابة الصحيحة <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {(['صحيح', 'خطأ'] as const).map((choice) => {
                  const isSelected = trueFalseAnswer === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setTrueFalseAnswer(choice)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#48877b] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3c. Options (for Short Essay) */}
          {type === 'مقالي قصير' && (
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2">
                نموذج الإجابة المقبول
              </label>
              <textarea
                rows={3}
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                placeholder="اكتب معايير أو نص الإجابة النموذجية..."
                className="w-full bg-white text-slate-800 text-xs sm:text-sm font-medium p-3 rounded-xl border border-[#48877b] focus:border-[#48877b] focus:ring-2 focus:ring-[#48877b]/20 outline-hidden shadow-2xs transition-all"
              />
            </div>
          )}

          {/* 4. Group Dropdown */}
          <div>
            <CustomSelect
              label="المجموعة"
              required
              value={group}
              onChange={setGroup}
              options={['الجمع والطرح', 'الضرب والقسمة']}
            />
          </div>

          {/* 5. Difficulty Level */}
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2">
              مستوى الصعوبة <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {(['سهل', 'متوسط', 'صعب'] as const).map((lvl) => {
                const isSelected = difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#48877b] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Skill Tag */}
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2">
              وسم المهارة
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {(['فهم', 'تطبيق', 'تحليل', 'تذكّر'] as const).map((tag) => {
                const isSelected = skillTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSkillTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#48877b] text-white shadow-xs'
                        : 'bg-[#eef2f6] text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Danger Zone: Delete Question (Shown when editing existing question) */}
          {initialData?.id && (
            <div className="mt-8 bg-[#fef4f2] border border-dashed border-[#fbdcd6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-right">
                <h4 className="text-sm sm:text-base font-bold text-[#b93822] mb-1">
                  حذف السؤال
                </h4>
                <p className="text-xs sm:text-[13px] text-[#b93822]/90 leading-relaxed font-semibold">
                  لا يمكن التراجع عن حذف السؤال بعد تأكيده — سيتم إزالته نهائياً من بنك الأسئلة والمجموعات المرتبطة.
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
                حذف السؤال
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#111827] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
            >
              حفظ السؤال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
