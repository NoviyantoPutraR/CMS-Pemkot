import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { penggunaService } from '../../../services/penggunaService'
import { hakAksesService } from '../../../services/hakAksesService'
import useAuthStore from '../../../store/useAuthStore'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import { ROLES, ROLE_LABELS } from '../../../utils/constants'
import { isSuperadmin, canEditOwnProfile } from '../../../utils/permissionHelper'
import { Check, Shield, UserCog, FileEdit, Lock, AlertCircle } from 'lucide-react'

export default function EditAdmin() {
  const { id } = useParams()
  const { profile, user } = useAuthStore()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const navigate = useNavigate()

  const isOwnProfile = user?.id === id
  const isSuperAdmin = isSuperadmin(profile?.peran)
  const isAdminSKPD = profile?.peran === ROLES.ADMIN_SKPD
  
  // Check if user can edit this profile
  // - Superadmin: bisa edit semua
  // - Admin SKPD: bisa edit sendiri atau Penulis yang dibuatnya
  // - Penulis: hanya bisa edit sendiri
  const canEdit = (() => {
    if (isSuperAdmin) return true
    if (isOwnProfile) return true
    if (isAdminSKPD && admin?.dibuat_oleh === user?.id && admin?.peran === ROLES.PENULIS) {
      return true
    }
    return false
  })()
  
  // Redirect jika tidak punya akses
  useEffect(() => {
    if (!loading && admin && !canEdit) {
      alert('Anda tidak memiliki akses untuk mengedit profil ini')
      navigate('/admin/pengguna')
    }
  }, [loading, admin, canEdit, navigate])

  // Schema untuk edit (password optional dan bisa empty string)
  const editAdminSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string()
      .refine((val) => !val || val.length === 0 || val.length >= 8, {
        message: 'Password harus minimal 8 karakter'
      })
      .refine((val) => !val || val.length === 0 || /[A-Za-z]/.test(val), {
        message: 'Password harus mengandung huruf'
      })
      .refine((val) => !val || val.length === 0 || /[0-9]/.test(val), {
        message: 'Password harus mengandung angka'
      })
      .optional()
      .or(z.literal('')),
    nama_lengkap: z.string().max(100, 'Nama lengkap maksimal 100 karakter').optional().or(z.literal('')),
    peran: z.string(),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editAdminSchema),
  })

  useEffect(() => {
    loadAdmin()
  }, [id])

  const loadAdmin = async () => {
    try {
      setLoading(true)
      const data = await penggunaService.getById(id)
      setAdmin(data)
      setValue('email', data.email)
      setValue('nama_lengkap', data.nama_lengkap || '')
      setValue('peran', data.peran)
      
      // Load permissions untuk ditampilkan jika:
      // 1. Superadmin atau admin SKPD (dan target bukan superadmin) - untuk edit atau view
      // 2. Penulis yang melihat profilnya sendiri - untuk view saja
      // Superadmin tidak perlu permissions karena hardcoded punya akses ke semua
      if (data.peran !== ROLES.SUPERADMIN) {
        // Load user's current permissions (selalu load untuk ditampilkan)
        const permissions = await penggunaService.getPermissions(id)
        setUserPermissions(permissions)
        setSelectedPermissions(permissions.map(p => p.hak_akses_id))
        
        // Load available permissions hanya jika bisa mengatur (superadmin atau admin SKPD untuk penulis yang dibuatnya)
        if (isSuperAdmin || (isAdminSKPD && !isOwnProfile && data.dibuat_oleh === user?.id)) {
          const available = await hakAksesService.getAvailableForRole(profile?.peran)
          setAvailablePermissions(available)
        }
      }
    } catch (error) {
      console.error('Error loading admin:', error)
      alert('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      
      let updates = {}
      
      if (isSuperAdmin || (isAdminSKPD && admin?.dibuat_oleh === user?.id)) {
        // Superadmin & Admin SKPD (untuk Penulis yang dibuatnya) bisa update field
        updates = {
          nama_lengkap: data.nama_lengkap,
        }
        
        // Peran hanya bisa diupdate jika target bukan Superadmin
        if (admin?.peran !== ROLES.SUPERADMIN) {
          // Admin SKPD hanya bisa set Penulis, Superadmin bisa set semua
          if (isSuperAdmin || data.peran === ROLES.PENULIS) {
            updates.peran = data.peran
          }
        }
        
        // Update password jika diisi dan tidak kosong
        if (data.password && data.password.trim() !== '') {
          await penggunaService.updatePassword(id, data.password)
        }
        
        // Update permissions (hanya jika bukan Superadmin dan user bisa manage permissions)
        // Admin SKPD tidak bisa mengatur hak akses halamannya sendiri
        if (data.peran !== ROLES.SUPERADMIN && (isSuperAdmin || (isAdminSKPD && admin?.dibuat_oleh === user?.id && !isOwnProfile))) {
          await penggunaService.assignPermissions(id, selectedPermissions)
        }
      } else {
        // Admin SKPD & Penulis hanya bisa update nama_lengkap sendiri
        updates = {
          nama_lengkap: data.nama_lengkap,
        }
        
        // Update password jika diisi dan tidak kosong (untuk profil sendiri)
        if (isOwnProfile && data.password && data.password.trim() !== '') {
          await penggunaService.updatePassword(id, data.password)
        }
      }

      // Update profile
      await penggunaService.update(id, updates)
      
      // Redirect based on role
      if (isSuperAdmin) {
        navigate('/admin/pengguna')
      } else {
        alert('Profil berhasil diperbarui')
      }
    } catch (error) {
      console.error('Error updating admin:', error)
      alert('Gagal mengupdate pengguna: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  const getRoleIcon = (peran) => {
    switch (peran) {
      case ROLES.SUPERADMIN:
        return <Shield className="w-4 h-4" />
      case ROLES.ADMIN_SKPD:
        return <UserCog className="w-4 h-4" />
      case ROLES.PENULIS:
        return <FileEdit className="w-4 h-4" />
      default:
        return null
    }
  }

  const getRoleBadgeVariant = (peran) => {
    switch (peran) {
      case ROLES.SUPERADMIN:
        return 'destructive'
      case ROLES.ADMIN_SKPD:
        return 'default'
      case ROLES.PENULIS:
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isOwnProfile ? 'Profil Saya' : 'Edit Pengguna'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isOwnProfile 
            ? 'Kelola informasi profil Anda' 
            : 'Edit informasi pengguna dan hak akses'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informasi Pengguna</CardTitle>
              <CardDescription className="mt-1">
                {admin?.email}
              </CardDescription>
            </div>
            <Badge variant={getRoleBadgeVariant(admin?.peran)}>
              {getRoleIcon(admin?.peran)}
              <span className="ml-1">{ROLE_LABELS[admin?.peran]}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email - Always read-only */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input id="email" {...register('email')} disabled className="pr-10" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah
              </p>
            </div>

            {/* Password - Superadmin untuk user lain, atau user untuk profil sendiri */}
            {(isSuperAdmin && !isOwnProfile) || isOwnProfile ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru (Opsional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Kosongkan field ini jika tidak ingin mengubah password. Minimal 8 karakter dengan huruf dan angka.
                </p>
              </div>
            ) : null}

            {/* Nama Lengkap - Editable */}
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input
                id="nama_lengkap"
                {...register('nama_lengkap')}
                placeholder="Nama lengkap pengguna"
              />
              {errors.nama_lengkap && (
                <p className="text-sm text-destructive">
                  {errors.nama_lengkap.message}
                </p>
              )}
            </div>

            {/* Peran - Superadmin & Admin SKPD (untuk edit Penulis), read-only for others */}
            <div className="space-y-2">
              <Label htmlFor="peran">Peran</Label>
              {(isSuperAdmin || (isAdminSKPD && admin?.dibuat_oleh === user?.id)) && admin?.peran !== ROLES.SUPERADMIN ? (
                <>
                  <Select
                    id="peran"
                    value={watch('peran')}
                    onChange={(e) => setValue('peran', e.target.value)}
                  >
                    {isSuperAdmin ? (
                      <>
                        <option value={ROLES.SUPERADMIN}>{ROLE_LABELS[ROLES.SUPERADMIN]}</option>
                        <option value={ROLES.ADMIN_SKPD}>{ROLE_LABELS[ROLES.ADMIN_SKPD]}</option>
                        <option value={ROLES.PENULIS}>{ROLE_LABELS[ROLES.PENULIS]}</option>
                      </>
                    ) : (
                      // Admin SKPD hanya bisa set Penulis
                      <option value={ROLES.PENULIS}>{ROLE_LABELS[ROLES.PENULIS]}</option>
                    )}
                  </Select>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Perubahan peran memengaruhi hak akses pengguna
                  </p>
                </>
              ) : (
                <div className="relative">
                  <Input value={ROLE_LABELS[admin?.peran]} disabled className="pr-10" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {admin?.peran === ROLES.SUPERADMIN && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Peran Superadmin tidak dapat diubah untuk keamanan sistem
                </p>
              )}
              {errors.peran && (
                <p className="text-sm text-destructive">
                  {errors.peran.message}
                </p>
              )}
            </div>


            {/* Permissions - Superadmin & Admin SKPD (kecuali untuk dirinya sendiri), dan target bukan Superadmin */}
            {(isSuperAdmin || (isAdminSKPD && !isOwnProfile)) && admin?.peran !== ROLES.SUPERADMIN && availablePermissions.length > 0 && (
              <div className="space-y-2">
                <Label>Hak Akses Halaman</Label>
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
                  {availablePermissions.map(permission => (
                    <button
                      key={permission.id}
                      type="button"
                      onClick={() => togglePermission(permission.id)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg border transition-colors
                        ${selectedPermissions.includes(permission.id)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background hover:bg-muted border-border'
                        }
                      `}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{permission.nama_halaman}</span>
                        {permission.deskripsi && (
                          <span className="text-xs text-muted-foreground">{permission.deskripsi}</span>
                        )}
                      </div>
                      {selectedPermissions.includes(permission.id) && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPermissions.length} hak akses dipilih
                </p>
              </div>
            )}

            {/* Read-only info for non-superadmin viewing their permissions */}
            {!isSuperAdmin && isOwnProfile && userPermissions.length > 0 && (
              <div className="space-y-2">
                <Label>Hak Akses Saya</Label>
                <div className="border rounded-lg p-3 bg-muted/30 space-y-2 max-h-60 overflow-y-auto">
                  {userPermissions.map(p => (
                    <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-medium text-sm">{p.hak_akses?.nama_halaman}</span>
                        {p.hak_akses?.deskripsi && (
                          <span className="text-xs text-muted-foreground mt-1">{p.hak_akses.deskripsi}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hak akses ini diberikan oleh administrator
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isSuperAdmin ? '/admin/pengguna' : '/admin')}
              >
                {isSuperAdmin ? 'Batal' : 'Kembali'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
