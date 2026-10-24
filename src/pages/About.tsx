import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Eye,
  Award,
  Layers,
  CheckCircle2,
  Users,
  Printer,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BrandLogo } from '../components/BrandLogo';

export const About: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 space-y-16 bg-[#F8F7F3] min-h-screen">
      {/* Header Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-5">
        <div className="flex justify-center mb-2">
          <BrandLogo variant="green-on-paper" className="h-16 w-auto" />
        </div>
        <Badge variant="demo" className="text-xs bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
          عن وكالة يوزرسيف في أسوان
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#012C2B] tracking-tight">
          نبني هويات ملهمة ونطبع بدقة لا تساوم
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          انطلقت وكالة «يوزرسيف» من قلب أسوان لردم الفجوة بين التصاميم الرقمية الأنيقة والواقع المطبوع والمطرز، وتوفير تجربة استثنائية لأصحاب الأعمال والمتاجر والشباب الباحثين عن التميز الحقيقي.
        </p>
      </section>

      {/* Visual Showcase Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="rounded-2xl overflow-hidden border border-[#065E5A]/20 shadow-xl bg-white">
          <img
            src="/showcase/luxury-flat-lay.png"
            alt="ورشة عمل واستوديو يوزرسيف أسوان"
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="p-6 bg-gradient-to-r from-[#012C2B] to-[#073B35] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#E3A92F]">استوديو التصميم وورشة التطريز المباشر في أسوان</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                تطريز بخيوط ميتاليك ألمانية، طباعة DTF عالية الصمود، وتغليف يدوي فاخر لكل قطعة.
              </p>
            </div>
            <Link to="/request">
              <Button size="sm" className="bg-[#E3A92F] hover:bg-[#c99222] text-[#012C2B] font-bold">
                ابدأ مشروعك معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-[#065E5A]/20 bg-white shadow-sm p-8 space-y-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#065E5A] text-white flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#012C2B]">رؤيتنا</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              أن نكون الشريك الإبداعي والطباعي الأول للمؤسسات والمشاريع الريادية في المنطقة، من خلال تقديم تصاميم بصرية فريدة وحلول طباعية وتغليفية مستدامة وعالية الجودة.
            </p>
          </Card>

          <Card className="border-[#012C2B]/20 bg-white shadow-sm p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#012C2B] text-white flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#012C2B]">رسالتنا</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              تمكين الشركات من التعبير عن قيمتها عبر منتجات مطبوعة وملموسة تترك أثراً دائماً لدى عملائها، بالاعتماد على خامات متميزة وتقنيات متطورة ومواعيد تسليم دقيقة.
            </p>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white/80 py-14 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#012C2B]">قيمنا الأساسية</h2>
            <p className="text-sm text-slate-600 mt-2">المبادئ التي تقود كل مشروع نعمل عليه في يوزرسيف</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'الجودة الفائقة',
                desc: 'لا نقبل بأقل من أقصى درجات دقة الألوان ونقاء الأحبار ومطابقة المواصفات.',
              },
              {
                icon: Sparkles,
                title: 'الإبداع والتجدد',
                desc: 'نبتكر أفكاراً وتراكيب تغليف غير مألوفة تميز عملك عن المنافسين في السوق.',
              },
              {
                icon: Printer,
                title: 'الشفافية في التنفيذ',
                desc: 'نظام تتبع إلكتروني يتيح لك معرفة موقع طلبك في خط الإنتاج لحظة بلحظة.',
              },
              {
                icon: Users,
                title: 'الشراكة المستدامة',
                desc: 'نجاحنا ينبع من نمو علامة عملائنا ورضاهم التام بعد استلام كل طلبية.',
              },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#EFEFEA] p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#065E5A]/10 text-[#065E5A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Confirmation Notice */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm">ملاحظة للعميل والجهة المالكة (قيد الاعتماد)</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                جميع نصوص الرؤية وسنوات الخبرة والأسماء الواردة هنا هي نصوص تمهيدية (Placeholder) قابلة للتعديل والاعتماد النهائي بناءً على وثائق وملف الشركة الرسمي.
              </p>
            </div>
          </div>
          <Link to="/request" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" className="w-full bg-[#065E5A] hover:bg-[#012C2B] text-white gap-1.5">
              <span>طلب خدمة الآن</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
