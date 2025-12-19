import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import ContentChart from '../../components/admin/ContentChart'
import { RoleGuard } from '../../components/admin/PermissionGuard'
import { beritaService } from '../../services/beritaService'
import { artikelService } from '../../services/artikelService'
import { agendaKotaService } from '../../services/agendaKotaService'
import { layananService } from '../../services/layananService'
import { pengumumanService } from '../../services/pengumumanService'
import { penggunaService } from '../../services/penggunaService'
import { 
  Newspaper, 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Users, 
  Megaphone,
  Edit,
  AlertCircle
} from 'lucide-react'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { ROLES } from '../../utils/constants'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    berita: { published: 0, draft: 0 },
    artikel: { published: 0, draft: 0 },
    pengumumanAktif: 0,
    agendaMendatang: 0,
    layananAktif: 0,
    admin: { total: 0, nonaktif: 0 },
  })
  const [oldestDrafts, setOldestDrafts] = useState([])
  const [todayAgenda, setTodayAgenda] = useState([])
  const [topContent, setTopContent] = useState([])
  // Generate dummy chart data helper
  const generateDummyChartData = (days = 30) => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      
      // Generate random data with some variation to make it look realistic
      // Berita: 1-8 items per day (minimum 1 to ensure visibility)
      // Artikel: 1-5 items per day (minimum 1 to ensure visibility)
      const beritaCount = Math.floor(Math.random() * 8) + 1
      const artikelCount = Math.floor(Math.random() * 5) + 1
      
      data.push({
        date: dateKey,
        berita: beritaCount,
        artikel: artikelCount,
      })
    }
    
    return data
  }

  const [chartData, setChartData] = useState(() => generateDummyChartData(30))
  const [chartLoading, setChartLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
    // Load chart data with dummy data
    loadChartData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [
        beritaStats,
        artikelStats,
        pengumumanStats,
        agendaStats,
        layananStats,
        adminStats,
        beritaDrafts,
        artikelDrafts,
        pengumumanDrafts,
        agendaToday,
        beritaTop,
        artikelTop,
      ] = await Promise.all([
        beritaService.getStats(),
        artikelService.getStats(),
        pengumumanService.getStats(),
        agendaKotaService.getStats(),
        layananService.getStats(),
        penggunaService.getAdminStats(),
        beritaService.getOldestDrafts(5),
        artikelService.getOldestDrafts(5),
        pengumumanService.getOldestDrafts(5),
        agendaKotaService.getTodayAndTomorrow(4),
        beritaService.getTopByViews(3),
        artikelService.getTopByViews(3),
      ])

      // Combine stats
      setStats({
        berita: {
          published: beritaStats.published || 0,
          draft: beritaStats.draft || 0,
        },
        artikel: {
          published: artikelStats.published || 0,
          draft: artikelStats.draft || 0,
        },
        pengumumanAktif: pengumumanStats.published || 0,
        agendaMendatang: agendaStats.published || 0,
        layananAktif: layananStats.published || 0,
        admin: {
          total: adminStats.total || 0,
          nonaktif: adminStats.nonaktif || 0,
        },
      })

      // Combine and sort drafts by created date
      const allDrafts = [...beritaDrafts, ...artikelDrafts, ...pengumumanDrafts]
        .sort((a, b) => new Date(a.dibuat_pada) - new Date(b.dibuat_pada))
        .slice(0, 5)
      setOldestDrafts(allDrafts)

      // Set today agenda
      setTodayAgenda(agendaToday || [])

      // Combine and sort top content
      const allTopContent = [...beritaTop, ...artikelTop]
        .sort((a, b) => (b.dilihat || 0) - (a.dilihat || 0))
        .slice(0, 3)
      setTopContent(allTopContent)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChartData = async () => {
    try {
      setChartLoading(true)
      
      // For now, always use dummy data for testing
      // TODO: Replace with real data fetching in production
      const dummyData = generateDummyChartData(30)
      console.log('Setting chart data:', dummyData.length, 'items') // Debug log
      setChartData(dummyData)
      
      // Real data fetching (uncomment for production)
      /*
      const [beritaData, artikelData] = await Promise.all([
        beritaService.getPublishedByDay(30),
        artikelService.getPublishedByDay(30),
      ])

      // Merge data by date
      const mergedData = {}
      const allDates = new Set([...beritaData.map(d => d.date), ...artikelData.map(d => d.date)])
      
      allDates.forEach(date => {
        mergedData[date] = {
          date,
          berita: beritaData.find(d => d.date === date)?.count || 0,
          artikel: artikelData.find(d => d.date === date)?.count || 0,
        }
      })

      // Convert to array and sort by date
      let sortedData = Object.values(mergedData).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )

      // Use dummy data if no real data exists
      if (sortedData.length === 0 || sortedData.every(d => d.berita === 0 && d.artikel === 0)) {
        sortedData = generateDummyChartData(30)
      }

      setChartData(sortedData)
      */
    } catch (error) {
      console.error('Error loading chart data:', error)
      // Fallback to dummy data on error
      const fallbackData = generateDummyChartData(30)
      setChartData(fallbackData)
    } finally {
      setChartLoading(false)
    }
  }


  // Calculate draft age in days
  const getDraftAge = (dibuat_pada) => {
    if (!dibuat_pada) return 0
    const now = new Date()
    const created = new Date(dibuat_pada)
    const diffTime = now - created
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  // Get edit route based on content type
  const getEditRoute = (jenis, id) => {
    const routes = {
      berita: `/admin/berita/edit/${id}`,
      artikel: `/admin/artikel/edit/${id}`,
      pengumuman: `/admin/pengumuman/edit/${id}`,
    }
    return routes[jenis] || '#'
  }

  // Check if agenda is today or tomorrow
  const isToday = (tanggal) => {
    const date = new Date(tanggal)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTomorrow = (tanggal) => {
    const date = new Date(tanggal)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const statCards = useMemo(() => [
    {
      title: 'Berita',
      value: stats.berita.published + stats.berita.draft,
      description: `${stats.berita.published} Published / ${stats.berita.draft} Draft`,
      icon: Newspaper,
      color: 'text-chart-1',
      href: '/admin/berita',
      showWarning: stats.berita.draft > 0,
    },
    {
      title: 'Artikel',
      value: stats.artikel.published + stats.artikel.draft,
      description: `${stats.artikel.published} Published / ${stats.artikel.draft} Draft`,
      icon: BookOpen,
      color: 'text-chart-2',
      href: '/admin/artikel',
      showWarning: stats.artikel.draft > 0,
    },
    {
      title: 'Pengumuman Aktif',
      value: stats.pengumumanAktif,
      description: 'Pengumuman published',
      icon: Megaphone,
      color: 'text-chart-3',
      href: '/admin/pengumuman',
    },
    {
      title: 'Agenda Mendatang',
      value: stats.agendaMendatang,
      description: 'Agenda published',
      icon: Calendar,
      color: 'text-chart-4',
      href: '/admin/agenda',
    },
    {
      title: 'Layanan Aktif',
      value: stats.layananAktif,
      description: 'Layanan published',
      icon: Briefcase,
      color: 'text-chart-5',
      href: '/admin/layanan',
    },
    {
      title: 'Admin',
      value: stats.admin.total,
      description: `${stats.admin.total} Total / ${stats.admin.nonaktif} Nonaktif`,
      icon: Users,
      color: 'text-primary',
      href: '/admin/pengguna',
      showDanger: stats.admin.nonaktif > 0,
    },
  ], [stats])

  return (
    <RoleGuard allowedRoles={[ROLES.SUPERADMIN]} redirectTo="/admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Ringkasan data dan statistik
          </p>
        </div>

        {/* Stat Cards - 6 items, Grid 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card 
                key={card.title} 
                className="border-border hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate(card.href)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-foreground">{card.value}</div>
                        {card.showWarning && (
                          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                        {card.showDanger && (
                          <Badge variant="destructive">
                            Nonaktif
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Konten Dipublish</CardTitle>
            <CardDescription>Jumlah konten dipublish per hari (30 hari terakhir)</CardDescription>
          </CardHeader>
          <CardContent>
            <ContentChart data={chartData} loading={chartLoading} />
          </CardContent>
        </Card>

        {/* Action Required + Agenda Section - Grid 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Required */}
          <Card>
            <CardHeader>
              <CardTitle>Action Required</CardTitle>
              <CardDescription>5 draft terlama yang perlu ditindaklanjuti</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : oldestDrafts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Tidak ada draft yang perlu ditindaklanjuti
                </p>
              ) : (
                <div className="space-y-3">
                  {oldestDrafts.map((draft) => {
                    const age = getDraftAge(draft.dibuat_pada)
                    return (
                      <div 
                        key={`${draft.jenis}-${draft.id}`}
                        className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {draft.jenis}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(getEditRoute(draft.jenis, draft.id))
                          }}
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

          {/* Agenda Hari Ini & Besok */}
          <Card>
            <CardHeader>
              <CardTitle>Agenda Hari Ini & Besok</CardTitle>
              <CardDescription>Agenda yang akan berlangsung</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : todayAgenda.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Tidak ada agenda hari ini atau besok
                </p>
              ) : (
                <div className="space-y-3">
                  {todayAgenda.map((agenda) => {
                    const isTodayAgenda = isToday(agenda.tanggal_mulai)
                    const isTomorrowAgenda = isTomorrow(agenda.tanggal_mulai)
                    return (
                      <div
                        key={agenda.id}
                        className={`p-3 border rounded-lg ${
                          isTodayAgenda 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        } transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge 
                            variant={isTodayAgenda ? "default" : "secondary"}
                            className={isTodayAgenda ? "" : "bg-muted text-muted-foreground"}
                          >
                            {isTodayAgenda ? 'Hari Ini' : isTomorrowAgenda ? 'Besok' : ''}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(agenda.tanggal_mulai)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {agenda.judul}
                        </p>
                        {agenda.lokasi && (
                          <p className="text-xs text-muted-foreground">
                            📍 {agenda.lokasi}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
            <CardDescription>Top 3 konten berdasarkan views</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : topContent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada konten dengan views
              </p>
            ) : (
              <div className="space-y-3">
                {topContent.map((content, index) => (
                  <div
                    key={`${content.jenis}-${content.id}`}
                    className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {content.jenis}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {content.judul}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {content.dilihat || 0} views
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
