# 🏘️ Sistem Pendataan UMKM RT/RW

Platform digital untuk pendataan dan manajemen UMKM mikro di tingkat RT/RW dengan fitur lengkap dan user-friendly.

## ✨ Fitur Utama

### 👥 **Multi-User System**
- **Admin RW**: Kelola semua UMKM di wilayah RW
- **User Warga**: Kelola UMKM pribadi
- **Authentication**: Login/Register dengan role-based access

### 📊 **Manajemen UMKM**
- ✅ Pendaftaran UMKM lengkap dengan 25+ field data
- ✅ Edit dan update data UMKM
- ✅ Filter dan pencarian advanced
- ✅ Export data ke CSV
- ✅ Status tracking (Aktif/Tidak Aktif/Tutup Sementara)

### 📈 **Dashboard & Laporan**
- ✅ Dashboard interaktif dengan statistik real-time
- ✅ Grafik distribusi jenis usaha
- ✅ Analisis keuangan dan modal
- ✅ Laporan penyerapan tenaga kerja
- ✅ Export laporan lengkap

### 🔒 **Keamanan**
- ✅ Role-based access control
- ✅ Data isolation per RW
- ✅ Password change functionality
- ✅ Secure authentication

### 📱 **Mobile-Friendly**
- ✅ Responsive design untuk semua device
- ✅ Touch-optimized interface
- ✅ Mobile-first approach

## 🚀 Deploy ke Netlify

### **Langkah 1: Persiapan Repository**
\`\`\`bash
# Clone atau fork repository ini
git clone <your-repo-url>
cd rt-rw-umkm-system

# Install dependencies
npm install
\`\`\`

### **Langkah 2: Setup Environment Variables di Netlify**
1. Masuk ke [Netlify Dashboard](https://app.netlify.com)
2. Pilih site Anda
3. Go to **Site settings** → **Environment variables**
4. Tambahkan variables berikut:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### **Langkah 3: Deploy**

#### **Option A: Deploy via Git (Recommended)**
1. Push code ke GitHub/GitLab
2. Connect repository di Netlify
3. Build settings akan otomatis terdeteksi dari `netlify.toml`
4. Deploy otomatis setiap push ke main branch

#### **Option B: Manual Deploy**
\`\`\`bash
# Build untuk production
npm run build

# Deploy ke Netlify (install netlify-cli dulu)
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=out
\`\`\`

### **Langkah 4: Setup Database (Optional)**
Jika menggunakan Supabase:
1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL script dari folder `/scripts`
3. Update environment variables di Netlify

## 🛠️ Development

### **Local Development**
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

### **Build & Test**
\`\`\`bash
# Build for production
npm run build

# Test production build locally
npm run start
\`\`\`

## 📋 Default Login

### **Admin Accounts**
- **Username**: `admin`
- **Password**: `admin`
- **RW**: Pilih RW 01 atau RW 04 saat login

### **User Registration**
- Daftar akun baru melalui form registrasi
- Pilih RW sesuai wilayah
- Role otomatis sebagai "user"

## 🏗️ Teknologi

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (optional) + LocalStorage fallback
- **Authentication**: Custom auth system
- **Icons**: Lucide React
- **Deployment**: Netlify (Static Export)

## 📁 Struktur Project

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── umkm/              # UMKM management
│   ├── laporan/           # Reports & analytics
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── forms/            # Form components
├── lib/                  # Utilities & services
│   ├── auth.ts           # Authentication logic
│   ├── supabase.ts       # Database service
│   └── utils.ts          # Helper functions
├── scripts/              # Database scripts
├── netlify.toml          # Netlify configuration
└── next.config.mjs       # Next.js configuration
\`\`\`

## 🎯 Fitur Mendatang

- [ ] Notifikasi real-time
- [ ] Bulk operations
- [ ] Data visualization charts
- [ ] PDF report generation
- [ ] WhatsApp integration
- [ ] Backup & restore

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- 📧 Email: support@example.com
- 💬 WhatsApp: +62xxx-xxxx-xxxx
- 📖 Documentation: [Link ke docs]

## 📄 License

© 2024 Sistem Pendataan UMKM RT/RW. All rights reserved.

---

**🚀 Ready to deploy? Follow the steps above and your UMKM management system will be live in minutes!**
