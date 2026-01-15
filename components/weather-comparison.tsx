"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WeatherIcon } from "@/components/weather-icon"
import { Search, Plus, X, ArrowRight, Droplets, Wind, Sun, Umbrella, RefreshCw } from "lucide-react"

interface WeatherLocation {
  id: string
  name: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  uvIndex: number
  precipitation: number
  condition: string
  iconUrl: string
}

interface WeatherComparisonProps {
  locations?: WeatherLocation[]
  onAddLocation?: (query: string) => Promise<void>
  onRemoveLocation?: (id: string) => void
  onRefresh?: () => Promise<void>
  isLoading?: boolean
}

export function WeatherComparison({
  locations = [],
  onAddLocation,
  onRemoveLocation,
  onRefresh,
  isLoading = false,
}: WeatherComparisonProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim() || !onAddLocation) return

    setIsSearching(true)
    try {
      await onAddLocation(searchQuery)
      setSearchQuery("")
    } catch (error) {
      console.error("Error adding location:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRefresh = async () => {
    if (!onRefresh) return

    try {
      await onRefresh()
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-blue-100 dark:border-blue-900/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1 rounded">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Weather Comparison
            </span>
          </CardTitle>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 px-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {onAddLocation && (
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Add location (e.g. London, Tokyo)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8 border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        )}

        {locations.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Add locations to compare weather conditions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-100 dark:border-blue-900/50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Condition
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Temperature
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Wind</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">UV Index</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Precipitation
                  </th>
                  {onRemoveLocation && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {locations.map((location, index) => (
                  <motion.tr
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-blue-50 dark:border-blue-900/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{location.country}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          iconUrl={location.iconUrl}
                          description={location.condition}
                          size="small"
                          animated={false}
                        />
                        <span className="text-sm">{location.condition}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{location.temp}°C</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Feels like {location.feelsLike}°C</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>{location.humidity}%</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-purple-500" />
                        <span>{location.windSpeed} km/h</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>{location.uvIndex}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Umbrella className="h-4 w-4 text-green-500" />
                        <span>{location.precipitation}%</span>
                      </div>
                    </td>

                    {onRemoveLocation && (
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveLocation(location.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
