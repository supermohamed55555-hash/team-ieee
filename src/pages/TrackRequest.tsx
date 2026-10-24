import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  XCircle,
  ShieldAlert,
  MessageCircle,
  Phone,
  Truck,
  Shirt
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { getRequestById, getOrderById } from '../lib/mock-api';
import { ServiceRequest } from '../lib/types';
import { Order } from '../lib/order-types';
import { DepositReceiptUpload } from '../components/DepositReceiptUpload';
import { formatDateAr, getStatusDetails, formatFileSize, generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';

export const TrackRequest: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryId, setQueryId] = useState(searchParams.get('id') || '');
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRequest = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setErrorMessage('');
    setSearched(true);

    try {
      // First check service requests
      const found = await getRequestById(idToSearch.trim());
      if (found) {
        setRequest(found);
        setMatchedOrder(null);
        return;
      }

      // Check store orders
      const foundOrder = await getOrderById(idToSearch.trim());
      if (foundOrder) {
        setMatchedOrder(foundOrder);
        const isPendingDeposit = foundOrder.status === 'holding' || foundOrder.status === 'pending_deposit' || (foundOrder.requiresDeposit && !foundOrder.depositPaid);
        const depositAmount = foundOrder.depositRequiredAmount || Math.round(foundOrder.total * 0.5);

        setRequest({
          id: foundOrder.id,
          customerName: foundOrder.customer.name,
          phone: foundOrder.customer.phone,
          email: foundOrder.customer.email || '',
          serviceId: 'store-order',
          serviceTitle: `طلب متجر يوزرسيف (${foundOrder.items.length} منتجات: ${foundOrder.items.map((i) => i.name).join('، ')})`,
          serviceCategory: 'clothing',
          projectBrief: `طلب متجر إلكتروني بقيمة ${foundOrder.total.toLocaleString()} ج.م. مطلوب سداد عربون 50% (${depositAmount.toLocaleString()} ج.م) لتأكيد بدء الإنتاج.`,
          quantity: foundOrder.items.reduce((s, i) => s + (i.quantity || 1), 0),
          needsDesignHelp: false,
          desiredDate: foundOrder.createdAt.split('T')[0],
          receiptPreference: foundOrder.deliveryMethod === 'pickup' ? 'aswan-pickup' : 'shipping-delivery',
          urgency: 'normal',
          budget: `${foundOrder.total} ج.م`,
          attachments: [],
          status: isPendingDeposit
            ? 'under-review'
            : foundOrder.status === 'paid'
            ? 'approved'
            : foundOrder.status === 'in_progress'
            ? 'in-progress'
            : foundOrder.status === 'ready'
            ? 'ready'
            : foundOrder.status === 'completed'
            ? 'completed'
            : 'submitted',
          createdAt: foundOrder.createdAt,
          updatedAt: foundOrder.updatedAt,
          adminNotes: isPendingDeposit
            ? foundOrder.depositReceiptUrl
              ? `📸 قام العميل برفع صورة إيصال العربون (50% = ${depositAmount.toLocaleString()} ج.م). بانتظار مراجعة وتأكيد الأونر لبدء الطباعة.`
              : `⏳ حالة الطلب: معلق (Holding) - بانتظار سداد عربون 50% (${depositAmount.toLocaleString()} ج.م) ورفع صورة الإيصال ليؤكد الأونر الطلب.`
            : foundOrder.adminNotes || 'تم استلام وتأكيد الطلب وجاري التنفيذ في ورشة أسوان.',
          nextStepText: isPendingDeposit
            ? foundOrder.depositReceiptUrl
              ? 'مراجعة وتأكيد الأونر لإيصال العربون المرفوع.'
              : 'سداد دفعة العربون 50% ورفع صورة الإيصال لتأكيد بدء خط التجهيز والطباعة.'
            : 'التجهيز والتغليف للشحن أو الاستلام بأسوان.',
        });
        return;
      }

      setRequest(null);
      setMatchedOrder(null);
      setErrorMessage(`لم يتم العثور على طلب برقم "${idToSearch.trim().toUpperCase()}". يرجى التحقق من الرقم والمحاولة مرة أخرى.`);
    } catch {
      setErrorMessage('حدث خطأ أثناء الاتصال بالنظام التجريبي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setQueryId(idParam);
      fetchRequest(idParam);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId.trim()) {
      setErrorMessage('يرجى كتابة رقم الطلب');
      return;
    }
    setSearchParams({ id: queryId.trim().toUpperCase() });
    fetchRequest(queryId);
  };

  const statusInfo = request ? getStatusDetails(request.status) : null;

  return (
    <div className="py-10 sm:py-16 space-y-12 bg-[#F8F7F3] min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl space-y-4">
        <Badge variant="demo" className="text-xs bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
          التتبع المباشر للطلبات (Live Demo Tracking)
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-[#012C2B] tracking-tight">
          تتبع مسار وحالة طلبك
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          أدخل رقم الطلب الصادر لك لمتابعة مراجعة المقاسات ومرحلة الطباعة وتاريخ التسليم المعتمد.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
          <Input
            value={queryId}
            onChange={(e) => {
              setQueryId(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="أدخل رقم الطلب (مثلاً: YZ-0001)"
            className="h-12 text-center sm:text-start text-base font-mono uppercase bg-white focus-visible:ring-[#065E5A]"
            aria-label="رقم الطلب للتتبع"
          />
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="gap-2 shrink-0 h-12 shadow-md bg-[#065E5A] hover:bg-[#012C2B] text-white"
          >
            <Search className="w-4 h-4 rtl:rotate-90" />
            <span>بحث وتتبع</span>
          </Button>
        </form>

        {/* Quick Demo Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-600">
          <span>أرقام جاهزة للتجربة السريعة:</span>
          {['ORD-5012 (طلب جملة > 5000 ج.م)', 'ORD-5011 (مدفوع بالفيزا)', 'YZ-0001', 'YZ-0002'].map((demoLabel) => {
            const demoId = demoLabel.split(' ')[0];
            return (
              <button
                key={demoId}
                type="button"
                onClick={() => {
                  setQueryId(demoId);
                  setSearchParams({ id: demoId });
                  fetchRequest(demoId);
                }}
                className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer border ${
                  demoId === 'ORD-5012'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold hover:bg-amber-100'
                    : 'bg-white hover:bg-[#065E5A]/10 hover:text-[#065E5A] text-slate-700 border-slate-300'
                }`}
              >
                {demoLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">تنبيه:</p>
              <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#065E5A] border-t-transparent" />
            <p className="text-xs text-slate-500 font-medium">جاري استرجاع تفاصيل الطلب من النظام التجريبي...</p>
          </div>
        )}

        {!loading && request && statusInfo && (
          <Card className="border-slate-200 shadow-xl overflow-hidden animate-slide-up bg-white">
            {/* Header info strip */}
            <div className="p-6 sm:p-8 bg-[#012C2B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#065E5A]/40">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#5ee7cf]">طلب رقم:</span>
                <h2 className="text-3xl font-black font-mono tracking-wider">{request.id}</h2>
                <p className="text-xs text-emerald-100/70">{request.serviceTitle}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass} animate-pulse`} />
                  {statusInfo.label}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchRequest(request.id)}
                  className="text-emerald-100 hover:text-white hover:bg-[#065E5A]/40 text-xs gap-1.5 self-start sm:self-auto p-0 sm:px-2 h-7"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>تحديث الحالة</span>
                </Button>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Direct WhatsApp Action with Prefilled Request Number (Mandated by Section 7 & Page 9) */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    استفسار مباشر عن هذا الطلب بالواتساب
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    تواصل فورياً مع فني معمل أسوان عبر رسالة تلقائية برقم الطلب: <strong className="font-mono">{request.id}</strong>
                  </p>
                </div>
                <a
                  href={generateWhatsAppLink(request.id, `أنا العميل ${request.customerName}، وأستفسر عن موعد الاستلام وتفاصيل الطلب.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-full sm:w-auto"
                >
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </Button>
                </a>
              </div>

              {/* Progress Steps (6 Stages) */}
              {request.status !== 'rejected' ? (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800">مراحل خط الإنتاج والتنفيذ</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    {[
                      { step: 1, label: 'تم التقديم' },
                      { step: 2, label: 'المراجعة الفنية' },
                      { step: 3, label: 'الاعتماد' },
                      { step: 4, label: 'قيد الطباعة' },
                      { step: 5, label: 'جاهز للاستلام' },
                    ].map((st) => {
                      const isDone = statusInfo.stepIndex >= st.step;
                      const isCurrent = statusInfo.stepIndex === st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'border-[#065E5A] bg-[#065E5A]/10 shadow-xs ring-2 ring-[#065E5A]/20'
                              : isDone
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-slate-100 bg-slate-50 opacity-50'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1 ${
                              isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                          </div>
                          <p className="text-[11px] font-bold text-slate-900 truncate">{st.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Rejection Notice Box */
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-sm">تم الاعتذار عن قبول هذا الطلب</span>
                  </div>
                  {request.rejectionReason && (
                    <div className="text-xs text-rose-800 bg-white p-3 rounded-lg border border-rose-200 leading-relaxed">
                      <span className="font-bold block mb-1">سبب الرفض المسجل من المعمل:</span>
                      {request.rejectionReason}
                    </div>
                  )}
                  <p className="text-[11px] text-rose-700">
                    يمكنك تعديل مواصفات الطلب أو مراسلتنا واتساب على {YUZERSEF_WHATSAPP} لمناقشة البدائل.
                  </p>
                </div>
              )}

              {/* Status explanation & Next Step (Mandated by Section 7 & Page 10) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800">بيان الحالة الحالي:</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{statusInfo.description}</p>
                </div>

                {request.nextStepText && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="font-bold text-[#065E5A]">الخطوة التالية المحددة من الإدارة (Next Step):</span>
                    <p className="text-slate-800 font-medium mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-200">
                      {request.nextStepText}
                    </p>
                  </div>
                )}
              </div>

              {/* STORE ORDER 50% DEPOSIT RECEIPT UPLOAD (WHEN HOLDING) */}
              {matchedOrder && (matchedOrder.status === 'holding' || (matchedOrder.requiresDeposit && !matchedOrder.depositPaid)) && (
                <div className="space-y-2">
                  <DepositReceiptUpload
                    order={matchedOrder}
                    onReceiptUploaded={(updated) => {
                      setMatchedOrder(updated);
                      fetchRequest(updated.id);
                    }}
                  />
                </div>
              )}

              {/* Admin live notes */}
              {request.adminNotes && (
                <div className="p-4 rounded-xl bg-[#065E5A]/10 border border-[#065E5A]/30 space-y-1 text-xs">
                  <span className="font-bold text-[#012C2B]">ملاحظات وتحديثات معمل أسوان:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{request.adminNotes}</p>
                </div>
              )}

              {/* Request Specifications Breakdown */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                <h3 className="font-bold text-slate-800">مواصفات الطلب المسجلة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">صاحب الطلب:</span>
                    <p className="font-semibold text-slate-800">{request.customerName}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">الكمية الإجمالية:</span>
                    <p className="font-semibold text-slate-800">{request.quantity} قطعة</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">طريقة الاستلام:</span>
                    <p className="font-semibold text-slate-800">
                      {request.receiptPreference === 'aswan-pickup' ? 'استلام من مقر يوزرسيف بأسوان' : 'شحن وتوصيل'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">تاريخ الاستلام المرغوب:</span>
                    <p className="font-mono font-semibold text-slate-800">{request.desiredDate || 'غير محدد'}</p>
                  </div>
                </div>

                {/* Clothing sizes */}
                {request.sizeBreakdown && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-1">تفصيل المقاسات واللون:</span>
                    <p className="font-mono text-slate-800 font-bold">
                      {request.clothingColor ? `اللون: ${request.clothingColor} | ` : ''}
                      S: {request.sizeBreakdown.s} • M: {request.sizeBreakdown.m} • L: {request.sizeBreakdown.l} • XL: {request.sizeBreakdown.xl} • XXL: {request.sizeBreakdown.xxl}
                    </p>
                  </div>
                )}

                {/* Phone model */}
                {request.phoneModel && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-1">موديل الهاتف المطلوب:</span>
                    <p className="font-bold text-slate-900">{request.phoneModel}</p>
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">وصف الطلب المقدم من العميل:</span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                    {request.projectBrief}
                  </div>
                </div>

                {/* Attachments list */}
                {request.attachments && request.attachments.length > 0 && (
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1.5">
                      الملفات المرفقة ({request.attachments.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {request.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono"
                        >
                          <FileText className="w-4 h-4 text-[#065E5A]" />
                          <span className="truncate max-w-[160px]">{att.name}</span>
                          <span className="text-slate-400 text-[10px]">({formatFileSize(att.size)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick admin test bridge */}
              <div className="p-3.5 rounded-xl bg-[#EFEFEA] border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-700 text-center sm:text-start">
                  هل تريد تجربة تحديث حالة هذا الطلب من لوحة تحكم المسؤول؟
                </span>
                <Link to="/admin/login" className="shrink-0">
                  <Button variant="outline" size="sm" className="text-xs border-slate-300">
                    فتح لوحة المسؤول
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};
