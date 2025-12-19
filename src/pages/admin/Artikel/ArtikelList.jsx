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
import { artikelService } from '../../../services/artikelService'
import { useDebounce } from '../../../hooks/useDebounce'
import Loading from '../../../components/shared/Loading'
import DeleteConfirmDialog from '../../../components/shared/DeleteConfirmDialog'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'
import { BERITA_STATUS } from '../../../utils/constants'

export default function ArtikelList() {
  const [artikel, setArtikel] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    loadArtikel()
  }, [debouncedSearch, selectedStatus, page])

  const loadArtikel = async () => {
    try {
      setLoading(true)
      const result = await artikelService.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status: selectedStatus || null,
      })
      setArtikel(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading artikel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await artikelService.toggleStatus(id, currentStatus)
      loadArtikel()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Gagal mengubah status artikel')
    }
  }

  const handleDelete = (id, judul) => {
    setItemToDelete({ id, judul })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await artikelService.delete(itemToDelete.id)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadArtikel()
    } catch (error) {
      console.error('Error deleting artikel:', error)
      alert('Gagal menghapus artikel')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  if (loading && artikel.length === 0) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Artikel</CardTitle>
              <CardDescription className="mt-2">
                Kelola artikel dan konten mendalam
              </CardDescription>
            </div>
            <Link to="/admin/artikel/tambah">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Artikel
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari artikel..."
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
              <option value={BERITA_STATUS.DRAFT}>Draft</option>
              <option value={BERITA_STATUS.PUBLISHED}>Published</option>
            </Select>
          </div>

          {artikel.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tidak ada artikel ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : 'Mulai dengan menambahkan artikel pertama Anda.'}
                  </p>
                </div>
                {!debouncedSearch && (
                  <Link to="/admin/artikel/tambah">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Artikel Pertama
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
                    <TableHead className="w-[300px]">Judul</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Tanggal Dibuat</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artikel.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    artikel.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-[300px] truncate" title={item.judul}>
                            {item.judul}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === BERITA_STATUS.PUBLISHED
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDate(item.dibuat_pada)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="max-w-[400px] truncate" title={item.meta_description || 'Tidak ada deskripsi'}>
                            {item.meta_description || 'Tidak ada deskripsi'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(item.id, item.status)}
                              title={
                                item.status === BERITA_STATUS.PUBLISHED
                                  ? 'Ubah ke Draft'
                                  : 'Publish'
                              }
                              className="h-8 w-8"
                            >
                              {item.status === BERITA_STATUS.PUBLISHED ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Link to={`/admin/artikel/edit/${item.id}`}>
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

