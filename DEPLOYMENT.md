# Panduan Deployment SiCMS ke Vercel

Panduan lengkap untuk deploy project SiCMS ke Vercel dengan best practices.

## 📋 Prerequisites

Sebelum deploy, pastikan:
- [ ] Project sudah di-push ke GitHub repository
- [ ] Supabase project sudah dibuat dan dikonfigurasi
- [ ] Database schema sudah dijalankan di Supabase
- [ ] Storage buckets sudah dibuat di Supabase
- [ ] Environment variables sudah disiapkan

## 🚀 Deployment via Vercel Dashboard (Recommended)

### Step 1: Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub account
3. Authorize Vercel untuk mengakses GitHub repositories

### Step 2: Import Project

1. Klik **"Add New Project"** di dashboard
2. Pilih repository SiCMS dari daftar
3. Vercel akan auto-detect framework (Vite)
4. Klik **"Deploy"** (jangan klik dulu, setup environment variables dulu)

### Step 3: Setup Environment Variables

**PENTING:** Setup environment variables SEBELUM deploy pertama kali!

1. Di halaman project setup, scroll ke **"Environment Variables"**
2. Tambahkan variables berikut:

```
VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development

VITE_SUPABASE_SERVICE_ROLE_KEY (Optional)
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```

**Cara mendapatkan Supabase credentials:**
- Buka Supabase Dashboard → Project Settings → API
- Copy **Project URL** untuk `VITE_SUPABASE_URL`
- Copy **anon/public key** untuk `VITE_SUPABASE_ANON_KEY`
- Copy **service_role key** untuk `VITE_SUPABASE_SERVICE_ROLE_KEY` (jika diperlukan)

### Step 4: Deploy

1. Setelah environment variables diset, klik **"Deploy"**
2. Tunggu proses build selesai (biasanya 2-3 menit)
3. Setelah selesai, Vercel akan memberikan URL: `https://your-project.vercel.app`

### Step 5: Verifikasi Deployment

1. Buka URL yang diberikan Vercel
2. Test halaman public (homepage, berita, dll)
3. Test admin login
4. Check browser console untuk errors

## 🔧 Deployment via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# Deploy ke preview environment
vercel

# Deploy ke production
vercel --prod
```

### Step 4: Setup Environment Variables via CLI

```bash
# Set environment variable
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_SERVICE_ROLE_KEY production
```

Atau setup via dashboard lebih mudah.

## ⚙️ Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi dengan:
- ✅ SPA routing (redirect semua routes ke index.html)
- ✅ Security headers (XSS protection, frame options, dll)
- ✅ Cache headers untuk static assets
- ✅ Auto-detect Vite framework

### Build Settings

Vercel akan auto-detect, tapi pastikan:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 🔐 Supabase Configuration untuk Production

### 1. Update Redirect URLs

1. Buka Supabase Dashboard → Authentication → URL Configuration
2. Tambahkan URL production ke **Site URL:**
   ```
   https://your-project.vercel.app
   ```
3. Tambahkan ke **Redirect URLs:**
   ```
   https://your-project.vercel.app/**
   ```

### 2. Review RLS Policies

Pastikan semua Row Level Security (RLS) policies sudah dikonfigurasi dengan benar:
- Public read access untuk konten published
- Authenticated write access sesuai role
- Storage policies untuk file uploads

### 3. CORS Configuration

Supabase secara default mengizinkan semua origins. Untuk production, pertimbangkan:
- Restrict CORS di Supabase Dashboard (jika diperlukan)
- Atau biarkan default (allow all) untuk kemudahan

## 📝 Post-Deployment Checklist

### Testing

- [ ] **Public Routes:**
  - [ ] Homepage loading dengan benar
  - [ ] Halaman berita dapat diakses
  - [ ] Halaman artikel dapat diakses
  - [ ] Halaman layanan dapat diakses
  - [ ] Detail pages dapat diakses
  - [ ] Search functionality bekerja

- [ ] **Admin Panel:**
  - [ ] Login berhasil
  - [ ] Dashboard dapat diakses
  - [ ] CRUD operations bekerja
  - [ ] File uploads bekerja
  - [ ] Logout berfungsi

- [ ] **Performance:**
  - [ ] Page load time < 3 detik
  - [ ] Images loading dengan baik
  - [ ] No console errors
  - [ ] Mobile responsive

- [ ] **Security:**
  - [ ] HTTPS enabled (otomatis di Vercel)
  - [ ] Environment variables tidak exposed
  - [ ] Admin routes protected

### Monitoring

1. **Vercel Analytics** (Optional)
   - Enable di Vercel Dashboard → Analytics
   - Monitor page views, performance metrics

2. **Error Tracking** (Recommended)
   - Setup Sentry atau error tracking service
   - Monitor production errors

3. **Supabase Monitoring**
   - Monitor API usage di Supabase Dashboard
   - Check storage usage
   - Review database performance

## 🔄 Auto-Deploy Setup

Setelah initial deployment, setiap push ke GitHub akan auto-deploy:

- **Push ke `main` branch** → Deploy ke Production
- **Push ke branch lain** → Deploy ke Preview (dengan unique URL)
- **Pull Request** → Generate preview deployment

### Disable Auto-Deploy (Optional)

Jika ingin manual deploy:
1. Vercel Dashboard → Project Settings → Git
2. Disable "Automatic deployments from Git"

## 🌐 Custom Domain Setup

### Step 1: Add Domain di Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Klik **"Add Domain"**
3. Masukkan domain Anda (contoh: `cms.pemerintahkota.go.id`)
4. Vercel akan memberikan DNS records yang perlu dikonfigurasi

### Step 2: Configure DNS

Di domain registrar Anda, tambahkan DNS records sesuai yang diberikan Vercel:
- **A Record** atau **CNAME Record**
- Biasanya: `CNAME your-domain.com → cname.vercel-dns.com`

### Step 3: SSL Certificate

Vercel akan otomatis:
- Generate SSL certificate (Let's Encrypt)
- Enable HTTPS
- Redirect HTTP ke HTTPS

Tunggu beberapa menit hingga DNS propagate dan SSL certificate aktif.

## 🔧 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Pastikan semua environment variables sudah diset di Vercel Dashboard
- Redeploy setelah menambahkan variables

**Error: Build timeout**
- Check `vite.config.ts` untuk optimasi
- Reduce bundle size jika terlalu besar

### Runtime Errors

**Error: Supabase connection failed**
- Check environment variables di Vercel Dashboard
- Pastikan Supabase project masih aktif
- Check Supabase Dashboard untuk quota limits

**Error: CORS issues**
- Update Supabase redirect URLs
- Check browser console untuk detail error

### Performance Issues

**Slow page load**
- Check bundle size dengan `npm run build -- --analyze`
- Optimize images (compress, lazy load)
- Enable Vercel Edge Caching

## 📚 Best Practices

### 1. Environment Variables

- ✅ **DO:** Set semua variables di Vercel Dashboard
- ✅ **DO:** Gunakan different values untuk Production/Preview jika diperlukan
- ❌ **DON'T:** Commit `.env` files ke Git
- ❌ **DON'T:** Hardcode credentials di code

### 2. Security

- ✅ Enable HTTPS (otomatis di Vercel)
- ✅ Review RLS policies di Supabase
- ✅ Monitor untuk suspicious activities
- ✅ Regular dependency updates

### 3. Performance

- ✅ Monitor bundle size
- ✅ Optimize images
- ✅ Use CDN (otomatis di Vercel)
- ✅ Enable caching headers

### 4. Monitoring

- ✅ Setup error tracking
- ✅ Monitor Supabase usage
- ✅ Track page performance
- ✅ Regular backups

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 📞 Support

Jika mengalami masalah:
1. Check Vercel deployment logs
2. Check browser console untuk errors
3. Review Supabase logs
4. Check GitHub issues atau dokumentasi

---

**Last Updated:** 2024
**Version:** 1.0.0

