export type ProductType = 'tshirt' | 'hoodie' | 'cap' | 'mug' | 'case';

export type CatalogBaseType = 'hoodie' | 'tshirt' | 'cap' | 'mug' | 'sticker' | 'case' | 'custom';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}

export interface ProductView {
  id: string;
  label: string;
}

export interface OverlayAnchor {
  x: number;     // horizontal position (percentage 0-100)
  y: number;     // vertical position (percentage 0-100)
  width: number; // width relative to product box (percentage 0-100)
}

export interface ProductItem {
  id: ProductType;
  name: string;
  subtitle: string;
  serviceId: string;
  colors: ProductColor[];
  views: ProductView[];
  defaultColor: string;
  defaultView: string;
  hasTurntable?: boolean;
  turntableAngles?: number[];
  overlayAnchors: Record<string, OverlayAnchor>;
}

export interface PrintZone {
  id: string;
  name: string;
  view: string; // 'front' | 'back' | 'side'
  shape: 'round' | 'square' | 'circle';
  x: number; // canvas X (out of 800)
  y: number; // canvas Y (out of 800)
  w: number; // width in canvas px
  h: number; // height in canvas px
  cmWidth?: number; // approximate real cm (for display)
  cmHeight?: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  nameEn?: string;
  subtitle: string;
  description: string;
  category: 'clothing' | 'caps' | 'stickers' | 'mugs-gifts' | 'phone-cases' | 'other';
  categoryLabel: string;
  price: string;
  material?: string;
  baseType: CatalogBaseType;
  imageUrl: string;
  colors: ProductColor[];
  defaultColor: string;
  views: ProductView[];
  defaultView: string;
  badge?: string;
  isActive: boolean;
  isHidden?: boolean; // true = مخفي عن الزوار في المتجر، false = معروض
  isFeatured?: boolean;
  createdAt: string;
  defaultZones: PrintZone[];
  // Inventory & Sizes
  stock?: number; // إجمالي المخزون المتوفر
  hasSizes?: boolean; // هل يتوفر بمقاسات مختلفة؟
  sizeStock?: Record<string, number>; // توزيع المخزون لكل مقاس: { S: 15, M: 25, L: 40... }
  lowStockThreshold?: number; // حد تنبيه انخفاض المخزون (افتراضي 10)
}

export const DEFAULT_CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const EXTENDED_CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
export const DEFAULT_STICKER_SIZES = ['صغير (5x5 سم)', 'وسط (10x10 سم)', 'كبير (15x15 سم)'];
export const DEFAULT_PHONE_SIZES = ['iPhone 13/14', 'iPhone 15/15 Pro', 'Samsung S23/S24'];

/**
 * دالة حساب إجمالي المخزون للمنتج
 * إذا كان المنتج بمقاسات، يتم جمع كميات كل المقاسات تلقائياً
 */
export function computeTotalStock(product: Partial<CatalogProduct>): number {
  if (product.hasSizes && product.sizeStock && Object.keys(product.sizeStock).length > 0) {
    return Object.values(product.sizeStock).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
  }
  return typeof product.stock === 'number' ? Math.max(0, product.stock) : 50;
}

/**
 * فحص حالة المخزون (متوفر، منخفض، نافد)
 */
export function getStockStatus(stock: number, lowThreshold = 10) {
  if (stock <= 0) {
    return {
      status: 'out_of_stock' as const,
      label: 'نفد من المخزون',
      color: '#DC2626',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  if (stock <= lowThreshold) {
    return {
      status: 'low_stock' as const,
      label: `مخزون منخفض (${stock} قطع)`,
      color: '#D97706',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }
  return {
    status: 'in_stock' as const,
    label: `متوفر (${stock} قطعة)`,
    color: '#059669',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };
}

/**
 * فحص هل المنتج معروض للعملاء في المتجر
 */
export function isProductVisible(product: CatalogProduct): boolean {
  if (product.isHidden === true) return false;
  if (product.isActive === false) return false;
  return true;
}

export const COMMON_COLORS: Record<string, ProductColor> = {
  white: { id: 'white', name: 'أبيض', hex: '#FFFFFF', border: true },
  black: { id: 'black', name: 'أسود', hex: '#18181B' },
  grey: { id: 'grey', name: 'رمادي', hex: '#9CA3AF' },
  green: { id: 'green', name: 'أخضر يوزرسيف', hex: '#0B5F55' },
  cream: { id: 'cream', name: 'بيج كريمي', hex: '#E2DBD2' },
  navy: { id: 'navy', name: 'كحلي ملكي', hex: '#1A2A3A' },
  maroon: { id: 'maroon', name: 'عنابي / مارون', hex: '#5B1414' },
};

export const TURNTABLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-hoodie-oversized',
    name: 'هودي يوزرسيف أوفر سايز فاخر',
    nameEn: 'Yuzersef Heavyweight Oversized Hoodie',
    subtitle: 'قطن ميلتون مصري 100% مبطن عالي الكثافة',
    description: 'هودي شتوي فاخر بقصة أوفر سايز عصرية وجيب كنغر أمامي مع قبعة مزدوجة. مصمم خصيصاً للطباعة الدقيقة والتطريز البارز على الصدر والظهر بجودة لا تتأثر بالغسيل المتكرر.',
    material: 'قطن مصري 100% مبطن ناعم 380 GSM',
    category: 'clothing',
    categoryLabel: 'ملابس وهوديز',
    price: '290 ج.م',
    baseType: 'hoodie',
    imageUrl: '/products/Gemini_Generated_Image_rgwu3wrgwu3wrgwu.jpg',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
      COMMON_COLORS.white,
      COMMON_COLORS.grey,
      COMMON_COLORS.navy,
      COMMON_COLORS.maroon,
    ],
    defaultColor: 'black',
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'back', label: 'الجهة الخلفية' },
    ],
    defaultView: 'front',
    badge: 'الأكثر طلباً',
    isActive: true,
    isHidden: false,
    isFeatured: true,
    hasSizes: true,
    sizeStock: { S: 15, M: 30, L: 45, XL: 25, XXL: 10 },
    stock: 125,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-front-center', name: 'صدر كامل', view: 'front', shape: 'round', x: 260, y: 270, w: 280, h: 260, cmWidth: 28, cmHeight: 26 },
      { id: 'z-front-pocket', name: 'صدر يسار (شعار)', view: 'front', shape: 'round', x: 440, y: 260, w: 120, h: 120, cmWidth: 10, cmHeight: 10 },
      { id: 'z-back-full', name: 'ظهر كامل', view: 'back', shape: 'round', x: 250, y: 250, w: 300, h: 320, cmWidth: 30, cmHeight: 32 },
      { id: 'z-back-top', name: 'أعلى الظهر', view: 'back', shape: 'round', x: 330, y: 220, w: 140, h: 90, cmWidth: 14, cmHeight: 9 },
    ],
  },
  {
    id: 'prod-tshirt-premium',
    name: 'تيشيرت كلاسيك قطن 100%',
    nameEn: 'Premium Crewneck T-Shirt',
    subtitle: 'سنجل جيرسي معالج ضد الانكماش',
    description: 'تيشيرت صيفي قطني فائق النعومة، يدعم طباعة DTF فوتوغرافية ساطعة بالألوان الكاملة بدقة عالية ومقاومة للمياه والحرارة في أسوان.',
    material: 'قطن مصري سنجل جيرسي 200 GSM',
    category: 'clothing',
    categoryLabel: 'ملابس وهوديز',
    price: '185 ج.م',
    baseType: 'tshirt',
    imageUrl: '/products/Gemini_Generated_Image_wukcd2wukcd2wukc.jpg',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
      COMMON_COLORS.grey,
      COMMON_COLORS.navy,
    ],
    defaultColor: 'white',
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'back', label: 'الجهة الخلفية' },
    ],
    defaultView: 'front',
    badge: 'طباعة DTF',
    isActive: true,
    isHidden: false,
    isFeatured: true,
    hasSizes: true,
    sizeStock: { S: 25, M: 50, L: 60, XL: 35, XXL: 15 },
    stock: 185,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-tshirt-center', name: 'صدر كامل', view: 'front', shape: 'round', x: 270, y: 260, w: 260, h: 280, cmWidth: 28, cmHeight: 30 },
      { id: 'z-tshirt-left', name: 'شعار صدر يسار', view: 'front', shape: 'round', x: 430, y: 250, w: 120, h: 120, cmWidth: 10, cmHeight: 10 },
      { id: 'z-tshirt-back', name: 'ظهر كامل', view: 'back', shape: 'round', x: 260, y: 240, w: 280, h: 320, cmWidth: 28, cmHeight: 32 },
    ],
  },
  {
    id: 'prod-cap-embroidery',
    name: 'كاب بيسبول وسناب باك بتطريز ميكانيكي',
    nameEn: 'Custom 3D Embroidered Cap',
    subtitle: 'تطريز بارز ثلاثي الأبعاد بخيوط ميتاليك',
    description: 'كاب كلاسيكي بـ 6 ألواح وقناع مقوس مع قفل معدني خلفي قابل للتعديل بالكامل. نوفر تطريز بارز عالي الدقة لشعارك أو حروف كاليجرافي عربية.',
    material: 'قطن ممشط متين مع فتحات تهوية مطرزة',
    category: 'caps',
    categoryLabel: 'كابات وتطريز',
    price: '95 ج.م',
    baseType: 'cap',
    imageUrl: '/products/WhatsApp Image 2026-10-24 at 11.32.18 AM.jpeg',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
      COMMON_COLORS.white,
      COMMON_COLORS.grey,
    ],
    defaultColor: 'black',
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'side', label: 'المنظور الجانبي' },
    ],
    defaultView: 'front',
    badge: 'تطريز 3D',
    isActive: true,
    isHidden: false,
    isFeatured: true,
    hasSizes: true,
    sizeStock: { 'مقاس موحد (Free Size)': 48 },
    stock: 48,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-cap-front', name: 'واجهة الكاب (أمامي)', view: 'front', shape: 'round', x: 290, y: 270, w: 220, h: 150, cmWidth: 12, cmHeight: 7 },
      { id: 'z-cap-side', name: 'الجانب الأيسر', view: 'side', shape: 'round', x: 300, y: 290, w: 180, h: 130, cmWidth: 9, cmHeight: 6 },
    ],
  },
  {
    id: 'prod-mug-ceramic',
    name: 'مج سيراميك حراري وسحري',
    nameEn: 'Sublimation Ceramic Mug',
    subtitle: 'طباعة فوتوغرافية سبلميشن زاهية',
    description: 'مج سيراميك أبيض نقي 11 أونصة، مع طباعة حرارية كاملة مقاومة للغسيل بالميكروويف وغسالات الأطباق. إمكانية كتابة أسماء أو طباعة شعار الشركة من الجهتين.',
    material: 'سيراميك بورسيلين لامع عالي التحمل',
    category: 'mugs-gifts',
    categoryLabel: 'أكواب وهدايا',
    price: '85 ج.م',
    baseType: 'mug',
    imageUrl: '/products/WhatsApp Image 2026-10-24 at 11.32.1228 AM.jpeg',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.green,
      COMMON_COLORS.grey,
    ],
    defaultColor: 'white',
    views: [
      { id: 'front', label: 'العرض الأساسي' },
    ],
    defaultView: 'front',
    badge: 'طباعة حرارية',
    isActive: true,
    isHidden: false,
    isFeatured: true,
    hasSizes: false,
    stock: 75,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-mug-center', name: 'واجهة المج', view: 'front', shape: 'round', x: 280, y: 260, w: 240, h: 260, cmWidth: 9, cmHeight: 9 },
    ],
  },
  {
    id: 'prod-stickers-diecut',
    name: 'استيكرات فينيل Die-Cut مقصوصة بالليزر',
    nameEn: 'Waterproof Die-Cut Vinyl Stickers',
    subtitle: 'فينيل ألماني مقاوم للماء والحرارة والخدش',
    description: 'ملصقات فينيل ممتازة مقصوصة بدقة دي-كت على شكل أطراف الشعار. مثالية للسيارات، اللابتوب، زجاجات المياه، وبوكسات التغليف مع لاصق قوي يدوم طويلاً.',
    material: 'فينيل بوليمري مع طبقة حماية UV لامعة أو مطفية',
    category: 'stickers',
    categoryLabel: 'استيكرات وجرابات',
    price: '45 ج.م',
    baseType: 'sticker',
    imageUrl: '/products/ر.jpg',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.green,
    ],
    defaultColor: 'white',
    views: [
      { id: 'front', label: 'عرض الاستيكر' },
    ],
    defaultView: 'front',
    badge: 'مقاوم للماء',
    isActive: true,
    isHidden: false,
    isFeatured: true,
    hasSizes: true,
    sizeStock: { 'صغير (5x5 سم)': 150, 'وسط (10x10 سم)': 80, 'كبير (15x15 سم)': 35 },
    stock: 265,
    lowStockThreshold: 15,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-sticker-main', name: 'منطقة القص المخصصة', view: 'front', shape: 'round', x: 250, y: 250, w: 300, h: 300, cmWidth: 10, cmHeight: 10 },
    ],
  },
  {
    id: 'prod-case-shockproof',
    name: 'جراب هاتف مخصص ضد الصدمات',
    nameEn: 'Shockproof Custom Phone Case',
    subtitle: 'طباعة UV بارزة بدقة ألوان ساطعة',
    description: 'جراب حماية متين من السيليكون المقوى مع حواف هوائية مضادة للصدمات وشفة مرتفعة لحماية الكاميرات. متوفر لأكثر من 100 موديل لهواتف آبل وسامسونج.',
    material: 'سيليكون مرن مقوى مع ظهر بولي كربونات صلب',
    category: 'phone-cases',
    categoryLabel: 'استيكرات وجرابات',
    price: '120 ج.م',
    baseType: 'case',
    imageUrl: '/products/Gemini_Generated_Image_sxtrsesxtrsesxtr.jpg',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.white,
      COMMON_COLORS.green,
      COMMON_COLORS.navy,
      COMMON_COLORS.grey,
    ],
    defaultColor: 'black',
    views: [
      { id: 'back', label: 'ظهر الجراب' },
    ],
    defaultView: 'back',
    badge: 'طباعة UV',
    isActive: true,
    isHidden: false,
    isFeatured: false,
    hasSizes: true,
    sizeStock: { 'iPhone 13/14': 25, 'iPhone 15/15 Pro': 40, 'Samsung S23/S24': 20 },
    stock: 85,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    defaultZones: [
      { id: 'z-case-back', name: 'ظهر الجراب (أسفل الكاميرا)', view: 'back', shape: 'round', x: 310, y: 320, w: 180, h: 280, cmWidth: 6, cmHeight: 9 },
    ],
  },
];


/**
 * Returns the transparent logo file path based on the base colour.
 * - logo-white.png on dark/vibrant colors: black, grey, deep green
 * - logo-green.png on light colors: white and cream
 */
export function getLogoOverlayPath(colorId: string): string {
  if (colorId === 'white' || colorId === 'cream') {
    return '/logo/logo-green.png';
  }
  return '/logo/logo-white.png';
}

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 'tshirt',
    name: 'تيشرت تجريبي (Demo T-Shirt)',
    subtitle: 'معاينة تصميم وطباعة تجريبية',
    serviceId: 'clothing-hoodies',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.grey,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
    ],
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'back', label: 'الجهة الخلفية' },
    ],
    defaultColor: 'white',
    defaultView: 'front',
    // Realistic chest print proportions (scaled an additional 10% smaller: 18.4% of canvas, perfectly centered on chest)
    overlayAnchors: {
      front: { x: 50, y: 40, width: 18.4 },
      back: { x: 50, y: 40, width: 18.4 },
    },
  },
  {
    id: 'hoodie',
    name: 'هودي تجريبي (Demo Hoodie)',
    subtitle: 'معاينة تصميم وطباعة تجريبية',
    serviceId: 'clothing-hoodies',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.white,
      COMMON_COLORS.grey,
      COMMON_COLORS.green,
      COMMON_COLORS.cream,
    ],
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'back', label: 'الجهة الخلفية' },
    ],
    defaultColor: 'black',
    defaultView: 'front',
    // Proportional chest print (23% width, top: 42% between drawstring cords)
    overlayAnchors: {
      front: { x: 50, y: 42, width: 23 },
      back: { x: 50, y: 42, width: 23 },
    },
  },
  {
    id: 'cap',
    name: 'كاب تجريبي (Demo Cap)',
    subtitle: 'معاينة تصميم وطباعة تجريبية',
    serviceId: 'caps-embroidery',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.white,
      COMMON_COLORS.green,
      COMMON_COLORS.grey,
      COMMON_COLORS.cream,
    ],
    views: [
      { id: 'front', label: 'الواجهة الأمامية' },
      { id: 'side', label: 'المنظور الجانبي' },
    ],
    defaultColor: 'black',
    defaultView: 'front',
    // Accurate cap forehead patch (19% width, top: 48%)
    overlayAnchors: {
      front: { x: 50, y: 48, width: 19 },
      side: { x: 44, y: 48, width: 16 },
    },
  },
  {
    id: 'mug',
    name: 'مج تجريبي (Demo Mug)',
    subtitle: 'معاينة تصميم وطباعة تجريبية 360°',
    serviceId: 'mugs-promotional-gifts',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.green,
      COMMON_COLORS.grey,
      COMMON_COLORS.cream,
    ],
    views: [
      { id: 'front', label: 'العرض الأساسي' },
    ],
    defaultColor: 'white',
    defaultView: 'front',
    hasTurntable: true,
    turntableAngles: TURNTABLE_ANGLES,
    overlayAnchors: {
      front: { x: 48, y: 48, width: 22 },
    },
  },
  {
    id: 'case',
    name: 'جراب هاتف تجريبي (Demo Case)',
    subtitle: 'معاينة تصميم وطباعة تجريبية',
    serviceId: 'phone-cases',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.white,
      COMMON_COLORS.green,
      COMMON_COLORS.grey,
      COMMON_COLORS.cream,
    ],
    views: [
      { id: 'back', label: 'ظهر الجراب' },
    ],
    defaultColor: 'black',
    defaultView: 'back',
    // STRICT FIX: iPhone/Phone case back logo is properly scaled (15% width, y: 58%) so it never exceeds the phone edges!
    overlayAnchors: {
      back: { x: 50, y: 58, width: 15 },
    },
  },
];

/**
 * Returns the exact image path in public/products
 */
export function getProductImagePath(
  productId: ProductType,
  color: string,
  view: string,
  angle: number = 0
): string {
  if (productId === 'tshirt') {
    if (color === 'black' && view === 'front') {
      return '/products/tshirt-black-front-trans.png';
    }
    if (color === 'white' && view === 'front') {
      return '/products/tshirt-white-front-trans.png';
    }
    return `/products/tshirt-${color}-${view}.png`;
  }
  if (productId === 'hoodie') {
    if (color === 'black' && view === 'front') {
      return '/products/hoodie-black-front-trans.png';
    }
    return `/products/hoodie-${color}-${view}.png`;
  }
  if (productId === 'cap') {
    return `/products/cap-${color}-${view}.png`;
  }
  if (productId === 'mug') {
    if (color === 'white') {
      const safeAngle = TURNTABLE_ANGLES.includes(angle) ? angle : 0;
      return `/products/mug-white-${safeAngle}.png`;
    }
    return `/products/mug-${color}.png`;
  }
  if (productId === 'case') {
    return `/products/case-${color}-back.png`;
  }
  return `/products/tshirt-white-front.png`;
}

export function getProductsForService(serviceId: string): ProductItem[] {
  const matched = PRODUCTS_LIST.filter((p) => p.serviceId === serviceId);
  if (matched.length > 0) return matched;
  return PRODUCTS_LIST;
}

export function getProductById(id: string): ProductItem | undefined {
  return PRODUCTS_LIST.find((p) => p.id === id);
}

const PRIMARY_STORAGE_KEY = 'yuzersef_products_v6';
const LEGACY_STORAGE_KEY = 'yuzersef_catalog_products_v6';

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (typeof window !== 'undefined') {
    let raw = localStorage.getItem(PRIMARY_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize and guarantee stock, sizes, and visibility status
          const normalized: CatalogProduct[] = parsed.map((item: any) => {
            const hasSizes = typeof item.hasSizes === 'boolean'
              ? item.hasSizes
              : (item.category === 'clothing' || Boolean(item.sizeStock));
            const sizeStock = item.sizeStock || (hasSizes ? { S: 15, M: 30, L: 45, XL: 25, XXL: 10 } : undefined);
            const stock = typeof item.stock === 'number'
              ? item.stock
              : computeTotalStock({ hasSizes, sizeStock, stock: 50 });
            const isHidden = typeof item.isHidden === 'boolean'
              ? item.isHidden
              : (item.isActive === false);
            const isActive = isHidden ? false : (item.isActive !== false);

            return {
              ...item,
              hasSizes,
              sizeStock,
              stock,
              isHidden,
              isActive,
              lowStockThreshold: typeof item.lowStockThreshold === 'number' ? item.lowStockThreshold : 10,
            };
          });
          return normalized;
        }
      } catch {
        // fallback to initial
      }
    }
    localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(INITIAL_CATALOG_PRODUCTS));
  }
  return INITIAL_CATALOG_PRODUCTS;
}

export async function getCatalogProductById(id: string): Promise<CatalogProduct | null> {
  const all = await getCatalogProducts();
  return all.find((p) => p.id === id) || null;
}

