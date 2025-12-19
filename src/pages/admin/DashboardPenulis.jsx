import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Skeleton } from '../../components/ui/skeleton'
import ContentChart from '../../components/admin/ContentChart'
import MyDrafts from '../../components/admin/MyDrafts'
import RecentActivity from '../../components/admin/RecentActivity'
import { beritaService } from '../../services/beritaService'
import { artikelService } from '../../services/artikelService'
import { pengumumanService } from '../../services/pengumumanService'
import { videoService } from '../../services/videoService'
import { agendaKotaService } from '../../services/agendaKotaService'
import useAuthStore from '../../store/useAuthStore'
import { 
  Newspaper, 
  BookOpen, 
  Megaphone,
  Video,
  Calendar
} from 'lucide-react'

export default function DashboardPenulis() {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    berita: { published: 0, draft: 0 },
    artikel: { published: 0, draft: 0 },
    pengumuman: { published: 0, draft: 0 },
    video: { published: 0, draft: 0 },
    agenda: { published: 0, draft: 0 },
  })
  const [drafts, setDrafts] = useState([])
  const [chartData, setChartData] = useState([])
  const [chartLoading, setChartLoading] = useState(false)
  const [recentActivities, setRecentActivities] = useState([])

  const authorId = user?.id

  useEffect(() => {
    if (authorId) {
      loadDashboardData()
      loadChartData()
    }
  }, [authorId])

  const loadDashboardData = async () => {
    if (!authorId) return

    try {
      setLoading(true)
      
      const [
        beritaStats,
        artikelStats,
        pengumumanStats,
        videoStats,
        agendaStats,
        beritaDrafts,
        artikelDrafts,
        pengumumanDrafts,
        videoDrafts,
      ] = await Promise.all([
        beritaService.getStatsByAuthor(authorId),
        artikelService.getStatsByAuthor(authorId),
        pengumumanService.getStatsByAuthor(authorId),
        videoService.getStatsByAuthor(authorId),
        agendaKotaService.getStatsByAuthor(authorId),
        beritaService.getDraftsByAuthor(authorId, 6),
        artikelService.getDraftsByAuthor(authorId, 6),
        pengumumanService.getDraftsByAuthor(authorId, 6),
        videoService.getDraftsByAuthor(authorId, 6),
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
        pengumuman: {
          published: pengumumanStats.published || 0,
          draft: pengumumanStats.draft || 0,
        },
        video: {
          published: videoStats.published || 0,
          draft: videoStats.draft || 0,
        },
        agenda: {
          published: agendaStats.published || 0,
          draft: agendaStats.draft || 0,
        },
      })

      // Combine and sort drafts by created date (oldest first)
      const allDrafts = [...beritaDrafts, ...artikelDrafts, ...pengumumanDrafts, ...videoDrafts]
        .sort((a, b) => new Date(a.dibuat_pada) - new Date(b.dibuat_pada))
        .slice(0, 6)
      setDrafts(allDrafts)

      // Load recent activities
      await loadRecentActivities()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivities = async () => {
    if (!authorId) return

    try {
      // Get recent content from all types
      const [beritaAll, artikelAll, pengumumanAll, videoAll, agendaAll] = await Promise.all([
        beritaService.getAll({ page: 1, limit: 5 }),
        artikelService.getAll({ page: 1, limit: 5 }),
        pengumumanService.getAll({ page: 1, limit: 5 }),
        videoService.getAll({ page: 1, limit: 5 }),
        agendaKotaService.getAll({ page: 1, limit: 5 }),
      ])

      // Combine and format activities
      const activities = [
        ...(beritaAll.data || []).map(item => ({
          id: item.id,
          jenis: 'berita',
          judul: item.judul,
          action: item.status === 'published' ? 'publish' : item.diperbarui_pada ? 'update' : 'create',
          dibuat_pada: item.dibuat_pada,
          diperbarui_pada: item.diperbarui_pada,
          dipublikasikan_pada: item.dipublikasikan_pada,
        })),
        ...(artikelAll.data || []).map(item => ({
          id: item.id,
          jenis: 'artikel',
          judul: item.judul,
          action: item.status === 'published' ? 'publish' : item.diperbarui_pada ? 'update' : 'create',
          dibuat_pada: item.dibuat_pada,
          diperbarui_pada: item.diperbarui_pada,
          dipublikasikan_pada: item.dipublikasikan_pada,
        })),
        ...(pengumumanAll.data || []).map(item => ({
          id: item.id,
          jenis: 'pengumuman',
          judul: item.judul,
          action: item.status === 'published' ? 'publish' : item.diperbarui_pada ? 'update' : 'create',
          dibuat_pada: item.dibuat_pada,
          diperbarui_pada: item.diperbarui_pada,
          dipublikasikan_pada: item.dipublikasikan_pada,
        })),
        ...(videoAll.data || []).map(item => ({
          id: item.id,
          jenis: 'video',
          judul: item.judul,
          action: item.status === 'published' ? 'publish' : item.diperbarui_pada ? 'update' : 'create',
          dibuat_pada: item.dibuat_pada,
          diperbarui_pada: item.diperbarui_pada,
        })),
        ...(agendaAll.data || []).map(item => ({
          id: item.id,
          jenis: 'agenda',
          judul: item.judul,
          action: item.status === 'published' ? 'publish' : item.diperbarui_pada ? 'update' : 'create',
          dibuat_pada: item.dibuat_pada,
          diperbarui_pada: item.diperbarui_pada,
        })),
      ]
        .sort((a, b) => {
          const dateA = a.dipublikasikan_pada || a.diperbarui_pada || a.dibuat_pada || ''
          const dateB = b.dipublikasikan_pada || b.diperbarui_pada || b.dibuat_pada || ''
          return new Date(dateB) - new Date(dateA)
        })
        .slice(0, 5)

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading recent activities:', error)
      setRecentActivities([])
    }
  }

  const loadChartData = async () => {
    if (!authorId) return

    try {
      setChartLoading(true)
      
      const [beritaData, artikelData] = await Promise.all([
        beritaService.getPublishedByDayByAuthor(authorId, 30),
        artikelService.getPublishedByDayByAuthor(authorId, 30),
      ])

      // Merge data by date
      const mergedData = {}
      const allDates = new Set([
        ...beritaData.map(d => d.date), 
        ...artikelData.map(d => d.date)
      ])
      
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

      // If no data, create empty data structure
      if (sortedData.length === 0) {
        const now = new Date()
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          const dateKey = date.toISOString().split('T')[0]
          sortedData.push({
            date: dateKey,
            berita: 0,
            artikel: 0,
          })
        }
      }

      setChartData(sortedData)
    } catch (error) {
      console.error('Error loading chart data:', error)
      setChartData([])
    } finally {
      setChartLoading(false)
    }
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
      title: 'Pengumuman',
      value: stats.pengumuman.published + stats.pengumuman.draft,
      description: `${stats.pengumuman.published} Published / ${stats.pengumuman.draft} Draft`,
      icon: Megaphone,
      color: 'text-chart-3',
      href: '/admin/pengumuman',
      showWarning: stats.pengumuman.draft > 0,
    },
    {
      title: 'Video',
      value: stats.video.published + stats.video.draft,
      description: `${stats.video.published} Published / ${stats.video.draft} Draft`,
      icon: Video,
      color: 'text-chart-4',
      href: '/admin/video',
      showWarning: stats.video.draft > 0,
    },
    {
      title: 'Agenda Kota',
      value: stats.agenda.published + stats.agenda.draft,
      description: 'Total aktif',
      icon: Calendar,
      color: 'text-chart-5',
      href: '/admin/agenda',
      showWarning: stats.agenda.draft > 0,
    },
  ], [stats])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Ringkasan konten dan aktivitas Anda
        </p>
      </div>

      {/* Stat Cards - 5 items, Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                    <div className="text-3xl font-bold text-foreground">{card.value}</div>
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
          <CardTitle>Aktivitas Konten Saya</CardTitle>
          <CardDescription>Jumlah konten dipublish per hari (30 hari terakhir)</CardDescription>
        </CardHeader>
        <CardContent>
          <ContentChart 
            data={chartData} 
            loading={chartLoading}
            dataKeys={[
              { key: 'berita', name: 'Berita' },
              { key: 'artikel', name: 'Artikel' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Draft Saya + Aktivitas Terakhir - Grid 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyDrafts drafts={drafts} loading={loading} />
        <RecentActivity activities={recentActivities} loading={loading} />
      </div>
    </div>
  )
}

