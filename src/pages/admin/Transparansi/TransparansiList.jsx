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
import { transparansiAnggaranService } from '../../../services/transparansiAnggaranService'
import { useDebounce } from '../../../hooks/useDebounce'
import { useToast } from '../../../hooks/useToast'
import Loading from '../../../components/shared/Loading'
import DeleteConfirmDialog from '../../../components/shared/DeleteConfirmDialog'
import { Plus, Edit, Trash2, Eye, EyeOff, FileSpreadsheet, FileText, Download, Search } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'

export default function TransparansiList() {
  const { toastSuccess, toastError } = useToast()
  const [anggaran, setAnggaran] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [toggling, setToggling] = useState(null)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [existingYears, setExistingYears] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    loadAnggaran()
  }, [debouncedSearch, filterStatus])

  const loadAnggaran = async () => {
    try {
      setLoading(true)
      const data = await transparansiAnggaranService.getAll()
      
      // Extract existing years
      const years = data.map(item => item.tahun)
      setExistingYears(years)
      
      // Filter by status if selected
      let filteredData = data
      if (filterStatus) {
        filteredData = filteredData.filter(item => item.status === filterStatus)
      }
      
      // Filter by search (tahun or deskripsi)
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase()
        filteredData = filteredData.filter(item => 
          item.tahun.toString().includes(searchLower) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchLower))
        )
      }
      
      setAnggaran(filteredData)
    } catch (error) {
      console.error('Error loading transparansi anggaran:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data transparansi anggaran')
    } finally {
      setLoading(false)
    }
  }

  const handleExpandRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id)
  }

  const isCreateDisabled = () => {
    // Check if all years from 2021-2026 exist
    const allYears = [2021, 2022, 2023, 2024, 2025, 2026]
    return allYears.every(year => existingYears.includes(year))
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setToggling(id)
      await transparansiAnggaranService.toggleStatus(id, currentStatus)
      toastSuccess('TOGGLE_STATUS')
      loadAnggaran()
    } catch (error) {
      console.error('Error toggling status:', error)
      toastError('TOGGLE_STATUS', error.message || 'Gagal mengubah status anggaran')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = (id, tahun) => {
    setItemToDelete({ id, tahun })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await transparansiAnggaranService.delete(itemToDelete.id)
      toastSuccess('DELETE')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadAnggaran()
    } catch (error) {
      console.error('Error deleting anggaran:', error)
      toastError('DELETE', error.message || 'Gagal menghapus anggaran')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  if (loading && anggaran.length === 0) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Transparansi Anggaran</CardTitle>
              <CardDescription className="mt-2">
                Kelola data transparansi anggaran per tahun
              </CardDescription>
            </div>
            <Link to="/admin/transparansi/tambah">
              <Button disabled={isCreateDisabled()}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggaran
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari tahun atau deskripsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-background"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>

          {anggaran.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Belum ada data anggaran
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : filterStatus 
                      ? `Tidak ada data dengan status "${filterStatus}".`
                      : 'Upload laporan pertama untuk memulai.'}
                  </p>
                </div>
                {!debouncedSearch && !filterStatus && (
                  <Link to="/admin/transparansi/tambah">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Anggaran Pertama
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
                    <TableHead className="w-[100px]">Tahun</TableHead>
                    <TableHead className="w-[150px]">File</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[180px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anggaran.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    anggaran.map((item) => (
                      <Fragment key={item.id}>
                        <TableRow 
                          className="cursor-pointer"
                          onClick={() => handleExpandRow(item.id)}
                        >
                          <TableCell className="font-bold">
                            {item.tahun}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5" title="File Excel">
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                <span className="text-xs">Excel</span>
                              </div>
                              {item.file_pdf_url ? (
                                <div className="flex items-center gap-1.5" title="File PDF">
                                  <FileText className="w-4 h-4 text-red-600" />
                                  <span className="text-xs">PDF</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="max-w-[400px] truncate" title={item.deskripsi || 'Tidak ada deskripsi'}>
                              {item.deskripsi || 'Tidak ada deskripsi'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'published'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.file_excel_url && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(item.file_excel_url, '_blank')
                                  }}
                                  title="Download Excel"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                              {item.file_pdf_url && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(item.file_pdf_url, '_blank')
                                  }}
                                  title="Download PDF"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleStatus(item.id, item.status)
                                }}
                                disabled={toggling === item.id}
                                title={item.status === 'published' ? 'Ubah ke Draft' : 'Publish'}
                                className="h-8 w-8"
                              >
                                {toggling === item.id ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : item.status === 'published' ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Link to={`/admin/transparansi/edit/${item.id}`} onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(item.id, item.tahun)
                                }}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRowId === item.id && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-muted/30">
                              <div className="p-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Deskripsi Lengkap</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.deskripsi || 'Tidak ada deskripsi'}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Informasi File</h4>
                                  <div className="space-y-2">
                                    {item.file_excel_url && (
                                      <div className="flex items-center justify-between p-2 bg-background rounded">
                                        <div className="flex items-center gap-2">
                                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                          <span className="text-sm">File Excel</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-muted-foreground">
                                            Upload: {formatDate(item.dibuat_pada)}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(item.file_excel_url, '_blank')}
                                          >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    {item.file_pdf_url ? (
                                      <div className="flex items-center justify-between p-2 bg-background rounded">
                                        <div className="flex items-center gap-2">
                                          <FileText className="w-5 h-5 text-red-600" />
                                          <span className="text-sm">File PDF</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-muted-foreground">
                                            Upload: {formatDate(item.dibuat_pada)}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(item.file_pdf_url, '_blank')}
                                          >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 p-2 bg-background rounded text-muted-foreground">
                                        <FileText className="w-5 h-5" />
                                        <span className="text-sm">File PDF belum diupload</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Dibuat: {formatDate(item.dibuat_pada)} | 
                                  Diperbarui: {formatDate(item.diperbarui_pada)}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.tahun ? `Anggaran Tahun ${itemToDelete.tahun}` : null}
      />
    </div>
  )
}

