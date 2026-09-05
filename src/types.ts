export type Language = 'EN' | 'BN';

export interface ProductVariation {
  id: string;
  name: string;
  options: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
  variantPurchased?: string;
}

export interface Seller {
  id: string;
  name: string;
  isOfficial: boolean; // DarazMall Flagship Store
  rating: number; // e.g. 95%
  shipOnTime: number; // e.g. 98%
  chatResponse: number; // e.g. 92%
  joinedYears: number;
  location: string;
  badge?: string;
}

export interface Product {
  id: string;
  uuid?: string;
  name?: string; // alias of title
  title: string;
  titleBn: string;
  slug: string;
  short_description?: string;
  description: string[];
  descriptionBn: string[];
  category: string;
  categorySlug: string;
  category_id?: string;
  subcategory_id?: string;
  child_category_id?: string;
  subCategory?: string;
  brand: string;
  brand_id?: string;
  vendor_id?: string;
  supplier_id?: string;
  sku?: string;
  barcode?: string;
  price: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  final_price?: number;
  purchase_price?: number;
  cost_price?: number;
  profit_margin?: number;
  originalPrice: number;
  discountPercentage: number;
  stock_quantity?: number;
  stock_alert_quantity?: number;
  stock_status?: 'in_stock' | 'out_of_stock' | 'backorder';
  unit?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  color_options?: string[];
  size_options?: string[];
  tags?: string[];
  thumbnail_image?: string;
  gallery_images?: string[];
  video_url?: string;
  warranty?: string;
  warranty_period?: string;
  returnPolicy?: string;
  return_policy?: string;
  origin_country?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_best_seller?: boolean;
  rating: number;
  reviewsCount: number;
  total_reviews?: number;
  soldCount: number;
  total_sales?: number;
  questionsCount: number;
  inStock: number;
  isDarazMall: boolean;
  isFreeDelivery: boolean;
  isFlashSale?: boolean;
  flashSaleEndTime?: string;
  coinsCashback?: number;
  images: string[];
  mainImage: string;
  specifications: Record<string, string>;
  variations?: ProductVariation[];
  seller: Seller;
  reviews?: Review[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  status?: string;
  visibility?: string;
  created_by?: string;
  updated_by?: string;
  deliveryFee: number;
  estimatedDeliveryDays: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // unique cart line id (productId + selected variations)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariations: Record<string, string>;
  selected: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  image: string;
  subCategories: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
    items?: string[];
  }[];
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  discountAmount: number; // in Taka or percentage
  discountType: 'fixed' | 'percentage';
  minSpend: number;
  expiresAt: string;
  isClaimed?: boolean;
  type: 'daraz' | 'seller' | 'shipping' | 'bank';
  bankName?: string;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  addressLine: string;
  landmark?: string;
  label: 'HOME' | 'OFFICE';
  isDefault: boolean;
}

export interface OrderTimelineStep {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: DeliveryAddress;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  coinDiscount: number;
  total: number;
  trackingNumber: string;
  courier: string;
  timeline: OrderTimelineStep[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkType: 'flash-sale' | 'daraz-mall' | 'category' | 'product';
  targetId?: string;
  bgColor?: string;
  badge?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  avatar: string;
  coins: number;
  memberTier: 'Silver Member' | 'Gold Member' | 'Diamond Club';
  joinDate: string;
  role: 'customer' | 'admin' | 'seller';
  status: 'active' | 'suspended';
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  totalOrders?: number;
  totalSpent?: number;
  addresses?: DeliveryAddress[];
}

export interface AuthSession {
  token: string;
  userId: string;
  user: UserProfile;
}

export type PageView =
  | 'home'
  | 'product-details'
  | 'search'
  | 'flash-sale'
  | 'daraz-mall'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'seller-center'
  | 'customer-care'
  | 'my-account'
  | 'coins-rewards'
  | 'manage';
