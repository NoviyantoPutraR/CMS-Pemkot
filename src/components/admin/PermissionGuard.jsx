import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { isSuperadmin } from '../../utils/permissionHelper'

/**
 * Component untuk guard permission
 * Menampilkan children jika user punya permission, otherwise redirect atau show fallback
 */
export default function PermissionGuard({ 
  permission, 
  fallback = null, 
  redirectTo = '/admin',
  children 
}) {
  const { hasPermission, profile } = useAuthStore()
  
  // Jika tidak ada permission requirement, tampilkan children
  if (!permission) {
    return children
  }
  
  // Check permission
  const hasAccess = hasPermission(permission)
  
  if (!hasAccess) {
    // Jika ada fallback, tampilkan fallback
    if (fallback) {
      return fallback
    }
    
    // Jika tidak ada fallback, redirect
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }
    
    // Default: tidak tampilkan apa-apa
    return null
  }
  
  return children
}

/**
 * Wrapper component untuk conditional rendering berdasarkan permission
 * Tidak redirect, hanya hide/show content
 */
export function PermissionCheck({ permission, fallback = null, children }) {
  const { hasPermission } = useAuthStore()
  
  if (!permission) {
    return children
  }
  
  const hasAccess = hasPermission(permission)
  
  if (!hasAccess) {
    return fallback
  }
  
  return children
}

/**
 * Component untuk guard berdasarkan role
 */
export function RoleGuard({ 
  allowedRoles, 
  fallback = null, 
  redirectTo = '/admin',
  children 
}) {
  const { profile } = useAuthStore()
  
  if (!allowedRoles || allowedRoles.length === 0) {
    return children
  }
  
  const hasAccess = allowedRoles.includes(profile?.peran)
  
  if (!hasAccess) {
    if (fallback) {
      return fallback
    }
    
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }
    
    return null
  }
  
  return children
}

/**
 * Higher-order component untuk check permission
 */
export function withPermission(Component, permission, redirectTo = '/admin') {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard permission={permission} redirectTo={redirectTo}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}

