import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import Loading from '../../../components/shared/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function EditWisata() {
  const { id } = useParams()
  const [wisata, setWisata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  })

  const konten = watch('konten')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const wisataData = await wisataService.getById(id)
      setWisata(wisataData)
      
      setValue('nama', wisataData.nama)
      setValue('slug', wisataData.slug)
      setValue('deskripsi', wisataData.deskripsi || '')
      setValue('konten', wisataData.konten)
      setValue('alamat', wisataData.alamat || '')
      setValue('koordinat_lat', wisataData.koordinat_lat || '')
      setValue('koordinat_lng', wisataData.koordinat_lng || '')
      setValue('status', wisataData.status)
      setValue('meta_description', wisataData.meta_description || '')
      
      if (wisataData.gambar_url) {
        setGambarPreview(wisataData.gambar_url)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toastError('LOAD_DATA', error.message || 'Gagal memuat data wisata')
    } finally {
      setLoading(false)
    }
  }

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
      setSaving(true)

      // Upload gambar jika ada file baru
      let gambarUrl = wisata.gambar_url
      if (gambarFile) {
        const uploadResult = await storageService.uploadWisataGambar(
          gambarFile,
          id
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

      await wisataService.update(id, wisataData)

      toastSuccess('UPDATE')
      navigate('/admin/wisata')
    } catch (error) {
      console.error('Error updating wisata:', error)
      toastError('UPDATE', error.message || 'Gagal mengupdate wisata')
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
        <h1 className="text-3xl font-bold">Edit Wisata</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi destinasi wisata
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
              />
              {errors.nama && (
                <p className="text-sm text-destructive">{errors.nama.message}</p>
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
              <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
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
              <Label htmlFor="gambar">Gambar Utama</Label>
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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

