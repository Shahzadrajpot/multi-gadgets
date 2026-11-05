-- Peshawari Khaas - Fix RLS Policies
-- Run this in Supabase SQL Editor after 001_initial_schema.sql
-- This migration improves RLS policies for better admin access

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read store_settings" ON store_settings;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read product_images" ON product_images;
DROP POLICY IF EXISTS "Public read product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Public read global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Admin all store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin all admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin all categories" ON categories;
DROP POLICY IF EXISTS "Admin all products" ON products;
DROP POLICY IF EXISTS "Admin all product_images" ON product_images;
DROP POLICY IF EXISTS "Admin all product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin all global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin all orders" ON orders;
DROP POLICY IF EXISTS "Admin all order_items" ON order_items;
-- Additional admin policies
DROP POLICY IF EXISTS "Admin update store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin insert store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin delete store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users delete admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
DROP POLICY IF EXISTS "Admin update categories" ON categories;
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
DROP POLICY IF EXISTS "Admin insert products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;
DROP POLICY IF EXISTS "Admin insert product_images" ON product_images;
DROP POLICY IF EXISTS "Admin update product_images" ON product_images;
DROP POLICY IF EXISTS "Admin delete product_images" ON product_images;
DROP POLICY IF EXISTS "Admin insert product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin update product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin delete product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin insert global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin update global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin delete global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin update orders" ON orders;
DROP POLICY IF EXISTS "Admin delete orders" ON orders;
DROP POLICY IF EXISTS "Public read own orders" ON orders;
DROP POLICY IF EXISTS "Admin update order_items" ON order_items;
DROP POLICY IF EXISTS "Admin delete order_items" ON order_items;

-- ========== STORE SETTINGS ==========
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Admin update store_settings" ON store_settings FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin insert store_settings" ON store_settings FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete store_settings" ON store_settings FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== ADMIN USERS ==========
-- Simple policy for admin_users to avoid infinite recursion
CREATE POLICY "Auth users read admin_users" ON admin_users FOR SELECT 
  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users insert admin_users" ON admin_users FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users update admin_users" ON admin_users FOR UPDATE 
  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users delete admin_users" ON admin_users FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ========== CATEGORIES ==========
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin insert categories" ON categories FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin update categories" ON categories FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete categories" ON categories FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== PRODUCTS ==========
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin update products" ON products FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete products" ON products FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== PRODUCT IMAGES ==========
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin insert product_images" ON product_images FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin update product_images" ON product_images FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete product_images" ON product_images FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== PRODUCT SIZES ==========
CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Admin insert product_sizes" ON product_sizes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin update product_sizes" ON product_sizes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete product_sizes" ON product_sizes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== GLOBAL DISCOUNTS ==========
CREATE POLICY "Public read global_discounts" ON global_discounts FOR SELECT USING (true);
CREATE POLICY "Admin insert global_discounts" ON global_discounts FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin update global_discounts" ON global_discounts FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete global_discounts" ON global_discounts FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== ORDERS ==========
CREATE POLICY "Public read own orders" ON orders FOR SELECT 
  USING (true); -- Allow all reads
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete orders" ON orders FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ========== ORDER ITEMS ==========
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update order_items" ON order_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin delete order_items" ON order_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
