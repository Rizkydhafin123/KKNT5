"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function BuatSurat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jenisFromUrl = searchParams.get("jenis") || ""

  const [warga, setWarga] = useState([])
  const [formData, setFormData] = useState({
    jenis: jenisFromUrl,
    nama: "",
    nik: "",
    alamat: "",
    keperluan: "",
    keterangan: "",
  })

  useEffect(() => {
    const savedWarga = JSON.parse(localStorage.getItem("warga") || "[]")
    setWarga(savedWarga)
  }, [])

  const generateNomorSurat = (jenis: string) => {
    const existingSurat = JSON.parse(localStorage.getItem("surat") || "[]")
    const count = existingSurat.filter((s: any) => s.jenis === jenis).length + 1
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")

    const jenisCode =
      {
        domisili: "DOM",
        skck: "SKCK",
        nikah: "NIK",
        usaha: "USH",
        "izin-usaha": "IU",
      }[jenis] || "SRT"

    return `${String(count).padStart(3, "0")}/${jenisCode}/${month}/${year}`
  }

  const handleWargaSelect = (selectedNik: string) => {
    const selectedWarga = warga.find((w: any) => w.nik === selectedNik)
    if (selectedWarga) {
      setFormData((prev) => ({
        ...prev,
        nama: (selectedWarga as any).nama,
        nik: (selectedWarga as any).nik,
        alamat: (selectedWarga as any).alamat,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.jenis || !formData.nama || !formData.keperluan) {
      alert("Jenis surat, nama, dan keperluan harus diisi!")
      return
    }

    const nomorSurat = generateNomorSurat(formData.jenis)
    const newSurat = {
      id: Date.now().toString(),
      nomor: nomorSurat,
      jenis: formData.jenis,
      nama: formData.nama,
      nik: formData.nik,
      alamat: formData.alamat,
      keperluan: formData.keperluan,
      keterangan: formData.keterangan,
      tanggal: new Date().toISOString(),
      status: "selesai",
    }

    const existingSurat = JSON.parse(localStorage.getItem("surat") || "[]")
    const updatedSurat = [...existingSurat, newSurat]
    localStorage.setItem("surat", JSON.stringify(updatedSurat))

    alert(`Surat berhasil dibuat dengan nomor: ${nomorSurat}`)
    router.push("/surat")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4 rounded-lg hover:bg-muted">
                <Link href="/surat">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Buat Surat Baru</h1>
                <p className="text-sm text-muted-foreground">Buat surat pengantar atau keterangan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Dashboard
            </Link>
            <Link href="/warga" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Data Warga
            </Link>
            <Link href="/umkm" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Data UMKM
            </Link>
            <Link href="/surat" className="px-3 py-4 text-sm font-medium bg-primary/80">
              Surat-Menyurat
            </Link>
            <Link href="/laporan" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Laporan
            </Link>
            <Link href="/keuangan" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Keuangan
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card shadow-lg border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <FileText className="h-5 w-5 mr-2" />
              Form Pembuatan Surat
            </CardTitle>
            <CardDescription className="text-muted-foreground">Lengkapi informasi untuk membuat surat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jenis" className="text-foreground">
                    Jenis Surat *
                  </Label>
                  <Select value={formData.jenis} onValueChange={(value) => handleChange("jenis", value)}>
                    <SelectTrigger className="rounded-lg border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domisili">Surat Keterangan Domisili</SelectItem>
                      <SelectItem value="skck">Surat Pengantar SKCK</SelectItem>
                      <SelectItem value="nikah">Surat Pengantar Nikah</SelectItem>
                      <SelectItem value="usaha">Surat Pengantar Usaha</SelectItem>
                      <SelectItem value="izin-usaha">Surat Keterangan Izin Usaha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warga" className="text-foreground">
                    Pilih Warga (Opsional)
                  </Label>
                  <Select onValueChange={handleWargaSelect}>
                    <SelectTrigger className="rounded-lg border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Pilih dari data warga" />
                    </SelectTrigger>
                    <SelectContent>
                      {warga.map((w: any) => (
                        <SelectItem key={w.id} value={w.nik}>
                          {w.nama} - {w.nik}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-foreground">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="rounded-lg border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik" className="text-foreground">
                    NIK
                  </Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleChange("nik", e.target.value)}
                    placeholder="Masukkan NIK"
                    className="rounded-lg border-border focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-foreground">
                  Alamat
                </Label>
                <Input
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  className="rounded-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keperluan" className="text-foreground">
                  Keperluan *
                </Label>
                <Input
                  id="keperluan"
                  value={formData.keperluan}
                  onChange={(e) => handleChange("keperluan", e.target.value)}
                  placeholder="Masukkan keperluan surat"
                  required
                  className="rounded-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan" className="text-foreground">
                  Keterangan Tambahan
                </Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => handleChange("keterangan", e.target.value)}
                  placeholder="Masukkan keterangan tambahan jika diperlukan"
                  className="min-h-[100px] rounded-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="rounded-lg border-border hover:bg-muted bg-transparent"
                >
                  <Link href="/surat">Batal</Link>
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-lg">
                  <Save className="h-4 w-4 mr-2" />
                  Buat Surat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
