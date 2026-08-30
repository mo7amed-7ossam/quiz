import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SubItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarGroup {
  id: string;
  title: string;
  items: SubItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  // Collapsible groups structure matching the requested HTML
  const groups: SidebarGroup[] = [
    {
      id: 'foundation',
      title: 'الإعداد التأسيسي',
      items: [
        { id: 'countries', label: 'الدول', icon: '🌍' },
        { id: 'classes', label: 'الصفوف الدراسية', icon: '🏫' },
        { id: 'subjects', label: 'المواد الدراسية', icon: '📚' },
        { id: 'curriculum', label: 'المنهج الدراسي', icon: '🌳' },
        { id: 'question_bank', label: 'بنك الأسئلة', icon: '❓' },
        { id: 'calendar', label: 'التقويم الأكاديمي', icon: '📅' },
      ],
    },
    {
      id: 'users_group',
      title: 'المستخدمون',
      items: [
        { id: 'users', label: 'المستخدمون', icon: '👥' },
        { id: 'subscriptions', label: 'الاشتراكات والخطط', icon: '💳' },
      ],
    },
    {
      id: 'motivation',
      title: 'التحفيز والإشعارات',
      items: [
        { id: 'achievements', label: 'الإنجازات والمكافآت', icon: '🏆' },
        { id: 'notifications', label: 'قوالب الإشعارات', icon: '🔔' },
      ],
    },
    {
      id: 'ai_safety_group',
      title: 'الذكاء الاصطناعي والسلامة',
      items: [
        { id: 'ai_safety', label: 'المساعد الذكي والسلامة', icon: '🛡️' },
      ],
    },
    {
      id: 'governance',
      title: 'الحوكمة',
      items: [
        { id: 'roles', label: 'الأدوار والصلاحيات', icon: '🔐' },
        { id: 'general_settings', label: 'الإعدادات العامة', icon: '⚙️' },
      ],
    },
    {
      id: 'reports_group',
      title: 'التقارير',
      items: [
        { id: 'reports', label: 'التقارير والتحليلات', icon: '📊' },
      ],
    },
    {
      id: 'companion',
      title: 'الرفيق التعليمي',
      items: [
        { id: 'companion_catalog', label: 'كتالوج الرفيق التعليمي', icon: '🧸' },
      ],
    },
    {
      id: 'system',
      title: 'النظام',
      items: [
        { id: 'design_system', label: 'نظام التصميم', icon: '🎨' },
      ],
    },
  ];

  // Keep track of opened accordion groups (default foundation is open)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    foundation: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="main-sidebar"
        dir="rtl"
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 sm:w-72 bg-[#121c33] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } border-l border-[#1b2746] shadow-2xl lg:shadow-none select-none font-cairo`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1c2949] bg-[#0e1629]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎓</span>
            <span className="text-[16px] font-bold text-white tracking-wide">
              لوحة إدارة المنصة
            </span>
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
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1.5 text-xs sm:text-[13px] custom-scrollbar">
          {/* Main Dashboard Link */}
          <button
            type="button"
            id="nav-dashboard"
            onClick={() => handleItemClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-right font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#223150] text-white shadow-xs'
                : 'text-slate-300 hover:bg-[#192540] hover:text-white'
            }`}
          >
            <span className="text-base">🏛️</span>
            <span>لوحة التحكم الرئيسية</span>
          </button>

          {/* Groups & Sub-items */}
          {groups.map((group) => {
            const isGroupOpen = !!openGroups[group.id];
            const hasActiveChild = group.items.some((item) => item.id === activeTab);

            return (
              <div key={group.id} className="pt-0.5">
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-right font-bold transition-colors cursor-pointer group ${
                    hasActiveChild ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-[#18233d]'
                  }`}
                >
                  <span className="text-[13.5px]">{group.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isGroupOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* Group Sub-items List */}
                {isGroupOpen && (
                  <div className="mt-0.5 space-y-0.5 pl-0 pr-2">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          id={`nav-${item.id}`}
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-lg text-right font-semibold transition-all cursor-pointer relative ${
                            isActive
                              ? 'bg-[#243454] text-white'
                              : 'text-slate-300 hover:bg-[#1a2642] hover:text-white'
                          }`}
                        >
                          {/* Active border bar on the RIGHT in RTL */}
                          {isActive && (
                            <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#48877b] rounded-l-sm" />
                          )}

                          <span className="text-sm shrink-0">{item.icon}</span>
                          <span className={`text-[13px] ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Static Item: Parent Reviews */}
        <div className="p-2.5 border-t border-[#1c2949] bg-[#0e1629]">
          <button
            type="button"
            onClick={() => handleItemClick('parent_reviews')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-right font-medium transition-colors cursor-pointer ${
              activeTab === 'parent_reviews'
                ? 'bg-[#223150] text-white font-bold'
                : 'text-slate-300 hover:bg-[#18233d] hover:text-white'
            }`}
          >
            <span className="text-base">💬</span>
            <span className="text-xs sm:text-[13px]">مراجعة آراء أولياء الأمور</span>
          </button>
        </div>
      </aside>
    </>
  );
};

