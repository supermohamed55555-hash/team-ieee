import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Palette,
  ArrowLeft,
  ArrowRight,
  Shirt,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Grid2X2,
  LayoutGrid,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import {
  CatalogProduct,
  getCatalogProducts,
  computeTotalStock,
  getStockStatus,
  isProductVisible
} from '../lib/products-data';
import { generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';
import { addToCart, parsePriceToNumber } from '../lib/cart-store';

// Helper to map card images based on product name / id
const getProductDisplayImage = (product: CatalogProduct): string => {
  const name = product.name || '';
  if (name.includes('تيشيرت') || name.includes('تشرت') || product.id === 'prod-tshirt-premium') {
    return '/products/Gemini_Generated_Image_wukcd2wukcd2wukc.jpg';
  }
  if (name.includes('هودي') || product.id === 'prod-hoodie-oversized') {
    return '/products/Gemini_Generated_Image_rgwu3wrgwu3wrgwu.jpg';
  }
  if (name.includes('مج') || product.id === 'prod-mug-ceramic') {
    return '/products/WhatsApp Image 2026-10-24 at 11.32.1228 AM.jpeg';
  }
  if (name.includes('نوت') || name.includes('دفتر') || name.includes('أجندة') || name.includes('كاب') || name.includes('تطريز') || product.id === 'prod-cap-embroidery') {
    return '/products/WhatsApp Image 2026-10-24 at 11.32.18 AM.jpeg';
  }
  if (name.includes('استيكر') || name.includes('ستيكر') || product.id === 'prod-stickers-diecut') {
    return '/products/ر.jpg';
  }
  if (name.includes('جراب') || name.includes('كفر') || name.includes('هاتف') || product.id === 'prod-case-shockproof') {
    return '/products/Gemini_Generated_Image_sxtrsesxtrsesxtr.jpg';
  }
  return product.imageUrl;
};

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartToastMessage, setCartToastMessage] = useState<string | null>(null);

  const handleQuickAddToCart = (product: CatalogProduct) => {
    const defaultColor = product.colors.find((c) => c.id === product.defaultColor) || product.colors[0];
    addToCart({
      productId: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: parsePriceToNumber(product.price),
      originalPriceStr: product.price,
      quantity: 1,
      selectedColor: defaultColor,
      selectedSize: product.category === 'clothing' ? 'L' : undefined,
      imageUrl: product.imageUrl,
    });

    setCartToastMessage(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
    setTimeout(() => setCartToastMessage(null), 4000);
  };
  const [viewMode, setViewMode] = useState<'wide' | 'compact'>('wide');

  const categories = [
    { id: 'all', label: 'جميع المنتجات' },
    { id: 'clothing', label: 'تيشيرتات وهوديز' },
    { id: 'caps', label: 'كابات وتطريز' },
    { id: 'mugs-gifts', label: 'أكواب وهدايا' },
    { id: 'stickers', label: 'استيكرات وجرابات' },
    { id: 'phone-cases', label: 'جرابات هواتف' },
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getCatalogProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Listen to custom event for real-time sync with Admin Dashboard
    const handleSync = () => loadProducts();
    window.addEventListener('yuzersef-products-updated', handleSync);
    return () => window.removeEventListener('yuzersef-products-updated', handleSync);
  }, []);

  // Filter products by category, search, and active/hidden status
  const filteredProducts = products.filter((p) => {
    // Hide inactive or hidden products for customers
    if (!isProductVisible(p)) return false;

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'stickers' && (p.category === 'stickers' || p.category === 'phone-cases')) {
        // match both
      } else if (p.category !== activeCategory) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSubtitle = (p.subtitle || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchMaterial = (p.material || '').toLowerCase().includes(q);
      return matchName || matchSubtitle || matchDesc || matchMaterial;
    }

    return true;
  });

  return (
    <div className="bg-[#F8F7F3] min-h-screen py-10 sm:py-16 space-y-10" dir="rtl">
      {/* ─────────────────────────────────────────────────────────────
          1. Hero Header
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5F55]/10 border border-[#0B5F55]/20 text-[#0B5F55] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
          <span>كتالوج منتجات يوزرسيف المعتمدة للطباعة والتطريز الفوري</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#073B35] font-display tracking-tight leading-tight">
          اختر منتجك وابدأ بوضع شعارك عليه مباشرة
        </h1>

        <p className="text-sm sm:text-base text-[#4d6560] leading-relaxed max-w-3xl mx-auto">
          تصفّح تشكيلة منتجات يوزرسيف الجاهزة للتنفيذ بأسوان. اضغط على زر <strong>تخصيص اللوجو والمكان</strong> لأي منتج لتجربة الشعار وتحديد أماكن الطباعة في مصمم المعاينة التفاعلي مباشرة.
        </p>

        {/* Search & Category Filter */}
        <div className="pt-4 max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-[#5B6B68] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المنتج، الخامة (هودي، قطن، كاب، مج، استيكر...)"
              className="w-full bg-white border border-[#D7DEDB] rounded-2xl pr-11 pl-4 py-3 text-sm font-medium text-[#073B35] placeholder:text-[#5B6B68]/60 focus:outline-none focus:ring-2 focus:ring-[#0B5F55] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5B6B68] hover:text-[#073B35]"
              >
                مسح
              </button>
            )}
          </div>

          {/* Categories Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#0B5F55] text-white shadow-sm scale-102'
                    : 'bg-white text-[#073B35] border border-[#D7DEDB] hover:bg-[#F6F1E7]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Products Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#0B5F55] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-[#073B35]">جاري تحميل كتالوج المنتجات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#D7DEDB] p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F6F1E7] text-[#0B5F55] flex items-center justify-center mx-auto">
              <Shirt className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#073B35]">لا توجد منتجات مطابقة للبحث</h3>
            <p className="text-xs text-[#5B6B68] leading-relaxed">
              لم نعثر على منتجات تطابق المعايير المحددة. جرب اختيار قسم آخر أو إلغاء كلمات البحث.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="font-bold text-xs"
            >
              عرض جميع المنتجات
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar & Layout Selector */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D7DEDB]/60">
              <div className="text-xs sm:text-sm font-bold text-[#5B6B68]">
                عرض <span className="text-[#073B35] font-black">{filteredProducts.length}</span> منتجات جاهزة للتخصيص
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D7DEDB] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('wide')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'wide'
                      ? 'bg-[#0B5F55] text-white shadow-2xs'
                      : 'text-[#5B6B68] hover:text-[#073B35] hover:bg-[#F6F1E7]'
                  }`}
                  title="كروت عريضة وكبيرة"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">كروت عريضة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-[#0B5F55] text-white shadow-2xs'
                      : 'text-[#5B6B68] hover:text-[#073B35] hover:bg-[#F6F1E7]'
                  }`}
                  title="شبكة مدمجة رباعية"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">شبكة مدمجة</span>
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === 'wide'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              }
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/customize/${product.id}`}
                  className={`bg-white ${
                    viewMode === 'wide' ? 'rounded-3xl' : 'rounded-2xl'
                  } border border-[#D7DEDB] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer block`}
                >
                  {/* Product Image Stage */}
                  <div
                    className={`relative ${
                      viewMode === 'wide' ? 'aspect-[2/1]' : 'aspect-square p-6'
                    } bg-[#F6F1E7]/60 overflow-hidden flex items-center justify-center border-b border-[#D7DEDB]/60`}
                  >
                    <img
                      src={getProductDisplayImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div
                        className={`absolute ${
                          viewMode === 'wide' ? 'top-4 right-4 text-xs px-3 py-1.5' : 'top-3 right-3 text-[11px] px-2.5 py-1'
                        } bg-[#E3A92F] text-[#3A2A00] font-black rounded-lg shadow-xs`}
                      >
                        {product.badge}
                      </div>
                    )}

                    {/* Stock Alert Badge */}
                    {(() => {
                      const stock = computeTotalStock(product);
                      if (stock === 0) {
                        return (
                          <div
                            className={`absolute ${
                              viewMode === 'wide' ? 'top-4 left-4 text-xs px-2.5 py-1' : 'top-3 left-3 text-[10px] px-2 py-0.5'
                            } bg-rose-600 text-white font-black rounded-lg shadow-xs flex items-center gap-1`}
                          >
                            <span>نفد من المخزون</span>
                          </div>
                        );
                      }
                      if (stock <= 10) {
                        return (
                          <div
                            className={`absolute ${
                              viewMode === 'wide' ? 'top-4 left-4 text-xs px-2.5 py-1' : 'top-3 left-3 text-[10px] px-2 py-0.5'
                            } bg-amber-600 text-white font-bold rounded-lg shadow-xs flex items-center gap-1`}
                          >
                            <span>متبقي {stock} قطع فقط!</span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Category Pill */}
                    <div
                      className={`absolute ${
                        viewMode === 'wide' ? 'bottom-4 right-4 text-xs px-2.5 py-1' : 'bottom-3 right-3 text-[10px] px-2 py-0.5'
                      } bg-white/95 backdrop-blur-sm border border-[#D7DEDB] text-[#0B5F55] font-bold rounded-md shadow-2xs`}
                    >
                      {product.categoryLabel || 'منتج مخصص'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`${viewMode === 'wide' ? 'p-5 sm:p-6' : 'p-4'} flex flex-col gap-2`}>
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`${
                          viewMode === 'wide' ? 'text-lg sm:text-xl' : 'text-base'
                        } font-black text-[#073B35] leading-snug line-clamp-1 group-hover:text-[#0B5F55] transition-colors`}
                      >
                        {product.name}
                      </h3>
                      <div className="text-left shrink-0">
                        <span className="text-[10px] text-[#5B6B68] block">السعر</span>
                        <span className={`${viewMode === 'wide' ? 'text-base sm:text-lg' : 'text-sm'} font-black text-[#0B5F55]`}>
                          {product.price}
                        </span>
                      </div>
                    </div>

                    {/* Sizes preview if product has sizes */}
                    {product.hasSizes && product.sizeStock && Object.keys(product.sizeStock).length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-600">المقاسات:</span>
                        <div className="flex items-center gap-1">
                          {Object.entries(product.sizeStock).map(([sKey, sQty]) => (
                            <span
                              key={sKey}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                Number(sQty) <= 0
                                  ? 'bg-slate-100 text-slate-400 line-through'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {sKey}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Custom Product / Enterprise Banner
      ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-gradient-to-r from-[#073B35] to-[#0B5F55] text-white rounded-3xl p-6 sm:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#E3A92F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>هل تبحث عن خامة أو منتج مخصص غير مدرج؟</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display">
              نوفر طباعة وتطريز كميات للشركات والفعاليات بأسوان
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              إذا كان لديك تصميم خاص أو ترغب بتوفير خامات محددة أو طلب كميات جملة، تواصل معنا فوراً لتحصل على معاينة فورية وعرض سعر مخصص.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/customize"
              className="px-5 py-3 rounded-xl bg-[#E3A92F] hover:bg-[#c9911e] text-[#3A2A00] text-xs sm:text-sm font-black transition-all shadow-sm"
            >
              فتح مصمم المعاينة المباشر
            </Link>

            <a
              href={generateWhatsAppLink(undefined, 'مرحباً، أود الاستفسار عن تفصيل أو طباعة كمية لمنتج غير مدرج بالكتالوج.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>محادثة واتساب سريعة</span>
            </a>
          </div>
        </div>
      </section>

      {/* Floating Add to Cart Toast */}
      {cartToastMessage && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 bg-[#073B35] text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3.5 border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-4 max-w-[92vw]">
          <CheckCircle2 className="w-5 h-5 text-[#E3A92F] shrink-0" />
          <span className="text-xs sm:text-sm font-bold truncate">{cartToastMessage}</span>
          <Link
            to="/cart"
            className="bg-[#E3A92F] text-[#073B35] text-xs font-black px-3.5 py-1.5 rounded-xl hover:bg-[#d89c25] transition-colors whitespace-nowrap shadow-xs"
          >
            عرض السلة
          </Link>
        </div>
      )}
    </div>
  );
};
