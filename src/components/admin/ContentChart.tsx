import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartData {
  date: string
  berita: number
  artikel: number
}

interface ContentChartProps {
  data: ChartData[]
  loading?: boolean
}

export default function ContentChart({ data, loading = false }: ContentChartProps) {
  // Get CSS variable values for chart colors
  const getCSSVariable = (variable: string, fallback: string): string => {
    if (typeof window !== 'undefined') {
      try {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(variable)
          .trim()
        return value || fallback
      } catch (e) {
        return fallback
      }
    }
    return fallback
  }

  const chart1Color = getCSSVariable('--chart-1', 'rgb(99, 102, 241)')
  const chart2Color = getCSSVariable('--chart-2', 'rgb(79, 70, 229)')
  const mutedForeground = getCSSVariable('--muted-foreground', 'rgb(107, 114, 128)')

  if (loading) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat data grafik...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Tidak ada data untuk ditampilkan</div>
      </div>
    )
  }

  // Format date for display (DD/MM)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}/${month}`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full" style={{ height: '240px', minHeight: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={mutedForeground} opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={mutedForeground}
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={mutedForeground}
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="berita"
            stroke={chart1Color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Berita"
          />
          <Line
            type="monotone"
            dataKey="artikel"
            stroke={chart2Color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Artikel"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

