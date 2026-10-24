// Types for YUZERSEF (يوزرسيف) - Aswan Printing & Personalisation Business

export type RequestStatus =
  | 'submitted'      // تم التقديم
  | 'under-review'   // قيد المراجعة
  | 'approved'       // معتمد
  | 'in-progress'    // قيد التنفيذ
  | 'ready'          // جاهز للاستلام
  | 'completed'      // مكتمل
  | 'rejected';      // مرفوض

export type ServiceCategory =
  | 'clothing'       // تيشرتات وهوديز
  | 'caps'           // كابات
  | 'stickers'       // استيكرات ولواصق
  | 'mugs-gifts'     // مجّات وهدايا
  | 'phone-cases'    // جرابات هواتف
  | 'custom-design'; // تصاميم مخصصة

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  startingPrice: string; // Placeholder (needs client confirmation)
  features: string[];
  deliverables: string[];
  estimatedDays: string;
  badge?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  category: ServiceCategory;
  serviceId: string;
  description: string;
  tags: string[];
  year: string;
  highlight: string;
  imageUrl?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string; // UI preview only
}

// Clothing size breakdown: S, M, L, XL, XXL
export interface SizeBreakdown {
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
}

// Service Request (with full dynamic specifications for Yuzersef)
export interface ServiceRequest {
  id: string; // e.g. YZ-0001
  customerName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: ServiceCategory;
  projectBrief: string;
  quantity: number;
  
  // Clothing & Caps specific fields
  clothingColor?: string;
  sizeBreakdown?: SizeBreakdown;
  printPlacement?: 'chest' | 'back' | 'pocket' | 'sleeve' | 'both-sides';

  // Phone cases & gifts specific fields
  phoneModel?: string;
  personalisationText?: string;

  // Stickers & labels specific fields
  stickerWidthCm?: number;
  stickerHeightCm?: number;
  stickerShape?: 'rectangle' | 'circle' | 'custom-cut';
  stickerUsage?: 'indoor' | 'outdoor-waterproof';

  // Artwork & General
  needsDesignHelp: boolean; // true if customer needs designer assistance
  attachments: FileAttachment[];
  desiredDate: string; // approximate date requested
  receiptPreference: 'aswan-pickup' | 'shipping-delivery'; // pickup in Aswan vs delivery
  
  urgency: 'normal' | 'urgent';
  budget?: string;
  couponCode?: string;
  discountAmount?: number;

  // Status & Tracking
  status: RequestStatus;
  createdAt: string; // ISO string
  updatedAt: string;
  adminNotes?: string;
  rejectionReason?: string;
  nextStepText?: string; // next step instructed by admin
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface AdminUser {
  username: string;
  name: string;
  role: 'admin';
  token: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  telegram?: string;
  youtube?: string;
  twitter?: string;
  behance?: string;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  whatsapp: string;
  whatsappDefaultMessage: string;
  email: string;
  address: string;
  workingHours: string;
  socialLinks: SocialLinks;
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
}

// ========================================================
// 4. Coupons & Discounts Engine
// ========================================================
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minQuantity?: number;
  minBudget?: number;
  description: string;
  expiresAt?: string;
  isActive: boolean;
  usageCount: number;
}

// ========================================================
// 6. FAQ & Workshop Policies
// ========================================================
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface WorkshopPolicies {
  designProofing: string;
  colorAndPrinting: string;
  cancellationAndRefund: string;
  deliveryAndPickup: string;
  rushOrders: string;
}

// ========================================================
// 7. Promotional Popups & Modals
// ========================================================
export interface PromoPopupConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  couponCode?: string;
  imageUrl?: string;
  showOncePerSession: boolean;
}

