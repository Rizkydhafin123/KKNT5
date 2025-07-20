"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { ChangePasswordModal } from "./change-password-modal"

export function ForcePasswordChange() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (user?.role === "admin" && user?.must_change_password) {
      setShowModal(true)
    }
  }, [user])

  const handleClose = () => {
    // Sekarang user bisa menutup modal kapan saja
    setShowModal(false)
  }

  return (
    <ChangePasswordModal isOpen={showModal} onClose={handleClose} isRequired={user?.must_change_password || false} />
  )
}
