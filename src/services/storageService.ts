import { supabase } from '../lib/supabase';

const BUCKET_PRODUCTS = 'products';
const BUCKET_CATEGORIES = 'categories';
const BUCKET_BANNERS = 'banners';

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  if (!file) {
    throw new Error('File is required');
  }
  
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const ext = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_PRODUCTS)
    .upload(fileName, file, { upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET_PRODUCTS).getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

export async function uploadCategoryImage(file: File, categoryId: string): Promise<string> {
  if (!file) {
    throw new Error('File is required');
  }
  
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  const ext = file.name.split('.').pop();
  const fileName = `${categoryId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_CATEGORIES)
    .upload(fileName, file, { upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET_CATEGORIES).getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

export async function uploadBannerImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('File is required');
  }

  const ext = file.name.split('.').pop();
  const fileName = `banners/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_BANNERS)
    .upload(fileName, file, { upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET_BANNERS).getPublicUrl(data.path);
  
  return urlData.publicUrl;
}
