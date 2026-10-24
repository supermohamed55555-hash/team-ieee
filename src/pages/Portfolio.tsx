import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Layers,
  ZoomIn,
  X,
  CheckCircle2,
  Tag,
  Users,
  Building,
  GraduationCap,
  Shirt,
  HeartHandshake
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BeforeAfterShowcase } from '../components/BeforeAfterShowcase';
import { getPortfolioItems } from '../lib/mock-api';
import { PortfolioItem } from '../lib/types';

export const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    getPortfolioItems().then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, []);

  // Filter based on client type / project intent rather than generic product categories
  const filterTabs = [
    { id: 'all', label: 'كافة المشاريع المنفذة (12 عمل)' },
    { id: 'university', label: 'طلبيات جامعية ودفعات تخرج' },
    { id: 'brands', label: 'براندات ومتاجر محلية بأسوان' },
    { id: 'embroidery', label: 'أعمال التطريز الميتاليك 3D' },
    { id: 'lifestyle', label: 'هدايا وجرابات واستيكرات' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'university') {
      return (
        item.title.includes('هندسة') ||
        item.title.includes('تخرج') ||
        item.title.includes('جامعة') ||
        item.clientName.includes('دفعة') ||
        item.clientName.includes('جامعة')
      );
    }
    if (activeFilter === 'brands') {
      return (
        item.clientName.includes('براند') ||
        item.clientName.includes('متجر') ||
        item.category === 'stickers'
      );
    }
    if (activeFilter === 'embroidery') {
      return (
        item.description.includes('تطريز') ||
        item.tags.some((t) => t.includes('تطريز')) ||
        item.category === 'caps'
      );
    }
    if (activeFilter === 'lifestyle') {
      return (
        item.category === 'phone-cases' ||
        item.category === 'mugs-gifts' ||
        item.category === 'stickers'
      );
    }
    return true;
  });

  return (
    <div className="py-12 sm:py-20 space-y-16 bg-[#F8F7F3] min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          1. Lookbook Header & Real Project Stats
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] bg-[#0B5F55]/10 px-3.5 py-1.5 rounded-full border border-[#0B5F55]/20">
          <Award className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>سجل المشاريع والتنفيذات الفعلية · Client Lookbook</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#073B35] font-display tracking-tight">
          معرض الأعمال وقصص التنفيذ بأسوان
        </h1>

        <p className="text-sm sm:text-base text-[#4d6560] leading-relaxed max-w-2xl mx-auto">
          استكشف نماذج حقيقية سلّمناها لجامعة أسوان، الدفعات الطلابية، والبراندات المحلية. انقر على أي عمل لمعاينته بكامل الشاشة، أو اضغط «استخدم كمرجع» ليتم إدراجه تلقائياً في معالج طلبك!
        </p>

        {/* Real Stats Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
          <div className="bg-white p-3 rounded-2xl border border-[#073B35]/10 shadow-2xs text-center">
            <span className="block text-lg sm:text-2xl font-black text-[#073B35] font-mono">120+</span>
            <span className="text-[11px] text-[#4d6560] font-bold">هودي لدفعة هندسة أسوان</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#073B35]/10 shadow-2xs text-center">
            <span className="block text-lg sm:text-2xl font-black text-[#073B35] font-mono">500+</span>
            <span className="text-[11px] text-[#4d6560] font-bold">استيكر Die-Cut لبراندات</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#073B35]/10 shadow-2xs text-center">
            <span className="block text-lg sm:text-2xl font-black text-[#073B35] font-mono">200+</span>
            <span className="text-[11px] text-[#4d6560] font-bold">كاب مطرز لفعاليات أسوان</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#073B35]/10 shadow-2xs text-center">
            <span className="block text-lg sm:text-2xl font-black text-emerald-600 font-mono">100%</span>
            <span className="text-[11px] text-[#4d6560] font-bold">مطابقة مواصفات قبل الإنتاج</span>
          </div>
        </div>

        {/* Lookbook Project Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 justify-start sm:justify-center scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#0B5F55] text-white shadow-sm'
                  : 'bg-white text-[#073B35] border border-[#073B35]/15 hover:bg-[#F0EEE6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Rich Lookbook Gallery Grid
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
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#073B35]/15 hover:border-[#0B5F55] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Banner Container */}
                <div className="relative aspect-[16/11] bg-[#073B35] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Scrim for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold text-[#E3A92F] bg-[#073B35]/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E3A92F]/30 shadow-xs">
                      {item.clientName}
                    </span>

                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                      title="تكبير ومعاينة التفاصيل"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Client title over image */}
                  <div className="absolute bottom-3.5 inset-x-4 z-10 text-white">
                    <span className="text-[10px] text-emerald-300 font-mono block">
                      سنة التسليم: {item.year}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-display mt-0.5 leading-snug drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Case Study Details & Action */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-[#4d6560] leading-relaxed">
                      {item.description}
                    </p>

                    {item.highlight && (
                      <div className="p-2.5 rounded-xl bg-[#F8F7F3] border border-[#073B35]/10 flex items-start gap-2 text-[11px] text-[#073B35]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5F55] shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{item.highlight}</span>
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-[#0B5F55] bg-[#0B5F55]/10 px-2 py-0.5 rounded-md font-semibold"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action CTA: Use as Reference in Request Wizard */}
                  <div className="pt-3 border-t border-slate-100">
                    <Button
                      onClick={() =>
                        navigate(`/request?service=${item.serviceId}&ref=${encodeURIComponent(item.title)}`)
                      }
                      className="w-full text-xs font-bold gap-2 bg-[#0B5F55] hover:bg-[#073B35] text-white py-2.5 rounded-xl cursor-pointer shadow-xs"
                    >
                      <span>استخدم هذا العمل كمرجع لطلبك</span>
                      <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Sketch-to-Reality Transformation Feature in Lookbook
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BeforeAfterShowcase />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. Interactive Lightbox Modal
      ───────────────────────────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8F7F3]">
              <div>
                <span className="text-[11px] text-[#0B5F55] font-bold block">{lightboxItem.clientName} · {lightboxItem.year}</span>
                <h4 className="font-bold text-sm sm:text-base text-[#073B35]">{lightboxItem.title}</h4>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 cursor-pointer"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image Display */}
            <div className="p-3 bg-slate-950 flex items-center justify-center overflow-hidden flex-1 max-h-[60vh]">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Bottom info & Action */}
            <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {lightboxItem.description}
              </p>
              <Button
                onClick={() => {
                  const refTitle = lightboxItem.title;
                  const sId = lightboxItem.serviceId;
                  setLightboxItem(null);
                  navigate(`/request?service=${sId}&ref=${encodeURIComponent(refTitle)}`);
                }}
                className="w-full sm:w-auto shrink-0 bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                <span>طلب تصميم مماثل</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
