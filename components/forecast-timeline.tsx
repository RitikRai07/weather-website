"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"
import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface ForecastItem {
  time: string
  temp: number
  condition: string
  iconUrl: string
  precipitation: number
  wind: number
}

interface ForecastTimelineProps {
  hourlyForecast: ForecastItem[]
  dailyForecast?: ForecastItem[]
  unit?: "celsius" | "fahrenheit"
}

export function ForecastTimeline({ hourlyForecast, dailyForecast, unit = "celsius" }: ForecastTimelineProps) {
  const [activeView, setActiveView] = useState<"hourly" | "daily">("hourly")
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 6 })

  const activeData = activeView === "hourly" ? hourlyForecast : dailyForecast || []
  const visibleData = activeData.slice(visibleRange.start, visibleRange.end)

  const handleNext = () => {
    if (visibleRange.end < activeData.length) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1,
      })
    }
  }

  const handlePrev = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: visibleRange.start - 1,
        end: visibleRange.end - 1,
      })
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-red-500"
    if (temp > 20) return "text-orange-500"
    if (temp > 10) return "text-yellow-600"
    if (temp > 0) return "text-blue-500"
    return "text-cyan-600"
  }

  const getPrecipitationColor = (precip: number) => {
    if (precip > 80) return "bg-blue-700"
    if (precip > 60) return "bg-blue-600"
    if (precip > 40) return "bg-blue-500"
    if (precip > 20) return "bg-blue-400"
    if (precip > 0) return "bg-blue-300"
    return "bg-gray-200 dark:bg-gray-700"
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-2xl transition-all duration-500">
      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView("hourly")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeView === "hourly"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80"
                }`}
              >
                <Clock className="h-4 w-4" />
                Hourly
              </button>

              <button
                onClick={() => setActiveView("daily")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeView === "daily"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Daily
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={visibleRange.start === 0}
                className="p-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={visibleRange.end >= activeData.length}
                className="p-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-6 gap-2">
            {visibleData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl blur-md -z-10 group-hover:from-blue-100/50 group-hover:to-purple-100/50 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-300"></div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center shadow-sm group-hover:shadow-md transition-all duration-300 border border-blue-100/50 dark:border-blue-900/30">
                  <div className="text-sm font-medium bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded-full text-blue-700 dark:text-blue-300 mb-2">
                    {item.time}
                  </div>

                  <div className="my-2">
                    <WeatherIcon
                      iconUrl={item.iconUrl}
                      description={item.condition}
                      size="small"
                      condition={item.condition}
                    />
                  </div>

                  <div className={`text-lg font-bold ${getTemperatureColor(item.temp)}`}>
                    {item.temp}°{unit === "celsius" ? "C" : "F"}
                  </div>

                  <div className="w-full mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Precip</span>
                      <span>{item.precipitation}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPrecipitationColor(item.precipitation)} rounded-full`}
                        style={{ width: `${item.precipitation}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-full mt-1 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Wind</span>
                      <span>{item.wind} km/h</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, (item.wind / 50) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(activeData.length / 6) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVisibleRange({ start: i * 6, end: Math.min((i + 1) * 6, activeData.length) })}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i * 6 === visibleRange.start
                      ? "bg-blue-500 w-4"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Page ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
