import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Award,
  ChevronLeft
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { SiteSettings } from '../lib/types';
import { getSettings } from '../lib/mock-api';
import { DEFAULT_SETTINGS } from '../lib/mock-data';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

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

  const { socialLinks } = settings;

  // Social platforms list - only rendered if provided in dashboard settings ("لو موجودة")
  const socialPlatforms = [
    {
      id: 'instagram',
      name: 'إنستجرام',
      enName: 'Instagram',
      url: socialLinks?.instagram,
      badgeColor: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-transparent',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'فيسبوك',
      enName: 'Facebook',
      url: socialLinks?.facebook,
      badgeColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      name: 'تيك توك',
      enName: 'TikTok',
      url: socialLinks?.tiktok,
      badgeColor: 'hover:bg-black hover:border-black',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.99v9.06c.01 1.42-.39 2.85-1.17 4.04-1.39 2.14-3.82 3.49-6.39 3.46-2.42-.04-4.71-1.26-6.07-3.25-1.64-2.38-1.64-5.63.01-8.01 1.34-1.95 3.57-3.15 5.95-3.17.43 0 .86.04 1.28.11v4.14c-.42-.14-.87-.2-1.32-.19-1.16.02-2.26.6-2.89 1.57-.77 1.16-.76 2.7.02 3.85.73 1.08 2.04 1.69 3.34 1.55 1.35-.14 2.47-1.16 2.76-2.48.09-.43.13-.88.13-1.32V.02z" />
        </svg>
      ),
    },
    {
      id: 'telegram',
      name: 'تيليجرام',
      enName: 'Telegram',
      url: socialLinks?.telegram,
      badgeColor: 'hover:bg-[#229ED9] hover:border-[#229ED9]',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'يوتيوب',
      enName: 'YouTube',
      url: socialLinks?.youtube,
      badgeColor: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'إكس / تويتر',
      enName: 'X (Twitter)',
      url: socialLinks?.twitter,
      badgeColor: 'hover:bg-slate-900 hover:border-slate-800',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'behance',
      name: 'بيهانس',
      enName: 'Behance',
      url: socialLinks?.behance,
      badgeColor: 'hover:bg-[#0057FF] hover:border-[#0057FF]',
      hoverText: 'hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.529-5.555-5.918 0-3.498 2.094-6.082 5.555-6.082 3.486 0 5.257 2.502 5.257 5.753 0 .543-.058 1.054-.153 1.54h-8.23c.121 1.982 1.385 3.107 3.126 3.107 1.488 0 2.457-.688 2.914-1.4h2.262zm-7.854-4.577h5.818c-.126-1.782-1.248-2.695-2.864-2.695-1.636 0-2.822.913-2.954 2.695zm-9.872 7.577h-6v-16h6.732c2.81 0 4.673 1.272 4.673 3.731 0 1.503-.787 2.656-2.08 3.197 1.705.518 2.675 1.895 2.675 3.693 0 3.203-2.569 5.379-6 5.379zm-3.5-6.5h3.048c1.373 0 2.146-.666 2.146-1.802 0-1.139-.773-1.803-2.146-1.803h-3.048v3.605zm0-5.5h2.95c1.232 0 1.954-.604 1.954-1.644 0-1.04-.722-1.644-1.954-1.644h-2.95v3.288z" />
        </svg>
      ),
    },
  ];

  // Filter only links that exist and are not empty
  const activeSocialLinks = socialPlatforms.filter(
    (p) => p.url && typeof p.url === 'string' && p.url.trim().length > 0
  );

  return (
    <footer className="relative bg-[#012C2B] text-emerald-100/90 pt-16 pb-10 border-t border-[#065E5A]/50 overflow-hidden select-none">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 bg-[#065E5A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-24 w-96 h-96 bg-[#E3A92F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* MAIN FOOTER 4-COLUMN GRID                               */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#065E5A]/40">
          
          {/* ---------------- Col 1: Brand & Social Channels ---------------- */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="يوزرسيف">
              <BrandLogo
                variant="white-on-deep"
                className="h-12 w-auto"
              />
            </Link>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E3A92F]/15 border border-[#E3A92F]/30 text-xs font-bold text-[#E3A92F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.businessName || 'وكالة يوزرسيف للطباعة والتخصيص'}</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
              وكالة تصميم وطباعة متكاملة تجمع بين الفكر الإبداعي والتقنيات الطباعية والتطريز الميكانيكي لتحويل أفكارك إلى هوية ملموسة وواقعية في أسوان.
            </p>

            {/* Dynamic Social Media Links (if configured in Dashboard) */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E3A92F]"></span>
                  تابعنا على السوشيال ميديا:
                </span>
                <span className="text-[10px] text-emerald-200/60 font-mono">حسابات رسمية</span>
              </div>

              {activeSocialLinks.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialLinks.map((plat) => (
                    <a
                      key={plat.id}
                      href={plat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 rounded-lg bg-white/10 ${plat.badgeColor} ${plat.hoverText} text-emerald-100 text-xs font-bold transition-all border border-white/10 inline-flex items-center gap-1.5 shadow-xs hover:shadow-md hover:-translate-y-0.5`}
                      title={`زيارة حسابنا الرسمي على ${plat.enName}`}
                    >
                      {plat.icon}
                      <span>{plat.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-emerald-100/60 bg-white/5 p-2 rounded-lg border border-white/10">
                  يمكن ضبط وتحديث روابط المنصات الرسمية من لوحة تحكم المشرف.
                </div>
              )}
            </div>

            {/* IEEE & Brand Guide Badges */}
            <div className="pt-3 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#065E5A]/40 border border-[#065E5A] text-xs text-[#E3A92F]">
                <Award className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-semibold">مشروع مسابقة Brand & Build × IEEE Aswan</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-brand-guide'))}
                  className="px-2.5 py-1 rounded-md bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                >
                  <span>حقيبة الهوية والتحكيم 🏆</span>
                </button>

                <a
                  href="/briefs/Brand-and-Build-Client-Brief-English_0e6dce5b.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-100 text-[11px] font-bold transition-all border border-white/15"
                >
                  بريف المسابقة (PDF)
                </a>

                <a
                  href="/briefs/Yuzersef-Project-Documentation_e75af4b9.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-100 text-[11px] font-bold transition-all border border-white/15"
                >
                  ملف التوثيق (PDF)
                </a>
              </div>
            </div>
          </div>

          {/* ---------------- Col 2: Fast Navigation Links ---------------- */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E3A92F]"></span>
              روابط الموقع والتصفح
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#E3A92F] transition-transform group-hover:-translate-x-1" />
                  <span>كتالوج المنتجات والأسعار</span>
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#E3A92F] transition-transform group-hover:-translate-x-1" />
                  <span>مصمم اللوجو والتطريز التفاعلي</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>خدمات الطباعة والتطريز</span>
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>معرض المشاريع السابقة بأسوان</span>
                </Link>
              </li>
              <li>
                <Link to="/lab" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>مختبر يوزرسيف الإبداعي</span>
                </Link>
              </li>
              <li>
                <Link to="/request" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>معالج تقديم طلب أو عرض سعر</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#E3A92F] transition-transform group-hover:-translate-x-1" />
                  <span>تتبع حالة الطلب بالرقم</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>من نحن وفريق العمل</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>صفحة التواصل والخريطة</span>
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:-translate-x-1" />
                  <span>السياسات والشروط والضمان</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ---------------- Col 3: Contact Info ---------------- */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E3A92F]"></span>
              معلومات التواصل المعتمدة
            </h4>

            <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-100/75">

              {/* Official Email */}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E3A92F] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-emerald-200/60">البريد الإلكتروني:</span>
                  <a
                    href={`mailto:${settings.email || 'contact@usersafe.demo'}`}
                    className="text-white font-mono hover:underline text-xs"
                    dir="ltr"
                  >
                    {settings.email || 'contact@usersafe.demo'}
                  </a>
                </div>
              </li>

              {/* Address / Location */}
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E3A92F] mt-1 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-emerald-200/60">المقر والمعمل:</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      settings.address || 'أسوان، مصر'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline text-xs"
                  >
                    {settings.address || 'أسوان، جمهورية مصر العربية (قرب محطة القطار)'}
                  </a>
                </div>
              </li>

              {/* Working Hours */}
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E3A92F] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-emerald-200/60">ساعات ومواعيد العمل:</span>
                  <span className="text-white text-xs">
                    {settings.workingHours || 'السبت - الخميس: 9:00 ص - 10:00 م'}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* ---------------- Col 4: Quality Guarantee & Admin Portal ---------------- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="square-icon" className="w-7 h-7 rounded-lg shrink-0 shadow-sm" />
              <h4 className="text-white font-bold text-base">ضمان الجودة والإدارة</h4>
            </div>

            {/* Quality Promise Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#065E5A]/50 to-[#023331] border border-[#065E5A] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#E3A92F] font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>معايير يوزرسيف المعتمدة</span>
              </div>
              <p className="text-emerald-100/70 text-[11px] leading-relaxed">
                قطن مصري 100%، طباعة DTF عالية الصمود، وتطريز 3D بارز مقاوم لغسيل وحرارة أسوان.
              </p>
            </div>

            {/* Admin Portal Gateway */}
            <div className="p-3.5 rounded-xl bg-[#065E5A]/30 border border-[#065E5A]/70 text-xs space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">بوابة المشرف الإدارية</span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                  لوحة التحكم
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                تعديل إعدادات السوشيال ميديا، المنتجات، والطلبيات.
              </p>
              <div className="text-[10px] font-mono text-emerald-200/80 bg-black/20 p-1.5 rounded space-y-0.5">
                <div>المستخدم: <span className="text-white font-bold">admin</span></div>
                <div>كلمة المرور: <span className="text-white font-bold">demo123</span></div>
              </div>
              <Link
                to="/admin/login"
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[#065E5A] hover:bg-[#087772] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>الانتقال للوحة التحكم</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
              </Link>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM COPYRIGHT & LEGAL BAR                             */}
        {/* ======================================================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-start">
            <p>
              © {new Date().getFullYear()} {settings.businessName || 'وكالة يوزرسيف للطباعة والتخصيص'}. جميع الحقوق محفوظة.
            </p>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-200/80 font-medium">صُنعت بكل فخر وإتقان في أسوان 🇪🇬</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/policies" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <span>•</span>
            <Link to="/policies" className="hover:text-white transition-colors">
              شروط الخدمة والضمان
            </Link>
            <span>•</span>
            <Link to="/track" className="hover:text-white transition-colors">
              تتبع الطلب
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-white transition-colors">
              لوحة التحكم
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
