# Peshawari Khaas - Complete Setup Guide

Follow these steps to run the project, connect Supabase, and deploy to GitHub + Vercel.

---

## Quick Start (See the App Immediately)

**Without any setup**, you can run the app with mock data:

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — you'll see the homepage with sample products.  
The app works in **demo mode** when Supabase is not configured.

---

## Part 1: GitHub Setup

### 1.1 Initialize Git (if not done)

```bash
cd D:\PeshawariKhass
git init
```

### 1.2 Create .gitignore

Already included. Ensures `.env` and `node_modules` are not committed.

### 1.3 Create GitHub Repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `PeshawariKhass` (or any name)
3. Do **not** initialize with README
4. Click **Create repository**

### 1.4 Push Your Code

```bash
git add .
git commit -m "Initial commit - Peshawari Khaas eCommerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/PeshawariKhass.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Part 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization
4. Set:
   - **Name**: `peshawari-khaas`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Click **Create new project** and wait 1–2 minutes

### 2.2 Get API Keys

1. In Supabase, go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 2.3 Create .env File

In your project folder `D:\PeshawariKhass`:

1. Create a file named `.env` (no extension)
2. Add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_paste_here
```

Replace with your actual URL and key from step 2.2.

### 2.4 Run Database Migration

1. In Supabase, go to **SQL Editor**
2. Click **New query**
3. Open `supabase/migrations/001_initial_schema.sql` in your project
4. Copy its full contents and paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Confirm there are no errors

### 2.5 Create Storage Buckets

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Create:
   - Name: `products` → **Public bucket** ✓
   - Name: `categories` → **Public bucket** ✓

### 2.6 Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password (e.g. `admin@peshawarikhaas.com`)
4. Click **Create user**
5. Copy the user's **UUID** (click on the user row to see it)

6. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email) 
VALUES ('PASTE_UUID_HERE', 'admin@peshawarikhaas.com');
```

Replace `PASTE_UUID_HERE` with the UUID from step 5.

### 2.7 Add Sample Data (Optional)

Run in SQL Editor:

```sql
-- Add category
INSERT INTO categories (name, slug, is_active) 
VALUES ('Kheri Chappals', 'kheri-chappals', true)
RETURNING id;

-- Use the returned id in the next query (replace YOUR_CATEGORY_ID)
INSERT INTO products (category_id, name, slug, base_price, stock, sku, is_featured, is_active)
VALUES (
  'YOUR_CATEGORY_ID',
  'Classic Brown Kheri Chappals',
  'classic-brown-kheri-chappals',
  3500,
  12,
  'PKH-001',
  true,
  true
);

-- Add sizes for the product
INSERT INTO product_sizes (product_id, size_name)
SELECT id, unnest(ARRAY['7','8','9','10','11']) 
FROM products WHERE slug = 'classic-brown-kheri-chappals';
```

---

## Part 3: Run the Project

```bash
npm install
npm run dev
```

- **Public site**: http://localhost:5173  
- **Admin login**: http://localhost:5173/admin/login  
- **Admin panel**: http://localhost:5173/admin (after login)

---

## Part 4: Deploy to Vercel

### 4.1 Connect GitHub

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `PeshawariKhass` repository
4. Click **Import**

### 4.2 Add Environment Variables

Before deploying, add:

1. **VITE_SUPABASE_URL** = your Supabase Project URL  
2. **VITE_SUPABASE_ANON_KEY** = your Supabase anon key  

Click **Deploy**. Your site will be live at `https://your-project.vercel.app`.

---

## Troubleshooting

### Blank / white screen

- Open browser DevTools (F12) → **Console** and check for errors
- Ensure `npm run dev` finishes without errors
- If Supabase is not configured, the app uses mock data and should still show content

### "Failed to load data"

- Supabase is not configured or credentials are wrong
- Check `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing `.env`

### Admin login not working

- Confirm the user exists in **Authentication** → **Users**
- Confirm the user is in `admin_users` (run the INSERT from step 2.6)
- Use the exact email and password you created

### Build errors

```bash
npm install
npm run build
```

If it fails, share the error message for further help.
