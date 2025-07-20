"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Keuangan {
  id: string
  tanggal: string
  jenis: "pemasukan" | "pengeluaran"
  kategori: string
  keterangan: string
  jumlah: number
}

export default function Keuangan() {
  const [keuangan, setKeuangan] = useState<Keuangan[]>([])
  const [filteredKeuangan, setFilteredKeuangan] = useState<Keuangan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJenis, setFilterJenis] = useState("semua")
  const [stats, setStats] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
  })

  useEffect(() => {
    const savedKeuangan = JSON.parse(localStorage.getItem("keuangan") || "[]")
    setKeuangan(savedKeuangan)
    setFilteredKeuangan(savedKeuangan)

    const totalPemasukan = savedKeuangan
      .filter((k: Keuangan) => k.jenis === "pemasukan")
      .reduce((sum: number, k: Keuangan) => sum + k.jumlah, 0)

    const totalPengeluaran = savedKeuangan
      .filter((k: Keuangan) => k.jenis === "pengeluaran")
      .reduce((sum: number, k: Keuangan) => sum + k.jumlah, 0)

    setStats({
      totalPemasukan,
      totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran,
    })
  }, [])

  useEffect(() => {
    let filtered = keuangan.filter(
      (k) =>
        k.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.kategori.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterJenis !== "semua") {
      filtered = filtered.filter((k) => k.jenis === filterJenis)
    }

    setFilteredKeuangan(filtered)
  }, [keuangan, searchTerm, filterJenis])

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data keuangan ini?")) {
      const updatedKeuangan = keuangan.filter((k) => k.id !== id)
      setKeuangan(updatedKeuangan)
      localStorage.setItem("keuangan", JSON.stringify(updatedKeuangan))

      const totalPemasukan = updatedKeuangan
        .filter((k: Keuangan) => k.jenis === "pemasukan")
        .reduce((sum: number, k: Keuangan) => sum + k.jumlah, 0)

      const totalPengeluaran = updatedKeuangan
        .filter((k: Keuangan) => k.jenis === "pengeluaran")
        .reduce((sum: number, k: Keuangan) => sum + k.jumlah, 0)

      setStats({
        totalPemasukan,
        totalPengeluaran,
        saldo: totalPemasukan - totalPengeluaran,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manajemen Keuangan</h1>
              <p className="text-sm text-muted-foreground">Kelola pemasukan dan pengeluaran RT/RW</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-lg">
                <Link href="/keuangan/tambah">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Transaksi
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
            <Link href="/warga" className="px-3 py-4 text-sm font-medium hover:bg-primary/80">
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
            <Link href="/keuangan" className="px-3 py-4 text-sm font-medium bg-primary/80">
              Keuangan
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card shadow-lg border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Rp {stats.totalPemasukan.toLocaleString("id-ID")}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                Rp {stats.totalPengeluaran.toLocaleString("id-ID")}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.saldo >= 0 ? "text-primary" : "text-destructive"}`}>
                Rp {stats.saldo.toLocaleString("id-ID")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card shadow-lg border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Riwayat Transaksi</CardTitle>
            <CardDescription className="text-muted-foreground">
              Total {filteredKeuangan.length} transaksi tercatat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari keterangan atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>
              <Select value={filterJenis} onValueChange={setFilterJenis}>
                <SelectTrigger className="w-48 rounded-lg border-border focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Filter Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="text-foreground">Tanggal</TableHead>
                    <TableHead className="text-foreground">Jenis</TableHead>
                    <TableHead className="text-foreground">Kategori</TableHead>
                    <TableHead className="text-foreground">Keterangan</TableHead>
                    <TableHead className="text-right text-foreground">Jumlah</TableHead>
                    <TableHead className="text-foreground">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeuangan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Belum ada transaksi keuangan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKeuangan.map((k) => (
                      <TableRow key={k.id} className="hover:bg-muted/50">
                        <TableCell className="text-muted-foreground">
                          {new Date(k.tanggal).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={k.jenis === "pemasukan" ? "default" : "destructive"} className="rounded-md">
                            {k.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{k.kategori}</TableCell>
                        <TableCell className="text-muted-foreground">{k.keterangan}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${k.jenis === "pemasukan" ? "text-green-600" : "text-destructive"}`}
                        >
                          {k.jenis === "pemasukan" ? "+" : "-"}Rp {k.jumlah.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(k.id)}
                            className="text-destructive hover:text-destructive/90 border-destructive/20 hover:bg-destructive/5 rounded-lg"
                          >
                            Hapus
                          </Button>
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
