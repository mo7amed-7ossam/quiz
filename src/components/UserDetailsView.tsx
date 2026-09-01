import React from 'react';
import { ParentUser, StudentUser } from '../types';

interface UserDetailsViewProps {
  user: ParentUser | StudentUser;
  userType: 'parent' | 'student';
  onBack: () => void;
  onUpdateUser?: (updatedUser: ParentUser | StudentUser) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserDetailsView: React.FC<UserDetailsViewProps> = ({
  user,
  userType,
  onBack,
  onUpdateUser,
  onToggleStatus,
}) => {
  const isParent = userType === 'parent';
  const parentUser = isParent ? (user as ParentUser) : null;
  const studentUser = !isParent ? (user as StudentUser) : null;

  // Avatar first letter
  const avatarLetter = user.name.trim().charAt(0) || 'م';

  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* 1. Top Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Right Side: Avatar + Name + Subtitle */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#19223c] text-white font-bold text-2xl flex items-center justify-center shadow-xs shrink-0">
            {avatarLetter}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#19223c]">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {isParent ? 'ولي أمر' : 'طالب'} — مسجل منذ {user.registrationDate}
            </p>
          </div>
        </div>

        {/* Left Side: Status Badge */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              user.status === 'نشط'
                ? 'bg-[#eaf6f4] text-[#2e7467]'
                : 'bg-[#fde8e5] text-[#d04b36]'
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* 2. Middle Card: البيانات الأساسية (Basic Info) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100/90 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
          البيانات الأساسية
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
          {/* Right Column: Name & Registration Date */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1.5">الاسم</p>
              <p className="text-sm sm:text-base font-bold text-[#19223c]">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium mb-1.5">
                تاريخ التسجيل
              </p>
              <p className="text-sm sm:text-base font-bold text-[#19223c] font-sans">
                {user.registrationDate}
              </p>
            </div>
          </div>

          {/* Left Column: Phone & Children Count / Grade */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1.5">
                رقم الجوال
              </p>
              <p className="text-sm sm:text-base font-bold text-[#19223c] font-sans">
                {user.phone}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium mb-1.5">
                {isParent ? 'عدد الأبناء المرتبطين' : 'الصف الدراسي'}
              </p>
              <p className="text-sm sm:text-base font-bold text-[#19223c] font-sans">
                {isParent ? parentUser?.childrenCount || 0 : studentUser?.grade || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Card: الأبناء المرتبطون (Linked Children) / بيانات الطالب */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100/90 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
          {isParent ? 'الأبناء المرتبطون' : 'الاشتراكات والمقررات الدراسية'}
        </h3>

        {isParent ? (
          <div>
            {/* Table Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
              <span className="w-1/3 text-right">الاسم</span>
              <span className="w-1/3 text-center">الصف الدراسي</span>
              <span className="w-1/3 text-left">حالة الاشتراك</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100/70">
              {parentUser?.children && parentUser.children.length > 0 ? (
                parentUser.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between py-4"
                  >
                    {/* Name */}
                    <span className="w-1/3 text-right font-bold text-[#19223c] text-sm">
                      {child.name}
                    </span>

                    {/* Grade */}
                    <span className="w-1/3 text-center text-slate-600 text-xs sm:text-sm font-medium">
                      {child.grade}
                    </span>

                    {/* Status Badge */}
                    <div className="w-1/3 text-left">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                          child.isSubscribed
                            ? 'bg-[#eaf6f4] text-[#2e7467]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {child.isSubscribed ? 'مشترك' : 'غير مشترك'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  لا يوجد أبناء مرتبطون بهذا الحساب حالياً
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Student Info Section */
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
              <span className="w-1/3 text-right">المادة / الباقة</span>
              <span className="w-1/3 text-center">الصف الدراسي</span>
              <span className="w-1/3 text-left">حالة الاشتراك</span>
            </div>

            <div className="divide-y divide-slate-100/70">
              <div className="flex items-center justify-between py-4">
                <span className="w-1/3 text-right font-bold text-[#19223c] text-sm">
                  باقة التفوق الشاملة
                </span>
                <span className="w-1/3 text-center text-slate-600 text-xs sm:text-sm font-medium">
                  {studentUser?.grade}
                </span>
                <div className="w-1/3 text-left">
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-[#eaf6f4] text-[#2e7467]">
                    {studentUser?.isSubscribed ? 'مشترك' : 'غير مشترك'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Button (تعليق الحساب) */}
        <div className="flex justify-start pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onToggleStatus(user.id)}
            className="border border-[#19223c] bg-white text-[#19223c] hover:bg-slate-50 active:scale-[0.98] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
          >
            {user.status === 'نشط' ? 'تعليق الحساب' : 'تفعيل الحساب'}
          </button>
        </div>
      </div>
    </div>
  );
};
