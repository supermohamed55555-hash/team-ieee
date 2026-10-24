import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RequestStatus, SizeBreakdown } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateAr(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Published Official WhatsApp for Yuzersef Aswan
export const YUZERSEF_WHATSAPP = '01116891025';

export function generateWhatsAppLink(requestId?: string, note?: string): string {
  const phone = '201116891025';
  let message = 'مرحباً وكالة يوزرسيف للطباعة والتخصيص في أسوان، ';
  if (requestId) {
    message += `أريد الاستفسار عن طلبي رقم [${requestId}].`;
  } else {
    message += 'أود الاستفسار عن خدمات الطباعة المخصصة.';
  }
  if (note) {
    message += ` ${note}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function calculateTotalSizes(breakdown?: SizeBreakdown): number {
  if (!breakdown) return 0;
  return (
    (Number(breakdown.s) || 0) +
    (Number(breakdown.m) || 0) +
    (Number(breakdown.l) || 0) +
    (Number(breakdown.xl) || 0) +
    (Number(breakdown.xxl) || 0)
  );
}

export function getStatusDetails(status: RequestStatus) {
  switch (status) {
    case 'submitted':
      return {
        label: 'تم التقديم',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        dotClass: 'bg-slate-500',
        description: 'تم إرسال الطلب بنجاح وهو بانتظار استلامه من قبل مسؤول المعمل في أسوان.',
        stepIndex: 1,
      };
    case 'under-review':
      return {
        label: 'قيد المراجعة الفنية',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        dotClass: 'bg-amber-500',
        description: 'فريق العمل يراجع مواصفات التصميم ومقاسات الطباعة وتوفر الخامات.',
        stepIndex: 2,
      };
    case 'approved':
      return {
        label: 'معتمد وجاهز للطباعة',
        badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
        dotClass: 'bg-teal-500',
        description: 'تم اعتماد الطلب وتسعيره وجاري نقله لجدول ماكينات الطباعة والتجهيز.',
        stepIndex: 3,
      };
    case 'in-progress':
      return {
        label: 'قيد التنفيذ والطباعة',
        badgeClass: 'bg-[#065E5A]/15 text-[#065E5A] border-[#065E5A]/40 font-bold',
        dotClass: 'bg-[#065E5A]',
        description: 'يجري الآن قص الخامات والطباعة الحرارية/المباشرة على ماكينات المعمل.',
        stepIndex: 4,
      };
    case 'ready':
      return {
        label: 'جاهز للاستلام / الشحن',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold',
        dotClass: 'bg-emerald-600',
        description: 'تم تجهيز وتغليف طلبك وهو جاهز الآن للاستلام من المقر بأسوان أو بانتظار مندوب الشحن.',
        stepIndex: 5,
      };
    case 'completed':
      return {
        label: 'مكتمل ومسلّم',
        badgeClass: 'bg-green-100 text-green-900 border-green-400',
        dotClass: 'bg-green-600',
        description: 'تم استلام الطلب من قبل العميل بنجاح. شكراً لثقتكم بوكالة يوزرسيف!',
        stepIndex: 6,
      };
    case 'rejected':
      return {
        label: 'مرفوض / ملغي',
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        dotClass: 'bg-rose-500',
        description: 'تعذر قبول الطلب لمخالفة فنية أو ميزانية. يرجى الاطلاع على السبب أدناه أو التواصل واتساب.',
        stepIndex: 0,
      };
    default:
      return {
        label: 'غير معروف',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        dotClass: 'bg-slate-500',
        description: 'حالة غير محددة',
        stepIndex: 0,
      };
  }
}
