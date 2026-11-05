import { supabase } from '../lib/supabase';

export interface ProductRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  base_price: number;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number;
  stock: number;
  sku: string | null;
  description: string | null;
  specifications: Record<string, string> | null;
  care_instructions: string | null;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends ProductRow {
  category?: { id: string; name: string; slug: string };
  images: { url: string }[];
  sizes: string[];
}

export async function fetchProducts(options?: {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  discountedOnly?: boolean;
  inStockOnly?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  pageSize?: number;
}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      product_images(url),
      product_sizes(size_name)
    `)
    .eq('is_active', true);

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  if (options?.minPrice !== undefined) {
    query = query.gte('base_price', options.minPrice);
  }
  if (options?.maxPrice !== undefined) {
    query = query.lte('base_price', options.maxPrice);
  }
  if (options?.discountedOnly) {
    query = query.not('discount_type', 'is', null);
  }
  if (options?.inStockOnly) {
    query = query.gt('stock', 0);
  }

  switch (options?.sortBy) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('base_price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  try {
    const { data, error } = await query;
    if (error) {
      console.warn('Products fetch error:', error);
      return [];
    }

    return (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      images: (p.product_images as { url: string }[] || []).map((i) => i.url),
      sizes: (p.product_sizes as { size_name: string }[] || []).map((s) => s.size_name),
    }));
  } catch (err) {
    console.warn('Failed to fetch products:', err);
    return [];
  }
}

export async function fetchAdminProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        product_images(url),
        product_sizes(size_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Admin products fetch error:', error);
      return [];
    }

    return (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      images: (p.product_images as { url: string }[] || []).map((i) => i.url),
      sizes: (p.product_sizes as { size_name: string }[] || []).map((s) => s.size_name),
    }));
  } catch (err) {
    console.warn('Failed to fetch admin products:', err);
    return [];
  }
}

export async function fetchFeaturedProducts(limit = 8) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        product_images(url),
        product_sizes(size_name)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Featured products fetch error:', error);
      return [];
    }

    return (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      images: (p.product_images as { url: string }[] || []).map((i) => i.url),
      sizes: (p.product_sizes as { size_name: string }[] || []).map((s) => s.size_name),
    }));
  } catch (err) {
    console.warn('Failed to fetch featured products:', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      product_images(url),
      product_sizes(size_name)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  if (!data) return null;

  const p = data as Record<string, unknown>;
  return {
    ...p,
    images: (p.product_images as { url: string }[] || []).map((i) => i.url),
    sizes: (p.product_sizes as { size_name: string }[] || []).map((s) => s.size_name),
  };
}

export async function createProduct(data: {
  category_id: string;
  name: string;
  slug: string;
  base_price: number;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_value?: number;
  stock: number;
  sku?: string;
  description?: string;
  specifications?: Record<string, string>;
  care_instructions?: string;
  is_featured?: boolean;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
  sizes?: string[];
  images?: string[];
}) {
  const { sizes, images, ...rest } = data;
  const productData = {
    ...rest,
    discount_type: rest.discount_type || null,
    discount_value: rest.discount_value ?? 0,
  };
  const { data: product, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) throw error;
  const productId = product.id;

  if (sizes?.length) {
    await supabase.from('product_sizes').insert(
      sizes.map((size_name) => ({ product_id: productId, size_name }))
    );
  }
  if (images?.length) {
    await supabase.from('product_images').insert(
      images.map((url, i) => ({ product_id: productId, url, sort_order: i }))
    );
  }

  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    category_id: string;
    name: string;
    slug: string;
    base_price: number;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    stock: number;
    sku: string;
    description: string;
    specifications: Record<string, string>;
    care_instructions: string;
    is_featured: boolean;
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    sizes: string[];
    images: string[];
  }>
) {
  const { sizes, images, ...productData } = data;

  const { data: product, error } = await supabase
    .from('products')
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (sizes !== undefined) {
    await supabase.from('product_sizes').delete().eq('product_id', id);
    if (sizes.length) {
      await supabase.from('product_sizes').insert(
        sizes.map((size_name) => ({ product_id: id, size_name }))
      );
    }
  }
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', id);
    if (images.length) {
      await supabase.from('product_images').insert(
        images.map((url, i) => ({ product_id: id, url, sort_order: i }))
    );
    }
  }

  return product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function reduceProductStock(productId: string, quantity: number) {
  const { data: product, error } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single();

  if (error) throw error;
  const newStock = Math.max(0, (product.stock || 0) - quantity);
  const isOutOfStock = newStock <= 0;

  const updateData: Record<string, unknown> = {
    stock: newStock,
    updated_at: new Date().toISOString(),
  };
  if (isOutOfStock) updateData.is_active = false;

  await supabase.from('products').update(updateData).eq('id', productId);

  return { newStock, isOutOfStock };
}
