import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  Building,
  Phone,
  User,
  MapPin,
  FileText,
  Clock,
  Sparkles,
  ShoppingBag,
  Send,
  ExternalLink,
  Printer,
  ChevronDown,
  Lock,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input, Textarea, Label } from '../components/ui/input';
import { useCart } from '../lib/cart-store';
import { createOrder, getOrderById } from '../lib/mock-api';
import { DepositReceiptUpload } from '../components/DepositReceiptUpload';
import { useAuth } from '../lib/auth';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  DeliveryMethod,
  CustomerDetails,
  OrderPayment
} from '../lib/order-types';
import { generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';

export const OrderCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalCount, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, login } = useAuth();

  // Quick Auth State for non-logged-in users
  const [quickAuthMode, setQuickAuthMode] = useState<'login' | 'register'>('login');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickAuthError, setQuickAuthError] = useState('');
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);

  // Delivery & Customer Form State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: user?.name || '',
    phone: user?.phone || '',
    whatsappPhone: user?.phone || '',
    email: user?.email || '',
    governorate: 'أسوان',
    city: 'أسوان',
    address: '',
    notes: '',
  });

  // Sync customer details whenever user changes
  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        whatsappPhone: prev.whatsappPhone || user.phone || '',
      }));
    }
  }, [user]);

  // Handle Quick Auth Form submission right at checkout barrier
  const handleQuickAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickAuthError('');
    if (quickAuthMode === 'login') {
      if (!quickEmail.trim()) {
        setQuickAuthError('يرجى إدخال البريد الإلكتروني.');
        return;
      }
      setIsQuickLoggingIn(true);
      await new Promise((r) => setTimeout(r, 400));
      login({
        name: quickEmail.split('@')[0],
        email: quickEmail.trim(),
        role: 'customer',
        loginTime: new Date().toISOString(),
      });
      setIsQuickLoggingIn(false);
    } else {
      if (!quickName.trim() || !quickEmail.trim()) {
        setQuickAuthError('يرجى ملء الاسم والبريد الإلكتروني.');
        return;
      }
      setIsQuickLoggingIn(true);
      await new Promise((r) => setTimeout(r, 400));
      login({
        name: quickName.trim(),
        email: quickEmail.trim(),
        phone: quickPhone.trim() || undefined,
        role: 'customer',
        loginTime: new Date().toISOString(),
      });
      setIsQuickLoggingIn(false);
    }
  };

  const handleDemoLogin = () => {
    login({
      name: 'كريم عبد الرحيم',
      email: 'karim.aswan@gmail.com',
      phone: '01098765432',
      role: 'customer',
      loginTime: new Date().toISOString(),
    });
  };

  // Payment Method Selection: 'card' | 'instapay' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // InstaPay Inputs
  const [instapayRef, setInstapayRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submission / Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState('');

  // If arriving from payment gateway with completed order ID
  useEffect(() => {
    const orderIdParam = searchParams.get('id') || searchParams.get('orderId');
    if (orderIdParam) {
      getOrderById(orderIdParam).then((found) => {
        if (found) {
          setOrderComplete(found);
        }
      });
    }
  }, [searchParams]);

  // Shipping Fees
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
  // Any order requires 50% deposit before confirmation
  const requiresDeposit = true;
  const isHighValue = true; // Kept for backwards compatibility in UI styling
  const depositAmount = Math.round(grandTotal * 0.5);
  const remainingAmount = grandTotal - depositAmount;

  // InstaPay official business account details for Yuzersef Aswan
  const INSTAPAY_INFO = {
    ipa: 'yuzersef@instapay',
    phone: '01119565506',
    bank: 'بنك مصر (Banque Misr)',
    accountName: 'يوزرسيف للطباعة والتطريز (Yuzersef)',
  };

  // Detect card type
  const getCardType = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^(5078|6078)/.test(clean)) return 'Meeza';
    return 'Credit';
  };

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : '');
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Quick autofill demo card
  const fillDemoCard = () => {
    setCardNumber('4000 1234 5678 9010');
    setCardHolder(customer.name || 'عميل تجريبي');
    setCardExpiry('12/28');
    setCardCvv('888');
  };

  // Governorates in Egypt
  const governorates = [
    'أسوان',
    'الأقصر',
    'قنا',
    'سوهاج',
    'أسيوط',
    'المنيا',
    'بني سويف',
    'الفيوم',
    'الجيزة',
    'القاهرة',
    'الإسكندرية',
    'البحر الأحمر',
    'الوادي الجديد',
    'أخرى',
  ];

  // Handle Form Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!isAuthenticated) {
      setValidationError('يرجى تسجيل الدخول أولاً لتتمكن من إتمام الطلب.');
      return;
    }
    if (!customer.name.trim()) {
      setValidationError('يرجى إدخال اسم العميل بالكامل.');
      return;
    }
    if (!customer.phone.trim() || customer.phone.length < 10) {
      setValidationError('يرجى إدخال رقم هاتف صحيح للتواصل والتوصيل.');
      return;
    }
    if (deliveryMethod !== 'pickup' && !customer.address.trim()) {
      setValidationError('يرجى كتابة عنوان التوصيل بالتفصيل.');
      return;
    }

    // If Card is chosen: redirect directly to the hosted payment gateway page!
    if (paymentMethod === 'card') {
      const draft = {
        customer: {
          ...customer,
          email: customer.email || user?.email || '',
          whatsappPhone: customer.whatsappPhone || customer.phone,
        },
        items: [...items],
        subtotal,
        shippingFee,
        deliveryMethod,
        total: grandTotal,
        isHighValue,
        depositAmount,
      };
      sessionStorage.setItem('yuzersef_checkout_draft', JSON.stringify(draft));
      navigate('/payment-gateway');
      return;
    }

    if (paymentMethod === 'instapay') {
      if (!instapayRef.trim()) {
        setValidationError('يرجى إدخال الرقم المرجعي للتحويل من تطبيق انستا باي (Reference No.).');
        return;
      }
    }

    setIsProcessing(true);

    try {
      setProcessingStep('جاري تسجيل الطلب بحالة Pending وتجهيز تفاصيل سداد العربون 50%...');
      await new Promise((r) => setTimeout(r, 900));

      // Build payment object (All orders require 50% deposit before confirmation)
      const paymentData: OrderPayment = {
        method: paymentMethod,
        status: 'deposit_pending',
        transactionRef:
          paymentMethod === 'instapay'
            ? instapayRef.trim()
            : `ORD-REF-${Date.now().toString().slice(-4)}`,
        cardLast4: undefined,
        cardHolder: undefined,
        instapayAccount: paymentMethod === 'instapay' ? INSTAPAY_INFO.ipa : undefined,
        instapayRef: paymentMethod === 'instapay' ? instapayRef.trim() : undefined,
        paidAmount: 0,
        depositAmount: depositAmount,
      };

      // Create Order
      const newOrder = await createOrder({
        customer: {
          ...customer,
          email: customer.email || user?.email || '',
          whatsappPhone: customer.whatsappPhone || customer.phone,
        },
        items: [...items],
        subtotal,
        shippingFee,
        deliveryMethod,
        total: grandTotal,
        payment: paymentData,
        status: 'pending',
      });

      // 1. Immediately transition to completion confirmation view
      setOrderComplete(newOrder);

      // 2. Clear the cart safely after view is transitioned
      try {
        clearCart();
      } catch (clearErr) {
        console.warn('Error clearing cart after order', clearErr);
      }
    } catch (err: any) {
      console.error('Failed to submit order', err);
      const detail = err?.message ? ` (${err.message})` : '';
      setValidationError(`حدث خطأ أثناء معالجة الطلب: يرجى المحاولة مرة أخرى.${detail}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // If user arrives directly with no items and no completed order
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] py-16 flex items-center justify-center text-center px-4" dir="rtl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 max-w-md shadow-xs space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#073B35]">لا توجد منتجات في السلة</h2>
          <p className="text-xs text-[#5B6B68] leading-relaxed">
            سلة المشتريات فارغة حالياً، يرجى اختيار المنتجات وتخصيصها أولاً قبل الانتقال لصفحة إتمام الطلب والدفع.
          </p>
          <Link to="/products">
            <Button className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-sm py-2.5 rounded-full">
              <span>تصفح كتالوج المنتجات</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // AUTH BARRIER: USER MUST LOGIN BEFORE PLACING AN ORDER
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] py-12 sm:py-16 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 max-w-xl w-full shadow-sm space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 text-amber-700 flex items-center justify-center border-2 border-amber-500/30 shadow-2xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>خطوة لازمة لإتمام الطلب</span>
            </div>

            <h2 className="text-2xl font-black text-[#073B35]">
              تسجيل الدخول مطلوب لإتمام طلبك
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              بناءً على نظام ورشة يوزرسيف أسوان، لا يمكن تقديم أي طلب قبل تسجيل الدخول، لربط الطلب بحسابك حتى تتمكن من <strong>رفع صورة إيصال التحويل (العربون)</strong> ومتابعة حالة التجهيز والطباعة عبر صفحة طلباتك.
            </p>
          </div>

          {/* Quick Cart Snapshot */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-[#0B5F55]">
                {totalCount}
              </div>
              <div>
                <p className="font-bold text-slate-800">إجمالي المنتجات في السلة: {totalCount} قطع</p>
                <p className="text-[11px] text-slate-500">العربون المطلوب للسداد (50%): {depositAmount.toLocaleString()} ج.م</p>
              </div>
            </div>
            <span className="font-black text-sm text-[#0B5F55]">
              {grandTotal.toLocaleString()} ج.م
            </span>
          </div>

          {/* Option 1: Direct link to full login page */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login?redirect=/order')}
              className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-sm py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>الانتقال لصفحة تسجيل الدخول / إنشاء حساب</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>

          {/* Option 2: Inline Quick Login Form */}
          <div className="border-t border-slate-200/80 pt-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-800">أو يمكنك التسجيل السريع هنا مباشرة:</span>
              <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setQuickAuthMode('login'); setQuickAuthError(''); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    quickAuthMode === 'login' ? 'bg-white text-[#0B5F55] shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  دخول سريع
                </button>
                <button
                  type="button"
                  onClick={() => { setQuickAuthMode('register'); setQuickAuthError(''); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    quickAuthMode === 'register' ? 'bg-white text-[#0B5F55] shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  حساب جديد
                </button>
              </div>
            </div>

            {quickAuthError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{quickAuthError}</span>
              </div>
            )}

            <form onSubmit={handleQuickAuthSubmit} className="space-y-3 text-xs">
              {quickAuthMode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم بالكامل:</label>
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="مثال: كريم عبد الرحيم"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B5F55]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  dir="ltr"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B5F55] text-right"
                />
              </div>

              {quickAuthMode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف (اختياري للتواصل):</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B5F55] text-right font-mono"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isQuickLoggingIn}
                className="w-full bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35] font-black text-xs py-2.5 rounded-xl border-2 border-[#073B35] shadow-[2px_2px_0px_#073B35] cursor-pointer"
              >
                {isQuickLoggingIn ? 'جاري التحقق...' : quickAuthMode === 'login' ? 'دخول ومتابعة إتمام الطلب' : 'إنشاء حساب ومتابعة الطلب'}
              </Button>
            </form>

            {/* Demo One-Click Sign In */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-[11px] font-bold text-[#0B5F55] hover:underline cursor-pointer"
              >
                ⚡ دخول تجريبي سريع بنقرة واحدة (عميل أسوان)
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link to="/cart" className="text-xs font-bold text-slate-500 hover:text-slate-800">
              ← العودة إلى سلة المشتريات
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // VIEW: ORDER COMPLETE CONFIRMATION SCREEN
  // ─────────────────────────────────────────────────────────────
  if (orderComplete) {
    const depositAmount = orderComplete.depositRequiredAmount || Math.round(orderComplete.total * 0.5);

    return (
      <div className="bg-[#F8F7F3] min-h-screen py-10 sm:py-16" dir="rtl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
            
            {/* Status Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-xs ${
                orderComplete.depositPaid
                  ? 'bg-emerald-50 text-[#0B5F55] border-2 border-[#0B5F55]/30'
                  : 'bg-amber-500/15 text-amber-600 border-2 border-amber-500/30'
              }`}
            >
              {orderComplete.depositPaid ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <Clock className="w-10 h-10 animate-pulse" />
              )}
            </div>

            {/* Title & Status Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black shadow-2xs mb-1">
                {orderComplete.depositPaid ? (
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
                    ✅ تم تأكيد العربون والطلب قيد التنفيذ (Confirmed & In Progress)
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>طلب قيد الانتظار (Pending) - بانتظار سداد العربون 50%</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#073B35] font-display">
                {orderComplete.depositPaid ? 'تم تأكيد طلبك بنجاح!' : 'تم تسجيل طلبك بنجاح بحالة (Pending)!'}
              </h1>
              <p className="text-xs sm:text-sm text-[#5B6B68]">
                رقم الطلب الخاص بك:{' '}
                <span className="font-mono font-black text-base text-[#0B5F55] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {orderComplete.id}
                </span>
              </p>
            </div>

            {/* DEPOSIT POLICY & RECEIPT UPLOAD WIDGET */}
            <div className="text-right space-y-4">
              <DepositReceiptUpload
                order={orderComplete}
                onReceiptUploaded={(updated) => setOrderComplete(updated)}
              />
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {/* Go to Account / Orders */}
              <Link to={`/orders?id=${orderComplete.id}`}>
                <Button className="bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-sm flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>صفحة طلباتي (Orders) - رفع ومتابعة إيصال التحويل</span>
                </Button>
              </Link>

              {/* WhatsApp direct chat to Admin */}
              <a
                href={generateWhatsAppLink(
                  undefined,
                  `مرحباً يوزرسيف أسوان، أنا العميل ${orderComplete.customer.name}. قمت بتقديم طلب رقم ${orderComplete.id} بقيمة ${orderComplete.total} ج.م، وأود المتابعة بخصوص سداد العربون (50% = ${depositAmount.toLocaleString()} ج.م) وتأكيد الطلب.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="text-xs sm:text-sm px-4 py-2.5 rounded-full flex items-center gap-2 border-slate-300 text-slate-700">
                  <Send className="w-4 h-4" />
                  <span>مراسلة الأونر عبر واتساب</span>
                </Button>
              </a>

              <button
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإشعار</span>
              </button>
            </div>

            {/* Order Details Summary Box */}
            <div className="border-t border-slate-200 pt-6 text-right space-y-4">
              <h3 className="text-sm font-black text-[#073B35]">ملخص بيانات الطلب:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FBFBFA] p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[#5B6B68]">اسم العميل:</span>
                  <p className="font-bold text-[#073B35] mt-0.5">{orderComplete.customer.name}</p>
                </div>
                <div>
                  <span className="text-[#5B6B68]">رقم الهاتف:</span>
                  <p className="font-bold text-[#073B35] mt-0.5 font-mono">{orderComplete.customer.phone}</p>
                </div>
                <div>
                  <span className="text-[#5B6B68]">طريقة الاستلام:</span>
                  <p className="font-bold text-[#073B35] mt-0.5">
                    {orderComplete.deliveryMethod === 'pickup'
                      ? 'استلام من مقر يوزرسيف بأسوان'
                      : orderComplete.deliveryMethod === 'aswan_delivery'
                      ? 'توصيل داخل أسوان'
                      : 'شحن لجميع المحافظات'}
                  </p>
                </div>
                <div>
                  <span className="text-[#5B6B68]">طريقة الدفع:</span>
                  <p className="font-bold text-[#073B35] mt-0.5">
                    {orderComplete.payment.method === 'card'
                      ? `بطاقة بنكية (تنتهي بـ ${orderComplete.payment.cardLast4 || '••••'})`
                      : orderComplete.payment.method === 'instapay'
                      ? `انستا باي (${orderComplete.payment.instapayRef || 'مرجع إلكتروني'})`
                      : 'دفع عند الاستلام'}
                  </p>
                </div>
                {orderComplete.customer.address && (
                  <div className="sm:col-span-2">
                    <span className="text-[#5B6B68]">عنوان التوصيل:</span>
                    <p className="font-bold text-[#073B35] mt-0.5">
                      {orderComplete.customer.governorate} - {orderComplete.customer.city} ({orderComplete.customer.address})
                    </p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs text-[#5B6B68] block">العناصر المطلوبة ({orderComplete.items.length}):</span>
                {orderComplete.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img
                          src={it.customization?.previewUrl || it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#073B35]">{it.name}</p>
                        <p className="text-[11px] text-[#5B6B68]">
                          {it.selectedSize ? `مقاس: ${it.selectedSize} | ` : ''}
                          الكمية: {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-[#0B5F55]">
                      {((it.price || 0) * (it.quantity || 1)).toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">الإجمالي النهائي للطلب:</span>
                <span className="text-base font-black text-[#0B5F55]">
                  {orderComplete.total.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="pt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#0B5F55]">
              <Link to="/products" className="hover:underline">
                تصفح منتجات أخرى
              </Link>
              <span>•</span>
              <Link to="/track" className="hover:underline">
                تتبع حالة الطلب لاحقاً
              </Link>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN CHECKOUT FORM VIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F8F7F3] min-h-screen py-8 sm:py-12" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#5B6B68]">
          <Link to="/" className="hover:text-[#0B5F55] transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-[#0B5F55] transition-colors">سلة المشتريات</Link>
          <span>/</span>
          <span className="font-bold text-[#073B35]">إتمام الطلب وبوابة الدفع</span>
        </div>

        {/* Page Title */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#073B35] font-display">
            إتمام الطلب والدفع والتوصيل
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B68] mt-1">
            أدخل بيانات التوصيل بدقة، واختر طريقة الدفع المناسبة عبر البوابة التجريبية الآمنة.
          </p>
        </div>

        {/* Logged in User Session Banner */}
        <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              {user?.name?.slice(0, 1) || '✓'}
            </div>
            <div>
              <p className="font-black text-sm text-[#073B35]">
                أنت مسجل حالياً كـ: {user?.name}
              </p>
              <p className="text-emerald-800 text-[11px]">
                {user?.email} • سيتم ربط هذا الطلب بحسابك تلقائياً لتتمكن من رفع إيصال التحويل ومتابعته.
              </p>
            </div>
          </div>
          <Link to="/orders" className="text-[#0B5F55] font-black underline hover:text-[#073B35] shrink-0">
            صفحة طلباتي السابقة ↗
          </Link>
        </div>

        {/* 50% DEPOSIT POLICY BANNER (HOLDING) */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/5 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-amber-900">
                  سياسة سداد العربون وتأكيد الطلب (Holding)
                </h3>
                <Badge className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5">
                  50% Deposit
                </Badge>
              </div>
              <p className="text-xs sm:text-[13px] text-amber-950/90 leading-relaxed">
                أي اوردر قبل ما يتأكد، يلزم سداد <strong>عربون 50%</strong> (المطلوب: <strong>{depositAmount.toLocaleString()} ج.م</strong>).
                سيتم تسجيل طلبك بحالة <strong className="underline text-amber-900">Holding</strong>، ويمكنك رفع صورة إيصال التحويل مباشرة بعد إتمام الطلب أو من حسابك ليقوم الأونر بتأكيد الطلب وبدء الطباعة.
              </p>
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-800 text-xs sm:text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="font-bold">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─────────────────────────────────────────────────────────────
              Right Column: Delivery Info & Payment Gateway (7 cols)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* 1. Customer & Delivery Info Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#0B5F55]/10 text-[#0B5F55] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#073B35]">
                  بيانات العميل والتوصيل
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-[#073B35]">
                    الاسم بالكامل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="مثال: محمد أحمد علي"
                    className="rounded-xl border-slate-200 text-xs sm:text-sm py-2.5"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#073B35]">
                    رقم الهاتف للتواصل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    type="tel"
                    dir="ltr"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="01012345678"
                    className="rounded-xl border-slate-200 text-xs sm:text-sm py-2.5 text-right font-mono"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#073B35]">
                    رقم الواتساب (اختياري)
                  </Label>
                  <Input
                    type="tel"
                    dir="ltr"
                    value={customer.whatsappPhone}
                    onChange={(e) => setCustomer({ ...customer, whatsappPhone: e.target.value })}
                    placeholder="نفس الرقم أو رقم آخر"
                    className="rounded-xl border-slate-200 text-xs sm:text-sm py-2.5 text-right font-mono"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-[#073B35]">
                    البريد الإلكتروني (اختياري لاستلام الفاتورة)
                  </Label>
                  <Input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@example.com"
                    className="rounded-xl border-slate-200 text-xs sm:text-sm py-2.5"
                  />
                </div>
              </div>

              {/* Delivery Option Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-xs font-black text-[#073B35] block">
                  طريقة الاستلام أو التوصيل <span className="text-red-500">*</span>
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      deliveryMethod === 'pickup'
                        ? 'bg-emerald-50 border-[#0B5F55] shadow-xs ring-1 ring-[#0B5F55]'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#073B35]">🏢 استلام من المقر</span>
                      <input
                        type="radio"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="accent-[#0B5F55]"
                      />
                    </div>
                    <p className="text-[11px] text-[#5B6B68]">مقر يوزرسيف بأسوان</p>
                    <span className="text-emerald-700 font-extrabold text-[11px]">مجاناً (0 ج.م)</span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('aswan_delivery')}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      deliveryMethod === 'aswan_delivery'
                        ? 'bg-emerald-50 border-[#0B5F55] shadow-xs ring-1 ring-[#0B5F55]'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#073B35]">🛵 توصيل بأسوان</span>
                      <input
                        type="radio"
                        checked={deliveryMethod === 'aswan_delivery'}
                        onChange={() => setDeliveryMethod('aswan_delivery')}
                        className="accent-[#0B5F55]"
                      />
                    </div>
                    <p className="text-[11px] text-[#5B6B68]">داخل أحياء مدينة أسوان</p>
                    <span className="font-bold text-[#073B35] text-[11px]">30 ج.م</span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('shipping')}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      deliveryMethod === 'shipping'
                        ? 'bg-emerald-50 border-[#0B5F55] shadow-xs ring-1 ring-[#0B5F55]'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#073B35]">🚚 شحن محافظات</span>
                      <input
                        type="radio"
                        checked={deliveryMethod === 'shipping'}
                        onChange={() => setDeliveryMethod('shipping')}
                        className="accent-[#0B5F55]"
                      />
                    </div>
                    <p className="text-[11px] text-[#5B6B68]">شحن سريع لكافة المحافظات</p>
                    <span className="font-bold text-[#073B35] text-[11px]">60 ج.م</span>
                  </div>
                </div>
              </div>

              {/* Address Fields (if delivery chosen) */}
              {deliveryMethod !== 'pickup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#073B35]">المحافظة</Label>
                    <select
                      value={customer.governorate}
                      onChange={(e) => setCustomer({ ...customer, governorate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs sm:text-sm text-[#073B35] focus:outline-none focus:ring-2 focus:ring-[#0B5F55]"
                    >
                      {governorates.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#073B35]">المدينة أو المنطقة</Label>
                    <Input
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="مثال: حي العقاد / الكورنيش / أطلس"
                      className="rounded-xl border-slate-200 text-xs sm:text-sm py-2.5"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-bold text-[#073B35]">
                      العنوان التفصيلي (الشارع، رقم العمارة، علامة مميزة) <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      required
                      rows={2}
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="اكتب العنوان بالتفصيل لضمان سرعة وصول مندوب التوصيل..."
                      className="rounded-xl border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Extra Notes */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <Label className="text-xs font-bold text-[#073B35]">
                  ملاحظات إضافية بخصوص الطلب أو التوصيل (اختياري)
                </Label>
                <Input
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="مثال: يرجى الاتصال قبل الوصول / التغليف كهدية..."
                  className="rounded-xl border-slate-200 text-xs py-2.5"
                />
              </div>

            </div>

            {/* 2. Mock Payment Gateway Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0B5F55]/10 text-[#0B5F55] flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#073B35]">
                      بوابة الدفع الإلكتروني (Mock Gateway)
                    </h2>
                    <p className="text-[11px] text-[#5B6B68]">
                      بوابة دفع تجريبية مشفرة تحاكي المعاملات البنكية وتدعم انستا باي والبطاقات
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
                  🔒 256-Bit SSL Demo
                </Badge>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-50 border-[#0B5F55] text-[#073B35] shadow-xs ring-1 ring-[#0B5F55]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#0B5F55]" />
                  <span>بطاقة بنكية</span>
                  <span className="text-[10px] text-[#5B6B68] font-normal">فيزا / ماستركارد / ميزة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'instapay'
                      ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-xs ring-1 ring-purple-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                    ⚡
                  </div>
                  <span className="text-purple-900 font-extrabold">انستا باي</span>
                  <span className="text-[10px] text-purple-700/80 font-normal">InstaPay مصر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-50 border-[#0B5F55] text-[#073B35] shadow-xs ring-1 ring-[#0B5F55]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5 text-[#0B5F55]" />
                  <span>دفع عند الاستلام</span>
                  <span className="text-[10px] text-[#5B6B68] font-normal">في المقر بأسوان</span>
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  SUB-VIEW 1: HOSTED PAYMENT GATEWAY (VISA / MASTERCARD / MEEZA)
              ───────────────────────────────────────────────────────── */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#073B35] to-[#0B5F55] text-white shadow-md space-y-4 text-right">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white">بوابة الدفع الإلكتروني المصرفية (Hosted Gateway)</h4>
                          <p className="text-[11px] text-emerald-200">الدفع عبر صفحة بنكية مشفرة وآمنة بنظام 3D Secure 2.0</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                        256-Bit SSL
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      عند النقر على زر <strong>"الانتقال إلى بوابة الدفع الآمنة"</strong> أدناه، سيتم نقلك مباشرةً إلى صفحة بوابة الدفع المعتمدة المشفرة (شبيهة بصفحات Paymob وبنك مصر وStripe) لإدخال بيانات بطاقتك وتأكيد العملية برمز الأمان (OTP) البنكي.
                    </p>

                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white">VISA</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">Mastercard</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-white">ميزة Meeza</span>
                      </div>
                      <span className="text-emerald-300 font-bold text-[11px]">
                        🔒 معتمدة ومتوافقة مع المعايير المصرفية
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#073B35] text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E3A92F]" />
                      <span>المبلغ المطلوب سداده في البوابة:</span>
                    </div>
                    <span className="font-black text-sm text-[#0B5F55]">{grandTotal.toLocaleString()} ج.م</span>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUB-VIEW 2: INSTAPAY FORM
              ───────────────────────────────────────────────────────── */}
              {paymentMethod === 'instapay' && (
                <div className="space-y-5 pt-2">
                  
                  {/* InstaPay Branding Box */}
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-[#2D1B69] via-[#482880] to-[#E85D04] text-white shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-white text-[#482880] flex items-center justify-center font-black text-xs">
                          ⚡
                        </span>
                        <div>
                          <h4 className="font-black text-sm tracking-wide">بوابة الدفع اللحظي انستا باي (InstaPay)</h4>
                          <p className="text-[10px] text-purple-200">التحويل المباشر لحساب يوزرسيف بأسوان</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white text-[10px] font-bold border-none">
                        شبكة المدفوعات اللحظية IPN
                      </Badge>
                    </div>

                    {/* Account Details Copy Grid */}
                    <div className="bg-black/25 backdrop-blur-xs rounded-xl p-3.5 space-y-2.5 text-xs">
                      
                      {/* IPA Address */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <div>
                          <span className="text-[10px] text-purple-200 block">عنوان الدفع اللحظي (IPA):</span>
                          <span className="font-mono font-bold text-sm tracking-wider text-amber-300">
                            {INSTAPAY_INFO.ipa}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(INSTAPAY_INFO.ipa, 'ipa')}
                          className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1"
                        >
                          {copiedField === 'ipa' ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'ipa' ? 'تم النسخ!' : 'نسخ'}</span>
                        </button>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <div>
                          <span className="text-[10px] text-purple-200 block">رقم هاتف حساب انستا باي:</span>
                          <span className="font-mono font-bold text-sm tracking-wider text-amber-300">
                            {INSTAPAY_INFO.phone}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(INSTAPAY_INFO.phone, 'phone')}
                          className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1"
                        >
                          {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'phone' ? 'تم النسخ!' : 'نسخ'}</span>
                        </button>
                      </div>

                      {/* Bank & Name */}
                      <div className="flex items-center justify-between text-[11px] text-purple-200 pt-0.5">
                        <span>البنك: {INSTAPAY_INFO.bank}</span>
                        <span>المستفيد: {INSTAPAY_INFO.accountName}</span>
                      </div>

                    </div>

                    {/* QR Code Illustration & Steps */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-3 rounded-xl">
                      <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <QrCode className="w-full h-full text-slate-900" />
                      </div>
                      <div className="text-[11px] text-purple-100 leading-relaxed space-y-1">
                        <p className="font-bold text-white">خطوات الدفع عبر انستا باي:</p>
                        <ol className="list-decimal list-inside space-y-0.5 text-purple-200">
                          <li>افتح تطبيق InstaPay على هاتفك المحمول.</li>
                          <li>اختر "إرسال نقود" إلى عنوان IPA: <strong className="text-white font-mono">{INSTAPAY_INFO.ipa}</strong>.</li>
                          <li>حوّل مبلغ <strong>{grandTotal.toLocaleString()} ج.م</strong> واكتب الرقم المرجعي بالأسفل.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Reference Number Input */}
                  <div className="space-y-1.5 bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
                    <Label className="text-xs font-black text-purple-950 flex items-center justify-between">
                      <span>الرقم المرجعي للعملية (Reference Number) <span className="text-red-500">*</span></span>
                      <button
                        type="button"
                        onClick={() => setInstapayRef(`IPN-${Math.floor(100000000000 + Math.random() * 900000000000)}`)}
                        className="text-[10px] text-purple-700 underline font-bold cursor-pointer"
                      >
                        توليد رقم مرجعي تجريبي
                      </button>
                    </Label>
                    <Input
                      dir="ltr"
                      value={instapayRef}
                      onChange={(e) => setInstapayRef(e.target.value)}
                      placeholder="مثال: IPN-908231456201 أو الرقم المكون من 12 رقم"
                      className="rounded-xl border-purple-300 bg-white font-mono text-xs sm:text-sm py-2.5"
                    />
                    <p className="text-[10px] text-purple-800/80">
                      يظهر الرقم المرجعي في إشعار تأكيد التحويل داخل تطبيق انستا باي فور إتمام العملية.
                    </p>
                  </div>

                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUB-VIEW 3: CASH ON DELIVERY / PICKUP
              ───────────────────────────────────────────────────────── */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                  <p className="font-bold text-[#073B35] flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#0B5F55]" />
                    <span>الدفع نقداً عند استلام الطلب:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    يمكنك سداد قيمة الطلب نقداً (كاش) فور استلام الشحنة من مندوب التوصيل بأسوان أو عند الاستلام المباشر من مقر يوزرسيف.
                  </p>
                  {isHighValue && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                      ⚠️ <strong>ملاحظة هامة:</strong> نظراً لأن قيمة هذا الطلب تتجاوز 5,000 ج.م، يتطلب النظام سداد عربون مقدم للتأكيد والبدء الفعلي في الإنتاج، وسيتواصل معك المشرف لتنسيق ذلك.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              Left Column: Order Summary & Action (5 cols)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
            
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <h2 className="text-base sm:text-lg font-black text-[#073B35] border-b border-slate-100 pb-3">
                ملخص التكلفة والطلب
              </h2>

              {/* Mini Item List Preview */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/60">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img
                          src={it.customization?.previewUrl || it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-[#073B35] truncate">{it.name}</p>
                        <p className="text-[10px] text-[#5B6B68]">
                          {it.quantity} × {it.price} ج.م
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-[#073B35] shrink-0">
                      {((it.price || 0) * (it.quantity || 1)).toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-[#5B6B68]">
                  <span>مجموع المنتجات ({totalCount} قطع):</span>
                  <span className="font-bold text-[#073B35]">{subtotal.toLocaleString()} ج.م</span>
                </div>

                <div className="flex items-center justify-between text-[#5B6B68]">
                  <span>رسوم التوصيل / الشحن:</span>
                  <span className="font-bold text-[#073B35]">
                    {shippingFee === 0 ? 'مجاناً' : `${shippingFee} ج.م`}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-black text-[#073B35]">إجمالي الطلب:</span>
                    <p className="text-[10px] text-[#5B6B68]">شامل الضريبة ومصاريف الشحن</p>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-black text-[#0B5F55]">
                      {grandTotal.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-[#073B35] ms-1">ج.م</span>
                  </div>
                </div>

                {/* 50% Deposit Breakdown */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/90 space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center justify-between font-black text-amber-900">
                    <span>العربون المطلوب مقدماً (50%):</span>
                    <span className="text-sm font-black text-amber-900">{depositAmount.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-800/90">
                    <span>المتبقي عند الاستلام:</span>
                    <span className="font-bold">{remainingAmount.toLocaleString()} ج.م</span>
                  </div>
                  <p className="text-[10px] text-amber-700 pt-1 border-t border-amber-200/60 leading-tight">
                    يظهر الطلب بحالة Holding حتى رفع إيصال العربون وتأكيد الأونر.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full font-black text-sm py-4 rounded-2xl border-2 border-[#073B35] shadow-[2px_2px_0px_#073B35] hover:shadow-[4px_4px_0px_#073B35] transition-all cursor-pointer flex items-center justify-center gap-2 bg-[#E3A92F] hover:bg-[#d89c25] text-[#073B35]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>{processingStep || 'جاري معالجة الطلب...'}</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'card'
                        ? `الانتقال إلى بوابة الدفع الآمنة (${grandTotal.toLocaleString()} ج.م) ←`
                        : `تأكيد الطلب بحالة (Holding) والانتقال لرفع العربون (${depositAmount.toLocaleString()} ج.م) →`}
                    </span>
                  </>
                )}
              </Button>

              <div className="text-center pt-1">
                <Link
                  to="/cart"
                  className="text-xs font-bold text-[#5B6B68] hover:text-[#0B5F55] inline-flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة لتعديل سلة المشتريات</span>
                </Link>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
