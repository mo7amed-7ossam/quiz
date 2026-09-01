import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Pencil,
  Eye,
  Phone,
  Calendar,
  GraduationCap,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Shield,
  Search,
  Filter,
} from 'lucide-react';
import { ParentUser, StudentUser, StudentChild } from '../types';
import { initialParentsData, initialStudentsData } from '../data/mockData';
import { UserDetailsView } from './UserDetailsView';

interface UsersViewProps {
  onFormStateChange?: (state: {
    isDetails: boolean;
    userName?: string;
    onBack: () => void;
  } | null) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ onFormStateChange }) => {
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [activeUserType, setActiveUserType] = useState<'parents' | 'students'>('parents');
  const [parents, setParents] = useState<ParentUser[]>(initialParentsData);
  const [students, setStudents] = useState<StudentUser[]>(initialStudentsData);

  const [selectedParentId, setSelectedParentId] = useState<string>(
    initialParentsData[0]?.id || ''
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentsData[0]?.id || ''
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentUser | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);

  // Form states
  const [formUserType, setFormUserType] = useState<'parent' | 'student'>('parent');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGrade, setFormGrade] = useState('السادس ابتدائي');
  const [formParentName, setFormParentName] = useState('');
  const [formStatus, setFormStatus] = useState<'نشط' | 'معلّق'>('نشط');

  // Currently selected parent & student objects
  const selectedParent =
    parents.find((p) => p.id === selectedParentId) || parents[0] || null;
  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0] || null;

  const currentSelectedUser = activeUserType === 'parents' ? selectedParent : selectedStudent;

  // Sync with Header navigation
  useEffect(() => {
    if (onFormStateChange) {
      if (viewMode === 'details' && currentSelectedUser) {
        onFormStateChange({
          isDetails: true,
          userName: currentSelectedUser.name,
          onBack: () => setViewMode('list'),
        });
      } else {
        onFormStateChange(null);
      }
    }
  }, [viewMode, currentSelectedUser, onFormStateChange]);

  // Filtered lists based on search
  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers for toggling status (تعليق الحساب / تفعيل الحساب)
  const handleToggleParentStatus = (parentId: string) => {
    setParents((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          const newStatus = p.status === 'نشط' ? 'معلّق' : 'نشط';
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleToggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStatus = s.status === 'نشط' ? 'معلّق' : 'نشط';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingParent(null);
    setEditingStudent(null);
    setFormUserType(activeUserType === 'parents' ? 'parent' : 'student');
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormGrade('السادس ابتدائي');
    setFormParentName('');
    setFormStatus('نشط');
    setIsAddUserModalOpen(true);
  };

  // Open Edit Modal for Parent
  const handleOpenEditParent = (parent: ParentUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParent(parent);
    setEditingStudent(null);
    setFormUserType('parent');
    setFormName(parent.name);
    setFormPhone(parent.phone);
    setFormEmail(parent.email || '');
    setFormStatus(parent.status);
    setIsAddUserModalOpen(true);
  };

  // Open Edit Modal for Student
  const handleOpenEditStudent = (student: StudentUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setEditingParent(null);
    setFormUserType('student');
    setFormName(student.name);
    setFormPhone(student.phone);
    setFormEmail(student.email || '');
    setFormGrade(student.grade);
    setFormParentName(student.parentName);
    setFormStatus(student.status);
    setIsAddUserModalOpen(true);
  };

  // Save User (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (formUserType === 'parent') {
      if (editingParent) {
        setParents((prev) =>
          prev.map((p) =>
            p.id === editingParent.id
              ? {
                  ...p,
                  name: formName.trim(),
                  phone: formPhone.trim() || '05XXXXXXXX',
                  email: formEmail.trim(),
                  status: formStatus,
                }
              : p
          )
        );
      } else {
        const newParent: ParentUser = {
          id: `parent-${Date.now()}`,
          name: formName.trim(),
          phone: formPhone.trim() || '05XXXXXXXX',
          email: formEmail.trim(),
          registrationDate: new Date().toISOString().split('T')[0],
          status: formStatus,
          childrenCount: 1,
          country: 'SA',
          children: [
            {
              id: `ch-${Date.now()}`,
              name: 'طالب جديد',
              grade: 'الأول ابتدائي',
              isSubscribed: true,
              avatarBgColor: '#48877b',
              initialLetter: 'ط',
              registrationDate: new Date().toISOString().split('T')[0],
              status: 'نشط',
              points: 100,
            },
          ],
        };
        setParents((prev) => [newParent, ...prev]);
        setSelectedParentId(newParent.id);
      }
    } else {
      if (editingStudent) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id
              ? {
                  ...s,
                  name: formName.trim(),
                  phone: formPhone.trim() || '05XXXXXXXX',
                  email: formEmail.trim(),
                  grade: formGrade,
                  parentName: formParentName.trim() || 'ولي أمر',
                  status: formStatus,
                }
              : s
          )
        );
      } else {
        const newStudent: StudentUser = {
          id: `stud-${Date.now()}`,
          name: formName.trim(),
          phone: formPhone.trim() || '05XXXXXXXX',
          email: formEmail.trim(),
          registrationDate: new Date().toISOString().split('T')[0],
          status: formStatus,
          grade: formGrade,
          parentName: formParentName.trim() || 'ولي أمر',
          parentPhone: '05XXXXXXXX',
          isSubscribed: true,
          avatarBgColor: '#48877b',
          initialLetter: formName.trim().charAt(0) || 'ط',
          points: 100,
        };
        setStudents((prev) => [newStudent, ...prev]);
        setSelectedStudentId(newStudent.id);
      }
    }

    setIsAddUserModalOpen(false);
  };

  if (viewMode === 'details' && currentSelectedUser) {
    return (
      <UserDetailsView
        user={currentSelectedUser}
        userType={activeUserType === 'parents' ? 'parent' : 'student'}
        onBack={() => setViewMode('list')}
        onUpdateUser={(updated) => {
          if (activeUserType === 'parents') {
            setParents((prev) =>
              prev.map((p) => (p.id === updated.id ? (updated as ParentUser) : p))
            );
          } else {
            setStudents((prev) =>
              prev.map((s) => (s.id === updated.id ? (updated as StudentUser) : s))
            );
          }
        }}
        onToggleStatus={(userId) => {
          if (activeUserType === 'parents') {
            handleToggleParentStatus(userId);
          } else {
            handleToggleStudentStatus(userId);
          }
        }}
      />
    );
  }

  return (
    <div className="px-4 sm:px-8 max-w-7xl mx-auto font-cairo space-y-6" dir="rtl">
      {/* Top Bar: Pill Tabs (Right) & Search Box (Left) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pill Tabs (أولياء الأمور / الطلاب) */}
        <div className="flex items-center gap-2 bg-[#f0f4f8] p-1.5 rounded-full shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setActiveUserType('parents');
              setSearchQuery('');
            }}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeUserType === 'parents'
                ? 'bg-[#48877b] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            أولياء الأمور
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveUserType('students');
              setSearchQuery('');
            }}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeUserType === 'students'
                ? 'bg-[#48877b] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            الطلاب
          </button>
        </div>

        {/* Search Box on Table */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeUserType === 'parents'
                ? 'بحث بالاسم أو رقم الجوال...'
                : 'بحث بالاسم، الصف، أو الجوال...'
            }
            className="w-full bg-white border border-slate-200 focus:border-[#48877b] rounded-full pr-10 pl-9 py-2 text-xs sm:text-sm font-medium text-[#19223c] placeholder-slate-400 focus:outline-none shadow-2xs transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid: Right Users Table (8 cols) + Left Details Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Side: Users Table (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xs border border-slate-100/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs font-bold">
                  <th className="py-4 px-6 text-right">الاسم</th>
                  <th className="py-4 px-4 text-center">الجوال</th>
                  <th className="py-4 px-4 text-center">تاريخ التسجيل</th>
                  <th className="py-4 px-4 text-center">
                    {activeUserType === 'parents' ? 'الأبناء' : 'الصف'}
                  </th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                  <th className="py-4 px-6 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 text-xs sm:text-sm font-medium text-slate-700">
                {activeUserType === 'parents' ? (
                  filteredParents.length > 0 ? (
                    filteredParents.map((parent) => {
                      const isSelected = selectedParentId === parent.id;
                      return (
                        <tr
                          key={parent.id}
                          onClick={() => setSelectedParentId(parent.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#eaf5f2] hover:bg-[#e3f0ed]'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Name */}
                          <td className="py-4 px-6 font-bold text-[#19223c] whitespace-nowrap">
                            {parent.name}
                          </td>

                          {/* Phone */}
                          <td className="py-4 px-4 text-center text-slate-600 font-sans whitespace-nowrap">
                            {parent.phone}
                          </td>

                          {/* Registration Date */}
                          <td className="py-4 px-4 text-center text-slate-600 font-sans whitespace-nowrap">
                            {parent.registrationDate}
                          </td>

                          {/* Children Count */}
                          <td className="py-4 px-4 text-center font-bold text-[#19223c] font-sans whitespace-nowrap">
                            {parent.childrenCount}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                                parent.status === 'نشط'
                                  ? 'bg-[#eaf6f4] text-[#2e7467]'
                                  : 'bg-[#fde8e5] text-[#d04b36]'
                              }`}
                            >
                              {parent.status}
                            </span>
                          </td>

                          {/* View Details Button */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedParentId(parent.id);
                                setViewMode('details');
                              }}
                              title="عرض تفاصيل المستخدم"
                              className="w-8 h-8 rounded-xl bg-[#f0f4f8] hover:bg-[#e4ebf5] text-[#19223c] flex items-center justify-center transition-colors mx-auto cursor-pointer"
                            >
                              <Eye className="w-4 h-4 stroke-[2]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        لا توجد نتائج مطابقة لبحثك في أولياء الأمور
                      </td>
                    </tr>
                  )
                ) : (
                  filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const isSelected = selectedStudentId === student.id;
                      return (
                        <tr
                          key={student.id}
                          onClick={() => setSelectedStudentId(student.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#eaf5f2] hover:bg-[#e3f0ed]'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Name */}
                          <td className="py-4 px-6 font-bold text-[#19223c] whitespace-nowrap">
                            {student.name}
                          </td>

                          {/* Phone */}
                          <td className="py-4 px-4 text-center text-slate-600 font-sans whitespace-nowrap">
                            {student.phone}
                          </td>

                          {/* Registration Date */}
                          <td className="py-4 px-4 text-center text-slate-600 font-sans whitespace-nowrap">
                            {student.registrationDate}
                          </td>

                          {/* Grade */}
                          <td className="py-4 px-4 text-center font-bold text-[#19223c] whitespace-nowrap">
                            {student.grade}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                                student.status === 'نشط'
                                  ? 'bg-[#eaf6f4] text-[#2e7467]'
                                  : 'bg-[#fde8e5] text-[#d04b36]'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>

                          {/* View Details Button */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentId(student.id);
                                setViewMode('details');
                              }}
                              title="عرض تفاصيل الطالب"
                              className="w-8 h-8 rounded-xl bg-[#f0f4f8] hover:bg-[#e4ebf5] text-[#19223c] flex items-center justify-center transition-colors mx-auto cursor-pointer"
                            >
                              <Eye className="w-4 h-4 stroke-[2]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        لا توجد نتائج مطابقة لبحثك في الطلاب
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Left Card: Selected User Details (4 cols on lg) */}
        <div className="lg:col-span-4">
          {activeUserType === 'parents' && selectedParent ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              {/* Header: Name + User Icon + Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <User className="w-4 h-4 fill-slate-700 text-slate-700" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
                    {selectedParent.name}
                  </h3>
                </div>

                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                    selectedParent.status === 'نشط'
                      ? 'bg-[#eaf6f4] text-[#2e7467]'
                      : 'bg-[#fde8e5] text-[#d04b36]'
                  }`}
                >
                  {selectedParent.status}
                </span>
              </div>

              {/* Subtitle / Meta Info */}
              <p className="text-xs text-slate-500 font-medium -mt-3">
                مسجل منذ {selectedParent.registrationDate} — {selectedParent.childrenCount} من الأبناء
              </p>

              {/* Linked Children Section */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#19223c]">
                  الأبناء المرتبطون
                </h4>

                <div className="space-y-2.5">
                  {selectedParent.children && selectedParent.children.length > 0 ? (
                    selectedParent.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-50"
                      >
                        {/* Child Avatar & Name */}
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-2xs shrink-0"
                            style={{
                              backgroundColor: child.avatarBgColor || '#4c3b7a',
                            }}
                          >
                            {child.initialLetter || child.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-[#19223c]">
                              {child.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {child.grade}
                            </p>
                          </div>
                        </div>

                        {/* Subscription Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            child.isSubscribed
                              ? 'bg-[#eaf6f4] text-[#2e7467]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {child.isSubscribed ? 'مشترك' : 'غير مشترك'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      لا يوجد أبناء مسجلين حالياً
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('details')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-2xs text-center cursor-pointer"
                >
                  عرض التفاصيل
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleParentStatus(selectedParent.id)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#19223c] bg-white text-[#19223c] hover:bg-slate-50 active:scale-[0.98] font-bold text-xs sm:text-sm transition-all text-center cursor-pointer"
                >
                  {selectedParent.status === 'نشط' ? 'تعليق الحساب' : 'تفعيل الحساب'}
                </button>
              </div>
            </div>
          ) : activeUserType === 'students' && selectedStudent ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 space-y-6">
              {/* Header: Name + User Icon + Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0"
                    style={{
                      backgroundColor: selectedStudent.avatarBgColor || '#4c3b7a',
                    }}
                  >
                    {selectedStudent.initialLetter || selectedStudent.name.charAt(0)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
                    {selectedStudent.name}
                  </h3>
                </div>

                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                    selectedStudent.status === 'نشط'
                      ? 'bg-[#eaf6f4] text-[#2e7467]'
                      : 'bg-[#fde8e5] text-[#d04b36]'
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              {/* Subtitle / Meta Info */}
              <p className="text-xs text-slate-500 font-medium -mt-3">
                مسجل منذ {selectedStudent.registrationDate} — {selectedStudent.grade}
              </p>

              {/* Parent and Subscription Info */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#19223c]">
                  بيانات ولي الأمر والاشتراك
                </h4>

                <div className="bg-slate-50/80 rounded-2xl p-4 space-y-2.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ولي الأمر:</span>
                    <span className="font-bold text-[#19223c]">{selectedStudent.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">رقم التواصل:</span>
                    <span className="font-bold text-[#19223c] font-sans">{selectedStudent.parentPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">حالة الاشتراك:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        selectedStudent.isSubscribed
                          ? 'bg-[#eaf6f4] text-[#2e7467]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {selectedStudent.isSubscribed ? 'مشترك بالباقة التعليمية' : 'غير مشترك'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('details')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-2xs text-center cursor-pointer"
                >
                  عرض التفاصيل
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStudentStatus(selectedStudent.id)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#19223c] bg-white text-[#19223c] hover:bg-slate-50 active:scale-[0.98] font-bold text-xs sm:text-sm transition-all text-center cursor-pointer"
                >
                  {selectedStudent.status === 'نشط' ? 'تعليق الحساب' : 'تفعيل الحساب'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isAddUserModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-cairo"
          dir="rtl"
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-[#19223c]">
                {editingParent || editingStudent
                  ? 'تعديل بيانات المستخدم'
                  : 'إضافة مستخدم جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              {/* User Type selector (if creating new) */}
              {!editingParent && !editingStudent && (
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2 text-right">
                    نوع المستخدم
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormUserType('parent')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formUserType === 'parent'
                          ? 'bg-[#48877b] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ولي أمر
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormUserType('student')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formUserType === 'student'
                          ? 'bg-[#48877b] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      طالب
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                  الاسم الكامل <span className="text-[#e0564c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: خالد المطيري"
                  className="w-full bg-white border border-[#48877b] focus:border-[#3d756a] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                    رقم الجوال <span className="text-[#e0564c]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-white border border-slate-200 focus:border-[#48877b] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-white border border-slate-200 focus:border-[#48877b] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right font-sans"
                  />
                </div>
              </div>

              {/* Student specific fields */}
              {formUserType === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                      الصف الدراسي <span className="text-[#e0564c]">*</span>
                    </label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#48877b] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right"
                    >
                      <option value="الأول ابتدائي">الأول ابتدائي</option>
                      <option value="الثاني ابتدائي">الثاني ابتدائي</option>
                      <option value="الثالث ابتدائي">الثالث ابتدائي</option>
                      <option value="الرابع ابتدائي">الرابع ابتدائي</option>
                      <option value="الخامس ابتدائي">الخامس ابتدائي</option>
                      <option value="السادس ابتدائي">السادس ابتدائي</option>
                      <option value="الأول متوسط">الأول متوسط</option>
                      <option value="الثاني متوسط">الثاني متوسط</option>
                      <option value="الثالث متوسط">الثالث متوسط</option>
                      <option value="الأول ثانوي">الأول ثانوي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                      اسم ولي الأمر
                    </label>
                    <input
                      type="text"
                      value={formParentName}
                      onChange={(e) => setFormParentName(e.target.value)}
                      placeholder="اسم ولي الأمر"
                      className="w-full bg-white border border-slate-200 focus:border-[#48877b] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#19223c] focus:outline-none transition-colors text-right"
                    />
                  </div>
                </div>
              )}

              {/* Status Selector */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-1.5 text-right">
                  حالة الحساب
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="نشط"
                      checked={formStatus === 'نشط'}
                      onChange={() => setFormStatus('نشط')}
                      className="text-[#48877b] focus:ring-[#48877b]"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#19223c]">نشط</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="معلّق"
                      checked={formStatus === 'معلّق'}
                      onChange={() => setFormStatus('معلّق')}
                      className="text-[#e0564c] focus:ring-[#e0564c]"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#19223c]">معلّق</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#19223c] bg-white text-[#19223c] font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  حفظ المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal (عرض التفاصيل) */}
      {isDetailsModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-cairo"
          dir="rtl"
          onClick={() => setIsDetailsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#48877b]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
                    الملف التعريفي للمستخدم
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeUserType === 'parents' ? 'تفاصيل حساب ولي الأمر والأبناء' : 'تفاصيل حساب الطالب'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            {activeUserType === 'parents' && selectedParent ? (
              <div className="space-y-5">
                {/* Main profile banner */}
                <div className="bg-[#eaf5f2] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#19223c]">
                      {selectedParent.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">
                      {selectedParent.phone} • {selectedParent.email || 'لا يوجد بريد إلكتروني'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedParent.status === 'نشط'
                        ? 'bg-[#48877b] text-white'
                        : 'bg-[#e0564c] text-white'
                    }`}
                  >
                    {selectedParent.status}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">تاريخ الانضمام</span>
                    <span className="font-bold text-[#19223c] font-sans">{selectedParent.registrationDate}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">عدد الأبناء المسجلين</span>
                    <span className="font-bold text-[#19223c] font-sans">{selectedParent.childrenCount}</span>
                  </div>
                </div>

                {/* Children Details */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs sm:text-sm font-bold text-[#19223c]">
                    قائمة الأبناء والصفوف الدراسية
                  </h5>
                  <div className="space-y-2">
                    {selectedParent.children.map((ch) => (
                      <div
                        key={ch.id}
                        className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                            style={{ backgroundColor: ch.avatarBgColor || '#4c3b7a' }}
                          >
                            {ch.initialLetter || ch.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-[#19223c] block">
                              {ch.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {ch.grade}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                            ch.isSubscribed
                              ? 'bg-[#eaf6f4] text-[#2e7467]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {ch.isSubscribed ? 'مشترك نشط' : 'غير مشترك'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeUserType === 'students' && selectedStudent ? (
              <div className="space-y-5">
                {/* Main profile banner */}
                <div className="bg-[#eaf5f2] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#19223c]">
                      {selectedStudent.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">
                      {selectedStudent.phone} • {selectedStudent.grade}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedStudent.status === 'نشط'
                        ? 'bg-[#48877b] text-white'
                        : 'bg-[#e0564c] text-white'
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">ولي الأمر المرتبط</span>
                    <span className="font-bold text-[#19223c]">{selectedStudent.parentName}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">تاريخ التسجيل</span>
                    <span className="font-bold text-[#19223c] font-sans">{selectedStudent.registrationDate}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">النقاط والمكافآت</span>
                    <span className="font-bold text-[#48877b] font-sans">{selectedStudent.points || 0} نقطة</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500 block mb-1">حالة الاشتراك</span>
                    <span className="font-bold text-[#19223c]">
                      {selectedStudent.isSubscribed ? 'مشترك بالباقة' : 'غير مشترك'}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#19223c] hover:bg-[#253254] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
