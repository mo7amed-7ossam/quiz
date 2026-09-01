import React, { useState } from 'react';
import {
  Pencil,
  Plus,
  X,
  Check,
  Tag,
  CreditCard,
  Percent,
  Calendar,
  Sparkles,
  Layers,
  TrendingUp,
  TrendingDown,
  Trash2,
} from 'lucide-react';
import { SubscriptionPlan, PromoCode } from '../types';
import { initialSubscriptionPlans, initialPromoCodes } from '../data/mockData';

export const SubscriptionsView: React.FC = () => {
  // State for Plans
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialSubscriptionPlans);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);

  // State for Promo Codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [isEditPromoModalOpen, setIsEditPromoModalOpen] = useState(false);

  // Form state for New Promo Code
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(20);
  const [newPromoExpiry, setNewPromoExpiry] = useState('2026-12-31');
  const [newPromoMaxUsage, setNewPromoMaxUsage] = useState<number>(500);
  const [newPromoStatus, setNewPromoStatus] = useState<'نشط' | 'منتهٍ' | 'معطل'>('نشط');

  // Form state for Edit Plan
  const [planFormName, setPlanFormName] = useState('');
  const [planFormPrice, setPlanFormPrice] = useState<number>(0);
  const [planFormPeriod, setPlanFormPeriod] = useState('شهر');
  const [planFormDescription, setPlanFormDescription] = useState('');
  const [planFormSubscribers, setPlanFormSubscribers] = useState<number>(0);
  const [planFormStatus, setPlanFormStatus] = useState<'نشط' | 'معطل'>('نشط');

  // Form state for Edit Promo Code
  const [editPromoCodeStr, setEditPromoCodeStr] = useState('');
  const [editPromoDiscount, setEditPromoDiscount] = useState<number>(20);
  const [editPromoExpiry, setEditPromoExpiry] = useState('');
  const [editPromoUsage, setEditPromoUsage] = useState<number>(0);
  const [editPromoStatus, setEditPromoStatus] = useState<'نشط' | 'منتهٍ' | 'معطل'>('نشط');

  // Handlers for Plan Editing
  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanFormName(plan.name);
    setPlanFormPrice(plan.price);
    setPlanFormPeriod(plan.billingPeriod || 'شهر');
    setPlanFormDescription(plan.description);
    setPlanFormSubscribers(plan.subscribersCount);
    setPlanFormStatus(plan.status || 'نشط');
    setIsEditPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !planFormName.trim()) return;

    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: planFormName,
              price: planFormPrice,
              billingPeriod: planFormPeriod,
              description: planFormDescription,
              subscribersCount: planFormSubscribers,
              status: planFormStatus,
            }
          : p
      )
    );
    setIsEditPlanModalOpen(false);
  };

  // Handlers for Promo Codes
  const handleOpenAddPromo = () => {
    setNewPromoCode('');
    setNewPromoDiscount(20);
    setNewPromoExpiry('2026-12-31');
    setNewPromoMaxUsage(500);
    setNewPromoStatus('نشط');
    setIsAddPromoModalOpen(true);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const newCodeItem: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountPercentage: Number(newPromoDiscount) || 10,
      expiryDate: newPromoExpiry || '2026-12-31',
      usageCount: 0,
      maxUsage: Number(newPromoMaxUsage) || 1000,
      status: newPromoStatus,
    };

    setPromoCodes((prev) => [newCodeItem, ...prev]);
    setIsAddPromoModalOpen(false);
  };

  const handleOpenEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setEditPromoCodeStr(promo.code);
    setEditPromoDiscount(promo.discountPercentage);
    setEditPromoExpiry(promo.expiryDate);
    setEditPromoUsage(promo.usageCount);
    setEditPromoStatus(promo.status);
    setIsEditPromoModalOpen(true);
  };

  const handleSaveEditPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo || !editPromoCodeStr.trim()) return;

    setPromoCodes((prev) =>
      prev.map((p) =>
        p.id === editingPromo.id
          ? {
              ...p,
              code: editPromoCodeStr.trim().toUpperCase(),
              discountPercentage: Number(editPromoDiscount) || p.discountPercentage,
              expiryDate: editPromoExpiry,
              usageCount: Number(editPromoUsage) || 0,
              status: editPromoStatus,
            }
          : p
      )
    );
    setIsEditPromoModalOpen(false);
  };

  const handleDeletePromo = (promoId: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== promoId));
    setIsEditPromoModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 max-w-6xl mx-auto font-cairo space-y-5" dir="rtl">
      {/* 1. Top Key Metric Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: مشتركون نشطون */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col items-center justify-center text-center space-y-1.5 hover:shadow-sm transition-shadow">
          <span className="text-xl sm:text-2xl font-bold text-[#19223c] font-sans">
            5,940
          </span>
          <span className="text-xs text-slate-500 font-medium">
            مشتركون نشطون
          </span>
          <span className="bg-[#eaf6f4] text-[#1b7a69] text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5 font-sans">
            ▲ 9%
          </span>
        </div>

        {/* Metric 2: الإيراد الشهري */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col items-center justify-center text-center space-y-1.5 hover:shadow-sm transition-shadow">
          <span className="text-xl sm:text-2xl font-bold text-[#19223c] font-sans">
            184,200 <span className="text-xs font-semibold">ر.س</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">
            الإيراد الشهري
          </span>
          <span className="bg-[#eaf6f4] text-[#1b7a69] text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5 font-sans">
            ▲ 12%
          </span>
        </div>

        {/* Metric 3: معدل التجديد */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col items-center justify-center text-center space-y-1.5 hover:shadow-sm transition-shadow">
          <span className="text-xl sm:text-2xl font-bold text-[#19223c] font-sans">
            91%
          </span>
          <span className="text-xs text-slate-500 font-medium">
            معدل التجديد
          </span>
          <span className="bg-[#eaf6f4] text-[#1b7a69] text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5 font-sans">
            ▲ 2%
          </span>
        </div>

        {/* Metric 4: معدل الإلغاء */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col items-center justify-center text-center space-y-1.5 hover:shadow-sm transition-shadow">
          <span className="text-xl sm:text-2xl font-bold text-[#19223c] font-sans">
            3.4%
          </span>
          <span className="text-xs text-slate-500 font-medium">
            معدل الإلغاء
          </span>
          <span className="bg-[#fde8e5] text-[#d04b36] text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5 font-sans">
            ▼ 0.5%
          </span>
        </div>
      </div>

      {/* 2. Middle Section: Subscription Plan Cards (3 Plans) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            {/* Header: Title + Edit Button */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
                  {plan.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleOpenEditPlan(plan)}
                  className="px-3.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-[#19223c] font-semibold text-xs shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  تعديل
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mt-3.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#19223c] font-sans">
                  {plan.price}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {plan.currency}/{plan.billingPeriod || 'شهر'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Subscribers Count */}
            <div className="mt-4 pt-2.5 border-t border-slate-50">
              <p className="text-xs font-bold text-[#169b81] font-sans">
                {plan.subscribersCount.toLocaleString('en-US')} مشترك
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Section: Promo Codes (أكواد الخصم) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#19223c]">
            أكواد الخصم
          </h3>
          <button
            type="button"
            onClick={handleOpenAddPromo}
            className="inline-flex items-center gap-1.5 bg-[#149b82] hover:bg-[#10856f] active:scale-[0.98] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>كود جديد</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                <th className="py-2.5 px-3 text-right">الكود</th>
                <th className="py-2.5 px-3 text-center">النسبة</th>
                <th className="py-2.5 px-3 text-center">ينتهي في</th>
                <th className="py-2.5 px-3 text-center">مرات الاستخدام</th>
                <th className="py-2.5 px-3 text-center">الحالة</th>
                <th className="py-2.5 px-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs sm:text-sm">
              {promoCodes.map((promo) => (
                <tr
                  key={promo.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Code */}
                  <td className="py-3 px-3 font-sans font-bold text-[#19223c]">
                    {promo.code}
                  </td>

                  {/* Percentage */}
                  <td className="py-3 px-3 text-center font-sans font-bold text-slate-700">
                    {promo.discountPercentage}%
                  </td>

                  {/* Expiration */}
                  <td className="py-3 px-3 text-center font-sans font-medium text-slate-500">
                    {promo.expiryDate}
                  </td>

                  {/* Usage count */}
                  <td className="py-3 px-3 text-center font-sans font-medium text-slate-500">
                    {promo.usageCount}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                        promo.status === 'نشط'
                          ? 'bg-[#eaf6f4] text-[#2e7467]'
                          : promo.status === 'منتهٍ'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-[#fde8e5] text-[#d04b36]'
                      }`}
                    >
                      {promo.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPromo(promo)}
                      title="تعديل كود الخصم"
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#da684a] flex items-center justify-center transition-colors mx-auto ml-0 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Edit Plan Modal */}
      {isEditPlanModalOpen && editingPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-cairo animate-fadeIn"
          onClick={() => setIsEditPlanModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-6 sm:p-7 border border-slate-100 animate-scaleUp"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title & Subtitle */}
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-[#19223c]">
                بيانات الخطة: {editingPlan.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5">
                عدّل تفاصيل الخطة الظاهرة للمشتركين — أي تغيير في السعر يُطبّق على الاشتراكات الجديدة فقط، ولا يؤثر على المشتركين الحاليين حتى موعد تجديدهم.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePlan} className="space-y-4">
              {/* Plan Name */}
              <div>
                <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                  اسم الخطة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={planFormName}
                  onChange={(e) => setPlanFormName(e.target.value)}
                  className="w-full bg-white border border-[#16a085] focus:border-[#138871] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#19223c] focus:outline-none transition-all"
                />
              </div>

              {/* Monthly Price */}
              <div>
                <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                  السعر الشهري (ر.س) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={planFormPrice}
                  onChange={(e) => setPlanFormPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#16a085] focus:border-[#138871] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans font-bold text-[#19223c] focus:outline-none transition-all"
                />
              </div>

              {/* Features / Description */}
              <div>
                <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                  المزايا <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={planFormDescription}
                  onChange={(e) => setPlanFormDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#16a085] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#19223c] focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Status Toggle Row */}
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-xs font-bold text-[#19223c]">
                  {planFormStatus === 'نشط'
                    ? 'الخطة: متاحة للاشتراك الجديد'
                    : 'الخطة: غير متاحة للاشتراك الجديد'}
                </span>

                <button
                  type="button"
                  onClick={() => setPlanFormStatus((prev) => (prev === 'نشط' ? 'معطل' : 'نشط'))}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    planFormStatus === 'نشط' ? 'bg-[#16a085]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
                      planFormStatus === 'نشط' ? 'translate-x-0' : '-translate-x-5'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditPlanModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-[#19223c] font-semibold text-xs sm:text-sm transition-all hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  حفظ الخطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Promo Code Modal */}
      {(isAddPromoModalOpen || (isEditPromoModalOpen && editingPromo)) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-cairo animate-fadeIn"
          onClick={() => {
            setIsAddPromoModalOpen(false);
            setIsEditPromoModalOpen(false);
          }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-6 sm:p-7 border border-slate-100 animate-scaleUp"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title & Subtitle */}
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-[#19223c]">
                بيانات كود الخصم
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5">
                أنشئ كود خصم جديد أو عدّل كوداً قائماً — يُطبّق الخصم تلقائياً عند إدخال الكود في شاشة الاشتراك.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={isAddPromoModalOpen ? handleCreatePromo : handleSaveEditPromo}
              className="space-y-4"
            >
              {/* Code Field */}
              <div>
                <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                  الكود <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="WELCOME20"
                  value={isAddPromoModalOpen ? newPromoCode : editPromoCodeStr}
                  onChange={(e) =>
                    isAddPromoModalOpen
                      ? setNewPromoCode(e.target.value.toUpperCase())
                      : setEditPromoCodeStr(e.target.value.toUpperCase())
                  }
                  className="w-full bg-white border border-[#16a085] focus:border-[#138871] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans font-bold text-[#19223c] focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal uppercase"
                />
              </div>

              {/* Discount Percentage and Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Right: Discount Percentage */}
                <div>
                  <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                    نسبة الخصم (%) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={isAddPromoModalOpen ? newPromoDiscount : editPromoDiscount}
                    onChange={(e) =>
                      isAddPromoModalOpen
                        ? setNewPromoDiscount(Number(e.target.value))
                        : setEditPromoDiscount(Number(e.target.value))
                    }
                    className="w-full bg-white border border-[#16a085] focus:border-[#138871] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans font-bold text-[#19223c] focus:outline-none transition-all"
                  />
                </div>

                {/* Left: Expiry Date */}
                <div>
                  <label className="block text-xs font-bold text-[#19223c] mb-1.5">
                    تاريخ الانتهاء <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={isAddPromoModalOpen ? newPromoExpiry : editPromoExpiry}
                    onChange={(e) =>
                      isAddPromoModalOpen
                        ? setNewPromoExpiry(e.target.value)
                        : setEditPromoExpiry(e.target.value)
                    }
                    className="w-full bg-white border border-[#16a085] focus:border-[#138871] focus:ring-1 focus:ring-[#16a085] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans font-medium text-[#19223c] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status Toggle Row */}
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-xs font-bold text-[#19223c]">
                  {(isAddPromoModalOpen ? newPromoStatus : editPromoStatus) === 'نشط'
                    ? 'الحالة: نشط (قابل للاستخدام الآن)'
                    : (isAddPromoModalOpen ? newPromoStatus : editPromoStatus) === 'منتهٍ'
                    ? 'الحالة: منتهٍ (تجاوز تاريخ الصلاحية)'
                    : 'الحالة: معطل (غير متاح للاستخدام)'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (isAddPromoModalOpen) {
                      setNewPromoStatus((prev) => (prev === 'نشط' ? 'معطل' : 'نشط'));
                    } else {
                      setEditPromoStatus((prev) => (prev === 'نشط' ? 'معطل' : 'نشط'));
                    }
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    (isAddPromoModalOpen ? newPromoStatus : editPromoStatus) === 'نشط'
                      ? 'bg-[#16a085]'
                      : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
                      (isAddPromoModalOpen ? newPromoStatus : editPromoStatus) === 'نشط'
                        ? 'translate-x-0'
                        : '-translate-x-5'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPromoModalOpen(false);
                    setIsEditPromoModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-[#19223c] font-semibold text-xs sm:text-sm transition-all hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#19223c] hover:bg-[#253254] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  حفظ الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
