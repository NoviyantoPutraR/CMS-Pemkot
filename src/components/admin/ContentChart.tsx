import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartData {
  date: string
  [key: string]: string | number
}

interface ContentChartProps {
  data: ChartData[]
  loading?: boolean
  dataKeys?: { key: string; name: string; color?: string }[]
}

export default function ContentChart({ 
  data, 
  loading = false,
  dataKeys = [
    { key: 'berita', name: 'Berita' },
    { key: 'artikel', name: 'Artikel' },
  ]
}: ContentChartProps) {
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

  const chartColors = [
    getCSSVariable('--chart-1', 'rgb(99, 102, 241)'),
    getCSSVariable('--chart-2', 'rgb(79, 70, 229)'),
    getCSSVariable('--chart-3', 'rgb(236, 72, 153)'),
    getCSSVariable('--chart-4', 'rgb(34, 197, 94)'),
    getCSSVariable('--chart-5', 'rgb(251, 191, 36)'),
  ]
  const mutedForeground = getCSSVariable('--muted-foreground', 'rgb(107, 114, 128)')

  if (loading) {
    return (
      <div className="h-[220px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat data grafik...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] w-full flex items-center justify-center">
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
    <div className="w-full" style={{ height: '220px', minHeight: '220px', maxHeight: '220px' }}>
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
          {dataKeys.map((item, index) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color || chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={item.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

