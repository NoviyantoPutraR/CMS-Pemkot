import { Search, Calendar, Filter } from 'lucide-react'
import { Input } from '../../ui/input'
import { Select } from '../../ui/select'

export default function AgendaSearchFilter({ 
  search, 
  onSearchChange, 
  dateFilter, 
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange 
}) {
  const dateFilterOptions = [
    { value: 'semua', label: 'Semua Waktu' },
    { value: 'hari-ini', label: 'Hari Ini' },
    { value: 'minggu-ini', label: 'Minggu Ini' },
    { value: 'bulan-ini', label: 'Bulan Ini' },
  ]

  const statusFilterOptions = [
    { value: 'semua', label: 'Semua Status' },
    { value: 'akan-datang', label: 'Akan Datang' },
    { value: 'berlangsung', label: 'Berlangsung' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
  ]

  return (
    <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari agenda berdasarkan judul atau lokasi…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-full border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Date Filter */}
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Select
                  value={dateFilter}
                  onChange={(e) => onDateFilterChange(e.target.value)}
                  className="pl-12 pr-4 h-12 rounded-full min-w-[180px] border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all appearance-none"
                >
                  {dateFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Select
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange(e.target.value)}
                  className="pl-12 pr-4 h-12 rounded-full min-w-[180px] border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all"
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

