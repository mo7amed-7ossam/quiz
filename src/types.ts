export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  iconType: 'lesson' | 'user' | 'question' | 'country';
}

export interface ReviewItem {
  id: string;
  type: string;
  iconType: 'curriculum' | 'question' | 'country';
  title: string;
  author: string;
  status: 'قيد المراجعة' | 'مسودة' | 'معتمد' | 'مرفوض';
  statusColor: 'amber' | 'purple' | 'emerald' | 'rose';
  date?: string;
  details?: string;
}

export interface ChartDataPoint {
  day: number;
  label: string;
  students: number;
  parents: number;
}

export interface CountryItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  currency?: string;
  defaultLanguage: string;
  curriculumSystem: string;
  gradesCount: number;
  status: 'نشط' | 'قريباً' | 'معطل';
}

export interface SubjectItem {
  id: string;
  nameAr: string;
  nameEn: string;
  unitsCount: number;
  iconBgColor: string;
  iconColorName?: string;
  emoji?: string;
  iconType?: 'english' | 'arabic' | 'science' | 'math' | 'social' | 'islamic' | 'art' | 'tech' | 'custom';
  status: boolean;
  countryCode: string;
  gradeId: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  type: 'اختيار من متعدد' | 'صح / خطأ' | 'مقالي قصير';
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  skillTag?: 'فهم' | 'تطبيق' | 'تحليل' | 'تذكّر';
  country?: string;
  grade?: string;
  subject?: string;
  unit?: string;
  group?: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswer?: string;
}

