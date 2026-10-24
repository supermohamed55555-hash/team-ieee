import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  Truck,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input, Textarea, Label } from '../ui/input';
import { Modal } from '../ui/modal';
import { FAQItem, WorkshopPolicies } from '../../lib/types';
import {
  getFAQs,
  saveFAQ,
  deleteFAQ,
  resetFAQs,
  getPolicies,
  updatePolicies,
  resetPolicies
} from '../../lib/mock-api';
import { DEFAULT_POLICIES } from '../../lib/mock-data';

interface FaqPoliciesProps {
  onNotification?: (msg: string) => void;
}

export const FaqPoliciesManagement: React.FC<FaqPoliciesProps> = ({ onNotification }) => {
  const [subTab, setSubTab] = useState<'faqs' | 'policies'>('faqs');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [policies, setPolicies] = useState<WorkshopPolicies>(DEFAULT_POLICIES);
  const [loading, setLoading] = useState(true);
  const [savingPolicies, setSavingPolicies] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqModalMode, setFaqModalMode] = useState<'add' | 'edit'>('add');
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('عام');

  // Delete FAQ State
  const [deleteCandidate, setDeleteCandidate] = useState<FAQItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Policies Form State
  const [designProofing, setDesignProofing] = useState('');
  const [colorAndPrinting, setColorAndPrinting] = useState('');
  const [cancellationAndRefund, setCancellationAndRefund] = useState('');
  const [deliveryAndPickup, setDeliveryAndPickup] = useState('');
  const [rushOrders, setRushOrders] = useState('');

  // Feedback Banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fData, pData] = await Promise.all([getFAQs(), getPolicies()]);
      setFaqs(fData);
      setPolicies(pData);
      setDesignProofing(pData.designProofing);
      setColorAndPrinting(pData.colorAndPrinting);
      setCancellationAndRefund(pData.cancellationAndRefund);
      setDeliveryAndPickup(pData.deliveryAndPickup);
      setRushOrders(pData.rushOrders);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تحميل البيانات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    if (onNotification) onNotification(text);
    setTimeout(() => setFeedback(null), 4000);
  };

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setFaqModalMode('add');
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('عام');
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FAQItem) => {
    setFaqModalMode('edit');
    setEditingFaqId(item.id);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
    setFaqCategory(item.category || 'عام');
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert('يرجى ملء السؤال والإجابة.');
      return;
    }

    try {
      const payload: FAQItem = {
        id: editingFaqId || `faq-${Date.now()}`,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
      };

      await saveFAQ(payload);
      await loadData();
      showFeedback('success', `تم ${faqModalMode === 'add' ? 'إضافة' : 'تحديث'} السؤال بنجاح!`);
      setIsFaqModalOpen(false);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء حفظ السؤال.');
    }
  };

  const handleDeleteFaqConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteFAQ(deleteCandidate.id);
      setFaqs((prev) => prev.filter((f) => f.id !== deleteCandidate.id));
      showFeedback('success', 'تم حذف السؤال بنجاح.');
      setIsDeleteModalOpen(false);
      setDeleteCandidate(null);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء الحذف.');
    }
  };

  const handleResetFaqs = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة قائمة الأسئلة الشائعة الافتراضية؟')) {
      const reset = await resetFAQs();
      setFaqs(reset);
      showFeedback('success', 'تمت استعادة الأسئلة الشائعة الافتراضية.');
    }
  };

  // Policies Handlers
  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPolicies(true);
    try {
      const updated = await updatePolicies({
        designProofing: designProofing.trim(),
        colorAndPrinting: colorAndPrinting.trim(),
        cancellationAndRefund: cancellationAndRefund.trim(),
        deliveryAndPickup: deliveryAndPickup.trim(),
        rushOrders: rushOrders.trim(),
      });
      setPolicies(updated);
      showFeedback('success', 'تم حفظ وتحديث بنود وسياسات المعمل بنجاح في الموقع!');
    } catch {
      showFeedback('error', 'حدث خطأ أثناء حفظ السياسات.');
    } finally {
      setSavingPolicies(false);
    }
  };

  const handleResetPolicies = async () => {
    if (window.confirm('هل أنت متأكد من استعادة نصوص السياسات الافتراضية؟')) {
      const def = await resetPolicies();
      setPolicies(def);
      setDesignProofing(def.designProofing);
      setColorAndPrinting(def.colorAndPrinting);
      setCancellationAndRefund(def.cancellationAndRefund);
      setDeliveryAndPickup(def.deliveryAndPickup);
      setRushOrders(def.rushOrders);
      showFeedback('success', 'تمت استعادة نصوص السياسات الافتراضية.');
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all shadow-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
              : 'bg-rose-50 text-rose-950 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#065E5A]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              إدارة الأسئلة الشائعة وسياسات المعمل (FAQs & Policies)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            التحكم في بنود الأسئلة الشائعة التي تظهر في صفحة التواصل، وتحرير سياسات ومواصفات الطباعة والاسترجاع في صفحة السياسات.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('faqs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'faqs' ? 'bg-[#065E5A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الأسئلة الشائعة ({faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('policies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'policies' ? 'bg-[#065E5A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>سياسات وشروط المعمل</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FAQS */}
      {subTab === 'faqs' && (
        <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأسئلة الشائعة..."
                className="w-full h-10 rounded-lg border border-slate-200 ps-9 pe-3 text-xs bg-slate-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#065E5A]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFaqs}
                className="text-xs gap-1 border-slate-300 text-slate-600 hover:text-rose-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </Button>

              <Button
                size="sm"
                onClick={handleOpenAddFaq}
                className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سؤال جديد</span>
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">جاري تحميل الأسئلة...</div>
            ) : filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">لا توجد أسئلة مطابقة للبحث.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#065E5A]/10 text-[#065E5A] text-[11px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{f.question}</h4>
                          {f.category && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {f.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed ps-7">{f.answer}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditFaq(f)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-[#065E5A]"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteCandidate(f);
                            setIsDeleteModalOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* SUB-TAB 2: POLICIES */}
      {subTab === 'policies' && (
        <form onSubmit={handleSavePolicies} className="space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">بنود سياسة العمل والشروط والأحكام</h3>
                <span className="text-xs text-slate-400">تظهر هذه النصوص في صفحة الشروط والسياسات (/policies)</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetPolicies}
                className="text-xs gap-1 border-slate-300 text-slate-600 hover:text-rose-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة المسودة الافتراضية</span>
              </Button>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Policy 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#065E5A]" />
                  <Label className="font-bold text-slate-900 text-xs">
                    1. سياسة التصميم واعتماد النماذج الأولية (Design Proofing)
                  </Label>
                </div>
                <Textarea
                  rows={3}
                  value={designProofing}
                  onChange={(e) => setDesignProofing(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Policy 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#065E5A]" />
                  <Label className="font-bold text-slate-900 text-xs">
                    2. معايير الطباعة ومطابقة الألوان وخامات القطن (Printing & Colors)
                  </Label>
                </div>
                <Textarea
                  rows={3}
                  value={colorAndPrinting}
                  onChange={(e) => setColorAndPrinting(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Policy 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#065E5A]" />
                  <Label className="font-bold text-slate-900 text-xs">
                    3. سياسة الإلغاء والاسترجاع للمنتجات المخصصة (Refund & Cancellation)
                  </Label>
                </div>
                <Textarea
                  rows={3}
                  value={cancellationAndRefund}
                  onChange={(e) => setCancellationAndRefund(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Policy 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#065E5A]" />
                  <Label className="font-bold text-slate-900 text-xs">
                    4. سياسة الاستلام من مقر أسوان والشحن (Delivery & Aswan Pickup)
                  </Label>
                </div>
                <Textarea
                  rows={3}
                  value={deliveryAndPickup}
                  onChange={(e) => setDeliveryAndPickup(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Policy 5 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#065E5A]" />
                  <Label className="font-bold text-slate-900 text-xs">
                    5. سياسة الطلبيات المستعجلة والفعاليات (Rush Orders)
                  </Label>
                </div>
                <Textarea
                  rows={3}
                  value={rushOrders}
                  onChange={(e) => setRushOrders(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end p-4 bg-white rounded-2xl border border-slate-200">
            <Button
              type="submit"
              disabled={savingPolicies}
              className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-1.5 px-6"
            >
              <Save className="w-4 h-4" />
              <span>{savingPolicies ? 'جاري الحفظ...' : 'حفظ ونشر السياسات فورياً'}</span>
            </Button>
          </div>
        </form>
      )}

      {/* ADD / EDIT FAQ MODAL */}
      <Modal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        title={faqModalMode === 'add' ? 'إضافة سؤال شائع جديد' : 'تعديل السؤال الشائع'}
        description="صيغ السؤال والإجابة التي تظهر لعملاء الموقع في صفحة التواصل والمساعدة."
        className="max-w-md bg-white"
      >
        <form onSubmit={handleSaveFaq} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>نص السؤال *</Label>
            <Input
              required
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="مثال: هل يمكن استلام الطلبات من مقر أسوان مباشرة؟"
            />
          </div>

          <div className="space-y-1">
            <Label>التصنيف</Label>
            <Input
              value={faqCategory}
              onChange={(e) => setFaqCategory(e.target.value)}
              placeholder="عام / التصميم / التسليم / الخامات"
            />
          </div>

          <div className="space-y-1">
            <Label>الإجابة التفصيلية *</Label>
            <Textarea
              required
              rows={4}
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="اكتب الإجابة الشافية للعميل..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsFaqModalOpen(false)} className="text-xs">
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs">
              {faqModalMode === 'add' ? 'إضافة السؤال' : 'حفظ التعديل'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE FAQ MODAL */}
      {deleteCandidate && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteCandidate(null);
          }}
          title="تأكيد حذف السؤال"
          description={`هل أنت متأكد من رغبتك في حذف: "${deleteCandidate.question}"؟`}
          className="max-w-md bg-white"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteCandidate(null);
                }}
                className="text-xs"
              >
                تراجع
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteFaqConfirm} className="text-xs gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>تأكيد الحذف</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
