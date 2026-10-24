import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Check,
  RotateCcw,
  ZoomIn,
  Eye,
  Layers,
  Upload,
  ShieldCheck,
  Palette,
  Maximize2,
} from 'lucide-react';
import {
  realisticTshirtBlack,
  realisticTshirtGreen,
  realisticTshirtWhite,
  realisticTshirtBeige,
  realisticTshirtNavy,
  realisticTshirtMaroon,
} from '../data/initialData';

interface YuzersefLabProps {
  onOrderConfiguredProduct?: (config: {
    serviceId: string;
    colorName: string;
    designVariant: string;
    printPlacement: string;
    technique: string;
    userUploadedArtwork?: string;
  }) => void;
  reducedMotion?: boolean;
}

export const YuzersefLab: React.FC<YuzersefLabProps> = ({
  onOrderConfiguredProduct,
  reducedMotion = false,
}) => {
  const navigate = useNavigate();
  // Apple-style colorways
  const colorways = [
    {
      id: 'black',
      name: 'أسود ملكي فاحم',
      enName: 'Pitch Black',
      hex: '#111111',
      image: realisticTshirtBlack,
      printTextColor: '#FFFFFF',
      fabricDesc: 'قطن مصري 100% سنجل جيرسي 240 جم معالج ضد الانكماش مع كاليجرافي يوزرسيف أبيض ناصع.',
      finish: 'ألوان عالية التباين وثبات فائق ضد الغسيل',
    },
    {
      id: 'green',
      name: 'أخضر يوزرسيف الغابي',
      enName: 'Pine Forest Green',
      hex: '#073B35',
      image: realisticTshirtGreen,
      printTextColor: '#FFFFFF',
      fabricDesc: 'لون هوية يوزرسيف الأصلية المعتمدة بأسوان، ملمس قطني ناعم وطباعة كاليجرافي عربي انسيابي.',
      finish: 'صبغة مقاومة لأشعة شمس الصعيد الحارة',
    },
    {
      id: 'white',
      name: 'أبيض عاجي فاخر',
      enName: 'Ivory Off-White',
      hex: '#F4F4F0',
      image: realisticTshirtWhite,
      printTextColor: '#073B35',
      fabricDesc: 'قطن نقي معالج بإنزيمات بيو-ووش يمنع التوبير مع كتابة يوزرسيف باللون الأخضر الداكن المتباين.',
      finish: 'حياكة ياقة وأكمام مزدوجة متينة',
    },
    {
      id: 'beige',
      name: 'بيج صحراوي رملي',
      enName: 'Desert Sand Dune',
      hex: '#D8C5A8',
      image: realisticTshirtBeige,
      printTextColor: '#073B35',
      fabricDesc: 'مستوحى من رمال وتراث أسوان، مزين بمخطوطة ديوانية فخمة لكلمة يوزرسيف بتشكيل حرفي دقيق.',
      finish: 'خامة صيفية خفيفة وقابلة للتنفس',
    },
    {
      id: 'navy',
      name: 'كحلي نيلي داكن',
      enName: 'Midnight Navy',
      hex: '#182236',
      image: realisticTshirtNavy,
      printTextColor: '#FFFFFF',
      fabricDesc: 'لون ليلي فخم يبرز الخط العربي بوضوح، مناسب للمناسبات اليومية والأطقم الكاجوال.',
      finish: 'طباعة DTF عالية المرونة لا تتشقق مع الشد',
    },
    {
      id: 'maroon',
      name: 'عنابي ملكي بلمسة ذهبية',
      enName: 'Vintage Burgundy & Gold',
      hex: '#581825',
      image: realisticTshirtMaroon,
      printTextColor: '#E3A92F',
      fabricDesc: 'خامة شتوية ثقيلة مع طباعة كاليجرافي يوزرسيف باللون الذهبي الميتاليك اللامع، تجسيداً لمقولة "خلّيك مختلف".',
      finish: 'طباعة فليكس ذهبية ميتاليك بارزة ولامعة',
    },
  ];

  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedDesignVariant, setSelectedDesignVariant] = useState<string>('كاليجرافي يوزرسيف الكلاسيكي');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('طباعة DTF حرارية فائقة الدقة');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('الصدر (أمامي)');
  const [viewAngle, setViewAngle] = useState<'front' | 'zoom' | 'back'>('front');
  const [customUserArt, setCustomUserArt] = useState<string | null>(null);

  const activeColor = colorways[selectedColorIndex];

  const handleCustomArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomUserArt(url);
      setSelectedDesignVariant('تصميم مخصص تم رفعه');
    }
  };

  const handleOrderNow = () => {
    if (onOrderConfiguredProduct) {
      onOrderConfiguredProduct({
        serviceId: 'clothing-hoodies',
        colorName: activeColor.name,
        designVariant: selectedDesignVariant,
        printPlacement: selectedPlacement,
        technique: selectedTechnique,
        userUploadedArtwork: customUserArt || undefined,
      });
    } else {
      navigate(`/request?service=clothing-hoodies&color=${encodeURIComponent(activeColor.name)}&placement=${encodeURIComponent(selectedPlacement)}&tech=${encodeURIComponent(selectedTechnique)}`);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Studio Header (Apple-like clean title) */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E3A92F]/15 text-[#073B35] rounded-full text-xs font-bold border border-[#E3A92F]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>مختبر يوزرسيف التفاعلي · Yuzersef Interactive Studio</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-[#073B35]">
          صمم واختبر تيشيرت يوزرسيف الحقيقي
        </h2>
        <p className="text-xs sm:text-base text-[#073B35]/75 leading-relaxed max-w-2xl mx-auto">
          جرّب تناسق الألوان الواقعية، أنسجة القطن وثنيات القماش الطبيعية، وشاهد كتابة <b>"يوزرسيف"</b> على التيشيرت مباشرة كما في استوديو آبل.
        </p>
      </div>

      {/* Main Studio Workstation */}
      <div className="bg-white border border-[#073B35]/15 rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: The Photorealistic Visual Stage (Col 1-7) */}
        <div className="lg:col-span-7 bg-[#F7F6F2] p-8 sm:p-12 flex flex-col justify-between items-center relative border-b lg:border-b-0 lg:border-l border-[#073B35]/10 overflow-hidden">
          {/* Top Controls: View Angles */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xs border border-black/5 text-xs font-bold">
              <button
                onClick={() => setViewAngle('front')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewAngle === 'front'
                    ? 'bg-[#073B35] text-white shadow-xs'
                    : 'text-[#073B35]/70 hover:text-[#073B35]'
                }`}
              >
                المنظر الأمامي الكامل
              </button>
              <button
                onClick={() => setViewAngle('zoom')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  viewAngle === 'zoom'
                    ? 'bg-[#073B35] text-white shadow-xs'
                    : 'text-[#073B35]/70 hover:text-[#073B35]'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>زوم على القماش</span>
              </button>
              <button
                onClick={() => setViewAngle('back')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewAngle === 'back'
                    ? 'bg-[#073B35] text-white shadow-xs'
                    : 'text-[#073B35]/70 hover:text-[#073B35]'
                }`}
              >
                موضع الظهر
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#0B5F55] bg-white/80 px-2.5 py-1 rounded-lg border border-black/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B5F55]" />
              <span>قطن مصري 100% 240 جم</span>
            </div>
          </div>

          {/* Photorealistic T-Shirt Product Showcase */}
          <div className="my-8 relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Ambient Studio Floor Shadow */}
            <div className="absolute -bottom-4 w-3/4 h-8 bg-black/15 rounded-full blur-xl pointer-events-none" />

            {/* The Real Studio Image with smooth fade */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={activeColor.image}
                alt={`تيشيرت يوزرسيف باللون ${activeColor.name}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain transition-all duration-500 ${
                  viewAngle === 'zoom'
                    ? 'scale-160 translate-y-4'
                    : viewAngle === 'back'
                    ? 'scale-95 opacity-90'
                    : 'scale-100 hover:scale-105'
                }`}
              />

              {/* If Back View chosen, show realistic indicator */}
              {viewAngle === 'back' && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-center p-4">
                  <div className="p-4 bg-[#073B35]/90 rounded-2xl border border-white/20 shadow-xl max-w-xs space-y-1">
                    <span className="text-xs font-bold text-[#E3A92F] uppercase block">
                      موضع الظهر الكامل
                    </span>
                    <h4 className="font-display font-black text-xl">
                      يوزرسيف · أسوان
                    </h4>
                    <p className="text-[11px] opacity-80">
                      طباعة كاليجرافي عربي عريض على الظهر بالكامل بعرض 30 سم.
                    </p>
                  </div>
                </div>
              )}

              {/* Custom uploaded artwork realistic displacement overlay if active */}
              {customUserArt && viewAngle === 'front' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 p-1 bg-white/10 rounded-md border border-white/30 backdrop-blur-xs flex items-center justify-center transform -translate-y-4 drop-shadow-md">
                    <img
                      src={customUserArt}
                      alt="التصميم المخصص"
                      className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Active Finish Badge */}
          <div className="w-full text-center z-10">
            <span className="font-mono text-xs font-bold text-[#073B35] bg-white/90 px-3 py-1 rounded-full shadow-xs border border-black/5">
              {activeColor.name} · {activeColor.enName}
            </span>
          </div>
        </div>

        {/* Right: The Apple-Style Color & Spec Controls (Col 8-12) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <span className="text-[11px] font-bold text-[#0B5F55] uppercase tracking-wider block">
                تيشيرت يوزرسيف الفاخر (Yuzersef Heavyweight Tee)
              </span>
              <h3 className="text-2xl font-bold font-display text-[#073B35] mt-1">
                {activeColor.name}
              </h3>
              <p className="text-xs text-[#073B35]/75 leading-relaxed mt-1">
                {activeColor.fabricDesc}
              </p>
            </div>

            {/* Apple-Style Color Swatches (Circular Pills) */}
            <div>
              <label className="block text-xs font-bold text-[#073B35] mb-2.5 flex items-center justify-between">
                <span>اختر لون التيشيرت:</span>
                <span className="text-[11px] text-[#0B5F55] font-semibold">
                  {activeColor.enName}
                </span>
              </label>

              <div className="flex items-center gap-3 flex-wrap">
                {colorways.map((c, idx) => {
                  const isSelected = selectedColorIndex === idx;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedColorIndex(idx);
                        setViewAngle('front');
                      }}
                      title={c.name}
                      className={`relative w-10 h-10 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'ring-3 ring-[#0B5F55] ring-offset-2 scale-110 shadow-md'
                          : 'hover:scale-105 opacity-90 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 stroke-[3] ${
                            c.hex === '#F4F4F0' || c.hex === '#D8C5A8'
                              ? 'text-[#073B35]'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Yuzersef Print Motif Selection */}
            <div>
              <label className="block text-xs font-bold text-[#073B35] mb-2">
                اختر تصميم مخطوطة يوزرسيف:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  {
                    name: 'كاليجرافي يوزرسيف الكلاسيكي',
                    sub: 'مخطوطة عربية عريضة انسيابية',
                  },
                  {
                    name: 'شعار: خلّيك مختلف.. خلّيك يوزرسيف',
                    sub: 'شعار البريف المعتمد كامل',
                  },
                  {
                    name: 'يوزرسيف أسوان 2026',
                    sub: 'إصدار التراث الأسواني الرسمي',
                  },
                  {
                    name: 'ريشة الإبداع الذهبية',
                    sub: 'شعار الشاشة المطور مع الريشة',
                  },
                ].map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => {
                      setSelectedDesignVariant(v.name);
                      setCustomUserArt(null);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedDesignVariant === v.name
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#073B35] font-bold shadow-2xs'
                        : 'border-[#073B35]/15 text-[#073B35]/80 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    <span className="block text-xs font-bold">{v.name}</span>
                    <span className="block text-[10px] text-[#073B35]/60 mt-0.5">{v.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Print Technique Selection */}
            <div>
              <label className="block text-xs font-bold text-[#073B35] mb-2">
                تقنية الطباعة والتنفيذ بالورشة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  'طباعة DTF حرارية فائقة الدقة',
                  'تطريز كمبيوتر 3D بارز',
                  'فليكس ذهبي ميتاليك لامع',
                ].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setSelectedTechnique(tech)}
                    className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                      selectedTechnique === tech
                        ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                        : 'border-[#073B35]/15 text-[#073B35]/70 hover:bg-[#F6F1E7]'
                    }`}
                  >
                    <span className="text-[11px] block">{tech}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom File Upload Option */}
            <div className="pt-2 border-t border-[#073B35]/10">
              <label className="block text-xs font-bold text-[#073B35] mb-1">
                أو ارفع تصميمك الخاص لمعاينته فوراً على التيشيرت:
              </label>
              <input
                type="file"
                id="lab-custom-upload"
                accept="image/*"
                onChange={handleCustomArtUpload}
                className="hidden"
              />
              <label
                htmlFor="lab-custom-upload"
                className="w-full py-2 px-3 border border-dashed border-[#073B35]/30 hover:border-[#0B5F55] rounded-xl text-xs font-bold text-[#0B5F55] flex items-center justify-center gap-2 cursor-pointer bg-[#F6F1E7]/50 hover:bg-[#F6F1E7] transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {customUserArt ? 'تغيير التصميم المرفوع' : 'رفع شعار أو تصميم خاص بك'}
                </span>
              </label>
            </div>
          </div>

          {/* Action Button: Order This Exact Configuration */}
          <div className="pt-4 border-t border-[#073B35]/10 space-y-2">
            <button
              onClick={handleOrderNow}
              className="w-full py-3.5 px-6 bg-[#E3A92F] hover:bg-[#d4971a] text-[#073B35] font-black rounded-xl text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>اطلب هذا التيشيرت بالمواصفات دي من المعمل</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-[#073B35]/65 text-center">
              سيتم نقل اللون ({activeColor.name}) والتصميم المختار مباشرة إلى استمارة الطلب ومساعد الجاهزية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
