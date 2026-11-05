/**
 * Peshawari Khaas - Type Definitions
 * Scalable for multi-category eCommerce
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
  isActive: boolean;
  parentId?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: Category;
  basePrice: number;
  discount?: ProductDiscount;
  stock: number;
  sku: string;
  images: string[];
  sizes: string[];
  description?: string;
  specifications?: Record<string, string>;
  careInstructions?: string;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export interface ProductDiscount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface GlobalDiscount {
  id: string;
  isEnabled: boolean;
  type: 'percentage' | 'fixed';
  value: number;
  applyTo: 'all' | 'categories';
  categoryIds?: string[];
  startDate: string;
  endDate: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  productDiscount: number;
  globalDiscount: number;
  deliveryCharges: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'COD';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  deliveryCharges: number;
  currency: string;
  codEnabled: boolean;
  logo?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
