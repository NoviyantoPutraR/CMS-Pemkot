import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { perangkatDaerahSchema } from '../../../utils/validators'
import { perangkatDaerahService } from '../../../services/perangkatDaerahService'
import { storageService } from '../../../services/storageService'
import { generateSlug } from '../../../utils/formatters'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function TambahPerangkatDaerah() {
  const [loading, setLoading] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState('')
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(perangkatDaerahSchema),
    defaultValues: {
      aktif: true,
      urutan: undefined,
    },
  })

  const aktif = watch('aktif')

  const handleNamaPerangkatChange = (e) => {
    const nama = e.target.value
    setValue('nama_perangkat', nama)
    if (nama) {
      setValue('slug', generateSlug(nama))
    }
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateImageFile(file)
        setFotoFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setFotoPreview(reader.result)
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

      // Generate slug jika belum ada (fallback)
      if (!data.slug && data.nama_perangkat) {
        data.slug = generateSlug(data.nama_perangkat)
      }

      // Upload foto jika ada
      let fotoUrl = ''
      if (fotoFile) {
        const uploadResult = await storageService.uploadPerangkatDaerahFoto(
          fotoFile,
          'temp-' + Date.now()
        )
        fotoUrl = uploadResult.url
      }

      // Prepare data untuk create
      const perangkatData = {
        nama_perangkat: data.nama_perangkat,
        slug: data.slug,
        jabatan_kepala: data.jabatan_kepala || null,
        nama_kepala: data.nama_kepala || null,
        foto_url: fotoUrl || null,
        kontak: data.kontak || null,
        alamat: data.alamat || null,
        deskripsi: data.deskripsi || null,
        urutan: data.urutan && !isNaN(data.urutan) ? parseInt(data.urutan) : null,
        aktif: data.aktif,
      }

      // Create perangkat daerah
      await perangkatDaerahService.create(perangkatData)

      toastSuccess('CREATE')
      navigate('/admin/perangkat-daerah')
    } catch (error) {
      console.error('Error creating perangkat daerah:', error)
      toastError('CREATE', error.message || 'Gagal menambah perangkat daerah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Perangkat Daerah</h1>
        <p className="text-muted-foreground mt-2">
          Buat perangkat daerah baru
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perangkat Daerah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama_perangkat">Nama Perangkat *</Label>
              <Input
                id="nama_perangkat"
                {...register('nama_perangkat')}
                onChange={handleNamaPerangkatChange}
                placeholder="Masukkan nama perangkat daerah"
              />
              {errors.nama_perangkat && (
                <p className="text-sm text-destructive">{errors.nama_perangkat.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="url-slug-perangkat-daerah"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jabatan_kepala">Jabatan Kepala</Label>
                <Input
                  id="jabatan_kepala"
                  {...register('jabatan_kepala')}
                  placeholder="Contoh: Kepala Dinas"
                />
                {errors.jabatan_kepala && (
                  <p className="text-sm text-destructive">{errors.jabatan_kepala.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_kepala">Nama Kepala</Label>
                <Input
                  id="nama_kepala"
                  {...register('nama_kepala')}
                  placeholder="Masukkan nama kepala"
                />
                {errors.nama_kepala && (
                  <p className="text-sm text-destructive">{errors.nama_kepala.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto">Foto</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
              />
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kontak">Kontak</Label>
              <Input
                id="kontak"
                {...register('kontak')}
                placeholder="Contoh: (021) 12345678 atau email@example.com"
              />
              {errors.kontak && (
                <p className="text-sm text-destructive">{errors.kontak.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                {...register('alamat')}
                placeholder="Masukkan alamat lengkap"
                rows={3}
              />
              {errors.alamat && (
                <p className="text-sm text-destructive">{errors.alamat.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
                placeholder="Masukkan deskripsi perangkat daerah"
                rows={4}
              />
              {errors.deskripsi && (
                <p className="text-sm text-destructive">{errors.deskripsi.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urutan">Urutan</Label>
                <Input
                  id="urutan"
                  type="number"
                  {...register('urutan', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.urutan && (
                  <p className="text-sm text-destructive">{errors.urutan.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aktif">Status Aktif *</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={aktif === true}
                      onChange={() => setValue('aktif', true)}
                      className="w-4 h-4"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={aktif === false}
                      onChange={() => setValue('aktif', false)}
                      className="w-4 h-4"
                    />
                    <span>Nonaktif</span>
                  </label>
                </div>
                {errors.aktif && (
                  <p className="text-sm text-destructive">{errors.aktif.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perangkat Daerah'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/perangkat-daerah')}
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

