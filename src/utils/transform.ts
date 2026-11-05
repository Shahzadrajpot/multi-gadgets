/**
 * Transform Supabase data to frontend format
 */

import type { Category, Product, GlobalDiscount } from '../types';

export function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  is_active: boolean;
  product_count?: number;
}): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image_url ?? undefined,
    productCount: row.product_count ?? 0,
    isActive: row.is_active,
  };
}

export function mapProduct(row: Record<string, unknown>): Product {
  const discount =
    row.discount_type && row.discount_value !== undefined
      ? {
          type: row.discount_type as 'percentage' | 'fixed',
          value: Number(row.discount_value),
        }
      : undefined;

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    categoryId: row.category_id as string,
    category: row.category
      ? mapCategory(row.category as Parameters<typeof mapCategory>[0])
      : undefined,
    basePrice: Number(row.base_price),
    discount,
    stock: Number(row.stock),
    sku: (row.sku as string) || '',
    images: (row.images as string[]) || [],
    sizes: (row.sizes as string[]) || [],
    description: row.description as string | undefined,
    specifications: row.specifications as Record<string, string> | undefined,
    careInstructions: row.care_instructions as string | undefined,
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active),
    metaTitle: row.meta_title as string | undefined,
    metaDescription: row.meta_description as string | undefined,
    createdAt: row.created_at as string,
  };
}

export function mapGlobalDiscount(row: {
  id: string;
  is_active: boolean;
  discount_type: string;
  discount_value: number;
  apply_to: string;
  category_ids?: string[] | null;
  start_date: string;
  end_date: string;
}): GlobalDiscount {
  return {
    id: row.id,
    isEnabled: row.is_active,
    type: row.discount_type as 'percentage' | 'fixed',
    value: row.discount_value,
    applyTo: row.apply_to as 'all' | 'categories',
    categoryIds: row.category_ids ?? undefined,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}
