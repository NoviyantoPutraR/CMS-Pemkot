import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminSchema } from '../../../utils/validators'
import { penggunaService } from '../../../services/penggunaService'
import { hakAksesService } from '../../../services/hakAksesService'
import useAuthStore from '../../../store/useAuthStore'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '../../../components/ui/dialog'
import { ROLES, ROLE_LABELS } from '../../../utils/constants'
import { getCreatableRoles } from '../../../utils/permissionHelper'
import { Check } from 'lucide-react'

export default function CreateUserModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const { profile } = useAuthStore()

  const creatableRoles = getCreatableRoles(profile?.peran)
  const defaultRole = creatableRoles[0] || ROLES.PENULIS

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      peran: defaultRole,
      aktif: true,
    },
  })

  const password = watch('password', '')
  const selectedRole = watch('peran', defaultRole)
  
  // Load available permissions when modal opens or role changes
  useEffect(() => {
    async function loadPermissions() {
      try {
        // Load permissions based on CREATOR role, not target role
        // Superadmin creates admin_skpd → get admin_skpd_options
        // Admin SKPD creates penulis → get penulis_options
        const permissions = await hakAksesService.getAvailableForRole(profile?.peran)
        setAvailablePermissions(permissions)
        setSelectedPermissions([]) // Reset selections
      } catch (error) {
        console.error('Error loading permissions:', error)
      }
    }
    
    if (open && profile?.peran) {
      loadPermissions()
    }
  }, [open, profile?.peran])

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    const levels = [
      { label: 'Sangat Lemah', color: 'bg-red-500' },
      { label: 'Lemah', color: 'bg-orange-500' },
      { label: 'Sedang', color: 'bg-yellow-500' },
      { label: 'Kuat', color: 'bg-blue-500' },
      { label: 'Sangat Kuat', color: 'bg-green-500' },
    ]

    return {
      strength: Math.min(strength, 5),
      label: levels[Math.min(strength - 1, 4)]?.label || '',
      color: levels[Math.min(strength - 1, 4)]?.color || '',
    }
  }

  const passwordStrength = getPasswordStrength(password)

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      // Create user with dibuat_oleh (exclude nama_skpd jika ada)
      const { nama_skpd, ...userData } = data
      const newUser = await penggunaService.create({
        ...userData,
        aktif: true,
        dibuat_oleh: profile?.id,
      })
      
      // Assign permissions
      if (selectedPermissions.length > 0) {
        await penggunaService.assignPermissions(newUser.id, selectedPermissions)
      }
      
      reset()
      setSelectedPermissions([])
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Gagal menambah pengguna: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh]">
          {/* Header - Fixed */}
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-2xl">Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Buat akun pengguna baru dengan email, password, dan atur hak aksesnya
            </DialogDescription>
          </DialogHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Informasi Akun */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">Informasi Akun</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Minimal 8 karakter"
                  />
                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Kekuatan: {passwordStrength.label || 'Tidak ada'}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                  <Input
                    id="nama_lengkap"
                    {...register('nama_lengkap')}
                    placeholder="Nama lengkap pengguna"
                  />
                  {errors.nama_lengkap && (
                    <p className="text-sm text-destructive">{errors.nama_lengkap.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peran">Peran *</Label>
                  <Select id="peran" {...register('peran')} className="w-full">
                    {creatableRoles.map(role => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </Select>
                  {errors.peran && (
                    <p className="text-sm text-destructive">{errors.peran.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Anda dapat membuat: {creatableRoles.map(r => ROLE_LABELS[r]).join(', ')}
                  </p>
                </div>

              </div>

              {/* Right Column - Hak Akses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">Hak Akses Halaman</h3>
                </div>

                {availablePermissions.length > 0 ? (
                  <>
                    <div className="bg-muted/30 rounded-lg p-3 border border-dashed flex-shrink-0">
                      <p className="text-sm text-muted-foreground">
                        Pilih halaman yang dapat diakses oleh <span className="font-semibold text-foreground">{ROLE_LABELS[selectedRole]}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedPermissions.length} dari {availablePermissions.length} halaman dipilih
                      </p>
                    </div>

                    <div className="border rounded-lg overflow-hidden flex-shrink-0">
                      <div className="max-h-[350px] overflow-y-auto p-2 space-y-1.5">
                        {availablePermissions.map(permission => (
                          <button
                            key={permission.id}
                            type="button"
                            onClick={() => togglePermission(permission.id)}
                            className={`
                              w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                              ${selectedPermissions.includes(permission.id)
                                ? 'bg-primary/10 border-primary shadow-sm'
                                : 'bg-background hover:bg-muted/50 border-border hover:border-primary/50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                ${selectedPermissions.includes(permission.id)
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground/30'
                                }
                              `}>
                                {selectedPermissions.includes(permission.id) && (
                                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex flex-col items-start text-left">
                                <span className="font-medium text-sm">{permission.nama_halaman}</span>
                                {permission.deskripsi && (
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {permission.deskripsi}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedPermissions.length === 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-xs text-destructive font-medium">
                          ⚠️ Belum ada hak akses dipilih. User ini tidak akan bisa mengakses halaman apapun.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Pilih peran terlebih dahulu untuk melihat hak akses yang tersedia
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                * Field wajib diisi
              </p>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || selectedPermissions.length === 0}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

