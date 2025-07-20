-- Insert sample admin user
INSERT INTO users (name, username, password, role, rt, rw, is_first_login) VALUES
('Administrator', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '001', '001', false);

-- Get the admin user ID for reference
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
    
    -- Insert sample warga data
    INSERT INTO warga (nama, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, agama, status_perkawinan, pekerjaan, no_hp, user_id) VALUES
    ('Budi Santoso', '3201234567890001', 'Jakarta', '1985-05-15', 'Laki-laki', 'Jl. Merdeka No. 123', '001', '001', 'Islam', 'Menikah', 'Wiraswasta', '081234567890', admin_user_id),
    ('Siti Nurhaliza', '3201234567890002', 'Bandung', '1990-08-20', 'Perempuan', 'Jl. Sudirman No. 456', '002', '001', 'Islam', 'Menikah', 'Guru', '081234567891', admin_user_id),
    ('Ahmad Wijaya', '3201234567890003', 'Surabaya', '1988-12-10', 'Laki-laki', 'Jl. Gatot Subroto No. 789', '001', '002', 'Islam', 'Belum Menikah', 'Pegawai Swasta', '081234567892', admin_user_id);

    -- Insert sample surat data
    INSERT INTO surat (nomor_surat, jenis_surat, nama_pemohon, nik_pemohon, keperluan, status, user_id) VALUES
    ('001/RT001/2024', 'Surat Keterangan Domisili', 'Budi Santoso', '3201234567890001', 'Keperluan administrasi bank', 'selesai', admin_user_id),
    ('002/RT001/2024', 'Surat Keterangan Tidak Mampu', 'Siti Nurhaliza', '3201234567890002', 'Beasiswa anak', 'proses', admin_user_id);

    -- Insert sample keuangan data
    INSERT INTO keuangan (tanggal, jenis, kategori, deskripsi, jumlah, status, user_id) VALUES
    ('2024-01-15', 'pemasukan', 'Iuran Warga', 'Iuran bulanan RT 001', 2500000.00, 'selesai', admin_user_id),
    ('2024-01-20', 'pengeluaran', 'Kebersihan', 'Pembelian alat kebersihan', 500000.00, 'selesai', admin_user_id),
    ('2024-01-25', 'pemasukan', 'Sumbangan', 'Sumbangan dari warga untuk kegiatan 17 Agustus', 1000000.00, 'selesai', admin_user_id);

    -- Insert sample UMKM data
    INSERT INTO umkm (nama_usaha, pemilik, nik_pemilik, no_hp, alamat_usaha, jenis_usaha, kategori_usaha, deskripsi_usaha, produk, kapasitas_produksi, satuan_produksi, modal_awal, target_pendapatan, jumlah_karyawan, user_id) VALUES
    ('Warung Makan Bu Siti', 'Siti Nurhaliza', '3201234567890002', '081234567891', 'Jl. Sudirman No. 456', 'Kuliner', 'Makanan', 'Warung makan rumahan dengan menu masakan Padang', 'Nasi Padang, Rendang, Gulai', 50, 'porsi/hari', 15000000.00, 25000000.00, 2, admin_user_id),
    ('Bengkel Motor Budi', 'Budi Santoso', '3201234567890001', '081234567890', 'Jl. Merdeka No. 123', 'Jasa', 'Otomotif', 'Bengkel servis motor dan mobil', 'Servis motor, ganti oli, tune up', 10, 'unit/hari', 25000000.00, 40000000.00, 3, admin_user_id),
    ('Toko Kelontong Ahmad', 'Ahmad Wijaya', '3201234567890003', '081234567892', 'Jl. Gatot Subroto No. 789', 'Perdagangan', 'Retail', 'Toko kelontong lengkap kebutuhan sehari-hari', 'Sembako, minuman, snack, rokok', 100, 'item/hari', 10000000.00, 18000000.00, 1, admin_user_id);
END $$;
