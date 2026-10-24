import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Package,
  Shirt,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  PieChart,
  Users
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ServiceRequest, Service } from '../../lib/types';
import { getRequests, getServices } from '../../lib/mock-api';
import { formatDateAr, getStatusDetails } from '../../lib/utils';

export const AnalyticsDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRequests(), getServices()]).then(([reqs, servs]) => {
      setRequests(reqs);
      setServices(servs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">جاري تجميع الإحصائيات والتحليلات...</div>;
  }

  // 1. Core KPIs
  const totalOrders = requests.length;
  const totalUnits = requests.reduce((sum, r) => sum + (r.quantity || 1), 0);
  const avgUnitsPerOrder = totalOrders > 0 ? (totalUnits / totalOrders).toFixed(1) : '0';

  const pickupCount = requests.filter((r) => r.receiptPreference === 'aswan-pickup').length;
  const shippingCount = totalOrders - pickupCount;
  const pickupPercentage = totalOrders > 0 ? Math.round((pickupCount / totalOrders) * 100) : 0;

  const urgentCount = requests.filter((r) => r.urgency === 'urgent').length;
  const normalCount = totalOrders - urgentCount;
  const urgentPercentage = totalOrders > 0 ? Math.round((urgentCount / totalOrders) * 100) : 0;

  // 2. Sizing Distribution Breakdown (S, M, L, XL, XXL)
  const sizes = { s: 0, m: 0, l: 0, xl: 0, xxl: 0 };
  requests.forEach((r) => {
    if (r.sizeBreakdown) {
      sizes.s += r.sizeBreakdown.s || 0;
      sizes.m += r.sizeBreakdown.m || 0;
      sizes.l += r.sizeBreakdown.l || 0;
      sizes.xl += r.sizeBreakdown.xl || 0;
      sizes.xxl += r.sizeBreakdown.xxl || 0;
    }
  });

  const totalClothingPieces = sizes.s + sizes.m + sizes.l + sizes.xl + sizes.xxl || 1;
  const sizeEntries = [
    { label: 'S (صغير)', count: sizes.s, pct: Math.round((sizes.s / totalClothingPieces) * 100) },
    { label: 'M (متوسط)', count: sizes.m, pct: Math.round((sizes.m / totalClothingPieces) * 100) },
    { label: 'L (كبير)', count: sizes.l, pct: Math.round((sizes.l / totalClothingPieces) * 100) },
    { label: 'XL (كبير جداً)', count: sizes.xl, pct: Math.round((sizes.xl / totalClothingPieces) * 100) },
    { label: 'XXL (خاص)', count: sizes.xxl, pct: Math.round((sizes.xxl / totalClothingPieces) * 100) },
  ];

  // 3. Top Ordered Services Ranking
  const serviceCounts: Record<string, { title: string; count: number; units: number }> = {};
  requests.forEach((r) => {
    const key = r.serviceTitle || r.serviceId;
    if (!serviceCounts[key]) {
      serviceCounts[key] = { title: key, count: 0, units: 0 };
    }
    serviceCounts[key].count += 1;
    serviceCounts[key].units += r.quantity || 1;
  });

  const rankedServices = Object.values(serviceCounts).sort((a, b) => b.count - a.count);

  // 4. Order Status Lifecycle Breakdown
  const statusStats = {
    submitted: requests.filter((r) => r.status === 'submitted').length,
    underReview: requests.filter((r) => r.status === 'under-review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    ready: requests.filter((r) => r.status === 'ready').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#065E5A]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              إحصائيات وتحليلات المعمل والطلبات (Analytics & Insights)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            نظرة تفصيلية على حجم الطلبيات، توزيع المقاسات الأكثر طلباً، وتفضيلات الاستلام لمساعدة معمل أسوان على التخطيط الذكي للمخزون.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#065E5A] text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#E3A92F]" />
          <span>تحديث تحليلي مباشر (Live React Data)</span>
        </div>
      </div>

      {/* 1. Core KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">إجمالي الطلبات</span>
            <FileText className="w-4 h-4 text-[#065E5A]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
          <span className="text-[10px] text-slate-400 block">طلب مسجل في النظام</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">إجمالي القطع المطلوبة</span>
            <Package className="w-4 h-4 text-[#065E5A]" />
          </div>
          <p className="text-2xl font-black text-[#065E5A]">{totalUnits}</p>
          <span className="text-[10px] text-slate-400 block">قطعة تم إنتاجها أو قيد التنفيذ</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">استلام من مقر أسوان</span>
            <MapPin className="w-4 h-4 text-[#E3A92F]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{pickupPercentage}%</p>
          <span className="text-[10px] text-slate-400 block">{pickupCount} طلب استلام محلي بأسوان</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">طلبات مستعجلة</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700">{urgentPercentage}%</p>
          <span className="text-[10px] text-slate-400 block">{urgentCount} طلب بأولوية تنفيذ مستعجل</span>
        </div>
      </div>

      {/* 2. Visual Sizing Breakdown & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sizing Breakdown Card */}
        <div className="lg:col-span-7">
          <Card className="border-slate-200 shadow-xs bg-white h-full">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#065E5A]" />
                <h3 className="font-bold text-slate-900 text-sm">تحليل توزيع مقاسات الملابس (Sizing Distribution)</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-bold">
                إجمالي ملابس: {totalClothingPieces > 1 ? totalClothingPieces : 0} قطعة
              </span>
            </div>

            <CardContent className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                يساعد هذا التحليل معمل أسوان على تقدير كميات الخامات الفارغة (Garment Blanks) المطلوب تخزينها مسبقاً وفقاً لطلب العملاء الحقيقي:
              </p>

              <div className="space-y-3 pt-1">
                {sizeEntries.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.label}</span>
                      <span className="text-slate-500 font-mono font-bold">
                        {item.count} قطعة ({item.pct}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#065E5A] to-[#0B5F55] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(item.pct, item.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-[11px] text-teal-900 leading-relaxed">
                💡 <strong>توصية المخزون:</strong> مقاسا (M و L) يمثلان الحجم الأكبر من طلبيات الملابس والهوديز بأسوان، يليهما مقاس XL.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Services Ranking */}
        <div className="lg:col-span-5">
          <Card className="border-slate-200 shadow-xs bg-white h-full">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#065E5A]" />
                <h3 className="font-bold text-slate-900 text-sm">الخدمات الأكثر طلباً</h3>
              </div>
            </div>

            <CardContent className="p-5 space-y-3">
              {rankedServices.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">لا توجد بيانات طلبات كافية</div>
              ) : (
                rankedServices.slice(0, 5).map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-6 h-6 rounded-lg bg-[#065E5A]/10 text-[#065E5A] font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">{srv.title}</span>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="text-xs font-black text-[#065E5A] block">{srv.count} طلب</span>
                      <span className="text-[10px] text-slate-400 block">{srv.units} قطعة</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Order Pipeline Lifecycle Funnel */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">مراحل خط الإنتاج ودورة حياة الطلبيات (Production Pipeline)</h3>
          <span className="text-xs text-slate-400">حالة الطلبيات الحية في المعمل</span>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'تم التقديم', count: statusStats.submitted, color: 'border-slate-300 bg-slate-50 text-slate-800' },
              { label: 'قيد المراجعة', count: statusStats.underReview, color: 'border-amber-300 bg-amber-50 text-amber-900' },
              { label: 'معتمد', count: statusStats.approved, color: 'border-teal-300 bg-teal-50 text-teal-900' },
              { label: 'قيد الطباعة', count: statusStats.inProgress, color: 'border-[#065E5A] bg-[#065E5A]/10 text-[#065E5A]' },
              { label: 'جاهز للتسليم', count: statusStats.ready, color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
              { label: 'مكتمل', count: statusStats.completed, color: 'border-green-300 bg-green-50 text-green-900' },
            ].map((step, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border text-center ${step.color}`}>
                <span className="text-[11px] font-bold block opacity-75">{step.label}</span>
                <p className="text-2xl font-black mt-1">{step.count}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
