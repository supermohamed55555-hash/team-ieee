// Data types for Cart, Orders, and Mock Payment Gateway in Yuzersef

export interface CartItemColor {
  id: string;
  name: string;
  hex: string;
}

export interface CartItemCustomization {
  hasCustomDesign: boolean;
  previewUrl?: string; // canvas / mockup preview data URL or image path
  zoneName?: string;
  view?: string;
  artworkName?: string;
  notes?: string;
}

export interface CartItem {
  id: string; // unique identifier in cart
  productId: string;
  name: string;
  subtitle?: string;
  price: number; // numeric value in EGP
  originalPriceStr?: string; // e.g. "290 ج.م"
  quantity: number;
  selectedColor?: CartItemColor;
  selectedSize?: string; // e.g. 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'
  sizeBreakdown?: Record<string, number>; // e.g. { 'S': 2, 'M': 5, 'L': 10, 'XL': 3 }
  customization?: CartItemCustomization;
  imageUrl: string;
}

export type PaymentMethod = 'card' | 'instapay' | 'cod';

export type OrderStatus =
  | 'holding'         // معلق (Holding) - بانتظار سداد العربون 50% وتأكيد الإدارة
  | 'pending_deposit' // معلق بانتظار سداد العربون
  | 'pending'         // قيد المراجعة
  | 'paid'            // مدفوع ومؤكد
  | 'in_progress'     // قيد التنفيذ والطباعة
  | 'shipped'         // تم الشحن
  | 'ready'           // جاهز للاستلام بأسوان
  | 'completed'       // مكتمل
  | 'cancelled';      // ملغي

export interface CustomerDetails {
  name: string;
  phone: string;
  whatsappPhone?: string;
  email?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: 'paid' | 'deposit_pending' | 'cod_pending';
  transactionRef?: string;
  cardLast4?: string;
  cardHolder?: string;
  instapayAccount?: string;
  instapayRef?: string;
  paidAmount?: number;
  depositAmount?: number;
}

export type DeliveryMethod = 'pickup' | 'aswan_delivery' | 'shipping';

export interface Order {
  id: string; // e.g. 'ORD-7001'
  createdAt: string; // ISO string
  updatedAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  deliveryMethod: DeliveryMethod;
  total: number;
  
  // 50% Deposit Requirement for ANY order before confirmation
  requiresDeposit: boolean;
  depositRequiredAmount?: number; // 50% of total
  depositPaid?: boolean;
  depositReceiptUrl?: string; // base64 / URL of the uploaded transfer receipt image
  depositReceiptUploadedAt?: string;
  depositNotes?: string;
  
  status: OrderStatus;
  payment: OrderPayment;
  adminNotes?: string;
}
