-- Banners table for homepage/admin

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);

CREATE POLICY "Admin all banners" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
