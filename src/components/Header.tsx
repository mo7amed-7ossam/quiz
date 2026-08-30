import React, { useState } from 'react';
import { Menu, LogOut, Settings, User, Sparkles } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  activeTabName?: string;
  breadcrumbGroup?: string;
  customTitle?: string;
  customBreadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTabName = 'لوحة التحكم',
  breadcrumbGroup,
  customTitle,
  customBreadcrumbs,
  onBack,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayTitle = customTitle || activeTabName;

  // Determine whether we are in a sub-view (has back button action or custom breadcrumbs with click)
  const canGoBack = Boolean(
    onBack ||
      (customBreadcrumbs &&
        customBreadcrumbs.length > 1 &&
        customBreadcrumbs.some((c) => c.onClick))
  );

  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (customBreadcrumbs) {
      // Find the last clickable breadcrumb before current
      const clickable = [...customBreadcrumbs].reverse().find((c) => c.onClick);
      if (clickable && clickable.onClick) {
        clickable.onClick();
      }
    }
  };

  return (
    <header
      id="top-header"
      className="admin-topbar bg-white border-b border-slate-200/90 py-3.5 px-4 sm:px-8 flex items-center justify-between gap-4 select-none font-cairo shadow-2xs"
      dir="rtl"
    >
      {/* Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {/* topbar-title */}
          <div className="topbar-title text-base sm:text-lg font-black text-[#19223c] tracking-tight">
            {displayTitle}
          </div>

          {/* topbar-crumb */}
          <div className="topbar-crumb text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
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
          </div>
        </div>
      </div>

      {/* Tools area: Back button (conditional) + Notification Bell + Avatar */}
      <div className="topbar-tools flex items-center gap-3 relative">
        {/* Back Button linked to breadcrumb / sub-views */}
        {canGoBack && (
          <button
            type="button"
            onClick={handleBackClick}
            className="abtn outline inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#19223c] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
            style={{ fontSize: '11px', padding: '5px 12px', gap: '4px' }}
          >
            <span>←</span>
            <span>رجوع</span>
          </button>
        )}

        {/* Notifications Icon Button with Dot & Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-notif-btn w-9 h-9 rounded-xl bg-[#f8fafc] border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors relative cursor-pointer select-none"
            title="الإشعارات"
          >
            <span className="text-base">🔔</span>
            <span className="topbar-notif-dot w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
          </div>

          {showNotifications && (
            <div
              className="topbar-dropdown bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-cairo"
              style={{
                position: 'absolute',
                width: '310px',
                left: '0px',
                right: 'auto',
                top: 'calc(100% + 8px)',
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#19223c' }}>
                  الإشعارات{' '}
                  <span
                    style={{
                      background: '#e0564c',
                      color: 'rgb(255, 255, 255)',
                      fontSize: '9px',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      marginRight: '4px',
                    }}
                  >
                    3
                  </span>
                </span>
                <span
                  onClick={() => {
                    // Mark all read action
                  }}
                  style={{
                    fontSize: '10px',
                    color: '#48877b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  تعيين الكل كمقروء
                </span>
              </div>

              {/* Notification Item 1 */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgb(227, 247, 244)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  👤
                </div>
                <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: '#19223c',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    مستخدم جديد انضم: أحمد المطيري
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    منذ 3 دقائق
                  </div>
                </div>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#48877b',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                />
              </div>

              {/* Notification Item 2 */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgb(227, 247, 244)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  📝
                </div>
                <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: '#19223c',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    تم رفع محتوى جديد بانتظار المراجعة
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    منذ 15 دقيقة
                  </div>
                </div>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#48877b',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                />
              </div>

              {/* Notification Item 3 */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgb(227, 247, 244)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  🏆
                </div>
                <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: '#19223c',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    خالد الزهراني حقق إنجاز "المتعلم النشط"
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    منذ 42 دقيقة
                  </div>
                </div>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#48877b',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                />
              </div>

              {/* Notification Item 4 */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  💳
                </div>
                <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: '#19223c',
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    اشتراك جديد: الخطة المميزة — الإمارات
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    منذ ساعة
                  </div>
                </div>
              </div>

              {/* Notification Item 5 */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0px',
                  borderBottomWidth: 'medium',
                  borderBottomStyle: 'none',
                  borderBottomColor: 'currentcolor',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  🛡️
                </div>
                <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: '#19223c',
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    تنبيه محتوى: 2 محادثة تحتاج مراجعة يدوية
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    منذ ساعتين
                  </div>
                </div>
              </div>

              {/* View all footer */}
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <span
                  onClick={() => setShowNotifications(false)}
                  style={{
                    fontSize: '10.5px',
                    color: '#48877b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  عرض كل الإشعارات ←
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Avatar 'أد' with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="avatar"
            style={{
              background: '#19223c',
              cursor: 'pointer',
              userSelect: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
            title="حساب المدير"
          >
            أد
          </div>

          {showProfileMenu && (
            <div
              className="topbar-dropdown bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-cairo text-right"
              style={{
                position: 'absolute',
                width: '220px',
                left: '0px',
                right: 'auto',
                top: 'calc(100% + 8px)',
              }}
            >
              {/* Profile Header */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '8px',
                }}
              >
                <div
                  className="avatar"
                  style={{
                    background: '#19223c',
                    width: '36px',
                    height: '36px',
                    fontSize: '14px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                >
                  أد
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '11.5px', color: '#19223c' }}>
                    المدير العام
                  </div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      color: '#64748b',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    admin@smartlearn.sa
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '8px 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#19223c',
                  cursor: 'pointer',
                  borderRadius: '7px',
                  background: '#f8fafc',
                }}
              >
                <span style={{ fontSize: '14px' }}>👤</span>
                <span>الملف الشخصي</span>
              </div>

              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '8px 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#19223c',
                  cursor: 'pointer',
                  borderRadius: '7px',
                }}
                className="hover:bg-slate-50 transition-colors"
              >
                <span style={{ fontSize: '14px' }}>⚙️</span>
                <span>إعدادات الحساب</span>
              </div>

              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '8px 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#19223c',
                  cursor: 'pointer',
                  borderRadius: '7px',
                }}
                className="hover:bg-slate-50 transition-colors"
              >
                <span style={{ fontSize: '14px' }}>🔐</span>
                <span>الأدوار والصلاحيات</span>
              </div>

              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '8px 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#19223c',
                  cursor: 'pointer',
                  borderRadius: '7px',
                }}
                className="hover:bg-slate-50 transition-colors"
              >
                <span style={{ fontSize: '14px' }}>📊</span>
                <span>التقارير</span>
              </div>

              {/* Logout Item */}
              <div
                style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#e0564c',
                    cursor: 'pointer',
                    borderRadius: '7px',
                  }}
                  className="hover:bg-rose-50/70 transition-colors"
                >
                  <span style={{ fontSize: '14px' }}>🚪</span>
                  <span>تسجيل الخروج</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
