"use client"

import { useAuth } from "@/lib/auth"

export function useUser() {
  const { user, isLoading } = useAuth()

  return {
    user,
    isLoading,
  }
}
