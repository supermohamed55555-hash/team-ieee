import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Copy,
  ArrowLeft,
  Shirt,
  Smartphone,
  Tag,
  Palette,
  MapPin,
  Calendar,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  Percent
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input, Textarea, Label } from '../components/ui/input';
import { FileUploadPreview } from '../components/ui/FileUploadPreview';
import { BrandLogo } from '../components/BrandLogo';
import { getServices, createServiceRequest, validateCoupon, recordCouponUsage } from '../lib/mock-api';
import { Service, FileAttachment, ServiceRequest, SizeBreakdown, ServiceCategory, Coupon } from '../lib/types';
import { calculateTotalSizes, generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';

export const RequestWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Wizard Steps: 1: Service & Specs, 2: Files & Design Help, 3: Details & Pickup, 4: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [budget, setBudget] = useState('');

  // Clothing & Caps Specifics
  const [clothingColor, setClothingColor] = useState('أسود');
  const [sizes, setSizes] = useState<SizeBreakdown>({ s: 0, m: 1, l: 0, xl: 0, xxl: 0 });
  const [printPlacement, setPrintPlacement] = useState<'chest' | 'back' | 'pocket' | 'sleeve' | 'both-sides'>('chest');

  // Phone Cases Specifics
  const [phoneModel, setPhoneModel] = useState('');
  const [personalisationText, setPersonalisationText] = useState('');

  // Stickers Specifics
  const [stickerWidthCm, setStickerWidthCm] = useState<number>(5);
  const [stickerHeightCm, setStickerHeightCm] = useState<number>(5);
  const [stickerShape, setStickerShape] = useState<'rectangle' | 'circle' | 'custom-cut'>('circle');
  const [stickerUsage, setStickerUsage] = useState<'indoor' | 'outdoor-waterproof'>('outdoor-waterproof');

  // Artwork & Design Help
  const [needsDesignHelp, setNeedsDesignHelp] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  // Desired Date & Receipt
  const [desiredDate, setDesiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [receiptPreference, setReceiptPreference] = useState<'aswan-pickup' | 'shipping-delivery'>('aswan-pickup');

  // Contact Info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Coupons & Discounts Engine (Feature 4)
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponValidationMsg, setCouponValidationMsg] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getServices().then((res) => {
      const activeOnly = res.filter((s) => s.isActive !== false);
      setServices(activeOnly);
      setLoadingServices(false);

      const queryService = searchParams.get('service');
      const queryRef = searchParams.get('ref');

      if (queryService && activeOnly.some((s) => s.id === queryService)) {
        setSelectedServiceId(queryService);
      } else if (activeOnly.length > 0 && !selectedServiceId) {
        setSelectedServiceId(activeOnly[0].id);
      }

      if (queryRef) {
        setProjectBrief(`أريد تنفيذ عمل مخصص مماثل لمشروع: [${queryRef}] المعروض في المعرض.`);
      }
    });
  }, [searchParams]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const category: ServiceCategory = selectedService?.category || 'clothing';

  // Price calculations & Coupon validation
  const unitPrice = useMemo(() => {
    if (!selectedService?.startingPrice) return 120;
    const match = selectedService.startingPrice.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 120;
  }, [selectedService]);

  const estimatedSubtotal = useMemo(() => {
    return unitPrice * (Number(quantity) || 1);
  }, [unitPrice, quantity]);

  const finalEstimatedTotal = useMemo(() => {
    return Math.max(0, estimatedSubtotal - couponDiscount);
  }, [estimatedSubtotal, couponDiscount]);

  const handleApplyCoupon = async (customCode?: string) => {
    const code = (customCode || couponInput).trim();
    if (!code) {
      setCouponError('يرجى إدخال كود الخصم أولاً');
      return;
    }
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await validateCoupon(code, Number(quantity) || 1, estimatedSubtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discountAmount);
        setCouponValidationMsg(res.message);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponValidationMsg('');
        setCouponError(res.message);
      }
    } catch {
      setCouponError('تعذر التحقق من كود الخصم حالياً');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponValidationMsg('');
    setCouponError('');
    setCouponInput('');
  };

  // Re-validate coupon if quantity changes
  useEffect(() => {
    if (appliedCoupon) {
      validateCoupon(appliedCoupon.code, Number(quantity) || 1, estimatedSubtotal).then((res) => {
        if (res.valid) {
          setCouponDiscount(res.discountAmount);
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponError(res.message);
        }
      });
    }
  }, [quantity, estimatedSubtotal]);

  // Handle URL coupon parameter e.g. /request?coupon=ASWAN10
  useEffect(() => {
    const queryCoupon = searchParams.get('coupon') || searchParams.get('code');
    if (queryCoupon && services.length > 0) {
      setCouponInput(queryCoupon.toUpperCase());
      handleApplyCoupon(queryCoupon);
    }
  }, [searchParams, services]);

  // ----------------------------------------------------
  // DISTINCTIVE FEATURE: Live Request-Readiness Assistant
  // (As mandated by Section 8.1 & Page 11 of documentation)
  // ----------------------------------------------------
  const totalSizesEntered = useMemo(() => calculateTotalSizes(sizes), [sizes]);
  const isClothing = category === 'clothing';
  const isCap = category === 'caps';
  const isPhone = category === 'phone-cases';
  const isSticker = category === 'stickers';

  const readinessChecks = useMemo(() => {
    const checks = [];

    // 1. Product & Quantity Check
    const quantityValid = quantity > 0 && !!selectedServiceId;
    checks.push({
      id: 'product-quantity',
      title: 'الخدمة والكمية الإجمالية',
      passed: quantityValid,
      message: quantityValid ? `الكمية المحددة: ${quantity} قطعة` : 'يرجى تحديد كمية أكبر من صفر',
    });

    // 2. Size Breakdown Check (Mandatory for clothing)
    if (isClothing) {
      const match = totalSizesEntered === Number(quantity);
      const diff = Number(quantity) - totalSizesEntered;
      checks.push({
        id: 'size-breakdown',
        title: 'فحص تطابق توزيع المقاسات',
        passed: match,
        message: match
          ? `المجموع مطابق تماماً (${totalSizesEntered} من ${quantity})`
          : diff > 0
          ? `عدم تطابق: يتبقى توزيع ${diff} قطعة على المقاسات`
          : `عدم تطابق: المقاسات تزيد بمقدار ${Math.abs(diff)} قطعة عن الإجمالي!`,
      });
    }

    // 3. Print Placement Check (For clothing & caps)
    if (isClothing || isCap) {
      const placed = !!printPlacement;
      checks.push({
        id: 'print-placement',
        title: 'تحديد موضع الطباعة',
        passed: placed,
        message: placed ? 'تم اختيار موضع الطباعة بنجاح' : 'اختر موضع الطباعة المطلوب للمتابعة',
      });
    }

    // 4. Phone Model Check (For phone cases)
    if (isPhone) {
      const modelValid = phoneModel.trim().length > 1;
      checks.push({
        id: 'phone-model',
        title: 'موديل الهاتف',
        passed: modelValid,
        message: modelValid ? `الجهاز: ${phoneModel}` : 'يرجى كتابة موديل الهاتف بدقة (مثلاً: iPhone 15 Pro)',
      });
    }

    // 5. Artwork or Design Help
    const artworkReady = attachments.length > 0 || needsDesignHelp;
    checks.push({
      id: 'artwork',
      title: 'ملف التصميم والمساعدة الفنية',
      passed: artworkReady,
      message: attachments.length > 0
        ? `تم إرفاق ${attachments.length} ملفات جاهزة`
        : needsDesignHelp
        ? 'تم طلب مساعدة مصممي يوزرسيف في تجهيز التصميم'
        : 'يرجى إرفاق ملف الشعار/التصميم أو تفعيل خيار المساعدة التصميمية',
    });

    return checks;
  }, [selectedServiceId, quantity, isClothing, isCap, isPhone, totalSizesEntered, printPlacement, phoneModel, attachments.length, needsDesignHelp]);

  const allReadinessPassed = readinessChecks.every((c) => c.passed);

  // Validation logic per step
  const validateStep = (step: number): boolean => {
    const err: { [key: string]: string } = {};

    if (step === 1) {
      if (!selectedServiceId) err.service = 'يرجى اختيار الخدمة المطلوبة';
      if (!projectBrief.trim()) {
        err.projectBrief = 'يرجى كتابة وصف موجز لطلبك أو رغبتك في التصميم';
      } else if (projectBrief.trim().length < 6) {
        err.projectBrief = 'الوصف قصير جداً، يرجى توضيح الفكرة أكثر';
      }

      if (isClothing && totalSizesEntered !== Number(quantity)) {
        err.sizes = `توزيع المقاسات (${totalSizesEntered}) لا يطابق الكمية الإجمالية (${quantity})! يرجى ضبط المقاسات للمتابعة.`;
      }

      if (isPhone && !phoneModel.trim()) {
        err.phoneModel = 'يرجى تحديد موديل الموبايل بدقة';
      }
    }

    if (step === 2) {
      if (attachments.length === 0 && !needsDesignHelp) {
        err.artwork = 'يرجى رفع ملف التصميم أو وضع علامة على "أحتاج مساعدة في التصميم".';
      }
    }

    if (step === 3) {
      if (!customerName.trim()) err.customerName = 'الاسم الكريم مطلوب';
      if (!phone.trim()) {
        err.phone = 'رقم الهاتف أو الواتساب مطلوب للتواصل بأسوان';
      } else if (!/^(\+?[0-9\s-]{8,15})$/.test(phone.trim())) {
        err.phone = 'يرجى إدخال رقم هاتف صحيح';
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
        err.email = 'بريد إلكتروني صحيح مطلوب لإرسال الإشعارات';
      }
      if (!desiredDate) {
        err.desiredDate = 'يرجى تحديد تاريخ الاستلام المرغوب';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createServiceRequest({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceId: selectedServiceId,
        serviceTitle: selectedService ? selectedService.title : 'خدمة مخصصة',
        serviceCategory: category,
        projectBrief: projectBrief.trim(),
        quantity: Number(quantity) || 1,
        clothingColor: isClothing ? clothingColor : undefined,
        sizeBreakdown: isClothing ? sizes : undefined,
        printPlacement: isClothing || isCap ? printPlacement : undefined,
        phoneModel: isPhone ? phoneModel.trim() : undefined,
        personalisationText: isPhone ? personalisationText.trim() : undefined,
        stickerWidthCm: isSticker ? stickerWidthCm : undefined,
        stickerHeightCm: isSticker ? stickerHeightCm : undefined,
        stickerShape: isSticker ? stickerShape : undefined,
        stickerUsage: isSticker ? stickerUsage : undefined,
        needsDesignHelp,
        attachments,
        desiredDate,
        receiptPreference,
        urgency,
        budget: budget.trim() || `${finalEstimatedTotal} ج.م (تقديري)`,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discountAmount: couponDiscount > 0 ? couponDiscount : undefined,
      });

      if (appliedCoupon) {
        await recordCouponUsage(appliedCoupon.code);
      }

      setSubmittedRequest(created);
    } catch {
      alert('حدث خطأ أثناء حفظ الطلب التجريبي.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS SCREEN AFTER SUBMISSION
  if (submittedRequest) {
    const waLink = generateWhatsAppLink(
      submittedRequest.id,
      `أنا ${submittedRequest.customerName}، وأود تأكيد وتنسيق الطلب المرفق.`
    );

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-2xl bg-[#F8F7F3]">
        <Card className="border-[#065E5A]/30 bg-white shadow-2xl overflow-hidden animate-slide-up rounded-2xl">
          <div className="bg-[#012C2B] text-white p-6 sm:p-8 text-center space-y-3">
            <div className="flex justify-center mb-1">
              <BrandLogo variant="white-on-deep" className="h-12 w-auto" />
            </div>
            <Badge className="bg-[#065E5A] text-white border-none text-xs">
              تم تسجيل الطلب التجريبي بنجاح (Demo)
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black">شكراً لك، {submittedRequest.customerName}!</h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto leading-relaxed">
              تم إصدار كود طلبك التجريبي وتمريره للنظام للمراجعة والمتابعة الحية.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Request ID Box */}
            <div className="p-5 rounded-2xl bg-[#EFEFEA] border-2 border-dashed border-[#065E5A]/40 text-center space-y-2">
              <span className="text-xs text-slate-500 font-semibold">رقم طلبك الإلكتروني للمتابعة</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-mono font-black text-[#065E5A] tracking-wider">
                  {submittedRequest.id}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="gap-1 text-xs border-[#065E5A]/40"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#065E5A]" />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                احفظ هذا الرمز لمتابعة مراحله خطوة بخطوة في صفحة التتبع.
              </p>
            </div>

            {/* Direct WhatsApp Connect (Mandatory per Section 7 & Page 9) */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="space-y-0.5 text-center sm:text-start">
                <span className="font-bold flex items-center justify-center sm:justify-start gap-1.5 text-emerald-800">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  تواصل مباشر عبر واتساب معمل أسوان
                </span>
                <p className="text-[11px] text-emerald-700">
                  يمكنك إرسال رقم الطلب فوراً على الواتساب المعتمد: <strong className="font-mono">{YUZERSEF_WHATSAPP}</strong>
                </p>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="shrink-0 w-full sm:w-auto">
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>فتح محادثة واتساب</span>
                </Button>
              </a>
            </div>

            {/* Quick summary */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">الخدمة:</span>
                <span className="font-bold text-slate-900">{submittedRequest.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">الكمية الإجمالية:</span>
                <span className="font-bold text-slate-900">{submittedRequest.quantity} قطعة</span>
              </div>
              {submittedRequest.serviceCategory === 'clothing' && submittedRequest.sizeBreakdown && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">توزيع المقاسات:</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    S:{submittedRequest.sizeBreakdown.s} | M:{submittedRequest.sizeBreakdown.m} | L:{submittedRequest.sizeBreakdown.l} | XL:{submittedRequest.sizeBreakdown.xl} | XXL:{submittedRequest.sizeBreakdown.xxl}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">طريقة الاستلام:</span>
                <span className="font-semibold text-slate-900">
                  {submittedRequest.receiptPreference === 'aswan-pickup' ? 'استلام من مقر يوزرسيف بأسوان' : 'شحن وتوصيل'}
                </span>
              </div>
              {submittedRequest.couponCode && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 bg-emerald-50 px-2 rounded">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    كوبون الخصم المطبق:
                  </span>
                  <span className="font-bold text-emerald-800">
                    {submittedRequest.couponCode} {submittedRequest.discountAmount ? `(-${submittedRequest.discountAmount} ج.م)` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">تاريخ الاستلام المرغوب:</span>
                <span className="font-mono font-semibold text-slate-900">{submittedRequest.desiredDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">حالة الطلب:</span>
                <Badge className="bg-slate-100 text-slate-800 border-none font-semibold text-xs">
                  تم التقديم (Submitted)
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                className="w-full gap-2 bg-[#065E5A] hover:bg-[#012C2B] text-white shadow-md"
                onClick={() => navigate(`/track?id=${submittedRequest.id}`)}
              >
                <span>انتقل لصفحة التتبع الآن</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
              </Button>

              <Link to="/admin/login" className="w-full">
                <Button variant="outline" size="lg" className="w-full text-xs border-slate-300">
                  دخول لوحة المسؤول لاعتماد الطلب
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // WIZARD STEPS
  const stepTitles = [
    { num: 1, title: 'الخدمة والمواصفات' },
    { num: 2, title: 'التصميم والمرفقات' },
    { num: 3, title: 'الاستلام والتواصل' },
    { num: 4, title: 'المراجعة والجاهزية' },
  ];

  return (
    <div className="py-8 sm:py-16 bg-[#F8F7F3] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <Badge variant="demo" className="text-xs bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
            معالج طلبات يوزرسيف في أسوان (Demo Flow)
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-[#012C2B]">
            تقديم طلب طباعة وتخصيص
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            حدد مواصفاتك وسيقوم "مساعد الجاهزية الذكي" بفحص الطلب قبل إصداره للتأكد من عدم وجود تفاصيل ناقصة.
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#065E5A]/15 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {stepTitles.map((s) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#065E5A] text-white ring-4 ring-[#065E5A]/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
                  </div>
                  <span
                    className={`mt-2 text-[10px] sm:text-xs font-semibold truncate max-w-full ${
                      isCurrent ? 'text-[#065E5A] font-bold' : isPast ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout: Main Form + Live Readiness Assistant Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="border-[#065E5A]/15 shadow-md bg-white rounded-2xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* STEP 1: SERVICE & SPECS */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">الخطوة 1: نوع المنتج والمواصفات الفنية</h2>
                      <p className="text-xs text-slate-500 mt-1">اختر خدمة يوزرسيف وحدد الكمية والمقاسات المطلوبة.</p>
                    </div>

                    {/* Services selection */}
                    <div className="space-y-3">
                      <Label required>نوع المنتج المطلوب</Label>
                      {loadingServices ? (
                        <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {services.map((s) => {
                            const isSelected = selectedServiceId === s.id;
                            return (
                              <div
                                key={s.id}
                                onClick={() => setSelectedServiceId(s.id)}
                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? 'border-[#065E5A] bg-[#065E5A]/5 shadow-sm ring-1 ring-[#065E5A]'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                                }`}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                              >
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                  <img
                                    src={s.imageUrl}
                                    alt={s.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className="overflow-hidden flex-1">
                                  <p className="text-xs font-bold text-slate-900 truncate">{s.title}</p>
                                  <p className="text-[11px] text-[#065E5A] font-semibold truncate mt-0.5">{s.startingPrice}</p>
                                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{s.shortDescription}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {errors.service && <p className="text-xs text-rose-600">{errors.service}</p>}
                    </div>

                    {/* Quantity & Urgency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label required>الكمية الإجمالية المطلوبة (قطع)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1);
                            setQuantity(val);
                            // auto set size m if 1
                            if (val === 1 && isClothing) {
                              setSizes({ s: 0, m: 1, l: 0, xl: 0, xxl: 0 });
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>أولوية التنفيذ</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setUrgency('normal')}
                            className={`h-11 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                              urgency === 'normal'
                                ? 'border-[#065E5A] bg-[#065E5A]/10 text-[#065E5A] font-bold'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>عادي (2-4 أيام)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUrgency('urgent')}
                            className={`h-11 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                              urgency === 'urgent'
                                ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>مستعجل (24-48 س)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC FIELDS: CLOTHING (Size Breakdown & Placement) */}
                    {isClothing && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shirt className="w-4 h-4 text-[#065E5A]" />
                            <span className="text-xs font-bold text-slate-800">
                              توزيع المقاسات الإلزامية للملابس (Size Breakdown)
                            </span>
                          </div>
                          <Badge
                            className={`text-[10px] ${
                              totalSizesEntered === Number(quantity)
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            المجموع: {totalSizesEntered} / {quantity}
                          </Badge>
                        </div>

                        {/* Size Inputs Grid */}
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {(['s', 'm', 'l', 'xl', 'xxl'] as const).map((sz) => (
                            <div key={sz} className="space-y-1">
                              <label className="text-[11px] font-bold uppercase text-slate-600">{sz}</label>
                              <input
                                type="number"
                                min={0}
                                value={sizes[sz]}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setSizes((prev) => ({ ...prev, [sz]: val }));
                                }}
                                className="w-full h-10 rounded-lg border border-slate-300 bg-white text-center font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A]"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Mismatch Alert Box */}
                        {totalSizesEntered !== Number(quantity) && (
                          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              تنبيه: مجموع المقاسات الموزعة ({totalSizesEntered}) يجب أن يساوي الكمية الكلية ({quantity}) بالضبط.
                            </span>
                          </div>
                        )}

                        {/* Color & Placement */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5">
                            <Label>لون الخامة الأساسي</Label>
                            <Input
                              value={clothingColor}
                              onChange={(e) => setClothingColor(e.target.value)}
                              placeholder="أسود، أبيض، كحلي، بيج..."
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label required>موضع الطباعة</Label>
                            <select
                              value={printPlacement}
                              onChange={(e) => setPrintPlacement(e.target.value as any)}
                              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A]"
                            >
                              <option value="chest">الصدر فقط (Chest)</option>
                              <option value="back">الظهر فقط (Back)</option>
                              <option value="pocket">الجيب الأمامي الصغير (Pocket)</option>
                              <option value="sleeve">الكم (Sleeve)</option>
                              <option value="both-sides">الجهتين: صدر + ظهر (Both Sides)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC FIELDS: CAPS */}
                    {isCap && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
                        <Label required>موضع لوجو الكاب</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'chest', label: 'الواجهة الأمامية' },
                            { id: 'pocket', label: 'الجانب الأيمن' },
                            { id: 'sleeve', label: 'الجانب الأيسر' },
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setPrintPlacement(pos.id as any)}
                              className={`h-10 rounded-lg border text-xs font-semibold ${
                                printPlacement === pos.id
                                  ? 'border-[#065E5A] bg-[#065E5A]/10 text-[#065E5A]'
                                  : 'border-slate-200 bg-white text-slate-600'
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC FIELDS: PHONE CASES */}
                    {isPhone && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
                        <div className="space-y-1.5">
                          <Label required>موديل الهاتف ونوعه بالتحديد</Label>
                          <Input
                            value={phoneModel}
                            onChange={(e) => setPhoneModel(e.target.value)}
                            placeholder="مثال: iPhone 15 Pro Max أو Samsung S24 Ultra"
                            error={errors.phoneModel}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label>نص التخصيص أو الاسم المطلوب طباعته (اختياري)</Label>
                          <Input
                            value={personalisationText}
                            onChange={(e) => setPersonalisationText(e.target.value)}
                            placeholder="مثال: كتابة اسم 'أحمد' بالخط العربي..."
                          />
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC FIELDS: STICKERS */}
                    {isSticker && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label required>العرض (سم)</Label>
                            <Input
                              type="number"
                              min={1}
                              value={stickerWidthCm}
                              onChange={(e) => setStickerWidthCm(Number(e.target.value) || 5)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label required>الارتفاع (سم)</Label>
                            <Input
                              type="number"
                              min={1}
                              value={stickerHeightCm}
                              onChange={(e) => setStickerHeightCm(Number(e.target.value) || 5)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label>شكل القص</Label>
                            <select
                              value={stickerShape}
                              onChange={(e) => setStickerShape(e.target.value as any)}
                              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                            >
                              <option value="circle">دائري</option>
                              <option value="rectangle">مستطيل / مربع</option>
                              <option value="custom-cut">قص مخصص على حدود الشعار (Die-cut)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label>نوع الاستخدام</Label>
                            <select
                              value={stickerUsage}
                              onChange={(e) => setStickerUsage(e.target.value as any)}
                              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                            >
                              <option value="outdoor-waterproof">مقاوم للماء والشمس (Outdoor)</option>
                              <option value="indoor">استخدام داخلي للأوراق والعلب (Indoor)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brief description */}
                    <div className="space-y-2">
                      <Label required>تفاصيل وملاحظات الطلب (Brief)</Label>
                      <Textarea
                        value={projectBrief}
                        onChange={(e) => setProjectBrief(e.target.value)}
                        placeholder="اشرح أي تفاصيل إضافية عن التصميم أو نوع الألوان أو مقاسات خاصة..."
                        rows={3}
                        error={errors.projectBrief}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: ARTWORK & DESIGN HELP */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">الخطوة 2: ملفات التصميم أو المساعدة</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        ارفع ملف الشعار إن وجد، أو اطلب مساعدة مصممي يوزرسيف في تجهيزه.
                      </p>
                    </div>

                    {/* Design Help Toggle Box */}
                    <div
                      onClick={() => setNeedsDesignHelp(!needsDesignHelp)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        needsDesignHelp
                          ? 'border-[#065E5A] bg-[#065E5A]/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      role="checkbox"
                      aria-checked={needsDesignHelp}
                    >
                      <div
                        className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${
                          needsDesignHelp ? 'bg-[#065E5A] border-[#065E5A] text-white' : 'border-slate-300'
                        }`}
                      >
                        {needsDesignHelp && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900">
                          أحتاج مساعدة فنية في إعداد وتجهيز التصميم (Design Help)
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          فعل هذا الخيار إذا لم يكن لديك تصميم جاهز بصيغة PDF أو فيكتور، وسيقوم فريقنا بأسوان بمساعدتك في تجهيزه قبل الطباعة.
                        </p>
                      </div>
                    </div>

                    {/* Upload section */}
                    <div className="space-y-2">
                      <Label>رفع المرفقات والشعارات (اختياري في حال طلب المساعدة)</Label>
                      <FileUploadPreview
                        files={attachments}
                        onChange={setAttachments}
                        maxFiles={5}
                      />
                      {errors.artwork && <p className="text-xs text-rose-600 mt-1">{errors.artwork}</p>}
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        تنبيه معمل أسوان: يفضل أن تكون صيغ الملفات (PDF أو AI أو PNG عالي الجودة بخلفية شفافة) لضمان أعلى نقاء للطباعة.
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONTACT & PICKUP */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">الخطوة 3: بيانات التواصل وتاريخ الاستلام</h2>
                      <p className="text-xs text-slate-500 mt-1">تحديد موعد الاستلام وتفضيلات الشحن بأسوان.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Desired Date & Receipt Preference (Mandatory per Section 6.2) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="space-y-1.5">
                          <Label required>تاريخ الاستلام المرغوب (Desired Date)</Label>
                          <Input
                            type="date"
                            value={desiredDate}
                            onChange={(e) => setDesiredDate(e.target.value)}
                            error={errors.desiredDate}
                          />
                          <p className="text-[10px] text-amber-800 leading-tight pt-0.5 font-medium">
                            * تنبيه: تاريخ الاستلام المرغوب هو موعد تقريبي تفضله وليس وعداً نهائياً، ويخضع لتأكيد الإدارة.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <Label required>طريقة استلام الطلبية</Label>
                          <div className="space-y-2 pt-1">
                            <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                              <input
                                type="radio"
                                name="receipt"
                                checked={receiptPreference === 'aswan-pickup'}
                                onChange={() => setReceiptPreference('aswan-pickup')}
                                className="accent-[#065E5A]"
                              />
                              <span>استلام من مقر يوزرسيف بأسوان (مجاناً)</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                              <input
                                type="radio"
                                name="receipt"
                                checked={receiptPreference === 'shipping-delivery'}
                                onChange={() => setReceiptPreference('shipping-delivery')}
                                className="accent-[#065E5A]"
                              />
                              <span>شحن وتوصيل للعنوان (تحدد الرسوم لاحقاً)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="space-y-1.5">
                        <Label required>الاسم الكريم</Label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="الاسم ثلاثي"
                          error={errors.customerName}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label required>رقم الجوال / الواتساب</Label>
                          <Input
                            dir="ltr"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010XXXXXXXX"
                            error={errors.phone}
                            className="font-mono text-start"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label required>البريد الإلكتروني</Label>
                          <Input
                            type="email"
                            dir="ltr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            error={errors.email}
                            className="font-mono text-start"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>الميزانية التقريبية المقترحة (اختياري)</Label>
                        <Input
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="مثال: 500 - 800 ج.م"
                        />
                      </div>

                      {/* Coupon Code Section */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <Percent className="w-4 h-4 text-[#065E5A]" />
                            <span>كوبون الخصم أو العرض الترويجي (اختياري)</span>
                          </Label>
                          {appliedCoupon && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-300">
                              مفعّل
                            </Badge>
                          )}
                        </div>

                        {!appliedCoupon ? (
                          <div className="flex gap-2">
                            <Input
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="أدخل كود الخصم (مثال: ASWAN10 أو YUZER2025)"
                              className="font-mono uppercase text-xs"
                              disabled={isValidatingCoupon}
                            />
                            <Button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              disabled={isValidatingCoupon || !couponInput.trim()}
                              isLoading={isValidatingCoupon}
                              className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs shrink-0"
                            >
                              تطبيق الكود
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <p className="font-bold text-emerald-950">
                                  كود الخصم ({appliedCoupon.code}) مفعّل بنجاح!
                                </p>
                                <p className="text-[11px] text-emerald-700">
                                  {couponValidationMsg || `خصم بقيمة ${couponDiscount} ج.م على إجمالي الطلب`}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              إلغاء الكود
                            </Button>
                          </div>
                        )}

                        {couponError && (
                          <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{couponError}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & CONFIRM */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">الخطوة 4: مراجعة الطلب وجاهزية الإرسال</h2>
                      <p className="text-xs text-slate-500 mt-1">ملخص كامل للطلب قبل اعتماده وإصدار رمز التتبع.</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-xs">
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                        <span className="text-slate-500">الخدمة المختارة:</span>
                        <span className="font-bold text-slate-900">{selectedService?.title}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-200">
                        <div>
                          <span className="text-slate-500 block">الكمية الإجمالية:</span>
                          <span className="font-bold text-slate-900">{quantity} قطعة</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">طريقة الاستلام:</span>
                          <span className="font-semibold text-slate-900">
                            {receiptPreference === 'aswan-pickup' ? 'استلام مقر أسوان' : 'شحن وتوصيل'}
                          </span>
                        </div>
                      </div>

                      {isClothing && (
                        <div className="pb-2.5 border-b border-slate-200">
                          <span className="text-slate-500 block mb-1">تفصيل المقاسات واللون:</span>
                          <p className="font-mono font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                            اللون: {clothingColor} | S:{sizes.s} - M:{sizes.m} - L:{sizes.l} - XL:{sizes.xl} - XXL:{sizes.xxl}
                          </p>
                        </div>
                      )}

                      {isPhone && (
                        <div className="pb-2.5 border-b border-slate-200">
                          <span className="text-slate-500 block">موديل الهاتف:</span>
                          <span className="font-bold text-slate-900">{phoneModel}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-200">
                        <div>
                          <span className="text-slate-500 block">صاحب الطلب:</span>
                          <span className="font-bold text-slate-900">{customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">الهاتف:</span>
                          <span className="font-mono font-bold text-slate-900" dir="ltr">{phone}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block mb-1">التصميم والمرفقات:</span>
                        <p className="font-medium text-slate-800">
                          {needsDesignHelp ? '✓ طلب مساعدة في التصميم' : `✓ ${attachments.length} ملفات مرفقة`}
                        </p>
                      </div>
                    </div>

                    {/* Price & Coupon Calculation in Review */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>الإجمالي التقديري للطلب:</span>
                        <span className="font-semibold">{estimatedSubtotal} ج.م</span>
                      </div>
                      {appliedCoupon && couponDiscount > 0 && (
                        <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                          <span className="flex items-center gap-1.5">
                            <Percent className="w-3.5 h-3.5 text-emerald-600" />
                            خصم الكوبون ({appliedCoupon.code}):
                          </span>
                          <span>-{couponDiscount} ج.م</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                        <span>المبلغ التقديري الصافي:</span>
                        <span className="text-[#065E5A] font-black">{finalEstimatedTotal} ج.م</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        * هذا السعر تقديري بناءً على أسعار البداية المعتمدة ويتم التأكيد النهائي عند المراجعة الفنية لمقاسات وتفاصيل الطباعة.
                      </p>
                    </div>

                    {/* Readiness check status reminder */}
                    {!allReadinessPassed && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>يرجى استيفاء الشروط في قائمة الجاهزية الجانبية قبل التمكن من الإرسال.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                      className="gap-1.5"
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-0" />
                      <span>السابق</span>
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="gap-1.5 bg-[#065E5A] hover:bg-[#012C2B] text-white"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!allReadinessPassed || isSubmitting}
                      isLoading={isSubmitting}
                      className="bg-[#065E5A] hover:bg-[#012C2B] text-white gap-2 px-6 shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>تأكيد وإصدار رقم الطلب</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR: DISTINCTIVE FEATURE (Request-Readiness Assistant Panel) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <Card className="border-[#065E5A]/30 bg-white shadow-lg overflow-hidden">
              <div className="bg-[#065E5A] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5ee7cf] animate-pulse" />
                  <h3 className="font-bold text-xs sm:text-sm">مساعد الجاهزية الذكي (Feature)</h3>
                </div>
                <Badge className="bg-white/20 text-white border-none text-[10px]">
                  {readinessChecks.filter((c) => c.passed).length}/{readinessChecks.length}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-3.5">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  يفحص النظام تفاصيل طلبك لمنع أي نقص في المواصفات وتسهيل مراجعتها:
                </p>

                <div className="space-y-2.5">
                  {readinessChecks.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs transition-colors ${
                        item.passed
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                          : 'border-amber-200 bg-amber-50/70 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-0.5">
                        {item.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] opacity-80 ps-5">{item.message}</p>
                    </div>
                  ))}
                </div>

                {/* Mandatory Rubric Note from Page 11 */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-tight">
                  ℹ️ تنبيه: فحص الجاهزية الذكي لا يضمن مطابقة الألوان النهائية بنسبة 100% في خطوط الإنتاج.
                </div>
              </CardContent>
            </Card>

            {/* Live Pricing & Discount Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#065E5A]" />
                  تقدير التكلفة الأولية
                </span>
                <span className="font-mono text-slate-900">{estimatedSubtotal} ج.م</span>
              </div>
              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    خصم ({appliedCoupon.code})
                  </span>
                  <span>-{couponDiscount} ج.م</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-black text-slate-900">
                <span>الصافي التقديري:</span>
                <span className="text-base text-[#065E5A]">{finalEstimatedTotal} ج.م</span>
              </div>
            </div>

            {/* Quick WhatsApp Help */}
            <div className="p-3.5 rounded-xl bg-[#012C2B] text-white text-xs space-y-2 shadow-xs">
              <span className="font-bold text-[#5ee7cf] block">تحتاج استشارة سريعة قبل الطلب؟</span>
              <p className="text-[11px] text-emerald-100/70">
                تواصل مع فريق يوزرسيف مباشرة عبر واتساب للمساعدة في تفاصيل طلبك.
              </p>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#5ee7cf] hover:text-white font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب: {YUZERSEF_WHATSAPP}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
