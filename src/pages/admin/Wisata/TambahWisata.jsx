import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wisataSchema } from '../../../utils/validators'
import { wisataService } from '../../../services/wisataService'
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

export default function TambahWisata() {
  const [loading, setLoading] = useState(false)
  const [gambarFile, setGambarFile] = useState(null)
  const [gambarPreview, setGambarPreview] = useState('')
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(wisataSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const konten = watch('konten')

  const handleNamaChange = (e) => {
    const nama = e.target.value
    setValue('nama', nama)
    if (nama) {
      setValue('slug', generateSlug(nama))
    }
  }

  const handleGambarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateLargeImageFile(file)
        setGambarFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setGambarPreview(reader.result)
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

      // Upload gambar jika ada
      let gambarUrl = ''
      if (gambarFile) {
        const uploadResult = await storageService.uploadWisataGambar(
          gambarFile,
          'temp-' + Date.now()
        )
        gambarUrl = uploadResult.url
      }

      // Clean data
      const wisataData = {
        ...data,
        gambar_url: gambarUrl || null,
        koordinat_lat: data.koordinat_lat || null,
        koordinat_lng: data.koordinat_lng || null,
      }

      await wisataService.create(wisataData)

      toastSuccess('CREATE')
      navigate('/admin/wisata')
    } catch (error) {
      console.error('Error creating wisata:', error)
      toastError('CREATE', error.message || 'Gagal menambah wisata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Wisata</h1>
        <p className="text-muted-foreground mt-2">
          Buat destinasi wisata baru
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Wisata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Destinasi *</Label>
              <Input
                id="nama"
                {...register('nama')}
                onChange={handleNamaChange}
                placeholder="Masukkan nama destinasi wisata"
              />
              {errors.nama && (
                <p className="text-sm text-destructive">{errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="url-slug-wisata"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
                placeholder="Deskripsi singkat (opsional)"
                rows={3}
              />
              {errors.deskripsi && (
                <p className="text-sm text-destructive">{errors.deskripsi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Konten Lengkap *</Label>
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
              <Label htmlFor="gambar">Gambar Utama *</Label>
              <Input
                id="gambar"
                type="file"
                accept="image/*"
                onChange={handleGambarChange}
              />
              {gambarPreview && (
                <img
                  src={gambarPreview}
                  alt="Preview"
                  className="mt-2 w-full h-64 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                {...register('alamat')}
                placeholder="Alamat destinasi (opsional)"
                rows={2}
              />
              {errors.alamat && (
                <p className="text-sm text-destructive">{errors.alamat.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="koordinat_lat">Koordinat Latitude</Label>
                <Input
                  id="koordinat_lat"
                  type="number"
                  step="any"
                  {...register('koordinat_lat', { valueAsNumber: true })}
                  placeholder="-6.2088"
                />
                {errors.koordinat_lat && (
                  <p className="text-sm text-destructive">{errors.koordinat_lat.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="koordinat_lng">Koordinat Longitude</Label>
                <Input
                  id="koordinat_lng"
                  type="number"
                  step="any"
                  {...register('koordinat_lng', { valueAsNumber: true })}
                  placeholder="106.8456"
                />
                {errors.koordinat_lng && (
                  <p className="text-sm text-destructive">{errors.koordinat_lng.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                {...register('meta_description')}
                placeholder="Deskripsi untuk SEO (maks 160 karakter)"
                rows={2}
              />
              {errors.meta_description && (
                <p className="text-sm text-destructive">{errors.meta_description.message}</p>
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
                {loading ? 'Menyimpan...' : 'Simpan Wisata'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/wisata')}
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

