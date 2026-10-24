import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, RefreshCw, Lock, Sparkles, MapPin, Truck, Palette } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getPolicies } from '../lib/mock-api';
import { WorkshopPolicies } from '../lib/types';
import { DEFAULT_POLICIES } from '../lib/mock-data';

export const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<WorkshopPolicies>(DEFAULT_POLICIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPolicies().then((res) => {
      setPolicies(res);
      setLoading(false);
    });

    const handleUpdated = (e: any) => {
      if (e.detail) {
        setPolicies(e.detail);
      }
    };

    window.addEventListener('yuzersef-policies-updated', handleUpdated);
    return () => window.removeEventListener('yuzersef-policies-updated', handleUpdated);
  }, []);

  const renderPolicyContent = (text: string) => {
    return text.split('\n').filter((l) => l.trim().length > 0).map((line, idx) => (
      <p key={idx} className="leading-relaxed">
        {line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}
      </p>
    ));
  };

  return (
    <div className="py-10 sm:py-16 space-y-12 bg-[#F8F7F3] min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <Badge variant="demo" className="text-xs bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
          لوائح وسياسات معمل يوزرسيف بأسوان
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          سياسات العمل والشروط والأحكام
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          تنظم هذه البنود العلاقة بين وكالة ومعمل «يوزرسيف» والعميل لضمان الشفافية وحماية حقوق الطرفين في كافة عمليات الطباعة والإنتاج.
        </p>
      </section>

      {/* Main Policies Accordions/Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
        {/* Policy 1: Design & Approval */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#065E5A] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. سياسة التصميم واعتماد النماذج الأولية (Design Proofing)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              {renderPolicyContent(policies.designProofing || '')}
            </div>
          </CardContent>
        </Card>

        {/* Policy 2: Printing & Color Standards */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#065E5A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. معايير الطباعة ومطابقة الألوان وخامات المعمل (Printing & Colors)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              {renderPolicyContent(policies.colorAndPrinting || '')}
            </div>
          </CardContent>
        </Card>

        {/* Policy 3: Cancellation & Refund */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#065E5A] flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. سياسة الإلغاء والاسترجاع للمنتجات المخصصة (Refund & Cancellation)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              {renderPolicyContent(policies.cancellationAndRefund || '')}
            </div>
          </CardContent>
        </Card>

        {/* Policy 4: Pickup & Delivery */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. سياسة التوصيل والاستلام من مقر أسوان (Delivery & Pickup)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              {renderPolicyContent(policies.deliveryAndPickup || '')}
            </div>
          </CardContent>
        </Card>

        {/* Policy 5: Rush Orders */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">5. سياسة الطلبيات العاجلة والمواعيد الحرجة (Rush Orders)</h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              {renderPolicyContent(policies.rushOrders || '')}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
