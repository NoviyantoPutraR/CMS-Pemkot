import { Toaster as SonnerToaster } from 'sonner'

/**
 * Komponen Toaster provider untuk aplikasi
 * Menggunakan sonner dengan konfigurasi yang sesuai untuk admin panel
 */
export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      expand={true}
      toastOptions={{
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        },
      }}
    />
  )
}

