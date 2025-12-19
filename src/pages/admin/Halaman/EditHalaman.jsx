import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { halamanSchema, validateQuillContent } from '../../../utils/validators'
import { halamanService } from '../../../services/halamanService'
import useAuthStore from '../../../store/useAuthStore'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function EditHalaman() {
  const { id } = useParams()
  const [halaman, setHalaman] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(halamanSchema),
  })

  const konten = watch('konten')

  useEffect(() => {
    loadHalaman()
  }, [id])

  // Auto-hide success message setelah 3 detik
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const loadHalaman = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await halamanService.getById(id)
      setHalaman(data)
      setValue('judul', data.judul || '')
      setValue('slug', data.slug || '')
      setValue('konten', data.konten || '')
      setValue('meta_description', data.meta_description || '')
      setValue('meta_keywords', data.meta_keywords || '')
    } catch (error) {
      console.error('Error loading halaman:', error)
      setError(
        error.message || 'Gagal memuat data halaman. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Validasi konten ReactQuill sebelum submit
      const contentValidation = validateQuillContent(data.konten, 50)
      if (!contentValidation.isValid) {
        setError(contentValidation.message)
        toastError('VALIDATION', contentValidation.message)
        setSaving(false)
        return
      }

      // Siapkan data update
      const updateData = {
        ...data,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
      }

      await halamanService.update(id, updateData)

      setSuccess(true)
      toastSuccess('UPDATE')
      // Navigate setelah 1.5 detik untuk memberikan feedback visual
      setTimeout(() => {
        navigate('/admin/halaman')
      }, 1500)
    } catch (error) {
      console.error('Error updating halaman:', error)
      const errorMessage = error.message || 'Gagal mengupdate halaman. Silakan coba lagi.'
      setError(errorMessage)
      toastError('UPDATE', errorMessage)
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Halaman</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi halaman: {halaman?.judul}
        </p>
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  {error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="mb-4 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Halaman berhasil diperbarui!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Halaman</CardTitle>
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
              <Input id="slug" {...register('slug')} placeholder="url-slug-halaman" />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Slug digunakan untuk URL halaman. Hanya boleh mengandung huruf kecil, angka, dan tanda hubung.
              </p>
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
              <p className="text-xs text-muted-foreground">
                Konten harus minimal 50 karakter (tidak termasuk formatting HTML)
              </p>
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
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                {...register('meta_keywords')}
                placeholder="Kata kunci untuk SEO, pisahkan dengan koma (maks 255 karakter)"
              />
              {errors.meta_keywords && (
                <p className="text-sm text-destructive">
                  {errors.meta_keywords.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/halaman')}
                disabled={saving}
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

