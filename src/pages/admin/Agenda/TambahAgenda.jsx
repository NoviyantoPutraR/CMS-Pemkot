import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { agendaSchema } from '../../../utils/validators'
import { agendaKotaService } from '../../../services/agendaKotaService'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { AGENDA_STATUS } from '../../../utils/constants'

export default function TambahAgenda() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agendaSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const tanggalMulai = watch('tanggal_mulai')

  const onSubmit = async (data) => {
    try {
      setLoading(true)

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

      await agendaKotaService.create(agendaData)

      toastSuccess('CREATE')
      navigate('/admin/agenda')
    } catch (error) {
      console.error('Error creating agenda:', error)
      toastError('CREATE', error.message || 'Gagal menambah agenda')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Agenda Kota</h1>
        <p className="text-muted-foreground mt-2">
          Buat agenda kegiatan baru
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
                placeholder="Masukkan judul agenda"
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
                placeholder="Masukkan deskripsi agenda (opsional)"
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
                placeholder="Masukkan lokasi kegiatan (opsional)"
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Agenda'}
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

