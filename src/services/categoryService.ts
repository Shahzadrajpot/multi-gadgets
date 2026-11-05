import { supabase } from '../lib/supabase';

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends CategoryRow {
  product_count: number;
}

export async function fetchCategories(): Promise<CategoryWithCount[]> {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Categories fetch error:', error);
      return [];
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    // Fetch product counts for all categories in parallel
    const withCount = await Promise.all(
      categories.map(async (cat) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id);
        return { ...cat, product_count: count || 0 };
      })
    );

    return withCount;
  } catch (err) {
    console.warn('Failed to fetch categories:', err);
    return [];
  }
}

export async function fetchActiveCategories(): Promise<CategoryWithCount[]> {
  const categories = await fetchCategories();
  return categories.filter((c) => c.is_active);
}

export async function createCategory(data: {
  name: string;
  slug: string;
  image_url?: string;
  is_active?: boolean;
}) {
  const { data: result, error } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; slug: string; image_url: string; is_active: boolean }>
) {
  const { data: result, error } = await supabase
    .from('categories')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
