import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  PackageCheck,
  Layers
} from 'lucide-react';

interface StepItem {
  id: number;
  step: string;
  name: string;
  subName: string;
  desc: string;
  highlight: string;
  icon: React.ReactNode;
  themeColor: string;
  badge: string;
  stepTag: string;
}

const STEPS: StepItem[] = [
  {
    id: 0,
    step: '01',
    name: 'تحديد المواصفات والكمية',
    subName: 'تصميم الفكرة وتحديد التفاصيل',
    desc: 'اختر نوع المنتج (تيشيرت، هودي، كاب، استيكر)، حدد الألوان المفضلة، ووزع المقاسات بدقة داخل معالج الطلب.',
    highlight: 'خامات قطن مصري 100% ومقاسات دقيقة',
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
    themeColor: '#10B981',
    badge: 'الخطوة 1: الانطلاق',
    stepTag: 'تحديد الفكرة والمقاسات',
  },
  {
    id: 1,
    step: '02',
    name: 'فحص الجاهزية الذكي',
    subName: 'التدقيق الفني وضمان الجودة',
    desc: 'خوارزمية الفحص الآلي الذكية تتأكد لحظياً من تطابق مجموع المقاسات وموضع الطباعة وملفات التصميم بدقة.',
    highlight: 'صفر أخطاء وتوفير وقت الإنتاج بنسبة 40%',
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    themeColor: '#F59E0B',
    badge: 'الخطوة 2: التدقيق',
    stepTag: 'فحص الجاهزية والجودة',
  },
  {
    id: 2,
    step: '03',
    name: 'كود التتبع والتواصل المباشر',
    subName: 'إصدار التذكرة ومحادثة الواتساب',
    desc: 'احصل على كود متابعة رسمي (YZ-xxxx) ورسالة منسقة وجاهزة بنقرة واحدة للتواصل مع معمل يوزرسيف بأسوان.',
    highlight: 'كود تتبع ملكي دائم ومتابعة مباشرة',
    icon: <MessageCircle className="w-5 h-5 text-cyan-400" />,
    themeColor: '#06B6D4',
    badge: 'الخطوة 3: التذكرة',
    stepTag: 'تأكيد الطلب والتواصل',
  },
  {
    id: 3,
    step: '04',
    name: 'التنفيذ والاستلام بأسوان',
    subName: 'الإنتاج الحرفي والتسليم',
    desc: 'بدء ماكينات التطريز والطباعة الرقمية بدقة عالية، الفحص اليدوي للجودة، والاستلام من مقرنا بأسوان أو الشحن للباب.',
    highlight: 'تطريز ميتاليك بارز وضمان الرضا التام',
    icon: <PackageCheck className="w-5 h-5 text-[#E3A92F]" />,
    themeColor: '#E3A92F',
    badge: 'الخطوة 4: الاستلام',
    stepTag: 'الإنتاج والإتقان',
  },
];

export const InteractiveTrainJourney: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Auto-advance through glowing numbers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const activeStepData = STEPS[currentStep];

  return (
    <section className="py-14 sm:py-20 bg-[#F8F7F3] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B5F55]/10 border border-[#0B5F55]/20 text-[#0B5F55] text-xs sm:text-sm font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
            <span>رحلة طلبك خطوة بخطوة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#073B35] font-display">
            كيف نعمل معاً من الفكرة حتى الاستلام؟
          </h2>

          <p className="text-xs sm:text-sm text-[#4d6560] max-w-lg mx-auto leading-relaxed">
            خطوات واضحة وبسيطة تضمن تنفيذ طلبك بأعلى دقة وبدون أي أخطاء في المقاسات أو الألوان.
          </p>
        </div>

        {/* 4 Interactive Glowing Steps Flow */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-[#073B35] text-white shadow-[0_12px_30px_rgba(7,59,53,0.3)] scale-[1.03]'
                      : 'bg-white text-[#073B35] border-[#073B35]/15 hover:border-[#0B5F55]/40 hover:bg-[#FAF8F5]'
                  }`}
                  style={{
                    borderColor: isActive ? step.themeColor : undefined,
                  }}
                >
                  {/* Glowing Top Pill / Number */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all duration-300 mb-3 ${
                      isActive
                        ? 'shadow-lg text-white'
                        : 'bg-slate-100 text-[#073B35] group-hover:bg-[#0B5F55]/10'
                    }`}
                    style={{
                      backgroundColor: isActive ? step.themeColor : undefined,
                      boxShadow: isActive ? `0 0 20px ${step.themeColor}88` : undefined,
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <h3 className={`text-sm sm:text-base font-black font-display leading-snug mb-1 ${
                      isActive ? 'text-white' : 'text-[#073B35]'
                    }`}>
                      {step.name}
                    </h3>
                    <span className={`text-[11px] font-bold block ${
                      isActive ? 'text-emerald-200' : 'text-[#4d6560]'
                    }`}>
                      {step.stepTag}
                    </span>
                  </div>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <div 
                      className="w-12 h-1 rounded-full mt-3 transition-all"
                      style={{ backgroundColor: step.themeColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Spotlight Card for the Active Step */}
        <div 
          className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-500 bg-[#073B35] border-2"
          style={{ borderColor: activeStepData.themeColor }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1 text-center md:text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold" style={{ color: activeStepData.themeColor }}>
                {activeStepData.icon}
                <span>{activeStepData.badge}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-display">
                {activeStepData.name} — <span className="font-normal text-emerald-200 text-lg sm:text-xl">{activeStepData.subName}</span>
              </h4>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                {activeStepData.desc}
              </p>

              <div className="pt-1 flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#E3A92F]">
                <span>✨ الميزة:</span>
                <span className="text-white">{activeStepData.highlight}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link to="/request" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-[#073B35] bg-[#E3A92F] hover:bg-[#d89c25]"
                >
                  <span>ابدأ طلبك الآن</span>
                  <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </Link>

              {/* Prev / Next Step Buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  onClick={() => setCurrentStep((prev) => (prev + 1) % STEPS.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
