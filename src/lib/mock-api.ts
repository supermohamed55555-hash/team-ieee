import {
  Service,
  PortfolioItem,
  ServiceRequest,
  RequestStatus,
  ContactMessage,
  AdminUser,
  SiteSettings,
  Coupon,
  FAQItem,
  WorkshopPolicies,
  PromoPopupConfig
} from './types';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  CartItem
} from './order-types';
import {
  DEMO_SERVICES,
  DEMO_PORTFOLIO,
  INITIAL_DEMO_REQUESTS,
  DEMO_ADMIN_CREDENTIALS,
  DEFAULT_SETTINGS,
  DEFAULT_COUPONS,
  DEFAULT_FAQS,
  DEFAULT_POLICIES,
  DEFAULT_PROMO_POPUP
} from './mock-data';
import {
  CatalogProduct,
  INITIAL_CATALOG_PRODUCTS,
  computeTotalStock
} from './products-data';

// Initial Demo Orders
export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-5011',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    customer: {
      name: 'كريم عبد الرحيم',
      phone: '01098765432',
      whatsappPhone: '01098765432',
      email: 'karim.aswan@gmail.com',
      governorate: 'أسوان',
      city: 'حي العقاد',
      address: 'عمارة المهندسين، بجوار بنك مصر، الدور 3',
      notes: 'برجاء الاتصال قبل التوصيل بنصف ساعة'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-tshirt-premium',
        name: 'تيشيرت كلاسيك قطن 100%',
        subtitle: 'سنجل جيرسي معالج ضد الانكماش',
        price: 185,
        originalPriceStr: '185 ج.م',
        quantity: 2,
        selectedColor: { id: 'black', name: 'أسود', hex: '#18181B' },
        selectedSize: 'L',
        imageUrl: '/products/tshirt-white-front.png'
      },
      {
        id: 'item-2',
        productId: 'prod-baseball-cap',
        name: 'كاب بيسبول كلاسيك يوزرسيف',
        subtitle: 'تطريز بارز 3D مع قفل معدني',
        price: 95,
        originalPriceStr: '95 ج.م',
        quantity: 1,
        selectedColor: { id: 'green', name: 'أخضر يوزرسيف', hex: '#0B5F55' },
        selectedSize: 'Free Size',
        imageUrl: '/products/cap-black-angle.png'
      }
    ],
    subtotal: 465,
    shippingFee: 30,
    deliveryMethod: 'aswan_delivery',
    total: 495,
    requiresDeposit: true,
    depositRequiredAmount: 248,
    depositPaid: true,
    status: 'in_progress',
    payment: {
      method: 'card',
      status: 'paid',
      cardLast4: '4242',
      cardHolder: 'Karim Abdelrahim',
      transactionRef: 'TXN-CARD-99124',
      paidAmount: 248,
      depositAmount: 248
    },
    adminNotes: 'تم تأكيد استلام العربون 50% بواسطة الأونر، والطلب قيد التنفيذ والطباعة في ورشة أسوان.'
  },
  {
    id: 'ORD-5012',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: 'د. طارق المنشاوي (أكاديمية أسوان للابتكار)',
      phone: '01123456789',
      whatsappPhone: '01123456789',
      email: 'tareq.innovation@example.com',
      governorate: 'أسوان',
      city: 'مدينة أسوان',
      address: 'طريق السادات، مبنى مركز ريادة الأعمال، الطابق الثاني',
      notes: 'طلب زي موحد لفريق الابتكار (25 هودي مع تطريز الشعار على الصدر)'
    },
    items: [
      {
        id: 'item-bulk-1',
        productId: 'prod-hoodie-oversized',
        name: 'هودي يوزرسيف أوفر سايز فاخر',
        subtitle: 'قطن ميلتون مصري 100% مبطن عالي الكثافة',
        price: 290,
        originalPriceStr: '290 ج.م',
        quantity: 25,
        selectedColor: { id: 'black', name: 'أسود', hex: '#18181B' },
        selectedSize: 'XL',
        customization: {
          hasCustomDesign: true,
          zoneName: 'صدر يسار (شعار)',
          notes: 'شعار الأكاديمية مطرز بخيوط ميتاليك بارزة'
        },
        imageUrl: '/services-cards/card-hoodie.png'
      }
    ],
    subtotal: 7250,
    shippingFee: 0,
    deliveryMethod: 'pickup',
    total: 7250,
    requiresDeposit: true,
    depositRequiredAmount: 3625,
    depositPaid: false,
    depositReceiptUrl: '/logo/logo-green.png', // Demo uploaded receipt
    depositReceiptUploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    depositNotes: 'تم تحويل 3,625 ج.م عبر انستا باي من حساب الأكاديمية.',
    status: 'holding',
    payment: {
      method: 'instapay',
      status: 'deposit_pending',
      instapayAccount: 'yuzersef@instapay',
      instapayRef: 'IP-908231456201',
      paidAmount: 0,
      depositAmount: 3625
    },
    adminNotes: '📸 حالة (Holding) - قام العميل برفع صورة إيصال التحويل (3,625 ج.م). بانتظار مراجعة وتأكيد الأونر.'
  },
  {
    id: 'ORD-5013',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    customer: {
      name: 'سارة محمود الأسواني',
      phone: '01234567890',
      whatsappPhone: '01234567890',
      email: 'sara.aswan@gmail.com',
      governorate: 'أسوان',
      city: 'كوم أمبو',
      address: 'شارع بورسعيد، بجوار المستشفى المركزي',
      notes: 'تطريز الاسم سارة بخط ديواني أنيق'
    },
    items: [
      {
        id: 'item-demo-3',
        productId: 'prod-tshirt-premium',
        name: 'تيشيرت كلاسيك قطن 100%',
        subtitle: 'تطريز مخصص عند الصدر',
        price: 185,
        originalPriceStr: '185 ج.م',
        quantity: 2,
        selectedColor: { id: 'white', name: 'أبيض قطني', hex: '#FFFFFF' },
        selectedSize: 'M',
        imageUrl: '/products/tshirt-white-front.png'
      }
    ],
    subtotal: 370,
    shippingFee: 30,
    deliveryMethod: 'aswan_delivery',
    total: 400,
    requiresDeposit: true,
    depositRequiredAmount: 200,
    depositPaid: false,
    status: 'holding',
    payment: {
      method: 'instapay',
      status: 'deposit_pending',
      instapayAccount: 'yuzersef@instapay',
      paidAmount: 0,
      depositAmount: 200
    },
    adminNotes: 'حالة (Holding) - بانتظار سداد عربون 50% (200 ج.م) ورفع العميل لصورة إيصال التحويل ليقوم الأونر بالتأكيد.'
  }
];

// Storage Keys
const STORAGE_KEYS = {
  SERVICES: 'yuzersef_services_v4',
  PORTFOLIO: 'yuzersef_portfolio_v4',
  REQUESTS: 'yuzersef_requests_v4',
  ORDERS: 'yuzersef_orders_v4',
  MESSAGES: 'yuzersef_messages_v4',
  ADMIN_SESSION: 'yuzersef_admin_session_v4',
  SETTINGS: 'yuzersef_settings_v4',
  PRODUCTS: 'yuzersef_products_v4',
  COUPONS: 'yuzersef_coupons_v4',
  FAQS: 'yuzersef_faqs_v4',
  POLICIES: 'yuzersef_policies_v4',
  POPUP: 'yuzersef_promo_popup_v4',
};

// Helper: simulate network latency
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: initialize storage
function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEMO_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO)) {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(DEMO_PORTFOLIO));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_DEMO_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_CATALOG_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POLICIES)) {
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(DEFAULT_POLICIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POPUP)) {
    localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(DEFAULT_PROMO_POPUP));
  }
}

// Ensure storage is seeded immediately
initStorage();

// ==========================================
// 1. SERVICES / PRODUCTS API
// ==========================================
export async function getServices(): Promise<Service[]> {
  await delay(200);
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : DEMO_SERVICES;
}

export async function getServiceById(id: string): Promise<Service | null> {
  await delay(150);
  const services = await getServices();
  return services.find((s) => s.id === id) || null;
}

export async function createService(input: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
  await delay(300);
  initStorage();
  const list = await getServices();
  const generatedId = input.id?.trim() || `service-${input.category}-${Date.now().toString().slice(-4)}`;
  
  const newService: Service = {
    ...input,
    id: generatedId,
    isActive: input.isActive !== undefined ? input.isActive : true,
    features: input.features || [],
    deliverables: input.deliverables || [],
  };

  const updatedList = [newService, ...list];
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updatedList));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-services-updated', { detail: updatedList }));
  }
  return newService;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  await delay(300);
  initStorage();
  const list = await getServices();
  const index = list.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error(`المنتج / الخدمة ${id} غير موجود`);
  }

  const existing = list[index];
  const updated: Service = {
    ...existing,
    ...updates,
    id: existing.id, // preserve id
  };

  list[index] = updated;
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-services-updated', { detail: list }));
  }
  return updated;
}

export async function toggleServiceStatus(id: string): Promise<Service> {
  const service = await getServiceById(id);
  if (!service) {
    throw new Error(`المنتج / الخدمة ${id} غير موجود`);
  }
  const currentStatus = service.isActive !== false;
  return updateService(id, { isActive: !currentStatus });
}

export async function deleteService(id: string): Promise<boolean> {
  await delay(250);
  initStorage();
  const list = await getServices();
  const filtered = list.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-services-updated', { detail: filtered }));
  }
  return true;
}

// ==========================================
// 2. PORTFOLIO API
// ==========================================
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  await delay(250);
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
  return data ? JSON.parse(data) : DEMO_PORTFOLIO;
}

export async function getPortfolioByCategory(category?: string): Promise<PortfolioItem[]> {
  const items = await getPortfolioItems();
  if (!category || category === 'الكل') return items;
  return items.filter((item) => item.category === category);
}

// ==========================================
// 3. SERVICE REQUESTS API (WIZARD + TRACKING + ADMIN)
// ==========================================
export function generateNextRequestId(existingRequests: ServiceRequest[]): string {
  if (!existingRequests || existingRequests.length === 0) return 'YZ-0001';

  const numbers = existingRequests
    .map((r) => {
      const match = r.id.match(/^YZ-(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNum = max + 1;
  return `YZ-${nextNum.toString().padStart(4, '0')}`;
}

export async function getRequests(): Promise<ServiceRequest[]> {
  await delay(300);
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  const list: ServiceRequest[] = data ? JSON.parse(data) : INITIAL_DEMO_REQUESTS;
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getRequestById(id: string): Promise<ServiceRequest | null> {
  await delay(300);
  const trimmedId = id.trim().toUpperCase();
  const list = await getRequests();
  return list.find((r) => r.id.toUpperCase() === trimmedId) || null;
}

export async function createServiceRequest(
  input: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'adminNotes' | 'rejectionReason' | 'nextStepText'>
): Promise<ServiceRequest> {
  await delay(500);
  initStorage();
  const list = await getRequests();
  const newId = generateNextRequestId(list);
  const now = new Date().toISOString();

  const newRequest: ServiceRequest = {
    ...input,
    id: newId,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
    adminNotes: 'تم استلام طلبك بنجاح وجاري فحصه ومراجعته تجريبياً في نظام يوزرسيف (Demo).',
    nextStepText: 'المراجعة الفنية وتأكيد توفر الخامات قبل بدء الطباعة.',
  };

  const updatedList = [newRequest, ...list];
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedList));

  return newRequest;
}

export async function updateRequestStatus(
  id: string,
  newStatus: RequestStatus,
  adminNotes?: string,
  rejectionReason?: string,
  nextStepText?: string
): Promise<ServiceRequest> {
  await delay(350);
  initStorage();
  const list = await getRequests();
  const index = list.findIndex((r) => r.id.toUpperCase() === id.trim().toUpperCase());

  if (index === -1) {
    throw new Error(`الطلب برقم ${id} غير موجود`);
  }

  const existing = list[index];
  const updated: ServiceRequest = {
    ...existing,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    rejectionReason: rejectionReason !== undefined ? rejectionReason : existing.rejectionReason,
    nextStepText: nextStepText !== undefined ? nextStepText : existing.nextStepText,
  };

  list[index] = updated;
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));

  return updated;
}

export async function deleteRequest(id: string): Promise<boolean> {
  await delay(250);
  initStorage();
  const list = await getRequests();
  const filtered = list.filter((r) => r.id.toUpperCase() !== id.trim().toUpperCase());
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(filtered));
  return true;
}

// ==========================================
// 4. CONTACT MESSAGES API
// ==========================================
export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>
): Promise<ContactMessage> {
  await delay(400);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const list: ContactMessage[] = raw ? JSON.parse(raw) : [];

  const newMessage: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([newMessage, ...list]));
  return newMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  await delay(250);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return raw ? JSON.parse(raw) : [];
}

// ==========================================
// 5. HARDCODED DEMO AUTH
// ==========================================
export async function loginAdmin(username: string, password: string): Promise<AdminUser> {
  await delay(450);

  if (
    username.trim().toLowerCase() === DEMO_ADMIN_CREDENTIALS.username &&
    password.trim() === DEMO_ADMIN_CREDENTIALS.password
  ) {
    const user: AdminUser = {
      username: DEMO_ADMIN_CREDENTIALS.username,
      name: DEMO_ADMIN_CREDENTIALS.name,
      role: 'admin',
      token: `demo-token-${Date.now()}`,
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
    return user;
  }

  throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة (استخدم: admin / demo123)');
}

export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

// ==========================================
// 6. SITE & SOCIAL MEDIA SETTINGS API
// ==========================================
export async function getSettings(): Promise<SiteSettings> {
  await delay(150);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  await delay(250);
  initStorage();
  const current = await getSettings();
  const merged: SiteSettings = {
    ...current,
    ...updates,
    socialLinks: {
      ...current.socialLinks,
      ...(updates.socialLinks || {}),
    },
    announcement: {
      ...current.announcement,
      ...(updates.announcement || {}),
    },
  };

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-settings-updated', { detail: merged }));
  }
  return merged;
}

export async function resetSettings(): Promise<SiteSettings> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-settings-updated', { detail: DEFAULT_SETTINGS }));
  }
  return DEFAULT_SETTINGS;
}

// ==========================================
// 6. CATALOG PRODUCTS API (FOR MOCKUP CUSTOMIZER & PRODUCTS PAGE)
// ==========================================
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  await delay(200);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!raw) return INITIAL_CATALOG_PRODUCTS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATALOG_PRODUCTS;
  } catch {
    return INITIAL_CATALOG_PRODUCTS;
  }
}

export async function getCatalogProductById(id: string): Promise<CatalogProduct | null> {
  const products = await getCatalogProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveCatalogProduct(product: CatalogProduct): Promise<CatalogProduct> {
  await delay(250);
  initStorage();
  const products = await getCatalogProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);

  // Sync visibility and active flags
  const isHidden = typeof product.isHidden === 'boolean'
    ? product.isHidden
    : (product.isActive === false);
  const isActive = isHidden ? false : (product.isActive !== false);

  // Calculate clean stock
  const hasSizes = typeof product.hasSizes === 'boolean' ? product.hasSizes : Boolean(product.sizeStock);
  const calculatedStock = computeTotalStock({
    ...product,
    hasSizes,
  });

  const normalizedProduct: CatalogProduct = {
    ...product,
    hasSizes,
    stock: calculatedStock,
    isHidden,
    isActive,
    lowStockThreshold: typeof product.lowStockThreshold === 'number' ? product.lowStockThreshold : 10,
  };

  let updatedList: CatalogProduct[];
  if (existingIndex >= 0) {
    updatedList = [...products];
    updatedList[existingIndex] = {
      ...normalizedProduct,
      createdAt: products[existingIndex].createdAt || new Date().toISOString()
    };
  } else {
    updatedList = [normalizedProduct, ...products];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-products-updated', { detail: updatedList }));
  }
  return normalizedProduct;
}

export async function deleteCatalogProduct(id: string): Promise<boolean> {
  await delay(200);
  initStorage();
  const products = await getCatalogProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-products-updated', { detail: filtered }));
  }
  return true;
}

export async function toggleProductActive(id: string): Promise<CatalogProduct | null> {
  return toggleProductVisibility(id);
}

export async function toggleProductVisibility(id: string): Promise<CatalogProduct | null> {
  const product = await getCatalogProductById(id);
  if (!product) return null;
  const currentlyHidden = product.isHidden ?? !product.isActive;
  const newHidden = !currentlyHidden;
  return saveCatalogProduct({
    ...product,
    isHidden: newHidden,
    isActive: !newHidden
  });
}

export async function updateProductStock(
  id: string,
  newStock: number,
  sizeStock?: Record<string, number>
): Promise<CatalogProduct | null> {
  const product = await getCatalogProductById(id);
  if (!product) return null;

  const updatedSizeStock = sizeStock || product.sizeStock;
  const hasSizes = Boolean(updatedSizeStock && Object.keys(updatedSizeStock).length > 0 && product.hasSizes);
  const total = hasSizes && updatedSizeStock
    ? Object.values(updatedSizeStock).reduce((s, q) => s + (Number(q) || 0), 0)
    : Math.max(0, newStock);

  return saveCatalogProduct({
    ...product,
    hasSizes,
    sizeStock: updatedSizeStock,
    stock: total
  });
}

export async function resetCatalogProducts(): Promise<CatalogProduct[]> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_CATALOG_PRODUCTS));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-products-updated', { detail: INITIAL_CATALOG_PRODUCTS }));
  }
  return INITIAL_CATALOG_PRODUCTS;
}

// ==========================================
// 7. COUPONS & DISCOUNTS API (FEATURE 4)
// ==========================================
export async function getCoupons(): Promise<Coupon[]> {
  await delay(150);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
  return raw ? JSON.parse(raw) : DEFAULT_COUPONS;
}

export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  await delay(200);
  initStorage();
  const coupons = await getCoupons();
  const index = coupons.findIndex((c) => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());

  let updatedList: Coupon[];
  if (index >= 0) {
    updatedList = [...coupons];
    updatedList[index] = { ...coupon, code: coupon.code.toUpperCase().trim() };
  } else {
    updatedList = [{ ...coupon, code: coupon.code.toUpperCase().trim() }, ...coupons];
  }

  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(updatedList));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-coupons-updated', { detail: updatedList }));
  }
  return coupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  await delay(200);
  initStorage();
  const coupons = await getCoupons();
  const filtered = coupons.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-coupons-updated', { detail: filtered }));
  }
  return true;
}

export async function toggleCouponStatus(id: string): Promise<Coupon | null> {
  const coupons = await getCoupons();
  const found = coupons.find((c) => c.id === id);
  if (!found) return null;
  return saveCoupon({ ...found, isActive: !found.isActive });
}

export async function validateCoupon(
  code: string,
  quantity: number = 1,
  estimatedPrice: number = 0
): Promise<{ valid: boolean; coupon?: Coupon; message: string; discountAmount: number }> {
  await delay(150);
  const coupons = await getCoupons();
  const cleanCode = code.trim().toUpperCase();
  const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, message: 'كود الخصم غير صحيح أو غير موجود.', discountAmount: 0 };
  }

  if (!coupon.isActive) {
    return { valid: false, message: 'كود الخصم هذا منتهي أو غير مفعّل حالياً.', discountAmount: 0 };
  }

  if (coupon.minQuantity && quantity < coupon.minQuantity) {
    return {
      valid: false,
      message: `يتطلب هذا الكود طلبيات لا تقل عن ${coupon.minQuantity} قطعة (الكمية الحالية: ${quantity}).`,
      discountAmount: 0,
    };
  }

  if (coupon.minBudget && estimatedPrice > 0 && estimatedPrice < coupon.minBudget) {
    return {
      valid: false,
      message: `يتطلب هذا الكود ميزانية لا تقل عن ${coupon.minBudget} ج.م.`,
      discountAmount: 0,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((estimatedPrice * coupon.discountValue) / 100);
  } else {
    discountAmount = coupon.discountValue;
  }

  return {
    valid: true,
    coupon,
    message: `تم تطبيق الكود بنجاح! خصم ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} ج.م`}`,
    discountAmount,
  };
}

export async function recordCouponUsage(code: string): Promise<void> {
  if (!code) return;
  const coupons = await getCoupons();
  const cleanCode = code.trim().toUpperCase();
  const index = coupons.findIndex((c) => c.code.toUpperCase() === cleanCode);
  if (index >= 0) {
    coupons[index].usageCount = (coupons[index].usageCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yuzersef-coupons-updated', { detail: coupons }));
    }
  }
}

// ==========================================
// 8. FAQS API (FEATURE 6)
// ==========================================
export async function getFAQs(): Promise<FAQItem[]> {
  await delay(150);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.FAQS);
  return raw ? JSON.parse(raw) : DEFAULT_FAQS;
}

export async function saveFAQ(faq: FAQItem): Promise<FAQItem> {
  await delay(200);
  initStorage();
  const list = await getFAQs();
  const index = list.findIndex((f) => f.id === faq.id);

  let updatedList: FAQItem[];
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = faq;
  } else {
    updatedList = [...list, { ...faq, id: faq.id || `faq-${Date.now()}` }];
  }

  localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updatedList));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-faqs-updated', { detail: updatedList }));
  }
  return faq;
}

export async function deleteFAQ(id: string): Promise<boolean> {
  await delay(150);
  initStorage();
  const list = await getFAQs();
  const filtered = list.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-faqs-updated', { detail: filtered }));
  }
  return true;
}

export async function resetFAQs(): Promise<FAQItem[]> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-faqs-updated', { detail: DEFAULT_FAQS }));
  }
  return DEFAULT_FAQS;
}

// ==========================================
// 9. WORKSHOP POLICIES API (FEATURE 6)
// ==========================================
export async function getPolicies(): Promise<WorkshopPolicies> {
  await delay(150);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.POLICIES);
  return raw ? JSON.parse(raw) : DEFAULT_POLICIES;
}

export async function updatePolicies(updates: Partial<WorkshopPolicies>): Promise<WorkshopPolicies> {
  await delay(250);
  initStorage();
  const current = await getPolicies();
  const merged = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(merged));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-policies-updated', { detail: merged }));
  }
  return merged;
}

export async function resetPolicies(): Promise<WorkshopPolicies> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(DEFAULT_POLICIES));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-policies-updated', { detail: DEFAULT_POLICIES }));
  }
  return DEFAULT_POLICIES;
}

// ==========================================
// 10. PROMO POPUP MODAL API (FEATURE 7)
// ==========================================
export async function getPromoPopup(): Promise<PromoPopupConfig> {
  await delay(150);
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.POPUP);
  return raw ? JSON.parse(raw) : DEFAULT_PROMO_POPUP;
}

export async function updatePromoPopup(updates: Partial<PromoPopupConfig>): Promise<PromoPopupConfig> {
  await delay(200);
  initStorage();
  const current = await getPromoPopup();
  const merged = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(merged));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-popup-updated', { detail: merged }));
  }
  return merged;
}

export async function resetPromoPopup(): Promise<PromoPopupConfig> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(DEFAULT_PROMO_POPUP));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-popup-updated', { detail: DEFAULT_PROMO_POPUP }));
  }
  return DEFAULT_PROMO_POPUP;
}

// ==========================================
// 8. ORDERS & CHECKOUT API (CART & PAYMENT)
// ==========================================

function safeSaveOrders(list: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
  } catch (err) {
    console.warn('Quota exceeded on orders, optimizing and retrying...', err);
    try {
      // Clean large data URLs (> 20KB) to ensure storage stays well within 5MB quota
      const cleaned = list.map((ord) => ({
        ...ord,
        items: (ord.items || []).map((it) => ({
          ...it,
          customization: it.customization
            ? {
                ...it.customization,
                previewUrl:
                  it.customization.previewUrl && it.customization.previewUrl.length > 20000
                    ? undefined
                    : it.customization.previewUrl,
              }
            : undefined,
        })),
      }));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(cleaned));
    } catch (e2) {
      console.error('Critical quota error in localStorage', e2);
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list.slice(0, 5)));
      } catch (e3) {
        console.error('Failed to save to localStorage altogether', e3);
      }
    }
  }
}

export function generateNextOrderId(existingOrders: Order[]): string {
  if (!existingOrders || !Array.isArray(existingOrders) || existingOrders.length === 0) return 'ORD-5013';

  const numbers = existingOrders
    .map((o) => {
      if (!o || !o.id) return 0;
      const match = String(o.id).match(/^ORD-(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n) && isFinite(n) && n > 0);

  const max = numbers.length > 0 ? Math.max(...numbers) : 5010;
  const safeMax = isFinite(max) && max > 0 ? max : 5010;
  return `ORD-${safeMax + 1}`;
}

export async function getOrders(): Promise<Order[]> {
  await delay(150);
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) return INITIAL_DEMO_ORDERS;
    const list = JSON.parse(data);
    if (!Array.isArray(list)) return INITIAL_DEMO_ORDERS;
    return list.sort((a, b) => {
      const timeA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch (e) {
    console.warn('getOrders fallback', e);
    return INITIAL_DEMO_ORDERS;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(150);
  try {
    const trimmed = id.trim().toUpperCase();
    const list = await getOrders();
    return list.find((o) => o?.id && o.id.toUpperCase() === trimmed) || null;
  } catch {
    return null;
  }
}

export async function createOrder(
  input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'requiresDeposit' | 'status'> & {
    id?: string;
    status?: OrderStatus;
    depositReceiptUrl?: string;
    depositNotes?: string;
  }
): Promise<Order> {
  await delay(350);
  initStorage();
  const list = await getOrders();
  const newId = input.id?.trim() || generateNextOrderId(list);
  const now = new Date().toISOString();

  // Business condition: ANY order requires 50% deposit before confirmation
  const total = Number(input.total || 0);
  const requiresDeposit = true;
  const depositRequiredAmount = Math.round(total * 0.5);

  // Status is 'pending' by default for all unconfirmed orders
  const orderStatus: OrderStatus = input.status || 'pending';

  const paymentData = {
    ...input.payment,
    status: 'deposit_pending' as const,
    depositAmount: depositRequiredAmount,
  };

  const newOrder: Order = {
    ...input,
    id: newId,
    createdAt: now,
    updatedAt: now,
    requiresDeposit,
    depositRequiredAmount,
    depositPaid: false,
    depositReceiptUrl: input.depositReceiptUrl,
    depositReceiptUploadedAt: input.depositReceiptUrl ? now : undefined,
    depositNotes: input.depositNotes,
    status: orderStatus,
    payment: paymentData,
    adminNotes: input.depositReceiptUrl
      ? `طلب جديد بحالة (Pending) - قام العميل برفع إيصال العربون (50% = ${depositRequiredAmount.toLocaleString()} ج.م). بانتظار مراجعة وتأكيد الأونر.`
      : `طلب جديد بحالة (Pending) - بانتظار سداد عربون 50% (${depositRequiredAmount.toLocaleString()} ج.م) ورفع صورة الإيصال ليقوم الأونر بالتأكيد.`,
  };

  const updatedList = [newOrder, ...list];
  safeSaveOrders(updatedList);

  // Automatically save order ID to client's personal orders list
  if (typeof window !== 'undefined') {
    try {
      const existingMyOrders: string[] = JSON.parse(localStorage.getItem('yuzersef_my_orders') || '[]');
      if (!existingMyOrders.includes(newId)) {
        localStorage.setItem('yuzersef_my_orders', JSON.stringify([newId, ...existingMyOrders]));
      }
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: updatedList }));
  }

  return newOrder;
}

export async function uploadOrderDepositReceipt(
  id: string,
  receiptUrl: string,
  notes?: string
): Promise<Order> {
  await delay(250);
  initStorage();
  const list = await getOrders();
  const index = list.findIndex((o) => o.id.toUpperCase() === id.trim().toUpperCase());

  if (index === -1) {
    throw new Error(`الطلب برقم ${id} غير موجود`);
  }

  const existing = list[index];
  const now = new Date().toISOString();
  const updated: Order = {
    ...existing,
    updatedAt: now,
    depositReceiptUrl: receiptUrl,
    depositReceiptUploadedAt: now,
    depositNotes: notes !== undefined ? notes : existing.depositNotes,
    adminNotes: existing.adminNotes
      ? `${existing.adminNotes}\n📸 [${new Date().toLocaleTimeString('ar-EG')}] قام العميل برفع صورة إيصال العربون للمراجعة.`
      : 'قام العميل برفع صورة إيصال العربون للمراجعة وتأكيد الطلب.',
  };

  list[index] = updated;
  safeSaveOrders(list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: list }));
  }

  return updated;
}

export async function confirmOrderDeposit(
  id: string,
  customNotes?: string
): Promise<Order> {
  await delay(250);
  initStorage();
  const list = await getOrders();
  const index = list.findIndex((o) => o.id.toUpperCase() === id.trim().toUpperCase());

  if (index === -1) {
    throw new Error(`الطلب برقم ${id} غير موجود`);
  }

  const existing = list[index];
  const now = new Date().toISOString();
  const depositAmount = existing.depositRequiredAmount || Math.round(existing.total * 0.5);

  const updated: Order = {
    ...existing,
    status: 'in_progress', // تحويل الطلب لقيد التنفيذ والطباعة
    updatedAt: now,
    depositPaid: true,
    payment: {
      ...existing.payment,
      status: 'paid',
      paidAmount: depositAmount,
    },
    adminNotes:
      customNotes ||
      `✅ تم تأكيد استلام العربون (50% = ${depositAmount.toLocaleString()} ج.م) وتأكيد الطلب بواسطة الأونر، وبدأ خط التجهيز والطباعة فوراً.`,
  };

  list[index] = updated;
  safeSaveOrders(list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: list }));
  }

  return updated;
}

export async function getMyOrders(phoneOrEmail?: string): Promise<Order[]> {
  const allOrders = await getOrders();
  let myOrderIds: string[] = [];
  if (typeof window !== 'undefined') {
    try {
      myOrderIds = JSON.parse(localStorage.getItem('yuzersef_my_orders') || '[]');
    } catch {
      myOrderIds = [];
    }
  }

  const trimmed = phoneOrEmail?.trim().toLowerCase();

  const userOrders = allOrders.filter((order) => {
    if (myOrderIds.includes(order.id)) return true;
    if (trimmed) {
      if (order.customer.phone && order.customer.phone.includes(trimmed)) return true;
      if (order.customer.email && order.customer.email.toLowerCase() === trimmed) return true;
    }
    return false;
  });

  // If a specific phone/email or saved order history exists, return user-specific orders
  if (trimmed || myOrderIds.length > 0) {
    return userOrders;
  }

  // If no user session and no filter, return demo orders as initial sample
  return allOrders.slice(0, 3);
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  adminNotes?: string,
  depositPaid?: boolean
): Promise<Order> {
  await delay(300);
  initStorage();
  const list = await getOrders();
  const index = list.findIndex((o) => o.id.toUpperCase() === id.trim().toUpperCase());

  if (index === -1) {
    throw new Error(`الطلب برقم ${id} غير موجود`);
  }

  const existing = list[index];
  const updated: Order = {
    ...existing,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    depositPaid: depositPaid !== undefined ? depositPaid : existing.depositPaid,
    adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    payment: {
      ...existing.payment,
      status:
        depositPaid || newStatus === 'paid' || newStatus === 'in_progress'
          ? 'paid'
          : existing.payment.status,
    },
  };

  list[index] = updated;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: list }));
  }

  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  await delay(200);
  initStorage();
  const list = await getOrders();
  const filtered = list.filter((o) => o.id.toUpperCase() !== id.trim().toUpperCase());
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filtered));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: filtered }));
  }

  return true;
}

export async function resetDemoOrders(): Promise<Order[]> {
  await delay(200);
  initStorage();
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: INITIAL_DEMO_ORDERS }));
  }
  return INITIAL_DEMO_ORDERS;
}

// Helper to reset demo data back to default
export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEMO_SERVICES));
  localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(DEMO_PORTFOLIO));
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_DEMO_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_CATALOG_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
  localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
  localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(DEFAULT_POLICIES));
  localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(DEFAULT_PROMO_POPUP));

  window.dispatchEvent(new CustomEvent('yuzersef-services-updated', { detail: DEMO_SERVICES }));
  window.dispatchEvent(new CustomEvent('yuzersef-orders-updated', { detail: INITIAL_DEMO_ORDERS }));
  window.dispatchEvent(new CustomEvent('yuzersef-settings-updated', { detail: DEFAULT_SETTINGS }));
  window.dispatchEvent(new CustomEvent('yuzersef-products-updated', { detail: INITIAL_CATALOG_PRODUCTS }));
  window.dispatchEvent(new CustomEvent('yuzersef-coupons-updated', { detail: DEFAULT_COUPONS }));
  window.dispatchEvent(new CustomEvent('yuzersef-faqs-updated', { detail: DEFAULT_FAQS }));
  window.dispatchEvent(new CustomEvent('yuzersef-policies-updated', { detail: DEFAULT_POLICIES }));
  window.dispatchEvent(new CustomEvent('yuzersef-popup-updated', { detail: DEFAULT_PROMO_POPUP }));
}
