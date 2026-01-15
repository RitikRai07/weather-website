"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Globe, Clock, ChevronDown, ChevronUp, Search, Star, StarOff, Map } from "lucide-react"

interface LocationDisplayProps {
  location: {
    name: string
    region?: string
    country: string
    lat: number
    lon: number
    localtime?: string
    timezone?: string
  }
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onViewMap?: () => void
  onSearch?: () => void
}

export function EnhancedLocationDisplay({
  location,
  isFavorite = false,
  onToggleFavorite,
  onViewMap,
  onSearch,
}: LocationDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatLocalTime = (timeString?: string) => {
    if (!timeString) return ""

    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (e) {
      return timeString
    }
  }

  const formatDate = (timeString?: string) => {
    if (!timeString) return ""

    try {
      const date = new Date(timeString)
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return ""
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-2xl transition-all duration-500">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"></div>

          <div className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  ></motion.div>
                </div>

                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {location.name}
                    {onToggleFavorite && (
                      <button
                        onClick={onToggleFavorite}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location.region ? `${location.region}, ` : ""}
                    {location.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {location.localtime && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatLocalTime(location.localtime)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(location.localtime)}</div>
                  </div>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
                >
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Coordinates</div>
                        <div className="text-sm font-medium">
                          {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Timezone</div>
                        <div className="text-sm font-medium">{location.timezone || "UTC"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    {onViewMap && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewMap}
                        className="flex-1 bg-white/50 dark:bg-gray-800/50 border-blue-100 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Map className="h-4 w-4 mr-2" />
                        View Map
                      </Button>
                    )}

                    {onSearch && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onSearch}
                        className="flex-1 bg-white/50 dark:bg-gray-800/50 border-blue-100 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Change Location
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
