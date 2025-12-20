import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { videoSchema } from '../../../utils/validators'
import { videoService } from '../../../services/videoService'
import { storageService } from '../../../services/storageService'
import { generateSlug } from '../../../utils/formatters'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function TambahVideo() {
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const handleJudulChange = (e) => {
    const judul = e.target.value
    setValue('judul', judul)
    if (judul) {
      setValue('slug', generateSlug(judul))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateImageFile(file)
        setThumbnailFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setThumbnailPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        toastError('VALIDATION', error.message)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      // Upload thumbnail jika ada
      let thumbnailUrl = ''
      if (thumbnailFile) {
        const uploadResult = await storageService.uploadVideoThumbnail(
          thumbnailFile,
          'temp-' + Date.now()
        )
        thumbnailUrl = uploadResult.url
      }

      const videoData = {
        ...data,
        thumbnail_url: thumbnailUrl || null,
        durasi: data.durasi || null,
      }

      await videoService.create(videoData)

      toastSuccess('CREATE')
      navigate('/admin/video')
    } catch (error) {
      console.error('Error creating video:', error)
      toastError('CREATE', error.message || 'Gagal menambah video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Video</h1>
        <p className="text-muted-foreground mt-2">
          Tambah video informasi publik baru
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input
                id="judul"
                {...register('judul')}
                onChange={handleJudulChange}
                placeholder="Masukkan judul video"
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
                placeholder="url-slug-video"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
                placeholder="Deskripsi video (opsional)"
                rows={3}
              />
              {errors.deskripsi && (
                <p className="text-sm text-destructive">{errors.deskripsi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_video">URL Video *</Label>
              <Input
                id="url_video"
                {...register('url_video')}
                placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
              />
              {errors.url_video && (
                <p className="text-sm text-destructive">{errors.url_video.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Masukkan URL YouTube, Vimeo, atau URL file video
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="mt-2 w-48 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durasi">Durasi (detik)</Label>
              <Input
                id="durasi"
                type="number"
                {...register('durasi', { valueAsNumber: true })}
                placeholder="Durasi dalam detik (opsional)"
              />
              {errors.durasi && (
                <p className="text-sm text-destructive">{errors.durasi.message}</p>
              )}
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
                {loading ? 'Menyimpan...' : 'Simpan Video'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/video')}
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

