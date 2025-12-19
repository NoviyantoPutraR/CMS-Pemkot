import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '../../../components/ui/dialog'
import { penggunaService } from '../../../services/penggunaService'
import { useDebounce } from '../../../hooks/useDebounce'
import Loading from '../../../components/shared/Loading'
import DeleteConfirmDialog from '../../../components/shared/DeleteConfirmDialog'
import { Plus, Edit, Trash2, Users, Search, Shield, User, Key, ChevronDown, ChevronUp, UserCog, FileEdit } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'
import useAuthStore from '../../../store/useAuthStore'
import CreateUserModal from './CreateUserModal'
import { ROLES, ROLE_LABELS } from '../../../utils/constants'
import { canManageUsers } from '../../../utils/permissionHelper'

export default function AdminList() {
  const [pengguna, setPengguna] = useState([])
  const [filteredPengguna, setFilteredPengguna] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedPeran, setSelectedPeran] = useState('')
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null)
  const [resetPasswordValue, setResetPasswordValue] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [userPermissionsMap, setUserPermissionsMap] = useState({}) // Map userId -> permissions array
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  
  const { user, profile } = useAuthStore()
  const debouncedSearch = useDebounce(search, 500)
  
  const isSuperAdmin = profile?.peran === ROLES.SUPERADMIN
  const isAdminSKPD = profile?.peran === ROLES.ADMIN_SKPD

  useEffect(() => {
    if (user?.id && profile?.peran) {
      loadPengguna()
    }
  }, [user?.id, profile?.peran])

  useEffect(() => {
    filterData()
  }, [debouncedSearch, selectedPeran, pengguna])

  const loadPengguna = async () => {
    try {
      setLoading(true)
      
      let data = []
      // Jika Admin SKPD, hanya load Penulis yang dibuatnya
      if (profile?.peran === ROLES.ADMIN_SKPD) {
        console.log('Loading Penulis for Admin SKPD:', user?.id)
        data = await penggunaService.getCreatedUsers(user?.id)
        console.log('Loaded Penulis:', data)
      } else {
        // Superadmin bisa lihat semua
        data = await penggunaService.getAll()
      }
      
      setPengguna(data || [])
      
      // Load permissions for each user (except Superadmin who has all access)
      const permissionsMap = {}
      for (const user of data || []) {
        if (user.peran === ROLES.SUPERADMIN) {
          // Superadmin has all access, no need to load
          permissionsMap[user.id] = []
        } else {
          try {
            const permissions = await penggunaService.getPermissions(user.id)
            permissionsMap[user.id] = permissions || []
          } catch (error) {
            console.error(`Error loading permissions for user ${user.id}:`, error)
            permissionsMap[user.id] = []
          }
        }
      }
      setUserPermissionsMap(permissionsMap)
    } catch (error) {
      console.error('Error loading pengguna:', error)
      alert('Gagal memuat data pengguna: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    let filtered = pengguna

    // Filter by search (email or nama)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      filtered = filtered.filter(item =>
        item.email.toLowerCase().includes(searchLower) ||
        (item.nama_lengkap && item.nama_lengkap.toLowerCase().includes(searchLower))
      )
    }

    // Filter by peran
    if (selectedPeran) {
      filtered = filtered.filter(item => item.peran === selectedPeran)
    }


    setFilteredPengguna(filtered)
  }

  const toggleExpandRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id)
  }


  const handleDelete = (id, email) => {
    if (id === user?.id) {
      alert('Anda tidak dapat menghapus akun sendiri')
      return
    }
    
    setItemToDelete({ id, email })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await penggunaService.delete(itemToDelete.id)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadPengguna()
    } catch (error) {
      console.error('Error deleting pengguna:', error)
      alert('Gagal menghapus pengguna')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleResetPassword = (userId) => {
    setResetPasswordUserId(userId)
    setResetPasswordValue('')
    setShowResetPasswordModal(true)
  }

  const submitResetPassword = async () => {
    if (!resetPasswordValue || resetPasswordValue.length < 8) {
      alert('Password harus minimal 8 karakter')
      return
    }

    try {
      setSavingId(resetPasswordUserId)
      await penggunaService.updatePassword(resetPasswordUserId, resetPasswordValue)
      setShowResetPasswordModal(false)
      setResetPasswordUserId(null)
      setResetPasswordValue('')
      alert('Password berhasil direset')
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Gagal mereset password: ' + error.message)
    } finally {
      setSavingId(null)
    }
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
        return <User className="w-4 h-4" />
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

  const allPeran = [...new Set(pengguna.map(item => item.peran))]

  if (loading && pengguna.length === 0) {
    return <Loading />
  }

  const isSelf = (itemId) => itemId === user?.id
  const canManage = canManageUsers(profile?.peran)

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Pengguna</CardTitle>
              <CardDescription className="mt-2">
                Kelola pengguna sistem dengan berbagai peran dan hak akses
              </CardDescription>
            </div>
            {canManage && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengguna
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari email atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select
              value={selectedPeran}
              onChange={(e) => setSelectedPeran(e.target.value)}
              className="bg-background"
            >
              <option value="">Semua Peran</option>
              {allPeran.map(peran => (
                <option key={peran} value={peran}>
                  {ROLE_LABELS[peran] || peran}
                </option>
              ))}
            </Select>
          </div>

          {filteredPengguna.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tidak ada pengguna ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : 'Belum ada data pengguna.'}
                  </p>
                </div>
                {!debouncedSearch && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Pengguna Pertama
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Email</TableHead>
                    <TableHead className="w-[200px]">Nama Lengkap</TableHead>
                    <TableHead className="w-[150px]">Peran</TableHead>
                    <TableHead className="w-[300px]">Hak Akses</TableHead>
                    <TableHead className="w-[180px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPengguna.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPengguna.map((item) => {
                      const canDelete = !isSelf(item.id) && (isSuperAdmin || (isAdminSKPD && item.peran === ROLES.PENULIS && item.dibuat_oleh === user?.id))
                      return (
                        <Fragment key={item.id}>
                          <TableRow 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleExpandRow(item.id)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="text-muted-foreground" title={ROLE_LABELS[item.peran]}>
                                  {getRoleIcon(item.peran)}
                                </div>
                                <span className="font-medium">{item.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.nama_lengkap || '—'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(item.peran)}>
                                {ROLE_LABELS[item.peran]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.peran === ROLES.SUPERADMIN ? (
                                <Badge variant="outline" className="text-xs">
                                  Semua Akses
                                </Badge>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {userPermissionsMap[item.id] && userPermissionsMap[item.id].length > 0 ? (
                                    userPermissionsMap[item.id].slice(0, 3).map((perm) => (
                                      <Badge key={perm.hak_akses_id} variant="secondary" className="text-xs">
                                        {perm.hak_akses?.nama_halaman || perm.hak_akses?.kode_halaman || 'N/A'}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Tidak ada hak akses</span>
                                  )}
                                  {userPermissionsMap[item.id] && userPermissionsMap[item.id].length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{userPermissionsMap[item.id].length - 3} lainnya
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <Link to={`/admin/pengguna/edit/${item.id}`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleResetPassword(item.id)}
                                  title="Reset Password"
                                >
                                  <Key className="w-4 h-4" />
                                </Button>
                                {canDelete && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(item.id, item.email)}
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleExpandRow(item.id)}
                                  title={expandedRowId === item.id ? 'Tutup detail' : 'Lihat detail'}
                                >
                                  {expandedRowId === item.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRowId === item.id && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-muted/30">
                                <div className="p-4 space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Metadata</h4>
                                      <div className="text-sm space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-muted-foreground">Dibuat:</span>
                                          <span>{formatDate(item.dibuat_pada)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-muted-foreground">Diperbarui:</span>
                                          <span>{formatDate(item.diperbarui_pada || item.dibuat_pada)}</span>
                                        </div>
                                        {item.dibuat_oleh && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Dibuat oleh:</span>
                                            <span className="font-medium">
                                              {item.creator_info?.nama_lengkap || item.creator_info?.email || 'Unknown'}
                                            </span>
                                            {item.creator_info?.email && item.creator_info?.nama_lengkap && (
                                              <span className="text-xs text-muted-foreground">
                                                ({item.creator_info.email})
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Informasi Peran & Hak Akses</h4>
                                      <div className="text-sm space-y-3">
                                        <div>
                                          <Badge variant={getRoleBadgeVariant(item.peran)}>
                                            {getRoleIcon(item.peran)}
                                            <span className="ml-1">{ROLE_LABELS[item.peran]}</span>
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-2">
                                            {item.peran === ROLES.SUPERADMIN 
                                              ? 'Superadmin memiliki akses ke dashboard dan manajemen pengguna, serta akses read-only ke semua halaman konten.'
                                              : item.peran === ROLES.ADMIN_SKPD
                                              ? 'Admin SKPD dapat membuat penulis dan mengatur hak akses mereka.'
                                              : 'Penulis dapat mengakses halaman sesuai hak akses yang diberikan.'}
                                          </p>
                                          {item.peran !== ROLES.SUPERADMIN && (
                                            <div>
                                              <p className="text-xs font-medium mb-2">Hak Akses Halaman:</p>
                                              {userPermissionsMap[item.id] && userPermissionsMap[item.id].length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                  {userPermissionsMap[item.id].map((perm) => (
                                                    <Badge key={perm.hak_akses_id} variant="secondary" className="text-xs">
                                                      {perm.hak_akses?.nama_halaman || perm.hak_akses?.kode_halaman || 'N/A'}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-xs text-muted-foreground italic">Tidak ada hak akses yang diberikan</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={loadPengguna}
      />

      <Dialog open={showResetPasswordModal} onOpenChange={setShowResetPasswordModal}>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin mereset password pengguna ini? Masukkan password baru.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Baru *</label>
              <Input
                type="password"
                value={resetPasswordValue}
                onChange={(e) => setResetPasswordValue(e.target.value)}
                placeholder="Minimal 8 karakter"
                disabled={savingId !== null}
              />
              <p className="text-xs text-muted-foreground">
                Password harus minimal 8 karakter
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowResetPasswordModal(false)}
            disabled={savingId !== null}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={submitResetPassword}
            disabled={savingId !== null || !resetPasswordValue || resetPasswordValue.length < 8}
          >
            {savingId !== null ? 'Mereset...' : 'Reset Password'}
          </Button>
        </DialogFooter>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.email}
        description="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  )
}

