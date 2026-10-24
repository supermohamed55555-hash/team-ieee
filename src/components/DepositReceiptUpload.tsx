import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Eye,
  X,
  Copy,
  Check,
  AlertTriangle,
  Smartphone,
  Building,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';
import { Order } from '../lib/order-types';
import { uploadOrderDepositReceipt } from '../lib/mock-api';

interface DepositReceiptUploadProps {
  order: Order;
  onReceiptUploaded?: (updatedOrder: Order) => void;
  className?: string;
  compact?: boolean;
}

export const DepositReceiptUpload: React.FC<DepositReceiptUploadProps> = ({
  order,
  onReceiptUploaded,
  className = '',
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [depositNotes, setDepositNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isViewingFull, setIsViewingFull] = useState(false);

  const depositAmount =
    order.depositRequiredAmount || Math.round((order.total || 0) * 0.5);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP).');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً، الحد الأقصى 8 ميجابايت.');
      return;
    }

    setSelectedFile(file);

    // Read as Data URL so it is fully persistent in local storage
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setErrorMessage('يرجى اختيار صورة الإيصال أولاً.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const updated = await uploadOrderDepositReceipt(
        order.id,
        previewUrl,
        depositNotes.trim()
      );
      setSuccessMessage('تم رفع صورة الإيصال بنجاح! سيقوم الأونر بمراجعتها وتأكيد الطلب.');
      setSelectedFile(null);
      if (onReceiptUploaded) {
        onReceiptUploaded(updated);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء رفع صورة الإيصال.');
    } finally {
      setIsUploading(false);
    }
  };

  const activeReceiptUrl = previewUrl || order.depositReceiptUrl;
  const isAlreadyUploaded = Boolean(order.depositReceiptUrl) && !selectedFile;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        order.depositPaid
          ? 'bg-emerald-50/70 border-emerald-300'
          : isAlreadyUploaded
          ? 'bg-amber-50/60 border-amber-300'
          : 'bg-white border-slate-200 shadow-xs'
      } p-4 sm:p-5 ${className}`}
      dir="rtl"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Header & Deposit Amount Highlight
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="font-black text-sm text-[#073B35]">
              سداد عربون الطلب (50% Deposit)
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            للبدء في تجهيز وطباعة الطلب، يتوجب سداد عربون 50% ورفع صورة الإيصال ليؤكد الأونر الطلب.
          </p>
        </div>

        <div className="bg-[#0B5F55]/10 border border-[#0B5F55]/20 rounded-xl px-3 py-1.5 text-center shrink-0">
          <span className="text-[10px] text-[#073B35] font-bold block">العربون المطلوب (50%)</span>
          <span className="text-lg font-black text-[#0B5F55]">
            {depositAmount.toLocaleString()} <span className="text-xs">ج.م</span>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Payment Accounts Quick Copy
      ───────────────────────────────────────────────────────────── */}
      {!order.depositPaid && !compact && (
        <div className="py-3.5 space-y-2 border-b border-slate-200/80 text-xs">
          <span className="font-bold text-slate-700 block">
            طرق سداد العربون المعتمدة لـ يوزرسيف أسوان:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* InstaPay */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">انستا باي (InstaPay):</span>
                  <span className="font-mono text-purple-700 font-bold text-xs select-all">yuzersef@instapay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('yuzersef@instapay', 'instapay')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                title="نسخ معرف انستاباي"
              >
                {copiedField === 'instapay' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Vodafone Cash */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">فودافون كاش / محفظة:</span>
                  <span className="font-mono text-rose-700 font-bold text-xs select-all">01119565506</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('01119565506', 'vodafone')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                title="نسخ رقم المحفظة"
              >
                {copiedField === 'vodafone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. Upload Status & Current Receipt View
      ───────────────────────────────────────────────────────────── */}
      <div className="pt-3 space-y-3">
        {order.depositPaid ? (
          <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-black text-sm">تم تأكيد استلام العربون بواسطة الأونر!</p>
              <p className="text-emerald-800 mt-0.5">
                طلبك مؤكد وبدأ خط التجهيز والطباعة في ورشة يوزرسيف بأسوان.
              </p>
            </div>
          </div>
        ) : isAlreadyUploaded ? (
          <div className="p-3.5 rounded-xl bg-amber-100/60 border border-amber-300 text-amber-950 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
                <div className="text-xs">
                  <p className="font-black text-amber-900">
                    تم رفع صورة الإيصال بنجاح - بانتظار تأكيد الأونر
                  </p>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    تاريخ الرفع:{' '}
                    {order.depositReceiptUploadedAt
                      ? new Date(order.depositReceiptUploadedAt).toLocaleString('ar-EG')
                      : 'اليوم'}
                  </p>
                </div>
              </div>

              {/* Receipt Thumbnail with Click to enlarge */}
              {order.depositReceiptUrl && (
                <button
                  type="button"
                  onClick={() => setIsViewingFull(true)}
                  className="relative group w-14 h-14 rounded-xl border-2 border-amber-400 overflow-hidden shrink-0 shadow-xs cursor-pointer"
                  title="عرض الإيصال بالحجم الكامل"
                >
                  <img
                    src={order.depositReceiptUrl}
                    alt="إيصال العربون"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>

            {order.depositNotes && (
              <div className="text-[11px] bg-white/80 p-2 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-bold">ملاحظاتك: </span>
                <span>{order.depositNotes}</span>
              </div>
            )}

            {/* Change / Reupload Option */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[11px] text-amber-800">هل ترغب في تعديل صورة الإيصال؟</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#0B5F55] hover:text-[#073B35] underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>رفع صورة أخرى</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* ─────────────────────────────────────────────────────────────
            4. Upload Form (when not uploaded yet or user wants to replace)
        ───────────────────────────────────────────────────────────── */}
        {(!order.depositPaid && (!isAlreadyUploaded || selectedFile)) && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Dropzone / Upload Trigger */}
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#0B5F55]/40 hover:border-[#0B5F55] bg-emerald-50/20 hover:bg-emerald-50/40 rounded-xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                role="button"
                tabIndex={0}
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-[#0B5F55] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">
                    انقر لرفع صورة إشعار أو سكرين شوت تحويل العربون
                  </p>
                  <p className="text-[10px] text-slate-500">
                    يدعم صور JPG، PNG، WEBP من الهاتف أو الكمبيوتر حتى 8 ميجابايت
                  </p>
                </div>
              </div>
            ) : (
              /* Selected Image Preview Box */
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0B5F55]" />
                    <span>الصورة المختارة: {selectedFile.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                    title="إلغاء الصورة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {previewUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-black/5 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="معاينة إيصال العربون"
                      className="max-h-48 w-auto object-contain"
                    />
                  </div>
                )}

                {/* Optional Note */}
                <input
                  type="text"
                  value={depositNotes}
                  onChange={(e) => setDepositNotes(e.target.value)}
                  placeholder="ملاحظة إضافية (اختياري: مثال تم التحويل من محفظة 010... باسم فلان)"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0B5F55]"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#0B5F55] hover:bg-[#073B35] text-white font-black text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري رفع وتأكيد الإيصال...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>إرسال صورة الإيصال للأونر للتأكيد</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Error & Success Feedback */}
            {errorMessage && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                ⚠️ {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✅ {successMessage}
              </p>
            )}
          </form>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. Full-Size Image Modal
      ───────────────────────────────────────────────────────────── */}
      {isViewingFull && activeReceiptUrl && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsViewingFull(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 overflow-hidden shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-slate-800">
                صورة إيصال تحويل العربون - طلب {order.id}
              </h3>
              <button
                type="button"
                onClick={() => setIsViewingFull(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              <img
                src={activeReceiptUrl}
                alt="إيصال العربون بالحجم الكامل"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>قيمة العربون: {depositAmount.toLocaleString()} ج.م</span>
              <a
                href={activeReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0B5F55] font-bold hover:underline"
              >
                فتح الصورة في نافذة جديدة
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
