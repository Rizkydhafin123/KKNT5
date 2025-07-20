import { umkmService } from "@/lib/supabase"
import EditUMKMClient from "./EditUMKMClient"

// Tambahkan generateStaticParams untuk static export
export async function generateStaticParams() {
  const allUmkm = await umkmService.getAll()

  // Jika tidak ada data UMKM, kembalikan ID dummy untuk mencegah error build
  // Komponen klien harus menangani ID dummy ini (misalnya, menampilkan "data tidak ditemukan" atau redirect)
  if (allUmkm.length === 0) {
    return [{ id: "dummy-id" }]
  }

  return allUmkm.map((umkm) => ({
    id: umkm.id!, // Pastikan ID ada dan string
  }))
}

export default function EditUMKM() {
  return <EditUMKMClient />
}
