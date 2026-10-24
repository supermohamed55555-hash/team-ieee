import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  LogOut,
  Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Order, OrderStatus } from '../lib/order-types';
import { getOrders, getMyOrders } from '../lib/mock-api';
import { DepositReceiptUpload } from '../components/DepositReceiptUpload';
import { formatDateAr, generateWhatsAppLink } from '../lib/utils';
import { useAuth } from '../lib/auth';

export const Account: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedOrderId = searchParams.get('id');

  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [phoneSearch, setPhoneSearch] = useState('');

  // Load user session & orders
  const loadOrdersData = async (filterPhoneOrEmail?: string) => {
    setLoading(true);
    try {
      const myOrds = await getMyOrders(filterPhoneOrEmail);
      setOrders(myOrds);

      // Auto expand highlighted order if present
      if (highlightedOrderId) {
        setExpandedOrders((prev) => ({ ...prev, [highlightedOrderId]: true }));
      }
    } catch (err) {
      console.error('Failed to load user orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email || user?.phone) {
      loadOrdersData(user.email || user.phone);
    } else {
      loadOrdersData();
    }

    // Listen to real-time order updates
    const handleOrdersUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        loadOrdersData(user?.email || user?.phone);
      }
    };

    window.addEventListener('yuzersef-orders-updated', handleOrdersUpdated);
    return () => window.removeEventListener('yuzersef-orders-updated', handleOrdersUpdated);
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper: check if order is pending / holding / requires deposit receipt
  const isOrderPending = (order: Order) =>
    order.status === 'pending' ||
    order.status === 'holding' ||
    order.status === 'pending_deposit' ||
    (order.requiresDeposit && !order.depositPaid);

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    const isPending = isOrderPending(order);
    if (activeTab === 'pending') return isPending;
    if (activeTab === 'in_progress') return order.status === 'in_progress' || order.status === 'paid' || order.status === 'ready';
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

  const pendingCount = orders.filter(isOrderPending).length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress' || o.status === 'paid' || o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#F8F7F3] py-10 sm:py-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        
        {/* Unauthenticated Alert Prompt */}
        {!isAuthenticated && (
          <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-sm sm:text-base text-amber-900">
                  لم تقم بتسجيل الدخول بعد
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  سجل دخولك الآن لعرض كافة طلباتك ومتابعة حالاتها ورفع إيصالات التحويل للطلبات قيد الانتظار (Pending).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link to="/login?redirect=/orders" className="w-full sm:w-auto">
                <Button className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold rounded-full px-5 py-2.5">
                  تسجيل الدخول / إنشاء حساب
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            1. Account Profile Header
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5F55] to-[#073B35] text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {user?.name ? user.name.slice(0, 1) : <User className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#073B35]">
                  {user?.name ? `طلبات ${user.name}` : 'صفحة طلباتي (Orders)'}
                </h1>
                <Badge variant="demo" className="text-[10px] bg-[#0B5F55]/10 text-[#0B5F55] border-[#0B5F55]/20">
                  {isAuthenticated ? 'حساب العميل' : 'عرض عام'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {user?.email || 'تابع حالة طلباتك، سدد العربون وقم برفع إيصال التحويل للطلبات قيد الانتظار (Pending).'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link to="/products">
              <Button className="bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold rounded-full px-4 py-2">
                <span>طلب منتج جديد</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={logout}
                className="text-xs font-bold rounded-full px-3 py-2 text-rose-600 border-rose-200 hover:bg-rose-50 flex items-center gap-1.5"
                title="تسجيل الخروج من الحساب"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </Button>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. Notice for Order Deposit Policy (Pending)
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-r-4 border-amber-500 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>سياسة تأكيد الطلبات ورفع إيصال التحويل في يوزرسيف أسوان</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            أي اوردر قبل ما يتأكد، يلزم سداد <strong>عربون 50%</strong> لضمان جدية الحجز وتجهيز الخامات. يظهر الطلب بحالة{' '}
            <strong className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-mono">Pending</strong>{' '}
            حتى تقوم برفع صورة إيصال التحويل (عبر انستا باي أو فودافون كاش) في قسم تفاصيل الطلب أدناه، وسيقوم الأونر بمراجعة الإيصال وتأكيد بدء الطباعة والتجهيز فوراً.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. Order Status Tabs & Filter
        ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              جميع الطلبات ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>قيد الانتظار والدفع (Pending) ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'in_progress'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>مؤكد وقيد التنفيذ ({inProgressCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              مكتملة ({completedCount})
            </button>
          </div>

          {/* Quick Phone Search / Lookup */}
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 ms-2" />
            <input
              type="text"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder="ابحث برقم الهاتف أو البريد لعرض طلباتك..."
              className="w-full text-xs bg-transparent focus:outline-none"
            />
            {phoneSearch && (
              <Button
                size="sm"
                onClick={() => loadOrdersData(phoneSearch)}
                className="bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs h-8 px-3 rounded-xl shrink-0"
              >
                بحث
              </Button>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. Orders List
        ───────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-slate-200">
            <div className="w-10 h-10 border-3 border-[#0B5F55] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">جاري تحميل سجل الطلبات...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-slate-800">لا توجد طلبات في هذا القسم</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'pending'
                  ? 'رائع! لا توجد طلبات قيد الانتظار بانتظار سداد العربون حالياً.'
                  : 'لم تقم بتقديم طلبات تطابق هذه التصفية بعد.'}
              </p>
            </div>
            <Link to="/products">
              <Button className="bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold rounded-full px-5 py-2.5">
                تصفح المنتجات وبدء طلب جديد
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isHolding = isOrderPending(order);
              const depositAmount = order.depositRequiredAmount || Math.round(order.total * 0.5);
              const isExpanded = expandedOrders[order.id] !== false; // expanded by default

              return (
                <div
                  key={order.id}
                  id={order.id}
                  className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                    isHolding
                      ? 'border-amber-300 shadow-sm'
                      : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                    isHolding ? 'bg-amber-50/40 border-amber-200/60' : 'bg-slate-50/50 border-slate-100'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-base text-[#073B35] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                          {order.id}
                        </span>

                        {/* Status Badge */}
                        {isHolding ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>قيد الانتظار (Pending) - مطلوب رفع إيصال العربون 50%</span>
                          </span>
                        ) : order.status === 'in_progress' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>مؤكد - قيد الطباعة والتنفيذ</span>
                          </span>
                        ) : order.status === 'ready' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-300">
                            جاهز للاستلام بأسوان
                          </span>
                        ) : order.status === 'shipped' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
                            تم الشحن
                          </span>
                        ) : order.status === 'completed' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>مكتمل ومسلّم</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                            {order.status}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDateAr(order.createdAt)}</span>
                        </span>
                        <span>•</span>
                        <span>{order.items.length} منتجات</span>
                        <span>•</span>
                        <span>
                          {order.deliveryMethod === 'pickup'
                            ? 'استلام من المقر'
                            : order.deliveryMethod === 'aswan_delivery'
                            ? 'توصيل محلي بأسوان'
                            : 'شحن محافظات'}
                        </span>
                      </div>
                    </div>

                    {/* Order Financials & Expand Toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left">
                        <span className="text-[11px] text-slate-400 block">إجمالي الطلب</span>
                        <span className="text-lg font-black text-[#0B5F55]">
                          {order.total.toLocaleString()} <span className="text-xs">ج.م</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition-colors cursor-pointer"
                        title={isExpanded ? 'طي التفاصيل' : 'عرض التفاصيل'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6">
                      
                      {/* ─────────────────────────────────────────────
                          HOLDING / PENDING RECEIPT UPLOAD WIDGET
                      ───────────────────────────────────────────── */}
                      {isHolding && (
                        <div className="space-y-2">
                          <DepositReceiptUpload
                            order={order}
                            onReceiptUploaded={(updated) => {
                              setOrders((prev) =>
                                prev.map((o) => (o.id === updated.id ? updated : o))
                              );
                            }}
                          />
                        </div>
                      )}

                      {/* Items List */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-800">
                          محتويات الطلب ({order.items.length}):
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                  <img
                                    src={item.customization?.previewUrl || item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className="font-bold text-slate-900">{item.name}</h5>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                    {item.selectedColor && (
                                      <span className="flex items-center gap-1">
                                        <span
                                          className="w-2 h-2 rounded-full border border-black/20"
                                          style={{ backgroundColor: item.selectedColor.hex }}
                                        />
                                        <span>{item.selectedColor.name}</span>
                                      </span>
                                    )}
                                    {item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0 ? (
                                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                        مقاسات: {Object.entries(item.sizeBreakdown).map(([sz, q]) => `${q}× ${sz}`).join(' | ')}
                                      </span>
                                    ) : (
                                      item.selectedSize && <span>| مقاس: {item.selectedSize}</span>
                                    )}
                                    <span>| الكمية: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>

                              <span className="font-black text-sm text-[#073B35] shrink-0">
                                {(item.price * item.quantity).toLocaleString()} ج.م
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer Actions */}
                      <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <Link
                          to={`/track?id=${order.id}`}
                          className="text-[#0B5F55] hover:text-[#073B35] font-bold flex items-center gap-1"
                        >
                          <span>عرض شاشة التتبع المباشر للطلب</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <a
                          href={generateWhatsAppLink(
                            undefined,
                            `مرحباً يوزرسيف أسوان، أنا العميل ${order.customer.name}. بخصوص طلبي رقم ${order.id} بقيمة ${order.total} ج.م، أود المتابعة بخصوص حالة الطلب والعربون.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold text-[#0B5F55] border-[#0B5F55]/30 hover:bg-[#0B5F55]/10 gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>تواصل مع الإدارة عبر واتساب</span>
                          </Button>
                        </a>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
