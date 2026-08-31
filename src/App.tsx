import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header, BreadcrumbItem } from './components/Header';
import { StatCards } from './components/StatCards';
import { UsageChart } from './components/UsageChart';
import { RecentActivities } from './components/RecentActivities';
import { PendingReviewsTable } from './components/PendingReviewsTable';
import { ReviewModal } from './components/ReviewModal';
import { LoginScreen } from './components/LoginScreen';
import { QuestionBankView, QuestionBankFormState } from './components/QuestionBankView';
import { CountriesView } from './components/CountriesView';
import { SubjectsView } from './components/SubjectsView';
import { AcademicCalendarView } from './components/AcademicCalendarView';
import {
  statsData,
  activitiesData,
  initialReviewItems,
  usageChartData,
} from './data/mockData';
import { ReviewItem } from './types';
import {
  Globe2,
  GraduationCap,
  BookOpen,
  Compass,
  HelpCircle,
  CalendarDays,
  Users2,
  CreditCard,
  Trophy,
  BellRing,
  Bot,
  ShieldCheck,
  Settings,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

const TAB_TITLES: Record<string, string> = {
  dashboard: 'لوحة التحكم',
  countries: 'الدول',
  classes: 'الصفوف الدراسية',
  subjects: 'المواد الدراسية',
  curriculum: 'المنهج الدراسي',
  question_bank: 'بنك الأسئلة',
  calendar: 'التقويم الأكاديمي',
  users: 'المستخدمون',
  subscriptions: 'الاشتراكات والخطط',
  achievements: 'الإنجازات والمكافآت',
  notifications: 'قوالب الإشعارات',
  ai_safety: 'المساعد الذكي والسلامة',
  roles: 'الأدوار والصلاحيات',
  general_settings: 'الإعدادات العامة',
  reports: 'التقارير والتحليلات',
  companion_catalog: 'كتالوج الرفيق التعليمي',
  design_system: 'نظام التصميم',
  parent_reviews: 'مراجعة آراء أولياء الأمور',
};

const TAB_GROUPS: Record<string, string> = {
  dashboard: 'الرئيسية',
  countries: 'الإعداد التأسيسي',
  classes: 'الإعداد التأسيسي',
  subjects: 'الإعداد التأسيسي',
  curriculum: 'الإعداد التأسيسي',
  question_bank: 'الإعداد التأسيسي',
  calendar: 'الإعداد التأسيسي',
  users: 'المستخدمون',
  subscriptions: 'المستخدمون',
  achievements: 'التحفيز والإشعارات',
  notifications: 'التحفيز والإشعارات',
  ai_safety: 'الذكاء الاصطناعي والسلامة',
  roles: 'الحوكمة',
  general_settings: 'الحوكمة',
  reports: 'التقارير',
  companion_catalog: 'الرفيق التعليمي',
  design_system: 'النظام',
  parent_reviews: 'خدمة العملاء',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>('dashboard');
  const [activeTab, setActiveTab] = useState('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(initialReviewItems);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [questionBankFormState, setQuestionBankFormState] = useState<QuestionBankFormState | null>(null);
  const [countriesFormState, setCountriesFormState] = useState<{
    isForm: boolean;
    isEditing: boolean;
    countryName?: string;
    onBack: () => void;
  } | null>(null);
  const [subjectsFormState, setSubjectsFormState] = useState<{
    isForm: boolean;
    isEditing: boolean;
    subjectName?: string;
    onBack: () => void;
  } | null>(null);
  const [calendarFormState, setCalendarFormState] = useState<{
    isForm: boolean;
    isEditing: boolean;
    calendarYear?: string;
    onBack: () => void;
  } | null>(null);

  const handleUpdateStatus = (id: string, newStatus: ReviewItem['status']) => {
    setReviewItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              statusColor:
                newStatus === 'معتمد'
                  ? 'emerald'
                  : newStatus === 'مرفوض'
                  ? 'rose'
                  : newStatus === 'مسودة'
                  ? 'purple'
                  : 'amber',
            }
          : item
      )
    );
  };

  const handleOpenReview = (item: ReviewItem) => {
    setSelectedReview(item);
    setIsReviewModalOpen(true);
  };

  const handleViewAllReviews = () => {
    setSelectedReview(null);
    setIsReviewModalOpen(true);
  };

  // If in login screen view
  if (currentView === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => setCurrentView('dashboard')}
        onBackToHome={() => setCurrentView('dashboard')}
      />
    );
  }

  // Filter items if user typed in the quick search bar
  const filteredActivities = activitiesData.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviewItems.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render secondary tab placeholder views with quick return
  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <main className="py-6 space-y-6">
          {/* 4 Stat Cards */}
          <StatCards stats={statsData} />

          {/* Middle Row: Recent Activities (Left) & Usage 30-Day Chart (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-4 sm:px-8">
            {/* Recent Activities (Left) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <RecentActivities activities={filteredActivities} />
            </div>

            {/* Usage 30-day Chart (Right) */}
            <div className="lg:col-span-7 xl:col-span-8">
              <UsageChart data={usageChartData} />
            </div>
          </div>

          {/* Bottom Table: Pending Reviews */}
          <PendingReviewsTable
            items={filteredReviews}
            onSelectReview={handleOpenReview}
            onViewAll={handleViewAllReviews}
          />
        </main>
      );
    }

    if (activeTab === 'countries') {
      return (
        <main className="py-6">
          <CountriesView onFormStateChange={setCountriesFormState} />
        </main>
      );
    }

    if (activeTab === 'subjects') {
      return (
        <main className="py-6">
          <SubjectsView onFormStateChange={setSubjectsFormState} />
        </main>
      );
    }

    if (activeTab === 'calendar') {
      return (
        <main className="py-6">
          <AcademicCalendarView onFormStateChange={setCalendarFormState} />
        </main>
      );
    }

    if (activeTab === 'question_bank') {
      return (
        <main className="py-6">
          <QuestionBankView onFormStateChange={setQuestionBankFormState} />
        </main>
      );
    }

    // Generic sub-view for sidebar navigation links
    const getTabIcon = () => {
      switch (activeTab) {
        case 'countries': return <Globe2 className="w-8 h-8 text-teal-600" />;
        case 'classes': return <GraduationCap className="w-8 h-8 text-teal-600" />;
        case 'subjects': return <BookOpen className="w-8 h-8 text-teal-600" />;
        case 'curriculum': return <Compass className="w-8 h-8 text-teal-600" />;
        case 'question_bank': return <HelpCircle className="w-8 h-8 text-teal-600" />;
        case 'calendar': return <CalendarDays className="w-8 h-8 text-teal-600" />;
        case 'users': return <Users2 className="w-8 h-8 text-teal-600" />;
        case 'subscriptions': return <CreditCard className="w-8 h-8 text-teal-600" />;
        case 'achievements': return <Trophy className="w-8 h-8 text-teal-600" />;
        case 'notifications': return <BellRing className="w-8 h-8 text-teal-600" />;
        case 'ai_safety': return <Bot className="w-8 h-8 text-teal-600" />;
        case 'roles': return <ShieldCheck className="w-8 h-8 text-teal-600" />;
        case 'general_settings': return <Settings className="w-8 h-8 text-teal-600" />;
        case 'reports': return <BarChart3 className="w-8 h-8 text-teal-600" />;
        default: return <ShieldCheck className="w-8 h-8 text-teal-600" />;
      }
    };

    return (
      <div className="py-6">
        <div className="mx-4 sm:mx-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 border border-teal-100">
            {getTabIcon()}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {TAB_TITLES[activeTab] || 'القسم المحدد'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            إدارة وتعديل بيانات {TAB_TITLES[activeTab]} في النظام التعليمي للمنصة.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>العودة إلى لوحة التحكم</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Dynamic header title and breadcrumbs when in sub-screens like "إضافة سؤال" or sub-tabs
  let customTitle: string | undefined;
  let customBreadcrumbs: BreadcrumbItem[] | undefined;
  let onHeaderBack: (() => void) | undefined;

  if (activeTab === 'question_bank' && questionBankFormState?.isForm) {
    const subTitle = questionBankFormState.isEditing ? 'تعديل سؤال' : 'إضافة سؤال';
    customTitle = subTitle;
    customBreadcrumbs = [
      { label: 'الإعداد التأسيسي' },
      { label: 'بنك الأسئلة', onClick: questionBankFormState.onBack },
      { label: subTitle },
    ];
    onHeaderBack = questionBankFormState.onBack;
  } else if (activeTab === 'countries' && countriesFormState?.isForm) {
    const subTitle = countriesFormState.isEditing
      ? `بيانات الدولة: ${countriesFormState.countryName || 'السعودية'}`
      : 'إضافة دولة جديدة';
    const actionLabel = countriesFormState.isEditing ? 'تعديل' : 'إضافة';
    customTitle = subTitle;
    customBreadcrumbs = [
      { label: 'الإعداد التأسيسي' },
      { label: 'الدول', onClick: countriesFormState.onBack },
      { label: actionLabel },
    ];
    onHeaderBack = countriesFormState.onBack;
  } else if (activeTab === 'subjects' && subjectsFormState?.isForm) {
    const subTitle = subjectsFormState.isEditing
      ? `بيانات المادة: ${subjectsFormState.subjectName || 'المادة الدراسية'}`
      : 'إضافة مادة جديدة';
    const actionLabel = subjectsFormState.isEditing ? 'تعديل' : 'إضافة';
    customTitle = subTitle;
    customBreadcrumbs = [
      { label: 'الإعداد التأسيسي' },
      { label: 'المواد الدراسية', onClick: subjectsFormState.onBack },
      { label: actionLabel },
    ];
    onHeaderBack = subjectsFormState.onBack;
  } else if (activeTab === 'calendar' && calendarFormState?.isForm) {
    const subTitle = calendarFormState.isEditing
      ? `تعديل تقويم أكاديمي: ${calendarFormState.calendarYear || ''}`
      : 'إضافة تقويم أكاديمي جديد';
    const actionLabel = calendarFormState.isEditing ? 'تعديل' : 'إضافة';
    customTitle = subTitle;
    customBreadcrumbs = [
      { label: 'الإعداد التأسيسي' },
      { label: 'التقويم الأكاديمي', onClick: calendarFormState.onBack },
      { label: actionLabel },
    ];
    onHeaderBack = calendarFormState.onBack;
  } else if (activeTab !== 'dashboard') {
    // Top-level sub-view (e.g., countries, classes, question_bank list)
    const groupName = TAB_GROUPS[activeTab] || 'الإعداد التأسيسي';
    const tabName = TAB_TITLES[activeTab] || 'القسم';
    customTitle = tabName;
    customBreadcrumbs = [
      { label: groupName },
      { label: tabName },
    ];
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-row text-slate-800 font-cairo antialiased relative">
      {/* Sidebar on the Right (RTL layout) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setQuestionBankFormState(null);
          setCountriesFormState(null);
          setSubjectsFormState(null);
          setCalendarFormState(null);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area on the Left */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTabName={TAB_TITLES[activeTab] || 'لوحة التحكم'}
          breadcrumbGroup={TAB_GROUPS[activeTab] || 'الرئيسية'}
          customTitle={customTitle}
          customBreadcrumbs={customBreadcrumbs}
          onBack={onHeaderBack}
          onLogout={() => setCurrentView('login')}
        />

        {renderTabContent()}
      </div>

      {/* Modal for reviews */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        selectedItem={selectedReview}
        allItems={reviewItems}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
