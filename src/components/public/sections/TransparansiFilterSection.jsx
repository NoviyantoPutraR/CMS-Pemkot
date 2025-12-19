import { Select } from '../../ui/select'

export default function TransparansiFilterSection({ 
  selectedYear, 
  onYearChange, 
  sortBy, 
  onSortChange,
  availableYears = []
}) {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Filter Tahun */}
          <div className="w-full md:w-auto">
            <Select
              value={selectedYear ? selectedYear.toString() : ''}
              onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : null)}
              className="h-12 rounded-full min-w-[150px]"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto md:ml-auto">
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-12 rounded-full min-w-[180px]"
            >
              <option value="terbaru">Terbaru ke Terlama</option>
              <option value="terlama">Terlama ke Terbaru</option>
            </Select>
          </div>
        </div>
      </div>
    </section>
  )
}

