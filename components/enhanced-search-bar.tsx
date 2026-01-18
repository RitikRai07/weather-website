"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, Clock, MapPin, TrendingUp as Trending2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void
  onLocationSelect?: (location: string) => void
  placeholder?: string
}

const POPULAR_CITIES = ["Ludhiana", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"]
const SEARCH_SUGGESTIONS = [
  "Current Weather",
  "7-Day Forecast",
  "Air Quality",
  "Weather Alerts",
  "Precipitation",
  "Wind Speed",
]

export function EnhancedSearchBar({
  onSearch,
  onLocationSelect,
  placeholder = "Search for city or location...",
}: EnhancedSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(searchRef, () => setIsOpen(false))

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem("weatherSearchHistory")
    if (saved) {
      setSearchHistory(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  useEffect(() => {
    if (query.trim().length > 0) {
      // Filter both cities and suggestions
      const filtered = [
        ...POPULAR_CITIES.filter((city) => city.toLowerCase().includes(query.toLowerCase())),
        ...SEARCH_SUGGESTIONS.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase())),
      ]
      setFilteredSuggestions(filtered.slice(0, 6))
    } else {
      setFilteredSuggestions([])
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to search history
      const updated = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 5)
      setSearchHistory(updated)
      localStorage.setItem("weatherSearchHistory", JSON.stringify(updated))

      onSearch(searchQuery)
      setQuery("")
      setIsOpen(false)
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("weatherSearchHistory")
  }

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl blur-sm -z-10 group-focus-within:from-blue-100 group-focus-within:to-purple-100 dark:group-focus-within:from-blue-900/40 dark:group-focus-within:to-purple-900/40 transition-all duration-300"></div>

        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-12 pr-12 py-3 rounded-xl bg-white dark:bg-gray-800 border border-blue-200/50 dark:border-blue-900/30 focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-600/20 transition-all duration-200 text-base"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setFilteredSuggestions([])
              }}
              className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-blue-200/50 dark:border-blue-900/30 z-50 overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* Filtered Suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="p-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Suggestions
                  </p>
                  {filteredSuggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3 group"
                    >
                      <Trending2 className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="p-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recent Searches
                    </p>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((item) => (
                    <motion.button
                      key={item}
                      onClick={() => handleSearch(item)}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3 group"
                    >
                      <Clock className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Popular Cities */}
              {query.length === 0 && searchHistory.length === 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Popular Cities
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_CITIES.map((city) => (
                      <motion.button
                        key={city}
                        onClick={() => handleSearch(city)}
                        whileHover={{ scale: 1.02 }}
                        className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2 justify-center"
                      >
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        {city}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {query && filteredSuggestions.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No suggestions found for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
