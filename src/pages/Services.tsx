import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shirt,
  Smartphone,
  Tag,
  Coffee,
  Palette,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ArrowUpRight,
  ShieldCheck,
  PackageCheck,
  Sliders,
  Layers,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { getServices } from '../lib/mock-api';
import { Service, ServiceCategory } from '../lib/types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = () => {
      getServices().then((res) => {
        // Show active services to public (or all if isActive is undefined)
        setServices(res.filter((s) => s.isActive !== false));
        setLoading(false);
      });
    };

    fetchServices();

    const handleServicesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setServices(e.detail.filter((s: Service) => s.isActive !== false));
      }
    };

    window.addEventListener('yuzersef-services-updated', handleServicesUpdated);
    return () => window.removeEventListener('yuzersef-services-updated', handleServicesUpdated);
  }, []);

  const categories = [
    { id: 'الكل', label: 'كافة الخدمات والمنتجات' },
    { id: 'clothing', label: 'ملابس وهوديز' },
    { id: 'caps', label: 'كابات ومطرزات' },
    { id: 'stickers', label: 'استيكرات Die-Cut' },
    { id: 'phone-cases', label: 'جرابات هواتف' },
    { id: 'mugs-gifts', label: 'مجّات وهدايا' },
    { id: 'custom-design', label: 'تصاميم وهويات' },
  ];

  const filteredServices =
    activeCategory === 'الكل'
      ? services
      : services.filter((s) => s.category === activeCategory);

  // Technical capabilities matrix comparing the 5 printing techniques
  const printingTechniques = [
    {
      name: 'طباعة DTF فوتوغرافية فائقة النقاء',
      bestFor: 'التيشيرتات القطنية، الهوديز، الأوفر سايز',
      durability: 'ثبات فائق ومطاطية عالية تقاوم أكثر من 50 غسلة',
      minQty: 'من قطعة واحدة حتى طلبيات الدفعات الكبيرة',
      finish: 'ألوان مشبعة ناصعة لا تتشقق مع الشد',
    },
    {
      name: 'تطريز كمبيوتر 3D بخيوط ميتاليك',
      bestFor: 'الكابات، هوديز التخرج، البادجات الملكية',
      durability: 'حياكة حريرية دائمة تقاوم الشمس والغسيل مدى الحياة',
      minQty: 'بدءاً من 5 قطع للمشاريع والفرق',
      finish: 'بروز ملموس وغرز ميتاليك ذهبية وفضية فاخرة',
    },
    {
      name: 'قص فينيل Die-Cut ألماني مقاوم للماء',
      bestFor: 'استيكرات اللابتوب، تغليف المنتجات، زجاج السيارات',
      durability: 'مقاوم للحرارة والرطوبة والماء والخدش بنسبة 100%',
      minQty: 'من 20 استيكر',
      finish: 'قص بالليزر حول حدود الشعار مع طبقة حماية UV',
    },
    {
      name: 'طباعة حرارية Sublimation متغلغلة',
      bestFor: 'المجّات السيراميك، المجات السحرية، الثيرموسات',
      durability: 'حبر مدمج داخل جزيئات السيراميك آمن لغسالات الأطباق',
      minQty: 'من قطعة واحدة للهدايا الفردية',
      finish: 'سطح لامع فائق النعومة بألوان فوتوغرافية',
    },
    {
      name: 'طباعة UV ثلاثية الأبعاد بارزة',
      bestFor: 'جرابات الهواتف لكافة موديلات آيفون وسامسونج',
      durability: 'طبقة بوليمر صلبة وملمس مانع للانزلاق ومقاوم للبصمات',
      minQty: 'من قطعة واحدة',
      finish: 'تأثير نافر بارز يعطي عمقاً ملموساً للتصميم',
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16 bg-[#F8F7F3] min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          1. Commercial Header
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] bg-[#0B5F55]/10 px-3.5 py-1.5 rounded-full border border-[#0B5F55]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>كتالوج الخدمات والأسعار الرسمية المعتمدة بأسوان</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B35] font-display tracking-tight">
          حلول الطباعة والتطريز للأفراد والمشاريع
        </h1>
        <p className="text-sm sm:text-base text-[#4d6560] leading-relaxed max-w-2xl mx-auto">
          نقدم في «يوزرسيف» حزمة متكاملة من خدمات التخصيص والإنتاج: من تيشرتات الفرق وطلبيات التخرج إلى الهدايا التذكارية واستيكرات البراندات مع فحص دقيق للمواصفات ومواعيد تسليم مضمونة.
        </p>

        {/* Categories Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 justify-start sm:justify-center scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0B5F55] text-white shadow-sm'
                  : 'bg-white text-[#073B35] border border-[#073B35]/15 hover:bg-[#F0EEE6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Services Cards Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-[#073B35]/15 hover:border-[#0B5F55] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Image Frame */}
                <div className="relative aspect-[16/10] bg-[#073B35] overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold text-[#E3A92F] bg-[#073B35]/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E3A92F]/30">
                      {service.category === 'clothing'
                        ? 'ملابس قطن 100%'
                        : service.category === 'caps'
                        ? 'تطريز ميتاليك 3D'
                        : service.category === 'stickers'
                        ? 'قص Die-Cut فينيل'
                        : service.category === 'phone-cases'
                        ? 'طباعة UV بارزة'
                        : service.category === 'custom-design'
                        ? 'فيكتور وهوية'
                        : 'سيراميك وسبلميشن'}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-black text-[#073B35] bg-[#E3A92F] px-2.5 py-0.5 rounded-full shadow-sm">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom title & price over image */}
                  <div className="absolute bottom-3 inset-x-4 flex items-end justify-between z-10 text-white">
                    <h3 className="font-bold text-base sm:text-lg text-white font-display drop-shadow-md">
                      {service.title}
                    </h3>
                    <span className="text-xs font-bold text-emerald-300 font-mono drop-shadow-sm bg-black/40 px-2 py-0.5 rounded">
                      {service.startingPrice}
                    </span>
                  </div>
                </div>

                {/* Technical Specifications & Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-[#4d6560] leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Turnaround & Delivery */}
                    <div className="flex items-center justify-between text-[11px] text-[#073B35] bg-[#F8F7F3] p-2.5 rounded-xl border border-[#073B35]/10">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#0B5F55]" />
                        <span>مدة التنفيذ: {service.estimatedDays}</span>
                      </span>
                      <span className="text-emerald-700 font-medium">تسليم أسوان / شحن</span>
                    </div>

                    {/* Feature Bullets */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5F55] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dual Action: View 3D Studio vs Request Order */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link to={`/services/${service.id}`} className="flex-1">
                      <Button
                        className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs gap-1.5"
                      >
                        <span>التفاصيل واستوديو 3D</span>
                        <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                      </Button>
                    </Link>

                    <Link to={`/request?service=${service.id}`}>
                      <Button
                        variant="outline"
                        className="text-xs border-[#E3A92F] text-[#073B35] hover:bg-[#E3A92F]/15 px-3 py-2.5 rounded-xl font-bold cursor-pointer"
                      >
                        <span>طلب فوري</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Technical Capabilities Matrix (مصفوفة تقنيات الطباعة بالورشة)
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#073B35]/15 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] bg-[#0B5F55]/10 px-3.5 py-1.5 rounded-full">
              <Layers className="w-3.5 h-3.5 text-[#E3A92F]" />
              <span>مواصفات خطوط الإنتاج المعتمدة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B35] font-display">
              دليل تقنيات الطباعة والتطريز المتوفرة بأسوان
            </h2>
            <p className="text-xs sm:text-sm text-[#4d6560]">
              نوضح لك مزايا كل تقنية لمساعدتك على اختيار الأنسب لخامتك وميزانيتك وهدف مشروعك.
            </p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-right text-xs text-slate-700 min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-[#073B35] text-white rounded-xl">
                  <th className="p-3.5 rounded-r-xl font-bold">تقنية الإنتاج</th>
                  <th className="p-3.5 font-bold">الاستخدام الأمثل</th>
                  <th className="p-3.5 font-bold">المتانة والصمود</th>
                  <th className="p-3.5 font-bold">الحد الأدنى</th>
                  <th className="p-3.5 rounded-l-xl font-bold">التشطيب النهائي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printingTechniques.map((tech, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F7F3] transition-colors">
                    <td className="p-3.5 font-bold text-[#073B35] whitespace-nowrap">
                      {tech.name}
                    </td>
                    <td className="p-3.5 text-slate-600">{tech.bestFor}</td>
                    <td className="p-3.5 text-emerald-700 font-medium">{tech.durability}</td>
                    <td className="p-3.5 font-mono font-semibold">{tech.minQty}</td>
                    <td className="p-3.5 text-slate-600">{tech.finish}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. Bottom Custom Project Bridge
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-r from-[#073B35] via-[#0B5F55] to-[#073B35] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-[#E3A92F]/30">
          <div className="space-y-1.5 text-center sm:text-start">
            <span className="text-xs font-bold text-[#E3A92F]">طلبيات مخصصة وكميات كبرى</span>
            <h3 className="text-lg sm:text-2xl font-black font-display text-white">
              هل تبحث عن مواصفات غير مدرجة أو طلبية للمؤسسات؟
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-lg">
              فريقنا جاهز لتجهيز أطقم الدفعات والجامعات، وتقديم عينات مطابقة واستشارات فنية مجانية.
            </p>
          </div>

          <Link to="/contact" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md border-none">
              <span>تواصل مع قسم المشاريع</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
