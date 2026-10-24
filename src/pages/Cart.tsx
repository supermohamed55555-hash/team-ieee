import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Shirt,
  Info,
  CheckCircle2,
  PhoneCall,
  Lock,
  UserCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useCart, parsePriceToNumber } from '../lib/cart-store';
import { YUZERSEF_WHATSAPP, generateWhatsAppLink } from '../lib/utils';
import { DeliveryMethod } from '../lib/order-types';
import { useAuth } from '../lib/auth';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    loading,
    totalCount,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
  } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');

  // Shipping fees according to delivery method
  const getShippingFee = (method: DeliveryMethod) => {
    switch (method) {
      case 'aswan_delivery':
        return 30;
      case 'shipping':
        return 60;
      case 'pickup':
      default:
        return 0;
    }
  };

  const shippingFee = getShippingFee(deliveryMethod);
  const grandTotal = subtotal + shippingFee;
  const isHighValue = grandTotal > 5000;

  // Recommended products for quick add when cart is empty or exploring
  const quickRecommendations = [
    {
      id: 'prod-hoodie-oversized',
      name: 'هودي يوزرسيف أوفر سايز فاخر',
      subtitle: 'قطن ميلتون 380 GSM',
      price: 290,
      image: '/services-cards/card-hoodie.png',
      color: { id: 'black', name: 'أسود', hex: '#18181B' },
      size: 'L',
    },
    {
      id: 'prod-tshirt-premium',
      name: 'تيشيرت كلاسيك قطن 100%',
      subtitle: 'سنجل جيرسي معالج',
      price: 185,
      image: '/products/tshirt-white-front.png',
      color: { id: 'white', name: 'أبيض', hex: '#FFFFFF' },
      size: 'XL',
    },
    {
      id: 'prod-baseball-cap',
      name: 'كاب بيسبول كلاسيك يوزرسيف',
      subtitle: 'تطريز بارز 3D',
      price: 95,
      image: '/products/cap-black-angle.png',
      color: { id: 'green', name: 'أخضر يوزرسيف', hex: '#0B5F55' },
      size: 'Free Size',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#0B5F55] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#073B35]">جاري تحميل سلة المشتريات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F7F3] min-h-screen py-8 sm:py-12" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#5B6B68]">
            <Link to="/" className="hover:text-[#0B5F55] transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#0B5F55] transition-colors">المنتجات</Link>
            <span>/</span>
            <span className="font-bold text-[#073B35]">سلة المشتريات</span>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] hover:text-[#073B35] transition-colors"
          >
            <span>متابعة التسوق وإضافة منتجات أخرى</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {/* Page Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B5F55]/10 text-[#0B5F55] flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#073B35] font-display">
                  سلة المشتريات
                </h1>
                <Badge className="bg-[#0B5F55] text-white text-xs px-2.5 py-0.5 font-bold rounded-full">
                  {totalCount} {totalCount === 1 ? 'منتج' : totalCount === 2 ? 'منتجان' : 'منتجات'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#5B6B68] mt-0.5">
                راجع عناصر طلبك وتأكد من المقاسات والألوان قبل الانتقال لصفحة الدفع والتوصيل.
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في تفريغ سلة المشتريات بالكامل؟')) {
                  clearCart();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ السلة</span>
            </button>
          )}
        </div>

        {/* High-Value Banner Notice (> 5,000 EGP) */}
        {isHighValue && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-amber-900">
                    تنبيه الطلبات الكبيرة والجملة (أكثر من 5,000 ج.م)
                  </h3>
                  <Badge className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.2">
                    تأكيد عربون مطلوب
                  </Badge>
                </div>
                <p className="text-xs sm:text-[13px] text-amber-950/85 leading-relaxed">
                  نظراً لأن إجمالي طلبك الحالي يتجاوز <strong>5,000 جنيه مصري</strong>، سيتم وضع الطلب بحالة{' '}
                  <span className="font-bold underline text-amber-900">"معلق - بانتظار سداد العربون (Pending Deposit)"</span>،
                  وسيقوم فريق إدارة يوزرسيف بالتواصل معك مباشرةً عبر الواتساب أو الهاتف لتأكيد المقاسات والخامات والتنسيق بخصوص سداد دفعة العربون (Deposit).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/90 shadow-xs space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-[#0B5F55] flex items-center justify-center border-2 border-dashed border-[#0B5F55]/30">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#073B35]">
                سلة المشتريات فارغة حالياً
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B68] leading-relaxed">
                لم تقم بإضافة أي منتجات أو تصاميم بعد. تصفح كتالوج يوزرسيف المعتمد في أسوان أو استخدم استوديو التخصيص لتصميم تيشيرتك أو هوديك بشعارك الخاص!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/products">
                <Button className="bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-sm px-6 py-2.5 rounded-full shadow-sm">
                  <span>تصفح كتالوج المنتجات</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
              <Link to="/customize">
                <Button variant="outline" className="border-[#073B35] text-[#073B35] hover:bg-slate-50 font-bold text-sm px-6 py-2.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-[#E3A92F]" />
                  <span>افتح استوديو التخصيص والموك أب</span>
                </Button>
              </Link>
            </div>

            {/* Quick Add Recommendations */}
            <div className="pt-10 border-t border-slate-100 max-w-4xl mx-auto">
              <div className="text-right mb-4">
                <h3 className="text-sm font-black text-[#073B35] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E3A92F]" />
                  <span>منتجات ينصح بها لإضافتها فوراً:</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickRecommendations.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl border border-slate-200/90 bg-[#FBFBFA] hover:bg-white transition-all text-right flex flex-col justify-between gap-3 group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#073B35] truncate">{prod.name}</h4>
                        <p className="text-[11px] text-[#5B6B68]">{prod.subtitle}</p>
                        <p className="text-xs font-extrabold text-[#0B5F55] mt-1">{prod.price} ج.م</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        addToCart({
                          productId: prod.id,
                          name: prod.name,
                          subtitle: prod.subtitle,
                          price: prod.price,
                          originalPriceStr: `${prod.price} ج.م`,
                          quantity: 1,
                          selectedColor: prod.color,
                          selectedSize: prod.size,
                          imageUrl: prod.image,
                        })
                      }
                      className="w-full bg-white hover:bg-[#0B5F55] text-[#0B5F55] hover:text-white border border-[#0B5F55]/30 text-xs font-bold py-1.5 rounded-xl transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة سريعة للسلة</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Right Column: Items List (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {items.map((item) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Image Thumbnail & Info */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F8F7F3] border border-slate-200/80 p-1 shrink-0 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={item.customization?.previewUrl || item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {item.customization?.hasCustomDesign && (
                            <span className="absolute bottom-1 end-1 bg-[#E3A92F] text-[#073B35] text-[9px] font-black px-1 rounded-sm shadow-2xs">
                              مخصص
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-black text-[#073B35]">
                              {item.name}
                            </h3>
                            {item.customization?.hasCustomDesign && (
                              <Badge variant="outline" className="text-[10px] border-[#0B5F55]/30 text-[#0B5F55] bg-emerald-50 font-bold">
                                طباعة مخصصة
                              </Badge>
                            )}
                          </div>

                          {item.subtitle && (
                            <p className="text-xs text-[#5B6B68] line-clamp-1">{item.subtitle}</p>
                          )}

                          {/* Attributes Badges: Color & Size */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            {item.selectedColor && (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                                <span
                                  className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span>{item.selectedColor.name}</span>
                              </div>
                            )}

                            {item.selectedSize && (
                              <div className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                                المقاس: {item.selectedSize}
                              </div>
                            )}

                            {item.customization?.zoneName && (
                              <div className="px-2 py-0.5 rounded-md bg-[#0B5F55]/10 text-[#0B5F55] text-[11px] font-medium border border-[#0B5F55]/20">
                                المنطقة: {item.customization.zoneName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Remove button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-black text-[#073B35]">
                            {itemTotal.toLocaleString()} ج.م
                          </p>
                          <p className="text-[11px] text-[#5B6B68]">
                            ({item.price} ج.م / للقطعة)
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="حذف هذا المنتج من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: Quantity Adjuster */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-[#5B6B68] font-medium">الكمية المطلوبة:</span>
                      
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer font-bold disabled:opacity-50"
                          title="إنقاص الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-8 text-center font-black text-sm text-[#073B35]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[#0B5F55] text-white hover:bg-[#073B35] flex items-center justify-center transition-colors cursor-pointer font-bold"
                          title="زيادة الكمية"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Trust Badges */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-around gap-4 text-xs text-[#073B35]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0B5F55]" />
                  <span className="font-bold">قطن مصري 100% عالي الكثافة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E3A92F]" />
                  <span className="font-bold">طباعة DTF وتطريز لا يتأثر بالغسيل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0B5F55]" />
                  <span className="font-bold">استلام مجاني من فرع أسوان</span>
                </div>
              </div>
            </div>

            {/* Left Column: Order Summary & Checkout CTA (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
                <h2 className="text-base sm:text-lg font-black text-[#073B35] border-b border-slate-100 pb-3">
                  ملخص الطلب والتكلفة
                </h2>

                {/* Subtotal & Items count */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-[#5B6B68]">
                    <span>مجموع المنتجات ({totalCount} قطع):</span>
                    <span className="font-bold text-[#073B35]">{subtotal.toLocaleString()} ج.م</span>
                  </div>

                  {/* Delivery Selection */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-black text-[#073B35] block">
                      طريقة الاستلام أو التوصيل:
                    </label>
                    
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          deliveryMethod === 'pickup'
                            ? 'bg-emerald-50 border-[#0B5F55] text-[#073B35] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === 'pickup'}
                            onChange={() => setDeliveryMethod('pickup')}
                            className="accent-[#0B5F55]"
                          />
                          <span>استلام من مقر يوزرسيف بأسوان</span>
                        </div>
                        <span className="text-emerald-700 font-extrabold">مجاناً (0 ج.م)</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          deliveryMethod === 'aswan_delivery'
                            ? 'bg-emerald-50 border-[#0B5F55] text-[#073B35] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === 'aswan_delivery'}
                            onChange={() => setDeliveryMethod('aswan_delivery')}
                            className="accent-[#0B5F55]"
                          />
                          <span>توصيل سريع داخل مدينة أسوان</span>
                        </div>
                        <span className="font-bold text-[#073B35]">30 ج.م</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          deliveryMethod === 'shipping'
                            ? 'bg-emerald-50 border-[#0B5F55] text-[#073B35] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === 'shipping'}
                            onChange={() => setDeliveryMethod('shipping')}
                            className="accent-[#0B5F55]"
                          />
                          <span>شحن سريع لجميع المحافظات</span>
                        </div>
                        <span className="font-bold text-[#073B35]">60 ج.م</span>
                      </label>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-[#073B35]">الإجمالي النهائي:</span>
                      <p className="text-[11px] text-[#5B6B68]">شامل الضريبة ومصاريف الاستلام</p>
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-black text-[#0B5F55]">
                        {grandTotal.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-[#073B35] ms-1">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* High Value Alert Box inside summary */}
                {isHighValue && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-1 text-xs">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>قيمة الطلب تتجاوز 5,000 ج.م</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-950/80">
                      سيتم تحويل طلبك لـ <strong>(معلق - بانتظار العربون)</strong> فوراً وسيتواصل المشرف معك لتأكيد المواصفات وسداد العربون.
                    </p>
                  </div>
                )}

                {/* User Auth Status / Notice */}
                {!isAuthenticated && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1.5 text-xs">
                    <p className="font-black flex items-center gap-1.5 text-amber-900">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>تسجيل الدخول مطلوب لإتمام الطلب</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      لحفظ بياناتك ومتابعة خط سير الطلب ورفع إيصال التحويل، يجب تسجيل الدخول أو إنشاء حساب قبل إتمام الشراء.
                    </p>
                  </div>
                )}

                {/* Checkout CTA */}
                <Button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login?redirect=/order');
                    } else {
                      navigate('/order');
                    }
                  }}
                  className="w-full bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-sm py-3.5 rounded-2xl border-2 border-[#073B35] shadow-[2px_2px_0px_#073B35] hover:shadow-[3px_3px_0px_#073B35] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>تسجيل الدخول لإتمام الطلب</span>
                    </>
                  ) : (
                    <>
                      <span>المتابعة لإتمام الطلب والدفع</span>
                    </>
                  )}
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>

                {/* Direct WhatsApp Ordering Alternative */}
                <div className="text-center pt-2">
                  <a
                    href={generateWhatsAppLink(
                      undefined,
                      `مرحباً يوزرسيف أسوان، أريد الاستفسار عن تفاصيل طلبي في السلة بإجمالي ${grandTotal} ج.م لعدد ${totalCount} قطع.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5F55] hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>أو اطلب عبر واتساب يوزرسيف مباشرة</span>
                  </a>
                </div>

              </div>

              {/* Payment Methods Accepted */}
              <div className="bg-white/60 rounded-2xl p-3.5 border border-slate-200/80 text-center space-y-1.5">
                <p className="text-[11px] font-bold text-[#5B6B68]">طرق الدفع المدعومة في البوابة التجريبية:</p>
                <div className="flex items-center justify-center gap-2.5 text-xs font-bold text-[#073B35]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">💳 فيزا وماستركارد</span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">⚡ انستا باي InstaPay</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">💵 دفع عند الاستلام</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
