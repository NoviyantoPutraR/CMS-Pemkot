import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { agendaSchema } from '../../../utils/validators'
import { agendaKotaService } from '../../../services/agendaKotaService'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Loading from '../../../components/shared/Loading'
import { AGENDA_STATUS } from '../../../utils/constants'

export default function EditAgenda() {
  const { id } = useParams()
  const [agenda, setAgenda] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agendaSchema),
  })

  const tanggalMulai = watch('tanggal_mulai')

  // Format datetime-local value from Date or datetime-local string
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    // If already in datetime-local format (YYYY-MM-DDTHH:mm), return as is
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return dateString
    }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const agendaData = await agendaKotaService.getById(id)
      setAgenda(agendaData)
      
      // Set form values
      setValue('judul', agendaData.judul)
      setValue('deskripsi', agendaData.deskripsi || '')
      setValue('lokasi', agendaData.lokasi || '')
      setValue('status', agendaData.status)
      
      // Format dates for datetime-local input
      if (agendaData.tanggal_mulai) {
        setValue('tanggal_mulai', formatDateTimeLocal(agendaData.tanggal_mulai))
      }
      if (agendaData.tanggal_selesai) {
        setValue('tanggal_selesai', formatDateTimeLocal(agendaData.tanggal_selesai))
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Gagal memuat data agenda')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Convert datetime-local to ISO string
      const agendaData = {
        ...data,
        tanggal_mulai: new Date(data.tanggal_mulai).toISOString(),
        tanggal_selesai: data.tanggal_selesai
          ? new Date(data.tanggal_selesai).toISOString()
          : null,
        deskripsi: data.deskripsi || null,
        lokasi: data.lokasi || null,
      }

      await agendaKotaService.update(id, agendaData)

      navigate('/admin/agenda')
    } catch (error) {
      console.error('Error updating agenda:', error)
      alert('Gagal mengupdate agenda: ' + (error.message || 'Terjadi kesalahan'))
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
        <h1 className="text-3xl font-bold">Edit Agenda Kota</h1>
        <p className="text-muted-foreground mt-2">
          Edit informasi agenda
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul *</Label>
              <Input
                id="judul"
                {...register('judul')}
              />
              {errors.judul && (
                <p className="text-sm text-destructive">{errors.judul.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                {...register('deskripsi')}
                rows={4}
              />
              {errors.deskripsi && (
                <p className="text-sm text-destructive">{errors.deskripsi.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                <Input
                  id="tanggal_mulai"
                  type="datetime-local"
                  {...register('tanggal_mulai')}
                />
                {errors.tanggal_mulai && (
                  <p className="text-sm text-destructive">
                    {errors.tanggal_mulai.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                <Input
                  id="tanggal_selesai"
                  type="datetime-local"
                  {...register('tanggal_selesai')}
                  min={tanggalMulai ? formatDateTimeLocal(tanggalMulai) : undefined}
                />
                {errors.tanggal_selesai && (
                  <p className="text-sm text-destructive">
                    {errors.tanggal_selesai.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                id="lokasi"
                {...register('lokasi')}
              />
              {errors.lokasi && (
                <p className="text-sm text-destructive">{errors.lokasi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select id="status" {...register('status')}>
                <option value={AGENDA_STATUS.DRAFT}>Draft</option>
                <option value={AGENDA_STATUS.PUBLISHED}>Published</option>
                <option value={AGENDA_STATUS.SELESAI}>Selesai</option>
                <option value={AGENDA_STATUS.DIBATALKAN}>Dibatalkan</option>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/agenda')}
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

