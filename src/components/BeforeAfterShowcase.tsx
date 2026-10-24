import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { Badge } from './ui/badge';

export const BeforeAfterShowcase: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isSideBySide, setIsSideBySide] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleDrag = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPos(percentage);
  }, []);

  const onMouseDown = () => {
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleDrag(e.clientX);
    }
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDrag(e.touches[0].clientX);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F8F7F3] border-y border-[#073B35]/10 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] bg-[#0B5F55]/10 px-3.5 py-1.5 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>رحلة التحول الإبداعي (Sketch to Reality)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#073B35] tracking-tight font-display">
            من سكتش يدوي بسيط إلى منتج مطرز ثلاثي الأبعاد
          </h2>
          <p className="text-sm sm:text-base text-[#4d6560] leading-relaxed">
            لا تشغل بالك بجودة الرسمة المبدئية؛ نحن في «يوزرسيف» نستلم فكرتك ولو كانت خطوطاً مرسومة بالقلم الرصاص، ونحولها إلى فيكتور متقن وتطريز أو طباعة احترافية عالية الدقة.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setIsSideBySide(!isSideBySide)}
              className="inline-flex items-center gap-2 text-xs text-[#0B5F55] hover:text-[#073B35] font-bold bg-white border border-[#073B35]/15 rounded-full px-4 py-2 shadow-xs transition-all cursor-pointer hover:border-[#0B5F55]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#E3A92F]" />
              <span>{isSideBySide ? 'التبديل إلى شريط السحب التفاعلي' : 'عرض جنباً إلى جنب (مقارنة ثابتة)'}</span>
            </button>
          </div>
        </div>

        {/* Presentation Area */}
        <div className="max-w-4xl mx-auto">
          {isSideBySide ? (
            /* Static Side-by-Side Comparison */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Box */}
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-md flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                    قبل (Before): السكتش اليدوي المبدئي
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">رسم أولي</span>
                </div>
                
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF9F5] p-6 flex items-center justify-center border border-amber-100 shadow-inner">
                  <img
                    src="/brand/badge-sketch.png"
                    alt="سكتش يدوي أولي بالقلم الرصاص"
                    className="max-h-full max-w-full object-contain filter contrast-105"
                  />
                </div>

                <p className="text-xs text-[#4d6560] mt-4 text-center font-medium">
                  رسمة يدوية سريعة أو مسودة أولية يرسلها العميل بالقلم الرصاص
                </p>
              </div>

              {/* After Box */}
              <div className="bg-[#073B35] text-white rounded-3xl p-6 border-2 border-[#0B5F55] shadow-xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-[#073B35] bg-[#E3A92F] px-3 py-1 rounded-full">
                    بعد (After): التطريز الميتاليك 3D المكتمل
                  </span>
                  <span className="text-[11px] text-emerald-200 font-mono">جاهز للتسليم</span>
                </div>
                
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#052925] p-6 flex items-center justify-center border border-emerald-600/40 shadow-inner relative">
                  <img
                    src="/brand/badge-embroidered.png"
                    alt="المنتج النهائي مطرز بخيوط ميتاليك"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] filter brightness-105"
                  />
                  <div className="absolute top-3 end-3">
                    <Sparkles className="w-5 h-5 text-[#E3A92F] animate-pulse" />
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 mt-4 text-center font-medium">
                  بادج ملكي مطرز بخيوط حريرية وميتاليك بارزة ثلاثية الأبعاد وتشطيب استثنائي
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Split-Screen Slider with 1:1 Aligned Canvas */
            <div 
              ref={containerRef}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#0B5F55] select-none cursor-ew-resize touch-none bg-[#052925]"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchMove={onTouchMove}
            >
              {/* LAYER 1 (BASE / RIGHT): After - Metallic Embroidered Luxury Emblem */}
              <div className="absolute inset-0 bg-[#073B35] flex items-center justify-center p-8">
                <img
                  src="/brand/badge-embroidered.png"
                  alt="بعد: التطريز الميتاليك الفاخر المكتمل"
                  className="w-auto h-full max-h-[85%] object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.9)] filter brightness-105"
                />

                <div className="absolute top-4 end-4 z-10">
                  <span className="bg-[#E3A92F] text-[#073B35] font-black text-xs shadow-md px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>بعد: تطريز ميتاليك بارز (After)</span>
                  </span>
                </div>
              </div>

              {/* LAYER 2 (TOP / LEFT): Before - Pencil Sketch Blueprint (Clipped by slider position) */}
              <div 
                className="absolute inset-0 bg-[#EFEFEA] flex items-center justify-center p-8"
                style={{
                  clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                }}
              >
                <img
                  src="/brand/badge-sketch.png"
                  alt="قبل: السكتش اليدوي الأولي"
                  className="w-auto h-full max-h-[85%] object-contain filter contrast-110"
                />

                <div className="absolute top-4 start-4 z-10">
                  <span className="bg-slate-900/90 text-white font-bold text-xs shadow-md border border-slate-700 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
                    قبل: السكتش اليدوي المبدئي (Before)
                  </span>
                </div>
              </div>

              {/* Dividing Slider Line & Handle Button */}
              <div 
                className="absolute inset-y-0 w-1 bg-gradient-to-b from-[#E3A92F] via-white to-[#E3A92F] shadow-[0_0_16px_rgba(227,169,47,0.9)] pointer-events-none z-30"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#E3A92F] text-[#073B35] border-2 border-white shadow-2xl flex items-center justify-center font-bold text-xs">
                  <ArrowLeftRight className="w-5 h-5 text-[#073B35]" />
                </div>
              </div>
            </div>
          )}

          {/* User helper tip */}
          <div className="mt-4 text-center">
            <span className="text-xs text-[#4d6560] font-medium bg-white/70 px-4 py-1.5 rounded-full border border-[#073B35]/10">
              ↔ اسحب المقبض في المنتصف يميناً ويساراً لمشاهدة تحول خطوط القلم الرصاص إلى تطريز ميتاليكي حقيقي
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
