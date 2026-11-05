import { supabase } from '../lib/supabase';

export interface BannerRow {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchBanners() {
  const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createBanner(payload: Partial<BannerRow>) {
  const { data, error } = await supabase.from('banners').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateBanner(id: string, payload: Partial<BannerRow>) {
  const { data, error } = await supabase.from('banners').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
}
