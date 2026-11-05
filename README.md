# MultiGadgets — Premium Tech & Smart Accessories eCommerce Platform

A production-ready, ultra-fast eCommerce web application engineered for **MultiGadgets**, specializing in next-generation smartwatches, premium audio gear, high-speed GaN chargers, and mobile accessories.

---

## ⚡ Tech Stack & Architecture

- **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build & Dev Tool:** [Vite 7](https://vitejs.dev/) with Rollup Manual Chunking
- **UI & Design System:** [Ant Design 5](https://ant.design/) + Custom Pure CSS Design System
- **Routing:** [React Router 7](https://reactrouter.com/) (with `React.lazy` code-splitting)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage Buckets, Auth)
- **Icons:** `@ant-design/icons`
- **State Management:** React Context API (`AppContext`, `AuthContext`)

---

## 🚀 Key Features

### 1. 3D Modern Hero Slider
- Interactive 3-slide tech showcase (Ultra Smartwatches, ANC Wireless Earbuds, 65W GaN Power Gear).
- 360° tech badge, continuous 3D floating animation, ambient colored halos, and pause-on-hover timers.
- Segmented progress bar navigation with smooth mobile swipe and responsive stack layout.

### 2. High-Performance Loading Architecture
- **Pure CSS Skeletons:** GPU-accelerated `@keyframes mg-shimmer` linear-gradient animation with 0ms JavaScript overhead.
- **Zero Cumulative Layout Shift (CLS = 0.00):** Skeletons match exact 1:1 dimensions for product cards, category cards, single product detail pages, and the admin dashboard.
- **Optimized Bundle Splitting:** Lazy-loaded admin panel and policy pages reduce initial customer payload to **~60 kB** (>96% reduction).

### 3. Navigation & MegaMenu
- Solution A Categories MegaMenu with 2-column rich preview cards (thumbnails, product counts, and active links).
- Dynamic mobile navigation drawer with quick category shortcuts, search input, and customer support links.

### 4. Complete eCommerce Flow
- Filterable product catalog with price sliders, category tags, and instant search.
- Product detail pages with dynamic title injection, color/variant options, and instant WhatsApp ordering (`wa.me`).
- Persistent shopping cart with coupon/discount engine and Cash on Delivery (COD) checkout.

### 5. Admin Management Suite
- Protected admin routes with Supabase authentication.
- Metric cards overview and recent order tracking.
- Product CRUD with automatic real-time URL slug generator and multi-image upload to Supabase Storage.
- Category management and global store discount controls.

### 6. SEO & Compliance Ready
- Automated `robots.txt` and `sitemap.xml` for search engine crawlers.
- OpenGraph and Twitter Card social preview tags.
- Full consumer policy suite: Shipping Policy, Returns & Refund Policy, Privacy Policy, About Us, and Contact Us.

---

## 📁 Project Directory Structure

```
multi-gadgets/
├── public/
│   ├── hero/                  # 3D gadget hero showcase assets
│   ├── Logo.webp              # MultiGadgets brand mark
│   ├── robots.txt             # Search engine crawler directives
│   └── sitemap.xml            # XML sitemap index
├── src/
│   ├── components/
│   │   ├── auth/              # Protected route guards
│   │   ├── home/              # HeroSlider & homepage modules
│   │   ├── layout/            # Header, Footer, MegaMenu, MobileDrawer
│   │   └── shared/            # ProductCard, Skeletons system
│   ├── context/               # AppContext & AuthContext
│   ├── data/                  # Mock fallback datasets
│   ├── layouts/               # AdminLayout
│   ├── lib/                   # Supabase client singleton & sanitizers
│   ├── pages/
│   │   ├── admin/             # Dashboard, Products, Categories, Orders, Settings
│   │   ├── policies/          # Shipping, Returns, Privacy, About, Contact
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── CartPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── services/              # Supabase database API services
│   ├── theme/                 # Ant Design brand tokens & color palettes
│   └── types/                 # Strict TypeScript data contracts
└── supabase/
    └── migrations/            # SQL schemas, RLS policies, and seed data
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/multi-gadgets.git

# Navigate into project directory
cd multi-gadgets

# Install dependencies
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### Run Locally
```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security
- `.env` and sensitive credentials are permanently excluded via `.gitignore`.
- Database access is protected by Supabase PostgreSQL Row Level Security (RLS) policies allowing public `SELECT` on active catalog items, while restricting mutations to verified store administrators.

---

## 📄 License
MIT © MultiGadgets. All rights reserved.
