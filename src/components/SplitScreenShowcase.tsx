import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowUpRight,
  Shirt,
  Coffee,
  Smartphone,
  Palette
} from 'lucide-react';

interface ShowcaseItem {
  id: string;
  num: string;
  title: string;
  category: string;
  price: string;
  badge: string;
  image: string;
  desc: string;
  link: string;
  icon: React.ReactNode;
}

const ITEMS: ShowcaseItem[] = [
  {
    id: 'hoodies',
    num: '01',
    title: 'هوديز وتيشرتات قطن مصري فاخر',
    category: 'ملابس قطن 100% - يوزرسيف',
    price: 'يبدأ من 180 ج.م',
    badge: 'تطريز يوزرسيف الملكي',
    image: '/realistic/yuzersef_branded_hoodie.jpg',
    desc: 'طباعة DTF فوتوغرافية وتطريز بارز على خامات قطن مصري عالية الكثافة مع تقفيل خياطة دبل.',
    link: '/request?service=clothing-hoodies',
    icon: <Shirt className="w-4 h-4" />,
  },
  {
    id: 'stickers',
    num: '02',
    title: 'استيكرات Die-Cut وجرابات هواتف',
    category: 'فينيل ألماني وطباعة UV',
    price: 'يبدأ من 50 ج.م',
    badge: 'استيكرات يوزرسيف المقاومة',
    image: '/realistic/yuzersef_branded_stickers.jpg',
    desc: 'قص ليزري دقيق على حدود التصميم وشعارات بارزة للموبايل بجودة ألوان فائقة الثبات.',
    link: '/request?service=stickers-labels',
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: 'mugs',
    num: '03',
    title: 'مجّات سيراميك وهدايا تذكارية',
    category: 'سيراميك وسبلميشن - يوزرسيف',
    price: 'يبدأ من 85 ج.م',
    badge: 'مج يوزرسيف الملكي',
    image: '/realistic/yuzersef_branded_mug.jpg',
    desc: 'مجّات سيراميك ناصعة ومجّات سحرية حرارية وثرامس وبوكسات تذكارية للهدايا والمناسبات.',
    link: '/request?service=mugs-promotional-gifts',
    icon: <Coffee className="w-4 h-4" />,
  },
  {
    id: 'luxury',
    num: '04',
    title: 'الباقة الملكية المتكاملة ليوزرسيف',
    category: 'المجموعة الكاملة - يوزرسيف',
    price: 'عروض مخصصة',
    badge: 'إصدار فاخر معتمد',
    image: '/showcase/luxury-flat-lay.png',
    desc: 'تنفيذ متزامن للهوية الكاملة: ملابس، كابات مطرزة، نوت بوك، واستيكرات مخصصة لبراندات أسوان.',
    link: '/portfolio',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'tshirt-black',
    num: '05',
    title: 'تيشيرت أسود كاجوال قطن ممشط',
    category: 'كاجوال ستريت وير - يوزرسيف',
    price: 'يبدأ من 160 ج.م',
    badge: 'تيشيرت يوزرسيف الأصلي',
    image: '/realistic/realistic_tshirt_black_yuzersef_1792775730619.jpg',
    desc: 'خامة قطنية مريحة معالجة ضد الانكماش مع طباعة صدر وظهر متدرجة الألوان بجودة عالية.',
    link: '/request?service=clothing-hoodies',
    icon: <Palette className="w-4 h-4" />,
  },
];

const N = ITEMS.length;
const DURATION = 12; // 12 seconds for full seamless loop

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function wrap(d: number, n: number): number {
  return ((d + n / 2) % n + n) % n - n / 2;
}

export const SplitScreenShowcase: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const x = (elapsed / DURATION * N) % N;
      const p = Math.floor(x) + easeInOutCubic(x % 1);
      setProgress(p);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Centered Grand Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B5F55]/10 border border-[#0B5F55]/20 text-[#0B5F55] text-xs sm:text-sm font-black tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>كتالوج المنتجات والخدمات المعتمدة بأسوان</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#073B35] font-display">
          خدمات الطباعة والتطريز في أسوان
        </h2>

        <p className="text-sm sm:text-base text-[#4d6560] max-w-xl mx-auto leading-relaxed">
          استعراض ثلاثي الأبعاد تفاعلي لأعمالنا الحقيقية؛ تيشيرتات، كابات، استيكرات، ومجات بأعلى معايير الحرفية.
        </p>
      </div>

      {/* Cards floating directly on the page — no frame, no background box */}
      <div className="relative w-full max-w-5xl mx-auto h-[540px] sm:h-[600px] lg:h-[640px] flex items-center justify-center">

        {/* Stacked Deck of Cards */}
        <div className="relative w-[300px] h-[420px] sm:w-[350px] sm:h-[480px] md:w-[370px] md:h-[500px] flex items-center justify-center z-10">
          {ITEMS.map((item, i) => {
            const d = wrap(i - progress, N);
            const absD = Math.abs(d);

            if (absD > 3.2) return null;

            // Mathematical 3D Transform
            const translateX = d * 78;
            const translateY = d * -16;
            const rotate = d * 6.5;
            const scale = Math.max(0.68, 1 - absD * 0.075);
            const opacity = Math.max(0, 1 - absD * 0.28);
            const zIndex = Math.round(50 - absD * 10);
            const isFront = absD < 0.5;

            return (
              <div
                key={item.id}
                style={{
                  transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) rotate(${rotate}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  willChange: 'transform, opacity',
                }}
                className="absolute top-1/2 left-1/2 w-full h-full rounded-3xl overflow-hidden bg-[#073B35] border border-white/10 shadow-[0_20px_50px_rgba(7,59,53,0.35)] transition-shadow duration-300"
              >
                {/* Full-bleed Real Photography */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />

                {/* Deep Dramatic Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B35] via-[#073B35]/40 to-black/20 pointer-events-none" />

                {/* Top Floating Glass Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="bg-[#E3A92F] text-[#073B35] font-black text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <span>{item.badge}</span>
                  </span>

                  <span className="bg-black/60 backdrop-blur-md text-white font-mono font-bold text-xs px-3 py-1 rounded-full border border-white/20">
                    {item.num} / 0{N}
                  </span>
                </div>

                {/* Bottom Card Content Box */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white z-10 flex flex-col justify-end space-y-3">
                  <div>
                    <span className="text-emerald-300 font-bold text-xs block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white font-display leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-3">
                    <span className="text-sm font-black font-mono text-[#E3A92F] bg-black/40 px-3 py-1 rounded-lg">
                      {item.price}
                    </span>

                    <Link to={item.link} className="flex-1 max-w-[160px]">
                      <button className="w-full bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                        <span>صمم طلبك</span>
                        <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
