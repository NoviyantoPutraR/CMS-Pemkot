import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchService } from '../../services/searchService'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchAutocomplete({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "Apa yang Anda cari di Kerja Baik?",
  className = "",
  showButton = false
}) {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const debouncedValue = useDebounce(value, 300)

  // Detect mobile screen size (< 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load suggestions saat user mengetik
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!debouncedValue || debouncedValue.trim().length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        setLoading(true)
        const results = await searchService.getSuggestions(debouncedValue, 8)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error loading suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    loadSuggestions()
  }, [debouncedValue])

  // Handle click outside untuk close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark>
      ) : part
    )
  }

  // Get label untuk tipe
  const getTypeLabel = (type) => {
    const labels = {
      'berita': 'Berita',
      'artikel': 'Artikel',
      'layanan': 'Layanan'
    }
    return labels[type] || type
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex]
          navigate(suggestion.url)
          setShowSuggestions(false)
        } else if (onSearch) {
          onSearch(value)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.url)
    setShowSuggestions(false)
    onChange('')
  }

  // Handle search dengan spell correction
  const handleSearch = (searchValue) => {
    if (!searchValue || !searchValue.trim()) return

    const correction = searchService.correctSpelling(searchValue)
    const queryToSearch = correction.hasCorrection ? correction.corrected : searchValue
    
    if (onSearch) {
      onSearch(queryToSearch)
    } else {
      navigate(`/search?q=${encodeURIComponent(queryToSearch)}`)
    }
    
    setShowSuggestions(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input dengan icon */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 sm:text-gray-400 z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? '' : placeholder}
          className={`w-full h-14 bg-white sm:bg-[#f3f3f4] text-gray-900 py-2 pl-10 rounded-full outline-none border-2 border-gray-300 sm:border-transparent shadow-md sm:shadow-none transition-all duration-300 ease-in-out placeholder:text-[#9e9ea7] hover:bg-white hover:border-[#2563EB] hover:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] ${
            showButton ? 'pr-28' : 'pr-4'
          }`}
        />
        {loading && !showButton && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {loading && showButton && (
          <div className="absolute right-28 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              } ${index > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {highlightText(suggestion.text, value)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {getTypeLabel(suggestion.type)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Spell correction suggestion - moved inside suggestions dropdown if needed */}
      {showSuggestions && value && value.length > 2 && debouncedValue === value && (() => {
        const correction = searchService.correctSpelling(value)
        if (correction.hasCorrection && correction.corrected !== value && suggestions.length === 0) {
          return (
            <div className="absolute top-full left-0 right-0 mt-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700 z-50">
              Maksudnya: <button
                type="button"
                onClick={() => {
                  onChange(correction.corrected)
                  handleSearch(correction.corrected)
                }}
                className="font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                {correction.corrected}
              </button>?
            </div>
          )
        }
        return null
      })()}
    </div>
  )
}

