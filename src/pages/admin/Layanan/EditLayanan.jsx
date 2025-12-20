import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { layananSchema } from '../../../utils/validators'
import { layananService } from '../../../services/layananService'
import { storageService } from '../../../services/storageService'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function EditLayanan() {
  const { id } = useParams()
  const [layanan, setLayanan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState('')
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(layananSchema),
  })

  const konten = watch('konten')

  useEffect(() => {
    loadLayanan()
  }, [id])

  const loadLayanan = async () => {
    try {
      setLoading(true)
      const data = await layananService.getById(id)
      setLayanan(data)
      setValue('judul', data.judul)
      setValue('slug', data.slug)
      setValue('konten', data.konten)
      setValue('status', data.status || 'draft')
      if (data.icon_url) {
        setIconPreview(data.icon_url)
      }
    } catch (error) {
      console.error('Error loading layanan:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data layanan')
    } finally {
      setLoading(false)
    }
  }

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateImageFile(file)
        setIconFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setIconPreview(reader.result)
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

      // Upload icon jika ada file baru
      let iconUrl = layanan.icon_url
      if (iconFile) {
        const uploadResult = await storageService.uploadLayananIcon(iconFile, id)
        iconUrl = uploadResult.url
      }

      // Update layanan
      await layananService.update(id, {
        ...data,
        icon_url: iconUrl,
      })

      toastSuccess('UPDATE')
      navigate('/admin/layanan')
    } catch (error) {
      console.error('Error updating layanan:', error)
      toastError('UPDATE', error.message || 'Gagal mengupdate layanan')
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
        <h1 className="text-3xl font-bold">Edit Layanan</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi layanan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Layanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input id="judul" {...register('judul')} />
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
              <Label htmlFor="icon">Icon/Gambar</Label>
              <Input
                id="icon"
                type="file"
                accept="image/*"
                onChange={handleIconChange}
              />
              {iconPreview && (
                <img
                  src={iconPreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                onClick={() => navigate('/admin/layanan')}
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

