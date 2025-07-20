"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Download, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { umkmService, type UMKM } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"
import { useAuth } from "@/lib/auth"

function DataUMKMContent() {
  const [umkm, setUmkm] = useState<UMKM[]>([])
  const [filteredUmkm, setFilteredUmkm] = useState<UMKM[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJenis, setFilterJenis] = useState("semua")
  const [filterStatus, setFilterStatus] = useState("semua")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadUMKM()
  }, [user])

  useEffect(() => {
    let filtered = umkm.filter(
      (u) =>
        u.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.jenis_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.no_hp && u.no_hp.includes(searchTerm)),
    )

    if (filterJenis !== "semua") {
      filtered = filtered.filter((u) => u.jenis_usaha === filterJenis)
    }

    if (filterStatus !== "semua") {
      filtered = filtered.filter((u) => u.status === filterStatus)
    }

    setFilteredUmkm(filtered)
  }, [umkm, searchTerm, filterJenis, filterStatus])

  const loadUMKM = async () => {
    try {
      setLoading(true)

      let data: UMKM[] = []

      if (user?.role === "admin") {
        data = await umkmService.getAll(undefined, user.rw)
      } else {
        data = await umkmService.getAll(user?.id)
      }

      setUmkm(data)
      setFilteredUmkm(data)
    } catch (error) {
      console.error("Error loading UMKM:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data UMKM ini?")) {
      try {
        if (user?.role === "admin") {
          const umkmToDelete = umkm.find((u) => u.id === id)
          if (umkmToDelete?.user_id) {
            await umkmService.delete(id, umkmToDelete.user_id)
          }
        } else {
          await umkmService.delete(id, user?.id || "")
        }
        await loadUMKM()
        alert("Data UMKM berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting UMKM:", error)
        alert("Gagal menghapus data UMKM. Silakan coba lagi.")
      }
    }
  }

  const exportToCSV = () => {
    const headers = ["Nama Usaha", "Pemilik", "Jenis Usaha", "Nomor HP", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredUmkm.map((u) => [u.nama_usaha, u.pemilik, u.jenis_usaha, u.no_hp || "", u.status].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-umkm-${user?.role === "admin" ? `rw-${user.rw}` : "user"}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
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
      <HeaderWithAuth
        title={`Kelola Data UMKM ${user?.role === "admin" ? `RW ${user.rw}` : ""}`}
        description={`Manajemen lengkap data UMKM mikro ${user?.role === "admin" ? `di RW ${user.rw}` : "di wilayah Anda"}`}
      >
        <Button
          variant="outline"
          onClick={exportToCSV}
          className="border-border bg-transparent rounded-lg hover:bg-muted"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 rounded-lg">
          <Link href="/umkm/tambah">
            <Plus className="h-5 w-5 mr-2" />
            Tambah UMKM
          </Link>
        </Button>
      </HeaderWithAuth>

      <NavigationWithAuth />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card shadow-lg border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Daftar UMKM Terdaftar</CardTitle>
            <CardDescription className="text-muted-foreground">
              Kelola dan pantau semua UMKM mikro di wilayah Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama usaha, pemilik, jenis usaha, atau nomor HP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border focus:border-primary focus:ring-primary rounded-lg"
                />
              </div>
              <Select value={filterJenis} onValueChange={setFilterJenis}>
                <SelectTrigger className="w-48 border-border rounded-lg">
                  <SelectValue placeholder="Filter Jenis Usaha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="Kuliner">Kuliner</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Jasa">Jasa</SelectItem>
                  <SelectItem value="Perdagangan">Perdagangan</SelectItem>
                  <SelectItem value="Teknologi">Teknologi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 border-border rounded-lg">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  <SelectItem value="Tutup Sementara">Tutup Sementara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="font-semibold text-foreground">Nama Usaha</TableHead>
                    <TableHead className="font-semibold text-foreground">Pemilik</TableHead>
                    <TableHead className="font-semibold text-foreground">Jenis Usaha</TableHead>
                    <TableHead className="font-semibold text-foreground">Nomor HP</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUmkm.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">Tidak ada data UMKM</p>
                        <p className="text-muted-foreground/80 text-sm mt-1">Mulai dengan mendaftarkan UMKM pertama</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUmkm.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-foreground">{u.nama_usaha}</TableCell>
                        <TableCell className="text-muted-foreground">{u.pemilik}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 rounded-md">
                            {u.jenis_usaha}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.no_hp || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "Aktif"
                                ? "default"
                                : u.status === "Tidak Aktif"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              u.status === "Aktif"
                                ? "bg-green-100 text-green-800 border-green-200 rounded-md"
                                : u.status === "Tidak Aktif"
                                  ? "bg-destructive/10 text-destructive border-destructive/20 rounded-md"
                                  : "bg-muted text-muted-foreground border-border rounded-md"
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-border hover:bg-muted bg-transparent rounded-lg"
                            >
                              <Link href={`/umkm/edit/${u.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(u.id!)}
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

export default function DataUMKM() {
  return (
    <ProtectedRoute>
      <DataUMKMContent />
    </ProtectedRoute>
  )
}
