import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  RotateCw,
  Award,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { YuzersefLab } from '../components/YuzersefLab';
import { InteractiveCustomizer } from '../components/InteractiveCustomizer';
import { ProductStudio } from '../components/ProductStudio';

export const Lab: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'photorealistic' | 'vector' | 'turntable'>('photorealistic');

  return (
    <div className="py-10 sm:py-16 space-y-12 bg-[#F8F7F3] min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          Hero Header
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5F55]/10 border border-[#0B5F55]/20 text-[#0B5F55] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>مختبر يوزرسيف التفاعلي · Yuzersef Interactive Design Lab</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#073B35] font-display tracking-tight leading-tight">
          معمل الألوان وتجربة الخامات الواقعية
        </h1>

        <p className="text-sm sm:text-base text-[#4d6560] leading-relaxed max-w-2xl mx-auto">
          صُمم هذا المعمل خصيصاً ليمنحك تجربة حية تفاعلية: عاين منتجك بالألوان المعتمدة، بدّل بين تقنيات التطريز والطباعة، واختبر مكان الشعار قبل بدء خطوط الإنتاج في أسوان.
        </p>

        {/* Studio Mode Selector Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('photorealistic')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'photorealistic'
                ? 'bg-[#0B5F55] text-white shadow-md scale-102'
                : 'bg-white text-[#073B35] border border-[#073B35]/15 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4 text-[#E3A92F]" />
            <span>معمل التيشيرتات والألوان الواقعية (Apple Style)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vector')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'vector'
                ? 'bg-[#0B5F55] text-white shadow-md scale-102'
                : 'bg-white text-[#073B35] border border-[#073B35]/15 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-[#E3A92F]" />
            <span>محدد مواضع الطباعة (صدر • ظهر • كم)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('turntable')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'turntable'
                ? 'bg-[#0B5F55] text-white shadow-md scale-102'
                : 'bg-white text-[#073B35] border border-[#073B35]/15 hover:bg-slate-50'
            }`}
          >
            <RotateCw className="w-4 h-4 text-[#E3A92F]" />
            <span>استوديو التدوير 360° وتجربة الشعار</span>
          </button>

          <Link
            to="/customize"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 bg-[#E3A92F] hover:bg-[#d89c25] text-[#3A2A00] shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>مصمم الموك أب وتحديد الشعار الحي 🎨</span>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Tab 1: Photorealistic Colorways Lab (Apple-style)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'photorealistic' && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#073B35]/15 p-4 sm:p-8 shadow-sm">
            <YuzersefLab />
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Tab 2: Vector Placement Tool
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vector' && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#073B35]/15 p-4 sm:p-8 shadow-sm space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
              <span className="text-xs font-bold text-[#0B5F55]">تحديد الموضع الدقيق</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#073B35]">
                تحكم في موضع الشعار والتطريز بدقة
              </h2>
              <p className="text-xs text-[#4d6560]">
                اختر نوع المنتج وبدّل مواضع الطباعة لمعاينتها فورياً قبل نقلها لطلبك.
              </p>
            </div>

            <InteractiveCustomizer />
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Tab 3: 360 Turntable & Logo Overlay Studio
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'turntable' && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#073B35]/15 p-4 sm:p-8 shadow-sm space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
              <span className="text-xs font-bold text-[#0B5F55]">استوديو تفاعلي 360°</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#073B35]">
                دوّر المنتج، بدّل الألوان، وارفع شعارك الخاص
              </h2>
              <p className="text-xs text-[#4d6560]">
                اسحب الماوس لتدوير المج 360 درجة، أو ارفع ملف تصميمك ليتم دمجه على الخامة.
              </p>
            </div>

            <ProductStudio defaultProductId="tshirt" />
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Bottom Bridge Banner to Wizard
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#073B35] to-[#0B5F55] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#E3A92F]/30">
          <div className="space-y-2 text-center sm:text-start">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E3A92F] bg-black/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E3A92F]" />
              <span>جاهز للإنتاج بأسوان</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black font-display text-white">
              هل استقريت على اللون والمواصفات المثالية؟
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg leading-relaxed">
              انتقل مباشرة إلى معالج الطلب الذكي لتوزيع المقاسات وتأكيد موضع الطباعة والحصول على كود التتبع الفوري.
            </p>
          </div>

          <Link to="/request" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-sm px-7 py-3 rounded-xl shadow-md border-none gap-2">
              <span>افتح معالج الطلب الآن</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
