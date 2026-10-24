import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Percent,
  Copy,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input, Textarea, Label } from '../ui/input';
import { Modal } from '../ui/modal';
import { Coupon } from '../../lib/types';
import { getCoupons, saveCoupon, deleteCoupon, toggleCouponStatus } from '../../lib/mock-api';

interface CouponsManagementProps {
  onNotification?: (msg: string) => void;
}

export const CouponsManagement: React.FC<CouponsManagementProps> = ({ onNotification }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minQuantity, setMinQuantity] = useState<number | undefined>(undefined);
  const [minBudget, setMinBudget] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<Coupon | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تحميل الكوبونات.');
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

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinQuantity(undefined);
    setMinBudget(undefined);
    setDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setModalMode('edit');
    setEditingId(c.id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinQuantity(c.minQuantity);
    setMinBudget(c.minBudget);
    setDescription(c.description || '');
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('يرجى إدخال كود الخصم');
      return;
    }

    try {
      const couponPayload: Coupon = {
        id: editingId || `coupon-${Date.now()}`,
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue) || 1,
        minQuantity: minQuantity ? Number(minQuantity) : undefined,
        minBudget: minBudget ? Number(minBudget) : undefined,
        description: description.trim(),
        isActive,
        usageCount: editingId ? (coupons.find((c) => c.id === editingId)?.usageCount || 0) : 0,
      };

      await saveCoupon(couponPayload);
      await loadData();
      showFeedback('success', `تم ${modalMode === 'add' ? 'إضافة' : 'تحديث'} كود الخصم [${couponPayload.code}] بنجاح!`);
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err?.message || 'حدث خطأ أثناء حفظ الكوبون.');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleCouponStatus(id);
      if (updated) {
        setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
        showFeedback('success', `تم ${updated.isActive ? 'تفعيل' : 'تعطيل'} كود الخصم [${updated.code}]!`);
      }
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تغيير حالة الكود.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteCoupon(deleteCandidate.id);
      setCoupons((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
      showFeedback('success', `تم حذف كود الخصم [${deleteCandidate.code}] نهائياً.`);
      setIsDeleteModalOpen(false);
      setDeleteCandidate(null);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء الحذف.');
    }
  };

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

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
            <Tag className="w-5 h-5 text-[#065E5A]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              إدارة كوبونات الخصم والعروض الترويجية (Coupons Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وتعديل أكواد الخصم للجامعات والفرق ودفعات التخرج بأسوان، وتحديد شروط الخصم والحد الأدنى للكميات.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كود خصم جديد</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 bg-white text-center">
          <span className="text-xs text-slate-500 font-semibold block">إجمالي الأكواد المسجلة</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCoupons}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-center">
          <span className="text-xs text-emerald-700 font-semibold block">الأكواد النشطة حالياً</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{activeCoupons}</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-center">
          <span className="text-xs text-amber-700 font-semibold block">إجمالي مرات الاستخدام</span>
          <p className="text-2xl font-black text-amber-800 mt-1">{totalUses}</p>
        </div>
      </div>

      {/* Coupons List */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">قائمة كوبونات الخصم المتاحة</h3>
          <span className="text-xs text-slate-400">تُفحص الأكواد تلقائياً داخل معالج الطلبات (Request Wizard)</span>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">جاري تحميل الكوبونات...</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Tag className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">لا توجد كوبونات خصم حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => {
                const isCopied = copiedCode === c.code;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      c.isActive
                        ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                        : 'border-slate-200/60 bg-slate-50/60 opacity-70'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(c.code)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#065E5A] font-mono font-black text-sm flex items-center gap-1.5 hover:bg-teal-100 transition-colors cursor-pointer"
                            title="انقر لنسخ الكود"
                          >
                            <span>{c.code}</span>
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggle(c.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {c.isActive ? 'مفعّل' : 'متوقف'}
                        </button>
                      </div>

                      {/* Value Display */}
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#065E5A]">
                            {c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} ج.م`}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">خصم مباشر</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                      </div>

                      {/* Conditions */}
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                        {c.minQuantity ? (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E3A92F]" />
                            <span>الحد الأدنى: <strong>{c.minQuantity} قطع</strong></span>
                          </div>
                        ) : null}
                        {c.minBudget ? (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E3A92F]" />
                            <span>ميزانية لا تقل عن: <strong>{c.minBudget} ج.م</strong></span>
                          </div>
                        ) : null}
                        <div className="text-[10px] text-slate-400">مرات الاستخدام: {c.usageCount || 0} مرة</div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(c)}
                        className="h-8 text-xs gap-1 border-slate-300 text-slate-700 hover:text-[#065E5A]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteCandidate(c);
                          setIsDeleteModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'إنشاء كود خصم جديد' : `تعديل كود الخصم [${code}]`}
        description="حدد رمز الكود وقيمة الخصم والشروط المطلوبة لتطبيقه في معالج الطلبات."
        className="max-w-lg bg-white"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>رمز الكود (Code) *</Label>
              <Input
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="مثال: ASWAN15"
                className="font-mono font-bold uppercase"
              />
            </div>

            <div className="space-y-1">
              <Label>نوع الخصم *</Label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs bg-white"
              >
                <option value="percentage">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت (ج.م)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>قيمة الخصم *</Label>
              <Input
                type="number"
                min="1"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label>الحد الأدنى للقطع</Label>
              <Input
                type="number"
                min="1"
                value={minQuantity || ''}
                onChange={(e) => setMinQuantity(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="اختياري"
              />
            </div>

            <div className="space-y-1">
              <Label>الحد الأدنى للميزانية</Label>
              <Input
                type="number"
                min="1"
                value={minBudget || ''}
                onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="ج.م (اختياري)"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>الوصف الترويجي للكود</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: خصم 15% لطلبيات تخرج دفعات جامعة أسوان"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">تفعيل الكود للاستخدام الفوري</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#065E5A]"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#065E5A] hover:bg-[#012C2B] text-white text-xs">
              {modalMode === 'add' ? 'حفظ الكود الجديد' : 'تحديث الكود'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteCandidate(null);
          }}
          title="تأكيد حذف كود الخصم"
          description={`هل أنت متأكد من رغبتك في حذف الكود [${deleteCandidate.code}] نهائياً؟`}
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
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm} className="text-xs gap-1">
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
