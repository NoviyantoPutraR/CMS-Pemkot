import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import Loading from '../../../components/shared/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function EditArtikel() {
  const { id } = useParams()
  const [artikel, setArtikel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  })

  const konten = watch('konten')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const artikelData = await artikelService.getById(id)
      setArtikel(artikelData)
      
      // Set form values
      setValue('judul', artikelData.judul)
      setValue('slug', artikelData.slug)
      setValue('konten', artikelData.konten)
      setValue('status', artikelData.status)
      setValue('meta_description', artikelData.meta_description || '')
      
      if (artikelData.thumbnail_url) {
        setThumbnailPreview(artikelData.thumbnail_url)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data artikel')
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
      setSaving(true)

      // Upload thumbnail jika ada file baru
      let thumbnailUrl = artikel.thumbnail_url
      if (thumbnailFile) {
        const uploadResult = await storageService.uploadArtikelThumbnail(
          thumbnailFile,
          id
        )
        thumbnailUrl = uploadResult.url
      }

      // Update artikel
      await artikelService.update(id, {
        ...data,
        thumbnail_url: thumbnailUrl,
      })

      toastSuccess('UPDATE')
      navigate('/admin/artikel')
    } catch (error) {
      console.error('Error updating artikel:', error)
      toastError('UPDATE', error.message || 'Gagal mengupdate artikel')
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
        <h1 className="text-3xl font-bold">Edit Artikel</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi artikel
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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

