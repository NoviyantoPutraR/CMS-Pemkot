import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transparansiAnggaranSchema } from '../../../utils/validators'
import { transparansiAnggaranService } from '../../../services/transparansiAnggaranService'
import { storageService } from '../../../services/storageService'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import { FileSpreadsheet, FileText, X, Download } from 'lucide-react'

export default function EditTransparansi() {
  const { id } = useParams()
  const [anggaran, setAnggaran] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [excelFile, setExcelFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const navigate = useNavigate()
  const { toastSuccess, toastError, toastWarning } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transparansiAnggaranSchema),
  })

  const status = watch('status')

  useEffect(() => {
    loadAnggaran()
  }, [id])

  const loadAnggaran = async () => {
    try {
      setLoading(true)
      const data = await transparansiAnggaranService.getById(id)
      setAnggaran(data)
      
      // Set form values
      setValue('tahun', data.tahun)
      setValue('deskripsi', data.deskripsi || '')
      setValue('status', data.status)
      setValue('file_excel_url', data.file_excel_url || '')
      setValue('file_pdf_url', data.file_pdf_url || '')
    } catch (error) {
      console.error('Error loading transparansi anggaran:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data transparansi anggaran')
    } finally {
      setLoading(false)
    }
  }

  const handleExcelChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateExcelFile(file)
        setExcelFile(file)
      } catch (error) {
        toastError('VALIDATION', error.message)
        e.target.value = ''
      }
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validatePdfFile(file)
        setPdfFile(file)
      } catch (error) {
        toastError('VALIDATION', error.message)
        e.target.value = ''
      }
    }
  }

  const removeExcelFile = () => {
    setExcelFile(null)
  }

  const removePdfFile = () => {
    setPdfFile(null)
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Upload file Excel jika ada file baru
      let excelUrl = anggaran.file_excel_url
      if (excelFile) {
        const uploadResult = await storageService.uploadTransparansiExcel(
          excelFile,
          data.tahun
        )
        excelUrl = uploadResult.url
      }

      // Upload file PDF jika ada file baru
      let pdfUrl = anggaran.file_pdf_url
      if (pdfFile) {
        const uploadResult = await storageService.uploadTransparansiPdf(
          pdfFile,
          data.tahun
        )
        pdfUrl = uploadResult.url
      }

      // Validasi: jika tidak ada file Excel existing dan tidak ada file baru
      if (!excelUrl) {
        toastError('VALIDATION', 'File Excel wajib ada. Silakan upload file Excel.')
        setSaving(false)
        return
      }

      // Prepare data untuk update
      const anggaranData = {
        tahun: data.tahun,
        file_excel_url: excelUrl,
        file_pdf_url: pdfUrl || null,
        deskripsi: data.deskripsi || null,
        status: data.status,
      }

      // Update anggaran
      await transparansiAnggaranService.update(id, anggaranData)

      toastSuccess('UPDATE')
      navigate('/admin/transparansi')
    } catch (error) {
      console.error('Error updating transparansi anggaran:', error)
      toastError('UPDATE', error.message || 'Gagal mengupdate transparansi anggaran')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Transparansi Anggaran</h1>
        <p className="text-muted-foreground mt-2">
          Edit data transparansi anggaran tahun {anggaran?.tahun}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Anggaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun *</Label>
              <Input
                id="tahun"
                type="number"
                {...register('tahun', { valueAsNumber: true })}
                min="2021"
                max="2026"
                disabled
              />
              {errors.tahun && (
                <p className="text-sm text-destructive">{errors.tahun.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Tahun tidak dapat diubah
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_excel">File Excel *</Label>
              {anggaran.file_excel_url && !excelFile && (
                <div className="mb-2 p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span className="text-sm flex-1">File Excel saat ini</span>
                    <a
                      href={anggaran.file_excel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                  </div>
                </div>
              )}
              <Input
                id="file_excel"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelChange}
              />
              {excelFile && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span className="text-sm flex-1">{excelFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(excelFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={removeExcelFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Kosongkan jika tidak ingin mengubah file. Format: .xlsx atau .xls, maksimal 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_pdf">File PDF (Opsional)</Label>
              {anggaran.file_pdf_url && !pdfFile && (
                <div className="mb-2 p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="text-sm flex-1">File PDF saat ini</span>
                    <a
                      href={anggaran.file_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                  </div>
                </div>
              )}
              <Input
                id="file_pdf"
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
              />
              {pdfFile && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span className="text-sm flex-1">{pdfFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={removePdfFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Kosongkan jika tidak ingin mengubah file. Format: .pdf, maksimal 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
                placeholder="Masukkan deskripsi anggaran (opsional)"
                rows={4}
              />
              {errors.deskripsi && (
                <p className="text-sm text-destructive">{errors.deskripsi.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maksimal 500 karakter
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setValue('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/transparansi')}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

