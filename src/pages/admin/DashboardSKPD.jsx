import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import ContentChart from '../../components/admin/ContentChart'
import ContentStatus from '../../components/admin/ContentStatus'
import BudgetSummary from '../../components/admin/BudgetSummary'
import RecentActivity from '../../components/admin/RecentActivity'
import { halamanService } from '../../services/halamanService'
import { layananService } from '../../services/layananService'
import { perangkatDaerahService } from '../../services/perangkatDaerahService'
import { transparansiAnggaranService } from '../../services/transparansiAnggaranService'
import { 
  FileText, 
  Briefcase, 
  Building2, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react'
import { ROLES } from '../../utils/constants'

export default function DashboardSKPD() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    halaman: { published: 0, draft: 0 },
    layanan: { published: 0, draft: 0 },
    perangkatDaerah: 0,
    anggaran: { tahun: null, status: null },
  })
  const [drafts, setDrafts] = useState([])
  const [chartData, setChartData] = useState([])
  const [chartLoading, setChartLoading] = useState(false)
  const [activeYear, setActiveYear] = useState(null)
  const [totalAnggaran, setTotalAnggaran] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])

  // Generate dummy chart data helper
  const generateDummyChartData = (days = 30) => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      
      const halamanCount = Math.floor(Math.random() * 3) + 1
      const layananCount = Math.floor(Math.random() * 5) + 1
      
      data.push({
        date: dateKey,
        halaman: halamanCount,
        layanan: layananCount,
      })
    }
    
    return data
  }

  useEffect(() => {
    loadDashboardData()
    loadChartData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [
        halamanStats,
        layananStats,
        perangkatCount,
        anggaranActiveYear,
        anggaranAll,
        halamanDrafts,
        layananDrafts,
      ] = await Promise.all([
        halamanService.getStats(),
        layananService.getStats(),
        perangkatDaerahService.getCount(),
        transparansiAnggaranService.getActiveYear(),
        transparansiAnggaranService.getAll(),
        halamanService.getDrafts(5),
        layananService.getDrafts(5),
      ])

      // Combine stats
      setStats({
        halaman: {
          published: halamanStats.published || 0,
          draft: halamanStats.draft || 0,
        },
        layanan: {
          published: layananStats.published || 0,
          draft: layananStats.draft || 0,
        },
        perangkatDaerah: perangkatCount || 0,
        anggaran: anggaranActiveYear || { tahun: null, status: null },
      })

      // Combine drafts
      const allDrafts = [...halamanDrafts, ...layananDrafts]
        .sort((a, b) => new Date(a.dibuat_pada) - new Date(b.dibuat_pada))
        .slice(0, 5)
      setDrafts(allDrafts)

      // Set active year
      setActiveYear(anggaranActiveYear)
      
      // Calculate total anggaran (dummy - karena tidak ada field total di DB)
      // In real implementation, this would come from the Excel/PDF file
      // Untuk sekarang, kita set ke 0 atau bisa dihitung dari jumlah item
      setTotalAnggaran(0)
      setItemCount(anggaranAll?.length || 0)

      // Load recent activities
      await loadRecentActivities()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const [
        halamanAll,
        layananAll,
        perangkatAll,
        transparansiActivity,
      ] = await Promise.all([
        halamanService.getAll(),
        layananService.getAll({ page: 1, limit: 5 }),
        perangkatDaerahService.getAll({ page: 1, limit: 5 }),
        transparansiAnggaranService.getRecentActivity(5),
      ])

      // Combine and format activities
      const activities = [
        ...(halamanAll || []).map(item => ({
          id: item.id,
          jenis: 'halaman',
          judul: item.judul,
          diperbarui_pada: item.diperbarui_pada,
        })),
        ...(layananAll.data || []).map(item => ({
          id: item.id,
          jenis: 'layanan',
          judul: item.judul,
          diperbarui_pada: item.diperbarui_pada,
        })),
        ...(perangkatAll.data || []).map(item => ({
          id: item.id,
          jenis: 'perangkat_daerah',
          judul: item.nama_perangkat,
          diperbarui_pada: item.diperbarui_pada,
        })),
        ...transparansiActivity.map(item => ({
          id: item.id,
          jenis: 'transparansi',
          judul: item.judul,
          diperbarui_pada: item.diperbarui_pada,
        })),
      ]
        .sort((a, b) => new Date(b.diperbarui_pada) - new Date(a.diperbarui_pada))
        .slice(0, 5)

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading recent activities:', error)
      setRecentActivities([])
    }
  }

  const loadChartData = async () => {
    try {
      setChartLoading(true)
      
      // For now, use dummy data
      // TODO: Replace with real data fetching when getPublishedByDay is implemented
      const dummyData = generateDummyChartData(30)
      setChartData(dummyData)
      
      // Real data fetching (uncomment when ready)
      /*
      const [halamanData, layananData] = await Promise.all([
        halamanService.getPublishedByDay(30),
        layananService.getPublishedByDay(30),
      ])

      // Merge data by date
      const mergedData = {}
      const allDates = new Set([
        ...halamanData.map(d => d.date), 
        ...layananData.map(d => d.date)
      ])
      
      allDates.forEach(date => {
        mergedData[date] = {
          date,
          halaman: halamanData.find(d => d.date === date)?.count || 0,
          layanan: layananData.find(d => d.date === date)?.count || 0,
        }
      })

      // Convert to array and sort by date
      let sortedData = Object.values(mergedData).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )

      // Use dummy data if no real data exists
      if (sortedData.length === 0 || sortedData.every(d => d.halaman === 0 && d.layanan === 0)) {
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

  const statCards = useMemo(() => [
    {
      title: 'Halaman Statis',
      value: stats.halaman.published + stats.halaman.draft,
      description: `${stats.halaman.published} Published / ${stats.halaman.draft} Draft`,
      icon: FileText,
      color: 'text-chart-1',
      href: '/admin/halaman',
      showWarning: stats.halaman.draft > 0,
    },
    {
      title: 'Layanan',
      value: stats.layanan.published + stats.layanan.draft,
      description: `${stats.layanan.published} Aktif / ${stats.layanan.draft} Draft`,
      icon: Briefcase,
      color: 'text-chart-2',
      href: '/admin/layanan',
      showWarning: stats.layanan.draft > 0,
    },
    {
      title: 'Perangkat Daerah',
      value: stats.perangkatDaerah,
      description: 'Total perangkat',
      icon: Building2,
      color: 'text-chart-3',
      href: '/admin/perangkat-daerah',
    },
    {
      title: 'Anggaran',
      value: stats.anggaran.tahun || '-',
      description: stats.anggaran.tahun ? `Tahun ${stats.anggaran.tahun}` : 'Belum ada tahun aktif',
      icon: FileSpreadsheet,
      color: 'text-chart-4',
      href: '/admin/transparansi',
    },
  ], [stats])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Ringkasan konten dan data SKPD
        </p>
      </div>

      {/* Stat Cards - 4 items, Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <CardTitle>Aktivitas Konten SKPD</CardTitle>
          <CardDescription>Jumlah konten dipublish per hari (30 hari terakhir)</CardDescription>
        </CardHeader>
        <CardContent>
          <ContentChart 
            data={chartData} 
            loading={chartLoading}
            dataKeys={[
              { key: 'halaman', name: 'Halaman Statis' },
              { key: 'layanan', name: 'Layanan' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Status Konten + Anggaran - Grid 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Status */}
        <ContentStatus drafts={drafts} loading={loading} />

        {/* Budget Summary */}
        <BudgetSummary 
          activeYear={activeYear}
          totalAnggaran={totalAnggaran}
          itemCount={itemCount}
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} loading={loading} />
    </div>
  )
}

