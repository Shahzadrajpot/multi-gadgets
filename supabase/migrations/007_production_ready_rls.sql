-- Peshawari Khaas - Disable RLS on Admin Tables (Development Mode)
-- This allows admin operations while keeping RLS on orders/checkout

-- Disable RLS on admin-only tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_discounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Keep RLS on customer-facing tables
-- Orders and order_items still have RLS for security

-- Re-enable RLS on order tables with simple policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop old policies on orders/order_items
DROP POLICY IF EXISTS "Allow public read" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON orders;
DROP POLICY IF EXISTS "Allow auth update" ON orders;
DROP POLICY IF EXISTS "Allow auth delete" ON orders;
DROP POLICY IF EXISTS "Allow public read" ON order_items;
DROP POLICY IF EXISTS "Allow public insert" ON order_items;
DROP POLICY IF EXISTS "Allow auth update" ON order_items;
DROP POLICY IF EXISTS "Allow auth delete" ON order_items;

-- Create simple policies for orders (public can insert, auth can manage)
CREATE POLICY "public_select_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "public_select_order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE USING (auth.role() = 'authenticated');
