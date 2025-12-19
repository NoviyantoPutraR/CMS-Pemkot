import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { FileText, BookOpen, Megaphone, Video, Calendar, MapPin, Plus, Edit, CheckCircle, Briefcase, Building2, FileSpreadsheet } from 'lucide-react'
import { formatRelativeDate } from '../../utils/formatters'

interface Activity {
  id: string
  jenis: 'berita' | 'artikel' | 'pengumuman' | 'video' | 'agenda' | 'wisata' | 'halaman' | 'layanan' | 'perangkat_daerah' | 'transparansi'
  judul: string
  action?: 'create' | 'update' | 'publish'
  dibuat_pada?: string
  diperbarui_pada?: string
  dipublikasikan_pada?: string
}

interface RecentActivityProps {
  activities: Activity[]
  loading?: boolean
}

const jenisConfig: Record<string, { label: string; icon: any; color: string }> = {
  berita: { label: 'Berita', icon: FileText, color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  artikel: { label: 'Artikel', icon: BookOpen, color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  pengumuman: { label: 'Pengumuman', icon: Megaphone, color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  video: { label: 'Video', icon: Video, color: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
  agenda: { label: 'Agenda', icon: Calendar, color: 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
  wisata: { label: 'Wisata', icon: MapPin, color: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  halaman: { label: 'Halaman', icon: FileText, color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  layanan: { label: 'Layanan', icon: Briefcase, color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  perangkat_daerah: { label: 'Perangkat Daerah', icon: Building2, color: 'bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' },
  transparansi: { label: 'Transparansi', icon: FileSpreadsheet, color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
}

// Default config untuk jenis yang tidak dikenal
const defaultJenisConfig = {
  label: 'Konten',
  icon: FileText,
  color: 'bg-gray-50 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
}

const actionConfig = {
  create: { label: 'Dibuat', icon: Plus, color: 'text-blue-600 dark:text-blue-400' },
  update: { label: 'Diperbarui', icon: Edit, color: 'text-amber-600 dark:text-amber-400' },
  publish: { label: 'Dipublish', icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
}

const getActivityAction = (activity: Activity): 'create' | 'update' | 'publish' => {
  // Jika action sudah ada, gunakan itu
  if (activity.action) {
    return activity.action
  }
  
  // Jika tidak ada action, tentukan berdasarkan data yang ada
  if (activity.dipublikasikan_pada) {
    return 'publish'
  }
  if (activity.diperbarui_pada) {
    return 'update'
  }
  return 'create'
}

const getActivityDate = (activity: Activity) => {
  const action = getActivityAction(activity)
  
  if (action === 'publish' && activity.dipublikasikan_pada) {
    return activity.dipublikasikan_pada
  }
  if (action === 'update' && activity.diperbarui_pada) {
    return activity.diperbarui_pada
  }
  return activity.dibuat_pada || activity.diperbarui_pada || ''
}

export default function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terakhir</CardTitle>
          <CardDescription>5 aktivitas terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terakhir</CardTitle>
          <CardDescription>5 aktivitas terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum ada aktivitas
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Mulai buat konten pertama Anda untuk melihat aktivitas di sini.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terakhir</CardTitle>
        <CardDescription>5 aktivitas terakhir Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const jenisCfg = jenisConfig[activity.jenis] || defaultJenisConfig
            const action = getActivityAction(activity)
            const actionCfg = actionConfig[action]
            const JenisIcon = jenisCfg.icon
            const ActionIcon = actionCfg.icon
            const activityDate = getActivityDate(activity)
            const relativeTime = formatRelativeDate(activityDate)

            return (
              <div
                key={`${activity.jenis}-${activity.id}-${action}`}
                className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${jenisCfg.color} flex-shrink-0`}>
                  <JenisIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={jenisCfg.color}>
                      {jenisCfg.label}
                    </Badge>
                    <div className={`flex items-center gap-1 text-xs ${actionCfg.color}`}>
                      <ActionIcon className="h-3 w-3" />
                      {actionCfg.label}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate mb-1">
                    {activity.judul}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {relativeTime}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
