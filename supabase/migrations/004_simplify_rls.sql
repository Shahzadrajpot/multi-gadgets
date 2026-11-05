-- Peshawari Khaas - Simplified RLS Policies
-- This migration uses simpler, more reliable RLS policies
-- Run this AFTER running 003_fix_rls_policies.sql

-- Drop all existing policies
DROP POLICY IF EXISTS "Public read store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin update store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin insert store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin delete store_settings" ON store_settings;
DROP POLICY IF EXISTS "Allow public read" ON store_settings;
DROP POLICY IF EXISTS "Allow auth write" ON store_settings;
DROP POLICY IF EXISTS "Allow auth insert" ON store_settings;
DROP POLICY IF EXISTS "Allow auth update" ON store_settings;
DROP POLICY IF EXISTS "Allow auth delete" ON store_settings;

DROP POLICY IF EXISTS "Auth users read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Auth users delete admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow public read" ON admin_users;
DROP POLICY IF EXISTS "Allow auth write" ON admin_users;
DROP POLICY IF EXISTS "Allow auth insert" ON admin_users;
DROP POLICY IF EXISTS "Allow auth update" ON admin_users;
DROP POLICY IF EXISTS "Allow auth delete" ON admin_users;

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
DROP POLICY IF EXISTS "Admin update categories" ON categories;
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
DROP POLICY IF EXISTS "Allow public read" ON categories;
DROP POLICY IF EXISTS "Allow auth write" ON categories;
DROP POLICY IF EXISTS "Allow auth insert" ON categories;
DROP POLICY IF EXISTS "Allow auth update" ON categories;
DROP POLICY IF EXISTS "Allow auth delete" ON categories;

DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin insert products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Allow auth write" ON products;
DROP POLICY IF EXISTS "Allow auth insert" ON products;
DROP POLICY IF EXISTS "Allow auth update" ON products;
DROP POLICY IF EXISTS "Allow auth delete" ON products;

DROP POLICY IF EXISTS "Public read product_images" ON product_images;
DROP POLICY IF EXISTS "Admin insert product_images" ON product_images;
DROP POLICY IF EXISTS "Admin update product_images" ON product_images;
DROP POLICY IF EXISTS "Admin delete product_images" ON product_images;
DROP POLICY IF EXISTS "Allow public read" ON product_images;
DROP POLICY IF EXISTS "Allow auth write" ON product_images;
DROP POLICY IF EXISTS "Allow auth insert" ON product_images;
DROP POLICY IF EXISTS "Allow auth update" ON product_images;
DROP POLICY IF EXISTS "Allow auth delete" ON product_images;

DROP POLICY IF EXISTS "Public read product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin insert product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin update product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Admin delete product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Allow public read" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth write" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth insert" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth update" ON product_sizes;
DROP POLICY IF EXISTS "Allow auth delete" ON product_sizes;

DROP POLICY IF EXISTS "Public read global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin insert global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin update global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Admin delete global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "Allow public read" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth write" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth insert" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth update" ON global_discounts;
DROP POLICY IF EXISTS "Allow auth delete" ON global_discounts;

DROP POLICY IF EXISTS "Public read own orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Admin update orders" ON orders;
DROP POLICY IF EXISTS "Admin delete orders" ON orders;
DROP POLICY IF EXISTS "Allow public read" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON orders;
DROP POLICY IF EXISTS "Allow auth write" ON orders;
DROP POLICY IF EXISTS "Allow auth insert" ON orders;
DROP POLICY IF EXISTS "Allow auth update" ON orders;
DROP POLICY IF EXISTS "Allow auth delete" ON orders;

DROP POLICY IF EXISTS "Public read order_items" ON order_items;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Admin update order_items" ON order_items;
DROP POLICY IF EXISTS "Admin delete order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public read" ON order_items;
DROP POLICY IF EXISTS "Allow public insert" ON order_items;
DROP POLICY IF EXISTS "Allow auth write" ON order_items;
DROP POLICY IF EXISTS "Allow auth insert" ON order_items;
DROP POLICY IF EXISTS "Allow auth update" ON order_items;
DROP POLICY IF EXISTS "Allow auth delete" ON order_items;

-- ========== SIMPLE POLICIES ==========
-- Allow public reads
CREATE POLICY "Allow public read" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON product_images FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON global_discounts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON admin_users FOR SELECT USING (true);

-- Allow public inserts (for checkout)
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON order_items FOR INSERT WITH CHECK (true);

-- Allow authenticated writes (admin panel functions)
CREATE POLICY "Allow auth insert" ON store_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON store_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON store_settings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON admin_users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON admin_users FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON product_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON product_images FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON product_sizes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON product_sizes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON product_sizes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON global_discounts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON global_discounts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON global_discounts FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth update" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth update" ON order_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON order_items FOR DELETE USING (auth.role() = 'authenticated');
