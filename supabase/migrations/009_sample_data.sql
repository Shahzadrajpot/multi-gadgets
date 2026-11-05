-- Peshawari Khaas - Sample Data
-- Insert sample categories and products

-- Clear existing data
DELETE FROM product_sizes;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM global_discounts;

-- Insert Categories
INSERT INTO categories (id, name, slug, image_url, is_active) VALUES
  (uuid_generate_v4(), 'Men''s Chappals', 'mens-chappals', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', true),
  (uuid_generate_v4(), 'Women''s Chappals', 'womens-chappals', 'https://images.unsplash.com/photo-1544441894-a0cff1dfc810?w=400', true),
  (uuid_generate_v4(), 'Premium Collection', 'premium-collection', 'https://images.unsplash.com/photo-1605348532760-6233dd02dcff?w=400', true),
  (uuid_generate_v4(), 'Summer Collection', 'summer-collection', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', true);

-- Get category IDs for products
WITH cat_ids AS (
  SELECT id, name FROM categories
)
-- Insert Products
INSERT INTO products (id, category_id, name, slug, base_price, discount_type, discount_value, stock, sku, description, is_featured, is_active, care_instructions)
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'mens-chappals'),
  'Classic Leather Chappal',
  'classic-leather-chappal',
  2500,
  'percentage',
  10,
  50,
  'MEN-001',
  'Premium handmade leather chappal with traditional Peshawar craftsmanship. Comfortable and durable.',
  true,
  true,
  'Wipe with damp cloth. Air dry in shade.'
UNION ALL
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'mens-chappals'),
  'Formal Leather Chappal',
  'formal-leather-chappal',
  3500,
  'percentage',
  15,
  30,
  'MEN-002',
  'Elegant formal design with premium leather. Perfect for special occasions.',
  true,
  true,
  'Clean with soft cloth. Apply leather conditioner monthly.'
UNION ALL
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'womens-chappals'),
  'Embroidered Women Chappal',
  'embroidered-women-chappal',
  2800,
  'percentage',
  20,
  40,
  'WOM-001',
  'Beautiful embroidered design with colorful thread work. Comfortable for everyday wear.',
  true,
  true,
  'Hand wash gently. Dry naturally in shade.'
UNION ALL
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'womens-chappals'),
  'Casual Women Chappal',
  'casual-women-chappal',
  1999,
  'percentage',
  5,
  60,
  'WOM-002',
  'Simple and elegant casual chappal for everyday comfort.',
  false,
  true,
  'Easy to clean. Wipe with moist cloth.'
UNION ALL
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'premium-collection'),
  'Royal Leather Chappal',
  'royal-leather-chappal',
  5999,
  'fixed',
  500,
  20,
  'PREM-001',
  'Premium handcrafted chappal with finest quality leather. Limited edition.',
  true,
  true,
  'Professional care recommended. Use only leather care products.'
UNION ALL
SELECT
  uuid_generate_v4(),
  (SELECT id FROM categories WHERE slug = 'summer-collection'),
  'Summer Comfort Chappal',
  'summer-comfort-chappal',
  1500,
  'percentage',
  12,
  100,
  'SUM-001',
  'Light and breathable chappal perfect for summer season.',
  true,
  true,
  'Keep in cool, dry place. Wipe with cloth when dusty.';

-- Insert Product Images
INSERT INTO product_images (id, product_id, url, sort_order)
SELECT
  uuid_generate_v4(),
  p.id,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  1
FROM products p
WHERE p.slug IN ('classic-leather-chappal', 'formal-leather-chappal', 'embroidered-women-chappal', 'casual-women-chappal', 'royal-leather-chappal', 'summer-comfort-chappal');

-- Insert Product Sizes
INSERT INTO product_sizes (id, product_id, size_name)
SELECT uuid_generate_v4(), p.id, size
FROM products p
CROSS JOIN (
  SELECT unnest(ARRAY['5', '6', '7', '8', '9', '10', '11', '12']) as size
) sizes
WHERE p.is_active = true;

-- Insert Global Discount (optional)
INSERT INTO global_discounts (id, is_active, discount_type, discount_value, apply_to, start_date, end_date)
VALUES (
  uuid_generate_v4(),
  false,
  'percentage',
  0,
  'all',
  NOW(),
  NOW() + interval '30 days'
);

-- Insert Store Settings
INSERT INTO store_settings (id, store_name, whatsapp_number, delivery_charges, currency, cod_enabled, logo_url)
VALUES (
  uuid_generate_v4(),
  'Peshawari Khaas',
  '923001234567',
  200,
  'PKR',
  true,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'
);
