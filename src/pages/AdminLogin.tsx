import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Sparkles,
  X,
  Globe,
  User,
} from 'lucide-react';
import { loginAdmin } from '../lib/mock-api';
import { DEMO_ADMIN_CREDENTIALS } from '../lib/mock-data';
import { setUserSession } from '../lib/auth';

// Slide data for left blue panel
const ONBOARDING_SLIDES = [
  {
    title: 'Welcome aboard my friend',
    subtitle: 'just a couple of clicks and we start',
    titleAr: 'مرحباً بك على متن الرحلة يا صديقي',
    subtitleAr: 'بضع نقرات فقط ونبدأ رحلتنا معاً',
  },
  {
    title: 'Craft Your Brand Identity',
    subtitle: 'premium apparel, embroidery & custom merchandise',
    titleAr: 'اصنع هويتك البصرية المميزة',
    subtitleAr: 'أزياء راقية وتطريز وهدايا مخصصة بأعلى جودة',
  },
  {
    title: 'Track Every Single Step',
    subtitle: 'live production updates from workshop to your door',
    titleAr: 'تابع طلبك لحظة بلحظة',
    subtitleAr: 'تحديثات حية للإنتاج والتسليم حتى باب منزلك',
  },
];

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || searchParams.get('returnUrl') || '/';
  const isOrderRedirect = redirectTarget.includes('checkout') || redirectTarget.includes('order');

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Language: 'en' (default matching mockup) | 'ar'
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Auto-rotate slides gently every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ONBOARDING_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Quick fill admin credentials
  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN_CREDENTIALS.username);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setError('');
    setSuccessMsg(
      lang === 'en'
        ? 'Admin demo credentials auto-filled! Click "Log in" to enter.'
        : 'تمت تعبئة بيانات المشرف التجريبية! انقر على "تسجيل الدخول".'
    );
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Submit login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(
        lang === 'en'
          ? 'Please enter your email and password.'
          : 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'
      );
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const normalizedInput = email.trim().toLowerCase();
      const isAdminAttempt =
        normalizedInput === DEMO_ADMIN_CREDENTIALS.username.toLowerCase() ||
        normalizedInput === 'admin@yuzersef.com' ||
        normalizedInput === 'admin@example.com';

      if (isAdminAttempt) {
        // Authenticate with admin API
        await loginAdmin(DEMO_ADMIN_CREDENTIALS.username, password);
        setSuccessMsg(
          lang === 'en'
            ? 'Admin login successful! Redirecting to dashboard...'
            : 'تم تسجيل دخول المشرف بنجاح! جاري الانتقال للوحة التحكم...'
        );
        setTimeout(() => {
          navigate('/admin');
        }, 600);
      } else {
        // Mock user login
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUserSession({
          email: email.trim(),
          name: email.split('@')[0],
          role: 'customer',
          loginTime: new Date().toISOString(),
        });
        setSuccessMsg(
          lang === 'en'
            ? 'Logged in successfully! Welcome back.'
            : 'تم تسجيل الدخول بنجاح! مرحباً بك مجدداً.'
        );
        setTimeout(() => {
          navigate(redirectTarget);
        }, 700);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === 'en'
            ? 'Invalid credentials. For admin access use admin / demo123'
            : 'بيانات الدخول غير صحيحة. للإدارة استخدم admin / demo123')
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(
        lang === 'en'
          ? 'Please fill in all required fields.'
          : 'يرجى ملء كافة الحقول المطلوبة.'
      );
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUserSession({
        email: email.trim(),
        name: name.trim(),
        role: 'customer',
        loginTime: new Date().toISOString(),
      });
      setSuccessMsg(
        lang === 'en'
          ? 'Account created successfully! Welcome aboard.'
          : 'تم إنشاء الحساب بنجاح! مرحباً بك على متن الرحلة.'
      );
      setTimeout(() => {
        navigate(redirectTarget);
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Simulated Social Login
  const handleSocialLogin = (provider: 'Google' | 'GitLab') => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    setTimeout(() => {
      setLoading(false);
      setUserSession({
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        provider,
        role: 'customer',
        loginTime: new Date().toISOString(),
      });
      setSuccessMsg(
        lang === 'en'
          ? `Signed in with ${provider} successfully!`
          : `تم تسجيل الدخول بواسطة ${provider} بنجاح!`
      );
      setTimeout(() => {
        navigate(redirectTarget);
      }, 600);
    }, 600);
  };

  // Forgot password submit
  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
      setSuccessMsg(
        lang === 'en'
          ? 'Reset instructions have been sent to your email.'
          : 'تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني.'
      );
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1200);
  };

  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#ECEFF3] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative selection:bg-[#384CAA]/20 selection:text-[#384CAA]"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Top Bar Utilities */}
      <div className="w-full max-w-[880px] flex items-center justify-between mb-3 px-1 text-xs text-slate-500">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#384CAA] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Back to Store' : 'العودة للمتجر'}</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Quick Demo Fill Helper */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#384CAA] hover:bg-slate-50 transition-colors shadow-2xs font-semibold cursor-pointer"
            title="Auto-fill admin credentials"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#384CAA]" />
            <span>{lang === 'en' ? 'Admin Demo: admin / demo123' : 'بيانات تجريبية: admin'}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-bold uppercase">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Main Redesigned Login Card */}
      <div className="w-full max-w-[880px] min-h-[520px] bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-950/12 border border-slate-100 flex flex-col md:flex-row transition-all duration-300">
        {/* ========================================================
            LEFT COLUMN: Blue Hero with Astronaut & Carousel
            ======================================================== */}
        <div className="w-full md:w-[56%] bg-[#263D9B] relative p-8 sm:p-10 md:p-12 flex flex-col justify-between items-center text-center overflow-hidden select-none">
          {/* Subtle background ambient radial light */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#3953C7]/40 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#182C7E]/50 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top spacer / tag */}
          <div className="w-full flex justify-between items-center z-10">
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200/70">
              YUZERSEF STUDIO
            </span>
            <div className="flex items-center gap-1 text-[11px] text-blue-200/80 bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{lang === 'en' ? 'Creative Portal' : 'البوابة الإبداعية'}</span>
            </div>
          </div>

          {/* Astronaut Illustration with levitation animation */}
          <div className="my-auto py-6 sm:py-8 flex flex-col items-center justify-center z-10 w-full">
            <div className="relative group cursor-pointer transition-transform duration-500 hover:scale-105">
              {/* Astronaut Avatar Graphic */}
              <img
                src="/astronaut-badge-transparent-2x.png"
                alt="Welcome Astronaut Illustration"
                className="w-48 sm:w-56 md:w-60 h-auto object-contain drop-shadow-[0_12px_24px_rgba(7,20,70,0.45)] transition-all duration-500"
                style={{
                  animation: 'float 5s ease-in-out infinite',
                }}
              />
            </div>

            {/* Slide Headings */}
            <div className="mt-6 sm:mt-8 max-w-sm px-2 transition-all duration-500">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {lang === 'en' ? slide.title : slide.titleAr}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-blue-100/75 font-normal tracking-wide">
                {lang === 'en' ? slide.subtitle : slide.subtitleAr}
              </p>
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="w-full flex items-center justify-center gap-2.5 z-10 pt-2 pb-1">
            {ONBOARDING_SLIDES.map((_, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="p-1 cursor-pointer transition-all duration-300 focus:outline-none"
                >
                  {isActive ? (
                    <span className="block w-2.5 h-2.5 rounded-full bg-white ring-4 ring-white/30 shadow-xs" />
                  ) : (
                    <span className="block w-2 h-2 rounded-full bg-[#152569] hover:bg-white/40 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: White Login / Register Form
            ======================================================== */}
        <div className="w-full md:w-[44%] bg-white p-7 sm:p-9 md:p-11 flex flex-col justify-center">
          {/* Header Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-[28px] font-bold text-slate-800 tracking-tight">
              {mode === 'login'
                ? lang === 'en'
                  ? 'Welcome'
                  : 'مرحباً بك'
                : lang === 'en'
                ? 'Create Account'
                : 'إنشاء حساب جديد'}
            </h1>
          </div>

          {/* Alert / Notification Feedback */}
          {isOrderRedirect && !error && !successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2.5 animate-in fade-in" dir="rtl">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="font-bold">
                {lang === 'en'
                  ? 'Please log in or create an account to proceed with your order and upload payment receipts.'
                  : 'يرجى تسجيل الدخول أو إنشاء حساب جديد لإتمام طلبك ومتابعة حالته ورفع إيصال التحويل.'}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Email / Username Input */}
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  dir="ltr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder={lang === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA] transition-all font-normal"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder={lang === 'en' ? 'Password' : 'كلمة المرور'}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA] transition-all font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#4F63D2] hover:text-[#384CAA] hover:underline font-normal cursor-pointer transition-colors"
                >
                  {lang === 'en' ? 'Forgot password?' : 'نسيت كلمة المرور؟'}
                </button>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#384CAA] hover:bg-[#2F3F96] active:scale-[0.99] text-white text-sm font-semibold rounded-full shadow-sm shadow-[#384CAA]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{lang === 'en' ? 'Log in' : 'تسجيل الدخول'}</span>
                )}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'en' ? 'Full Name' : 'الاسم الكامل'}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA] transition-all font-normal"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA] transition-all font-normal"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Password' : 'كلمة المرور'}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA] transition-all font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#384CAA] hover:bg-[#2F3F96] active:scale-[0.99] text-white text-sm font-semibold rounded-full shadow-sm shadow-[#384CAA]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{lang === 'en' ? 'Create Account' : 'إنشاء الحساب'}</span>
                )}
              </button>
            </form>
          )}

          {/* Or Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full absolute" />
            <span className="bg-white px-3 text-xs text-slate-400 relative z-10 font-normal">
              {lang === 'en' ? 'Or' : 'أو'}
            </span>
          </div>

          {/* Social Sign-in Buttons: Google & GitLab */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-full hover:bg-slate-50/80 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* GitLab */}
            <button
              type="button"
              onClick={() => handleSocialLogin('GitLab')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-full hover:bg-slate-50/80 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.65 14.39L20.6 8.08c-.14-.42-.5-.72-.94-.74-.44-.02-.84.24-1.01.65l-1.99 4.88H7.34L5.35 8c-.17-.41-.57-.67-1.01-.65-.44.02-.8.32-.94.74L1.35 14.4c-.17.51.01 1.08.45 1.4l10.2 7.42c.48.35 1.13.35 1.61 0l10.2-7.42c.44-.32.61-.89.44-1.41z"
                  fill="#E24329"
                />
                <path d="M12 23.22l-4.66-10.91h9.32L12 23.22z" fill="#FC6D26" />
                <path d="M12 23.22L7.34 12.31H1.8L12 23.22z" fill="#FCA326" />
                <path d="M12 23.22l4.66-10.91h5.54L12 23.22z" fill="#FCA326" />
              </svg>
              <span>GitLab</span>
            </button>
          </div>

          {/* Bottom Switch between Login / Registration */}
          <div className="mt-5 text-center">
            {mode === 'login' ? (
              <>
                <p className="text-xs text-slate-400 mb-2 font-normal">
                  {lang === 'en' ? 'Have no account yet?' : 'ليس لديك حساب بعد؟'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:border-[#384CAA]/50 rounded-full text-xs font-semibold text-[#384CAA] hover:bg-[#384CAA]/5 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Registration' : 'التسجيل'}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 mb-2 font-normal">
                  {lang === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:border-[#384CAA]/50 rounded-full text-xs font-semibold text-[#384CAA] hover:bg-[#384CAA]/5 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Log in' : 'تسجيل الدخول'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {lang === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'en'
                ? 'Enter your email and we will send you a link to reset your password.'
                : 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور.'}
            </p>

            <form onSubmit={handleSendResetLink} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#384CAA]/20 focus:border-[#384CAA]"
                />
              </div>

              <button
                type="submit"
                disabled={forgotSent}
                className="w-full py-2.5 bg-[#384CAA] hover:bg-[#2F3F96] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {forgotSent
                  ? lang === 'en'
                    ? 'Sending Link...'
                    : 'جاري الإرسال...'
                  : lang === 'en'
                  ? 'Send Reset Link'
                  : 'إرسال رابط الاستعادة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
