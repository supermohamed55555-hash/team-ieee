import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  Palette,
  FileCheck,
} from 'lucide-react';
import { BRAND_COLORS, SOCIAL_DESIGNS } from '../data/initialData';
import { Logo } from './Logo';

interface BrandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickWalkthroughStep?: (stepIndex: number) => void;
}

export const BrandGuideModal: React.FC<BrandGuideModalProps> = ({
  isOpen,
  onClose,
  onQuickWalkthroughStep,
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'logo' | 'social' | 'walkthrough'>('social');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string, isHex = false) => {
    navigator.clipboard.writeText(text);
    if (isHex) {
      setCopiedHex(id);
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedCaptionId(id);
      setTimeout(() => setCopiedCaptionId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F6F1E7] border border-[#073B35]/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#073B35] text-white p-5 flex items-center justify-between border-b border-[#073B35]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E3A92F] text-[#073B35] rounded-xl flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-display text-lg">
                حقيبة الهوية البصرية والتسليم (Brand & Handover Package)
              </h3>
              <p className="text-xs text-[#F6F1E7]/70">
                بريف مسابقة Brand & Build × يوزرسيف (IEEE Aswan Student Branch)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-[#073B35]/10 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:bg-[#F6F1E7]'
            }`}
          >
            تصميمين السوشيال ميديا (Social Designs)
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:bg-[#F6F1E7]'
            }`}
          >
            بالتة الألوان المعتمدة (Colors Palette)
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'logo'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:bg-[#F6F1E7]'
            }`}
          >
            تطوير الشعار (Logo Refinement)
          </button>
          <button
            onClick={() => setActiveTab('walkthrough')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'walkthrough'
                ? 'bg-[#0B5F55] text-white shadow-xs'
                : 'text-[#073B35]/70 hover:bg-[#F6F1E7]'
            }`}
          >
            سيناريو العرض أمام الحكام (Walkthrough Script)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB: SOCIAL MEDIA DESIGNS */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-[#0B5F55]/10 p-4 rounded-2xl border border-[#0B5F55]/20 text-xs text-[#073B35]">
                <span className="font-bold block mb-1">المطلوب في البريف:</span>
                تصميمان كاملان بأبعاد السوشيال القياسية (4:5)، الأول لتعريف بالخدمات والثاني لدعوة العميل للتخصيص على الموقع، مع استخدام هوية يوزرسيف البصرية.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SOCIAL_DESIGNS.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-[#073B35]/15 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                  >
                    {/* Visual Mockup Canvas 4:5 */}
                    <div
                      className="aspect-[4/5] p-6 flex flex-col justify-between text-white relative select-none"
                      style={{ backgroundColor: post.bgColor }}
                    >
                      {/* Top Bar inside Post */}
                      <div className="flex items-center justify-between">
                        <Logo variant="light" className="h-7" />
                        <span className="text-[10px] font-mono tracking-wider opacity-75">
                          {post.aspectRatio}
                        </span>
                      </div>

                      {/* Main Message */}
                      <div className="my-auto space-y-3">
                        <span className="text-[11px] font-bold text-[#E3A92F] uppercase tracking-wide">
                          {post.theme}
                        </span>
                        <h4 className="text-2xl font-black font-display leading-snug">
                          {post.headline}
                        </h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                          {post.subheadline}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {post.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs font-semibold"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom CTA Button inside Post */}
                      <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                        <div className="bg-[#E3A92F] text-[#073B35] font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm">
                          {post.callToAction}
                        </div>
                        <span className="text-[11px] font-mono opacity-80">01116891025</span>
                      </div>
                    </div>

                    {/* Metadata & Copy Caption */}
                    <div className="p-4 bg-white space-y-3 border-t border-[#073B35]/10 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#073B35]">{post.title}</span>
                        <button
                          onClick={() => handleCopy(post.suggestedCaption, post.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B5F55] hover:underline cursor-pointer"
                        >
                          {copiedCaptionId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>تم نسخ الكابشن</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ كابشن النشر</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#073B35]/75 leading-relaxed bg-[#F6F1E7] p-2.5 rounded-lg">
                        {post.suggestedCaption}
                      </p>

                      <div className="text-[10px] text-[#0B5F55] font-mono">
                        {post.hashtags.join(' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COLORS PALETTE */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-[#073B35]/15 text-xs text-[#073B35] leading-relaxed">
                <span className="font-bold block mb-1">
                  شرط البريف الإلزامي (Preserve Original Colours):
                </span>
                الحفاظ على كامل باليتة الألوان الأصلية المعتمدة لـ يوزرسيف دون استبدال أو اختزال، مع تجنب استخدام الأزرق والبرتقالي الخاصين بجهة التنظيم (Brand & Build).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BRAND_COLORS.map((col) => (
                  <div
                    key={col.hex}
                    className="bg-white rounded-2xl border border-[#073B35]/15 overflow-hidden shadow-xs"
                  >
                    <div
                      className="h-28 w-full flex items-end justify-end p-3"
                      style={{ backgroundColor: col.hex }}
                    >
                      <button
                        onClick={() => handleCopy(col.hex, col.hex, true)}
                        className="bg-white/90 hover:bg-white text-[#073B35] text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                      >
                        {copiedHex === col.hex ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{col.hex}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 text-xs space-y-1">
                      <span className="font-bold text-[#073B35] block">{col.name}</span>
                      <span className="font-mono text-[11px] text-[#073B35]/60 block">{col.rgb}</span>
                      <p className="text-[11px] text-[#073B35]/80 pt-1 border-t border-[#073B35]/10 leading-snug">
                        {col.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LOGO DEVELOPMENT */}
          {activeTab === 'logo' && (
            <div className="space-y-6 text-xs text-[#073B35]">
              <div className="bg-white p-4 rounded-2xl border border-[#073B35]/15 leading-relaxed">
                <span className="font-bold block mb-1">
                  شرط البريف: (Logo Refinement Permitted)
                </span>
                تطوير الشعار مسموح بشرط الحفاظ على جوهر العلامة (الكاليجرافي العربي الرصين)، وتوضيح النسخة الأصلية والمطورة وأسباب التحسين وإمكانية قراءته في المقاسات الصغيرة وشاشات الهواتف.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Concept */}
                <div className="bg-white p-5 rounded-2xl border border-[#073B35]/15 space-y-3">
                  <span className="font-bold text-xs text-[#073B35]">الشعار الأصلي المنشور</span>
                  <div className="bg-[#073B35] p-6 rounded-xl flex items-center justify-center text-white min-h-[140px]">
                    <span className="font-display text-3xl font-bold">يوزرسيف</span>
                  </div>
                  <p className="text-[11px] text-[#073B35]/70 leading-relaxed">
                    مكتوب بخط كاليجرافي عربي انسيابي يعكس الطابع الحرفي والطباعي.
                  </p>
                </div>

                {/* Refined Vector Version */}
                <div className="bg-white p-5 rounded-2xl border border-[#0B5F55]/30 space-y-3 ring-1 ring-[#0B5F55]/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0B5F55]">النسخة الرقمية المطورة للشاشات</span>
                    <span className="text-[10px] bg-[#0B5F55]/10 text-[#0B5F55] font-bold px-2 py-0.5 rounded-full">
                      Vector SVG نقي
                    </span>
                  </div>
                  <div className="bg-[#073B35] p-6 rounded-xl flex items-center justify-center text-white min-h-[140px]">
                    <Logo variant="light" className="h-12" />
                  </div>
                  <div className="space-y-1.5 text-[11px] text-[#073B35]/80 leading-relaxed">
                    <div><b>1. تنقية الحواف (Cleaner Vector Edges):</b> تم رسم منحنيات متجهة دقيقة بدقة 8K تمنع تشوه الخط في طباعة التيشيرتات والأكواب.</div>
                    <div><b>2. رمز ريشة الإبداع (Feather Accent):</b> دمج تدرج ذهبي دافئ يمثل ريشة الكاليجرافي وحرفية التخصيص.</div>
                    <div><b>3. المقروئية في المقاسات الصغيرة:</b> الحفاظ على سمك الحروف لتبقى واضحة كأيقونة تطبيق أو فافيكون حتى حجم 24px.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WALKTHROUGH SCRIPT */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-4 text-xs text-[#073B35]">
              <div className="bg-[#0B5F55]/10 p-4 rounded-2xl border border-[#0B5F55]/20 leading-relaxed">
                <span className="font-bold block mb-1">
                  خطة العرض المعتمدة (Suggested Walkthrough Script - 3 to 5 Minutes):
                </span>
                مخطط سريع ودقيق لتقديم المشروع للجنة التحكيم ليغطي جميع متطلبات المسابقة الـ 8 من الألف للياء.
              </div>

              <div className="space-y-2">
                {[
                  {
                    time: '10–20 ثانية',
                    title: '1. الصفحة الرئيسية وهوية يوزرسيف الأصلية',
                    desc: 'استعراض الهوية الخضراء والذهبية، اللوجو المطور، ومحاكاة موضع الطباعة التفاعلي بالأنيميشن الهادف.',
                  },
                  {
                    time: '30 ثانية',
                    title: '2. تصفح الأعمال واختيار "اطلب زي ده"',
                    desc: 'فتح معرض الأعمال والضغط على زر "اطلب زي ده" ليتم تحميل القطعة كمرجع تلقائي داخل استمارة الطلب.',
                  },
                  {
                    time: '60 ثانية',
                    title: '3. تجربة مساعد جاهزية الطلب الذكي (الميزة الاستثنائية)',
                    desc: 'الضغط على زر تجربة الأخطاء، ورؤية رصد عدم تطابق المقاسات وغياب التصميم باللون الأحمر، ثم الضغط على "إصلاح فوري" لتحويلها للأخضر.',
                  },
                  {
                    time: '15 ثانية',
                    title: '4. إرسال الطلب وإصدار رقم الطلب الفريد (#YZ-1043)',
                    desc: 'إصدار الرقم الفوري مع زر إرسال مباشر للواتساب المعتمد 01116891025.',
                  },
                  {
                    time: '60 ثانية',
                    title: '5. لوحة تحكم صاحب المشروع (Admin Dashboard)',
                    desc: 'فحص تفاصيل الطلب، اتخاذ قرار الاعتماد (Approve)، تسجيل سجل التحديث المؤرخ، وإرسال رسالة مباشرة للعميل.',
                  },
                  {
                    time: '30 ثانية',
                    title: '6. تتبع الطلب من وجهة نظر العميل (Track)',
                    desc: 'التحقق برقم الهاتف، رؤية المسار الزمني والقرار، وقراءة رسالة الورشة في المحادثة المربوطة بالطلب.',
                  },
                  {
                    time: '30 ثانية',
                    title: '7. تصاميم السوشيال ميديا وتطوير الشعار',
                    desc: 'عرض بوستين السوشيال ميديا بأبعاد 4:5 مع كابشن النشر المكتوب، وتحميلها بجودة عالية.',
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-[#073B35]/15 flex items-start gap-3"
                  >
                    <span className="font-mono font-bold text-xs bg-[#073B35] text-[#E3A92F] px-2 py-0.5 rounded shrink-0">
                      {step.time}
                    </span>
                    <div>
                      <span className="font-bold text-[#073B35] block mb-0.5">{step.title}</span>
                      <span className="text-[#073B35]/75 leading-relaxed">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F6F1E7] p-4 border-t border-[#073B35]/15 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#073B35]/70">
            جميع البيانات مصممة لتطابق تماماً كراسة شروط Brand & Build Aswan 2026.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#073B35] hover:bg-[#0B5F55] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
