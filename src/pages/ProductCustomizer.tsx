import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  Move,
  Maximize2,
  Minimize2,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Palette,
  Eye,
  Sliders,
  Send,
  Trash2,
  Plus,
  Scissors,
  Check,
  FileText,
  ShoppingBag,
  Info,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import {
  CatalogProduct,
  PrintZone,
  ProductColor,
  COMMON_COLORS,
  getCatalogProducts,
  getCatalogProductById,
  computeTotalStock
} from '../lib/products-data';
import { generateWhatsAppLink, YUZERSEF_WHATSAPP } from '../lib/utils';
import { addToCart, parsePriceToNumber } from '../lib/cart-store';

// Dimensions for the mockup stage
const W = 800;
const H = 800;

export interface LogoLayer {
  id: string;
  name: string;               // e.g. "شعار الصدر", "شعار الظهر", "لوجو إضافي"
  view: string;               // 'front' | 'back'
  zoneId: string;             // Associated PrintZone id
  fileName: string;
  image: HTMLImageElement | null;
  rawImage: HTMLImageElement | null;
  imageSrc: string;

  // Transforms
  offsetX: number;
  offsetY: number;
  scale: number;              // 10% to 400%
  rotation: number;           // -180 to 180 deg
  fitMode: 'contain' | 'cover';

  // Processing
  autoTrim: boolean;
  removeBg: boolean;
  bgTolerance: number;
  tint: 'original' | 'white' | 'black' | 'green';
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
}

export const ProductCustomizer: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Products list & active product
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // View & Color & Size
  const [activeView, setActiveView] = useState<string>('front');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#18181B');
  const [customHex, setCustomHex] = useState<string>('#18181B');
  const [selectedCustomSize, setSelectedCustomSize] = useState<string>('L');

  // Print Zones
  const [zones, setZones] = useState<PrintZone[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<string>('');

  // Mode: 'area' (editing zone box) | 'image' (moving/transforming logo)
  const [controlMode, setControlMode] = useState<'area' | 'image'>('area');

  // Multi-Logo / Multi-Image Layers state
  const [logos, setLogos] = useState<LogoLayer[]>([]);
  const [activeLogoId, setActiveLogoId] = useState<string>('');

  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Helper computed active logo
  const activeLogo = logos.find((l) => l.id === activeLogoId) || logos[0] || null;

  const updateActiveLogo = (updates: Partial<LogoLayer>) => {
    if (!activeLogoId) return;
    setLogos((prev) =>
      prev.map((l) => (l.id === activeLogoId ? { ...l, ...updates } : l))
    );
  };

  const updateLogoById = (id: string, updates: Partial<LogoLayer>) => {
    setLogos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Sticker specifics
  const [stickerShape, setStickerShape] = useState<'round' | 'circle' | 'square'>('round');
  const [stickerCm, setStickerCm] = useState<number>(7);

  // Command feedback & status
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragTargetRef = useRef<'zone' | 'handle' | 'image' | null>(null);
  const activeHandleRef = useRef<'nw' | 'ne' | 'se' | 'sw' | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialZoneBoxRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });
  const initialImgOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Raw uploaded image cache (before background removal / trimming)
  const rawImageRef = useRef<HTMLImageElement | null>(null);

  // Cached product mockup images
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const [canvasRerenderTick, setCanvasRerenderTick] = useState<number>(0);

  const getCachedImage = useCallback((src: string): HTMLImageElement | null => {
    if (imageCacheRef.current[src]) {
      return imageCacheRef.current[src];
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      imageCacheRef.current[src] = img;
      setCanvasRerenderTick((v) => v + 1);
    };
    imageCacheRef.current[src] = img;
    return img;
  }, []);

  // Preload authentic product mockup images
  useEffect(() => {
    const urls = [
      '/products/hoodie-black-front-trans.png',
      '/products/hoodie-black-back.png',
      '/products/hoodie-white-front-trans.png',
      '/products/hoodie-white-back.png',
      '/products/tshirt-black-front-trans.png',
      '/products/tshirt-black-back.png',
      '/products/tshirt-white-front-trans.png',
      '/products/tshirt-white-back.png',
    ];
    urls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        imageCacheRef.current[url] = img;
        setCanvasRerenderTick((v) => v + 1);
      };
      imageCacheRef.current[url] = img;
    });
  }, []);

  // 1. Load products & initialize selected product
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const all = await getCatalogProducts();
        setProducts(all);
        const match =
          (productId &&
            all.find(
              (p: CatalogProduct) =>
                p.id === productId ||
                p.id.replace(/-/g, '_') === productId ||
                p.id === productId.replace(/_/g, '-') ||
                p.id.toLowerCase() === productId.toLowerCase()
            )) ||
          all[0] ||
          null;
        if (match) {
          applyProduct(match);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  // Standalone image processing function (returns Promise<HTMLImageElement>)
  const processImageLayer = (
    sourceImg: HTMLImageElement,
    trim: boolean,
    rmBg: boolean,
    tol: number,
    tint: 'original' | 'white' | 'black' | 'green'
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = sourceImg.width;
        offCanvas.height = sourceImg.height;
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) {
          resolve(sourceImg);
          return;
        }

        offCtx.drawImage(sourceImg, 0, 0);
        const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        const data = imgData.data;

        // 1. Remove solid background if enabled
        if (rmBg && data.length > 4) {
          const bgR = data[0];
          const bgG = data[1];
          const bgB = data[2];
          const tolDist = (tol / 100) * 441; // Max RGB euclidean dist is ~441.6

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            if (dist <= tolDist) {
              data[i + 3] = 0; // Transparent
            }
          }
          offCtx.putImageData(imgData, 0, 0);
        }

        // 2. Apply color tint if specified (for monochrome brand logo)
        if (tint !== 'original') {
          const tintHex = tint === 'white' ? '#FFFFFF' : tint === 'black' ? '#111111' : '#0B5F55';
          offCtx.globalCompositeOperation = 'source-in';
          offCtx.fillStyle = tintHex;
          offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
          offCtx.globalCompositeOperation = 'source-over';
        }

        // 3. Auto-trim transparent borders if enabled
        if (trim) {
          const trimmedData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
          const tPixels = trimmedData.data;
          let minX = offCanvas.width, minY = offCanvas.height, maxX = 0, maxY = 0;
          let found = false;

          for (let y = 0; y < offCanvas.height; y++) {
            for (let x = 0; x < offCanvas.width; x++) {
              const a = tPixels[(y * offCanvas.width + x) * 4 + 3];
              if (a > 10) {
                found = true;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          if (found && maxX > minX && maxY > minY) {
            const trimW = maxX - minX + 1;
            const trimH = maxY - minY + 1;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = trimW;
            cropCanvas.height = trimH;
            const cropCtx = cropCanvas.getContext('2d');
            if (cropCtx) {
              cropCtx.drawImage(offCanvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
              const finalImg = new Image();
              finalImg.onload = () => resolve(finalImg);
              finalImg.onerror = () => resolve(sourceImg);
              finalImg.src = cropCanvas.toDataURL();
              return;
            }
          }
        }

        // Return processed canvas as Image
        const resultImg = new Image();
        resultImg.onload = () => resolve(resultImg);
        resultImg.onerror = () => resolve(sourceImg);
        resultImg.src = offCanvas.toDataURL();
      } catch (e) {
        console.warn('Image processing fallback to source image', e);
        resolve(sourceImg);
      }
    });
  };

  const loadBrandLogoForLayer = (layerId: string, url: string, name: string, tint: 'original' | 'white' | 'black' | 'green' = 'white') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const processed = await processImageLayer(img, true, false, 35, tint);
      setLogos((prev) =>
        prev.map((l) =>
          l.id === layerId
            ? {
                ...l,
                fileName: name,
                imageSrc: url,
                rawImage: img,
                image: processed,
                tint,
              }
            : l
        )
      );
      setStatusMessage(`تم تحميل ${name}`);
    };
    img.src = url;
  };

  const applyProduct = (prod: CatalogProduct) => {
    setSelectedProduct(prod);
    setSelectedColorHex(prod.defaultColor ? (prod.colors.find((c) => c.id === prod.defaultColor)?.hex || prod.colors[0]?.hex || '#18181B') : '#18181B');
    const initialView = prod.defaultView || 'front';
    setActiveView(initialView);

    // Set initial size
    if (prod.hasSizes && prod.sizeStock && Object.keys(prod.sizeStock).length > 0) {
      const allSizes = Object.keys(prod.sizeStock);
      const inStock = allSizes.find((s) => (prod.sizeStock?.[s] || 0) > 0) || allSizes[0];
      setSelectedCustomSize(inStock);
    } else {
      setSelectedCustomSize('مقاس موحد');
    }

    // Clone default zones
    const prodZones = prod.defaultZones && prod.defaultZones.length > 0
      ? prod.defaultZones.map((z) => ({ ...z }))
      : [
          {
            id: 'zone-1',
            name: 'منطقة الطباعة الرئيسية',
            view: 'front',
            shape: 'round' as const,
            x: 260,
            y: 260,
            w: 280,
            h: 280,
            cmWidth: 28,
            cmHeight: 28
          }
        ];
    setZones(prodZones);
    const firstZone = prodZones.find((z) => z.view === initialView) || prodZones[0];
    const initialZoneId = firstZone ? firstZone.id : '';
    setActiveZoneId(initialZoneId);

    // Initialize initial default logo
    const initialLogoId = 'logo-1';
    const initialLogo: LogoLayer = {
      id: initialLogoId,
      name: 'شعار الصدر الرئيسي',
      view: initialView,
      zoneId: initialZoneId,
      fileName: 'لوجو يوزرسيف (أبيض)',
      imageSrc: '/brand/logo-white.png',
      image: null,
      rawImage: null,
      offsetX: 0,
      offsetY: 0,
      scale: 100,
      rotation: 0,
      fitMode: 'contain',
      autoTrim: true,
      removeBg: false,
      bgTolerance: 35,
      tint: 'white',
    };
    setLogos([initialLogo]);
    setActiveLogoId(initialLogoId);
    loadBrandLogoForLayer(initialLogoId, '/brand/logo-white.png', 'لوجو يوزرسيف (أبيض)', 'white');
  };

  const resetActiveLogoAdjustments = () => {
    if (!activeLogoId) return;
    updateActiveLogo({
      offsetX: 0,
      offsetY: 0,
      scale: 100,
      rotation: 0,
    });
    setCommandFeedback('تمت إعادة ضبط موضع وحجم الشعار المحدد');
  };

  // Re-process active logo when filter settings change
  const reprocessActiveLogo = async (overrides: Partial<LogoLayer>) => {
    if (!activeLogo || !activeLogo.rawImage) {
      updateActiveLogo(overrides);
      return;
    }
    const trim = overrides.autoTrim !== undefined ? overrides.autoTrim : activeLogo.autoTrim;
    const rmBg = overrides.removeBg !== undefined ? overrides.removeBg : activeLogo.removeBg;
    const tol = overrides.bgTolerance !== undefined ? overrides.bgTolerance : activeLogo.bgTolerance;
    const tint = overrides.tint !== undefined ? overrides.tint : activeLogo.tint;

    const processed = await processImageLayer(activeLogo.rawImage, trim, rmBg, tol, tint);
    updateActiveLogo({
      ...overrides,
      image: processed,
    });
  };

  // File upload for active or specified logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetLayerId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الملف كبير جداً! أقصى حد مسموح به هو 10 ميجابايت.');
      return;
    }

    const idToUpdate = targetLayerId || activeLogoId;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const target = logos.find((l) => l.id === idToUpdate) || activeLogo;
        const autoTrim = target ? target.autoTrim : true;
        const removeBg = target ? target.removeBg : false;
        const bgTolerance = target ? target.bgTolerance : 35;
        const processed = await processImageLayer(img, autoTrim, removeBg, bgTolerance, 'original');

        setLogos((prev) =>
          prev.map((l) =>
            l.id === idToUpdate
              ? {
                  ...l,
                  fileName: file.name,
                  imageSrc: event.target?.result as string,
                  rawImage: img,
                  image: processed,
                  tint: 'original',
                  offsetX: 0,
                  offsetY: 0,
                }
              : l
          )
        );
        setStatusMessage(`تم رفع ${file.name} بنجاح (${img.width}×${img.height} بكسل)`);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add brand new logo layer with a file uploaded in one step
  const handleAddNewLogoWithFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الملف كبير جداً! أقصى حد مسموح به هو 10 ميجابايت.');
      return;
    }

    const newId = `logo-${Date.now()}`;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const processed = await processImageLayer(img, true, false, 35, 'original');
        const currentViewZones = zones.filter((z) => z.view === activeView);
        const unusedZone = currentViewZones.find((z) => !logos.some((l) => l.zoneId === z.id && l.view === activeView));
        const assignedZone = unusedZone || currentViewZones[0] || zones[0];

        const logoCountOnView = logos.filter((l) => l.view === activeView).length + 1;
        const defaultName = activeView === 'back'
          ? `شعار الظهر ${logoCountOnView}`
          : `شعار الواجهة ${logoCountOnView}`;

        const newLogo: LogoLayer = {
          id: newId,
          name: defaultName,
          view: activeView,
          zoneId: assignedZone ? assignedZone.id : 'zone-1',
          fileName: file.name,
          imageSrc: event.target?.result as string,
          rawImage: img,
          image: processed,
          offsetX: 0,
          offsetY: 0,
          scale: 100,
          rotation: 0,
          fitMode: 'contain',
          autoTrim: true,
          removeBg: false,
          bgTolerance: 35,
          tint: 'original',
        };

        setLogos((prev) => [...prev, newLogo]);
        setActiveLogoId(newId);
        if (assignedZone) setActiveZoneId(assignedZone.id);
        setStatusMessage(`تمت إضافة الشعار "${file.name}" كطبقة جديدة بنجاح!`);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add brand new logo layer (e.g. for front or back)
  const handleAddNewLogoLayer = (targetView?: string, targetZoneId?: string) => {
    const viewToUse = targetView || activeView;
    const newId = `logo-${Date.now()}`;
    const currentViewZones = zones.filter((z) => z.view === viewToUse);
    const assignedZone = targetZoneId
      ? zones.find((z) => z.id === targetZoneId)
      : currentViewZones.find((z) => !logos.some((l) => l.zoneId === z.id && l.view === viewToUse)) ||
        currentViewZones[0] ||
        zones[0];

    const logoCountOnView = logos.filter((l) => l.view === viewToUse).length + 1;
    const defaultName = viewToUse === 'back'
      ? `شعار الظهر ${logoCountOnView > 1 ? logoCountOnView : ''}`.trim()
      : `شعار الواجهة ${logoCountOnView > 1 ? logoCountOnView : ''}`.trim();

    const newLogo: LogoLayer = {
      id: newId,
      name: defaultName,
      view: viewToUse,
      zoneId: assignedZone ? assignedZone.id : 'zone-1',
      fileName: 'لوجو يوزرسيف (أبيض)',
      imageSrc: '/brand/logo-white.png',
      image: null,
      rawImage: null,
      offsetX: 0,
      offsetY: 0,
      scale: 100,
      rotation: 0,
      fitMode: 'contain',
      autoTrim: true,
      removeBg: false,
      bgTolerance: 35,
      tint: 'white',
    };

    setLogos((prev) => [...prev, newLogo]);
    setActiveLogoId(newId);
    if (viewToUse !== activeView) {
      setActiveView(viewToUse);
    }
    if (assignedZone) {
      setActiveZoneId(assignedZone.id);
    }
    loadBrandLogoForLayer(newId, '/brand/logo-white.png', 'لوجو يوزرسيف (أبيض)', 'white');
    setStatusMessage(`تمت إضافة طبقة شعار جديدة: ${defaultName}`);
  };

  // Duplicate logo
  const handleDuplicateLogo = (layerId: string) => {
    const source = logos.find((l) => l.id === layerId);
    if (!source) return;

    const newId = `logo-${Date.now()}`;
    const dup: LogoLayer = {
      ...source,
      id: newId,
      name: `${source.name} (نسخة)`,
      offsetX: source.offsetX + 20,
      offsetY: source.offsetY + 20,
    };
    setLogos((prev) => [...prev, dup]);
    setActiveLogoId(newId);
    setStatusMessage(`تم تكرار الشعار بنجاح: ${dup.name}`);
  };

  // Delete logo
  const handleDeleteLogo = (layerId: string) => {
    if (logos.length <= 1) {
      alert('يجب الإبقاء على شعار واحد على الأقل! يمكنك تعديل صورته أو موضعه.');
      return;
    }
    const remaining = logos.filter((l) => l.id !== layerId);
    setLogos(remaining);
    if (activeLogoId === layerId) {
      setActiveLogoId(remaining[0].id);
      if (remaining[0].view !== activeView) {
        setActiveView(remaining[0].view);
      }
    }
    setStatusMessage('تم حذف طبقة الشعار');
  };

  // Current active zone (prioritizing active logo's zone, then current view)
  const currentZone =
    zones.find((z) => z.id === (activeLogo?.zoneId || activeZoneId)) ||
    zones.find((z) => z.view === activeView) ||
    zones[0];

  // ─────────────────────────────────────────────────────────────────────────
  // Canvas Rendering Pipeline (Product + Shading + Zone + Logo + Handles)
  // ─────────────────────────────────────────────────────────────────────────
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper functions
    const roundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    };

    const drawShapePath = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, shape: string) => {
      c.beginPath();
      if (shape === 'circle') {
        c.ellipse(x + w / 2, y + h / 2, Math.abs(w) / 2, Math.abs(h) / 2, 0, 0, Math.PI * 2);
      } else if (shape === 'square') {
        c.rect(x, y, w, h);
      } else {
        roundRect(c, x, y, w, h, Math.min(24, Math.abs(w) / 4, Math.abs(h) / 4));
      }
    };

    // 1. Clear Stage
    ctx.clearRect(0, 0, W, H);

    // Warm clean studio background
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 500);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#EFEAE0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle floor shadow
    ctx.beginPath();
    ctx.ellipse(W / 2, H - 70, 240, 26, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fill();

    // 2. Draw Product Base & Shading
    ctx.save();
    const baseType = selectedProduct?.baseType || 'hoodie';
    drawProductModel(ctx, baseType, selectedColorHex, activeView);
    ctx.restore();

    // 3. Draw Active Zone Clipping & Logo
    if (currentZone) {
      const zx = currentZone.x;
      const zy = currentZone.y;
      const zw = currentZone.w;
      const zh = currentZone.h;
      const zShape = currentZone.shape || 'round';

      ctx.save();
      // Clip to zone boundary
      drawShapePath(ctx, zx, zy, zw, zh, zShape);
      ctx.clip();

      // Subtle print area background hint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fill();

      // Draw Logos on the current view
      const viewLogos = logos.filter((l) => l.view === activeView && l.image && l.image.complete);
      viewLogos.forEach((l) => {
        const lZone = zones.find((z) => z.id === l.zoneId) || currentZone;
        const lzx = lZone.x;
        const lzy = lZone.y;
        const lzw = lZone.w;
        const lzh = lZone.h;

        ctx.save();
        const centerX = lzx + lzw / 2 + l.offsetX;
        const centerY = lzy + lzh / 2 + l.offsetY;
        ctx.translate(centerX, centerY);
        ctx.rotate((l.rotation * Math.PI) / 180);

        if (l.image) {
          const scaleX = lzw / l.image.width;
          const scaleY = lzh / l.image.height;
          const baseFit = l.fitMode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
          const finalScale = baseFit * (l.scale / 100);
          const drawW = l.image.width * finalScale;
          const drawH = l.image.height * finalScale;

          ctx.drawImage(l.image, -drawW / 2, -drawH / 2, drawW, drawH);
        }
        ctx.restore();
      });

      ctx.restore(); // Restore clip

      // 4. Draw Guide & Handles (if enabled)
      if (showGuide) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = controlMode === 'area' ? '#0B5F55' : '#0B5F5577';
        ctx.lineWidth = 2;
        drawShapePath(ctx, zx, zy, zw, zh, zShape);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small Zone Name Pill on top-right of zone
        ctx.fillStyle = '#0B5F55';
        roundRect(ctx, zx + 4, zy - 22, 110, 20, 4);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentZone.name || 'منطقة الطباعة', zx + 59, zy - 8);

        // In Area edit mode: Draw 4 corner resize handles
        if (controlMode === 'area') {
          const handleSize = 12;
          const handles = [
            { x: zx, y: zy }, // NW
            { x: zx + zw, y: zy }, // NE
            { x: zx + zw, y: zy + zh }, // SE
            { x: zx, y: zy + zh }, // SW
          ];

          handles.forEach((h) => {
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0B5F55';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.rect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
            ctx.fill();
            ctx.stroke();
          });
        }
        ctx.restore();
      }
    }
  }, [
    selectedProduct,
    selectedColorHex,
    activeView,
    currentZone,
    zones,
    logos,
    activeLogoId,
    showGuide,
    controlMode,
    canvasRerenderTick
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ─────────────────────────────────────────────────────────────────────────
  // High-Fidelity Product Geometry Drawing (Hoodie, T-Shirt, Cap, Mug, Sticker, Case)
  // ─────────────────────────────────────────────────────────────────────────
  const drawProductModel = (
    ctx: CanvasRenderingContext2D,
    type: string,
    colorHex: string,
    view: string
  ) => {
    // Helper to draw soft fabric shadows
    const applyShadow = (color: string, blur = 15) => {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.shadowOffsetY = 8;
    };
    const clearShadow = () => {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    };

    if (type === 'hoodie') {
      const isBack = view === 'back';
      const imgSrc = isBack
        ? '/products/hoodie-black-back.png'
        : '/products/hoodie-black-front-trans.png';

      const mockupImg = getCachedImage(imgSrc);

      if (mockupImg && mockupImg.complete && mockupImg.naturalWidth > 0) {
        const scale = 2.0;
        const drawW = 272 * scale; // 544
        const drawH = 384 * scale; // 768
        const drawX = (W - drawW) / 2; // 128
        const drawY = 16;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 12;
        ctx.drawImage(mockupImg, drawX, drawY, drawW, drawH);
        ctx.restore();
        return;
      }

      applyShadow('rgba(0,0,0,0.12)', 20);
      ctx.fillStyle = colorHex;

      // Realistic Hoodie Silhouette
      ctx.beginPath();
      // Left shoulder & sleeve
      ctx.moveTo(330, 160);
      ctx.quadraticCurveTo(240, 180, 130, 290); // Left shoulder & arm
      ctx.lineTo(170, 360); // Left outer cuff
      ctx.lineTo(235, 305); // Left inner underarm
      ctx.lineTo(235, 630); // Left torso side
      ctx.lineTo(565, 630); // Bottom hem
      ctx.lineTo(565, 305); // Right torso side
      ctx.lineTo(630, 360); // Right inner underarm
      ctx.lineTo(670, 290); // Right outer cuff
      ctx.quadraticCurveTo(560, 180, 470, 160); // Right shoulder
      ctx.closePath();
      ctx.fill();
      clearShadow();

      // Realistic Hood Back/Front
      ctx.beginPath();
      ctx.moveTo(330, 160);
      ctx.quadraticCurveTo(400, 190, 470, 160);
      ctx.quadraticCurveTo(520, 110, 480, 70);
      ctx.quadraticCurveTo(400, 50, 320, 70);
      ctx.quadraticCurveTo(280, 110, 330, 160);
      ctx.fillStyle = colorHex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Kangaroo Pocket (on front view)
      if (view === 'front') {
        ctx.beginPath();
        ctx.moveTo(300, 470);
        ctx.lineTo(500, 470);
        ctx.lineTo(530, 590);
        ctx.lineTo(270, 590);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Drawstrings
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(375, 175);
        ctx.quadraticCurveTo(370, 250, 365, 290);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(425, 175);
        ctx.quadraticCurveTo(430, 250, 435, 290);
        ctx.stroke();
      }

      // Ribbed Bottom Hem & Cuffs
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(235, 595, 330, 35);
      // Cuff details
      ctx.fillRect(135, 330, 35, 30);
      ctx.fillRect(630, 330, 35, 30);

      // Fabric shading gradients (realistic depth)
      const shadeGrad = ctx.createLinearGradient(130, 0, 670, 0);
      shadeGrad.addColorStop(0, 'rgba(0,0,0,0.22)');
      shadeGrad.addColorStop(0.2, 'rgba(0,0,0,0.02)');
      shadeGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      shadeGrad.addColorStop(0.8, 'rgba(0,0,0,0.02)');
      shadeGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = shadeGrad;
      ctx.fillRect(130, 70, 540, 560);
    } else if (type === 'tshirt') {
      applyShadow('rgba(0,0,0,0.1)', 18);
      ctx.fillStyle = colorHex;

      // Realistic T-shirt Silhouette
      ctx.beginPath();
      ctx.moveTo(340, 160);
      ctx.quadraticCurveTo(250, 180, 160, 250); // Left shoulder & sleeve
      ctx.lineTo(210, 320); // Left outer sleeve cuff
      ctx.lineTo(260, 270); // Left inner underarm
      ctx.lineTo(260, 640); // Left body side
      ctx.lineTo(540, 640); // Hem
      ctx.lineTo(540, 270); // Right body side
      ctx.lineTo(590, 320); // Right sleeve
      ctx.lineTo(640, 250); // Right outer sleeve cuff
      ctx.quadraticCurveTo(550, 180, 460, 160); // Right shoulder
      ctx.quadraticCurveTo(400, 200, 340, 160); // Crewneck collar
      ctx.closePath();
      ctx.fill();
      clearShadow();

      // Crewneck rib collar
      ctx.beginPath();
      ctx.arc(400, 160, 58, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.stroke();

      // Folds and fabric drape
      const drapeGrad = ctx.createLinearGradient(200, 0, 600, 0);
      drapeGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
      drapeGrad.addColorStop(0.25, 'rgba(255,255,255,0.05)');
      drapeGrad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
      drapeGrad.addColorStop(0.75, 'rgba(255,255,255,0.05)');
      drapeGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = drapeGrad;
      ctx.fillRect(160, 160, 480, 480);
    } else if (type === 'cap') {
      applyShadow('rgba(0,0,0,0.15)', 15);
      ctx.fillStyle = colorHex;

      // Cap Crown (Dome)
      ctx.beginPath();
      ctx.ellipse(400, 320, 180, 140, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      clearShadow();

      // Top Button
      ctx.beginPath();
      ctx.arc(400, 180, 12, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Curved Visor / Brim
      ctx.beginPath();
      ctx.moveTo(220, 320);
      ctx.quadraticCurveTo(400, 410, 580, 320);
      ctx.quadraticCurveTo(400, 460, 220, 320);
      ctx.fillStyle = colorHex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Stitch lines on visor
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(400, 290, 160, 0.25 * Math.PI, 0.75 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (type === 'mug') {
      applyShadow('rgba(0,0,0,0.14)', 20);

      // Ceramic Mug Handle
      ctx.beginPath();
      ctx.arc(540, 400, 80, -0.4 * Math.PI, 0.4 * Math.PI, false);
      ctx.lineWidth = 28;
      ctx.strokeStyle = colorHex === '#FFFFFF' ? '#F2F2F2' : colorHex;
      ctx.stroke();
      clearShadow();

      // Mug Cylinder Body
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.moveTo(260, 240);
      ctx.lineTo(540, 240);
      ctx.quadraticCurveTo(545, 560, 535, 570);
      ctx.quadraticCurveTo(400, 590, 265, 570);
      ctx.quadraticCurveTo(255, 560, 260, 240);
      ctx.closePath();
      ctx.fill();

      // Ceramic Rim ellipse on top
      ctx.beginPath();
      ctx.ellipse(400, 240, 140, 24, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Specular highlight (glossy reflection)
      const shineGrad = ctx.createLinearGradient(260, 0, 540, 0);
      shineGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
      shineGrad.addColorStop(0.2, 'rgba(255,255,255,0.3)');
      shineGrad.addColorStop(0.4, 'rgba(255,255,255,0.05)');
      shineGrad.addColorStop(0.85, 'rgba(0,0,0,0.05)');
      shineGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = shineGrad;
      ctx.fillRect(260, 240, 280, 340);
    } else if (type === 'sticker') {
      // Sticker sheet / backing
      applyShadow('rgba(0,0,0,0.12)', 18);
      ctx.fillStyle = colorHex === '#18181B' ? '#222' : colorHex;
      ctx.beginPath();
      if (stickerShape === 'circle') {
        ctx.arc(400, 400, 190, 0, Math.PI * 2);
      } else if (stickerShape === 'square') {
        ctx.rect(210, 210, 380, 380);
      } else {
        roundRect(ctx, 210, 210, 380, 380, 48);
      }
      ctx.fill();
      clearShadow();

      // Peel border line
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Size badge
      ctx.fillStyle = '#0B5F55';
      roundRect(ctx, 335, 150, 130, 28, 999);
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 12px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`مقاس: ${stickerCm} × ${stickerCm} سم`, 400, 169);
    } else if (type === 'case') {
      // Phone Case Body
      applyShadow('rgba(0,0,0,0.18)', 22);
      ctx.fillStyle = colorHex;
      roundRect(ctx, 270, 140, 260, 520, 44);
      ctx.fill();
      clearShadow();

      // Camera Bump Island (top left)
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      roundRect(ctx, 290, 160, 75, 85, 18);
      ctx.fill();
      // Lens circles
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(327, 185, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(327, 222, 14, 0, Math.PI * 2);
      ctx.fill();

      // Bevel Edge Highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2.5;
      roundRect(ctx, 273, 143, 254, 514, 42);
      ctx.stroke();
    } else {
      // Generic/custom product fallback
      applyShadow('rgba(0,0,0,0.1)', 15);
      ctx.fillStyle = colorHex;
      roundRect(ctx, 200, 160, 400, 480, 24);
      ctx.fill();
      clearShadow();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Canvas Mouse & Touch Interaction (Zone Moving & Resizing, Image Drag & Zoom)
  // ─────────────────────────────────────────────────────────────────────────
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Hit-test: find top-most logo on specified view under coords (x, y)
  const findLogoAtCoords = (x: number, y: number, view: string): LogoLayer | null => {
    const viewLogos = logos.filter((l) => l.view === view && l.image && l.image.complete);
    for (let i = viewLogos.length - 1; i >= 0; i--) {
      const l = viewLogos[i];
      const z = zones.find((zn) => zn.id === l.zoneId) || currentZone;
      if (!z || !l.image) continue;

      const cx = z.x + z.w / 2 + l.offsetX;
      const cy = z.y + z.h / 2 + l.offsetY;

      const scaleX = z.w / l.image.width;
      const scaleY = z.h / l.image.height;
      const baseFit = l.fitMode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
      const finalScale = baseFit * (l.scale / 100);
      const drawW = l.image.width * finalScale;
      const drawH = l.image.height * finalScale;

      const rad = (-l.rotation * Math.PI) / 180;
      const dx = x - cx;
      const dy = y - cy;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      if (Math.abs(localX) <= drawW / 2 + 12 && Math.abs(localY) <= drawH / 2 + 12) {
        return l;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!currentZone) return;
    const { x, y } = getCanvasCoords(e);
    isDraggingRef.current = true;
    dragStartRef.current = { x, y };

    const z = currentZone;
    initialZoneBoxRef.current = { x: z.x, y: z.y, w: z.w, h: z.h };
    initialImgOffsetRef.current = { x: activeLogo?.offsetX || 0, y: activeLogo?.offsetY || 0 };

    if (controlMode === 'area') {
      // Check handles first (NW, NE, SE, SW)
      const hSize = 18;
      const nw = Math.abs(x - z.x) <= hSize && Math.abs(y - z.y) <= hSize;
      const ne = Math.abs(x - (z.x + z.w)) <= hSize && Math.abs(y - z.y) <= hSize;
      const se = Math.abs(x - (z.x + z.w)) <= hSize && Math.abs(y - (z.y + z.h)) <= hSize;
      const sw = Math.abs(x - z.x) <= hSize && Math.abs(y - (z.y + z.h)) <= hSize;

      if (nw) {
        dragTargetRef.current = 'handle';
        activeHandleRef.current = 'nw';
        return;
      }
      if (ne) {
        dragTargetRef.current = 'handle';
        activeHandleRef.current = 'ne';
        return;
      }
      if (se) {
        dragTargetRef.current = 'handle';
        activeHandleRef.current = 'se';
        return;
      }
      if (sw) {
        dragTargetRef.current = 'handle';
        activeHandleRef.current = 'sw';
        return;
      }

      // Check if inside zone body
      if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
        dragTargetRef.current = 'zone';
        return;
      }
    } else {
      // In image move mode: hit-test logos on active view
      const clickedLogo = findLogoAtCoords(x, y, activeView);
      if (clickedLogo) {
        setActiveLogoId(clickedLogo.id);
        if (clickedLogo.zoneId) setActiveZoneId(clickedLogo.zoneId);
        initialImgOffsetRef.current = { x: clickedLogo.offsetX, y: clickedLogo.offsetY };
      } else if (activeLogo) {
        initialImgOffsetRef.current = { x: activeLogo.offsetX, y: activeLogo.offsetY };
      }
      dragTargetRef.current = 'image';
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !currentZone) return;
    const { x, y } = getCanvasCoords(e);
    const dx = x - dragStartRef.current.x;
    const dy = y - dragStartRef.current.y;

    if (dragTargetRef.current === 'zone') {
      // Move entire zone
      const newX = Math.max(50, Math.min(W - currentZone.w - 50, initialZoneBoxRef.current.x + dx));
      const newY = Math.max(50, Math.min(H - currentZone.h - 50, initialZoneBoxRef.current.y + dy));
      updateActiveZone({ x: Math.round(newX), y: Math.round(newY) });
    } else if (dragTargetRef.current === 'handle') {
      // Resize zone
      const init = initialZoneBoxRef.current;
      const handle = activeHandleRef.current;
      let newX = init.x;
      let newY = init.y;
      let newW = init.w;
      let newH = init.h;

      if (handle === 'se') {
        newW = Math.max(60, init.w + dx);
        newH = Math.max(60, init.h + dy);
      } else if (handle === 'sw') {
        newW = Math.max(60, init.w - dx);
        newX = init.x + (init.w - newW);
        newH = Math.max(60, init.h + dy);
      } else if (handle === 'ne') {
        newW = Math.max(60, init.w + dx);
        newH = Math.max(60, init.h - dy);
        newY = init.y + (init.h - newH);
      } else if (handle === 'nw') {
        newW = Math.max(60, init.w - dx);
        newH = Math.max(60, init.h - dy);
        newX = init.x + (init.w - newW);
        newY = init.y + (init.h - newH);
      }

      updateActiveZone({
        x: Math.round(newX),
        y: Math.round(newY),
        w: Math.round(newW),
        h: Math.round(newH),
        cmWidth: Math.round(newW / 10),
        cmHeight: Math.round(newH / 10),
      });
    } else if (dragTargetRef.current === 'image') {
      // Move active logo inside zone
      if (activeLogo) {
        updateActiveLogo({
          offsetX: Math.round(initialImgOffsetRef.current.x + dx),
          offsetY: Math.round(initialImgOffsetRef.current.y + dy),
        });
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragTargetRef.current = null;
    activeHandleRef.current = null;
  };

  // Mouse wheel zooms active logo scale
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!activeLogo) return;
    const zoomDelta = e.deltaY < 0 ? 5 : -5;
    updateActiveLogo({
      scale: Math.min(400, Math.max(10, activeLogo.scale + zoomDelta)),
    });
  };

  // Helper to update active zone in state
  const updateActiveZone = (updatedProps: Partial<PrintZone>) => {
    if (!currentZone) return;
    setZones((prev) =>
      prev.map((z) => (z.id === currentZone.id ? { ...z, ...updatedProps } : z))
    );
  };

  // Add a new zone
  const handleAddZone = () => {
    const newId = `zone-${Date.now()}`;
    const newZone: PrintZone = {
      id: newId,
      name: `منطقة ${zones.length + 1}`,
      view: activeView,
      shape: 'round',
      x: 300,
      y: 300,
      w: 200,
      h: 200,
      cmWidth: 20,
      cmHeight: 20,
    };
    setZones((prev) => [...prev, newZone]);
    setActiveZoneId(newId);
    setStatusMessage('تمت إضافة منطقة طباعة جديدة');
  };

  // Delete current zone
  const handleDeleteZone = () => {
    if (zones.length <= 1) {
      alert('يجب الإبقاء على منطقة طباعة واحدة على الأقل!');
      return;
    }
    const remaining = zones.filter((z) => z.id !== currentZone.id);
    setZones(remaining);
    setActiveZoneId(remaining[0].id);
    setStatusMessage('تم حذف المنطقة المحددة');
  };

  // Preset zone selections
  const applyPresetZone = (
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    shape: 'round' | 'square' | 'circle' = 'round',
    presetView?: string
  ) => {
    if (presetView) {
      setActiveView(presetView);
      if (activeLogo && activeLogo.view !== presetView) {
        updateActiveLogo({ view: presetView });
      }
    }
    updateActiveZone({
      name,
      x,
      y,
      w,
      h,
      shape,
      cmWidth: Math.round(w / 10),
      cmHeight: Math.round(h / 10),
      ...(presetView ? { view: presetView } : {}),
    });
    setCommandFeedback(`تم تطبيق مقاس "${name}"`);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // NLP & Quick Command Chips Interpreter
  // ─────────────────────────────────────────────────────────────────────────
  const executeCommand = (cmd: string) => {
    const text = cmd.trim().toLowerCase();
    if (!text || !activeLogo) return;

    if (text.includes('وسط') || text.includes('توسيط') || text.includes('سنتر')) {
      updateActiveLogo({ offsetX: 0, offsetY: 0 });
      setCommandFeedback(`تم توسيط "${activeLogo.name}" داخل المنطقة`);
    } else if (text.includes('كبر') || text.includes('تكبير') || text.includes('قليلا')) {
      updateActiveLogo({ scale: Math.min(400, activeLogo.scale + 25) });
      setCommandFeedback(`تم تكبير "${activeLogo.name}" بنسبة 25%`);
    } else if (text.includes('صغر') || text.includes('تصغير')) {
      updateActiveLogo({ scale: Math.max(10, activeLogo.scale - 25) });
      setCommandFeedback(`تم تصغير "${activeLogo.name}" بنسبة 25%`);
    } else if (text.includes('يسار') || text.includes('شمال')) {
      updateActiveLogo({ offsetX: activeLogo.offsetX - 25 });
      setCommandFeedback(`تم تحريك "${activeLogo.name}" لليسار`);
    } else if (text.includes('يمين')) {
      updateActiveLogo({ offsetX: activeLogo.offsetX + 25 });
      setCommandFeedback(`تم تحريك "${activeLogo.name}" لليمين`);
    } else if (text.includes('فوق') || text.includes('أعلى') || text.includes('اعلى')) {
      updateActiveLogo({ offsetY: activeLogo.offsetY - 25 });
      setCommandFeedback(`تم رفع "${activeLogo.name}" للأعلى`);
    } else if (text.includes('تحت') || text.includes('أسفل') || text.includes('اسفل')) {
      updateActiveLogo({ offsetY: activeLogo.offsetY + 25 });
      setCommandFeedback(`تم خفض "${activeLogo.name}" للأسفل`);
    } else if (text.includes('تدوير') || text.includes('لف')) {
      updateActiveLogo({ rotation: (activeLogo.rotation + 90) % 360 });
      setCommandFeedback(`تم تدوير "${activeLogo.name}" 90 درجة`);
    } else {
      setCommandFeedback('تم استلام الأمر وتطبيقه على التموضع.');
    }
    setCommandInput('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Export Handlers (PNG Download, JSON Download, Send Request)
  // ─────────────────────────────────────────────────────────────────────────
  const handleDownloadPng = () => {
    // Render clean export without guides
    setShowGuide(false);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `yuzersef-mockup-${selectedProduct?.id || 'product'}-${activeView}.png`;
      a.click();
      setShowGuide(true);
      setStatusMessage('تم تحميل صورة المعاينة بنجاح!');
    }, 80);
  };

  const handleDownloadJson = () => {
    const config = {
      product: {
        id: selectedProduct?.id,
        name: selectedProduct?.name,
        colorHex: selectedColorHex,
        view: activeView,
      },
      zones: zones,
      logos: logos.map((l) => ({
        id: l.id,
        name: l.name,
        view: l.view,
        zoneName: zones.find((zn) => zn.id === l.zoneId)?.name || 'الصدر',
        fileName: l.fileName,
        scalePercent: l.scale,
        rotationDeg: l.rotation,
        offsetX: l.offsetX,
        offsetY: l.offsetY,
        fitMode: l.fitMode,
        autoTrim: l.autoTrim,
        removeBg: l.removeBg,
        tint: l.tint,
      })),
      exportedAt: new Date().toISOString(),
      company: 'Yuzersef Custom Printing & Embroidery Aswan',
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuzersef-order-specs-${selectedProduct?.id || 'product'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('تم تحميل ملف إعدادات الطلب (JSON) بنجاح!');
  };

  const handleSendOrder = () => {
    // Generate WhatsApp direct text with full specs for all logos
    const frontLogos = logos.filter((l) => l.view === 'front');
    const backLogos = logos.filter((l) => l.view === 'back');

    let text = `مرحباً يوزرسيف أسوان، أريد تنفيذ طلب لمنتج: ${selectedProduct?.name || 'منتج مخصص'}\n`;
    text += `اللون المختار: ${selectedColorHex}\n`;
    if (selectedProduct?.hasSizes) {
      text += `المقاس المختار: ${selectedCustomSize}\n`;
    }
    text += `إجمالي الشعارات المضافة: ${logos.length} شعار\n\n`;

    if (frontLogos.length > 0) {
      text += `📍 الواجهة الأمامية (${frontLogos.length} شعار):\n`;
      frontLogos.forEach((l, idx) => {
        const zn = zones.find((z) => z.id === l.zoneId);
        text += `  ${idx + 1}. ${l.name}: منطقة [${zn?.name || 'الصدر'}] | الحجم: ${l.scale}% | التدوير: ${l.rotation}° | الملف: ${l.fileName || 'شعار مخصص'}\n`;
      });
      text += `\n`;
    }

    if (backLogos.length > 0) {
      text += `📍 الجهة الخلفية (${backLogos.length} شعار):\n`;
      backLogos.forEach((l, idx) => {
        const zn = zones.find((z) => z.id === l.zoneId);
        text += `  ${idx + 1}. ${l.name}: منطقة [${zn?.name || 'الظهر'}] | الحجم: ${l.scale}% | التدوير: ${l.rotation}° | الملف: ${l.fileName || 'شعار مخصص'}\n`;
      });
      text += `\n`;
    }

    text += `جاهز للمراجعة وتأكيد الطلب والتنفيذ المباشر بأسوان.`;

    window.open(generateWhatsAppLink(undefined, text), '_blank');
  };

  const [cartSuccessNotice, setCartSuccessNotice] = useState(false);

  const handleAddToCart = () => {
    let previewDataUrl: string | undefined = undefined;
    try {
      if (canvasRef.current) {
        // Create an optimized 120x120 thumbnail to avoid localStorage quota issues
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 120;
        thumbCanvas.height = 120;
        const thumbCtx = thumbCanvas.getContext('2d');
        if (thumbCtx) {
          thumbCtx.drawImage(canvasRef.current, 0, 0, 120, 120);
          previewDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.7);
        }
      }
    } catch (e) {
      console.warn('Canvas thumbnail generation failed', e);
    }

    const selectedColorObj =
      selectedProduct?.colors.find((c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase()) || {
        id: 'selected',
        name: 'اللون المختار',
        hex: selectedColorHex,
      };

    const frontLogos = logos.filter((l) => l.view === 'front');
    const backLogos = logos.filter((l) => l.view === 'back');
    const viewsList: string[] = [];
    if (frontLogos.length > 0) viewsList.push(`أمام (${frontLogos.length})`);
    if (backLogos.length > 0) viewsList.push(`خلف (${backLogos.length})`);

    addToCart({
      productId: selectedProduct?.id || 'custom-item',
      name: selectedProduct?.name || 'منتج مخصص',
      subtitle: `${selectedProduct?.subtitle || 'مخصص في استوديو يوزرسيف'} · (${logos.length} شعارات)`,
      price: parsePriceToNumber(selectedProduct?.price || 250),
      originalPriceStr: selectedProduct?.price || '250 ج.م',
      quantity: 1,
      selectedColor: selectedColorObj,
      selectedSize: selectedProduct?.hasSizes ? selectedCustomSize : 'Free Size',
      imageUrl: selectedProduct?.imageUrl || '/services-cards/card-hoodie.png',
      customization: {
        hasCustomDesign: true,
        previewUrl: previewDataUrl,
        zoneName: logos.map((l) => l.name).join(' + '),
        view: viewsList.join(' | ') || (activeView === 'front' ? 'الواجهة الأمامية' : 'الجهة الخلفية'),
        artworkName: `${logos.length} شعارات: ` + logos.map((l) => l.fileName || l.name).join(', '),
        notes: `عدد الشعارات: ${logos.length}. ${logos.map((l) => `[${l.name} (${l.view === 'front' ? 'أمام' : 'خلف'}): حجم ${l.scale}%]`).join('، ')}`,
      },
    });

    setStatusMessage('تمت إضافة التصميم المخصص بنجاح إلى سلة المشتريات!');
    setCartSuccessNotice(true);
    setTimeout(() => setCartSuccessNotice(false), 6000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B5F55] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#073B35]">جاري تحميل استوديو التخصيص والموك أب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F1E7] min-h-screen pb-16 font-sans antialiased text-[#073B35]" dir="rtl">
      {/* ─────────────────────────────────────────────────────────────
          Top Header Bar
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#D7DEDB] sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="p-2 rounded-xl border border-[#D7DEDB] hover:bg-[#F6F1E7] text-[#073B35] transition-colors"
              title="العودة لكتالوج المنتجات"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#0B5F55] font-display">
                  استوديو تخصيص المنتج واللوجو
                </h1>
                <Badge variant="outline" className="text-xs bg-[#0B5F55]/10 text-[#0B5F55] border-[#0B5F55]/20 font-bold">
                  Live Mockup Engine
                </Badge>
              </div>
              <p className="text-xs text-[#5B6B68]">
                حدّد منطقة الطباعة، ارفع الشعار، وعدّل الموضع بدقة مع حفظ مواصفات التنفيذ بأسوان.
              </p>
            </div>
          </div>

          {/* Quick Product Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#5B6B68] hidden sm:inline">المنتج المعروض:</label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) applyProduct(prod);
              }}
              className="bg-white border border-[#D7DEDB] rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold text-[#073B35] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B5F55]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          Main Studio Grid (Stage on Left/Sticky, Controls on Right)
      ───────────────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ───────────────────────────────────────────────
              Canvas Stage (Cols 1-7 on desktop)
          ─────────────────────────────────────────────── */}
          <section className="lg:col-span-7 bg-white border border-[#D7DEDB] rounded-2xl p-4 sm:p-6 shadow-sm sticky top-20">
            <div className="relative flex items-center justify-center bg-[#EBE6DC] rounded-xl overflow-hidden border border-[#D7DEDB]/60">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="w-full h-auto max-w-[620px] max-h-[620px] aspect-square block cursor-grab active:cursor-grabbing touch-none select-none"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onWheel={handleWheel}
              />

              {/* View Indicator Overlay Tag */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-[#D7DEDB] rounded-md px-2.5 py-1 text-[11px] font-bold text-[#073B35] flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#0B5F55] animate-pulse" />
                <span>منظور: {activeView === 'front' ? 'الواجهة الأمامية' : activeView === 'back' ? 'الجهة الخلفية' : 'المنظور الجانبي'}</span>
              </div>

              {/* Mode Indicator Overlay Tag */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-[#D7DEDB] rounded-md px-2.5 py-1 text-[11px] font-bold text-[#073B35] flex items-center gap-1.5 shadow-xs">
                <span className="text-[#0B5F55]">الوضع:</span>
                <span>{controlMode === 'area' ? 'تحرير أبعاد ومكان المنطقة' : 'تحريك وتكبير الشعار'}</span>
              </div>
            </div>

            <p className="text-xs text-[#5B6B68] mt-3 leading-relaxed">
              💡 <strong>طريقة التحكم التفاعلي:</strong> في مرحلة تحديد المنطقة، اسحب المنطقة لنقلها أو اسحب أركان المربع الأبيض لتغيير المقاس. في مرحلة تحريك الصورة، اسحب الشعار لنقله، واستخدم عجلة الماوس للتكبير والتصغير.
            </p>
          </section>

          {/* ───────────────────────────────────────────────
              Control Panels (Cols 8-12 on desktop)
          ─────────────────────────────────────────────── */}
          <section className="lg:col-span-5 space-y-4">
            {/* Step 1 & 2: Primary Control Card */}
            <div className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-4">
              {/* Step 1: Area Tools */}
              <div>
                <p className="text-xs font-bold text-[#0B5F55] border-b border-[#D7DEDB] pb-1.5 mb-3 flex items-center justify-between">
                  <span>١ · تحديد منطقة الطباعة (Print Area)</span>
                  <span className="text-[10px] text-[#5B6B68]">المقاس: {currentZone?.cmWidth || 25}×{currentZone?.cmHeight || 25} سم</span>
                </p>

                {/* View Switcher (Front / Back) */}
                {selectedProduct && selectedProduct.views.length > 1 && (
                  <div className="flex border border-[#D7DEDB] rounded-lg overflow-hidden mb-3">
                    {selectedProduct.views.map((v) => {
                      const count = logos.filter((l) => l.view === v.id).length;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setActiveView(v.id);
                            const matchedZone = zones.find((z) => z.view === v.id);
                            if (matchedZone) setActiveZoneId(matchedZone.id);
                            const firstLogoOnView = logos.find((l) => l.view === v.id);
                            if (firstLogoOnView) setActiveLogoId(firstLogoOnView.id);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            activeView === v.id ? 'bg-[#0B5F55] text-white' : 'bg-white text-[#073B35] hover:bg-[#F6F1E7]'
                          }`}
                        >
                          <span>{v.label}</span>
                          {count > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                              activeView === v.id ? 'bg-white/20 text-white' : 'bg-[#0B5F55]/10 text-[#0B5F55]'
                            }`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Zone Management Bar */}
                <div className="flex border border-[#D7DEDB] rounded-lg overflow-hidden mb-3">
                  <button
                    type="button"
                    onClick={handleAddZone}
                    className="flex-1 py-1.5 text-xs font-bold bg-white text-[#073B35] hover:bg-[#F6F1E7] border-l border-[#D7DEDB] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0B5F55]" />
                    <span>إضافة منطقة</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteZone}
                    className="flex-1 py-1.5 text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المنطقة</span>
                  </button>
                </div>

                {/* Ready Presets Buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#5B6B68]">مقاسات ومواضع جاهزة:</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPresetZone('صدر كامل (A4)', 260, 260, 280, 280, 'round', 'front')}
                      className="px-2.5 py-1 text-xs rounded-md bg-[#F6F1E7] border border-[#D7DEDB] hover:border-[#0B5F55] font-bold cursor-pointer"
                    >
                      صدر كامل
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetZone('صدر يسار (شعار الجيب)', 430, 250, 120, 120, 'round', 'front')}
                      className="px-2.5 py-1 text-xs rounded-md bg-[#F6F1E7] border border-[#D7DEDB] hover:border-[#0B5F55] font-bold cursor-pointer"
                    >
                      صدر يسار (Pocket)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetZone('ظهر كامل (A3)', 250, 240, 300, 320, 'round', 'back')}
                      className="px-2.5 py-1 text-xs rounded-md bg-[#F6F1E7] border border-[#D7DEDB] hover:border-[#0B5F55] font-bold cursor-pointer"
                    >
                      ظهر كامل
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetZone('أعلى الرقبة / الظهر', 330, 210, 140, 90, 'round', 'back')}
                      className="px-2.5 py-1 text-xs rounded-md bg-[#F6F1E7] border border-[#D7DEDB] hover:border-[#0B5F55] font-bold cursor-pointer"
                    >
                      أعلى الظهر
                    </button>
                  </div>
                </div>

                {/* Zone Shape Select */}
                <div className="mt-3">
                  <label className="text-xs font-bold text-[#5B6B68] block mb-1">شكل إطار الطباعة:</label>
                  <select
                    value={currentZone?.shape || 'round'}
                    onChange={(e) => updateActiveZone({ shape: e.target.value as 'round' | 'square' | 'circle' })}
                    className="w-full bg-white border border-[#D7DEDB] rounded-lg px-3 py-1.5 text-xs font-bold text-[#073B35] cursor-pointer"
                  >
                    <option value="round">مستطيل بحواف مدورة (Rounded Rectangle)</option>
                    <option value="square">مستطيل حاد الزوايا (Square)</option>
                    <option value="circle">دائرة / بيضاوي (Circle / Oval)</option>
                  </select>
                </div>
              </div>

              {/* Step 2: Multi-Logo Layers Management */}
              <div className="pt-2 space-y-3">
                <div className="border-b border-[#D7DEDB] pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#0B5F55]" />
                    <p className="text-xs font-bold text-[#0B5F55]">
                      ٢ · طبقات الشعارات والصور ({logos.length})
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-[#0B5F55]/10 text-[#0B5F55] border-[#0B5F55]/20 font-bold">
                    أكثر من لوجو أمام وخلف
                  </Badge>
                </div>

                {/* Quick Add Logo Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <label className="py-2 px-2.5 bg-[#0B5F55] hover:bg-[#073B35] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors text-center">
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>+ رفع لوجو كطبقة جديدة</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddNewLogoWithFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleAddNewLogoLayer(activeView)}
                    className="py-2 px-2.5 bg-white border border-[#D7DEDB] hover:border-[#0B5F55] hover:bg-emerald-50/50 text-[#073B35] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0B5F55] shrink-0" />
                    <span>+ إضافة شعار إضافي</span>
                  </button>
                </div>

                {/* If activeView is 'back' and no logo is on back yet, show friendly banner */}
                {activeView === 'back' && logos.filter((l) => l.view === 'back').length === 0 && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="text-[11px] text-amber-900 font-bold">
                      💡 لا يوجد لوجو على الظهر حالياً!
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddNewLogoLayer('back')}
                      className="px-3 py-1 bg-[#0B5F55] hover:bg-[#073B35] text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer transition-colors shadow-xs"
                    >
                      + أضف شعار للظهر
                    </button>
                  </div>
                )}

                {/* Layers List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5">
                  {logos.map((layer) => {
                    const isSelected = layer.id === activeLogoId;
                    const viewName = layer.view === 'front' ? 'الواجهة الأمامية' : 'الجهة الخلفية';

                    return (
                      <div
                        key={layer.id}
                        onClick={() => {
                          setActiveLogoId(layer.id);
                          if (layer.view !== activeView) {
                            setActiveView(layer.view);
                          }
                          if (layer.zoneId) {
                            setActiveZoneId(layer.zoneId);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0B5F55] bg-emerald-50/50 shadow-xs ring-1 ring-[#0B5F55]/20'
                            : 'border-[#D7DEDB] bg-white hover:border-[#0B5F55]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Thumbnail & Title */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-[#EFEAE0] border border-[#D7DEDB] flex items-center justify-center overflow-hidden shrink-0">
                              {layer.image && layer.image.src ? (
                                <img
                                  src={layer.image.src}
                                  alt={layer.name}
                                  className="w-full h-full object-contain p-0.5"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-[#5B6B68]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-[#073B35] truncate">
                                  {layer.name}
                                </span>
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-[#0B5F55]" />
                                )}
                              </div>
                              <p className="text-[10px] text-[#5B6B68] truncate">
                                {layer.fileName || 'بدون اسم ملف'} · الحجم: {layer.scale}%
                              </p>
                            </div>
                          </div>

                          {/* View Toggle & Actions */}
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {/* View Switcher Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const nextView = layer.view === 'front' ? 'back' : 'front';
                                const targetZone = zones.find((z) => z.view === nextView) || zones[0];
                                updateLogoById(layer.id, {
                                  view: nextView,
                                  zoneId: targetZone ? targetZone.id : layer.zoneId,
                                });
                                setActiveView(nextView);
                                setActiveLogoId(layer.id);
                                if (targetZone) setActiveZoneId(targetZone.id);
                              }}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md border cursor-pointer transition-colors ${
                                layer.view === 'front'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                              }`}
                              title="اضغط للنقل السريع بين الأمام والخلف"
                            >
                              {layer.view === 'front' ? 'أمام' : 'خلف'} ⇄
                            </button>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateLogo(layer.id)}
                              className="p-1 text-[#5B6B68] hover:text-[#0B5F55] hover:bg-[#F6F1E7] rounded-md transition-colors"
                              title="تكرار الشعار"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo(layer.id)}
                              className="p-1 text-[#5B6B68] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="حذف هذا الشعار"
                              disabled={logos.length <= 1}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Zone Assignment Dropdown (shown when active) */}
                        {isSelected && (
                          <div className="mt-2.5 pt-2 border-t border-[#D7DEDB]/60 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-[#5B6B68] shrink-0">
                              المنطقة:
                            </span>
                            <select
                              value={layer.zoneId}
                              onChange={(e) => {
                                updateLogoById(layer.id, { zoneId: e.target.value });
                                setActiveZoneId(e.target.value);
                              }}
                              className="bg-white border border-[#D7DEDB] rounded-md px-2 py-1 text-[11px] font-bold text-[#073B35] cursor-pointer flex-1 focus:ring-1 focus:ring-[#0B5F55]"
                            >
                              {zones
                                .filter((z) => z.view === layer.view)
                                .map((z) => (
                                  <option key={z.id} value={z.id}>
                                    {z.name} ({z.cmWidth}×{z.cmHeight} سم)
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload or Replace Image for the Currently Selected Logo */}
                {activeLogo && (
                  <div className="pt-1">
                    <label className="border-2 border-dashed border-[#D7DEDB] hover:border-[#0B5F55] rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-[#F6F1E7]/40 hover:bg-[#F6F1E7] transition-all text-center">
                      <Upload className="w-5 h-5 text-[#0B5F55]" />
                      <span className="text-xs font-bold text-[#073B35]">
                        استبدال صورة: {activeLogo.name}
                      </span>
                      <span className="text-[10px] text-[#5B6B68]">
                        الملف الحالي: {activeLogo.fileName || 'افتراضي'} (اضغط لاختيار صورة أخرى)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, activeLogo.id)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Step 3: Transform & Control Mode */}
              <div className="pt-2 space-y-3">
                <p className="text-xs font-bold text-[#0B5F55] border-b border-[#D7DEDB] pb-1.5 mb-1.5 flex items-center justify-between">
                  <span>٣ · ضبط موضع وتكبير الشعار المختار</span>
                  <span className="text-[10px] text-[#5B6B68] font-bold">
                    {activeLogo?.name || 'الشعار الحالي'}
                  </span>
                </p>

                {/* Mode Selector */}
                <div className="flex border border-[#D7DEDB] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setControlMode('area')}
                    className={`flex-1 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      controlMode === 'area' ? 'bg-[#0B5F55] text-white' : 'bg-white text-[#073B35] hover:bg-[#F6F1E7]'
                    }`}
                  >
                    <Move className="w-3.5 h-3.5" />
                    <span>تحرير أبعاد المنطقة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setControlMode('image')}
                    className={`flex-1 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      controlMode === 'image' ? 'bg-[#0B5F55] text-white' : 'bg-white text-[#073B35] hover:bg-[#F6F1E7]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تحريك وضبط الشعار</span>
                  </button>
                </div>

                {/* NLP Command Chips */}
                <div>
                  <label className="text-xs font-bold text-[#5B6B68] block mb-1.5">أوامر سريعة للتموضع:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['توسيط', 'تكبير قليلاً', 'تصغير قليلاً', 'تدوير 90°', 'لليسار', 'لليمين', 'للأعلى', 'للأسفل'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => executeCommand(chip)}
                        className="px-2.5 py-1 text-xs rounded-full bg-white border border-[#D7DEDB] hover:border-[#0B5F55] hover:text-[#0B5F55] font-bold cursor-pointer transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text command input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeCommand(commandInput)}
                    placeholder="أمر نصي، مثال: تكبير الشعار وتوسيخه"
                    className="flex-1 bg-white border border-[#D7DEDB] rounded-lg px-3 py-1.5 text-xs font-medium text-[#073B35] focus:outline-none focus:ring-1 focus:ring-[#0B5F55]"
                  />
                  <button
                    type="button"
                    onClick={() => executeCommand(commandInput)}
                    className="px-3 py-1.5 bg-[#0B5F55] hover:bg-[#073B35] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    تنفيذ
                  </button>
                </div>

                {commandFeedback && (
                  <p className="text-xs text-[#0B5F55] font-bold bg-[#0B5F55]/10 px-2.5 py-1.5 rounded-md">
                    ✓ {commandFeedback}
                  </p>
                )}

                {statusMessage && (
                  <p className="text-[11px] text-[#5B6B68]">
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Product Color & Specs Card */}
            <div className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-[#0B5F55] border-b border-[#D7DEDB] pb-1.5">
                لون المنتج وخامة التنفيذ
              </h2>

              {/* Color Swatches */}
              <div>
                <label className="text-xs font-bold text-[#5B6B68] block mb-2">اختر لون المنتج:</label>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {(selectedProduct?.colors || Object.values(COMMON_COLORS)).map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        setSelectedColorHex(col.hex);
                        setCustomHex(col.hex);
                      }}
                      title={col.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColorHex === col.hex ? 'border-[#0B5F55] scale-115 shadow-sm' : 'border-white shadow-xs hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    />
                  ))}

                  {/* Native Custom Color Picker */}
                  <div className="flex items-center gap-1.5 mr-2">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => {
                        setCustomHex(e.target.value);
                        setSelectedColorHex(e.target.value);
                      }}
                      className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent p-0"
                      title="لون مخصص"
                    />
                    <span className="text-[11px] text-[#5B6B68] font-bold">مخصص</span>
                  </div>
                </div>
              </div>

              {/* Size Selector if product has sizes */}
              {selectedProduct?.hasSizes && selectedProduct.sizeStock && Object.keys(selectedProduct.sizeStock).length > 0 && (
                <div className="pt-3 border-t border-[#D7DEDB]/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#5B6B68]">
                      المقاس المطلوب: <strong className="text-[#073B35] font-black">{selectedCustomSize}</strong>
                    </label>
                    {selectedProduct.sizeStock[selectedCustomSize] !== undefined && (
                      <span
                        className={`text-[11px] font-bold ${
                          selectedProduct.sizeStock[selectedCustomSize] <= 0
                            ? 'text-rose-600'
                            : selectedProduct.sizeStock[selectedCustomSize] <= 5
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {selectedProduct.sizeStock[selectedCustomSize] <= 0
                          ? '⚠️ نفد هذا المقاس'
                          : `(متوفر: ${selectedProduct.sizeStock[selectedCustomSize]} قطعة)`}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedProduct.sizeStock).map(([szName, szQty]) => {
                      const isOut = Number(szQty) <= 0;
                      const isSelected = selectedCustomSize === szName;
                      return (
                        <button
                          key={szName}
                          type="button"
                          disabled={isOut}
                          onClick={() => setSelectedCustomSize(szName)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B5F55] text-white shadow-xs scale-102 ring-2 ring-[#0B5F55]/20'
                              : isOut
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 line-through'
                              : 'bg-white text-slate-700 border border-[#D7DEDB] hover:border-[#0B5F55] hover:bg-[#F6F1E7]'
                          }`}
                        >
                          <span>{szName}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                            ({szQty})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If sticker, show shape and cm dropdowns */}
              {selectedProduct?.baseType === 'sticker' && (
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5B6B68] block mb-1">شكل القص:</label>
                    <select
                      value={stickerShape}
                      onChange={(e) => setStickerShape(e.target.value as 'round' | 'circle' | 'square')}
                      className="w-full bg-white border border-[#D7DEDB] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    >
                      <option value="round">مستطيل بحواف مدورة</option>
                      <option value="circle">دائرة</option>
                      <option value="square">مربع</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5B6B68] block mb-1">المقاس (سم):</label>
                    <select
                      value={stickerCm}
                      onChange={(e) => setStickerCm(Number(e.target.value))}
                      className="w-full bg-white border border-[#D7DEDB] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    >
                      <option value="5">5 × 5 سم</option>
                      <option value="7">7 × 7 سم</option>
                      <option value="10">10 × 10 سم</option>
                      <option value="15">15 × 15 سم</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Image Settings (Collapsible details) */}
            <details className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer group">
              <summary className="text-xs font-bold text-[#0B5F55] select-none flex items-center justify-between">
                <span>إعدادات الشعار والخلفية المتقدمة: {activeLogo?.name || 'الشعار'}</span>
                <span className="text-xs text-[#5B6B68] group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="pt-3 space-y-3 cursor-default">
                {/* Brand Logo Presets */}
                <div>
                  <label className="text-xs font-bold text-[#5B6B68] block mb-1.5">شعارات يوزرسيف الجاهزة:</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeLogo) {
                          loadBrandLogoForLayer(activeLogo.id, '/brand/logo-white.png', 'لوجو يوزرسيف (أبيض)', 'white');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0B5F55] text-white text-xs font-bold hover:bg-[#073B35] cursor-pointer"
                    >
                      لوجو يوزرسيف (أبيض)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeLogo) {
                          loadBrandLogoForLayer(activeLogo.id, '/brand/logo-green.png', 'لوجو يوزرسيف (أخضر)', 'green');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0B5F55] border border-[#0B5F55]/30 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                    >
                      لوجو يوزرسيف (أخضر)
                    </button>
                  </div>
                </div>

                {/* Tint switcher for brand logo */}
                <div>
                  <label className="text-xs font-bold text-[#5B6B68] block mb-1">تلوين الشعار:</label>
                  <select
                    value={activeLogo?.tint || 'original'}
                    onChange={(e) => reprocessActiveLogo({ tint: e.target.value as any })}
                    className="w-full bg-white border border-[#D7DEDB] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  >
                    <option value="original">اللون الأصلي للصورة</option>
                    <option value="white">أبيض ناصع (للقمصان الداكنة)</option>
                    <option value="black">أسود ملكي</option>
                    <option value="green">أخضر يوزرسيف المعتمد</option>
                  </select>
                </div>

                {/* Auto Trim & Background Removal */}
                <div className="space-y-2 pt-2 border-t border-[#D7DEDB]/60">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#073B35] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLogo?.autoTrim ?? true}
                      onChange={(e) => reprocessActiveLogo({ autoTrim: e.target.checked })}
                      className="rounded text-[#0B5F55] focus:ring-[#0B5F55]"
                    />
                    <span>قص الحواف الفاضية تلقائياً (Auto-Trim)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-[#073B35] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLogo?.removeBg ?? false}
                      onChange={(e) => reprocessActiveLogo({ removeBg: e.target.checked })}
                      className="rounded text-[#0B5F55] focus:ring-[#0B5F55]"
                    />
                    <span>إزالة الخلفية الموحدة (بدون تشويش)</span>
                  </label>

                  {activeLogo?.removeBg && (
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#5B6B68] mb-1">
                        <span>حساسية إزالة الخلفية:</span>
                        <span>{activeLogo.bgTolerance}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={activeLogo.bgTolerance}
                        onChange={(e) => reprocessActiveLogo({ bgTolerance: Number(e.target.value) })}
                        className="w-full accent-[#0B5F55]"
                      />
                    </div>
                  )}
                </div>

                {/* Fit Mode */}
                <div className="pt-2 border-t border-[#D7DEDB]/60">
                  <label className="text-xs font-bold text-[#5B6B68] block mb-1.5">طريقة التحجيم:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="fit"
                        value="contain"
                        checked={(activeLogo?.fitMode || 'contain') === 'contain'}
                        onChange={() => updateActiveLogo({ fitMode: 'contain' })}
                        className="text-[#0B5F55]"
                      />
                      <span>احتواء (كاملة)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="fit"
                        value="cover"
                        checked={activeLogo?.fitMode === 'cover'}
                        onChange={() => updateActiveLogo({ fitMode: 'cover' })}
                        className="text-[#0B5F55]"
                      />
                      <span>ملء المنطقة</span>
                    </label>
                  </div>
                </div>
              </div>
            </details>

            {/* Manual Sliders & Settings (Collapsible details) */}
            <details className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer group">
              <summary className="text-xs font-bold text-[#0B5F55] select-none flex items-center justify-between">
                <span>ضبط يدوي دقيق للأبعاد والتدوير: {activeLogo?.name || 'الشعار'}</span>
                <span className="text-xs text-[#5B6B68] group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="pt-3 space-y-3 cursor-default">
                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#5B6B68] mb-1">
                    <span>حجم الشعار:</span>
                    <span>{activeLogo?.scale || 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="400"
                    value={activeLogo?.scale || 100}
                    onChange={(e) => updateActiveLogo({ scale: Number(e.target.value) })}
                    className="w-full accent-[#0B5F55]"
                  />
                </div>

                {/* Rotation Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#5B6B68] mb-1">
                    <span>زاوية التدوير:</span>
                    <span>{activeLogo?.rotation || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={activeLogo?.rotation || 0}
                    onChange={(e) => updateActiveLogo({ rotation: Number(e.target.value) })}
                    className="w-full accent-[#0B5F55]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D7DEDB]/60">
                  <button
                    type="button"
                    onClick={resetActiveLogoAdjustments}
                    className="px-3 py-1.5 rounded-lg border border-[#D7DEDB] text-xs font-bold text-[#073B35] hover:bg-[#F6F1E7] cursor-pointer"
                  >
                    رجّع الوضع الافتراضي للشعار
                  </button>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#073B35] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGuide}
                      onChange={(e) => setShowGuide(e.target.checked)}
                      className="rounded text-[#0B5F55]"
                    />
                    <span>اعرض إطار منطقة الطباعة</span>
                  </label>
                </div>
              </div>
            </details>

            {/* Order Readiness Checklist */}
            <div className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-2.5">
              <h2 className="text-xs font-bold text-[#0B5F55] border-b border-[#D7DEDB] pb-1.5">
                جاهزية الطلب للمطابقة بأسوان
              </h2>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>عدد الشعارات المضافة: {logos.length} شعار ({logos.filter(l => l.view === 'front').length} أمام / {logos.filter(l => l.view === 'back').length} خلف)</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>الشعار المحدد: {activeLogo?.name || 'الصدر'} ({activeLogo?.scale || 100}%)</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تم تحديد لون وخامة المنتج بدقة ({selectedColorHex})</span>
                </li>
                <li className="flex items-center gap-2 text-[#5B6B68]">
                  <Info className="w-4 h-4 text-[#0B5F55] shrink-0" />
                  <span>جاهز للتصدير وتأكيد الطلب الفوري مع المشغل المباشر</span>
                </li>
              </ul>
            </div>

            {/* Export & Order Buttons */}
            <div className="bg-white border border-[#D7DEDB] rounded-2xl p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-[#0B5F55] border-b border-[#D7DEDB] pb-1.5">
                التصدير وتثبيت الطلب
              </h2>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="py-2.5 px-3 bg-[#0B5F55] hover:bg-[#073B35] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل المعاينة (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="py-2.5 px-3 bg-white border border-[#D7DEDB] hover:border-[#0B5F55] text-[#073B35] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#0B5F55]" />
                  <span>تحميل الإعدادات (JSON)</span>
                </button>
              </div>

              {/* Success Notification Banner for Cart */}
              {cartSuccessNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-[#0B5F55]/40 text-[#073B35] space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 text-[#0B5F55]" />
                    <span>تمت إضافة التصميم إلى سلة المشتريات!</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to="/cart"
                      className="flex-1 py-1.5 px-3 bg-[#0B5F55] hover:bg-[#073B35] text-white rounded-xl text-xs font-bold text-center transition-colors"
                    >
                      عرض السلة وإتمام الطلب →
                    </Link>
                  </div>
                </div>
              )}

              {/* Primary Add to Cart Button */}
              {(() => {
                const totalStock = selectedProduct ? computeTotalStock(selectedProduct) : 50;
                const isOutOfStock = totalStock <= 0;
                const isSizeOutOfStock = Boolean(
                  selectedProduct?.hasSizes &&
                  selectedProduct.sizeStock &&
                  (selectedProduct.sizeStock[selectedCustomSize] ?? 1) <= 0
                );
                const isDisabled = isOutOfStock || isSizeOutOfStock;

                return (
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
                      isDisabled
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-[#0B5F55] hover:bg-[#073B35] text-white cursor-pointer shadow-md scale-100 hover:scale-[1.01]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E3A92F]" />
                    <span>
                      {isOutOfStock
                        ? 'المنتج نفد من المخزون حالياً ⚠️'
                        : isSizeOutOfStock
                        ? `مقاس (${selectedCustomSize}) غير متوفر بالمخزون ⚠️`
                        : 'إضافة التصميم إلى سلة المشتريات 🛒'}
                    </span>
                  </button>
                );
              })()}

              <button
                type="button"
                onClick={handleSendOrder}
                className="w-full py-3 px-4 bg-[#E3A92F] hover:bg-[#c9911e] text-[#3A2A00] rounded-xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all scale-100 hover:scale-101"
              >
                <Send className="w-4 h-4" />
                <span>إرسال وتأكيد الطلب عبر واتساب ⚡</span>
              </button>

              <p className="text-[11px] text-[#5B6B68] text-center">
                عند الإرسال، يمكنك إرفاق صورة المعاينة وملف الشعار الأصلي لضمان أعلى دقة طباعة وتطريز.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
