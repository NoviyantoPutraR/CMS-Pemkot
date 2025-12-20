import { useState, useEffect } from 'react'
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
import { agendaKotaService } from '../../../services/agendaKotaService'
import { useDebounce } from '../../../hooks/useDebounce'
import { useToast } from '../../../hooks/useToast'
import Loading from '../../../components/shared/Loading'
import DeleteConfirmDialog from '../../../components/shared/DeleteConfirmDialog'
import { Search, Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import { formatDateTime } from '../../../utils/formatters'
import { AGENDA_STATUS } from '../../../utils/constants'

export default function AgendaList() {
  const { toastSuccess, toastError } = useToast()
  const [agenda, setAgenda] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    loadAgenda()
  }, [debouncedSearch, selectedStatus, sortOrder, page])

  const loadAgenda = async () => {
    try {
      setLoading(true)
      const result = await agendaKotaService.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status: selectedStatus || null,
        sortOrder,
      })
      setAgenda(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading agenda:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await agendaKotaService.toggleStatus(id, currentStatus)
      toastSuccess('TOGGLE_STATUS')
      loadAgenda()
    } catch (error) {
      console.error('Error toggling status:', error)
      toastError('TOGGLE_STATUS', error.message || 'Gagal mengubah status agenda')
    }
  }

  const handleDelete = (id, judul) => {
    setItemToDelete({ id, judul })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await agendaKotaService.delete(itemToDelete.id)
      toastSuccess('DELETE')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadAgenda()
    } catch (error) {
      console.error('Error deleting agenda:', error)
      toastError('DELETE', error.message || 'Gagal menghapus agenda')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case AGENDA_STATUS.PUBLISHED:
        return 'default'
      case AGENDA_STATUS.SELESAI:
        return 'secondary'
      case AGENDA_STATUS.DIBATALKAN:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case AGENDA_STATUS.DRAFT:
        return 'Draft'
      case AGENDA_STATUS.PUBLISHED:
        return 'Published'
      case AGENDA_STATUS.SELESAI:
        return 'Selesai'
      case AGENDA_STATUS.DIBATALKAN:
        return 'Dibatalkan'
      default:
        return status
    }
  }

  if (loading && agenda.length === 0) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Agenda Kota</CardTitle>
              <CardDescription className="mt-2">
                Kelola agenda kegiatan kota
              </CardDescription>
            </div>
            <Link to="/admin/agenda/tambah">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Agenda
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari agenda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-background"
            >
              <option value="">Semua Status</option>
              <option value={AGENDA_STATUS.DRAFT}>Draft</option>
              <option value={AGENDA_STATUS.PUBLISHED}>Published</option>
              <option value={AGENDA_STATUS.SELESAI}>Selesai</option>
              <option value={AGENDA_STATUS.DIBATALKAN}>Dibatalkan</option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-background"
            >
              <option value="asc">Terlama</option>
              <option value="desc">Terbaru</option>
            </Select>
          </div>

          {agenda.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tidak ada agenda ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : 'Mulai dengan menambahkan agenda pertama Anda.'}
                  </p>
                </div>
                {!debouncedSearch && (
                  <Link to="/admin/agenda/tambah">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Agenda Pertama
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Judul</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[180px]">Tanggal Mulai</TableHead>
                    <TableHead className="w-[180px]">Tanggal Selesai</TableHead>
                    <TableHead className="w-[150px]">Lokasi</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agenda.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    agenda.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-[250px] truncate" title={item.judul}>
                            {item.judul}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDateTime(item.tanggal_mulai)}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {item.tanggal_selesai ? formatDateTime(item.tanggal_selesai) : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="max-w-[150px] truncate" title={item.lokasi || '-'}>
                            {item.lokasi || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="max-w-[300px] truncate" title={item.deskripsi || 'Tidak ada deskripsi'}>
                            {item.deskripsi || 'Tidak ada deskripsi'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {item.status === AGENDA_STATUS.PUBLISHED && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleStatus(item.id, item.status)}
                                title="Ubah ke Draft"
                                className="h-8 w-8"
                              >
                                <EyeOff className="w-4 h-4" />
                              </Button>
                            )}
                            {item.status === AGENDA_STATUS.DRAFT && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleStatus(item.id, item.status)}
                                title="Publish"
                                className="h-8 w-8"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Link to={`/admin/agenda/edit/${item.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id, item.judul)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="min-w-[100px]"
              >
                Sebelumnya
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50">
                <span className="text-sm font-medium text-foreground">
                  Halaman {page} dari {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="min-w-[100px]"
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.judul}
      />
    </div>
  )
}

