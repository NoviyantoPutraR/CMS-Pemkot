import { ROLES, PERMISSION_CATEGORIES, PAGE_CODES } from './constants'

/**
 * Check apakah user punya akses ke halaman tertentu
 * @param {string[]} userPermissions - Array of permission codes
 * @param {string} pageCode - Page code to check
 * @returns {boolean}
 */
export function checkPageAccess(userPermissions, pageCode) {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false
  }
  return userPermissions.includes(pageCode)
}

/**
 * Check apakah user adalah superadmin
 * @param {string} userRole - User role
 * @returns {boolean}
 */
export function isSuperadmin(userRole) {
  return userRole === ROLES.SUPERADMIN
}

/**
 * Check apakah user adalah admin SKPD
 * @param {string} userRole - User role
 * @returns {boolean}
 */
export function isAdminSKPD(userRole) {
  return userRole === ROLES.ADMIN_SKPD
}

/**
 * Check apakah user adalah penulis
 * @param {string} userRole - User role
 * @returns {boolean}
 */
export function isPenulis(userRole) {
  return userRole === ROLES.PENULIS
}

/**
 * Check apakah user bisa manage users (create/edit/delete)
 * @param {string} userRole - User role
 * @returns {boolean}
 */
export function canManageUsers(userRole) {
  return isSuperadmin(userRole) || isAdminSKPD(userRole)
}

/**
 * Check apakah user bisa edit profil target user
 * @param {string} userId - Current user ID
 * @param {string} targetUserId - Target user ID to edit
 * @param {string} userRole - Current user role
 * @returns {boolean}
 */
export function canEditOwnProfile(userId, targetUserId, userRole) {
  // Superadmin bisa edit semua user
  if (isSuperadmin(userRole)) {
    return true
  }
  // Admin SKPD & Penulis hanya bisa edit profil sendiri
  return userId === targetUserId
}

/**
 * Get list permission yang bisa di-assign berdasarkan role
 * @param {string} role - Role yang akan assign permission
 * @returns {string} - Category permission
 */
export function getAvailablePermissionsForRole(role) {
  if (isSuperadmin(role)) {
    return PERMISSION_CATEGORIES.ADMIN_SKPD_OPTIONS
  }
  if (isAdminSKPD(role)) {
    return PERMISSION_CATEGORIES.PENULIS_OPTIONS
  }
  return null
}

/**
 * Get role yang bisa dibuat oleh user tertentu
 * @param {string} userRole - Current user role
 * @returns {string[]} - Array of roles that can be created
 */
export function getCreatableRoles(userRole) {
  if (isSuperadmin(userRole)) {
    return [ROLES.ADMIN_SKPD]
  }
  if (isAdminSKPD(userRole)) {
    return [ROLES.PENULIS]
  }
  return []
}

/**
 * Check apakah user bisa create role tertentu
 * @param {string} userRole - Current user role
 * @param {string} targetRole - Target role to create
 * @returns {boolean}
 */
export function canCreateRole(userRole, targetRole) {
  const creatableRoles = getCreatableRoles(userRole)
  return creatableRoles.includes(targetRole)
}

/**
 * Get label untuk role
 * @param {string} role - Role code
 * @returns {string} - Role label
 */
export function getRoleLabel(role) {
  const labels = {
    [ROLES.SUPERADMIN]: 'Superadmin',
    [ROLES.ADMIN_SKPD]: 'Admin SKPD',
    [ROLES.PENULIS]: 'Penulis',
  }
  return labels[role] || role
}

/**
 * Check apakah field bisa diedit oleh user
 * @param {string} fieldName - Field name
 * @param {string} userRole - Current user role
 * @param {boolean} isOwnProfile - Apakah edit profil sendiri
 * @returns {boolean}
 */
export function canEditField(fieldName, userRole, isOwnProfile) {
  // Superadmin bisa edit semua field
  if (isSuperadmin(userRole)) {
    return true
  }
  
  // Admin SKPD & Penulis hanya bisa edit nama_lengkap milik sendiri
  if (isOwnProfile && fieldName === 'nama_lengkap') {
    return true
  }
  
  return false
}

/**
 * Get permissions yang default diberikan ke role tertentu
 * Superadmin otomatis punya akses dashboard & manajemen_pengguna
 * @param {string} role - User role
 * @returns {string[]} - Array of default permission codes
 */
export function getDefaultPermissionsForRole(role) {
  if (isSuperadmin(role)) {
    return [PAGE_CODES.DASHBOARD, PAGE_CODES.MANAJEMEN_PENGGUNA]
  }
  return []
}

/**
 * Superadmin punya akses read-only ke semua halaman konten
 * @param {string} userRole - User role
 * @returns {boolean}
 */
export function hasSuperadminReadAccess(userRole) {
  return isSuperadmin(userRole)
}

