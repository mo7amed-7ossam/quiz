import React, { useState } from 'react';
import { Search, Menu, Bell, Sparkles, LogOut, Settings, User } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTabName?: string;
  breadcrumbGroup?: string;
  customTitle?: string;
  customBreadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchTerm,
  onSearchChange,
  activeTabName = 'لوحة التحكم',
  breadcrumbGroup,
  customTitle,
  customBreadcrumbs,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayTitle = customTitle || activeTabName;

  return (
    <header
      id="top-header"
      className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shadow-2xs"
    >
      {/* Title & Breadcrumbs (Aligned Right in RTL) */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {displayTitle}
          </h2>
          <nav className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            {customBreadcrumbs && customBreadcrumbs.length > 0 ? (
              customBreadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  {crumb.onClick ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="hover:text-teal-700 hover:underline transition-colors cursor-pointer text-slate-500 font-medium"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span
                      className={
                        idx === customBreadcrumbs.length - 1
                          ? 'text-slate-800 font-bold'
                          : 'text-slate-500'
                      }
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <span>{breadcrumbGroup || 'الرئيسية'}</span>
                {activeTabName !== 'لوحة التحكم' && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600 font-medium">{activeTabName}</span>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Quick Search & User Profile (Aligned Left in RTL) */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-end">
        {/* Search Bar matching screenshot */}
        <div className="relative w-full sm:w-64 md:w-72">
          <input
            id="quick-search-input"
            type="text"
            placeholder="بحث سريع..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#edf2f7] hover:bg-[#e7edf5] focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-xl py-2 pr-9 pl-4 border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all duration-200 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#f8fafc] border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-amber-500 shadow-2xs transition-colors relative"
            title="الإشعارات"
          >
            <Bell className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                <span className="font-bold text-xs text-slate-800">التنبيهات الجديدة</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">2 جديد</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-teal-50/50 hover:bg-teal-50 text-slate-700">
                  <p className="font-medium text-teal-950">تم تقديم منهج جديد للمراجعة</p>
                  <span className="text-[10px] text-slate-400">قبل 12 دقيقة</span>
                </div>
                <div className="p-2 rounded-lg hover:bg-slate-50 text-slate-700">
                  <p className="font-medium">تحديث أمني تلقائي للنظام</p>
                  <span className="text-[10px] text-slate-400">قبل 3 ساعات</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle "أد" with Dropdown */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-full bg-[#172036] hover:bg-[#202b48] text-white font-bold text-sm flex items-center justify-center shadow-md transition-transform active:scale-95 ring-2 ring-slate-300/40"
            title="ملف المشرف"
          >
            أد
          </button>

          {showProfileMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">أحمد الدوسري</p>
                <p className="text-xs text-slate-500">مدير النظام الرئيسي</p>
              </div>
              <div className="py-1 text-xs text-slate-700">
                <button className="w-full text-right px-4 py-2 hover:bg-slate-50 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  الملف الشخصي
                </button>
                <button className="w-full text-right px-4 py-2 hover:bg-slate-50 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  إعدادات المنصة
                </button>
                <button className="w-full text-right px-4 py-2 hover:bg-slate-50 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  سجل التحديثات
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
