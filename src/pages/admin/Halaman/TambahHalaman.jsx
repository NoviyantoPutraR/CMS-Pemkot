import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { halamanSchema, validateQuillContent } from '../../../utils/validators'
import { halamanService } from '../../../services/halamanService'
import { generateSlug } from '../../../utils/formatters'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { AlertCircle } from 'lucide-react'

export default function TambahHalaman() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
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
  const slug = watch('slug')

  const handleJudulChange = (e) => {
    const judul = e.target.value
    setValue('judul', judul)
    if (judul) {
      setValue('slug', generateSlug(judul))
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError(null)

      // Validasi konten ReactQuill sebelum submit
      const contentValidation = validateQuillContent(data.konten, 50)
      if (!contentValidation.isValid) {
        setError(contentValidation.message)
        toastError('VALIDATION', contentValidation.message)
        setLoading(false)
        return
      }

      // Create halaman
      await halamanService.create({
        ...data,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
      })

      toastSuccess('CREATE')
      navigate('/admin/halaman')
    } catch (error) {
      console.error('Error creating halaman:', error)
      const errorMessage = error.message || 'Gagal menambah halaman. Silakan coba lagi.'
      setError(errorMessage)
      toastError('CREATE', errorMessage)
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Halaman</h1>
        <p className="text-muted-foreground mt-2">
          Buat halaman baru
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Halaman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input
                id="judul"
                {...register('judul')}
                onChange={handleJudulChange}
                placeholder="Masukkan judul halaman"
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
                value={slug || ''}
                placeholder="url-slug-halaman"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Slug akan otomatis di-generate dari judul. Anda dapat mengeditnya jika diperlukan.
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Halaman'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/halaman')}
                disabled={loading}
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

