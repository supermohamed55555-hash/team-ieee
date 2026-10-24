import React, { useState, useEffect } from 'react';
import {
  Share2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Globe,
  Bell,
  Eye,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input, Textarea, Label } from '../ui/input';
import { SiteSettings } from '../../lib/types';
import { getSettings, updateSettings, resetSettings } from '../../lib/mock-api';
import { DEFAULT_SETTINGS } from '../../lib/mock-data';

interface SocialSettingsProps {
  onNotification?: (msg: string) => void;
}

export const SocialSettings: React.FC<SocialSettingsProps> = ({ onNotification }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState('');
  const [telegram, setTelegram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [behance, setBehance] = useState('');

  // Business & Contact
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  // Announcement Banner
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      populateForm(data);
    } catch {
      setErrorMsg('حدث خطأ أثناء تحميل الإعدادات.');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: SiteSettings) => {
    setFacebook(data.socialLinks.facebook || '');
    setInstagram(data.socialLinks.instagram || '');
    setTiktok(data.socialLinks.tiktok || '');
    setWhatsapp(data.whatsapp || data.socialLinks.whatsapp || '01116891025');
    setWhatsappDefaultMessage(data.whatsappDefaultMessage || '');
    setTelegram(data.socialLinks.telegram || '');
    setYoutube(data.socialLinks.youtube || '');
    setTwitter(data.socialLinks.twitter || '');
    setBehance(data.socialLinks.behance || '');

    setBusinessName(data.businessName || '');
    setPhone(data.phone || '');
    setEmail(data.email || '');
    setAddress(data.address || '');
    setWorkingHours(data.workingHours || '');

    setAnnouncementEnabled(data.announcement?.enabled ?? true);
    setAnnouncementText(data.announcement?.text || '');
    setAnnouncementLink(data.announcement?.link || '');
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccessMsg('');
    setErrorMsg('');

    try {
      const cleanPhone = whatsapp.replace(/\D/g, '');
      const waLink = cleanPhone ? `https://wa.me/20${cleanPhone.replace(/^0+/, '')}` : '';

      const updated = await updateSettings({
        businessName: businessName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        whatsappDefaultMessage: whatsappDefaultMessage.trim(),
        email: email.trim(),
        address: address.trim(),
        workingHours: workingHours.trim(),
        socialLinks: {
          facebook: facebook.trim(),
          instagram: instagram.trim(),
          tiktok: tiktok.trim(),
          whatsapp: waLink || `https://wa.me/201116891025`,
          telegram: telegram.trim(),
          youtube: youtube.trim(),
          twitter: twitter.trim(),
          behance: behance.trim(),
        },
        announcement: {
          enabled: announcementEnabled,
          text: announcementText.trim(),
          link: announcementLink.trim(),
        },
      });

      setSettings(updated);
      populateForm(updated);
      setSaveSuccessMsg('تم حفظ إعدادات السوشيال ميديا وقنوات التواصل بنجاح! التغييرات مفعلة فورياً في الموقع.');
      if (onNotification) {
        onNotification('تم حفظ إعدادات السوشيال ميديا بنجاح.');
      }

      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 5000);
    } catch {
      setErrorMsg('حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة ثانية.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة إعدادات السوشيال ميديا الافتراضية؟')) {
      setSaving(true);
      try {
        const resetted = await resetSettings();
        setSettings(resetted);
        populateForm(resetted);
        setSaveSuccessMsg('تمت استعادة الإعدادات الافتراضية بنجاح!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } catch {
        setErrorMsg('حدث خطأ أثناء استعادة الإعدادات الافتراضية.');
      } finally {
        setSaving(false);
      }
    }
  };

  // Generate test WhatsApp URL
  const testWhatsAppUrl = () => {
    const clean = whatsapp.replace(/\D/g, '').replace(/^0+/, '');
    const num = clean.startsWith('20') ? clean : `20${clean}`;
    const textParam = whatsappDefaultMessage ? `?text=${encodeURIComponent(whatsappDefaultMessage)}` : '';
    return `https://wa.me/${num}${textParam}`;
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">جاري تحميل إعدادات السوشيال ميديا...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notifications */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#065E5A]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              إعدادات السوشيال ميديا وقنوات التواصل (Social & Channels)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة وتحديث كافة روابط المنصات الرسمية (إنستجرام، فيسبوك، تيك توك، واتساب، تيليجرام)، أرقام المعمل بأسوان، وشريط الإعلانات.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={saving}
            className="text-xs gap-1.5 text-slate-600 border-slate-300 hover:text-rose-600"
            title="استعادة الروابط الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </Button>

          <Button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. SOCIAL MEDIA PLATFORMS SECTION */}
        <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#065E5A]" />
                <h3 className="font-bold text-slate-900 text-sm">روابط المنصات والحسابات الرسمية</h3>
              </div>
              <span className="text-[11px] text-slate-400">تظهر الروابط في الفوتر وصفحة التواصل والأزرار العائمة</span>
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      IG
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">حساب إنستجرام (Instagram)</Label>
                      <span className="text-[10px] text-slate-400 block">عرض الكتالوج والستوريات اليومية</span>
                    </div>
                  </div>
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/yuzersef.aswan"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* Facebook */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      FB
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">صفحة فيسبوك (Facebook)</Label>
                      <span className="text-[10px] text-slate-400 block">المنشورات وحملات المسابقات</span>
                    </div>
                  </div>
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yuzersef.aswan"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* TikTok */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      TT
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">حساب تيك توك (TikTok)</Label>
                      <span className="text-[10px] text-slate-400 block">فيديوهات كواليس الطباعة والتطريز</span>
                    </div>
                  </div>
                  {tiktok && (
                    <a
                      href={tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@yuzersef.aswan"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* Telegram */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#229ED9] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      TG
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">قناة تيليجرام (Telegram)</Label>
                      <span className="text-[10px] text-slate-400 block">استقبال التصاميم والملفات الثقيلة</span>
                    </div>
                  </div>
                  {telegram && (
                    <a
                      href={telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="https://t.me/yuzersef"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* YouTube */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      YT
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">قناة يوتيوب (YouTube)</Label>
                      <span className="text-[10px] text-slate-400 block">فيديوهات الشرح ومعارض المنتجات</span>
                    </div>
                  </div>
                  {youtube && (
                    <a
                      href={youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@yuzersef"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* Twitter / X */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      X
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">منصة إكس / تويتر (X / Twitter)</Label>
                      <span className="text-[10px] text-slate-400 block">التحديثات الإخبارية السريعة</span>
                    </div>
                  </div>
                  {twitter && (
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/yuzersef"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>

              {/* Behance */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 bg-white md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#0057FF] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      Be
                    </span>
                    <div>
                      <Label className="text-xs font-bold text-slate-900">معرض بيهانس (Behance Portfolio)</Label>
                      <span className="text-[10px] text-slate-400 block">عرض الهويات البصرية ومشاريع التصميم الكاملة</span>
                    </div>
                  </div>
                  {behance && (
                    <a
                      href={behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#065E5A] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>اختبار</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Input
                  value={behance}
                  onChange={(e) => setBehance(e.target.value)}
                  placeholder="https://behance.net/yuzersef"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. OFFICIAL WHATSAPP INTEGRATION */}
        <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-emerald-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">واتساب الأعمال والتواصل المباشر (WhatsApp)</h3>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                القناة الرئيسية لتأكيد الطلبات
              </span>
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>رقم الواتساب الرسمي (مصر +20) *</Label>
                <div className="relative">
                  <Input
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="01116891025"
                    className="font-mono text-xs ps-8"
                    dir="ltr"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-2.5 pointer-events-none" />
                </div>
                <span className="text-[11px] text-slate-400 block">
                  يستخدم هذا الرقم في زر "مراسلة عبر واتساب"، وفي رسائل التتبع، والفوتر.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>رسالة الترحيب والبدء الافتراضية</Label>
                  <a
                    href={testWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>تجربة إرسال رسالة حية</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Input
                  value={whatsappDefaultMessage}
                  onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                  placeholder="مرحباً، أود الاستفسار عن خدمات ومنتجات يوزرسيف في أسوان."
                  className="text-xs"
                />
                <span className="text-[11px] text-slate-400 block">
                  الرسالة التي يتم ملؤها تلقائياً للعميل عند النقر على أيقونة الواتساب.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. CAMPAIGN ANNOUNCEMENT BANNER */}
        <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-amber-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm">شريط الإعلانات وحملات السوشيال ميديا (Announcement)</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">تفعيل الشريط أعلى الموقع</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#065E5A]"></div>
                </label>
              </div>
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <Label>نص الإعلان أو العرض التسويقي</Label>
                <Input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="مثال: خصم 10% على طلبيات التيشرتات والهوديز للجامعات والفرق بأسوان! تواصل معنا عبر واتساب"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label>رابط الإعلان (Action Link)</Label>
                <Input
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="/request أو رابط خارجي"
                  className="text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Live Banner Preview */}
            {announcementEnabled && announcementText && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">معاينة شكل الشريط المتحرك أعلى الموقع:</span>
                <div
                  className="rounded-xl bg-[#012C2B] text-white text-xs border border-[#065E5A] overflow-hidden py-2 relative select-none [container-type:inline-size]"
                  dir="rtl"
                >
                  <div className="animate-marquee-single">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#E3A92F] text-[#073B35] shrink-0 ms-1 me-2.5">
                      إعلان
                    </span>
                    <span className="text-emerald-100/90 font-medium">
                      {announcementText}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. BUSINESS & STUDIO DETAILS */}
        <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#065E5A]" />
              <h3 className="font-bold text-slate-900 text-sm">بيانات المقر ومعلومات الاتصال الرسمية</h3>
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>اسم النشاط التجاري</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="يوزرسيف للطباعة والتخصيص"
                />
              </div>

              <div className="space-y-1">
                <Label>رقم الهاتف للاتصال المباشر</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01116891025"
                  className="font-mono text-xs"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <Label>البريد الإلكتروني الرسمي</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@userseif.com"
                  className="font-mono text-xs"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <Label>مواعيد وساعات العمل</Label>
                <Input
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="السبت - الخميس: 9:00 ص - 10:00 م"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label>عنوان المقر والمعمل بأسوان</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="أسوان، جمهورية مصر العربية (قرب محطة القطار)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. LIVE PREVIEW FOOTER WIDGET */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#012C2B] to-[#073B35] text-white space-y-3 shadow-md border border-[#065E5A]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#E3A92F]" />
              <h4 className="font-bold text-sm">معاينة حية لشكل قنوات التواصل (Live Preview):</h4>
            </div>
            <span className="text-[11px] text-emerald-200/80">كما يراها الزائر في الفوتر وصفحة اتصل بنا</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Instagram</span>
              </a>
            )}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Facebook</span>
              </a>
            )}
            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>TikTok</span>
              </a>
            )}
            {whatsapp && (
              <a
                href={testWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span dir="ltr">{whatsapp}</span>
              </a>
            )}
            {telegram && (
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Telegram</span>
              </a>
            )}
            {youtube && (
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>YouTube</span>
              </a>
            )}
            {behance && (
              <a
                href={behance}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Behance</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={saving}
            className="text-xs"
          >
            استعادة الافتراضي
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري حفظ الإعدادات...' : 'حفظ ونشر التعديلات فورياً'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
