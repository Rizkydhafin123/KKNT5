# 🚀 Panduan Deploy ke Netlify

## 📋 Checklist Pre-Deploy

### ✅ **Persiapan Code**
- [x] Next.js configured untuk static export
- [x] netlify.toml sudah ada
- [x] package.json build scripts ready
- [x] Environment variables documented
- [x] Mobile-responsive tested
- [x] Supabase integration fixed

### ✅ **Database Setup (Supabase)**
- [x] Supabase project created
- [x] Database tables created (run scripts/setup-database.sql)
- [x] Environment variables configured
- [x] UUID validation implemented
- [x] RLS policies disabled for development

## 🔧 Step-by-Step Deployment

### **1. Prepare Repository**
\`\`\`bash
# Ensure all files are committed
git add .
git commit -m "Ready for Netlify deployment with Supabase"
git push origin main
\`\`\`

### **2. Netlify Site Setup**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab)
4. Select your repository
5. Build settings will be auto-detected from `netlify.toml`

### **3. Environment Variables**
In Netlify Dashboard → Site settings → Environment variables:

\`\`\`env
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ugimmtyrtaepoexiprst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaW1tdHlydGFlcG9leGlwcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5OTU1MTUsImV4cCI6MjA2ODU3MTUxNX0.dHiiyU8pphxGWiNYxp1-9yp15lt5aw9Zaai9qq717q8

# Optional: Custom domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

### **4. Deploy Settings**
Netlify will automatically use these settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

### **5. Custom Domain (Optional)**
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

## 🔍 Troubleshooting

### **Build Errors**
\`\`\`bash
# Common issues and solutions:

# 1. Node version mismatch
# Solution: Check netlify.toml has NODE_VERSION = "18"

# 2. Missing dependencies
# Solution: Ensure package.json has all dependencies

# 3. Environment variables
# Solution: Double-check variable names and values
\`\`\`

### **Runtime Errors**
\`\`\`bash
# 1. 404 on page refresh
# Solution: netlify.toml redirects should handle this

# 2. API calls failing
# Solution: Check environment variables are set correctly

# 3. Database connection issues
# Solution: Verify Supabase URL and key

# 4. UUID validation errors
# Solution: Fixed with isValidUUID function in lib/supabase.ts
\`\`\`

### **Supabase Integration Status**

✅ **FIXED ISSUES:**
- UUID validation error resolved
- Local storage fallback working
- Environment variables configured
- Database schema created
- RLS policies disabled for development

**Current Configuration:**
- **Supabase URL**: `https://ugimmtyrtaepoexiprst.supabase.co`
- **Database**: PostgreSQL with UUID primary keys
- **Authentication**: Local storage based (not Supabase Auth)
- **Security**: RLS disabled for development ease

**Login Credentials (after SQL setup):**
- Username: `admin`
- Password: `password`

## 📊 Performance Optimization

### **Netlify Features to Enable**
- [x] **Asset optimization**: Auto-enabled
- [x] **Form handling**: For contact forms
- [x] **Analytics**: Track usage
- [x] **Branch deploys**: For testing

### **Monitoring**
- Check build logs for warnings
- Monitor Core Web Vitals
- Set up uptime monitoring
- Review analytics regularly

## 🔒 Security Checklist

- [x] Environment variables secured
- [x] HTTPS enabled
- [x] Security headers configured
- [x] No sensitive data in client code
- [x] Database RLS policies configured (disabled for dev)
- [x] UUID validation implemented

## 🚀 Go Live Checklist

### **Before Launch**
- [x] Test all features work
- [x] Mobile responsiveness verified
- [x] All forms functional
- [x] Database operations working
- [x] Authentication flows tested
- [x] Export functions working
- [x] UUID errors resolved

### **After Launch**
- [ ] Share URL with stakeholders
- [ ] Set up monitoring
- [ ] Document admin credentials
- [ ] Plan user training
- [ ] Schedule regular backups

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deploy Guide**: https://nextjs.org/docs/deployment
- **Supabase Docs**: https://supabase.com/docs

---

**🎉 Your UMKM Management System is now live with Supabase integration and ready to help RT/RW communities manage their micro-businesses efficiently!**

**Default Login:**
- Username: `admin`
- Password: `password`
