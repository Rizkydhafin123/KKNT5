-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  rt VARCHAR(10),
  rw VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create UMKM table
CREATE TABLE IF NOT EXISTS umkm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_usaha VARCHAR(200) NOT NULL,
  pemilik VARCHAR(100) NOT NULL,
  nik_pemilik VARCHAR(16),
  no_hp VARCHAR(20),
  alamat_usaha TEXT,
  jenis_usaha VARCHAR(50) NOT NULL,
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_umkm_user_id ON umkm(user_id);
CREATE INDEX IF NOT EXISTS idx_umkm_jenis_usaha ON umkm(jenis_usaha);
CREATE INDEX IF NOT EXISTS idx_umkm_status ON umkm(status);
CREATE INDEX IF NOT EXISTS idx_users_rw ON users(rw);

-- Insert default admin user
INSERT INTO users (id, username, nama_lengkap, role, rt, rw) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin',
  'Administrator RW 01',
  'admin',
  '001',
  '01'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample UMKM data
INSERT INTO umkm (
  nama_usaha, pemilik, jenis_usaha, kategori_usaha, status, 
  modal_awal, rab, jumlah_karyawan, user_id
) VALUES 
(
  'Warung Makan Bu Sari',
  'Sari Dewi',
  'Kuliner',
  'Mikro',
  'Aktif',
  5000000,
  7000000,
  2,
  '550e8400-e29b-41d4-a716-446655440001'
),
(
  'Toko Kelontong Pak Budi',
  'Budi Santoso',
  'Perdagangan',
  'Mikro',
  'Aktif',
  10000000,
  15000000,
  1,
  '550e8400-e29b-41d4-a716-446655440001'
),
(
  'Bengkel Motor Jaya',
  'Ahmad Jaya',
  'Otomotif',
  'Kecil',
  'Aktif',
  25000000,
  30000000,
  3,
  '550e8400-e29b-41d4-a716-446655440001'
) ON CONFLICT DO NOTHING;
