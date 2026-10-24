import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Copy,
  QrCode,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input, Label } from '../components/ui/input';
import { useCart } from '../lib/cart-store';
import { createOrder, getOrderById } from '../lib/mock-api';
import { Order, OrderPayment, CustomerDetails } from '../lib/order-types';

export const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, subtotal, clearCart } = useCart();

  // Load checkout draft from sessionStorage or localStorage
  const [draft, setDraft] = useState<any>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Gateway Session Countdown Timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Selected Tab inside Gateway: 'card' | 'instapay' | 'wallet'
  const [activeTab, setActiveTab] = useState<'card' | 'instapay' | 'wallet'>('card');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // InstaPay & Wallet Inputs
  const [instapayRef, setInstapayRef] = useState('');
  const [walletPhone, setWalletPhone] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 3D Secure OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [formError, setFormError] = useState('');

  // Language state
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Load draft data on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('yuzersef_checkout_draft');
      if (stored) {
        setDraft(JSON.parse(stored));
      } else if (items.length > 0) {
        // Fallback using live cart
        setDraft({
          customer: {
            name: 'عميل يوزرسيف',
            phone: '01012345678',
            email: 'customer@example.com',
            governorate: 'أسوان',
            city: 'مدينة أسوان',
            address: 'مقر يوزرسيف أسوان',
          },
          deliveryMethod: 'pickup',
          items,
          subtotal,
          shippingFee: 0,
          total: subtotal,
          isHighValue: subtotal > 5000,
          depositAmount: subtotal > 5000 ? Math.round(subtotal * 0.5) : 0,
        });
      } else {
        // Sample demo checkout session if opened directly
        setDraft({
          customer: {
            name: 'أحمد محمود',
            phone: '01012345678',
            email: 'ahmed.mahmoud@gmail.com',
            governorate: 'أسوان',
            city: 'حي العقاد',
            address: 'شارع أبطال التحرير',
          },
          deliveryMethod: 'aswan_delivery',
          items: [
            {
              id: 'demo-item-1',
              productId: 'prod-hoodie-oversized',
              name: 'هودي يوزرسيف أوفر سايز فاخر',
              price: 290,
              quantity: 1,
              imageUrl: '/services-cards/card-hoodie.png',
            },
          ],
          subtotal: 290,
          shippingFee: 30,
          total: 320,
          isHighValue: false,
          depositAmount: 0,
        });
      }
    } catch (e) {
      console.error('Failed to parse checkout draft', e);
    } finally {
      setLoadingDraft(false);
    }
  }, [items, subtotal]);

  // Session Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // OTP Countdown timer when modal opens
  useEffect(() => {
    let timer: any;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Detect card type
  const getCardType = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^(5078|6078)/.test(clean)) return 'meeza';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : '');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  const fillDemoCard = (type: 'visa' | 'mastercard' | 'meeza' = 'visa') => {
    if (type === 'visa') {
      setCardNumber('4000 1234 5678 9010');
    } else if (type === 'mastercard') {
      setCardNumber('5105 1051 0510 5100');
    } else {
      setCardNumber('5078 0123 4567 8901');
    }
    setCardHolder(draft?.customer?.name || 'MOHAMED AHMED');
    setCardExpiry('12/28');
    setCardCvv('789');
    setFormError('');
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Submit payment form to trigger 3D Secure OTP
  const handleInitiateCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (activeTab === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setFormError(lang === 'ar' ? 'يرجى إدخال رقم بطاقة صحيح مكون من 16 رقماً.' : 'Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardHolder.trim()) {
        setFormError(lang === 'ar' ? 'يرجى إدخال اسم حامل البطاقة.' : 'Please enter the cardholder name.');
        return;
      }
      if (cardExpiry.length < 5) {
        setFormError(lang === 'ar' ? 'يرجى إدخال تاريخ انتهاء البطاقة (MM/YY).' : 'Please enter expiry date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        setFormError(lang === 'ar' ? 'يرجى إدخال رمز الأمان CVV (3 أرقام).' : 'Please enter 3-digit CVV.');
        return;
      }

      // Open 3D Secure OTP Dialog
      setIsProcessing(true);
      setProcessStatus(lang === 'ar' ? 'جاري الاتصال بالبنك المصدر للبطاقة...' : 'Connecting to Issuer Bank...');
      setTimeout(() => {
        setIsProcessing(false);
        setProcessStatus('');
        setOtpTimer(60);
        setOtpCode('');
        setShowOtpModal(true);
      }, 900);

    } else if (activeTab === 'instapay') {
      if (!instapayRef.trim()) {
        setFormError(lang === 'ar' ? 'يرجى إدخال الرقم المرجعي للتحويل من تطبيق انستا باي.' : 'Please enter the InstaPay transfer reference number.');
        return;
      }
      executeOrderFinalization('instapay', instapayRef.trim());
    } else if (activeTab === 'wallet') {
      if (!walletPhone.trim() || walletPhone.length < 10) {
        setFormError(lang === 'ar' ? 'يرجى إدخال رقم المحفظة الإلكترونية (فودافون كاش، أورنج، وي...)' : 'Please enter a valid mobile wallet number.');
        return;
      }
      executeOrderFinalization('cod', `WALLET-${walletPhone}`);
    }
  };

  // Confirm 3D Secure OTP & complete order
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setOtpError(lang === 'ar' ? 'يرجى إدخال رمز التحقق (OTP) المكون من 6 أرقام.' : 'Please enter the 6-digit OTP.');
      return;
    }

    setOtpError('');
    setIsVerifyingOtp(true);

    try {
      await new Promise((r) => setTimeout(r, 1100)); // Simulated 3D Secure auth
      setShowOtpModal(false);
      executeOrderFinalization('card', `TXN-3DS-${Date.now().toString().slice(-6)}`);
    } catch (e) {
      setOtpError(lang === 'ar' ? 'فشل التحقق من الرمز، يرجى المحاولة مرة أخرى.' : 'OTP verification failed, please try again.');
      setIsVerifyingOtp(false);
    }
  };

  // Create order in backend and redirect to confirmation
  const executeOrderFinalization = async (method: 'card' | 'instapay' | 'cod', refNumber: string) => {
    setIsProcessing(true);
    setProcessStatus(lang === 'ar' ? 'تم توثيق العملية البنكية! جاري إصدار إيصال الطلب...' : 'Transaction Authorized! Generating Order...');

    try {
      const orderTotal = Number(draft?.total || subtotal || 320);
      const depositRequiredAmount = Math.round(orderTotal * 0.5);

      const paymentData: OrderPayment = {
        method,
        status: 'deposit_pending',
        transactionRef: refNumber,
        cardLast4: method === 'card' ? cardNumber.replace(/\s+/g, '').slice(-4) : undefined,
        cardHolder: method === 'card' ? cardHolder : undefined,
        instapayAccount: method === 'instapay' ? 'yuzersef@instapay' : undefined,
        instapayRef: method === 'instapay' ? refNumber : undefined,
        paidAmount: 0,
        depositAmount: depositRequiredAmount,
      };

      const finalOrder = await createOrder({
        customer: draft?.customer || {
          name: 'عميل يوزرسيف',
          phone: '01012345678',
          email: 'customer@yuzersef.com',
          governorate: 'أسوان',
          city: 'أسوان',
          address: 'مقر يوزرسيف بأسوان',
        },
        items: draft?.items && draft.items.length > 0 ? draft.items : items,
        subtotal: Number(draft?.subtotal || subtotal || 290),
        shippingFee: Number(draft?.shippingFee || 30),
        deliveryMethod: draft?.deliveryMethod || 'aswan_delivery',
        total: orderTotal,
        payment: paymentData,
      });

      // Clear draft & cart
      sessionStorage.removeItem('yuzersef_checkout_draft');
      clearCart();

      // Redirect back to /order with completed ID
      navigate(`/order?completed=true&id=${finalOrder.id}`, { replace: true });
    } catch (err: any) {
      console.error('Final order execution error', err);
      setIsProcessing(false);
      setFormError(lang === 'ar' ? 'حدث خطأ أثناء حفظ المعاملة، يرجى المحاولة ثانية.' : 'Error finalizing order.');
    }
  };

  const totalAmount = Number(draft?.total || subtotal || 320);
  const isHighValue = totalAmount > 5000;
  const depositAmount = isHighValue ? Math.round(totalAmount * 0.5) : 0;

  return (
    <div
      className={`min-h-screen bg-[#F1F5F9] font-sans antialiased text-slate-800 py-6 sm:py-10 px-4 flex flex-col justify-between`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Gateway Global Header Bar (Hosted Paymob / MPGS Style)
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto w-full space-y-4">
        
        {/* Top Utility Nav */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Lock className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-700">
              {lang === 'ar' ? 'بوابة الدفع الإلكتروني المعتمدة (Hosted Gateway)' : 'Secure 256-bit Hosted Gateway'}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">PCI-DSS Level 1</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Session Timer */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-xs font-bold text-[#0B5F55] hover:underline cursor-pointer"
            >
              {lang === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. Main Gateway Container
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Right Column: Payment Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 order-2 lg:order-1">
            
            {/* Method Tabs */}
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-800">
                {lang === 'ar' ? 'اختر وسيلة الدفع الإلكتروني:' : 'Select Payment Method:'}
              </Label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'بطاقة بنكية' : 'Credit Card'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('instapay')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'instapay'
                      ? 'bg-[#2D1B69] text-white border-[#2D1B69] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-[#2D1B69] flex items-center justify-center text-[11px] font-black">
                    ⚡
                  </div>
                  <span>{lang === 'ar' ? 'انستا باي' : 'InstaPay'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wallet')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'wallet'
                      ? 'bg-red-700 text-white border-red-700 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'محافظ إلكترونية' : 'Mobile Wallet'}</span>
                </button>
              </div>
            </div>

            {/* Form Error Notice */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                VIEW 1: CREDIT / DEBIT CARD
            ───────────────────────────────────────────────────────── */}
            {activeTab === 'card' && (
              <form onSubmit={handleInitiateCardPayment} className="space-y-4">
                
                {/* Accepted Network Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white">VISA</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">Mastercard</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-white">ميزة Meeza</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => fillDemoCard('visa')}
                      className="text-[#0B5F55] font-bold underline cursor-pointer hover:text-emerald-900"
                    >
                      {lang === 'ar' ? 'تعبئة بطاقة فيزا تجريبية' : 'Fill Demo Visa'}
                    </button>
                  </div>
                </div>

                {/* Card Number Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 font-bold">
                    {lang === 'ar' ? 'رقم البطاقة (16 رقماً)' : 'Card Number'}
                  </Label>
                  <div className="relative">
                    <Input
                      required
                      dir="ltr"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000 1234 5678 9010"
                      className="rounded-xl border-slate-300 bg-slate-50/50 font-mono text-sm sm:text-base py-3 ps-3 pe-12 tracking-wider"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none">
                      {getCardType(cardNumber) === 'visa' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white">VISA</span>
                      )}
                      {getCardType(cardNumber) === 'mastercard' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">MC</span>
                      )}
                      {getCardType(cardNumber) === 'meeza' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-white">ميزة</span>
                      )}
                      {getCardType(cardNumber) === 'generic' && (
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 font-bold">
                    {lang === 'ar' ? 'الاسم المدون على البطاقة' : 'Cardholder Name'}
                  </Label>
                  <Input
                    required
                    dir="ltr"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="MOHAMED AHMED"
                    className="rounded-xl border-slate-300 bg-slate-50/50 uppercase text-xs sm:text-sm py-2.5 font-medium"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-700 font-bold">
                      {lang === 'ar' ? 'تاريخ الانتهاء' : 'Expires (MM/YY)'}
                    </Label>
                    <Input
                      required
                      dir="ltr"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="rounded-xl border-slate-300 bg-slate-50/50 font-mono text-center text-sm py-2.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-700 font-bold flex items-center justify-between">
                      <span>CVV / CVC</span>
                      <span className="text-[10px] text-slate-400">3 {lang === 'ar' ? 'أرقام بالخلف' : 'digits'}</span>
                    </Label>
                    <Input
                      required
                      dir="ltr"
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      className="rounded-xl border-slate-300 bg-slate-50/50 font-mono text-center text-sm py-2.5"
                    />
                  </div>
                </div>

                {/* Save card option */}
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    id="saveCardCheck"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="rounded text-emerald-600 accent-[#0B5F55]"
                  />
                  <label htmlFor="saveCardCheck" className="cursor-pointer select-none">
                    {lang === 'ar' ? 'حفظ بيانات البطاقة بأمان للدفع السريع لاحقاً' : 'Save card securely for future purchases'}
                  </label>
                </div>

                {/* Action Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-sm sm:text-base py-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{processStatus || (lang === 'ar' ? 'جاري التحقق...' : 'Processing...')}</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {lang === 'ar'
                          ? `ادفع الآن (${totalAmount.toLocaleString()} ج.م)`
                          : `Pay Now (EGP ${totalAmount.toLocaleString()})`}
                      </span>
                    </>
                  )}
                </Button>

              </form>
            )}

            {/* ─────────────────────────────────────────────────────────
                VIEW 2: INSTAPAY
            ───────────────────────────────────────────────────────── */}
            {activeTab === 'instapay' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2D1B69] via-[#482880] to-[#E85D04] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white text-[#482880] flex items-center justify-center font-black text-xs">
                        ⚡
                      </span>
                      <span className="font-black text-xs sm:text-sm">شبكة المدفوعات اللحظية InstaPay</span>
                    </div>
                    <Badge className="bg-white/20 text-white text-[10px] font-bold border-none">IPN مصر</Badge>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] text-purple-200 block">عنوان الدفع اللحظي (IPA):</span>
                        <span className="font-mono font-bold text-amber-300">yuzersef@instapay</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('yuzersef@instapay', 'ipa')}
                        className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'ipa' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'ipa' ? 'تم' : 'نسخ'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-purple-200 block">رقم الهاتف المرتبط:</span>
                        <span className="font-mono font-bold text-amber-300">01119565506</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('01119565506', 'phone')}
                        className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'phone' ? 'تم' : 'نسخ'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 font-bold flex items-center justify-between">
                    <span>{lang === 'ar' ? 'الرقم المرجعي من تطبيق انستا باي (Reference No.):' : 'Transaction Reference Number:'}</span>
                    <button
                      type="button"
                      onClick={() => setInstapayRef(`IPN-${Math.floor(100000000000 + Math.random() * 900000000000)}`)}
                      className="text-[10px] text-purple-700 underline font-bold cursor-pointer"
                    >
                      {lang === 'ar' ? 'توليد رقم تجريبي' : 'Generate Test Ref'}
                    </button>
                  </Label>
                  <Input
                    dir="ltr"
                    value={instapayRef}
                    onChange={(e) => setInstapayRef(e.target.value)}
                    placeholder="مثال: IPN-894210452391"
                    className="font-mono text-sm py-2.5 rounded-xl border-slate-300"
                  />
                </div>

                <Button
                  onClick={handleInitiateCardPayment}
                  disabled={isProcessing}
                  className="w-full bg-[#2D1B69] hover:bg-[#20134d] text-white font-black text-sm sm:text-base py-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? `تأكيد التحويل عبر انستا باي (${totalAmount.toLocaleString()} ج.م)`
                      : `Confirm InstaPay Transfer (EGP ${totalAmount.toLocaleString()})`}
                  </span>
                </Button>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                VIEW 3: MOBILE WALLET
            ───────────────────────────────────────────────────────── */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-2 text-xs">
                  <p className="font-bold">
                    {lang === 'ar' ? 'الدفع عبر المحافظ الإلكترونية الذكية:' : 'Mobile Wallets Payment:'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {lang === 'ar'
                      ? 'يدعم فودافون كاش، اتصالات كاش، أورنج كاش، ومحفظة وي. أدخل رقم هاتفك المسجل لاستلام طلب الدفع.'
                      : 'Supports Vodafone Cash, Orange, Etisalat, and WE Pay.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 font-bold">
                    {lang === 'ar' ? 'رقم الهاتف المسجل بالمحفظة (11 رقماً):' : 'Registered Wallet Number:'}
                  </Label>
                  <Input
                    dir="ltr"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="01012345678"
                    className="font-mono text-sm py-2.5 rounded-xl border-slate-300 text-right"
                  />
                </div>

                <Button
                  onClick={handleInitiateCardPayment}
                  disabled={isProcessing}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-black text-sm sm:text-base py-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? `إرسال طلب الدفع للمحفظة (${totalAmount.toLocaleString()} ج.م)`
                      : `Request Wallet Payment (EGP ${totalAmount.toLocaleString()})`}
                  </span>
                </Button>
              </div>
            )}

            {/* Cancel & Return */}
            <div className="pt-2 text-center">
              <Link
                to="/order"
                className="text-xs text-slate-500 hover:text-slate-800 font-bold inline-flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{lang === 'ar' ? 'إلغاء والعودة لصفحة الطلب والتوصيل' : 'Cancel and return to checkout'}</span>
              </Link>
            </div>

          </div>

          {/* Left Column: Merchant Summary & Order Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 space-y-6 order-1 lg:order-2 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Merchant Branding */}
              <div className="space-y-2 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">
                    YZ
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-wide text-white">
                      يوزرسيف أسوان
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Yuzersef Apparel & Printing Co.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Merchant ID: MID-89410-EG</span>
                  <span className="text-emerald-400 font-bold">● Active Gateway</span>
                </div>
              </div>

              {/* Amount to Pay Display */}
              <div className="bg-slate-800/80 rounded-2xl p-4 space-y-1 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'المبلغ الإجمالي المطلوب سداده:' : 'Total Amount Due:'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {totalAmount.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-300">
                    {lang === 'ar' ? 'جنيه مصري (EGP)' : 'EGP'}
                  </span>
                </div>
                {isHighValue && (
                  <p className="text-[11px] text-amber-400 pt-1 font-bold">
                    ⚠️ {lang === 'ar' ? `طلب جملة يتطلب عربون (${depositAmount.toLocaleString()} ج.م)` : `Requires Deposit (EGP ${depositAmount.toLocaleString()})`}
                  </p>
                )}
              </div>

              {/* Order Info & Customer */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'العميل:' : 'Customer:'}</span>
                  <span className="font-bold text-white">{draft?.customer?.name || 'عميل تجريبي'}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                  <span className="font-mono text-white">{draft?.customer?.phone || '01012345678'}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">{lang === 'ar' ? 'المدينة:' : 'Location:'}</span>
                  <span className="text-white">{draft?.customer?.governorate || 'أسوان'}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">{lang === 'ar' ? 'عدد العناصر:' : 'Items Count:'}</span>
                  <span className="font-bold text-emerald-400">
                    {draft?.items?.length || items.length || 1} {lang === 'ar' ? 'منتجات' : 'items'}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Trust Credentials */}
            <div className="pt-6 border-t border-slate-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-3 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold">
                  {lang === 'ar' ? 'معاملة بنكية مشفرة وآمنة بنسبة 100%' : '100% Encrypted & Certified Gateway'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Compliant with Central Bank of Egypt (CBE) e-payment regulatory framework.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Realistic 3D Secure OTP Modal Simulation
      ───────────────────────────────────────────────────────────── */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-5 text-right">
            
            {/* Bank Header */}
            <div className="bg-[#052925] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-amber-300">
                  🏦
                </div>
                <div>
                  <h4 className="font-black text-sm">البنك الأهلي المصري / بنك مصر</h4>
                  <p className="text-[10px] text-emerald-200">خدمة التحقق الأمني المالي (3D Secure 2.0)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black">
                Verified by VISA
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4 pt-0">
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="font-bold text-slate-900 text-sm">
                  تأكيد إتمام المعاملة المالية:
                </p>
                <p className="leading-relaxed">
                  تم إرسال رمز الأمان لمرة واحدة (One-Time Password) في رسالة نصية قصيرة SMS إلى هاتفك المسجل لدى البنك:
                </p>
                <p className="font-mono font-black text-slate-800 text-sm">
                  010*****{draft?.customer?.phone ? draft.customer.phone.slice(-3) : '432'}
                </p>
              </div>

              {/* Transaction details in OTP dialog */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>التاجر:</span>
                  <span className="font-bold text-slate-900">Yuzersef Aswan (يوزرسيف)</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>المبلغ:</span>
                  <span className="font-black text-[#0B5F55] text-sm">{totalAmount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>البطاقة:</span>
                  <span className="font-mono text-slate-800">•••• {cardNumber.replace(/\s+/g, '').slice(-4) || '9010'}</span>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-800">رمز التحقق (OTP):</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode('654321');
                      setOtpError('');
                    }}
                    className="text-[11px] font-bold text-[#0B5F55] hover:underline cursor-pointer"
                  >
                    ⚡ إدخال كود الاختبار تلقائياً (654321)
                  </button>
                </div>

                <Input
                  dir="ltr"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="654321"
                  className="h-12 text-center text-xl font-mono tracking-widest font-black rounded-xl border-slate-300 focus-visible:ring-[#0B5F55]"
                />

                {otpError && (
                  <p className="text-xs text-rose-600 font-bold">{otpError}</p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    إعادة إرسال الرمز خلال: <strong className="text-slate-700 font-mono">{otpTimer}s</strong>
                  </span>
                  {otpTimer === 0 && (
                    <button
                      type="button"
                      onClick={() => setOtpTimer(60)}
                      className="text-[#0B5F55] font-bold underline cursor-pointer"
                    >
                      إعادة الإرسال الآن
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="flex-1 bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-sm py-3 rounded-xl shadow-md cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري التوثيق مع البنك...</span>
                    </div>
                  ) : (
                    <span>تأكيد المعاملة وإتمام الدفع</span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowOtpModal(false)}
                  disabled={isVerifyingOtp}
                  className="border-slate-300 text-slate-700 text-xs py-3 rounded-xl"
                >
                  إلغاء
                </Button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="text-center text-[11px] text-slate-400 pt-6">
        <span>© {new Date().getFullYear()} YUZERSEF Aswan. Protected by Bank-Grade 256-bit Encryption.</span>
      </footer>

    </div>
  );
};
