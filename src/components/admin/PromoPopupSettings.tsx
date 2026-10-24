import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Tag,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input, Textarea, Label } from '../ui/input';
import { PromoPopupConfig, Coupon } from '../../lib/types';
import { getPromoPopup, updatePromoPopup, resetPromoPopup, getCoupons } from '../../lib/mock-api';
import { DEFAULT_PROMO_POPUP } from '../../lib/mock-data';

interface PromoPopupSettingsProps {
  onNotification?: (msg: string) => void;
}

export const PromoPopupSettings: React.FC<PromoPopupSettingsProps> = ({ onNotification }) => {
  const [config, setConfig] = useState<PromoPopupConfig>(DEFAULT_PROMO_POPUP);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [enabled, setEnabled] = useState(true);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showOncePerSession, setShowOncePerSession] = useState(true);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([getPromoPopup(), getCoupons()]);
      setConfig(pData);
      setCoupons(cData);
      populateForm(pData);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تحميل إعدادات البوب أب.');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: PromoPopupConfig) => {
    setEnabled(data.enabled);
    setTitle(data.title || '');
    setSubtitle(data.subtitle || '');
    setBadge(data.badge || '');
    setDescription(data.description || '');
    setCtaText(data.ctaText || 'ابدأ طلبك الآن');
    setCtaLink(data.ctaLink || '/request');
    setCouponCode(data.couponCode || '');
    setImageUrl(data.imageUrl || '/showcase/premium-embroidered-hoodie.jpg');
    setShowOncePerSession(data.showOncePerSession ?? true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    if (onNotification) onNotification(text);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePromoPopup({
        enabled,
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        description: description.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        couponCode: couponCode.trim(),
        imageUrl: imageUrl.trim(),
        showOncePerSession,
      });

      setConfig(updated);
      showFeedback('success', 'تم حفظ وتحديث إعدادات البوب أب الترويجي بنجاح!');
    } catch {
      showFeedback('error', 'حدث خطأ أثناء حفظ الإعدادات.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('هل أنت متأكد من استعادة إعدادات البوب أب الافتراضية؟')) {
      const def = await resetPromoPopup();
      setConfig(def);
      populateForm(def);
      showFeedback('success', 'تمت استعادة الإعدادات الافتراضية.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all shadow-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
              : 'bg-rose-50 text-rose-950 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#065E5A]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              إعدادات البانر والنافذة الترويجية المنبثقة (Promo Popup Modal)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            نافذة تفاعلية تظهر لزوار الموقع عند الدخول لجذب الانتباه لعروض التخرج، الخصومات الحصرية، أو كود الخصم المعتمد.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs gap-1 border-slate-300 text-slate-600 hover:text-rose-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">تخصيص محتوى النافذة المنبثقة</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">تفعيل الظهور للزوار:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#065E5A]"></div>
                </label>
              </div>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <Label>عنوان العرض الرئيسي (Title) *</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: عرض التخرج والفعاليات بأسوان! 🎓"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>العنوان الفرعي (Subtitle)</Label>
                  <Input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="وفر 15% على طلبيات الهوديز"
                  />
                </div>

                <div className="space-y-1">
                  <Label>شارة العرض (Badge)</Label>
                  <Input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="مثال: عرض حصري محدود"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>نص الرسالة الترويجية (Description)</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="تفاصيل العرض والشروط..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>كود الخصم المرفق (اختياري)</Label>
                  <select
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs bg-white font-mono font-bold"
                  >
                    <option value="">بدون كود خصم</option>
                    {coupons.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} ج.م`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label>رابط صورة العرض</Label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/showcase/premium-embroidered-hoodie.jpg"
                    className="font-mono text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>نص زر الإجراء (CTA)</Label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="ابدأ طلبك الآن مع الخصم"
                  />
                </div>

                <div className="space-y-1">
                  <Label>رابط زر الإجراء</Label>
                  <Input
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="/request?service=clothing-hoodies"
                    className="font-mono text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Show Once Per Session Setting */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">إظهار مرة واحدة لكل جلسة تصفح</span>
                  <span className="text-[11px] text-slate-500">
                    عند إغلاق الزائر للنافذة، لن تظهر مجدداً حتى يغلق المتصفح منعاً للإزعاج.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showOncePerSession}
                  onChange={(e) => setShowOncePerSession(e.target.checked)}
                  className="w-4 h-4 text-[#065E5A] rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Eye className="w-4 h-4 text-[#065E5A]" />
            <span>معاينة حية لشكل البوب أب كما يظهر للزائر:</span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/40 backdrop-blur-xs border border-slate-200/50 flex items-center justify-center min-h-[460px]">
            {/* Mockup Modal Card */}
            <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
              {/* Close mock */}
              <div className="absolute top-2.5 end-2.5 z-10 w-6 h-6 rounded-full bg-slate-900/60 text-white flex items-center justify-center text-xs">
                <X className="w-3.5 h-3.5" />
              </div>

              {/* Image banner */}
              {imageUrl && (
                <div className="h-36 bg-slate-100 overflow-hidden relative">
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/services/service-hoodies.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  {badge && (
                    <span className="absolute bottom-2.5 start-2.5 px-2 py-0.5 rounded text-[10px] font-black bg-[#E3A92F] text-[#073B35]">
                      {badge}
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-2.5 text-center">
                <h4 className="font-black text-slate-900 text-base leading-snug">{title || 'عنوان العرض الترويجي'}</h4>
                {subtitle && <p className="text-xs font-bold text-[#065E5A]">{subtitle}</p>}
                <p className="text-xs text-slate-600 leading-relaxed">{description || 'تفاصيل العرض الترويجي والخصم...'}</p>

                {/* Coupon Code Pill */}
                {couponCode && (
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-1">
                    <span className="text-[10px] text-teal-800 font-semibold block">كود الخصم المعتمد:</span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-teal-300 font-mono font-black text-xs text-[#065E5A]">
                      <span>{couponCode}</span>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}

                <Button className="w-full bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs py-2 mt-2">
                  {ctaText || 'ابدأ طلبك الآن'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
