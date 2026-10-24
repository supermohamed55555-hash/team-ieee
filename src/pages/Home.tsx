import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, ArrowLeft, Shirt, Layers, ShieldCheck } from 'lucide-react';
import { EmbroideryHero } from '../components/EmbroideryHero';
import { BrandVideoShowcase } from '../components/BrandVideoShowcase';
import { SocialDesignsShowcase } from '../components/SocialDesignsShowcase';
import { SplitScreenShowcase } from '../components/SplitScreenShowcase';
import { InteractiveTrainJourney } from '../components/InteractiveTrainJourney';

export const Home: React.FC = () => {

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden bg-[#F8F7F3]">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Artisanal Hero with Golden Embroidery Animation
      ───────────────────────────────────────────────────────────── */}
      <EmbroideryHero />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Customizer & Products Catalog CTA Spotlight
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-white rounded-3xl border border-[#D7DEDB] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-right max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B5F55]/10 text-[#0B5F55] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
              <span>استوديو التخصيص وكتالوج المنتجات الحصري</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B35] font-display">
              عاين تصميمك وشعارك على التيشيرت والهودي فورياً
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6B68] leading-relaxed">
              اختر أي منتج من كتالوج يوزرسيف، حدد موضع وحجم الطباعة أو التطريز، وشاهد النتيجة الواقعية بدقة متناهية قبل بدء خطوط الإنتاج بأسوان.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs sm:text-sm font-black transition-all shadow-sm flex items-center gap-2"
            >
              <Shirt className="w-4 h-4 text-[#E3A92F]" />
              <span>تصفح كتالوج المنتجات</span>
            </Link>

            <Link
              to="/customize"
              className="px-6 py-3.5 rounded-xl bg-[#F6F1E7] hover:bg-[#EFEAE0] border border-[#D7DEDB] text-[#073B35] text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-[#0B5F55]" />
              <span>فتح مصمم الموك أب التفاعلي</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Brand Video Showcase (كواليس معمل يوزرسيف)
      ───────────────────────────────────────────────────────────── */}
      <BrandVideoShowcase />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Dynamic Split-Screen Showcase (Auto-Playing Deck)
      ───────────────────────────────────────────────────────────── */}
      <SplitScreenShowcase />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: Social Campaigns & Brand Assets
      ───────────────────────────────────────────────────────────── */}
      <SocialDesignsShowcase />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: Customer Journey Workflow (Interactive Train Animation)
      ───────────────────────────────────────────────────────────── */}
      <InteractiveTrainJourney />

    </div>
  );
};
