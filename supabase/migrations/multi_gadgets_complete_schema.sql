-- ========================================================
-- MULTI GADGETS: Complete Database Schema & Secure Setup
-- Run this entire script in Supabase SQL Editor
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop (if resetting)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS global_discounts CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 3. Store Settings
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL DEFAULT 'Multi Gadgets',
  whatsapp_number TEXT NOT NULL DEFAULT '923001234567',
  delivery_charges INTEGER NOT NULL DEFAULT 200,
  currency TEXT NOT NULL DEFAULT 'PKR',
  cod_enabled BOOLEAN NOT NULL DEFAULT true,
  logo_url TEXT,
  default_meta_title TEXT DEFAULT 'Multi Gadgets | Premium Tech & Smart Accessories',
  default_meta_description TEXT DEFAULT 'Shop the latest smartwatches, wireless earbuds, fast chargers, and daily tech essentials at Multi Gadgets.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Admin Users (Links Supabase Auth to Admin privileges)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  base_price INTEGER NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  description TEXT,
  specifications JSONB,
  care_instructions TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Product Variants / Colors / Options (product_sizes table)
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL,
  UNIQUE(product_id, size_name)
);

-- 9. Global Discounts
CREATE TABLE global_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  apply_to TEXT NOT NULL CHECK (apply_to IN ('all', 'categories')),
  category_ids UUID[],
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Banners
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  subtotal INTEGER NOT NULL,
  product_discount INTEGER NOT NULL DEFAULT 0,
  global_discount INTEGER NOT NULL DEFAULT 0,
  delivery_charges INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'COD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Performance Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ========================================================
-- 14. ENTERPRISE ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read for Catalog Data
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public read global_discounts" ON global_discounts FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = true OR is_admin());

-- Orders: Public can create an order, but CANNOT view all orders (prevents customer data leaks)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admin view all order_items" ON order_items FOR SELECT USING (is_admin());
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete orders" ON orders FOR DELETE USING (is_admin());
CREATE POLICY "Admin update order_items" ON order_items FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete order_items" ON order_items FOR DELETE USING (is_admin());

-- Admin Full Write Access (ONLY Verified Admins can manage catalog)
CREATE POLICY "Admin manage store_settings" ON store_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin manage product_images" ON product_images FOR ALL USING (is_admin());
CREATE POLICY "Admin manage product_sizes" ON product_sizes FOR ALL USING (is_admin());
CREATE POLICY "Admin manage global_discounts" ON global_discounts FOR ALL USING (is_admin());
CREATE POLICY "Admin manage banners" ON banners FOR ALL USING (is_admin());
CREATE POLICY "Admin manage admin_users" ON admin_users FOR ALL USING (is_admin());

-- ========================================================
-- 15. SEED INITIAL DATA (Multi Gadgets Store Setup)
-- ========================================================
-- Insert Default Store Settings
INSERT INTO store_settings (id, store_name, whatsapp_number, delivery_charges, currency, cod_enabled)
VALUES (uuid_generate_v4(), 'Multi Gadgets', '923001234567', 200, 'PKR', true);

-- Insert Gadget Categories
INSERT INTO categories (id, name, slug, image_url, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Smart Watches', 'smart-watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', true),
  ('22222222-2222-2222-2222-222222222222', 'Wireless Audio', 'wireless-audio', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', true),
  ('33333333-3333-3333-3333-333333333333', 'Power & Charging', 'power-charging', 'https://images.unsplash.com/photo-1622445262464-84b14e4b7de7?w=600', true),
  ('44444444-4444-4444-4444-444444444444', 'Smart Accessories', 'smart-accessories', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', true);

-- Insert Sample Products
INSERT INTO products (id, category_id, name, slug, base_price, discount_type, discount_value, stock, sku, description, is_featured, is_active) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Ultra Smart Watch Pro AMOLED',
    'ultra-smart-watch-pro-amoled',
    6500,
    'percentage',
    15,
    30,
    'MG-SW-001',
    'High-definition AMOLED display smartwatch with Bluetooth calling, heart rate & SpO2 monitoring, and 7-day battery life.',
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'True Wireless ANC Earbuds V5.3',
    'true-wireless-anc-earbuds-v53',
    4500,
    'fixed',
    500,
    45,
    'MG-TWS-002',
    'Active Noise Cancelling earbuds with deep bass audio, low-latency gaming mode, and 36-hour total battery playback.',
    true,
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    '65W GaN Fast Charger Dual USB-C',
    '65w-gan-fast-charger-dual-usbc',
    3200,
    NULL,
    0,
    50,
    'MG-CH-003',
    'Compact Gallium Nitride high-speed charger. Powers laptops, tablets, and smartphones simultaneously with smart temperature control.',
    true,
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'Magnetic Wireless Power Bank 10,000mAh',
    'magnetic-wireless-power-bank-10000mah',
    4800,
    'percentage',
    10,
    25,
    'MG-PB-004',
    'Snap-and-go magnetic wireless power bank with foldable kickstand and 20W PD fast charge capability.',
    true,
    true
  );

-- Insert Images
INSERT INTO product_images (product_id, url, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 0),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1622445262464-84b14e4b7de7?w=600', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', 0);

-- Insert Color/Variant Options
INSERT INTO product_sizes (product_id, size_name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Black Titanium'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Silver Edition'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Orange Trail'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Matte Black'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Glacier White'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Navy Blue'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Standard White'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Stealth Black'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Midnight Black'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Space Gray');
