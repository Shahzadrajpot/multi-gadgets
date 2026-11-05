-- Peshawari Khaas - Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Store Settings (single row)
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL DEFAULT 'Peshawari Khaas',
  whatsapp_number TEXT NOT NULL DEFAULT '923001234567',
  delivery_charges INTEGER NOT NULL DEFAULT 200,
  currency TEXT NOT NULL DEFAULT 'PKR',
  cod_enabled BOOLEAN NOT NULL DEFAULT true,
  logo_url TEXT,
  default_meta_title TEXT,
  default_meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO store_settings (id) VALUES (uuid_generate_v4());

-- Admin users (link Supabase auth users to admin role)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
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

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Sizes (many-to-many style - stored as JSONB array in products for simplicity, or use this table)
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL,
  UNIQUE(product_id, size_name)
);

-- Global Discounts
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

-- Orders
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

-- Order Items
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

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- RLS Policies (enable after auth setup)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read for store_settings, categories, products, product_images, global_discounts
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read global_discounts" ON global_discounts FOR SELECT USING (true);

-- Public insert for orders (checkout)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated admin users)
CREATE POLICY "Admin all store_settings" ON store_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all admin_users" ON admin_users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all product_images" ON product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all product_sizes" ON product_sizes FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all global_discounts" ON global_discounts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admin all order_items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
