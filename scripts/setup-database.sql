-- Create UMKM table
CREATE TABLE IF NOT EXISTS umkm (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha VARCHAR(255) NOT NULL,
  pemilik VARCHAR(255) NOT NULL,
  nik_pemilik VARCHAR(16),
  no_hp VARCHAR(20),
  alamat_usaha TEXT,
  jenis_usaha VARCHAR(100) NOT NULL,
  kategori_usaha VARCHAR(50),
  deskripsi_usaha TEXT,
  produk TEXT,
  kapasitas_produksi INTEGER DEFAULT 0,
  satuan_produksi VARCHAR(50),
  periode_operasi INTEGER DEFAULT 0,
  satuan_periode VARCHAR(20) DEFAULT 'bulan',
  hari_kerja_per_minggu INTEGER DEFAULT 0,
  total_produksi INTEGER DEFAULT 0,
  rab BIGINT DEFAULT 0,
  biaya_tetap BIGINT DEFAULT 0,
  biaya_variabel BIGINT DEFAULT 0,
  modal_awal BIGINT DEFAULT 0,
  target_pendapatan BIGINT DEFAULT 0,
  jumlah_karyawan INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Aktif',
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_umkm_jenis_usaha ON umkm(jenis_usaha);
CREATE INDEX IF NOT EXISTS idx_umkm_status ON umkm(status);
CREATE INDEX IF NOT EXISTS idx_umkm_created_at ON umkm(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on umkm" ON umkm
  FOR ALL USING (true);

-- Insert some sample data (optional)
INSERT INTO umkm (
  nama_usaha, 
  pemilik, 
  nik_pemilik,
  no_hp,
  alamat_usaha, 
  jenis_usaha, 
  kategori_usaha, 
  deskripsi_usaha,
  produk,
  kapasitas_produksi,
  satuan_produksi,
  rab,
  modal_awal,
  jumlah_karyawan,
  status
) VALUES 
(
  'Warung Makan Bu Sari', 
  'Sari Dewi', 
  '3201234567890123',
  '081234567890',
  'Jl. Mawar No. 15, RT 02/RW 05', 
  'Kuliner', 
  'Mikro', 
  'Warung makan yang menyediakan nasi gudeg, soto, dan makanan tradisional lainnya',
  'Nasi Gudeg, Soto Ayam, Gado-gado',
  50,
  'porsi',
  15000000,
  10000000,
  2,
  'Aktif'
),
(
  'Konveksi Mandiri', 
  'Budi Santoso', 
  '3201234567890124',
  '081234567891',
  'Jl. Melati No. 8, RT 03/RW 05', 
  'Fashion', 
  'Kecil', 
  'Produksi kaos, seragam sekolah, dan pakaian custom',
  'Kaos, Seragam Sekolah, Pakaian Custom',
  100,
  'pcs',
  25000000,
  20000000,
  5,
  'Aktif'
);
