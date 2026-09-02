import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Shield,
  Bot,
  Brain,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageSquare,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onBackToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [accountType, setAccountType] = useState<'parent' | 'student'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMsg('يرجى إدخال رقم جوال صالح');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('يرجى إدخال رمز التحقق المكون من 4 أرقام');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#ffffff] text-slate-800 font-cairo antialiased select-none">
      {/* Right Column: Hero Branding with Deep Indigo Blue Gradient */}
      <div className="lg:w-1/2 bg-gradient-to-b from-[#26315c] via-[#242d54] to-[#1d2444] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden order-1 lg:order-2">
        {/* Subtle background glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-teal-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            منصّة التعلّم الذكي
          </span>
        </div>

        {/* Middle Value Proposition & Features */}
        <div className="my-auto py-10 max-w-lg relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white leading-snug sm:leading-tight mb-10 tracking-tight">
            تعلم يتكيّف مع طفلك، ومتابعة تطمئنك أنت
          </h2>

          <div className="space-y-5">
            {/* Feature 1: Diagnostic Assessment */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-sm sm:text-[15px] font-medium text-slate-100/90 leading-relaxed">
                تقييم تشخيصي ذكي وخطة تعلّم يومية مخصصة
              </span>
            </div>

            {/* Feature 2: Full Parent Dashboard */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-sm sm:text-[15px] font-medium text-slate-100/90 leading-relaxed">
                لوحة متابعة كاملة لأداء أبنائك
              </span>
            </div>

            {/* Feature 3: Digital Safety */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-sky-300" />
              </div>
              <span className="text-sm sm:text-[15px] font-medium text-slate-100/90 leading-relaxed">
                رصد سلامة رقمية وتنبيهات فورية
              </span>
            </div>

            {/* Feature 4: Daily AI Companion */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-rose-300" />
              </div>
              <span className="text-sm sm:text-[15px] font-medium text-slate-100/90 leading-relaxed">
                رفيق تعليمي يحفّز الطالب يومياً
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Box */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-xl max-w-lg">
          <p className="text-sm sm:text-[15px] text-white/95 leading-relaxed font-normal">
            &ldquo;لأول مرة أقدر أتابع مستوى ابني أول بأول من دون ما أسأله كل يوم.&rdquo;
          </p>
          <span className="text-xs text-slate-300 font-medium mt-2.5 block">
            — سارة أحمد، ولية أمر
          </span>
        </div>
      </div>

      {/* Left Column: Login / OTP Form with Clean Light Design */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between order-2 lg:order-1 bg-[#ffffff]">
        {/* Top Actions: Language Selector & Back to Main */}
        <div className="flex items-center justify-between gap-4">
          {/* Language Toggle Pill */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-xs font-bold border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-[#1c2438] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'ar'
                  ? 'bg-[#1c2438] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ع
            </button>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={onBackToHome || onLoginSuccess}
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 group"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-[400px] mx-auto my-auto py-8">
          {step === 'phone' ? (
            <div>
              {/* Heading */}
              <div className="text-center mb-7">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  تسجيل الدخول
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                  أهلاً بعودتك! اختر نوع حسابك للمتابعة
                </p>
              </div>

              {/* Account Type Selector (Parent / Student) */}
              <div className="bg-[#f1f5f9] p-1 rounded-xl flex gap-1 mb-6 border border-slate-200/50">
                <button
                  type="button"
                  id="tab-parent-btn"
                  onClick={() => setAccountType('parent')}
                  className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    accountType === 'parent'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <span>👨‍👩‍👧‍👦</span>
                  <span>ولي أمر</span>
                </button>
                <button
                  type="button"
                  id="tab-student-btn"
                  onClick={() => setAccountType('student')}
                  className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    accountType === 'student'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <span>🎓</span>
                  <span>طالب</span>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-700 mb-1.5 text-right">
                    رقم الجوال
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-[#48877b] focus-within:ring-2 focus-within:ring-[#48877b]/15 bg-white transition-all overflow-hidden shadow-2xs">
                    <input
                      type="tel"
                      id="phone-input"
                      dir="ltr"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="5X XXX XXXX"
                      className="w-full py-3 px-4 text-slate-800 text-sm font-medium outline-hidden placeholder:text-slate-400 placeholder:text-right"
                    />
                    <div className="flex items-center gap-2 px-3 py-3 bg-slate-50/70 border-r border-slate-100 text-xs font-bold text-slate-600 shrink-0">
                      <span className="text-[11px] text-slate-500">+SA 966</span>
                    </div>
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{errorMsg}</p>
                  )}
                </div>

                {/* Info Note Box */}
                <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 leading-relaxed text-right flex items-start gap-2.5">
                  <span className="text-base shrink-0 mt-0.5">📲</span>
                  <span>
                    سنرسل رمز تحقق مكوّن من 4 أرقام إلى جوالك أو واتساب لتأكيد الدخول — بلا كلمة مرور لحفظها.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="send-otp-btn"
                  disabled={loading}
                  className="w-full bg-[#48877b] hover:bg-[#3c7268] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-[#48877b]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>إرسال رمز التحقق</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: OTP Verification Step */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#48877b] flex items-center justify-center mx-auto mb-3 border border-teal-100 shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  أدخل رمز التحقق
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  تم إرسال الرمز المكون من 4 أرقام إلى الرقم{' '}
                  <strong className="text-slate-800" dir="ltr">
                    +966 {phoneNumber || '50 123 4567'}
                  </strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex justify-center gap-3" dir="ltr">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpCode[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-14 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 focus:border-[#48877b] focus:ring-2 focus:ring-[#48877b]/20 outline-hidden bg-slate-50/60 focus:bg-white transition-all shadow-2xs"
                    />
                  ))}
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-500 text-center font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  id="verify-otp-btn"
                  disabled={loading}
                  className="w-full bg-[#48877b] hover:bg-[#3c7268] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-[#48877b]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>تأكيد وتسجيل الدخول</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    تغيير رقم الجوال
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(['', '', '', '']);
                      setErrorMsg('');
                    }}
                    className="text-[#48877b] hover:underline font-bold"
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>بياناتك وبيانات أبنائك مشفّرة بالكامل ولا تُشارك مع أي طرف ثالث</span>
          </div>

          {/* Footer Register Link */}
          <div className="mt-4 text-center text-xs text-slate-500 font-medium">
            <span>ليس لديك حساب؟ </span>
            <button
              onClick={onLoginSuccess}
              className="text-[#48877b] font-bold hover:underline"
            >
              ابدأ مجاناً
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} منصّة التعلّم الذكي. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
};
