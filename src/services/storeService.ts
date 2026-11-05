import { supabase } from '../lib/supabase';

export interface StoreSettings {
  store_name: string;
  whatsapp_number: string;
  delivery_charges: number;
  currency: string;
  cod_enabled: boolean;
  logo_url?: string;
  default_meta_title?: string;
  default_meta_description?: string;
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  // Return data if found, otherwise return defaults
  if (data) return data;
  
  // If there's an error, log it but don't throw - use defaults instead
  if (error && error.code !== 'PGRST116') {
    console.warn('Store settings fetch error:', error);
  }
  
  return {
    store_name: 'Multi Gadgets',
    whatsapp_number: '923001234567',
    delivery_charges: 200,
    currency: 'PKR',
    cod_enabled: true,
  };
}

export async function updateStoreSettings(id: string, payload: Partial<StoreSettings>) {
  const { data, error } = await supabase
    .from('store_settings')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
