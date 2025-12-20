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
import { perangkatDaerahService } from '../../../services/perangkatDaerahService'
import { useDebounce } from '../../../hooks/useDebounce'
import { useToast } from '../../../hooks/useToast'
import Loading from '../../../components/shared/Loading'
import DeleteConfirmDialog from '../../../components/shared/DeleteConfirmDialog'
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Grid3x3, List } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'

export default function PerangkatDaerahList() {
  const { toastSuccess, toastError } = useToast()
  const [perangkat, setPerangkat] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterAktif, setFilterAktif] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'card'
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    loadPerangkat()
  }, [debouncedSearch, filterAktif, page])

  const loadPerangkat = async () => {
    try {
      setLoading(true)
      const result = await perangkatDaerahService.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        aktifOnly: filterAktif === 'aktif' ? true : filterAktif === 'nonaktif' ? false : null,
      })
      setPerangkat(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading perangkat daerah:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data perangkat daerah')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAktif = async (id, currentAktif) => {
    try {
      await perangkatDaerahService.toggleAktif(id, currentAktif)
      toastSuccess('TOGGLE_STATUS')
      loadPerangkat()
    } catch (error) {
      console.error('Error toggling aktif:', error)
      toastError('TOGGLE_STATUS', error.message || 'Gagal mengubah status perangkat daerah')
    }
  }

  const handleDelete = (id, nama) => {
    setItemToDelete({ id, nama })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await perangkatDaerahService.delete(itemToDelete.id)
      toastSuccess('DELETE')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadPerangkat()
    } catch (error) {
      console.error('Error deleting perangkat daerah:', error)
      toastError('DELETE', error.message || 'Gagal menghapus perangkat daerah')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  if (loading && perangkat.length === 0) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Perangkat Daerah</CardTitle>
              <CardDescription className="mt-2">
                Kelola informasi perangkat daerah
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                title={viewMode === 'table' ? 'Tampilkan Card View' : 'Tampilkan Table View'}
              >
                {viewMode === 'table' ? (
                  <Grid3x3 className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </Button>
              <Link to="/admin/perangkat-daerah/tambah">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Perangkat Daerah
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari perangkat daerah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select
              value={filterAktif}
              onChange={(e) => {
                setFilterAktif(e.target.value)
                setPage(1)
              }}
              className="bg-background"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </Select>
          </div>

          {perangkat.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tidak ada perangkat daerah ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : 'Mulai dengan menambahkan perangkat daerah pertama Anda.'}
                  </p>
                </div>
                {!debouncedSearch && (
                  <Link to="/admin/perangkat-daerah/tambah">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Perangkat Daerah Pertama
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Urutan</TableHead>
                    <TableHead className="w-[250px]">Nama Perangkat</TableHead>
                    <TableHead className="w-[200px]">Kepala</TableHead>
                    <TableHead className="w-[200px]">Kontak</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perangkat.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    perangkat.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-muted-foreground">
                          {item.urutan !== null && item.urutan !== undefined ? item.urutan : '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="max-w-[250px] truncate" title={item.nama_perangkat}>
                              {item.nama_perangkat}
                            </div>
                            {item.jabatan_kepala && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.jabatan_kepala}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="max-w-[200px] truncate" title={item.nama_kepala || '-'}>
                            {item.nama_kepala || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="max-w-[200px] truncate" title={item.kontak || '-'}>
                            {item.kontak || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.aktif ? 'default' : 'secondary'}
                          >
                            {item.aktif ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleAktif(item.id, item.aktif)}
                              title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                              className="h-8 w-8"
                            >
                              {item.aktif ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Link to={`/admin/perangkat-daerah/edit/${item.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id, item.nama)}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perangkat.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {item.foto_url && (
                        <div className="w-full aspect-square overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.foto_url}
                            alt={item.nama_perangkat}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground flex-1">
                            {item.nama_perangkat}
                          </h3>
                          <Badge
                            variant={item.aktif ? 'default' : 'secondary'}
                            className="shrink-0 ml-2"
                          >
                            {item.aktif ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        {item.jabatan_kepala && item.nama_kepala && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{item.jabatan_kepala}:</span> {item.nama_kepala}
                          </p>
                        )}
                        {item.kontak && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            <span className="font-medium">Kontak:</span> {item.kontak}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Link to={`/admin/perangkat-daerah/edit/${item.id}`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleAktif(item.id, item.aktif)}
                          title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                          className="h-9 w-9"
                        >
                          {item.aktif ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
        itemName={itemToDelete?.nama}
      />
    </div>
  )
}

