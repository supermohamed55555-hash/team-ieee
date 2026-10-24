import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Truck,
  CreditCard,
  Building,
  Printer,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Send,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Modal } from '../ui/modal';
import { Order, OrderStatus } from '../../lib/order-types';
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  resetDemoOrders
} from '../../lib/mock-api';
import { formatDateAr, generateWhatsAppLink } from '../../lib/utils';

export const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus | 'holding' | 'high_value'>('all');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewReceiptFull, setViewReceiptFull] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleSync = () => loadOrders();
    window.addEventListener('yuzersef-orders-updated', handleSync);
    return () => window.removeEventListener('yuzersef-orders-updated', handleSync);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open details modal
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes || '');
    setIsModalOpen(true);
  };

  // Owner Deposit Approval (Confirms deposit & starts production)
  const handleApproveDeposit = async (orderId: string) => {
    try {
      setIsUpdating(true);
      const targetOrder = orders.find((o) => o.id === orderId);
      const depAmt = targetOrder?.depositRequiredAmount || Math.round((targetOrder?.total || 0) * 0.5);

      const updated = await updateOrderStatus(
        orderId,
        'in_progress',
        `✅ تم تأكيد استلام العربون (50% = ${depAmt.toLocaleString()} ج.م) بواسطة الأونر، وبدأ خط التجهيز والطباعة في ورشة أسوان.`,
        true
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
        setAdminNotes(updated.adminNotes || '');
      }
      showToast(`تم تأكيد استلام العربون للطلب ${orderId} وتحويله لقيد التنفيذ بنجاح!`);
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة العربون.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Status from Dropdown
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      const updated = await updateOrderStatus(
        selectedOrder.id,
        newStatus,
        adminNotes.trim()
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      showToast(`تم تحديث حالة الطلب إلى "${getStatusLabel(newStatus)}" بنجاح!`);
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Save notes only
  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      const updated = await updateOrderStatus(
        selectedOrder.id,
        selectedOrder.status,
        adminNotes.trim()
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      showToast('تم حفظ ملاحظات الإدارة بنجاح!');
    } catch (err) {
      alert('حدث خطأ أثناء حفظ الملاحظات.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطلب رقم ${id} نهائياً؟`)) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setIsModalOpen(false);
      showToast(`تم حذف الطلب ${id} بنجاح.`);
    } catch (err) {
      alert('حدث خطأ أثناء حذف الطلب.');
    }
  };

  // Reset to default orders
  const handleResetOrders = async () => {
    if (!window.confirm('هل تريد استعادة بيانات الطلبات التجريبية الافتراضية؟')) return;
    try {
      const reset = await resetDemoOrders();
      setOrders(reset);
      showToast('تمت استعادة الطلبات الافتراضية بنجاح.');
    } catch (err) {
      alert('خطأ أثناء إعادة الضبط.');
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    // Status / Holding / Deposit Filter
    if (statusFilter === 'holding' || statusFilter === 'high_value') {
      const isHolding = o.status === 'holding' || o.status === 'pending_deposit' || (o.requiresDeposit && !o.depositPaid);
      if (!isHolding) return false;
    } else if (statusFilter !== 'all') {
      if (o.status !== statusFilter) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchPhone = (o.customer.phone || '').includes(q);
      const matchGov = (o.customer.governorate || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchGov;
    }

    return true;
  });

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const holdingOrders = orders.filter(
    (o) => o.status === 'holding' || o.status === 'pending_deposit' || (o.requiresDeposit && !o.depositPaid)
  );
  const pendingReceiptsCount = holdingOrders.filter((o) => Boolean(o.depositReceiptUrl)).length;
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress');

  // Helper: Status label and badge
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'holding':
        return 'معلق (Holding) - بانتظار سداد وتأكيد العربون';
      case 'pending_deposit':
        return 'معلق (Holding) - بانتظار سداد وتأكيد العربون';
      case 'pending':
        return 'قيد المراجعة';
      case 'paid':
        return 'مدفوع ومؤكد';
      case 'in_progress':
        return 'قيد التنفيذ والطباعة (مؤكد)';
      case 'shipped':
        return 'تم الشحن';
      case 'ready':
        return 'جاهز للاستلام';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusBadge = (order: Order) => {
    const isHolding = order.status === 'holding' || order.status === 'pending_deposit' || (order.requiresDeposit && !order.depositPaid);
    if (isHolding) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Holding (معلّق)</span>
          </span>
          {order.depositReceiptUrl ? (
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
              <span>📸 إيصال مرفوع</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-800/80">
              بانتظار الإيصال
            </span>
          )}
        </div>
      );
    }
    switch (order.status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>مدفوع ومؤكد</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>قيد الطباعة والتنفيذ</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>تم الشحن</span>
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1">
            <span>جاهز للتسليم بأسوان</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
            مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
            ملغي
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Toast message */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. KPI Summary Cards
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">إجمالي مبيعات المتجر</span>
          <p className="text-xl sm:text-2xl font-black text-[#0B5F55]">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-slate-700">ج.م</span>
          </p>
          <span className="text-[11px] text-slate-400">من كافة الطلبات المسجلة</span>
        </div>

        {/* Holding Orders (Awaiting 50% Deposit) */}
        <div
          onClick={() => setStatusFilter('holding')}
          className={`p-4 rounded-2xl border shadow-2xs space-y-1 cursor-pointer transition-all ${
            statusFilter === 'holding' || statusFilter === 'high_value'
              ? 'bg-amber-100/70 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">بانتظار العربون 50% (Holding)</span>
            <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-xl sm:text-2xl font-black text-amber-950">
              {holdingOrders.length}
            </p>
            {pendingReceiptsCount > 0 && (
              <span className="text-[10px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                {pendingReceiptsCount} إيصال مرفوع
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-800 font-bold block">
            بانتظار مراجعة وتأكيد الأونر
          </span>
        </div>

        {/* Paid & Confirmed */}
        <div
          onClick={() => setStatusFilter('paid')}
          className={`p-4 rounded-2xl border shadow-2xs space-y-1 cursor-pointer transition-all ${
            statusFilter === 'paid'
              ? 'bg-emerald-100/70 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-slate-500 block">طلبات مدفوعة ومؤكدة</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700">
            {paidOrders.length}
          </p>
          <span className="text-[11px] text-slate-400">جاهزة للطباعة والتجهيز</span>
        </div>

        {/* Total Orders Count */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border shadow-2xs space-y-1 cursor-pointer transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-100 border-[#065E5A] ring-2 ring-[#065E5A]/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الطلبات</span>
            <ShoppingBag className="w-4 h-4 text-[#065E5A] shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {orders.length}
          </p>
          <span className="text-[11px] text-slate-400">عرض كافة الطلبات</span>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Filter & Search Toolbar
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 rtl:rotate-90 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب (ORD-...)، العميل، الهاتف، المحافظة..."
                className="w-full h-10 rounded-xl border border-slate-200 ps-9 pe-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5F55] bg-slate-50/50"
              />
            </div>

            {/* Reset orders demo data */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetOrders}
                className="text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط طلبات الديمو</span>
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <span className="text-slate-400 text-[11px] shrink-0">تصفية:</span>

            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              الكل ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('holding')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'holding' || statusFilter === 'high_value'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                بانتظار العربون 50% ({holdingOrders.length})
                {pendingReceiptsCount > 0 && ` [${pendingReceiptsCount} إيصال]`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'paid'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              مدفوعة ومؤكدة ({paidOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'in_progress'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              قيد التنفيذ ({inProgressOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-[#0B5F55] text-white border-[#0B5F55] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              مكتملة
            </button>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. Orders Table
        ───────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">لا توجد طلبات مطابقة للمعايير المحددة.</p>
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">رقم الطلب والتاريخ</th>
                  <th className="py-3 px-4">بيانات العميل</th>
                  <th className="py-3 px-4">المنتجات المطلوبة</th>
                  <th className="py-3 px-4">طريقة الدفع</th>
                  <th className="py-3 px-4">القيمة الإجمالية</th>
                  <th className="py-3 px-4">حالة الطلب</th>
                  <th className="py-3 px-4 text-center">إجراءات الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isHolding = order.status === 'holding' || order.status === 'pending_deposit' || (order.requiresDeposit && !order.depositPaid);
                  const depAmount = order.depositRequiredAmount || Math.round(order.total * 0.5);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isHolding
                          ? 'bg-amber-50/30'
                          : ''
                      }`}
                    >
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-black text-sm text-[#0B5F55] block">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDateAr(order.createdAt)}
                        </span>
                        {isHolding && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white">
                            Holding
                          </span>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block text-xs">
                          {order.customer.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="text-slate-500 hover:text-[#0B5F55] font-mono text-[11px] flex items-center gap-1"
                            title="اتصال هاتفي"
                          >
                            <Phone className="w-3 h-3 text-[#0B5F55]" />
                            <span>{order.customer.phone}</span>
                          </a>

                          <a
                            href={generateWhatsAppLink(
                              order.customer.whatsappPhone || order.customer.phone,
                              isHolding
                                ? `مرحباً ${order.customer.name}، معك إدارة يوزرسيف لخدمات الطباعة والتطريز بأسوان. بخصوص طلبك رقم ${order.id} بقيمة ${order.total.toLocaleString()} ج.م، نود التنسيق معك بخصوص سداد دفعة العربون المطلوبة (${depAmount} ج.م) لبدء خط التجهيز والطباعة فوراً.`
                                : `مرحباً ${order.customer.name}، معك إدارة يوزرسيف بأسوان بخصوص طلبك رقم ${order.id}. نؤكد لك استلام الطلب وبدء العمل عليه.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-50 text-[#0B5F55] hover:bg-emerald-100 transition-colors"
                            title="محادثة واتساب مباشرة"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                          </a>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {order.customer.governorate} - {order.customer.city}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.items.slice(0, 3).map((it) => (
                            <div
                              key={it.id}
                              className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 p-0.5"
                              title={`${it.name} (عدد: ${it.quantity})`}
                            >
                              <img
                                src={it.customization?.previewUrl || it.imageUrl}
                                alt={it.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          {order.items.reduce((s, i) => s + (i.quantity || 1), 0)} قطعة إجمالاً
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        {order.payment.method === 'card' && (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                              <span>بطاقة بنكية</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              •••• {order.payment.cardLast4 || '4242'}
                            </span>
                          </div>
                        )}

                        {order.payment.method === 'instapay' && (
                          <div className="space-y-0.5">
                            <span className="font-bold text-purple-900 flex items-center gap-1">
                              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-black">
                                ⚡
                              </span>
                              <span>انستا باي</span>
                            </span>
                            <span className="text-[10px] text-purple-700 font-mono block truncate max-w-[120px]">
                              {order.payment.instapayRef || 'IPN-Ref'}
                            </span>
                          </div>
                        )}

                        {order.payment.method === 'cod' && (
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            <span>دفع عند الاستلام</span>
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-[#073B35] block">
                          {order.total.toLocaleString()} ج.م
                        </span>
                        {isHolding && (
                          <span className="text-[10px] font-bold text-amber-700 block">
                            (عربون 50%: {depAmount.toLocaleString()} ج.م)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Owner Confirm Deposit Action */}
                          {isHolding && (
                            <button
                              type="button"
                              onClick={() => handleApproveDeposit(order.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="تأكيد استلام العربون وتأكيد الطلب للتنفيذ والطباعة"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">تأكيد العربون</span>
                            </button>
                          )}

                          {/* WhatsApp Chat */}
                          <a
                            href={generateWhatsAppLink(
                              order.customer.whatsappPhone || order.customer.phone,
                              isHolding
                                ? `مرحباً ${order.customer.name}، معك إدارة يوزرسيف لخدمات الطباعة والتطريز بأسوان. بخصوص طلبك رقم ${order.id} بقيمة ${order.total.toLocaleString()} ج.م، نود التنسيق معك بخصوص سداد دفعة العربون المطلوبة (${depAmount.toLocaleString()} ج.م) لتأكيد بدء خط التجهيز والطباعة.`
                                : `مرحباً ${order.customer.name}، معك إدارة يوزرسيف بأسوان بخصوص طلبك رقم ${order.id}. نود إعلامك بأن طلبك مؤكد وقيد التجهيز.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="محادثة واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(order)}
                            className="p-1.5 rounded-lg bg-[#0B5F55]/10 hover:bg-[#0B5F55]/20 text-[#0B5F55] transition-colors cursor-pointer"
                            title="عرض تفاصيل الطلب والإيصال"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </Card>

      {/* ─────────────────────────────────────────────────────────────
          4. Detailed Order Modal
      ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`تفاصيل الطلب رقم: ${selectedOrder.id}`}
        >
          <div className="space-y-6 text-right max-h-[80vh] overflow-y-auto p-1" dir="rtl">
            
            {/* 50% Deposit & Receipt Review Section (Holding Logic) */}
            {(() => {
              const isHolding =
                selectedOrder.status === 'holding' ||
                selectedOrder.status === 'pending_deposit' ||
                (selectedOrder.requiresDeposit && !selectedOrder.depositPaid);
              const depAmount =
                selectedOrder.depositRequiredAmount || Math.round(selectedOrder.total * 0.5);

              return (
                <div
                  className={`p-5 rounded-2xl border-2 space-y-3.5 transition-all ${
                    selectedOrder.depositPaid
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : isHolding
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm">
                      {selectedOrder.depositPaid ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-900">تم تأكيد استلام العربون 50% وبدأ التنفيذ</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                          <span className="text-amber-900">مطلوب تحصيل وتأكيد عربون 50% (Holding)</span>
                        </>
                      )}
                    </div>
                    <Badge
                      className={`font-black text-xs ${
                        selectedOrder.depositPaid
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {selectedOrder.depositPaid ? 'Deposit Confirmed' : 'Holding'}
                    </Badge>
                  </div>

                  <p className="text-xs leading-relaxed">
                    إجمالي الطلب: <strong>{selectedOrder.total.toLocaleString()} ج.م</strong> | العربون المطلوب: <strong>{depAmount.toLocaleString()} ج.م (50%)</strong>.
                  </p>

                  {/* Customer Uploaded Receipt View */}
                  {selectedOrder.depositReceiptUrl ? (
                    <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span>📸 إيصال التحويل المرفوع من العميل:</span>
                        </span>
                        {selectedOrder.depositReceiptUploadedAt && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(selectedOrder.depositReceiptUploadedAt).toLocaleString('ar-EG')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Receipt Thumbnail */}
                        <div
                          onClick={() => setViewReceiptFull(selectedOrder.depositReceiptUrl || null)}
                          className="relative w-20 h-20 rounded-xl border-2 border-emerald-500 overflow-hidden shrink-0 cursor-pointer shadow-xs group"
                          title="انقر لتكبير الإيصال"
                        >
                          <img
                            src={selectedOrder.depositReceiptUrl}
                            alt="إيصال العربون"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          {selectedOrder.depositNotes && (
                            <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <span className="font-bold">ملاحظة العميل: </span>
                              {selectedOrder.depositNotes}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => setViewReceiptFull(selectedOrder.depositReceiptUrl || null)}
                            className="text-xs text-[#0B5F55] font-bold hover:underline cursor-pointer block"
                          >
                            عرض الإيصال بالحجم الكامل ←
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    isHolding && (
                      <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200 text-xs text-amber-900">
                        <span>⏳ لم يقم العميل برفع صورة الإيصال بعد. يمكنك التذكير به عبر واتساب أو تأكيده يدوياً في حال السداد كاش في المقر.</span>
                      </div>
                    )
                  )}

                  {/* Owner Action Buttons */}
                  {isHolding && (
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveDeposit(selectedOrder.id)}
                        disabled={isUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black gap-1.5 shadow-sm px-4"
                      >
                        <Check className="w-4 h-4" />
                        <span>تأكيد استلام العربون وتأكيد الطلب (Confirm Order)</span>
                      </Button>

                      <a
                        href={generateWhatsAppLink(
                          selectedOrder.customer.whatsappPhone || selectedOrder.customer.phone,
                          `مرحباً ${selectedOrder.customer.name}، معك إدارة يوزرسيف لخدمات الطباعة والتطريز بأسوان. بخصوص طلبك رقم ${selectedOrder.id} بقيمة ${selectedOrder.total.toLocaleString()} ج.م، نود التنسيق معك بخصوص سداد دفعة العربون المطلوبة (${depAmount.toLocaleString()} ج.م) لبدء خط التجهيز والطباعة فوراً.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 border-amber-300 text-amber-900 hover:bg-amber-100">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>مراسلة العميل عبر واتساب</span>
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Customer Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-800 border-b border-slate-200 pb-2">
                بيانات العميل وموقع التوصيل
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">اسم العميل:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">رقم الهاتف:</span>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">المحافظة والمدينة:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedOrder.customer.governorate} - {selectedOrder.customer.city}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">طريقة الاستلام:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedOrder.deliveryMethod === 'pickup'
                      ? '🏢 استلام من مقر يوزرسيف بأسوان'
                      : selectedOrder.deliveryMethod === 'aswan_delivery'
                      ? '🛵 توصيل محلي بأسوان'
                      : '🚚 شحن محافظات'}
                  </p>
                </div>
                {selectedOrder.customer.address && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">العنوان التفصيلي:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedOrder.customer.address}</p>
                  </div>
                )}
                {selectedOrder.customer.notes && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">ملاحظات العميل:</span>
                    <p className="text-slate-700 mt-0.5 bg-white p-2 rounded-lg border border-slate-200">
                      {selectedOrder.customer.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800">
                المنتجات المطلوبة ({selectedOrder.items.length}):
              </h4>

              <div className="space-y-2">
                {selectedOrder.items.map((it) => (
                  <div
                    key={it.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img
                          src={it.customization?.previewUrl || it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-slate-900">{it.name}</h5>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          {it.selectedColor && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: it.selectedColor.hex }}
                              />
                              <span>{it.selectedColor.name}</span>
                            </span>
                          )}
                          {it.selectedSize && <span>| مقاس: {it.selectedSize}</span>}
                          {it.customization?.zoneName && (
                            <span className="text-[#0B5F55] font-bold">
                              | منطقة: {it.customization.zoneName}
                            </span>
                          )}
                        </div>
                        {it.customization?.notes && (
                          <p className="text-[10px] text-slate-400">{it.customization.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="font-black text-sm text-[#0B5F55] block">
                        {((it.price || 0) * (it.quantity || 1)).toLocaleString()} ج.م
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {it.quantity} × {it.price} ج.م
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>قيمة المنتجات:</span>
                <span className="font-bold">{selectedOrder.subtotal.toLocaleString()} ج.م</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>مصاريف التوصيل:</span>
                <span className="font-bold">
                  {selectedOrder.shippingFee === 0 ? 'مجاناً' : `${selectedOrder.shippingFee} ج.م`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">إجمالي الطلب:</span>
                <span className="font-black text-base text-[#0B5F55]">
                  {selectedOrder.total.toLocaleString()} ج.م
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">طريقة الدفع:</span>
                <span className="font-bold text-slate-800">
                  {selectedOrder.payment.method === 'card'
                    ? `بطاقة بنكية (•••• ${selectedOrder.payment.cardLast4 || '4242'})`
                    : selectedOrder.payment.method === 'instapay'
                    ? `انستا باي (${selectedOrder.payment.instapayRef || 'IPN-Ref'})`
                    : 'دفع نقدي عند الاستلام'}
                </span>
              </div>
            </div>

            {/* Admin Status Change & Notes */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
              <h4 className="text-xs font-black text-slate-800">تحديث حالة الطلب وإدارة الملاحظات</h4>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 block">حالة الطلب الحالية:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  disabled={isUpdating}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B5F55] bg-white"
                >
                  <option value="holding">معلّق (Holding) - بانتظار سداد وتأكيد العربون 50%</option>
                  <option value="pending_deposit">معلق - بانتظار سداد العربون</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="paid">مدفوع ومؤكد</option>
                  <option value="in_progress">قيد التنفيذ والطباعة</option>
                  <option value="ready">جاهز للتسليم في المقر</option>
                  <option value="shipped">تم الشحن والتسليم لشركة التوصيل</option>
                  <option value="completed">مكتمل ومسلّم للعميل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 block">ملاحظات الإدارة الداخلية:</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="اكتب ملاحظات الإدارة الخاصة بهذا الطلب (مثال: تم الاتصال، تم استلام 3000 ج.م عربون على انستا باي...)"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B5F55]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  className="bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold"
                >
                  حفظ الملاحظات
                </Button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة بوليصة التجهيز</span>
                </button>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* Full Size Receipt Viewer Modal for Owner */}
      {viewReceiptFull && (
        <div
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewReceiptFull(null)}
          dir="rtl"
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <span>معاينة إيصال تحويل العربون (فحص الأونر)</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewReceiptFull(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              <img
                src={viewReceiptFull}
                alt="إيصال العربون بالحجم الكامل"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-bold">يوزرسيف أسوان - فحص الإيصال المالي</span>
              <a
                href={viewReceiptFull}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0B5F55] font-black hover:underline"
              >
                فتح الصورة في تبويب منفصل ↗
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
