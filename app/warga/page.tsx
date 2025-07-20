"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Warga {
  id: string
  nama: string
  nik: string
  noKK: string
  alamat: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  pekerjaan: string
  status: string
  agama: string
  pendidikan: string
}

export default function DataWarga() {
  const [warga, setWarga] = useState<Warga[]>([])
  const [filteredWarga, setFilteredWarga] = useState<Warga[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("semua")
  const [filterGender, setFilterGender] = useState("semua")

  useEffect(() => {
    const savedWarga = JSON.parse(localStorage.getItem("warga") || "[]")
    setWarga(savedWarga)
    setFilteredWarga(savedWarga)
  }, [])

  useEffect(() => {
    let filtered = warga.filter(
      (w) =>
        w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.nik.includes(searchTerm) ||
        w.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterStatus !== "semua") {
      filtered = filtered.filter((w) => w.status === filterStatus)
    }

    if (filterGender !== "semua") {
      filtered = filtered.filter((w) => w.jenisKelamin === filterGender)
    }

    setFilteredWarga(filtered)
  }, [warga, searchTerm, filterStatus, filterGender])

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data warga ini?")) {
      const updatedWarga = warga.filter((w) => w.id !== id)
      setWarga(updatedWarga)
      localStorage.setItem("warga", JSON.stringify(updatedWarga))
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Nama",
      "NIK",
      "No KK",
      "Alamat",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Pekerjaan",
      "Status",
      "Agama",
      "Pendidikan",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredWarga.map((w) =>
        [
          w.nama,
          w.nik,
          w.noKK,
          w.alamat,
          w.tempatLahir,
          w.tanggalLahir,
          w.jenisKelamin,
          w.pekerjaan,
          w.status,
          w.agama,
          w.pendidikan,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data-warga.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Warga</h1>
              <p className="text-sm text-muted-foreground">Kelola data warga RT/RW</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="rounded-lg border-border hover:bg-muted bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-lg">
                <Link href="/warga/tambah">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Warga
                </Link>
              </Button>
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
            <Link href="/warga" className="px-3 py-4 text-sm font-medium bg-primary/80">
              Data Warga
            </Link>
            <Link href="/umkm" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
              Data UMKM
            </Link>
            <Link href="/surat" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card shadow-lg border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Daftar Warga</CardTitle>
            <CardDescription className="text-muted-foreground">
              Total {filteredWarga.length} warga terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama, NIK, atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 rounded-lg border-border focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Menikah">Menikah</SelectItem>
                  <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                  <SelectItem value="Cerai">Cerai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterGender} onValueChange={setFilterGender}>
                <SelectTrigger className="w-48 rounded-lg border-border focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Filter Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Gender</SelectItem>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="text-foreground">Nama</TableHead>
                    <TableHead className="text-foreground">NIK</TableHead>
                    <TableHead className="text-foreground">No KK</TableHead>
                    <TableHead className="text-foreground">Alamat</TableHead>
                    <TableHead className="text-foreground">Jenis Kelamin</TableHead>
                    <TableHead className="text-foreground">Pekerjaan</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarga.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada data warga
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWarga.map((w) => (
                      <TableRow key={w.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-foreground">{w.nama}</TableCell>
                        <TableCell className="text-muted-foreground">{w.nik}</TableCell>
                        <TableCell className="text-muted-foreground">{w.noKK}</TableCell>
                        <TableCell className="text-muted-foreground">{w.alamat}</TableCell>
                        <TableCell>
                          <Badge
                            variant={w.jenisKelamin === "Laki-laki" ? "default" : "secondary"}
                            className="rounded-md"
                          >
                            {w.jenisKelamin}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{w.pekerjaan}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-md border-border text-muted-foreground">
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="rounded-lg border-border hover:bg-muted bg-transparent"
                            >
                              <Link href={`/warga/edit/${w.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(w.id)}
                              className="text-destructive hover:text-destructive/90 border-destructive/20 hover:bg-destructive/5 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
