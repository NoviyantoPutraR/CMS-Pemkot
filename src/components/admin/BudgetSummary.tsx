import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { FileSpreadsheet, Calendar, DollarSign, FileText } from 'lucide-react'

interface BudgetSummaryProps {
  activeYear: {
    tahun: number
    status: string
  } | null
  totalAnggaran?: number
  itemCount?: number
  loading?: boolean
}

export default function BudgetSummary({ 
  activeYear, 
  totalAnggaran, 
  itemCount,
  loading = false 
}: BudgetSummaryProps) {
  const navigate = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-300"
      onClick={() => navigate('/admin/transparansi')}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Ringkasan Transparansi Anggaran
        </CardTitle>
        <CardDescription>Informasi anggaran tahun aktif</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-40" />
          </div>
        ) : activeYear ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tahun Anggaran</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{activeYear.tahun}</p>
                <Badge 
                  variant={activeYear.status === 'published' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {activeYear.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>

            {totalAnggaran !== undefined && (
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Anggaran</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(totalAnggaran)}
                </p>
              </div>
            )}

            {itemCount !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Jumlah Item</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{itemCount}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-2">
              Belum ada anggaran yang dipublikasikan
            </p>
            <p className="text-xs text-muted-foreground">
              Klik untuk menambahkan anggaran baru
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

