-- Peshawari Khaas - Enable RLS for Production Security
-- This migration enables RLS on all tables with proper policies

-- Enable RLS on all public tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Public read, authenticated write
DROP POLICY IF EXISTS "public_select_products" ON products;
DROP POLICY IF EXISTS "allow_public_read_products" ON products;
DROP POLICY IF EXISTS "allow_all_auth_products" ON products;
DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "auth_delete_products" ON products;

CREATE POLICY "public_select_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "auth_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_products" ON products FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_products" ON products FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Product Images: Public read, authenticated write
DROP POLICY IF EXISTS "allow_public_read" ON product_images;
DROP POLICY IF EXISTS "allow_all_auth" ON product_images;
DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;

CREATE POLICY "public_select_product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "auth_insert_product_images" ON product_images FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_product_images" ON product_images FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_product_images" ON product_images FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Product Sizes: Public read, authenticated write
DROP POLICY IF EXISTS "public_select_product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "auth_insert_product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "auth_update_product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "auth_delete_product_sizes" ON product_sizes;

CREATE POLICY "public_select_product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "auth_insert_product_sizes" ON product_sizes FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_product_sizes" ON product_sizes FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_product_sizes" ON product_sizes FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Categories: Public read, authenticated write
DROP POLICY IF EXISTS "public_select_categories" ON categories;
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;

CREATE POLICY "public_select_categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Global Discounts: Public read active discounts, authenticated write
DROP POLICY IF EXISTS "public_select_global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "auth_insert_global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "auth_update_global_discounts" ON global_discounts;
DROP POLICY IF EXISTS "auth_delete_global_discounts" ON global_discounts;

CREATE POLICY "public_select_global_discounts" ON global_discounts FOR SELECT USING (is_active = true);
CREATE POLICY "auth_insert_global_discounts" ON global_discounts FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_global_discounts" ON global_discounts FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_global_discounts" ON global_discounts FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Store Settings: Public read, authenticated write
DROP POLICY IF EXISTS "auth_insert_store_settings" ON store_settings;
DROP POLICY IF EXISTS "auth_update_store_settings" ON store_settings;
DROP POLICY IF EXISTS "auth_delete_store_settings" ON store_settings;

CREATE POLICY "public_select_store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "auth_insert_store_settings" ON store_settings FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_store_settings" ON store_settings FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_store_settings" ON store_settings FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Admin Users: Only authenticated users can see/manage
DROP POLICY IF EXISTS "admin_select" ON admin_users;
DROP POLICY IF EXISTS "admin_insert" ON admin_users;
DROP POLICY IF EXISTS "admin_update" ON admin_users;
DROP POLICY IF EXISTS "admin_delete" ON admin_users;

CREATE POLICY "admin_select" ON admin_users FOR SELECT TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "admin_insert" ON admin_users FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update" ON admin_users FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete" ON admin_users FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Orders: Public can insert (checkout), authenticated can manage
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
DROP POLICY IF EXISTS "public_select_orders" ON orders;
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
DROP POLICY IF EXISTS "auth_delete_orders" ON orders;

CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Order Items: Public can insert, authenticated can manage
DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "public_select_order_items" ON order_items;
DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
DROP POLICY IF EXISTS "auth_delete_order_items" ON order_items;

CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select_order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
