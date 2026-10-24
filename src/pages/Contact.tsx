import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Share2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input, Textarea, Label } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { submitContactMessage, getSettings, getFAQs } from '../lib/mock-api';
import { SiteSettings, FAQItem } from '../lib/types';
import { DEFAULT_SETTINGS, DEFAULT_FAQS } from '../lib/mock-data';

export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getSettings().then((res) => {
      if (res) setSettings(res);
    });

    getFAQs().then((res) => {
      if (res && res.length > 0) setFaqs(res);
    });

    const handleSettingsUpdated = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };

    const handleFaqsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) setFaqs(e.detail);
    };

    window.addEventListener('yuzersef-settings-updated', handleSettingsUpdated);
    window.addEventListener('yuzersef-faqs-updated', handleFaqsUpdated);
    return () => {
      window.removeEventListener('yuzersef-settings-updated', handleSettingsUpdated);
      window.removeEventListener('yuzersef-faqs-updated', handleFaqsUpdated);
    };
  }, []);

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!name.trim()) err.name = 'الاسم مطلوب';
    if (!phone.trim()) err.phone = 'رقم الجوال مطلوب';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) err.email = 'بريد إلكتروني صحيح مطلوب';
    if (!subject.trim()) err.subject = 'موضوع الرسالة مطلوب';
    if (!message.trim() || message.trim().length < 10) {
      err.message = 'يرجى كتابة رسالتك بوضوح (10 أحرف على الأقل)';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch {
      alert('حدث خطأ أثناء إرسال الرسالة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 space-y-12 bg-[#F8F7F3] min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl space-y-4">
        <Badge variant="demo" className="text-xs bg-[#065E5A]/10 text-[#065E5A] border-[#065E5A]/30">
          تواصل مع يوزرسيف في أسوان
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#012C2B] tracking-tight">
          تواصل معنا واستشر خبراءنا
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          يسعدنا استقبال استفساراتكم واقتراحاتكم وتقديم عروض الأسعار المخصصة للمشاريع الكبرى وتجهيزات الملابس والشركات.
        </p>
      </section>

      {/* Main Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-[#065E5A]/40 bg-[#012C2B] text-white shadow-xl">
              <CardContent className="p-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold">معلومات المقر والتواصل</h2>
                  <p className="text-xs text-emerald-100/70 mt-1">
                    فريق خدمة العملاء جاهز للرد على استفساراتكم خلال ساعات العمل الرسمية.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-emerald-100/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E3A92F] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">المقر والمدينة:</p>
                      <p className="text-xs text-emerald-100/70 leading-relaxed mt-0.5">
                        {settings.address || 'أسوان، جمهورية مصر العربية'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#E3A92F] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">الواتساب والتواصل المباشر:</p>
                      <a
                        href={`https://wa.me/20${settings.whatsapp.replace(/^0+/, '')}?text=${encodeURIComponent(
                          settings.whatsappDefaultMessage || 'مرحباً، أود الاستفسار عن خدمات يوزرسيف في أسوان.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="text-xs font-mono text-emerald-200 hover:text-white block mt-0.5"
                      >
                        {settings.whatsapp} (قناة النشر الرسمية)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#E3A92F] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">البريد الإلكتروني:</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-xs font-mono text-white mt-0.5 hover:underline block"
                      >
                        {settings.email || 'contact@usersafe.demo'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#E3A92F] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">ساعات العمل:</p>
                      <p className="text-xs text-emerald-100/70 mt-0.5">
                        {settings.workingHours || 'السبت - الخميس: 9:00 ص - 10:00 م'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Channels Section */}
                <div className="pt-3 border-t border-[#065E5A] space-y-2.5">
                  <span className="text-xs font-bold text-white block">حسابات التواصل الرسمية:</span>
                  <div className="flex flex-wrap gap-2">
                    {settings.socialLinks.instagram && (
                      <a
                        href={settings.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>إنستجرام</span>
                      </a>
                    )}
                    {settings.socialLinks.facebook && (
                      <a
                        href={settings.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>فيسبوك</span>
                      </a>
                    )}
                    {settings.socialLinks.tiktok && (
                      <a
                        href={settings.socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span>تيك توك</span>
                      </a>
                    )}
                    {settings.socialLinks.telegram && (
                      <a
                        href={settings.socialLinks.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-cyan-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>تيليجرام</span>
                      </a>
                    )}
                    {settings.socialLinks.youtube && (
                      <a
                        href={settings.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span>يوتيوب</span>
                      </a>
                    )}
                    {settings.socialLinks.behance && (
                      <a
                        href={settings.socialLinks.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Behance</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#065E5A]/40 border border-[#065E5A] text-xs text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>تأكيد بيانات العميل</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                    جميع العناوين وأرقام الهواتف أعلاه هي عناصر نائبة (Placeholders) تتطلب مطابقة العميل قبل الإطلاق الرسمي.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-md">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">أرسل لنا رسالة مباشرة</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    قم بتعبئة النموذج أدناه وسيتم تسجيل رسالتك محلياً في النظام التجريبي.
                  </p>
                </div>

                {success && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      تم استلام رسالتك التجريبية بنجاح! شكراً لتواصلك مع وكالة يوزرسيف.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label required>الاسم الكريم</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="عبد الله محمد"
                      error={errors.name}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label required>رقم الجوال</Label>
                      <Input
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="011 1689 1025"
                        error={errors.phone}
                        className="text-start font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label required>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        error={errors.email}
                        className="text-start font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label required>موضوع الرسالة</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="استفسار عن طباعة كمية كبيرة أو طلب عرض سعر"
                      error={errors.subject}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label required>نص الرسالة والاستفسار</Label>
                    <Textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب هنا تفاصيل استفسارك أو المقاسات أو الملاحظات..."
                      error={errors.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    className="w-full gap-2 shadow-md bg-[#065E5A] hover:bg-[#012C2B] text-white"
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>إرسال الرسالة الآن</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-6">
        <div className="bg-white rounded-3xl border border-[#065E5A]/15 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#0B5F55] uppercase tracking-wider">الأسئلة الشائعة</span>
            <h2 className="text-xl sm:text-3xl font-black text-[#012C2B]">كل ما تحتاج معرفته عن خدمات يوزرسيف بأسوان</h2>
          </div>

          <div className="space-y-4 pt-4 divide-y divide-slate-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-4 first:pt-0 space-y-2">
                <h3 className="font-bold text-sm sm:text-base text-[#073B35] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0B5F55]/10 text-[#0B5F55] text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ؟
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed ps-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
