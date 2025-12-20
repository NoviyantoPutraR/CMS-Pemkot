import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminSchema } from '../../../utils/validators'
import { penggunaService } from '../../../services/penggunaService'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function TambahAdmin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toastSuccess, toastError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await penggunaService.create(data)
      toastSuccess('CREATE')
      navigate('/admin/pengguna')
    } catch (error) {
      console.error('Error creating admin:', error)
      toastError('CREATE', error.message || 'Gagal menambah admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Admin</h1>
        <p className="text-muted-foreground mt-2">
          Buat akun admin baru
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Minimal 8 karakter"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input
                id="nama_lengkap"
                {...register('nama_lengkap')}
                placeholder="Nama lengkap admin"
              />
              {errors.nama_lengkap && (
                <p className="text-sm text-destructive">
                  {errors.nama_lengkap.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Admin'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/pengguna')}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

