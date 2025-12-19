import { Search } from 'lucide-react'
import { Input } from '../../ui/input'
import { Select } from '../../ui/select'

export default function PengumumanSearchFilter({ 
  search, 
  onSearchChange, 
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  sortBy, 
  onSortChange 
}) {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari pengumuman atau kata kunci…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-full border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Filter Status */}
            <div className="flex-1 md:flex-initial md:min-w-[150px]">
              <Select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="h-12 rounded-full"
                aria-label="Filter status pengumuman"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="berakhir">Berakhir</option>
              </Select>
            </div>

            {/* Filter Periode */}
            <div className="flex-1 md:flex-initial md:min-w-[150px]">
              <Select
                value={periodFilter}
                onChange={(e) => onPeriodFilterChange(e.target.value)}
                className="h-12 rounded-full"
                aria-label="Filter periode waktu"
              >
                <option value="">Semua Periode</option>
                <option value="hari-ini">Hari Ini</option>
                <option value="minggu-ini">Minggu Ini</option>
                <option value="bulan-ini">Bulan Ini</option>
              </Select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-1 md:flex-initial md:min-w-[150px]">
              <Select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="h-12 rounded-full"
                aria-label="Urutkan pengumuman"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="relevansi">Relevansi</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

