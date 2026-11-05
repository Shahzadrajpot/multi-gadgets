import { supabase } from '../lib/supabase';

export interface GlobalDiscountRow {
  id: string;
  is_active: boolean;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  apply_to: 'all' | 'categories';
  category_ids: string[] | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export async function fetchActiveGlobalDiscount(): Promise<GlobalDiscountRow | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('global_discounts')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Global discount fetch error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Failed to fetch active discount:', err);
    return null;
  }
}

export async function fetchAllGlobalDiscounts() {
  const { data, error } = await supabase
    .from('global_discounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createGlobalDiscount(data: {
  is_active: boolean;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  apply_to: 'all' | 'categories';
  category_ids?: string[];
  start_date: string;
  end_date: string;
}) {
  const { data: result, error } = await supabase
    .from('global_discounts')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function updateGlobalDiscount(
  id: string,
  data: Partial<GlobalDiscountRow>
) {
  const { data: result, error } = await supabase
    .from('global_discounts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function deleteGlobalDiscount(id: string) {
  const { error } = await supabase.from('global_discounts').delete().eq('id', id);
  if (error) throw error;
}
