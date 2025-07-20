"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hasSupabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

export default function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "success" | "error">("testing")
  const [userCount, setUserCount] = useState<number>(0)
  const [umkmCount, setUmkmCount] = useState<number>(0)
  const [wargaCount, setWargaCount] = useState<number>(0)
  const [error, setError] = useState<string>("")

  const testConnection = async () => {
    try {
      setConnectionStatus("testing")
      setError("")

      if (!hasSupabase) {
        throw new Error("Supabase tidak dikonfigurasi")
      }

      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Test koneksi dengan query sederhana
      const { data: users, error: usersError } = await supabase.from("users").select("*", { count: "exact" })

      if (usersError) throw usersError

      const { data: umkm, error: umkmError } = await supabase.from("umkm").select("*", { count: "exact" })

      if (umkmError) throw umkmError

      const { data: warga, error: wargaError } = await supabase.from("warga").select("*", { count: "exact" })

      if (wargaError) throw wargaError

      setUserCount(users?.length || 0)
      setUmkmCount(umkm?.length || 0)
      setWargaCount(warga?.length || 0)
      setConnectionStatus("success")
    } catch (err: any) {
      setError(err.message || "Unknown error")
      setConnectionStatus("error")
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔧 Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              connectionStatus === "testing"
                ? "bg-yellow-500"
                : connectionStatus === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            {connectionStatus === "testing" && "Testing connection..."}
            {connectionStatus === "success" && "✅ Connected successfully!"}
            {connectionStatus === "error" && "❌ Connection failed"}
          </span>
        </div>

        {connectionStatus === "success" && (
          <div className="space-y-2 text-sm bg-green-50 p-3 rounded-lg">
            <p>
              <strong>📊 Database Status:</strong>
            </p>
            <p>👥 Users: {userCount}</p>
            <p>🏪 UMKM: {umkmCount}</p>
            <p>👨‍👩‍👧‍👦 Warga: {wargaCount}</p>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        <Button onClick={testConnection} className="w-full">
          {connectionStatus === "testing" ? "Testing..." : "Test Again"}
        </Button>
      </CardContent>
    </Card>
  )
}
