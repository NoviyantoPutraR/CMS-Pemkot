import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pengaturanSitusSchema } from '../../../utils/validators'
import { pengaturanSitusService } from '../../../services/pengaturanSitusService'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'

export default function EditPengaturan() {
  const { id } = useParams()
  const [pengaturan, setPengaturan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pengaturanSitusSchema),
  })

  const nilai = watch('nilai')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await pengaturanSitusService.getById(id)
      setPengaturan(data)
      
      setValue('nilai', data.nilai)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Gagal memuat data pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      await pengaturanSitusService.update(id, data)

      navigate('/admin/pengaturan')
    } catch (error) {
      console.error('Error updating pengaturan:', error)
      alert('Gagal mengupdate pengaturan: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  const renderInput = () => {
    switch (pengaturan.tipe) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="nilai"
              checked={nilai === 'true' || nilai === true}
              onChange={(e) => setValue('nilai', e.target.checked ? 'true' : 'false')}
              className="w-4 h-4"
            />
            <Label htmlFor="nilai" className="cursor-pointer">
              Aktif
            </Label>
          </div>
        )
      case 'email':
        return (
          <Input
            id="nilai"
            type="email"
            {...register('nilai')}
          />
        )
      case 'url':
        return (
          <Input
            id="nilai"
            type="url"
            {...register('nilai')}
          />
        )
      case 'phone':
        return (
          <Input
            id="nilai"
            type="tel"
            {...register('nilai')}
          />
        )
      case 'number':
        return (
          <Input
            id="nilai"
            type="number"
            {...register('nilai')}
          />
        )
      default:
        return pengaturan.deskripsi && pengaturan.deskripsi.length > 100 ? (
          <Textarea
            id="nilai"
            {...register('nilai')}
            rows={4}
          />
        ) : (
          <Input
            id="nilai"
            {...register('nilai')}
          />
        )
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Pengaturan</h1>
        <p className="text-muted-foreground mt-2">
          Edit {pengaturan.kunci}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="kunci">Kunci</Label>
              <Input
                id="kunci"
                value={pengaturan.kunci}
                disabled
                className="bg-gray-100"
              />
            </div>

            {pengaturan.deskripsi && (
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <p className="text-sm text-muted-foreground">{pengaturan.deskripsi}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nilai">Nilai *</Label>
              {renderInput()}
              {errors.nilai && (
                <p className="text-sm text-destructive">{errors.nilai.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/pengaturan')}
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

