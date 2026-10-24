import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  RotateCw,
  Eye,
  Layers,
  Palette,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  Check,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  ProductItem,
  ProductType,
  TURNTABLE_ANGLES,
  getProductImagePath,
  getProductsForService,
  getLogoOverlayPath
} from '../lib/products-data';
import { InteractiveCustomizer } from './InteractiveCustomizer';

interface ProductStudioProps {
  serviceId?: string;
  defaultProductId?: ProductType;
  className?: string;
}

export const ProductStudio: React.FC<ProductStudioProps> = ({
  serviceId,
  defaultProductId,
  className = '',
}) => {
  const availableProducts = serviceId ? getProductsForService(serviceId) : [];
  const initialProduct =
    (defaultProductId && availableProducts.find((p) => p.id === defaultProductId)) ||
    availableProducts[0] ||
    null;

  const [studioMode, setStudioMode] = useState<'360' | 'vector'>('360');
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(initialProduct);
  const [selectedColor, setSelectedColor] = useState<string>(
    initialProduct?.defaultColor || 'white'
  );
  const [selectedView, setSelectedView] = useState<string>(
    initialProduct?.defaultView || 'front'
  );
  const [turntableIndex, setTurntableIndex] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);

  // Overlay state: 'logo' (transparent brand logo), 'custom' (user upload), or 'none'
  const [overlayType, setOverlayType] = useState<'logo' | 'custom' | 'none'>('logo');
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string | null>(null);
  const [customArtworkName, setCustomArtworkName] = useState<string>('');
  const [customPrintMode, setCustomPrintMode] = useState<'auto-blend' | 'contrast'>('auto-blend');

  // Drag-to-rotate state for Mug
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastIndexRef = useRef<number>(0);
  const studioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serviceId) {
      const prods = getProductsForService(serviceId);
      if (prods.length > 0) {
        const prod = (defaultProductId && prods.find((p) => p.id === defaultProductId)) || prods[0];
        setActiveProduct(prod);
        setSelectedColor(prod.defaultColor);
        setSelectedView(prod.defaultView);
        setTurntableIndex(0);
        setImageError(false);
      }
    }
  }, [serviceId, defaultProductId]);

  const handleProductChange = (prod: ProductItem) => {
    setActiveProduct(prod);
    setSelectedColor(prod.defaultColor);
    setSelectedView(prod.defaultView);
    setTurntableIndex(0);
    setImageError(false);
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    setImageError(false);
  };

  const handleViewSelect = (viewId: string) => {
    if (viewId === selectedView) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedView(viewId);
      setIsFading(false);
      setImageError(false);
    }, 180);
  };

  const currentAngle = activeProduct?.turntableAngles
    ? activeProduct.turntableAngles[turntableIndex % activeProduct.turntableAngles.length]
    : 0;

  const currentImagePath = activeProduct
    ? getProductImagePath(activeProduct.id, selectedColor, selectedView, currentAngle)
    : '';

  const currentLogoOverlayPath = getLogoOverlayPath(selectedColor);

  // Overlay anchor from single data entry per product/view (x, y, width)
  const currentAnchor =
    activeProduct?.overlayAnchors[selectedView] ||
    activeProduct?.overlayAnchors[activeProduct.defaultView] ||
    { x: 50, y: 40, width: 24 };

  const handleDragStart = (clientX: number) => {
    if (activeProduct?.id !== 'mug' || selectedColor !== 'white') return;
    isDraggingRef.current = true;
    startXRef.current = clientX;
    lastIndexRef.current = turntableIndex;
  };

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || activeProduct?.id !== 'mug' || selectedColor !== 'white') return;
    const deltaX = clientX - startXRef.current;
    const step = 28;
    const stepsShift = Math.floor(deltaX / step);

    if (stepsShift !== 0) {
      const anglesCount = TURNTABLE_ANGLES.length;
      let newIdx = (lastIndexRef.current - stepsShift) % anglesCount;
      if (newIdx < 0) newIdx += anglesCount;
      setTurntableIndex(newIdx);
    }
  }, [activeProduct, selectedColor]);

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const stepTurntable = (direction: 'next' | 'prev') => {
    if (!activeProduct?.turntableAngles) return;
    const count = activeProduct.turntableAngles.length;
    setTurntableIndex((prev) => (direction === 'next' ? (prev + 1) % count : (prev - 1 + count) % count));
  };

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomArtworkUrl(url);
      setCustomArtworkName(file.name);
      setOverlayType('custom');
    }
  };

  const clearCustomArtwork = () => {
    setCustomArtworkUrl(null);
    setCustomArtworkName('');
    setOverlayType('logo');
  };

  if (!activeProduct) {
    return null;
  }

  const isMugTurntableActive = activeProduct.id === 'mug' && selectedColor === 'white';
  const isDarkBase = selectedColor === 'black' || selectedColor === 'green' || selectedColor === 'grey';

  return (
    <Card className={`bg-[#EFEFEA] border-none shadow-none overflow-hidden ${className}`}>
      {/* Studio Header Bar */}
      <div className="bg-[#073B35] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B5F55] flex items-center justify-center text-[#E3A92F]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">استوديو معاينة المنتج (Live Studio)</span>
              <Badge variant="demo" className="bg-[#E3A92F]/20 text-[#E3A92F] border-[#E3A92F]/40 text-[10px] py-0 px-1.5 font-bold">
                معاينة مباشرة
              </Badge>
            </div>
            <p className="text-[11px] text-emerald-100/70">
              بدّل ألوان القطعة وزوايا العرض وشاهد موضع الطباعة بدقة واقعية
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#052925] p-1 rounded-xl border border-emerald-700/50">
            <button
              type="button"
              onClick={() => setStudioMode('360')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studioMode === '360'
                  ? 'bg-[#E3A92F] text-[#073B35] shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              استوديو 360° والألوان
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('vector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studioMode === 'vector'
                  ? 'bg-[#E3A92F] text-[#073B35] shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              مواضع الطباعة 2D
            </button>
          </div>

          {availableProducts.length > 1 && studioMode === '360' && (
            <div className="flex items-center gap-1.5 bg-[#0B5F55]/60 p-1 rounded-lg border border-emerald-600/30">
              {availableProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProductChange(p)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeProduct.id === p.id
                      ? 'bg-white text-[#073B35] shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.id === 'tshirt' ? 'تيشرت' : p.id === 'hoodie' ? 'هودي' : p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {studioMode === 'vector' ? (
        <div className="py-4">
          <InteractiveCustomizer />
        </div>
      ) : (
      <CardContent className="px-0 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EFEFEA]">
        {/* Left / Center: Interactive Preview Canvas (cols-7) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={studioContainerRef}
            className={`relative w-full aspect-square max-w-[420px] bg-[#EFEFEA] flex items-center justify-center overflow-hidden select-none touch-none ${
              isMugTurntableActive ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Demo Watermark Badge */}
            <div className="absolute top-3 start-3 z-30">
              <Badge className="bg-[#0B5F55] text-white border-none shadow-xs text-[10px] font-mono px-2 py-0.5">
                Demo • تجريبي
              </Badge>
            </div>

            {/* Turntable 360 Indicator if active */}
            {isMugTurntableActive && (
              <div className="absolute top-3 end-3 z-30 flex items-center gap-1 bg-[#EFEFEA]/90 text-slate-700 border border-slate-300/80 rounded-full px-2.5 py-0.5 text-[11px]">
                <RotateCw className="w-3 h-3 text-[#0B5F55] animate-spin motion-reduce:animate-none" />
                <span className="font-semibold">{currentAngle}° اسحب للتدوير 360°</span>
              </div>
            )}

            {/* BASE LAYER: Product Photo (blends seamlessly into #EFEFEA) */}
            {imageError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-200/50 flex items-center justify-center text-slate-400 mb-3">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold text-slate-600">صورة المنتج غير متوفرة حالياً</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs bg-white"
                  onClick={() => setImageError(false)}
                >
                  إعادة المحاولة
                </Button>
              </div>
            ) : (
              <div
                className={`relative w-full h-full flex items-center justify-center transition-opacity duration-200 motion-reduce:transition-none ${
                  isFading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <img
                  src={currentImagePath}
                  alt={`${activeProduct.name} - ${selectedColor}`}
                  className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />

                {/* OVERLAY LAYER: Logo or Custom Artwork with realistic print simulation */}
                {overlayType !== 'none' && (
                  <div
                    className="absolute pointer-events-none transition-all duration-200 motion-reduce:transition-none flex items-center justify-center"
                    style={{
                      left: `${currentAnchor.x}%`,
                      top: `${currentAnchor.y}%`,
                      width: `${currentAnchor.width}%`,
                      transform: 'translate(-50%, -50%)',
                      opacity:
                        isMugTurntableActive && currentAngle !== 0
                          ? currentAngle === 45 || currentAngle === 315
                            ? 0.35
                            : 0
                          : 1,
                    }}
                  >
                    {overlayType === 'logo' ? (
                      <img
                        src={currentLogoOverlayPath}
                        alt="Youzersef Logo"
                        className="w-full h-auto object-contain block pointer-events-none drop-shadow-xs"
                      />
                    ) : customArtworkUrl ? (
                      <img
                        src={customArtworkUrl}
                        alt="Custom Artwork"
                        className={`w-full h-auto object-contain block pointer-events-none ${
                          !isDarkBase && customPrintMode === 'auto-blend'
                            ? 'mix-blend-multiply'
                            : isDarkBase && customPrintMode === 'contrast'
                            ? 'filter brightness-125 contrast-110 drop-shadow-sm'
                            : 'drop-shadow-xs'
                        }`}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Turntable Quick Navigation Arrows for Mug */}
            {isMugTurntableActive && (
              <div className="absolute bottom-3 inset-x-4 flex justify-between items-center z-20 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepTurntable('prev');
                  }}
                  className="w-8 h-8 rounded-full bg-white/90 border border-slate-300 text-slate-700 shadow-xs flex items-center justify-center hover:bg-white cursor-pointer active:scale-95"
                  aria-label="تدوير لليمين"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0" />
                </button>
                <div className="bg-[#073B35]/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                  زاوية {currentAngle}° (8 زوايا)
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepTurntable('next');
                  }}
                  className="w-8 h-8 rounded-full bg-white/90 border border-slate-300 text-slate-700 shadow-xs flex items-center justify-center hover:bg-white cursor-pointer active:scale-95"
                  aria-label="تدوير لليسار"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center font-medium">
            صورة تجريبية (Demo). المعاينة تقريبية ومش بتضمن دقة الألوان النهائية.
          </p>
        </div>

        {/* Right: Controls Panel (cols-5) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* 1. Color Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#0B5F55]" />
                <span>لون القطعة الأساسي:</span>
              </label>
              <span className="text-xs font-semibold text-[#0B5F55]">
                {activeProduct.colors.find((c) => c.id === selectedColor)?.name}
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
              {activeProduct.colors.map((c) => {
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleColorSelect(c.id)}
                    className={`relative w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                      c.border ? 'border border-slate-300' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#0B5F55] ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  >
                    {isSelected && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          c.id === 'white' || c.id === 'cream'
                            ? 'bg-slate-900'
                            : 'bg-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {activeProduct.id === 'mug' && selectedColor !== 'white' && (
              <p className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-1.5">
                * خاصية التدوير 360° متوفرة للون الأبيض، الألوان الأخرى تُعرض بالمنظور الأساسي (Demo).
              </p>
            )}
          </div>

          {/* 2. View Angle Selector */}
          {activeProduct.views.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0B5F55]" />
                <span>منظور العرض:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activeProduct.views.map((v) => (
                  <Button
                    key={v.id}
                    type="button"
                    variant={selectedView === v.id ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs h-9 font-semibold ${
                      selectedView === v.id
                        ? 'bg-[#0B5F55] text-white hover:bg-[#073B35]'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                    onClick={() => handleViewSelect(v.id)}
                  >
                    {v.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Design Overlay & Custom Artwork Management */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0B5F55]" />
                <span>طبقة الشعار / التصميم (Overlay):</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setOverlayType('logo')}
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                  overlayType === 'logo'
                    ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                شعار يوزرسيف
              </button>
              
              <label
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer relative ${
                  overlayType === 'custom'
                    ? 'border-[#0B5F55] bg-[#0B5F55]/10 text-[#0B5F55] font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleArtworkUpload}
                />
                <span className="flex items-center justify-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>{customArtworkUrl ? 'تغيير التصميم' : 'رفع تصميم'}</span>
                </span>
              </label>
              
              <button
                type="button"
                onClick={() => setOverlayType('none')}
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                  overlayType === 'none'
                    ? 'border-slate-400 bg-slate-100 text-slate-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                بدون طباعة
              </button>
            </div>

            {/* Custom Artwork Thumbnail & Trim Status Box */}
            {overlayType === 'custom' && customArtworkUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    معاينة التصميم المرفوع:
                  </span>
                  <button
                    onClick={clearCustomArtwork}
                    className="text-red-600 hover:text-red-700 text-[11px] flex items-center gap-1 cursor-pointer"
                    title="حذف التصميم"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>حذف</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={customArtworkUrl}
                      alt="Thumbnail"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{customArtworkName}</p>
                    <p className="text-[10px] text-emerald-700 font-medium">
                      ✓ تم ضبط القياس تلقائياً ليتطابق مع موضع الطباعة المحدد
                    </p>
                  </div>
                </div>

                {/* Print mode selector */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60 text-[10px]">
                  <span className="text-slate-500 font-medium">وضع الطباعة:</span>
                  <button
                    type="button"
                    onClick={() => setCustomPrintMode('auto-blend')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      customPrintMode === 'auto-blend'
                        ? 'bg-[#0B5F55] text-white font-bold'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    تفريغ الخلفية ودمج القماش
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPrintMode('contrast')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      customPrintMode === 'contrast'
                        ? 'bg-[#0B5F55] text-white font-bold'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    طباعة ناصعة (DTF)
                  </button>
                </div>
              </div>
            )}

            <p className="text-[11px] text-[#4d6560]">
              * يتم ضبط لون الشعار تلقائياً ومطابقته على أبعاد القماش لضمان أرقى جودة في خطوط إنتاج أسوان.
            </p>

            {/* Direct Order Button */}
            <div className="pt-2">
              <a
                href={`/request?service=${activeProduct.serviceId}&color=${selectedColor}&view=${selectedView}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0B5F55] hover:bg-[#073B35] shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>اعتمد هذه المواصفات وابدأ طلبك الآن</span>
                <Check className="w-4 h-4 text-[#E3A92F]" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
};
