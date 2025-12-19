import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pengumumanSchema } from '../../../utils/validators'
import { pengumumanService } from '../../../services/pengumumanService'
import { storageService } from '../../../services/storageService'
import { generateSlug } from '../../../utils/formatters'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function EditPengumuman() {
  const { id } = useParams()
  const [pengumuman, setPengumuman] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lampiranFile, setLampiranFile] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pengumumanSchema),
  })

  const konten = watch('konten')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const pengumumanData = await pengumumanService.getById(id)
      setPengumuman(pengumumanData)
      
      setValue('judul', pengumumanData.judul)
      setValue('slug', pengumumanData.slug)
      setValue('konten', pengumumanData.konten)
      setValue('status', pengumumanData.status)
      setValue('tanggal_berlaku_mulai', pengumumanData.tanggal_berlaku_mulai || '')
      setValue('tanggal_berlaku_selesai', pengumumanData.tanggal_berlaku_selesai || '')
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Gagal memuat data pengumuman')
    } finally {
      setLoading(false)
    }
  }

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
        alert(error.message)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Upload lampiran jika ada file baru
      let lampiranUrl = pengumuman.file_lampiran_url
      if (lampiranFile) {
        const uploadResult = await storageService.uploadPengumumanLampiran(
          lampiranFile,
          id
        )
        lampiranUrl = uploadResult.url
      }

      const pengumumanData = {
        ...data,
        file_lampiran_url: lampiranUrl || null,
        tanggal_berlaku_mulai: data.tanggal_berlaku_mulai || null,
        tanggal_berlaku_selesai: data.tanggal_berlaku_selesai || null,
      }

      await pengumumanService.update(id, pengumumanData)

      navigate('/admin/pengumuman')
    } catch (error) {
      console.error('Error updating pengumuman:', error)
      alert('Gagal mengupdate pengumuman: ' + error.message)
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
        <h1 className="text-3xl font-bold">Edit Pengumuman</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi pengumuman
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
              />
              {errors.judul && (
                <p className="text-sm text-destructive">{errors.judul.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register('slug')} />
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
              {pengumuman.file_lampiran_url && !lampiranFile && (
                <p className="text-sm text-muted-foreground">
                  File saat ini: <a href={pengumuman.file_lampiran_url} target="_blank" rel="noopener noreferrer" className="text-primary">Lihat file</a>
                </p>
              )}
              {lampiranFile && (
                <p className="text-sm text-muted-foreground">
                  File baru: {lampiranFile.name}
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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

