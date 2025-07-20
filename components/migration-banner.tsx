"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, Loader2 } from "lucide-react"
import { umkmService, hasSupabase } from "@/lib/supabase"

export function MigrationBanner() {
  const [localData, setLocalData] = useState<any[]>([])
  const [showBanner, setShowBanner] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && hasSupabase) {
      const stored = JSON.parse(localStorage.getItem("umkm") || "[]")
      if (stored.length > 0) {
        setLocalData(stored)
        setShowBanner(true)
      }
    }
  }, [])

  const handleMigrate = async () => {
    try {
      setMigrating(true)

      for (const umkm of localData) {
        const { id, ...data } = umkm
        await umkmService.create(data)
      }

      localStorage.removeItem("umkm")
      setMigrated(true)

      setTimeout(() => {
        setShowBanner(false)
      }, 3000)
    } catch (error) {
      console.error("Migration error:", error)
      alert("Gagal migrasi data. Silakan coba lagi.")
    } finally {
      setMigrating(false)
    }
  }

  if (!showBanner || !hasSupabase) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <Alert className="bg-primary/10 border-primary/20 rounded-xl">
        <Upload className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            {migrated ? (
              <div className="flex items-center text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="font-medium">Migrasi berhasil!</span>
                <span className="ml-2">Data UMKM sudah tersimpan di cloud dan dapat diakses dari semua device.</span>
              </div>
            ) : (
              <div>
                <span className="font-medium text-primary">
                  Ditemukan {localData.length} data UMKM di penyimpanan lokal.
                </span>
                <span className="text-muted-foreground ml-2">
                  Migrasi ke database cloud agar data dapat diakses dari semua device?
                </span>
              </div>
            )}
          </div>

          {!migrated && (
            <div className="flex items-center space-x-2 ml-4">
              <Button
                size="sm"
                onClick={handleMigrate}
                disabled={migrating}
                className="bg-primary hover:bg-primary/90 rounded-lg"
              >
                {migrating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Migrasi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Migrasi Sekarang
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBanner(false)}
                className="border-border text-muted-foreground hover:bg-muted rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
