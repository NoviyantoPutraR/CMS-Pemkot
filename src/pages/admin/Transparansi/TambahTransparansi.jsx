import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transparansiAnggaranSchema } from '../../../utils/validators'
import { transparansiAnggaranService } from '../../../services/transparansiAnggaranService'
import { storageService } from '../../../services/storageService'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { FileSpreadsheet, FileText, X } from 'lucide-react'

export default function TambahTransparansi() {
  const [loading, setLoading] = useState(false)
  const [excelFile, setExcelFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transparansiAnggaranSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const status = watch('status')
  const tahun = watch('tahun')

  const handleExcelChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateExcelFile(file)
        setExcelFile(file)
      } catch (error) {
        alert(error.message)
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
        alert(error.message)
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
      setLoading(true)

      // Validasi file Excel wajib
      if (!excelFile) {
        alert('File Excel wajib diupload')
        return
      }

      // Cek apakah tahun sudah ada
      try {
        const existing = await transparansiAnggaranService.getByTahun(data.tahun)
        if (existing) {
          alert(`Anggaran untuk tahun ${data.tahun} sudah ada`)
          setLoading(false)
          return
        }
      } catch (error) {
        // Jika tidak ditemukan (error code PGRST116 atau error message mengandung "No rows"), lanjutkan
        if (error.code !== 'PGRST116' && !error.message?.includes('No rows')) {
          throw error
        }
        // Jika tidak ditemukan, lanjutkan proses
      }

      // Upload file Excel
      let excelUrl = ''
      if (excelFile) {
        const uploadResult = await storageService.uploadTransparansiExcel(
          excelFile,
          data.tahun
        )
        excelUrl = uploadResult.url
      }

      // Upload file PDF jika ada
      let pdfUrl = ''
      if (pdfFile) {
        const uploadResult = await storageService.uploadTransparansiPdf(
          pdfFile,
          data.tahun
        )
        pdfUrl = uploadResult.url
      }

      // Prepare data untuk create
      const anggaranData = {
        tahun: data.tahun,
        file_excel_url: excelUrl,
        file_pdf_url: pdfUrl || null,
        deskripsi: data.deskripsi || null,
        status: data.status,
      }

      // Create anggaran
      await transparansiAnggaranService.create(anggaranData)

      navigate('/admin/transparansi')
    } catch (error) {
      console.error('Error creating transparansi anggaran:', error)
      alert('Gagal menambah transparansi anggaran: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Transparansi Anggaran</h1>
        <p className="text-muted-foreground mt-2">
          Tambah data transparansi anggaran baru
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
                placeholder="2021"
                min="2021"
                max="2026"
              />
              {errors.tahun && (
                <p className="text-sm text-destructive">{errors.tahun.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Pilih tahun antara 2021-2026
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_excel">File Excel *</Label>
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
                Format: .xlsx atau .xls, maksimal 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_pdf">File PDF (Opsional)</Label>
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
                Format: .pdf, maksimal 10MB
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Anggaran'}
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

