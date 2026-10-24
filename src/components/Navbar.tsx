import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  HelpCircle,
  User,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Award,
  Layers,
  Palette
} from './ui/icons';
import { BrandLogo } from './BrandLogo';
import { BrandGuideModal } from './BrandGuideModal';
import { YUZERSEF_WHATSAPP, generateWhatsAppLink } from '../lib/utils';
import { getSettings } from '../lib/mock-api';
import { SiteSettings } from '../lib/types';
import { DEFAULT_SETTINGS } from '../lib/mock-data';
import { useCart } from '../lib/cart-store';
import { useAuth } from '../lib/auth';

export const Navbar: React.FC = () => {
  // Utility bar hidden to match clean Reference Standard in Image 3
  const SHOW_TOP_BAR = false;

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBrandGuideOpen, setIsBrandGuideOpen] = useState(false);
  const location = useLocation();
  const { totalCount: cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    getSettings().then((res) => {
      if (res) setSettings(res);
    });

    const handleSettingsUpdated = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };

    window.addEventListener('yuzersef-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('yuzersef-settings-updated', handleSettingsUpdated);
  }, []);

  // Primary Navigation Links
  const navLinks = [
    { label: 'المنتجات والتخصيص', path: '/products' },
    { label: 'طلباتي 📦', path: '/orders' },
    { label: 'معرض الأعمال', path: '/portfolio' },
    { label: 'الخدمات', path: '/services' },
    { label: 'من نحن', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') return location.pathname === '/products' || location.pathname.startsWith('/customize');
    if (path === '/orders') return location.pathname === '/orders' || location.pathname === '/account';
    if (path === '/services') return location.pathname.startsWith('/services');
    return location.pathname === path;
  };

  // Lock body scroll when side drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Listen to custom event to open brand guide from anywhere
  useEffect(() => {
    const handleOpenBrandGuide = () => setIsBrandGuideOpen(true);
    window.addEventListener('open-brand-guide', handleOpenBrandGuide);
    return () => window.removeEventListener('open-brand-guide', handleOpenBrandGuide);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-transparent transition-all pointer-events-none">
        {/* Dynamic Social Announcement Banner from Admin Settings */}
        {settings?.announcement?.enabled && settings?.announcement?.text && (() => {
          const isExternalLink =
            settings.announcement.link?.startsWith('http') ||
            settings.announcement.link?.startsWith('//') ||
            settings.announcement.link?.startsWith('wa.me');

          return (
            <div
              className="relative bg-[#012C2B] text-white text-[11px] sm:text-xs py-1.5 border-b border-[#065E5A]/60 pointer-events-auto shadow-xs overflow-hidden select-none w-full [container-type:inline-size]"
              dir="rtl"
            >
              <div className="animate-marquee-single">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#E3A92F] text-[#073B35] shrink-0 shadow-xs ms-1 me-2.5">
                  إعلان
                </span>
                {settings.announcement.link ? (
                  isExternalLink ? (
                    <a
                      href={settings.announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-100/95 hover:text-white font-medium tracking-wide transition-colors"
                    >
                      {settings.announcement.text}
                    </a>
                  ) : (
                    <Link
                      to={settings.announcement.link}
                      className="text-emerald-100/95 hover:text-white font-medium tracking-wide transition-colors"
                    >
                      {settings.announcement.text}
                    </Link>
                  )
                ) : (
                  <span className="text-emerald-100/95 font-medium tracking-wide">
                    {settings.announcement.text}
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        {/* ─────────────────────────────────────────────────────────────
            1. Top Utility Bar (Dark Charcoal/Emerald - Reference Standard)
        ───────────────────────────────────────────────────────────── */}
        {SHOW_TOP_BAR && (
          <div className="bg-[#052925] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900/40 pointer-events-auto">
            <div className="container mx-auto flex items-center justify-between">
              {/* Right items in RTL: Phone number & Direct WhatsApp chat */}
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href={`tel:${YUZERSEF_WHATSAPP}`}
                  className="flex items-center gap-1.5 text-emerald-100 hover:text-[#E3A92F] transition-colors"
                  title="اتصل بنا مباشرة"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E3A92F]" />
                  <span className="font-mono dir-ltr">{YUZERSEF_WHATSAPP}</span>
                </a>

                <a
                  href={generateWhatsAppLink(undefined, 'مرحباً، أود الاستفسار عن خدمات يوزرسيف للطباعة والتطريز في أسوان.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-100 hover:text-[#E3A92F] transition-colors"
                  title="تواصل معنا عبر واتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تواصل عبر واتساب أسوان</span>
                </a>
              </div>

              {/* Left items in RTL: Brand Guide judging trigger & Track Order */}
              <div className="flex items-center gap-3 sm:gap-5">
                <button
                  onClick={() => setIsBrandGuideOpen(true)}
                  className="hidden md:inline-flex items-center gap-1.5 text-[#E3A92F] hover:text-[#f3c15c] font-black text-[11px] bg-[#E3A92F]/10 px-2.5 py-0.5 rounded-full border border-[#E3A92F]/30 transition-all cursor-pointer"
                  title="حقيبة الهوية والتحكيم الخاصة بمسابقة Brand & Build"
                >
                  <Award className="w-3 h-3 text-[#E3A92F]" />
                  <span>حقيبة التحكيم والهوية 🏆</span>
                </button>

                <Link
                  to="/policies"
                  className="hidden sm:flex items-center gap-1.5 text-emerald-100 hover:text-[#E3A92F] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>السياسات والمساعدة</span>
                </Link>

                <Link
                  to="/track"
                  className="flex items-center gap-1.5 text-[#E3A92F] hover:text-[#f4c663] transition-colors font-bold"
                >
                  <span>تتبع طلبك</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            2. Floating White Pill Navbar (Compact Notch Style)
        ───────────────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex justify-center">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/90 px-3.5 sm:px-5 h-[50px] sm:h-[56px] flex items-center justify-between gap-4 sm:gap-6 relative transition-all pointer-events-auto">
            
            {/* Right (Start in RTL): Official Logo */}
            <Link
              to="/"
              className="flex items-center h-full py-1 ps-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A] rounded-full shrink-0"
              aria-label="الصفحة الرئيسية - يوزرسيف"
            >
              <BrandLogo
                src="/logo/logo-green.png"
                variant="logo-green"
                className="h-full max-h-[38px] sm:max-h-[44px] w-auto group-hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Middle: Desktop Navigation Category Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-extrabold transition-all duration-200 ${
                      active
                        ? 'text-[#0B5F55] bg-emerald-50 font-black shadow-2xs'
                        : 'text-slate-800 hover:text-[#0B5F55] hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Left (End in RTL): Pill CTA Button + User Icon + Bag Icon + Mobile Hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prominent Capsule CTA */}
              <Link to="/customize/prod-tshirt-premium">
                <button className="bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-[#073B35] shadow-[2px_2px_0px_#073B35] hover:shadow-[3px_3px_0px_#073B35] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                  <span>صمم واطلب الآن</span>
                  <svg className="w-3 h-3 rtl:rotate-90 text-[#073B35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </button>
              </Link>

              {/* Shopping Bag Icon with dynamic cart count */}
              <Link
                to="/cart"
                title="سلة المشتريات"
                className="p-1.5 sm:p-2 text-[#073B35] hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 ? (
                  <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] rounded-full bg-[#0B5F55] text-white text-[10px] font-black flex items-center justify-center px-1 ring-2 ring-white">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-[#E3A92F] ring-2 ring-white" />
                )}
              </Link>

              {/* User Account / Orders Button */}
              {isAuthenticated ? (
                <Link
                  to="/orders"
                  title={`مسجل كـ ${user?.name} - صفحة طلباتي`}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#073B35] bg-emerald-50 hover:bg-emerald-100/80 rounded-full border border-emerald-200/80 transition-colors shrink-0"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0B5F55] text-white flex items-center justify-center text-[10px] font-black">
                    {user?.name?.slice(0, 1) || 'ع'}
                  </div>
                  <span className="hidden sm:inline max-w-[70px] truncate">{user?.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login?redirect=/orders"
                  title="تسجيل الدخول / إنشاء حساب"
                  className="p-1.5 sm:p-2 text-[#073B35] hover:bg-slate-100 rounded-full transition-colors cursor-pointer relative"
                  aria-label="تسجيل الدخول"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A]"
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة الرئيسية'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. Mobile Horizontal Side Drawer (Slides in from Left via Portal)
        ───────────────────────────────────────────────────────────── */}
        {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs animate-fade-in pointer-events-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed top-0 bottom-0 left-0 w-[300px] sm:w-[340px] max-w-[85vw] h-full bg-[#FAF7F2] shadow-2xl z-[9999] flex flex-col justify-between border-r border-[#d9d2c3] animate-slide-in-left overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="القائمة الرئيسية"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#e2dbce] bg-white shrink-0">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <BrandLogo src="/logo/logo-green.png" variant="logo-green" className="h-9 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -m-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Brand Guide judging banner inside mobile drawer */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBrandGuideOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#073B35] to-[#0B5F55] text-white shadow-md text-xs font-bold text-start cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#E3A92F]" />
                    <span>حقيبة الهوية والتحكيم 🏆</span>
                  </div>
                  <span className="text-[10px] bg-[#E3A92F] text-[#073B35] px-2 py-0.5 rounded-full font-black">
                    افتح
                  </span>
                </button>

                <div className="text-[11px] font-bold text-[#0B5F55] tracking-wider">
                  أقسام المنصة والخدمات
                </div>

                <nav className="flex flex-col space-y-1">
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#0B5F55] bg-emerald-50/80 hover:bg-emerald-100/60 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>سلة المشتريات</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-[#0B5F55] text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-50/90 hover:bg-amber-100 transition-all flex items-center justify-between border border-amber-200/80"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-700" />
                      <span>صفحة طلباتي (Orders) - رفع الإيصال</span>
                    </div>
                    <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  </Link>

                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-white hover:text-[#0B5F55] transition-all flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  <Link
                    to="/policies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-white hover:text-[#0B5F55] transition-all flex items-center justify-between"
                  >
                    <span>السياسات والشروط المعتمدة</span>
                  </Link>
                </nav>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 sm:p-5 border-t border-[#e2dbce] bg-white space-y-2.5 shrink-0">
                <Link
                  to="/request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block"
                >
                  <button className="w-full bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    <span>ابدأ معالج الطلب الذكي</span>
                  </button>
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#0B5F55] font-bold"
                  >
                    لوحة الإدارة
                  </Link>
                  <Link
                    to="/track"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#0B5F55] font-bold text-[#0B5F55]"
                  >
                    تتبع طلبك
                  </Link>
                </div>

                {/* User Auth Link inside Drawer */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  {isAuthenticated ? (
                    <>
                      <span className="text-[#073B35] font-bold">
                        مرحباً، {user?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        تسجيل خروج
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login?redirect=/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#0B5F55] font-black hover:underline"
                    >
                      تسجيل الدخول / إنشاء حساب جديد ↗
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </header>

      {/* Brand Guide Modal Component */}
      <BrandGuideModal
        isOpen={isBrandGuideOpen}
        onClose={() => setIsBrandGuideOpen(false)}
      />
    </>
  );
};
