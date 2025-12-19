import { Button } from '../../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PerangkatDaerahPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`min-w-[40px] h-10 px-4 rounded-md font-medium transition-colors ${
            i === page
              ? 'bg-primary-blue text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Sebelumnya
      </Button>

      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-2"
      >
        Selanjutnya
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

