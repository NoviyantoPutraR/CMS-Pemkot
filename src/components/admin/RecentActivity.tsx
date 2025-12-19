import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { 
  FileText, 
  Briefcase, 
  Building2, 
  FileSpreadsheet,
  Clock
} from 'lucide-react'
import { formatRelativeDate } from '../../utils/formatters'

interface ActivityItem {
  id: string
  jenis: 'halaman' | 'layanan' | 'perangkat_daerah' | 'transparansi'
  judul: string
  diperbarui_pada: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
  loading?: boolean
}

export default function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  const navigate = useNavigate()

  // Get icon based on content type
  const getIcon = (jenis: string) => {
    const icons: Record<string, typeof FileText> = {
      halaman: FileText,
      layanan: Briefcase,
      perangkat_daerah: Building2,
      transparansi: FileSpreadsheet,
    }
    return icons[jenis] || FileText
  }

  // Get type label
  const getTypeLabel = (jenis: string) => {
    const labels: Record<string, string> = {
      halaman: 'Halaman',
      layanan: 'Layanan',
      perangkat_daerah: 'Perangkat Daerah',
      transparansi: 'Transparansi',
    }
    return labels[jenis] || jenis
  }

  // Get edit route
  const getEditRoute = (jenis: string, id: string) => {
    const routes: Record<string, string> = {
      halaman: `/admin/halaman/edit/${id}`,
      layanan: `/admin/layanan/edit/${id}`,
      perangkat_daerah: `/admin/perangkat-daerah/edit/${id}`,
      transparansi: `/admin/transparansi/edit/${id}`,
    }
    return routes[jenis] || '#'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Aktivitas Terkini
        </CardTitle>
        <CardDescription>5 aktivitas terakhir yang diperbarui</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada aktivitas
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = getIcon(activity.jenis)
              
              return (
                <div
                  key={`${activity.jenis}-${activity.id}`}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(getEditRoute(activity.jenis, activity.id))}
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(activity.jenis)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate mb-1">
                      {activity.judul}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(activity.diperbarui_pada)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

