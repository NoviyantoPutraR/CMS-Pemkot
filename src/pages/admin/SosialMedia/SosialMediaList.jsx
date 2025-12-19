import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { sosialMediaService } from '../../../services/sosialMediaService'
import Loading from '../../../components/shared/Loading'
import { Edit, CheckCircle, XCircle } from 'lucide-react'

const PLATFORM_NAMES = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export default function SosialMediaList() {
  const [sosialMedia, setSosialMedia] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSosialMedia()
  }, [])

  const loadSosialMedia = async () => {
    try {
      setLoading(true)
      const data = await sosialMediaService.getAll()
      setSosialMedia(data)
    } catch (error) {
      console.error('Error loading sosial media:', error)
      alert('Gagal memuat sosial media')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-3xl font-bold">Manajemen Sosial Media</CardTitle>
            <CardDescription className="mt-2">
              Kelola link sosial media pemerintah kota
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sosialMedia.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Belum ada sosial media yang dikonfigurasi
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mulai dengan menambahkan sosial media pertama Anda.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sosialMedia.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        {loading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sosialMedia.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {PLATFORM_NAMES[item.platform] || item.platform}
                        </TableCell>
                        <TableCell>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate block max-w-[500px]"
                            title={item.url}
                          >
                            {item.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.aktif ? 'default' : 'secondary'}>
                            {item.aktif ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Aktif
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Nonaktif
                              </span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/sosial-media/edit/${item.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

