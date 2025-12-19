import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sosialMediaSchema } from '../../../utils/validators'
import { sosialMediaService } from '../../../services/sosialMediaService'
import { storageService } from '../../../services/storageService'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'

const PLATFORM_NAMES = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export default function EditSosialMedia() {
  const { id } = useParams()
  const [sosialMedia, setSosialMedia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ikonFile, setIkonFile] = useState(null)
  const [ikonPreview, setIkonPreview] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sosialMediaSchema),
  })

  const aktif = watch('aktif')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await sosialMediaService.getById(id)
      setSosialMedia(data)
      
      setValue('url', data.url)
      setValue('aktif', data.aktif)
      setValue('urutan', data.urutan || '')
      
      if (data.ikon_url) {
        setIkonPreview(data.ikon_url)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Gagal memuat data sosial media')
    } finally {
      setLoading(false)
    }
  }

  const handleIkonChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        storageService.validateImageFile(file)
        setIkonFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setIkonPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Upload ikon jika ada file baru
      let ikonUrl = sosialMedia.ikon_url
      if (ikonFile) {
        const uploadResult = await storageService.uploadSosialMediaIcon(
          ikonFile,
          sosialMedia.platform
        )
        ikonUrl = uploadResult.url
      }

      const sosialMediaData = {
        ...data,
        ikon_url: ikonUrl || null,
        urutan: data.urutan || null,
      }

      await sosialMediaService.update(id, sosialMediaData)

      navigate('/admin/sosial-media')
    } catch (error) {
      console.error('Error updating sosial media:', error)
      alert('Gagal mengupdate sosial media: ' + error.message)
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
        <h1 className="text-3xl font-bold">Edit Sosial Media</h1>
        <p className="text-muted-foreground mt-2">
          Edit {PLATFORM_NAMES[sosialMedia?.platform] || sosialMedia?.platform}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Sosial Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                {...register('url')}
                placeholder="https://..."
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ikon">Ikon Custom</Label>
              <Input
                id="ikon"
                type="file"
                accept="image/*"
                onChange={handleIkonChange}
              />
              {ikonPreview && (
                <img
                  src={ikonPreview}
                  alt="Preview"
                  className="mt-2 w-16 h-16 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urutan">Urutan</Label>
              <Input
                id="urutan"
                type="number"
                {...register('urutan', { valueAsNumber: true })}
                placeholder="Urutan tampil (opsional)"
              />
              {errors.urutan && (
                <p className="text-sm text-destructive">{errors.urutan.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aktif"
                checked={aktif}
                onChange={(e) => setValue('aktif', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="aktif" className="cursor-pointer">
                Aktif
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/sosial-media')}
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

