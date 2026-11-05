# Peshawari Khaas - Production Deployment Guide

**Status:** Ready for Deployment (With Prerequisites)  
**Last Update:** February 2026  
**Version:** 1.0.0

---

## 🚨 CRITICAL BEFORE DEPLOYMENT

### Step 1: Regenerate Supabase Credentials (URGENT!)
Your original `.env.example` had real credentials exposed in git history. **This is a security breach.**

1. **Immediately go to:** [Supabase Dashboard](https://app.supabase.com)
2. **Navigate to:** Project Settings → API
3. **Regenerate BOTH:**
   - `Anon Public Key` - New random key for frontend
   - `Service Role Secret` - Keep this safe, never commit
4. **Get your new credentials:**
   - Copy new `Project URL` 
   - Copy new `Anon Public Key`
5. **Update files:**
   - Create `.env` file (not committed) with new credentials:
     ```env
     VITE_SUPABASE_URL=https://yourproject.supabase.co
     VITE_SUPABASE_ANON_KEY=new-anon-key-here
     ```
   - Update `.env.example` to reflect (still with placeholders):
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

### Step 2: Verify Build
```bash
cd "g:\Main Project\PeshawariKhass"
npm install --legacy-peer-deps  # if needed
npm run build
```

✅ Build should complete without errors  
✅ No warnings about unused variables  
✅ Bundle size < 500KB gzipped

---

## PRE-DEPLOYMENT CHECKLIST

### Code Quality ✅
- [x] Remove console.logs → **DONE**
- [x] Add error boundaries → **DONE**
- [x] Add loading states → **DONE**
- [x] Validate inputs → **DONE**
- [x] Error messages are clear → **DONE**
- [ ] Run ESLint: `npm run lint`
- [ ] Run TypeScript check: `npm run build`
- [ ] No hardcoded API keys anywhere

### Security ✅
- [x] Credentials in .env (not .env.example) → **DONE**
- [x] Environment validation at startup → **DONE**
- [x] File upload validation (5MB, image types only) → **DONE**
- [x] Form validation on all inputs → **DONE**
- [ ] Supabase credentials regenerated → **ACTION REQUIRED**
- [ ] RLS (Row Level Security) policies verified
- [ ] CORS configured in Supabase dashboard
- [ ] Rate limiting configured (optional but recommended)

### Testing ✅
- [ ] **Manual Testing (Before Deploy):**
  - [ ] Homepage loads
  - [ ] Products display
  - [ ] Can navigate pages
  - [ ] Can add to cart
  - [ ] Checkout form validates
  - [ ] Admin login works
  - [ ] Can create product
  - [ ] Can upload image (test 5MB limit)
  - [ ] No console errors/logs

- [ ] **Browser Compatibility:**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile browsers

- [ ] **Mobile Responsive:**
  - [ ] iPhone 12 (375px)
  - [ ] Pixel 5 (393px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)

### Performance ✅
- [ ] Run Lighthouse audit
  - Target: Performance 80+
  - Target: Accessibility 90+
  - Target: Best Practices 90+
  - Target: SEO 90+
- [ ] Check bundle size (npm run build)
- [ ] Check for unused dependencies

### Deployment ✅
- [ ] GitHub repo created
- [ ] All changes committed and pushed
- [ ] Vercel account created
- [ ] Vercel environment variables set
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)

---

## VERCEL DEPLOYMENT STEPS

### 1. Connect GitHub Repository

```bash
# In project root
git init
git add .
git commit -m "Initial commit - Peshawari Khaas eCommerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/PeshawariKhass.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New → Project**
4. Select `PeshawariKhass` repository
5. Click **Import**

### 3. Configure Environment Variables

In Vercel Project Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY = sk_live_xxx...
```

⚠️ **DO NOT use the anon key from .env.example in Vercel!**  
⚠️ **Use the REGENERATED key from Supabase dashboard**

### 4. Deploy

Click **Deploy** and wait for build to complete.

Your site will be live at: `https://your-project.vercel.app`

---

## POST-DEPLOYMENT VERIFICATION

### Step 1: Test Core Flows
- [ ] Homepage loads (check load time)
- [ ] Products display with images
- [ ] Can add product to cart
- [ ] Checkout form works
- [ ] Order creates successfully
- [ ] Admin login works
- [ ] Can create/edit product

### Step 2: Check Errors
- [ ] Open DevTools (F12)
- [ ] Console tab: No errors or warnings
- [ ] Network tab: No failed requests
- [ ] All images load
- [ ] Supabase connected (check in Network tab)

### Step 3: Run Lighthouse Audit
```
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Click "Analyze page load"
4. Target: 80+ on all metrics
```

### Step 4: Mobile Testing
- [ ] Mobile Safari on iPhone
- [ ] Chrome on Android
- [ ] Check layout is not broken
- [ ] Touch targets are 48px+
- [ ] Navigation is clear

### Step 5: Monitor Setup (Optional)
1. **Setup Error Tracking:**
   - Create Sentry account at sentry.io
   - Add Sentry to project
   - Monitor errors in production

2. **Setup Analytics:**
   - Add Google Analytics or Plausible
   - Monitor user behavior
   - Track Core Web Vitals

---

## PRODUCTION MAINTENANCE

### Daily
- [ ] Check Supabase dashboard for errors
- [ ] Monitor order creation

### Weekly
- [ ] Check Vercel deployment logs
- [ ] Review error tracking dashboard
- [ ] Verify database backups completed

### Monthly
- [ ] Update Node dependencies (npm update)
- [ ] Review analytics
- [ ] Check for any Supabase issues
- [ ] Audit storage usage

---

## TROUBLESHOOTING

### Blank White Screen
```
→ Check .env variables are correct
→ Check Supabase URL is accessible
→ Check browser console for errors (F12)
→ Hard refresh (Ctrl+Shift+R)
```

### Supabase Connection Fails
```
→ Verify VITE_SUPABASE_URL is correct
→ Verify VITE_SUPABASE_ANON_KEY is correct
→ Check Supabase project is not paused
→ Check internet connection
→ Check CORS is enabled in Supabase
```

### Images Don't Load
```
→ Check storage buckets exist in Supabase
→ Verify buckets are PUBLIC
→ Check image URLs in console
→ Verify VITE_SUPABASE_URL ends with .co (not .io)
```

### Admin Login Fails
```
→ Verify user exists in Supabase Auth
→ Verify user is in admin_users table
→ Check password is correct
→ Verify RLS policies allow admin access
```

### Orders Not Saving
```
→ Check RLS policies on orders table
→ Verify auth token is valid
→ Check database has no errors (Supabase dashboard)
→ Check browser console for error details
```

---

## SCALING CONSIDERATIONS

### When You Have 100+ Orders/Month
- ✅ Current setup handles this fine
- Monitor Supabase storage usage
- Consider image optimization via CDN

### When You Have 1000+ Orders/Month
-⚠️ Consider read replicas for reporting
- ⚠️ Add caching layer (Redis/Upstash)
- ⚠️ Optimize N+1 queries

### When You Have 10,000+ Products
- ⚠️ Implement pagination (DONE)
- ⚠️ Add full-text search
- ⚠️ Consider Elasticsearch for search
- ⚠️ Denormalize category counts

---

## BACKUP & RECOVERY

### Supabase Automatic Backups
- ✅ Enabled by default
- ✅ Kept for 7 days (on Paid tier)

### Manual Backup Process
```sql
-- Export products
SELECT * FROM products TO '/tmp/products.csv';

-- Export orders
SELECT * FROM orders TO '/tmp/orders.csv';
```

Or use Supabase dashboard: Database → Backups

---

## SECURITY HARDENING (Advanced)

### Enable RLS (Row Level Security)
```sql
-- Already configured in your migrations
-- Verify in Supabase: Database → Policies
```

### Add API Rate Limiting
Configure in Vercel:
```json
{
  "buildCommand": "npm run build",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

### Add CSP Headers
In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:"
        }
      ]
    }
  ]
}
```

---

## MONITORING & ANALYTICS

### Recommended Tools
1. **Error Tracking:** Sentry.io (free tier)
2. **Analytics:** Plausible.io or Fathom Analytics
3. **APM:** NewRelic or DataDog (optional)
4. **Status Page:** Statuspage.io (external comms)

### Key Metrics to Track
- Page load time < 3 seconds
- 99.9% uptime
- 0 critical errors per day
- Order creation success rate > 99%

---

## SUPPORT & DOCUMENTATION

### For Users
- [ ] Create Help/FAQ page
- [ ] Add email support: support@peshawarikhaas.com
- [ ] WhatsApp business: Your number
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Return Policy

### For Developers
- [ ] Keep SETUP.md updated
- [ ] Document custom functions
- [ ] Keep AUDIT_REPORT.md for future audits
- [ ] Keep FIXES_APPLIED.md for history

---

## FINAL CHECKLIST

Before clicking "Deploy":

- [x] Console logs removed
- [x] Error boundaries added
- [x] Loading states added
- [x] File validation added
- [x] Form validation improved
- [ ] **NEW Supabase credentials generated** ← DO THIS
- [ ] Build tested locally (`npm run build`)
- [ ] All env variables correct
- [ ] Git repository created
- [ ] .env added to .gitignore (verify!)
- [ ] Vercel project created
- [ ] Environment variables in Vercel set
- [ ] Ready to deploy

---

## GO LIVE! 🚀

Once all checks pass:

```bash
# Push final changes
git add .
git commit -m "Production deployment ready"
git push origin main

# Deploy in Vercel
# Just merge to main branch, Vercel deploys automatically
```

Monitor first 24 hours:
- [ ] Check error logs
- [ ] Verify orders creating
- [ ] Check admin can login
- [ ] Monitor response times

---

## SUCCESS METRICS

After deployment, track:

| Metric | Target | Action |
|--------|--------|--------|
| Uptime | 99.9% | Alert if below |
| Load Time | < 3s | Optimize if above |
| Errors/Day | 0 | Investigate if > 0 |
| Orders Success | 99%+ | Investigate failures |
| Admin Login | Always works | Critical fix if fails |

---

**Questions? Refer to:**
- AUDIT_REPORT.md - For code issues
- FIXES_APPLIED.md - For recent changes
- SETUP.md - For initial setup
- This guide - For deployment

**Good luck! 🎉**

