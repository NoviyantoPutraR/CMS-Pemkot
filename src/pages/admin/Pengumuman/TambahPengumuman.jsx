import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pengumumanSchema } from '../../../utils/validators'
import { pengumumanService } from '../../../services/pengumumanService'
import { storageService } from '../../../services/storageService'
import { generateSlug } from '../../../utils/formatters'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function TambahPengumuman() {
  const [loading, setLoading] = useState(false)
  const [lampiranFile, setLampiranFile] = useState(null)
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const konten = watch('konten')

  const handleJudulChange = (e) => {
    const judul = e.target.value
    setValue('judul', judul)
    if (judul) {
      setValue('slug', generateSlug(judul))
    }
  }

  const handleLampiranChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateDocumentFile(file)
        setLampiranFile(file)
      } catch (error) {
        toastError('VALIDATION', error.message)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      // Upload lampiran jika ada
      let lampiranUrl = ''
      if (lampiranFile) {
        const uploadResult = await storageService.uploadPengumumanLampiran(
          lampiranFile,
          'temp-' + Date.now()
        )
        lampiranUrl = uploadResult.url
      }

      const pengumumanData = {
        ...data,
        file_lampiran_url: lampiranUrl || null,
        tanggal_berlaku_mulai: data.tanggal_berlaku_mulai || null,
        tanggal_berlaku_selesai: data.tanggal_berlaku_selesai || null,
      }

      await pengumumanService.create(pengumumanData)

      toastSuccess('CREATE')
      navigate('/admin/pengumuman')
    } catch (error) {
      console.error('Error creating pengumuman:', error)
      toastError('CREATE', error.message || 'Gagal menambah pengumuman')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Pengumuman</h1>
        <p className="text-muted-foreground mt-2">
          Buat pengumuman resmi baru
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengumuman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input
                id="judul"
                {...register('judul')}
                onChange={handleJudulChange}
                placeholder="Masukkan judul pengumuman"
              />
              {errors.judul && (
                <p className="text-sm text-destructive">{errors.judul.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="url-slug-pengumuman"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Konten *</Label>
              <ReactQuill
                theme="snow"
                value={konten || ''}
                onChange={(value) => setValue('konten', value)}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
              {errors.konten && (
                <p className="text-sm text-destructive">{errors.konten.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_lampiran">File Lampiran</Label>
              <Input
                id="file_lampiran"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleLampiranChange}
              />
              {lampiranFile && (
                <p className="text-sm text-muted-foreground">
                  File: {lampiranFile.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal_berlaku_mulai">Tanggal Berlaku Mulai</Label>
                <Input
                  id="tanggal_berlaku_mulai"
                  type="date"
                  {...register('tanggal_berlaku_mulai')}
                />
                {errors.tanggal_berlaku_mulai && (
                  <p className="text-sm text-destructive">{errors.tanggal_berlaku_mulai.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggal_berlaku_selesai">Tanggal Berlaku Selesai</Label>
                <Input
                  id="tanggal_berlaku_selesai"
                  type="date"
                  {...register('tanggal_berlaku_selesai')}
                />
                {errors.tanggal_berlaku_selesai && (
                  <p className="text-sm text-destructive">{errors.tanggal_berlaku_selesai.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select id="status" {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Pengumuman'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/pengumuman')}
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

