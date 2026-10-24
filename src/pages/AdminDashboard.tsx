import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageCircle,
  Shirt,
  Smartphone,
  Tag,
  Truck,
  Package,
  Share2,
  BarChart3,
  Percent,
  HelpCircle,
  Bell,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input, Textarea, Label } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { BrandLogo } from '../components/BrandLogo';
import { ProductManagement } from '../components/admin/ProductManagement';
import { SocialSettings } from '../components/admin/SocialSettings';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { CouponsManagement } from '../components/admin/CouponsManagement';
import { FaqPoliciesManagement } from '../components/admin/FaqPoliciesManagement';
import { PromoPopupSettings } from '../components/admin/PromoPopupSettings';
import { OrdersManagement } from '../components/admin/OrdersManagement';
import {
  getCurrentAdmin,
  logoutAdmin,
  getRequests,
  getOrders,
  updateRequestStatus,
  resetDemoData,
  getServices,
  getCatalogProducts
} from '../lib/mock-api';
import { ServiceRequest, RequestStatus, AdminUser } from '../lib/types';
import { formatDateAr, getStatusDetails, formatFileSize, generateWhatsAppLink } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [admin] = useState<AdminUser | null>(() => getCurrentAdmin());

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | RequestStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected request for details modal / actions
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states inside modal
  const [editingNotes, setEditingNotes] = useState('');
  const [editingNextStep, setEditingNextStep] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Main Dashboard Views / Tabs
  type MainAdminTab =
    | 'orders'
    | 'requests'
    | 'products'
    | 'analytics'
    | 'coupons'
    | 'faqs-policies'
    | 'promo-popup'
    | 'social-settings';

  const validTabs: MainAdminTab[] = [
    'orders',
    'requests',
    'products',
    'analytics',
    'coupons',
    'faqs-policies',
    'promo-popup',
    'social-settings',
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') as MainAdminTab | null;
  const initialTab = rawTab && validTabs.includes(rawTab) ? rawTab : 'orders';
  const [activeMainTab, setActiveMainTab] = useState<MainAdminTab>(initialTab);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [pendingDepositCount, setPendingDepositCount] = useState<number>(0);
  const [globalNotice, setGlobalNotice] = useState<string>('');

  const handleTabChange = (tab: MainAdminTab) => {
    if (tab === activeMainTab) return;
    setActiveMainTab(tab);
    setSearchParams({ tab });
  };

  // Check auth
  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  const loadRequests = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch {
      alert('خطأ في تحميل بيانات الطلبات.');
    } finally {
      setLoading(false);
    }
  };

  const loadProductsCount = async () => {
    try {
      const prods = await getCatalogProducts();
      setProductsCount(prods.length);
    } catch {
      // ignore
    }
  };

  const loadOrdersCount = async () => {
    try {
      const ords = await getOrders();
      setOrdersCount(ords.length);
      const pendingDep = ords.filter((o) => o.status === 'holding' || o.status === 'pending_deposit' || (o.requiresDeposit && !o.depositPaid)).length;
      setPendingDepositCount(pendingDep);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!admin) return;

    loadRequests(true);
    loadProductsCount();
    loadOrdersCount();

    const handleProductsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProductsCount(e.detail.length);
      }
    };

    const handleOrdersUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setOrdersCount(e.detail.length);
        const pendingDep = e.detail.filter((o: any) => o.status === 'holding' || o.status === 'pending_deposit' || (o.requiresDeposit && !o.depositPaid)).length;
        setPendingDepositCount(pendingDep);
      }
    };

    window.addEventListener('yuzersef-products-updated', handleProductsUpdated);
    window.addEventListener('yuzersef-orders-updated', handleOrdersUpdated);
    return () => {
      window.removeEventListener('yuzersef-products-updated', handleProductsUpdated);
      window.removeEventListener('yuzersef-orders-updated', handleOrdersUpdated);
    };
  }, [admin]);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tab = searchParams.get('tab') as MainAdminTab | null;
    if (tab && validTabs.includes(tab) && tab !== activeMainTab) {
      setActiveMainTab(tab);
    }
  }, [searchParams, activeMainTab]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط البيانات التجريبية (Demo Data)؟')) {
      resetDemoData();
      loadRequests();
      if (isModalOpen) setIsModalOpen(false);
    }
  };

  const openDetails = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setEditingNotes(req.adminNotes || '');
    setEditingNextStep(req.nextStepText || '');
    setRejectionReason(req.rejectionReason || '');
    setActionSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    setIsUpdating(true);
    try {
      const updated = await updateRequestStatus(
        selectedRequest.id,
        newStatus,
        editingNotes.trim(),
        newStatus === 'rejected' ? rejectionReason.trim() : undefined,
        editingNextStep.trim() || undefined
      );

      // Update list immediately on screen
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRequest(updated);
      setActionSuccessMsg(`تم تحديث حالة الطلب إلى "${getStatusDetails(newStatus).label}" بنجاح!`);
    } catch {
      alert('حدث خطأ أثناء تحديث الحالة.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotesOnly = async () => {
    if (!selectedRequest) return;
    setIsUpdating(true);
    try {
      const updated = await updateRequestStatus(
        selectedRequest.id,
        selectedRequest.status,
        editingNotes.trim(),
        selectedRequest.rejectionReason,
        editingNextStep.trim()
      );
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRequest(updated);
      setActionSuccessMsg('تم حفظ الملاحظات وتوجيهات الخطوة التالية بنجاح!');
    } catch {
      alert('حدث خطأ أثناء حفظ التحديثات.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  // Count stats
  const stats = {
    total: requests.length,
    submitted: requests.filter((r) => r.status === 'submitted').length,
    underReview: requests.filter((r) => r.status === 'under-review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    ready: requests.filter((r) => r.status === 'ready').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="py-8 sm:py-12 space-y-8 bg-[#F8F7F3] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <BrandLogo variant="square-icon" className="w-12 h-12 rounded-xl shrink-0 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">لوحة تحكم يوزرسيف (Demo Dashboard)</h1>
                <Badge variant="demo" className="text-[10px] bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
                  مدير النظام (Demo)
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                مرحباً بك، <strong className="text-slate-800">{admin.name}</strong> • فحص واعتماد طلبات الطباعة وتحديث الحالات الحية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              className="text-xs gap-1.5 text-slate-600 hover:text-rose-600 border-slate-300"
              title="إعادة تعيين البيانات للوضع الافتراضي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط البيانات</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs gap-1.5 text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </Button>
          </div>
        </div>

        {/* Global Notice Banner */}
        {globalNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{globalNotice}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
          {/* Tab 0: Orders & Payments */}
          <button
            type="button"
            onClick={() => handleTabChange('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'orders'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>طلبات المتجر والمبيعات</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeMainTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {ordersCount}
            </span>
            {pendingDepositCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{pendingDepositCount} مطلوب عربون</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('requests')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'requests'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>طلبات التخصيص</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeMainTab === 'requests' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {requests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('products')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'products'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>كتالوج المنتجات والمخزون</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeMainTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {productsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'analytics'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>إحصائيات المعمل</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('coupons')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'coupons'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>كوبونات الخصم</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('faqs-policies')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'faqs-policies'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة والسياسات</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('promo-popup')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'promo-popup'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>البوب أب الترويجي</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('social-settings')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMainTab === 'social-settings'
                ? 'bg-[#065E5A] text-white shadow-sm ring-1 ring-[#065E5A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>السوشيال ميديا</span>
          </button>
        </div>

        {/* Tab 0: Orders & Payments Management */}
        {activeMainTab === 'orders' && <OrdersManagement />}

        {/* Tab 1: Requests Management */}
        {activeMainTab === 'requests' && (
          <>
            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {[
            { id: 'all', label: 'الكل', count: stats.total, color: 'text-slate-900', border: 'border-slate-300' },
            { id: 'submitted', label: 'تم التقديم', count: stats.submitted, color: 'text-slate-700', border: 'border-slate-300' },
            { id: 'under-review', label: 'قيد المراجعة', count: stats.underReview, color: 'text-amber-700', border: 'border-amber-300' },
            { id: 'approved', label: 'معتمد', count: stats.approved, color: 'text-teal-700', border: 'border-teal-300' },
            { id: 'in-progress', label: 'قيد الطباعة', count: stats.inProgress, color: 'text-[#065E5A]', border: 'border-[#065E5A]' },
            { id: 'ready', label: 'جاهز للتسليم', count: stats.ready, color: 'text-emerald-700', border: 'border-emerald-300' },
            { id: 'rejected', label: 'مرفوض', count: stats.rejected, color: 'text-rose-700', border: 'border-rose-300' },
          ].map((kpi) => (
            <div
              key={kpi.id}
              onClick={() => setActiveFilter(kpi.id as any)}
              className={`p-3 rounded-xl border bg-white cursor-pointer transition-all text-center ${
                activeFilter === kpi.id
                  ? 'border-[#065E5A] ring-2 ring-[#065E5A]/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] text-slate-500 font-semibold block truncate">{kpi.label}</span>
              <p className={`text-xl font-black mt-0.5 ${kpi.color}`}>{kpi.count}</p>
            </div>
          ))}
        </div>

        {/* Requests Management Table Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 rtl:rotate-90 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب أو العميل أو الهاتف..."
                className="w-full h-10 rounded-lg border border-slate-200 ps-9 pe-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A] bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'all', label: 'الكل' },
                  { id: 'submitted', label: 'جديد' },
                  { id: 'under-review', label: 'مراجعة' },
                  { id: 'approved', label: 'معتمد' },
                  { id: 'in-progress', label: 'تنفيذ' },
                  { id: 'ready', label: 'جاهز' },
                  { id: 'rejected', label: 'مرفوض' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#012C2B] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => loadRequests(false)}
                disabled={loading}
                title="تحديث الطلبات"
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer shrink-0 ms-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#065E5A]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">جاري تحميل الطلبات...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm">لا توجد طلبات مطابقة لهذا البحث أو الفلتر.</p>
              </div>
            ) : (
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-4 text-start">رقم الطلب</th>
                    <th className="py-3 px-4 text-start">العميل</th>
                    <th className="py-3 px-4 text-start">الخدمة</th>
                    <th className="py-3 px-4 text-start">الكمية</th>
                    <th className="py-3 px-4 text-start">طريقة الاستلام</th>
                    <th className="py-3 px-4 text-start">الحالة</th>
                    <th className="py-3 px-4 text-start">تاريخ الإرسال</th>
                    <th className="py-3 px-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRequests.map((req) => {
                    const statusDetail = getStatusDetails(req.status);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#065E5A]">
                          {req.id}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{req.customerName}</p>
                          <p className="text-[11px] text-slate-400 font-mono" dir="ltr">{req.phone}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-[170px] truncate">
                          {req.serviceTitle}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {req.quantity} قطعة
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {req.receiptPreference === 'aswan-pickup' ? 'مقر أسوان' : 'شحن'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${statusDetail.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDetail.dotClass}`} />
                            {statusDetail.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {formatDateAr(req.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1 border-slate-300"
                              onClick={() => openDetails(req)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>مراجعة</span>
                            </Button>

                            <Link to={`/track?id=${req.id}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-[#065E5A]"
                                title="معاينة في شاشة التتبع العامة"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
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
      </>
    )}

    {/* Tab 2: Products & Catalog Management */}
    {activeMainTab === 'products' && (
      <ProductManagement
        onNotification={(msg) => {
          setGlobalNotice(msg);
          setTimeout(() => setGlobalNotice(''), 4000);
        }}
        onCountChange={(count) => setProductsCount(count)}
      />
    )}

    {/* Tab 3: Analytics & Workshop Insights */}
    {activeMainTab === 'analytics' && <AnalyticsDashboard />}

    {/* Tab 4: Coupons & Discounts Engine */}
    {activeMainTab === 'coupons' && (
      <CouponsManagement
        onNotification={(msg) => {
          setGlobalNotice(msg);
          setTimeout(() => setGlobalNotice(''), 4000);
        }}
      />
    )}

    {/* Tab 5: FAQ & Workshop Policies */}
    {activeMainTab === 'faqs-policies' && (
      <FaqPoliciesManagement
        onNotification={(msg) => {
          setGlobalNotice(msg);
          setTimeout(() => setGlobalNotice(''), 4000);
        }}
      />
    )}

    {/* Tab 6: Promotional Popups & Banners */}
    {activeMainTab === 'promo-popup' && (
      <PromoPopupSettings
        onNotification={(msg) => {
          setGlobalNotice(msg);
          setTimeout(() => setGlobalNotice(''), 4000);
        }}
      />
    )}

    {/* Tab 7: Social Media & Channel Settings */}
    {activeMainTab === 'social-settings' && (
      <SocialSettings
        onNotification={(msg) => {
          setGlobalNotice(msg);
          setTimeout(() => setGlobalNotice(''), 4000);
        }}
      />
    )}
  </div>

      {/* ACTION & DETAILS MODAL */}
      {selectedRequest && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`إدارة وفحص الطلب (${selectedRequest.id})`}
          description={selectedRequest.serviceTitle}
          className="max-w-2xl bg-white"
        >
          <div className="space-y-5 pt-1">
            {/* Success notification */}
            {actionSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Current status display + Live Track link */}
            <div className="p-3.5 rounded-xl bg-[#EFEFEA] border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">الحالة الحالية:</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {getStatusDetails(selectedRequest.status).label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/20${selectedRequest.phone.replace(/^0+/, '')}?text=${encodeURIComponent(
                    `مرحباً ${selectedRequest.customerName}، معك فريق يوزرسيف بخصوص طلبك التجريبي رقم [${selectedRequest.id}].`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مراسلة واتساب العميل</span>
                </a>
                <Link
                  to={`/track?id=${selectedRequest.id}`}
                  target="_blank"
                  className="text-xs text-[#065E5A] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>صفحة التتبع</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Client & Specs details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400">العميل:</span>
                <p className="font-bold text-slate-900">{selectedRequest.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">الهاتف والبريد:</span>
                <p className="font-mono text-slate-800" dir="ltr">{selectedRequest.phone}</p>
                <p className="font-mono text-slate-500" dir="ltr">{selectedRequest.email}</p>
              </div>
              <div>
                <span className="text-slate-400">الكمية والميزانية:</span>
                <p className="font-semibold text-slate-900">
                  {selectedRequest.quantity} قطعة • {selectedRequest.budget || 'غير محدد'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">تاريخ الاستلام المرغوب:</span>
                <p className="font-mono font-semibold text-slate-900">
                  {selectedRequest.desiredDate || 'غير محدد'} ({selectedRequest.receiptPreference === 'aswan-pickup' ? 'استلام مقر أسوان' : 'شحن'})
                </p>
              </div>
            </div>

            {/* Clothing sizes check if applicable */}
            {selectedRequest.sizeBreakdown && (
              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">تفصيل المقاسات واللون:</span>
                <p className="font-mono text-[#065E5A] font-bold">
                  {selectedRequest.clothingColor ? `اللون: ${selectedRequest.clothingColor} | ` : ''}
                  S: {selectedRequest.sizeBreakdown.s} • M: {selectedRequest.sizeBreakdown.m} • L: {selectedRequest.sizeBreakdown.l} • XL: {selectedRequest.sizeBreakdown.xl} • XXL: {selectedRequest.sizeBreakdown.xxl}
                </p>
              </div>
            )}

            {/* Coupon / Discount if applied */}
            {selectedRequest.couponCode && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">كوبون خصم مفعّل:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-700">
                    {selectedRequest.couponCode}
                  </span>
                </div>
                {selectedRequest.discountAmount ? (
                  <span className="font-bold text-emerald-700">
                    خصم تقديري: {selectedRequest.discountAmount} ج.م
                  </span>
                ) : null}
              </div>
            )}

            {/* Project brief */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">مواصفات المشروع المقدمة:</span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-24 overflow-y-auto">
                {selectedRequest.projectBrief}
              </div>
            </div>

            {/* Attachments preview */}
            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">المرفقات ({selectedRequest.attachments.length}):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRequest.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <FileText className="w-4 h-4 text-[#065E5A] shrink-0" />
                      <span className="truncate flex-1 font-mono">{att.name}</span>
                      <span className="text-slate-400 text-[10px] shrink-0">{formatFileSize(att.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Step Editor (Mandated by Section 7 & Page 10) */}
            <div className="space-y-1">
              <Label>توجيه الخطوة التالية للعميل (Next Step)</Label>
              <Input
                value={editingNextStep}
                onChange={(e) => setEditingNextStep(e.target.value)}
                placeholder="مثال: الاستلام غداً الساعة 5 مساءً من مقر يوزرسيف بأسوان..."
              />
            </div>

            {/* Admin Notes */}
            <div className="space-y-1">
              <Label>ملاحظات معمل أسوان (تظهر في صفحة التتبع)</Label>
              <Textarea
                rows={2}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="اكتب التحديثات الفنية أو تقدم الطباعة..."
              />
              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveNotesOnly}
                  disabled={isUpdating}
                  className="text-xs"
                >
                  حفظ الملاحظات فقط
                </Button>
              </div>
            </div>

            {/* Rejection reason */}
            <div className="space-y-1">
              <Label>سبب الرفض (إلزامي في حال الرفض)</Label>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: الملف المرفق منخفض الجودة / عدم توفر المقاس المطلوب..."
              />
            </div>

            {/* Lifecycle Status Action Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">تحديث حالة دورة حياة الطلب:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Review */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'under-review'}
                  onClick={() => handleStatusChange('under-review')}
                  className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  قيد المراجعة
                </Button>

                {/* 2. Approve */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'approved'}
                  onClick={() => handleStatusChange('approved')}
                  className="text-xs border-teal-300 text-teal-800 hover:bg-teal-50"
                >
                  اعتماد الطلب
                </Button>

                {/* 3. In Progress */}
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'in-progress'}
                  onClick={() => handleStatusChange('in-progress')}
                  className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs"
                >
                  بدء الطباعة
                </Button>

                {/* 4. Ready */}
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'ready'}
                  onClick={() => handleStatusChange('ready')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  جاهز للتسليم
                </Button>
              </div>

              {/* Complete & Reject */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'completed'}
                  onClick={() => handleStatusChange('completed')}
                  className="bg-green-700 hover:bg-green-800 text-white text-xs"
                >
                  تم التسليم (مكتمل)
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isUpdating || selectedRequest.status === 'rejected'}
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      alert('يرجى كتابة سبب الرفض أولاً في الحقل المخصص.');
                      return;
                    }
                    handleStatusChange('rejected');
                  }}
                  className="text-xs"
                >
                  رفض الطلب
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
