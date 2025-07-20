"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { umkmService, type UMKM } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"
import { useAuth } from "@/lib/auth"

function EditUMKMContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState<Partial<UMKM>>({})

  useEffect(() => {
    if (params.id && user) {
      loadUMKMData()
    }
  }, [params.id, user])

  const loadUMKMData = async () => {
    try {
      setLoadingData(true)
      const id = params.id as string
      const data = await umkmService.getById(id, user?.role === "admin" ? undefined : user?.id)

      if (!data) {
        alert("Data UMKM tidak ditemukan atau Anda tidak memiliki akses")
        router.push("/umkm")
        return
      }

      setFormData(data)
    } catch (error) {
      console.error("Error loading UMKM:", error)
      alert("Gagal memuat data UMKM")
      router.push("/umkm")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nama_usaha || !formData.pemilik || !formData.jenis_usaha) {
      alert("Nama usaha, pemilik, dan jenis usaha harus diisi!")
      return
    }

    try {
      setLoading(true)
      const id = params.id as string

      const updateData = {
        nama_usaha: formData.nama_usaha!,
        pemilik: formData.pemilik!,
        nik_pemilik: formData.nik_pemilik || undefined,
        alamat_usaha: formData.alamat_usaha || undefined,
        jenis_usaha: formData.jenis_usaha!,
        kategori_usaha: formData.kategori_usaha || undefined,
        deskripsi_usaha: formData.deskripsi_usaha || undefined,
        kapasitas_produksi: Number.parseInt(formData.kapasitas_produksi?.toString() || "0") || 0,
        satuan_produksi: formData.satuan_produksi || undefined,
        periode_operasi: Number.parseInt(formData.periode_operasi?.toString() || "0") || 0,
        satuan_periode: formData.satuan_periode || "bulan",
        hari_kerja_per_minggu: Number.parseInt(formData.hari_kerja_per_minggu?.toString() || "0") || 0,
        total_produksi: Number.parseInt(formData.total_produksi?.toString() || "0") || 0,
        rab: Number.parseInt(formData.rab?.toString() || "0") || 0,
        biaya_tetap: Number.parseInt(formData.biaya_tetap?.toString() || "0") || 0,
        biaya_variabel: Number.parseInt(formData.biaya_variabel?.toString() || "0") || 0,
        modal_awal: Number.parseInt(formData.modal_awal?.toString() || "0") || 0,
        target_pendapatan: Number.parseInt(formData.target_pendapatan?.toString() || "0") || 0,
        jumlah_karyawan: Number.parseInt(formData.jumlah_karyawan?.toString() || "0") || 0,
        status: formData.status!,
      }

      await umkmService.update(id, updateData, user?.role === "admin" ? formData.user_id! : user!.id)
      alert("Data UMKM berhasil diperbarui!")
      router.push("/umkm")
    } catch (error) {
      console.error("Error updating UMKM:", error)
      alert("Gagal memperbarui data UMKM. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data UMKM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <HeaderWithAuth title="Edit Data UMKM" description="Perbarui informasi UMKM">
        <Button variant="outline" asChild className="rounded-lg border-border hover:bg-muted bg-transparent">
          <Link href="/umkm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </HeaderWithAuth>

      <NavigationWithAuth />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card shadow-lg border border-border rounded-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-xl">
            <CardTitle className="flex items-center text-xl">
              <Building2 className="h-6 w-6 mr-3" />
              Edit Data UMKM: {formData.nama_usaha}
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Perbarui informasi UMKM sesuai kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold text-foreground">Identitas Usaha</h3>
                  <p className="text-muted-foreground mt-1">Informasi dasar tentang usaha</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama_usaha" className="text-sm font-medium text-foreground">
                      Nama Usaha *
                    </Label>
                    <Input
                      id="nama_usaha"
                      value={formData.nama_usaha || ""}
                      onChange={(e) => handleChange("nama_usaha", e.target.value)}
                      placeholder="Contoh: Warung Makan Bu Sari"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pemilik" className="text-sm font-medium text-foreground">
                      Nama Pemilik *
                    </Label>
                    <Input
                      id="pemilik"
                      value={formData.pemilik || ""}
                      onChange={(e) => handleChange("pemilik", e.target.value)}
                      placeholder="Nama lengkap pemilik usaha"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nik_pemilik" className="text-sm font-medium text-foreground">
                      NIK Pemilik
                    </Label>
                    <Input
                      id="nik_pemilik"
                      value={formData.nik_pemilik || ""}
                      onChange={(e) => handleChange("nik_pemilik", e.target.value)}
                      placeholder="16 digit NIK"
                      maxLength={16}
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jenis_usaha" className="text-sm font-medium text-foreground">
                      Jenis Usaha *
                    </Label>
                    <Select
                      value={formData.jenis_usaha || ""}
                      onValueChange={(value) => handleChange("jenis_usaha", value)}
                    >
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Pilih jenis usaha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kuliner">Kuliner</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                        <SelectItem value="Jasa">Jasa</SelectItem>
                        <SelectItem value="Perdagangan">Perdagangan</SelectItem>
                        <SelectItem value="Teknologi">Teknologi</SelectItem>
                        <SelectItem value="Pertanian">Pertanian</SelectItem>
                        <SelectItem value="Otomotif">Otomotif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alamat_usaha" className="text-sm font-medium text-foreground">
                      Alamat Usaha
                    </Label>
                    <Textarea
                      id="alamat_usaha"
                      value={formData.alamat_usaha || ""}
                      onChange={(e) => handleChange("alamat_usaha", e.target.value)}
                      placeholder="Alamat lengkap lokasi usaha"
                      className="min-h-[80px] border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold text-foreground">Kategori dan Deskripsi</h3>
                  <p className="text-muted-foreground mt-1">Detail tentang jenis dan skala usaha</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="kategori_usaha" className="text-sm font-medium text-foreground">
                      Kategori Usaha
                    </Label>
                    <Select
                      value={formData.kategori_usaha || ""}
                      onValueChange={(value) => handleChange("kategori_usaha", value)}
                    >
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Pilih kategori usaha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mikro">Mikro</SelectItem>
                        <SelectItem value="Kecil">Kecil</SelectItem>
                        <SelectItem value="Menengah">Menengah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-foreground">
                      Status Operasional
                    </Label>
                    <Select value={formData.status || ""} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                        <SelectItem value="Tutup Sementara">Tutup Sementara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="deskripsi_usaha" className="text-sm font-medium text-foreground">
                      Deskripsi Usaha
                    </Label>
                    <Textarea
                      id="deskripsi_usaha"
                      value={formData.deskripsi_usaha || ""}
                      onChange={(e) => handleChange("deskripsi_usaha", e.target.value)}
                      placeholder="Jelaskan produk/jasa yang ditawarkan, target pasar, dll"
                      className="min-h-[100px] border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-semibold text-foreground">Kapasitas dan Operasional</h3>
                  <p className="text-muted-foreground mt-1">Data produksi dan operasional usaha</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="kapasitas_produksi" className="text-sm font-medium text-foreground">
                      Kapasitas Produksi
                    </Label>
                    <Input
                      id="kapasitas_produksi"
                      type="number"
                      value={formData.kapasitas_produksi || ""}
                      onChange={(e) => handleChange("kapasitas_produksi", e.target.value)}
                      placeholder="Jumlah"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="satuan_produksi" className="text-sm font-medium text-foreground">
                      Satuan Produksi
                    </Label>
                    <Select
                      value={formData.satuan_produksi || ""}
                      onValueChange={(value) => handleChange("satuan_produksi", value)}
                    >
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="porsi">Porsi</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="paket">Paket</SelectItem>
                        <SelectItem value="layanan">Layanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_produksi" className="text-sm font-medium text-foreground">
                      Total Produksi per Periode
                    </Label>
                    <Input
                      id="total_produksi"
                      type="number"
                      value={formData.total_produksi || ""}
                      onChange={(e) => handleChange("total_produksi", e.target.value)}
                      placeholder="Total produksi"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periode_operasi" className="text-sm font-medium text-foreground">
                      Periode Operasi
                    </Label>
                    <Input
                      id="periode_operasi"
                      type="number"
                      value={formData.periode_operasi || ""}
                      onChange={(e) => handleChange("periode_operasi", e.target.value)}
                      placeholder="Jumlah periode"
                      min="1"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="satuan_periode" className="text-sm font-medium text-foreground">
                      Satuan Periode
                    </Label>
                    <Select
                      value={formData.satuan_periode || "bulan"}
                      onValueChange={(value) => handleChange("satuan_periode", value)}
                    >
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Pilih satuan periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hari">Hari</SelectItem>
                        <SelectItem value="minggu">Minggu</SelectItem>
                        <SelectItem value="bulan">Bulan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hari_kerja_per_minggu" className="text-sm font-medium text-foreground">
                      Hari Kerja per Minggu
                    </Label>
                    <Input
                      id="hari_kerja_per_minggu"
                      type="number"
                      value={formData.hari_kerja_per_minggu || ""}
                      onChange={(e) => handleChange("hari_kerja_per_minggu", e.target.value)}
                      placeholder="Jumlah hari"
                      min="1"
                      max="7"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-xl font-semibold text-foreground">Rencana Anggaran dan Biaya</h3>
                  <p className="text-muted-foreground mt-1">Informasi keuangan dan perencanaan usaha</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rab" className="text-sm font-medium text-foreground">
                      RAB (Rencana Anggaran Biaya)
                    </Label>
                    <Input
                      id="rab"
                      type="number"
                      value={formData.rab || ""}
                      onChange={(e) => handleChange("rab", e.target.value)}
                      placeholder="Total anggaran dalam Rupiah"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal_awal" className="text-sm font-medium text-foreground">
                      Modal Awal
                    </Label>
                    <Input
                      id="modal_awal"
                      type="number"
                      value={formData.modal_awal || ""}
                      onChange={(e) => handleChange("modal_awal", e.target.value)}
                      placeholder="Modal awal usaha"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biaya_tetap" className="text-sm font-medium text-foreground">
                      Biaya Tetap per Bulan
                    </Label>
                    <Input
                      id="biaya_tetap"
                      type="number"
                      value={formData.biaya_tetap || ""}
                      onChange={(e) => handleChange("biaya_tetap", e.target.value)}
                      placeholder="Sewa, listrik, gaji tetap, dll"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biaya_variabel" className="text-sm font-medium text-foreground">
                      Biaya Variabel per Unit
                    </Label>
                    <Input
                      id="biaya_variabel"
                      type="number"
                      value={formData.biaya_variabel || ""}
                      onChange={(e) => handleChange("biaya_variabel", e.target.value)}
                      placeholder="Bahan baku, kemasan, dll"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_pendapatan" className="text-sm font-medium text-foreground">
                      Target Pendapatan per Bulan
                    </Label>
                    <Input
                      id="target_pendapatan"
                      type="number"
                      value={formData.target_pendapatan || ""}
                      onChange={(e) => handleChange("target_pendapatan", e.target.value)}
                      placeholder="Target pendapatan bulanan"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jumlah_karyawan" className="text-sm font-medium text-foreground">
                      Jumlah Karyawan
                    </Label>
                    <Input
                      id="jumlah_karyawan"
                      type="number"
                      value={formData.jumlah_karyawan || ""}
                      onChange={(e) => handleChange("jumlah_karyawan", e.target.value)}
                      placeholder="Jumlah karyawan"
                      min="0"
                      className="border-border focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="px-8 py-2 border-border hover:bg-muted bg-transparent rounded-lg"
                  disabled={loading}
                >
                  <Link href="/umkm">Batal</Link>
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-2 bg-primary hover:bg-primary/90 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function EditUMKMClient() {
  return (
    <ProtectedRoute>
      <EditUMKMContent />
    </ProtectedRoute>
  )
}
