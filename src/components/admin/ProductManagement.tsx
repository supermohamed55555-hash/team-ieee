import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Tag,
  Shirt,
  Smartphone,
  Coffee,
  Palette,
  RotateCcw,
  Check,
  X,
  Layers,
  Sliders,
  SlidersHorizontal,
  Boxes,
  Minus,
  AlertTriangle,
  ShoppingBag,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input, Textarea, Label } from '../ui/input';
import { Modal } from '../ui/modal';
import {
  CatalogProduct,
  CatalogBaseType,
  ProductColor,
  COMMON_COLORS,
  getCatalogProducts,
  computeTotalStock,
  getStockStatus,
  isProductVisible,
  DEFAULT_CLOTHING_SIZES,
  EXTENDED_CLOTHING_SIZES,
  DEFAULT_STICKER_SIZES,
  DEFAULT_PHONE_SIZES
} from '../../lib/products-data';
import {
  saveCatalogProduct,
  deleteCatalogProduct,
  toggleProductVisibility,
  updateProductStock,
  resetCatalogProducts
} from '../../lib/mock-api';

interface ProductManagementProps {
  onNotification?: (msg: string) => void;
  onCountChange?: (count: number) => void;
}

const CATEGORIES = [
  { id: 'clothing', label: 'ملابس وهوديز' },
  { id: 'caps', label: 'كابات ومطرزات' },
  { id: 'mugs-gifts', label: 'مجّات وهدايا' },
  { id: 'stickers', label: 'استيكرات ولواصق' },
  { id: 'phone-cases', label: 'جرابات هواتف' },
  { id: 'other', label: 'منتجات أخرى' },
];

const BASE_TYPES: { id: CatalogBaseType; label: string }[] = [
  { id: 'hoodie', label: 'هودي (Hoodie - خامة ميلتون)' },
  { id: 'tshirt', label: 'تيشيرت (T-Shirt - خامة قطن)' },
  { id: 'cap', label: 'كاب (Cap - بيسبول مطرز)' },
  { id: 'mug', label: 'مج سيراميك (Ceramic Mug)' },
  { id: 'sticker', label: 'استيكر فينيل (Die-Cut Sticker)' },
  { id: 'case', label: 'جراب هاتف (Phone Case)' },
  { id: 'custom', label: 'منتج مخصص بصورة خاصة' },
];

const PRESET_IMAGES = [
  { label: 'هودي أسود فاخر', url: '/services-cards/card-hoodie.png' },
  { label: 'تيشيرت أبيض كلاسيك', url: '/products/tshirt-white-front.png' },
  { label: 'كاب بيسبول مطرز', url: '/services-cards/card-cap.png' },
  { label: 'مج سيراميك حراري', url: '/services-cards/card-mugs.png' },
  { label: 'استيكرات Die-Cut', url: '/services-cards/card-stickers.png' },
  { label: 'جراب هاتف ضد الصدمات', url: '/services-cards/card-cases.png' },
];

export const ProductManagement: React.FC<ProductManagementProps> = ({ onNotification, onCountChange }) => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'hidden' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<CatalogProduct['category']>('clothing');
  const [formBaseType, setFormBaseType] = useState<CatalogBaseType>('hoodie');
  const [formPrice, setFormPrice] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/services-cards/card-hoodie.png');
  const [formBadge, setFormBadge] = useState('');
  const [formIsHidden, setFormIsHidden] = useState(false);
  const [formColors, setFormColors] = useState<ProductColor[]>([
    COMMON_COLORS.black,
    COMMON_COLORS.white,
    COMMON_COLORS.green,
  ]);

  // Inventory & Sizes Form State
  const [formHasSizes, setFormHasSizes] = useState(true);
  const [formStock, setFormStock] = useState(50);
  const [formSizeStock, setFormSizeStock] = useState<Record<string, number>>({
    S: 15,
    M: 30,
    L: 45,
    XL: 25,
    XXL: 10,
  });
  const [formLowStockThreshold, setFormLowStockThreshold] = useState(10);
  const [newCustomSizeName, setNewCustomSizeName] = useState('');
  const [newCustomSizeQty, setNewCustomSizeQty] = useState<number>(20);

  // Color input state
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#0B5F55');

  // Quick Stock Edit Modal State
  const [stockModalProduct, setStockModalProduct] = useState<CatalogProduct | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [quickSizeStock, setQuickSizeStock] = useState<Record<string, number>>({});
  const [quickSingleStock, setQuickSingleStock] = useState<number>(0);
  const [isQuickSaving, setIsQuickSaving] = useState(false);

  // Delete Confirmation Modal
  const [deleteCandidate, setDeleteCandidate] = useState<CatalogProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Feedback banner
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getCatalogProducts();
      setProducts(data);
      if (onCountChange) onCountChange(data.length);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تحميل بيانات المنتجات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleSync = () => loadProducts();
    window.addEventListener('yuzersef-products-updated', handleSync);
    return () => window.removeEventListener('yuzersef-products-updated', handleSync);
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    if (onNotification) onNotification(text);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // Open modal to add new product
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormName('');
    setFormSubtitle('منتج مخصص جديد للتطريز والطباعة');
    setFormCategory('clothing');
    setFormBaseType('hoodie');
    setFormPrice('يبدأ من 220 ج.م');
    setFormMaterial('قطن مصري 100% فاخر');
    setFormDescription('خامة قطنية ممتازة مجهزة لطباعة DTF وتطريز الشعار بدقة متناهية.');
    setFormImageUrl('/services-cards/card-hoodie.png');
    setFormBadge('جديد');
    setFormIsHidden(false);
    setFormHasSizes(true);
    setFormSizeStock({
      S: 15,
      M: 30,
      L: 45,
      XL: 25,
      XXL: 10,
    });
    setFormStock(125);
    setFormLowStockThreshold(10);
    setFormColors([
      COMMON_COLORS.black,
      COMMON_COLORS.white,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
    ]);
    setIsModalOpen(true);
  };

  // Open modal to edit existing product
  const handleOpenEditModal = (product: CatalogProduct) => {
    setModalMode('edit');
    setEditingId(product.id);
    setFormName(product.name);
    setFormSubtitle(product.subtitle || '');
    setFormCategory(product.category);
    setFormBaseType(product.baseType || 'hoodie');
    setFormPrice(product.price);
    setFormMaterial(product.material || '');
    setFormDescription(product.description || '');
    setFormImageUrl(product.imageUrl || '/services-cards/card-hoodie.png');
    setFormBadge(product.badge || '');
    
    // Visibility
    const hidden = product.isHidden ?? !product.isActive;
    setFormIsHidden(hidden);

    // Inventory & Sizes
    const hasSizes = typeof product.hasSizes === 'boolean'
      ? product.hasSizes
      : Boolean(product.sizeStock && Object.keys(product.sizeStock).length > 0);
    setFormHasSizes(hasSizes);

    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      setFormSizeStock({ ...product.sizeStock });
    } else {
      setFormSizeStock({ S: 15, M: 30, L: 45, XL: 25, XXL: 10 });
    }

    setFormStock(computeTotalStock(product));
    setFormLowStockThreshold(product.lowStockThreshold || 10);
    setFormColors(product.colors || [COMMON_COLORS.black, COMMON_COLORS.white]);
    setIsModalOpen(true);
  };

  // Quick Open Stock Modal
  const handleOpenQuickStockModal = (product: CatalogProduct) => {
    setStockModalProduct(product);
    if (product.hasSizes && product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      setQuickSizeStock({ ...product.sizeStock });
    } else {
      setQuickSizeStock({ 'مقاس موحد': computeTotalStock(product) });
    }
    setQuickSingleStock(computeTotalStock(product));
    setIsStockModalOpen(true);
  };

  // Quick Save Stock
  const handleSaveQuickStock = async () => {
    if (!stockModalProduct) return;
    setIsQuickSaving(true);
    try {
      let updatedTotal = 0;
      let finalSizeStock: Record<string, number> | undefined = undefined;

      if (stockModalProduct.hasSizes) {
        finalSizeStock = quickSizeStock;
        updatedTotal = Object.values(quickSizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0);
      } else {
        updatedTotal = Math.max(0, quickSingleStock);
      }

      await updateProductStock(stockModalProduct.id, updatedTotal, finalSizeStock);
      await loadProducts();
      showFeedback('success', `تم تحديث مخزون "${stockModalProduct.name}" بنجاح! الإجمالي: ${updatedTotal} قطعة.`);
      setIsStockModalOpen(false);
      setStockModalProduct(null);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تحديث المخزون.');
    } finally {
      setIsQuickSaving(false);
    }
  };

  // Step quantity in quick stock modal
  const handleQuickSizeStep = (size: string, delta: number) => {
    setQuickSizeStock((prev) => {
      const current = prev[size] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [size]: next };
    });
  };

  // Batch increment quick stock
  const handleQuickBatchAdd = (amount: number) => {
    setQuickSizeStock((prev) => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([s, q]) => {
        updated[s] = Math.max(0, (q || 0) + amount);
      });
      return updated;
    });
  };

  // Presets for sizes
  const handleApplyPresetSizes = (presetType: 'clothing' | 'clothing_extended' | 'stickers' | 'free_size') => {
    if (presetType === 'clothing') {
      setFormSizeStock({ S: 15, M: 30, L: 45, XL: 25, XXL: 10 });
    } else if (presetType === 'clothing_extended') {
      setFormSizeStock({ S: 15, M: 30, L: 45, XL: 25, XXL: 15, '3XL': 10 });
    } else if (presetType === 'stickers') {
      setFormSizeStock({ 'صغير (5x5 سم)': 100, 'وسط (10x10 سم)': 60, 'كبير (15x15 سم)': 30 });
    } else if (presetType === 'free_size') {
      setFormSizeStock({ 'مقاس موحد (Free Size)': 50 });
    }
  };

  // Add custom size row in main edit form
  const handleAddCustomSize = () => {
    if (!newCustomSizeName.trim()) return;
    const cleanName = newCustomSizeName.trim();
    setFormSizeStock((prev) => ({
      ...prev,
      [cleanName]: Math.max(0, Number(newCustomSizeQty) || 0),
    }));
    setNewCustomSizeName('');
    setNewCustomSizeQty(20);
  };

  // Remove a size row in main edit form
  const handleRemoveSizeRow = (sizeName: string) => {
    setFormSizeStock((prev) => {
      const copy = { ...prev };
      delete copy[sizeName];
      return copy;
    });
  };

  // Change a specific size quantity in main edit form
  const handleFormSizeQtyChange = (sizeName: string, value: number) => {
    setFormSizeStock((prev) => ({
      ...prev,
      [sizeName]: Math.max(0, value),
    }));
  };

  // Add custom color to form
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const colorId = `color-${Date.now()}`;
    setFormColors([...formColors, { id: colorId, name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  // Remove color
  const handleRemoveColor = (id: string) => {
    if (formColors.length <= 1) {
      alert('يجب أن يحتوي المنتج على لون واحد على الأقل.');
      return;
    }
    setFormColors(formColors.filter((c) => c.id !== id));
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      alert('يرجى كتابة اسم المنتج.');
      return;
    }

    try {
      const categoryObj = CATEGORIES.find((c) => c.id === formCategory);
      const categoryLabel = categoryObj ? categoryObj.label : 'منتجات أخرى';

      const totalCalculatedStock = formHasSizes
        ? Object.values(formSizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0)
        : Math.max(0, Number(formStock) || 0);

      const productPayload: CatalogProduct = {
        id: modalMode === 'edit' && editingId ? editingId : `prod-${Date.now()}`,
        name: formName.trim(),
        subtitle: formSubtitle.trim(),
        description: formDescription.trim(),
        material: formMaterial.trim(),
        category: formCategory,
        categoryLabel,
        price: formPrice.trim() || 'يبدأ من 100 ج.م',
        baseType: formBaseType,
        imageUrl: formImageUrl.trim() || '/services-cards/card-hoodie.png',
        badge: formBadge.trim() || undefined,
        isActive: !formIsHidden,
        isHidden: formIsHidden,
        hasSizes: formHasSizes,
        sizeStock: formHasSizes ? formSizeStock : undefined,
        stock: totalCalculatedStock,
        lowStockThreshold: Math.max(1, Number(formLowStockThreshold) || 10),
        colors: formColors,
        defaultColor: formColors[0]?.id || 'black',
        views: [
          { id: 'front', label: 'الواجهة الأمامية' },
          { id: 'back', label: 'الجهة الخلفية' },
        ],
        defaultView: 'front',
        createdAt: new Date().toISOString(),
        defaultZones: [
          {
            id: 'zone-main',
            name: 'منطقة الطباعة الرئيسية',
            view: 'front',
            shape: 'round',
            x: 260,
            y: 260,
            w: 280,
            h: 280,
            cmWidth: 28,
            cmHeight: 28,
          },
        ],
      };

      await saveCatalogProduct(productPayload);
      await loadProducts();
      showFeedback(
        'success',
        `تم حفظ المنتج "${productPayload.name}" بنجاح! المخزون: ${totalCalculatedStock} قطعة (${productPayload.isHidden ? 'مخفي' : 'ظاهر'}).`
      );
      setIsModalOpen(false);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء حفظ المنتج.');
    }
  };

  // Toggle visibility status directly from table (Hidden vs Visible)
  const handleToggleVisibility = async (product: CatalogProduct) => {
    try {
      const updated = await toggleProductVisibility(product.id);
      if (updated) {
        await loadProducts();
        const isHidden = updated.isHidden ?? !updated.isActive;
        showFeedback(
          'success',
          isHidden
            ? `تم إخفاء المنتج "${updated.name}" عن زوار المتجر بنجاح!`
            : `تم إظهار وتفعيل المنتج "${updated.name}" في المتجر بنجاح!`
        );
      }
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تغيير حالة ظهور المنتج.');
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteCatalogProduct(deleteCandidate.id);
      await loadProducts();
      showFeedback('success', `تم حذف المنتج "${deleteCandidate.name}" بنجاح!`);
      setIsDeleteModalOpen(false);
      setDeleteCandidate(null);
    } catch {
      showFeedback('error', 'حدث خطأ أثناء حذف المنتج.');
    }
  };

  // Reset to default
  const handleResetCatalog = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة كتالوج المنتجات الافتراضي؟ سيتم إعادة ضبط التعديلات والمخزون.')) {
      await resetCatalogProducts();
      await loadProducts();
      showFeedback('success', 'تمت استعادة كتالوج المنتجات الافتراضي بنجاح.');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    const visible = isProductVisible(p);
    const stock = computeTotalStock(p);
    const lowThresh = p.lowStockThreshold || 10;

    let matchesStatus = true;
    if (statusFilter === 'visible') matchesStatus = visible;
    else if (statusFilter === 'hidden') matchesStatus = !visible;
    else if (statusFilter === 'in_stock') matchesStatus = stock > lowThresh;
    else if (statusFilter === 'low_stock') matchesStatus = stock > 0 && stock <= lowThresh;
    else if (statusFilter === 'out_of_stock') matchesStatus = stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Aggregate KPI stats
  const totalStockUnits = products.reduce((acc, p) => acc + computeTotalStock(p), 0);
  const visibleCount = products.filter((p) => isProductVisible(p)).length;
  const hiddenCount = products.filter((p) => !isProductVisible(p)).length;
  const outOfStockCount = products.filter((p) => computeTotalStock(p) === 0).length;
  const lowStockCount = products.filter((p) => {
    const s = computeTotalStock(p);
    return s > 0 && s <= (p.lowStockThreshold || 10);
  }).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all shadow-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
              : 'bg-rose-50 text-rose-950 border border-rose-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0B5F55]" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              إدارة كتالوج المنتجات والمخزون (Inventory & Catalog Management)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المخزون الإجمالي وتوزيع المقاسات لكل منتج، والتحكم الفوري في إظهار أو إخفاء أي منتج عن الزوار.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetCatalog}
            className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
            title="استعادة المنتجات والمخزون الافتراضي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الكتالوج</span>
          </Button>

          <Button
            type="button"
            onClick={handleOpenAddModal}
            size="sm"
            className="bg-[#0B5F55] hover:bg-[#073B35] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Products */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">إجمالي المنتجات</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-slate-900">{products.length}</span>
                <span className="text-[10px] text-slate-400">({totalStockUnits} قطعة مخزون)</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Visible Products */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">معروضة في المتجر (ظاهرة)</span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">{visibleCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Hidden Products */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">مخفية مؤقتاً</span>
              <span className="text-xl font-black text-amber-700 mt-0.5 block">{hiddenCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Out of stock / Low alerts */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">تنبيهات المخزون</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {outOfStockCount > 0 ? (
                  <span className="text-sm font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {outOfStockCount} نفد
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700">لا يوجد نواقص</span>
                )}
                {lowStockCount > 0 && (
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                    {lowStockCount} منخفض
                  </span>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المنتج، القسم، أو الوصف..."
            className="pr-10 text-xs bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">جميع الأقسام</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status & Visibility Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">كل الحالات والمخزون</option>
            <option value="visible">👁️ الظاهرة بالمتجر فقط ({visibleCount})</option>
            <option value="hidden">🙈 المخفية فقط ({hiddenCount})</option>
            <option value="in_stock">🟢 متوفر بالمخزون</option>
            <option value="low_stock">🟡 مخزون منخفض</option>
            <option value="out_of_stock">🔴 نفد من المخزون ({outOfStockCount})</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Card className="bg-white border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500 font-bold">
              جاري تحميل المنتجات والمخزون...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">لا توجد منتجات مطابقة لخيارات الفلترة.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                }}
                className="text-xs"
              >
                إعادة ضبط الفلتر
              </Button>
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">المنتج</th>
                  <th className="py-3 px-4">القسم والقالب</th>
                  <th className="py-3 px-4">السعر</th>
                  <th className="py-3 px-4">المخزون والمقاسات</th>
                  <th className="py-3 px-4">حالة الظهور</th>
                  <th className="py-3 px-4">الألوان</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const visible = isProductVisible(p);
                  const totalStock = computeTotalStock(p);
                  const stockInfo = getStockStatus(totalStock, p.lowStockThreshold || 10);
                  const hasSizes = Boolean(p.hasSizes && p.sizeStock && Object.keys(p.sizeStock).length > 0);

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors hover:bg-slate-50/70 ${
                        !visible ? 'bg-slate-50/40 text-slate-600' : ''
                      }`}
                    >
                      {/* Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-12 h-12 object-contain rounded-lg bg-[#F6F1E7] border border-slate-200 p-1"
                            />
                            {!visible && (
                              <span
                                className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-0.5 text-[9px] shadow-xs"
                                title="منتج مخفي"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-slate-900 leading-snug line-clamp-1">{p.name}</p>
                              {!visible && (
                                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                                  مخفي
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{p.subtitle || p.material}</p>
                            {p.badge && (
                              <Badge className="text-[9px] bg-[#E3A92F] text-[#3A2A00] font-black px-1.5 py-0 mt-1">
                                {p.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mockup Base Type & Category */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">{p.categoryLabel}</span>
                          <span className="font-medium text-slate-500 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {p.baseType === 'hoodie' && 'هودي (Hoodie)'}
                            {p.baseType === 'tshirt' && 'تيشيرت (T-Shirt)'}
                            {p.baseType === 'cap' && 'كاب (Cap)'}
                            {p.baseType === 'mug' && 'مج (Mug)'}
                            {p.baseType === 'sticker' && 'استيكر (Sticker)'}
                            {p.baseType === 'case' && 'جراب (Case)'}
                            {p.baseType === 'custom' && 'منتج مخصص'}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0B5F55]">{p.price}</span>
                      </td>

                      {/* Stock & Sizes Column */}
                      <td className="py-3 px-4">
                        <div className="space-y-1.5 max-w-xs">
                          {/* Stock Summary Badge + Quick Edit Button */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-black border flex items-center gap-1 ${stockInfo.badgeClass}`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: stockInfo.color }}
                              />
                              <span>{stockInfo.label}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenQuickStockModal(p)}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-[#0B5F55] hover:text-white text-slate-600 text-[10px] font-bold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="تعديل كميات المخزون والمقاسات سريعاً"
                            >
                              <SlidersHorizontal className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>
                          </div>

                          {/* Sizes Breakdown Chips */}
                          {hasSizes && p.sizeStock ? (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(p.sizeStock).map(([sizeKey, qty]) => {
                                const isZero = Number(qty) <= 0;
                                return (
                                  <span
                                    key={sizeKey}
                                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                                      isZero
                                        ? 'bg-rose-50 text-rose-600 border-rose-200 line-through'
                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                    }`}
                                    title={`مقاس ${sizeKey}: ${qty} قطعة متوفرة`}
                                  >
                                    {sizeKey}: <strong className="font-black">{qty}</strong>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              منتج بمقاس موحد
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visibility Status (Hidden vs Visible Toggle Button) */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(p)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs ${
                            visible
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                          }`}
                          title={visible ? 'المنتج معروض في المتجر - انقر لإخفائه' : 'المنتج مخفي عن الزوار - انقر لإظهاره'}
                        >
                          {visible ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ظاهر بالمتجر</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>مخفي عن الزوار</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Colors */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {p.colors.slice(0, 4).map((c) => (
                            <span
                              key={c.id}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {p.colors.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-bold">+{p.colors.length - 4}</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Stock Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenQuickStockModal(p)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0B5F55] text-[#0B5F55] hover:bg-[#F6F1E7] transition-colors cursor-pointer"
                            title="تعديل المخزون والمقاسات"
                          >
                            <Boxes className="w-4 h-4" />
                          </button>

                          {/* Open in Customizer */}
                          <Link
                            to={`/customize/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-100 transition-colors"
                            title="معاينة وتخصيص اللوجو للمنتج"
                          >
                            <Palette className="w-4 h-4 text-slate-600" />
                          </Link>

                          {/* Full Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="تعديل كافة بيانات المنتج والمقاسات"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteCandidate(p);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 hover:border-rose-400 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          1. Quick Stock Edit Modal (نافذة التعديل السريع للمخزون)
      ───────────────────────────────────────────────────────────── */}
      {stockModalProduct && (
        <Modal
          isOpen={isStockModalOpen}
          onClose={() => {
            setIsStockModalOpen(false);
            setStockModalProduct(null);
          }}
          title={`تعديل مخزون: ${stockModalProduct.name}`}
          description="تحديث كميات القطع والمقاسات المتوفرة في المستودع فورياً."
          className="max-w-xl bg-white"
        >
          <div className="space-y-4 pt-1 text-right text-xs">
            {/* Product summary card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={stockModalProduct.imageUrl}
                alt={stockModalProduct.name}
                className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 line-clamp-1">{stockModalProduct.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span>{stockModalProduct.price}</span>
                  <span>·</span>
                  <span>{stockModalProduct.categoryLabel}</span>
                  <span>·</span>
                  <span className={stockModalProduct.isHidden ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {stockModalProduct.isHidden ? 'مخفي عن الزوار' : 'ظاهر في المتجر'}
                  </span>
                </div>
              </div>
            </div>

            {/* If product has sizes */}
            {stockModalProduct.hasSizes ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-slate-800">
                    توزيع المخزون لكل مقاس ({Object.keys(quickSizeStock).length} مقاسات)
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickBatchAdd(5)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      +5 للكل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBatchAdd(10)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      +10 للكل
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                  {Object.entries(quickSizeStock).map(([sizeName, qty]) => (
                    <div
                      key={sizeName}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <div>
                        <span className="font-black text-slate-900 text-xs block">مقاس {sizeName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {qty <= 0 ? '⚠️ نفد من المخزون' : `${qty} قطعة متوفرة`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickSizeStep(sizeName, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                          title="طرح قطعة"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <Input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            setQuickSizeStock((prev) => ({ ...prev, [sizeName]: val }));
                          }}
                          className="w-16 h-7 text-center font-black text-xs p-1"
                        />

                        <button
                          type="button"
                          onClick={() => handleQuickSizeStep(sizeName, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                          title="إضافة قطعة"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Computed Sum */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-xs">إجمالي المخزون الجديد:</span>
                  <span className="text-sm font-black text-emerald-800">
                    {Object.values(quickSizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0)} قطعة
                  </span>
                </div>
              </div>
            ) : (
              /* Single Product Stock Input */
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Label className="font-bold text-slate-800 block text-xs">
                  الكمية الإجمالية المتوفرة في المخزون
                </Label>
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickSingleStock((prev) => Math.max(0, prev - 5))}
                    className="text-xs font-bold"
                  >
                    -5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickSingleStock((prev) => Math.max(0, prev - 1))}
                    className="text-xs font-bold"
                  >
                    -1
                  </Button>
                  <Input
                    type="number"
                    min={0}
                    value={quickSingleStock}
                    onChange={(e) => setQuickSingleStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 h-9 text-center font-black text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickSingleStock((prev) => prev + 1)}
                    className="text-xs font-bold"
                  >
                    +1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickSingleStock((prev) => prev + 5)}
                    className="text-xs font-bold"
                  >
                    +5
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsStockModalOpen(false);
                  setStockModalProduct(null);
                }}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveQuickStock}
                disabled={isQuickSaving}
                className="bg-[#0B5F55] hover:bg-[#073B35] text-white font-bold"
              >
                {isQuickSaving ? 'جاري الحفظ...' : 'حفظ تحديث المخزون'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Modal for Adding or Editing Product (Full Form)
      ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'إضافة منتج جديد للكتالوج والاستوديو' : 'تعديل بيانات المنتج والمخزون'}
        description="سيظهر المنتج مباشرة في صفحة المنتجات واستوديو تخصيص الشعار وفق حالة ظهوره."
        className="max-w-3xl bg-white"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 pt-1 text-right text-xs max-h-[80vh] overflow-y-auto px-1">
          {/* Visibility Status Selection Cards */}
          <div className="space-y-2">
            <Label className="font-bold text-slate-800">حالة ظهور المنتج في المتجر (Visibility) *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Visible */}
              <div
                onClick={() => setFormIsHidden(false)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  !formIsHidden
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    !formIsHidden ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 block text-xs">👁️ ظاهر في المتجر (نشط)</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                    يظهر للعملاء في الكتالوج والمصمم التفاعلي ويمكن إضافته للسلة وطلبه مباشرة.
                  </span>
                </div>
              </div>

              {/* Option 2: Hidden */}
              <div
                onClick={() => setFormIsHidden(true)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  formIsHidden
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    formIsHidden ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 block text-xs">🙈 مخفي عن الزوار (مؤقتاً)</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                    يتم حجب المنتج تماماً من المتجر دون حذفه، ويمكنك إعادة إظهاره في أي لحظة.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <Label>اسم المنتج بالعربية *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="مثال: هودي يوزرسيف أوفر سايز فاخر"
                required
              />
            </div>

            <div>
              <Label>قالب الموك أب التفاعلي (Mockup Engine) *</Label>
              <select
                value={formBaseType}
                onChange={(e) => setFormBaseType(e.target.value as CatalogBaseType)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800"
              >
                {BASE_TYPES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>القسم *</Label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>السعر / يبدأ من *</Label>
              <Input
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="مثال: 290 ج.م أو يبدأ من 180 ج.م"
                required
              />
            </div>

            <div>
              <Label>شارة التميز (Badge - اختياري)</Label>
              <Input
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                placeholder="مثال: الأكثر طلباً، تطريز 3D"
              />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NEW: Section for Inventory & Sizes
          ───────────────────────────────────────────────────────────── */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#0B5F55]" />
                <h3 className="font-black text-slate-900 text-xs">إدارة المخزون والمقاسات (Stock & Sizes)</h3>
              </div>

              {/* Toggle Has Sizes */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formHasSizes}
                  onChange={(e) => setFormHasSizes(e.target.checked)}
                  className="rounded text-[#0B5F55] focus:ring-[#0B5F55]"
                />
                <span>تتبع المخزون حسب المقاسات (S, M, L, XL...)</span>
              </label>
            </div>

            {formHasSizes ? (
              <div className="space-y-3">
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold ml-1">قوالب مقاسات سريعة:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSizes('clothing')}
                    className="px-2 py-1 text-[10px] font-bold rounded-md border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                  >
                    مقاسات ملابس (S إلى XXL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSizes('clothing_extended')}
                    className="px-2 py-1 text-[10px] font-bold rounded-md border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                  >
                    ملابس كاملة مع 3XL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSizes('stickers')}
                    className="px-2 py-1 text-[10px] font-bold rounded-md border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                  >
                    مقاسات استيكرات (صغير، وسط، كبير)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSizes('free_size')}
                    className="px-2 py-1 text-[10px] font-bold rounded-md border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                  >
                    مقاس موحد (Free Size)
                  </button>
                </div>

                {/* Size rows */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(formSizeStock).map(([sizeName, qty]) => (
                    <div
                      key={sizeName}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 shadow-2xs"
                    >
                      <span className="font-black text-slate-800 text-xs">{sizeName}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => handleFormSizeQtyChange(sizeName, parseInt(e.target.value) || 0)}
                          className="w-16 h-7 text-center font-bold text-xs p-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeRow(sizeName)}
                          className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                          title="حذف هذا المقاس"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new size input */}
                <div className="flex items-center gap-2 pt-1 max-w-sm">
                  <Input
                    value={newCustomSizeName}
                    onChange={(e) => setNewCustomSizeName(e.target.value)}
                    placeholder="اسم المقاس (مثال: 4XL أو 11oz)"
                    className="h-8 text-xs flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={newCustomSizeQty}
                    onChange={(e) => setNewCustomSizeQty(parseInt(e.target.value) || 0)}
                    placeholder="الكمية"
                    className="h-8 w-20 text-xs text-center"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCustomSize}
                    className="h-8 text-xs font-bold"
                  >
                    إضافة مقاس
                  </Button>
                </div>

                {/* Real-time total calculated stock */}
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">إجمالي المخزون المحسوب لكل المقاسات:</span>
                  <span className="text-xs font-black text-emerald-800">
                    {Object.values(formSizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0)} قطعة
                  </span>
                </div>
              </div>
            ) : (
              /* Single stock input if no sizes */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>إجمالي الكمية المتوفرة في المخزون (قطع) *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Math.max(0, parseInt(e.target.value) || 0))}
                    required
                  />
                </div>
                <div>
                  <Label>حد تنبيه انخفاض المخزون (قطع)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formLowStockThreshold}
                    onChange={(e) => setFormLowStockThreshold(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>الخامة والمواصفة الفنية</Label>
              <Input
                value={formMaterial}
                onChange={(e) => setFormMaterial(e.target.value)}
                placeholder="مثال: قطن مصري 100% ميلتون مبطن 380 GSM"
              />
            </div>

            <div>
              <Label>عنوان فرعي مختصر</Label>
              <Input
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="مثال: معاينة تصميم وطباعة تجريبية بأسوان"
              />
            </div>
          </div>

          <div>
            <Label>الوصف الكامل للمنتج</Label>
            <Textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="اكتب تفاصيل مواصفات المنتج وطرق الطباعة والتطريز المتاحة له..."
            />
          </div>

          {/* Image Selection */}
          <div className="space-y-2">
            <Label>رابط صورة المنتج أو اختر من القوالب الجاهزة</Label>
            <Input
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              placeholder="/services-cards/card-hoodie.png أو رابط صورة خارجية"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-bold block ml-2">صور جاهزة سريعة:</span>
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setFormImageUrl(img.url)}
                  className="px-2 py-1 text-[10px] font-bold rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes Management */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <Label>الألوان المتاحة للمنتج في المعاينة</Label>
            <div className="flex flex-wrap gap-2 items-center">
              {formColors.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c.id)}
                    className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add color input */}
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded-lg border-none cursor-pointer p-0"
              />
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="اسم اللون (مثال: أزرق سماوي)"
                className="h-8 text-xs flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddColor}
                className="h-8 text-xs font-bold"
              >
                إضافة لون
              </Button>
            </div>
          </div>

          {/* Bottom Save & Cancel Bar */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              الحالة المختارة:{' '}
              <strong className={formIsHidden ? 'text-amber-700' : 'text-emerald-700'}>
                {formIsHidden ? 'مخفي عن الزوار' : 'ظاهر في المتجر'}
              </strong>
            </span>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" size="sm" className="bg-[#0B5F55] hover:bg-[#073B35] text-white font-bold">
                {modalMode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات والمخزون'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────────────────────
          3. Delete Confirmation Modal
      ───────────────────────────────────────────────────────────── */}
      {deleteCandidate && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="تأكيد حذف المنتج"
          description="هل أنت متأكد من رغبتك في حذف هذا المنتج من الكتالوج؟"
          className="max-w-md bg-white"
        >
          <div className="space-y-4 pt-2 text-right">
            <p className="text-xs text-slate-600">
              سيتم حذف <strong>"{deleteCandidate.name}"</strong> نهائياً من الكتالوج واستوديو الموك أب.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button size="sm" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                تراجع
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDeleteConfirm}>
                تأكيد الحذف
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
