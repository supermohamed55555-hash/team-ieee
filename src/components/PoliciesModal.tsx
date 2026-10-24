import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-[#073B35]/20 flex flex-col animate-in fade-in zoom-in-95">
        <div className="bg-[#073B35] text-white p-5 flex items-center justify-between border-b border-[#073B35]/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#E3A92F]" />
            <h3 className="font-bold font-display text-base sm:text-lg">
              سياسات الطلب والخصوصية المعتمدة - يوزرسيف
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#073B35] leading-relaxed">
          {/* Policy 1 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#0B5F55] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B5F55]" />
              <span>1. طبيعة التاريخ المطلوب (Desired Date Policy)</span>
            </h4>
            <p className="text-[#073B35]/80">
              التاريخ الذي يحدده العميل في نموذج الطلب يُعد رغبة مبدئية لتنظيم المواعيد، ولا يُعتبر وعداً قاطعاً أو ملزماً بالتسليم. يتم تحديد موعد التسليم المؤكد بعد مراجعة الورشة لمواصفات وتجهيزات الطباعة واعتماد الطلب من الإدارة.
            </p>
          </div>

          {/* Policy 2 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#0B5F55] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B5F55]" />
              <span>2. التحقق من اكتمال الطلب ومساعد الجاهزية</span>
            </h4>
            <p className="text-[#073B35]/80">
              يقوم مساعد الجاهزية الذكي بالتحقق البرمجي من اكتمال الحقول الإلزامية وتطابق مجموع المقاسات مع الكمية الكلية وتحديد مواضع الطباعة. هذا الفحص البرمجي يهدف لمنع النواقص الإدارية، ولا يغني عن المراجعة الفنية للبروفة ودقة الألوان المطبوعة بالورشة.
            </p>
          </div>

          {/* Policy 3 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#0B5F55] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B5F55]" />
              <span>3. خصوصية ملفات وبيانات العملاء</span>
            </h4>
            <p className="text-[#073B35]/80">
              تلتزم يوزرسيف بالحفاظ على سرية ملفات التصاميم والشعارات والبيانات الشخصية وأرقام الهواتف المقدمة في الطلبات. لا يتم نشر أي صور أو أعمال لعملاء دون الحصول على إذن مسبق وموثق منهم. صفحات تتبع الطلبات محمية برقم الطلب والتحقق برقم الهاتف المسجل.
            </p>
          </div>

          {/* Policy 4 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#0B5F55] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B5F55]" />
              <span>4. التعديل والإلغاء</span>
            </h4>
            <p className="text-[#073B35]/80">
              يحق للعميل تعديل مواصفات الطلب أو إلغائه خلال مرحلة "قيد المراجعة" وحتى اعتماد البروفة الرقمية. بمجرد تحول حالة الطلب إلى "قيد التنفيذ" وبدء سحب الأقمشة أو ماكينات الطباعة لا يمكن إلغاء الطلب المخصص.
            </p>
          </div>
        </div>

        <div className="bg-[#F6F1E7] p-4 border-t border-[#073B35]/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B5F55] text-white text-xs font-bold rounded-xl hover:bg-[#073B35] cursor-pointer"
          >
            فهمت وموافق
          </button>
        </div>
      </div>
    </div>
  );
};
