"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, TrendingUp, Users, DollarSign, BarChart3, PieChart, Loader2 } from "lucide-react"
import Link from "next/link"
import { umkmService, hasSupabase, type UMKM } from "@/lib/supabase"
import { MigrationBanner } from "@/components/migration-banner"
import { DebugPanel } from "@/components/debug-panel"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"
import { useAuth } from "@/lib/auth"

const getRWFromUMKM = (umkm: UMKM): string | null => {
  if (umkm.user_id) {
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]")
    const user = users.find((u: any) => u.id === umkm.user_id)
    return user?.rw || null
  }
  return null
}

function DashboardContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUMKM: 0,
    umkmAktif: 0,
    umkmTidakAktif: 0,
    totalRAB: 0,
    totalModal: 0,
    totalKaryawan: 0,
    jenisUsahaStats: {} as Record<string, number>,
    kategoriStats: {} as Record<string, number>,
    recentUMKM: [] as UMKM[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [user])

  const loadStats = async () => {
    try {
      setLoading(true)

      let umkm: UMKM[] = []

      if (user?.role === "admin") {
        umkm = await umkmService.getAll(undefined, user.rw)
      } else {
        umkm = await umkmService.getAll(user?.id)
      }

      const umkmAktif = umkm.filter((u) => u.status === "Aktif").length
      const umkmTidakAktif = umkm.filter((u) => u.status !== "Aktif").length
      const totalRAB = umkm.reduce((sum, u) => sum + (u.rab || 0), 0)
      const totalModal = umkm.reduce((sum, u) => sum + (u.modal_awal || 0), 0)
      const totalKaryawan = umkm.reduce((sum, u) => sum + (u.jumlah_karyawan || 0), 0)

      const jenisUsahaStats = umkm.reduce((acc: Record<string, number>, u) => {
        if (u.jenis_usaha) {
          acc[u.jenis_usaha] = (acc[u.jenis_usaha] || 0) + 1
        }
        return acc
      }, {})

      const kategoriStats = umkm.reduce((acc: Record<string, number>, u) => {
        if (u.kategori_usaha) {
          acc[u.kategori_usaha] = (acc[u.kategori_usaha] || 0) + 1
        }
        return acc
      }, {})

      const recentUMKM = umkm.slice(0, 5)

      setStats({
        totalUMKM: umkm.length,
        umkmAktif,
        umkmTidakAktif,
        totalRAB,
        totalModal,
        totalKaryawan,
        jenisUsahaStats,
        kategoriStats,
        recentUMKM,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
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
      <MigrationBanner />
      <DebugPanel />

      <HeaderWithAuth
        title={`Sistem Pendataan UMKM ${user?.role === "admin" ? `RW ${user.rw}` : ""}`}
        description={`Dashboard ${user?.role === "admin" ? `Admin RW ${user.rw}` : "User"} - Kelola UMKM Mikro di Wilayah Anda`}
      >
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 rounded-lg">
          <Link href="/umkm/tambah">
            <Plus className="h-5 w-5 mr-2" />
            Daftarkan UMKM Baru
          </Link>
        </Button>
      </HeaderWithAuth>

      <NavigationWithAuth />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Status:</span>
              {!hasSupabase ? (
                <span className="text-orange-600">⚠️ Mode offline - Data hanya tersimpan di device ini</span>
              ) : (
                <span className="text-green-600">✅ Mode online - Data tersinkron ke semua device</span>
              )}
              {user?.role === "admin" && <span className="text-primary">🏘️ Mengelola RW {user.rw}</span>}
            </div>
            <div className="text-muted-foreground">
              Login sebagai: <span className="font-medium text-foreground">{user?.name}</span> ({user?.role})
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}!</h2>
                <p className="text-primary-foreground/90 text-lg">
                  {user?.role === "admin"
                    ? `Kelola dan pantau perkembangan UMKM mikro di RW ${user.rw} dengan mudah`
                    : "Pantau dan kelola data UMKM di wilayah RT/RW Anda"}
                </p>
                {user?.role === "admin" && (
                  <p className="text-primary-foreground/70 text-sm mt-2">
                    📊 Dashboard khusus untuk wilayah RW {user.rw} - Data UMKM yang ditampilkan hanya dari warga RW{" "}
                    {user.rw}
                  </p>
                )}
                {hasSupabase ? (
                  <p className="text-primary-foreground/70 text-sm mt-2">
                    💾 Data tersimpan secara online dan dapat diakses dari semua perangkat
                  </p>
                ) : (
                  <p className="text-orange-200 text-sm mt-2">
                    📱 Mode offline - Setup database untuk sinkronisasi multi-device
                  </p>
                )}
              </div>
              <div className="hidden md:block">
                <Building2 className="h-24 w-24 text-primary-foreground/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total UMKM {user?.role === "admin" ? `RW ${user.rw}` : ""}
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalUMKM}</div>
              <p className="text-sm text-muted-foreground mt-1">Usaha terdaftar</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">UMKM Aktif</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.umkmAktif}</div>
              <p className="text-sm text-muted-foreground mt-1">Beroperasi aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Modal</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalModal > 0 ? `${(stats.totalModal / 1000000).toFixed(1)}M` : "0"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Rupiah investasi</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Penyerapan Tenaga Kerja</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalKaryawan}</div>
              <p className="text-sm text-muted-foreground mt-1">Orang bekerja</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-card shadow-lg border border-border rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Distribusi Jenis Usaha {user?.role === "admin" ? `RW ${user.rw}` : ""}
              </CardTitle>
              <CardDescription className="text-muted-foreground">Sebaran UMKM berdasarkan jenis usaha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.jenisUsahaStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([jenis, jumlah]) => (
                    <div key={jenis} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{jenis}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalUMKM > 0 ? (jumlah / stats.totalUMKM) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-foreground w-8">{jumlah}</span>
                      </div>
                    </div>
                  ))}
                {Object.keys(stats.jenisUsahaStats).length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada data UMKM</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border border-border rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Building2 className="h-5 w-5 mr-2 text-green-600" />
                UMKM Terbaru Terdaftar
              </CardTitle>
              <CardDescription className="text-muted-foreground">5 UMKM yang baru saja didaftarkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUMKM.length > 0 ? (
                  stats.recentUMKM.map((umkm) => (
                    <div
                      key={umkm.id}
                      className="flex items-center space-x-4 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{umkm.nama_usaha}</p>
                        <p className="text-sm text-muted-foreground">
                          {umkm.pemilik} • {umkm.jenis_usaha}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            umkm.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {umkm.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada UMKM terdaftar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 rounded-2xl">
            <Link href="/umkm/tambah">
              <CardHeader>
                <CardTitle className="flex items-center text-primary-foreground">
                  <Plus className="h-6 w-6 mr-3" />
                  Daftarkan UMKM Baru
                </CardTitle>
                <CardDescription className="text-primary-foreground/90">
                  Tambahkan data UMKM mikro baru ke dalam sistem
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 rounded-2xl">
            <Link href="/umkm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Kelola Data UMKM
                </CardTitle>
                <CardDescription className="text-green-100">Edit, update, dan kelola semua data UMKM</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 rounded-2xl">
            <Link href="/laporan">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <PieChart className="h-6 w-6 mr-3" />
                  Lihat Laporan
                </CardTitle>
                <CardDescription className="text-purple-100">Analisis dan statistik perkembangan UMKM</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {stats.totalUMKM > 0 && (
          <div className="mt-8">
            <Card className="bg-card shadow-lg border border-border rounded-xl">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Ringkasan Status UMKM {user?.role === "admin" ? `RW ${user.rw}` : ""}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gambaran umum kondisi UMKM di wilayah Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.umkmAktif}</div>
                    <div className="text-sm text-green-700 mt-1">UMKM Aktif</div>
                    <div className="text-xs text-green-600 mt-1">
                      {stats.totalUMKM > 0 ? Math.round((stats.umkmAktif / stats.totalUMKM) * 100) : 0}% dari total
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-muted-foreground">{stats.umkmTidakAktif}</div>
                    <div className="text-sm text-foreground mt-1">Tidak Aktif</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats.totalUMKM > 0 ? Math.round((stats.umkmTidakAktif / stats.totalUMKM) * 100) : 0}% dari total
                    </div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">Rp {(stats.totalRAB / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-primary/90 mt-1">Total RAB</div>
                    <div className="text-xs text-primary/80 mt-1">Rencana anggaran biaya</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
