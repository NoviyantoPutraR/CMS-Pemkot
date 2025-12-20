import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artikelSchema } from '../../../utils/validators'
import { artikelService } from '../../../services/artikelService'
import { storageService } from '../../../services/storageService'
import { generateSlug } from '../../../utils/formatters'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function TambahArtikel() {
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(artikelSchema),
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
      let thumbnailUrl = data.thumbnail_url || ''
      if (thumbnailFile) {
        const uploadResult = await storageService.uploadArtikelThumbnail(
          thumbnailFile,
          'temp-' + Date.now()
        )
        thumbnailUrl = uploadResult.url
      }

      // Create artikel
      await artikelService.create({
        ...data,
        thumbnail_url: thumbnailUrl,
      })

      toastSuccess('CREATE')
      navigate('/admin/artikel')
    } catch (error) {
      console.error('Error creating artikel:', error)
      toastError('CREATE', error.message || 'Gagal menambah artikel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Artikel</h1>
        <p className="text-muted-foreground mt-2">
          Buat artikel baru
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input
                id="judul"
                {...register('judul')}
                onChange={handleJudulChange}
                placeholder="Masukkan judul artikel"
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
                placeholder="url-slug-artikel"
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
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                {...register('meta_description')}
                placeholder="Deskripsi singkat untuk SEO (maks 160 karakter)"
                rows={3}
              />
              {errors.meta_description && (
                <p className="text-sm text-destructive">
                  {errors.meta_description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select id="status" {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Artikel'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/artikel')}
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

