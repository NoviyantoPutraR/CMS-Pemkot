import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import AdminRoutes from './AdminRoutes'

export default function AppRouter() {
  // Non-blocking: Render routes segera tanpa menunggu auth init
  // Auth check akan dilakukan di level route yang memerlukan (AdminRoutes)
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

