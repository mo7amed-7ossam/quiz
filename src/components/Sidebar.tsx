import React from 'react';
import {
  LayoutDashboard,
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
  ChevronLeft,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const sections: NavSection[] = [
    {
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
      ],
    },
    {
      title: 'الإعداد الأساسي',
      items: [
        { id: 'countries', label: 'الدول', icon: Globe2 },
        { id: 'classes', label: 'الصفوف الدراسية', icon: GraduationCap },
        { id: 'subjects', label: 'المواد الدراسية', icon: BookOpen },
        { id: 'curriculum', label: 'المنهج الدراسي', icon: Compass },
        { id: 'question_bank', label: 'بنك الأسئلة', icon: HelpCircle },
        { id: 'calendar', label: 'التقويم الأكاديمي', icon: CalendarDays },
      ],
    },
    {
      title: 'المستخدمون',
      items: [
        { id: 'users', label: 'المستخدمون', icon: Users2 },
      ],
    },
    {
      title: 'الاشتراكات والخطط',
      items: [
        { id: 'subscriptions', label: 'الاشتراكات والخطط', icon: CreditCard },
      ],
    },
    {
      title: 'التحفيز والإشعارات',
      items: [
        { id: 'achievements', label: 'الإنجازات والمكافآت', icon: Trophy },
        { id: 'notifications', label: 'قوالب الإشعارات', icon: BellRing },
      ],
    },
    {
      title: 'الذكاء الاصطناعي والسلامة',
      items: [
        { id: 'ai_safety', label: 'المساعد الذكي والسلامة', icon: Bot },
      ],
    },
    {
      title: 'الحوكمة',
      items: [
        { id: 'roles', label: 'الأدوار والصلاحيات', icon: ShieldCheck },
        { id: 'general_settings', label: 'الإعدادات العامة', icon: Settings },
      ],
    },
    {
      title: 'التقارير',
      items: [
        { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3 },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#172036] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-[#24304d] shadow-2xl lg:shadow-none select-none`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#222f4c] bg-[#141b2e]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Compass className="w-5 h-5 text-slate-950 rotate-45" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              لوحة إدارة المنصة
            </h1>
          </div>
          <button
            id="close-sidebar-btn"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 text-sm">
          {sections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-1">
              {section.title && (
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-right font-medium transition-all group relative ${
                        isActive
                          ? 'bg-[#25334d] text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:bg-[#1e2a44] hover:text-white'
                      }`}
                    >
                      {/* Active indicator bar on right */}
                      {isActive && (
                        <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-teal-400 rounded-l-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-teal-400'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="text-[13.5px]">{item.label}</span>
                      </div>

                      {isActive && (
                        <ChevronLeft className="w-3.5 h-3.5 text-teal-400 opacity-80" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-[#222f4c] bg-[#141b2e] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>النظام متصل</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};
