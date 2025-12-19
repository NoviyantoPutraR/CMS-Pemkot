import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
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
  DialogFooter,
} from '../../../components/ui/dialog'
import { halamanService } from '../../../services/halamanService'
import { useDebounce } from '../../../hooks/useDebounce'
import { useToast } from '../../../hooks/useToast'
import Loading from '../../../components/shared/Loading'
import { Edit, FileText, AlertCircle, RefreshCw, Plus, Search, Trash2 } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'

export default function HalamanList() {
  const [halaman, setHalaman] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const debouncedSearch = useDebounce(search, 500)
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    loadHalaman()
  }, [debouncedSearch])

  const loadHalaman = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await halamanService.getAll()
      
      // Filter berdasarkan search jika ada
      let filteredData = data
      if (debouncedSearch) {
        filteredData = data.filter((h) =>
          h.judul.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          h.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      }
      
      setHalaman(filteredData)
    } catch (error) {
      console.error('Error loading halaman:', error)
      setError(
        error.message || 'Gagal memuat data halaman. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id, judul) => {
    setItemToDelete({ id, judul })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await halamanService.delete(itemToDelete.id)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      toastSuccess('DELETE')
      loadHalaman()
    } catch (error) {
      console.error('Error deleting halaman:', error)
      toastError('DELETE', `Gagal menghapus halaman: ${error.message || 'Terjadi kesalahan'}`)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  if (loading && halaman.length === 0) {
    return <Loading />
  }

  return (
    <div>
      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-2">
                  {error}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadHalaman}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Halaman</CardTitle>
              <CardDescription className="mt-2">
                Kelola halaman statis
              </CardDescription>
            </div>
            <Link to="/admin/halaman/tambah">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Halaman
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari halaman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {!error && halaman.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {debouncedSearch 
                      ? 'Tidak ada halaman yang sesuai dengan pencarian'
                      : 'Belum ada halaman yang tersedia'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {!debouncedSearch && 'Mulai dengan menambahkan halaman pertama Anda.'}
                  </p>
                </div>
                {!debouncedSearch && (
                  <Link to="/admin/halaman/tambah">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Halaman Pertama
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
                    <TableHead className="w-[200px]">Slug</TableHead>
                    <TableHead className="w-[150px]">Diperbarui</TableHead>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {halaman.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    halaman.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="max-w-[280px] truncate" title={item.judul}>
                              {item.judul}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {item.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDate(item.diperbarui_pada)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link to={`/admin/halaman/edit/${item.id}`}>
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
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus halaman "{itemToDelete?.judul}"? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={cancelDelete}>
            Batal
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

