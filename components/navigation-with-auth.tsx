"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Building2, BarChart3, PieChart } from "lucide-react"

export function NavigationWithAuth() {
  const { user } = useAuth()

  const adminNavItems = [
    { href: "/", label: "Dashboard", icon: Building2 },
    { href: "/umkm", label: "Kelola UMKM", icon: BarChart3 },
    { href: "/laporan", label: "Laporan & Statistik", icon: PieChart },
  ]

  const userNavItems = [
    { href: "/", label: "Dashboard", icon: Building2 },
    { href: "/umkm", label: "Data UMKM", icon: BarChart3 },
    { href: "/laporan", label: "Laporan", icon: PieChart },
  ]

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-4 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80 rounded-t-lg transition-colors"
            >
              <item.icon className="inline h-4 w-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
