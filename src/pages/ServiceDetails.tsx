import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  HelpCircle,
  Shirt,
  MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ProductStudio } from '../components/ProductStudio';
import { getServiceById } from '../lib/mock-api';
import { Service } from '../lib/types';
import { generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getServiceById(id).then((res) => {
        setService(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center bg-[#F8F7F3]">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#065E5A] border-t-transparent" />
        <p className="mt-4 text-sm text-slate-500">جاري تحميل مواصفات الخدمة...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md bg-[#F8F7F3]">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">عذراً، الخدمة غير موجودة</h2>
        <p className="text-sm text-slate-500 mb-6">ربما تم تغيير الرابط أو أن الخدمة غير مفعلة حالياً.</p>
        <Link to="/services">
          <Button className="bg-[#065E5A] hover:bg-[#012C2B] text-white">العودة لجميع الخدمات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 space-y-12 bg-[#F8F7F3] min-h-screen">
      {/* Breadcrumb & Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#065E5A]">الرئيسية</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-[#065E5A]">الخدمات</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="demo" className="bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
                  خدمة تجريبية (Demo Service)
                </Badge>
                {service.badge && (
                  <Badge className="bg-[#065E5A] text-white border-none">
                    {service.badge}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#012C2B] leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {service.fullDescription}
              </p>
            </div>

            {/* Interactive Product Studio */}
            <ProductStudio serviceId={service.id} />

            {/* Included Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">المواصفات الفنية المعتمدة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">مخرجات التسليم ومحتوى الطلبية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
                    <PackageCheck className="w-6 h-6 text-[#065E5A] mx-auto" />
                    <p className="text-xs font-semibold text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="p-6 rounded-2xl bg-white border border-[#065E5A]/30 flex items-start gap-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#065E5A] shrink-0 mt-1" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#012C2B]">المعاينة واعتماد النماذج التجريبية</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  نوفر نموذج اعتماد رقمي للمعاينة والمطابقة التقريبية قبل الاعتماد النهائي (Demo).
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Action Card */}
          <div className="lg:col-span-4 sticky top-28">
            <Card className="border-slate-200 shadow-xl bg-white">
              <CardContent className="p-6 space-y-6">
                <div>
                  <span className="text-xs text-slate-400">التسعير الأولي المقترح</span>
                  <p className="text-2xl font-black text-[#012C2B] mt-1">{service.startingPrice}</p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    * خاضع للتعديل حسب الكميات وتوزيع المقاسات المطلوبة.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>متوسط مدة التنفيذ:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#065E5A]" />
                      {service.estimatedDays}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>طريقة الاستلام:</span>
                    <span className="font-bold text-slate-900">مقر أسوان أو شحن وتوصيل</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    size="lg"
                    className="w-full gap-2 shadow-md bg-[#065E5A] hover:bg-[#012C2B] text-white"
                    onClick={() => navigate(`/request?service=${service.id}`)}
                  >
                    <span>بدء طلب هذه الخدمة الآن</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
                  </Button>

                  <a
                    href={generateWhatsAppLink(undefined, `أود الاستفسار عن خدمة: ${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="outline" size="default" className="w-full text-xs gap-1.5 border-slate-300">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>استفسار واتساب ({YUZERSEF_WHATSAPP})</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
