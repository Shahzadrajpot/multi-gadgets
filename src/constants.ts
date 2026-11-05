/**
 * Application Constants
 * Centralized configuration for the Multi Gadgets eCommerce platform
 */

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;
export const MAX_PRICE_FILTER = 50000;

// Image Upload
export const MAX_PRODUCT_IMAGES = 4;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// Storage Buckets
export const STORAGE_BUCKET_PRODUCTS = 'products';
export const STORAGE_BUCKET_CATEGORIES = 'categories';
export const STORAGE_BUCKET_BANNERS = 'banners';

// Order
export const ORDER_PREFIX = 'MG';
export const DELIVERY_DAYS = '2-4 business days';

// Form Validation
export const PHONE_REGEX = /^03\d{9}$/; // Pakistani phone pattern

// Options / Variants for Gadgets (Colors, Models, Editions)
export const DEFAULT_VARIANTS = ['Black', 'White', 'Silver', 'Space Gray', 'Standard'];
export const DEFAULT_SIZES = DEFAULT_VARIANTS; // Backward compatibility with product_sizes schema

// Store
export const DEFAULT_DELIVERY_CHARGES = 200; // PKR
export const STORE_NAME_DEFAULT = 'Multi Gadgets';
export const WHATSAPP_NUMBER_DEFAULT = '923001234567';

// Discount
export const DISCOUNT_PRIORITY = {
  PRODUCT: 'product',
  GLOBAL: 'global',
  NONE: null,
};

// Order Status
export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Colors for Status
export const STATUS_COLORS = {
  pending: 'orange',
  confirmed: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

// Time
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
