export type RequestStatus =
  | 'submitted'      // تم الإرسال
  | 'under_review'   // قيد المراجعة
  | 'approved'       // معتمد
  | 'rejected'       // مرفوض
  | 'in_progress'    // قيد التنفيذ
  | 'ready'          // جاهز للاستلام
  | 'completed';     // مكتمل

export interface SizeBreakdown {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface Service {
  id: string;
  name: string;
  nameEn: string;
  category: 'apparel' | 'caps' | 'stickers' | 'gifts' | 'cases' | 'design';
  description: string;
  shortDesc: string;
  startingPriceNote: string;
  image: string;
  availableOptions: string[];
  requiredInfo: string[];
  allowedPlacements?: string[];
  availableColors?: { name: string; hex: string }[];
  hasSizes: boolean;
  hasModel: boolean;
  hasDimensions: boolean;
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  serviceId: string;
  image: string;
  description: string;
  specifications: string;
  sourceNote: string; // e.g. "من أعمال يوزرسيف المنشورة" or "نموذج توضيحي Demo"
}

export interface RequestMessage {
  id: string;
  sender: 'owner' | 'customer';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface RequestHistoryEntry {
  status: RequestStatus;
  timestamp: string;
  note: string;
}

export interface CustomerRequest {
  id: string; // e.g. #YZ-1042
  createdAt: string;
  serviceId: string;
  serviceName: string;
  referenceProjectTitle?: string;
  quantity: number;
  description: string;
  
  // Specific fields
  color?: string;
  sizeBreakdown?: SizeBreakdown;
  printPlacement?: string;
  phoneModel?: string;
  personalizationText?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'cm' | 'mm';
    shape: string;
    finish: string;
  };
  
  // Artwork
  artworkFileName?: string;
  artworkDataUrl?: string;
  needsDesignHelp: boolean;
  
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  desiredDate: string; // Date requested by customer
  receiptPreference: 'pickup' | 'aswan_delivery' | 'shipping';
  additionalNotes?: string;

  // Status & Decision
  status: RequestStatus;
  decisionNotes?: string;
  nextSteps?: string;
  history: RequestHistoryEntry[];
  messages: RequestMessage[];
}

export interface SocialMediaDesign {
  id: string;
  number: '01' | '02';
  title: string;
  theme: string;
  concept: string;
  headline: string;
  subheadline: string;
  callToAction: string;
  aspectRatio: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  features: string[];
  suggestedCaption: string;
  hashtags: string[];
}
