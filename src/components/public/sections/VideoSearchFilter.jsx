import { Search } from 'lucide-react'
import { Input } from '../../ui/input'
import { Select } from '../../ui/select'

export default function VideoSearchFilter({ search, onSearchChange, sortBy, onSortChange }) {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari video atau kata kunci…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-full border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-12 rounded-full min-w-[150px]"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terpopuler">Terpopuler</option>
            </Select>
          </div>
        </div>
      </div>
    </section>
  )
}

