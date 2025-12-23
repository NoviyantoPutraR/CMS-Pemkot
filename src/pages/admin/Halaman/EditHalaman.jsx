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
import { AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react'

export default function EditHalaman() {
  const { id } = useParams()
  const [halaman, setHalaman] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [tugasDanFungsi, setTugasDanFungsi] = useState([''])
  const [visi, setVisi] = useState('')
  const [misi, setMisi] = useState([''])
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
      
      // Load tugas_dan_fungsi dari database
      if (data.tugas_dan_fungsi && Array.isArray(data.tugas_dan_fungsi) && data.tugas_dan_fungsi.length > 0) {
        setTugasDanFungsi(data.tugas_dan_fungsi)
      } else {
        setTugasDanFungsi([''])
      }
      
      // Load visi dan misi dari database (untuk halaman visi-misi)
      if (data.slug === 'visi-misi') {
        setVisi(data.visi || '')
        if (data.misi && Array.isArray(data.misi) && data.misi.length > 0) {
          setMisi(data.misi)
        } else {
          setMisi([''])
        }
      }
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

      // Validasi tugas_dan_fungsi (hanya untuk halaman tentang)
      if (data.slug === 'tentang') {
        const filteredTugasDanFungsi = tugasDanFungsi.filter(item => item.trim() !== '')
        if (filteredTugasDanFungsi.length === 0) {
          setError('Minimal harus ada 1 item tugas dan fungsi')
          toastError('VALIDATION', 'Minimal harus ada 1 item tugas dan fungsi')
          setSaving(false)
          return
        }
      }

      // Validasi visi dan misi (untuk halaman visi-misi)
      if (data.slug === 'visi-misi') {
        if (!visi || visi.trim().length < 10) {
          setError('Visi harus diisi minimal 10 karakter')
          toastError('VALIDATION', 'Visi harus diisi minimal 10 karakter')
          setSaving(false)
          return
        }
        
        const filteredMisi = misi.filter(item => item.trim() !== '')
        if (filteredMisi.length === 0) {
          setError('Minimal harus ada 1 item misi')
          toastError('VALIDATION', 'Minimal harus ada 1 item misi')
          setSaving(false)
          return
        }
      }

      // Siapkan data update
      const updateData = {
        ...data,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
      }
      
      // Tambahkan tugas_dan_fungsi jika slug = tentang
      if (data.slug === 'tentang') {
        const filteredTugasDanFungsi = tugasDanFungsi.filter(item => item.trim() !== '')
        updateData.tugas_dan_fungsi = filteredTugasDanFungsi
      }
      
      // Tambahkan visi dan misi jika slug = visi-misi
      if (data.slug === 'visi-misi') {
        updateData.visi = visi.trim()
        updateData.misi = misi.filter(item => item.trim() !== '')
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

            {/* Form Tugas dan Fungsi (hanya untuk halaman tentang) */}
            {halaman?.slug === 'tentang' && (
            <div className="space-y-2">
              <Label>Tugas dan Fungsi</Label>
              <div className="space-y-3">
                {tugasDanFungsi.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...tugasDanFungsi]
                        newItems[index] = e.target.value
                        setTugasDanFungsi(newItems)
                      }}
                      placeholder="Masukkan tugas dan fungsi"
                      className="flex-1"
                    />
                    {tugasDanFungsi.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newItems = tugasDanFungsi.filter((_, i) => i !== index)
                          setTugasDanFungsi(newItems.length > 0 ? newItems : [''])
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTugasDanFungsi([...tugasDanFungsi, ''])}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Item
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Daftar tugas dan fungsi yang akan ditampilkan di halaman. Minimal 1 item.
              </p>
            </div>
            )}

            {/* Form Visi & Misi (hanya untuk halaman visi-misi) */}
            {halaman?.slug === 'visi-misi' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="visi">Visi *</Label>
                  <Textarea
                    id="visi"
                    value={visi}
                    onChange={(e) => setVisi(e.target.value)}
                    placeholder="Masukkan visi"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Visi harus minimal 10 karakter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Misi *</Label>
                  <div className="space-y-3">
                    {misi.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...misi]
                            newItems[index] = e.target.value
                            setMisi(newItems)
                          }}
                          placeholder="Masukkan misi"
                          className="flex-1"
                        />
                        {misi.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newItems = misi.filter((_, i) => i !== index)
                              setMisi(newItems.length > 0 ? newItems : [''])
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMisi([...misi, ''])}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Item
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Daftar misi yang akan ditampilkan di halaman. Minimal 1 item.
                  </p>
                </div>
              </>
            )}

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

