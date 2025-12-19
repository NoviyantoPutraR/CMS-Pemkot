import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { Edit, AlertCircle } from 'lucide-react'

interface DraftItem {
  id: string
  judul: string
  jenis: 'halaman' | 'layanan'
  dibuat_pada: string
}

interface ContentStatusProps {
  drafts: DraftItem[]
  loading?: boolean
}

export default function ContentStatus({ drafts, loading = false }: ContentStatusProps) {
  const navigate = useNavigate()

  // Calculate draft age in days
  const getDraftAge = (dibuat_pada: string) => {
    if (!dibuat_pada) return 0
    const now = new Date()
    const created = new Date(dibuat_pada)
    const diffTime = now.getTime() - created.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  // Get edit route based on content type
  const getEditRoute = (jenis: string, id: string) => {
    const routes: Record<string, string> = {
      halaman: `/admin/halaman/edit/${id}`,
      layanan: `/admin/layanan/edit/${id}`,
    }
    return routes[jenis] || '#'
  }

  // Get content type label
  const getTypeLabel = (jenis: string) => {
    const labels: Record<string, string> = {
      halaman: 'Halaman',
      layanan: 'Layanan',
    }
    return labels[jenis] || jenis
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Konten</CardTitle>
        <CardDescription>Draft yang perlu ditindaklanjuti</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada draft yang perlu ditindaklanjuti
          </p>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => {
              const age = getDraftAge(draft.dibuat_pada)
              const isOld = age > 7 // Warning jika lebih dari 7 hari
              
              return (
                <div 
                  key={`${draft.jenis}-${draft.id}`}
                  className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(draft.jenis)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {age} hari
                      </span>
                      {isOld && (
                        <Badge 
                          variant="outline" 
                          className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-xs"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Lama
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {draft.judul}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(getEditRoute(draft.jenis, draft.id))
                    }}
                    className="ml-3 flex-shrink-0"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

