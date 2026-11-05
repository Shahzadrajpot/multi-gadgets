-- Peshawari Khaas - Secure RLS Policies (Final)
-- This enables proper security while allowing admin operations
-- Run this AFTER disabling the permissive RLS from 005_disable_rls_dev.sql

-- First, re-enable RLS on all tables
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop all old policies
DROP POLICY IF EXISTS "Allow public read" ON store_settings;
DROP POLICY IF EXISTS "Allow auth insert" ON store_settings;
DROP POLICY IF EXISTS "Allow auth update" ON store_settings;
DROP POLICY IF EXISTS "Allow auth delete" ON store_settings;

DROP POLICY IF EXISTS "Allow public read" ON admin_users;
DROP POLICY IF EXISTS "Allow auth insert" ON admin_users;
DROP POLICY IF EXISTS "Allow auth update" ON admin_users;
DROP POLICY IF EXISTS "Allow auth delete" ON admin_users;

DROP POLICY IF EXISTS "Allow public read" ON categories;
DROP POLICY IF EXISTS "Allow auth insert" ON categories;
DROP POLICY IF EXISTS "Allow auth update" ON categories;
DROP POLICY IF EXISTS "Allow auth delete" ON categories;

DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Allow auth insert" ON products;
DROP POLICY IF EXISTS "Allow auth update" ON products;
DROP POLICY IF EXISTS "Allow auth delete" ON products;

DROP POLICY IF EXISTS "Allow public read" ON product_images;
DROP POLICY IF EXISTS "Allow auth insert" ON product_images;
DROP POLICY IF EXISTS "Allow auth update" ON product_images;
DROP POLICY IF EXISTS "Allow auth delete" ON product_images;

DROP POLICY IF EXISTS "Allow public read" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth insert" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth update" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth delete" ON product_sizes;

DROP POLICY IF EXISTS "Allow public read" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth insert" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth update" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth delete" ON global_discounts;

DROP POLICY IF EXISTS "Allow public read" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON orders;
DROP POLICY IF EXISTS "Allow auth update" ON orders;
DROP POLICY IF EXISTS "Allow auth delete" ON orders;

DROP POLICY IF EXISTS "Allow public read" ON order_items;
DROP POLICY IF EXISTS "Allow public insert" ON order_items;
DROP POLICY IF EXISTS "Allow auth update" ON order_items;
DROP POLICY IF EXISTS "Allow auth delete" ON order_items;

-- ========== SECURE POLICIES ==========

-- STORE_SETTINGS: Public read, authenticated write
CREATE POLICY "public_select_store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "auth_insert_store_settings" ON store_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_store_settings" ON store_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_store_settings" ON store_settings FOR DELETE USING (auth.role() = 'authenticated');

-- ADMIN_USERS: Authenticated access only
CREATE POLICY "auth_select_admin_users" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_admin_users" ON admin_users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_admin_users" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_admin_users" ON admin_users FOR DELETE USING (auth.role() = 'authenticated');

-- CATEGORIES: Public read, authenticated write
CREATE POLICY "public_select_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCTS: Public read, authenticated write
CREATE POLICY "public_select_products" ON products FOR SELECT USING (true);
CREATE POLICY "auth_insert_products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCT_IMAGES: Public read, authenticated write (THIS IS KEY FOR IMAGE UPLOADS)
CREATE POLICY "public_select_product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "auth_insert_product_images" ON product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_product_images" ON product_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_product_images" ON product_images FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCT_SIZES: Public read, authenticated write
CREATE POLICY "public_select_product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "auth_insert_product_sizes" ON product_sizes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_product_sizes" ON product_sizes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_product_sizes" ON product_sizes FOR DELETE USING (auth.role() = 'authenticated');

-- GLOBAL_DISCOUNTS: Public read, authenticated write
CREATE POLICY "public_select_global_discounts" ON global_discounts FOR SELECT USING (true);
CREATE POLICY "auth_insert_global_discounts" ON global_discounts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_global_discounts" ON global_discounts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_global_discounts" ON global_discounts FOR DELETE USING (auth.role() = 'authenticated');

-- ORDERS: Public read, public insert (for checkout), authenticated update/delete (for admin)
CREATE POLICY "public_select_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- ORDER_ITEMS: Public read, public insert (for checkout), authenticated update/delete (for admin)
CREATE POLICY "public_select_order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE USING (auth.role() = 'authenticated');
