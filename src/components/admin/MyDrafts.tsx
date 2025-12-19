import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { Edit, FileText, BookOpen, Megaphone, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Draft {
  id: string
  judul: string
  dibuat_pada: string
  jenis: 'berita' | 'artikel' | 'pengumuman' | 'video'
}

interface MyDraftsProps {
  drafts: Draft[]
  loading?: boolean
}

const jenisConfig = {
  berita: { label: 'Berita', icon: FileText, color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  artikel: { label: 'Artikel', icon: BookOpen, color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  pengumuman: { label: 'Pengumuman', icon: Megaphone, color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  video: { label: 'Video', icon: Video, color: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
}

const getEditRoute = (jenis: string, id: string) => {
  const routes = {
    berita: `/admin/berita/edit/${id}`,
    artikel: `/admin/artikel/edit/${id}`,
    pengumuman: `/admin/pengumuman/edit/${id}`,
    video: `/admin/video/edit/${id}`,
  }
  return routes[jenis as keyof typeof routes] || '#'
}

const getDraftAge = (dibuat_pada: string) => {
  if (!dibuat_pada) return 0
  const now = new Date()
  const created = new Date(dibuat_pada)
  const diffTime = now.getTime() - created.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function MyDrafts({ drafts, loading = false }: MyDraftsProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Draft Saya</CardTitle>
          <CardDescription>Draft konten yang perlu diselesaikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Draft Saya</CardTitle>
          <CardDescription>Draft konten yang perlu diselesaikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada draft
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Semua konten Anda sudah dipublish! Teruskan semangat menulis konten berkualitas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Saya</CardTitle>
        <CardDescription>Draft konten yang perlu diselesaikan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {drafts.map((draft) => {
            const config = jenisConfig[draft.jenis]
            const Icon = config.icon
            const age = getDraftAge(draft.dibuat_pada)
            
            return (
              <div
                key={`${draft.jenis}-${draft.id}`}
                className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={config.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {age} hari
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {draft.judul}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(getEditRoute(draft.jenis, draft.id))}
                  className="ml-3 flex-shrink-0"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

