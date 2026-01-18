"use client"

import { motion } from "framer-motion"
import { Thermometer, TrendingUp, TrendingDown, Wind, Droplets, Eye, Gauge } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EnhancedTempAQIDisplayProps {
  current: number
  feelsLike: number
  min: number
  max: number
  aqi: number
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  unit?: "celsius" | "fahrenheit"
}

export function EnhancedTempAQIDisplay({
  current,
  feelsLike,
  min,
  max,
  aqi,
  humidity,
  windSpeed,
  visibility,
  pressure,
  unit = "celsius",
}: EnhancedTempAQIDisplayProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return "from-red-600 to-red-400"
    if (temp > 30) return "from-orange-600 to-orange-400"
    if (temp > 25) return "from-amber-600 to-amber-400"
    if (temp > 20) return "from-yellow-600 to-yellow-400"
    if (temp > 15) return "from-lime-600 to-lime-400"
    if (temp > 10) return "from-green-600 to-green-400"
    if (temp > 5) return "from-teal-600 to-teal-400"
    if (temp > 0) return "from-cyan-600 to-cyan-400"
    return "from-blue-600 to-blue-400"
  }

  const getAQIColor = (aqiValue: number) => {
    if (aqiValue <= 50) return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Good" }
    if (aqiValue <= 100) return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", label: "Moderate" }
    if (aqiValue <= 150) return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", label: "Unhealthy for Sensitive" }
    if (aqiValue <= 200) return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Unhealthy" }
    return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", label: "Hazardous" }
  }

  const aqiColor = getAQIColor(aqi)
  const tempDiff = Math.abs(current - feelsLike)
  const trend = current > feelsLike ? "higher" : current < feelsLike ? "lower" : "equal"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Temperature Card */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Current Temperature Section */}
              <div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Current Temperature
                    </p>
                    <motion.div
                      className={`text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getTemperatureColor(current)}`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      {current}°{unit === "celsius" ? "C" : "F"}
                    </motion.div>
                  </div>
                  <div className={`rounded-full p-4 bg-gradient-to-r ${getTemperatureColor(current)}`}>
                    <Thermometer className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Feels Like Temperature */}
                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/30 dark:border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Feels Like</p>
                      <motion.p
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        {feelsLike}°{unit === "celsius" ? "C" : "F"}
                      </motion.p>
                    </div>
                    {tempDiff > 2 && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                          {trend === "lower" ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">{tempDiff}° {trend}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Min/Max Temperature */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100/50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/30 dark:border-blue-800/30">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Low</p>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{min}°</p>
                  </div>
                </div>
                <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200/30 dark:border-red-800/30">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">High</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{max}°</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AQI and Additional Metrics Card */}
      <div className="space-y-6">
        {/* Air Quality Index */}
        <Card className={`overflow-hidden border-none shadow-lg ${aqiColor.bg}`}>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
              Air Quality Index
            </p>
            <div className="text-center">
              <motion.div
                className={`text-5xl font-bold ${aqiColor.text} mb-2`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {aqi}%
              </motion.div>
              <p className={`text-sm font-semibold ${aqiColor.text}`}>{aqiColor.label}</p>
            </div>
            <div className="mt-4 h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r from-green-500 to-red-500`}
                initial={{ width: "0%" }}
                animate={{ width: `${aqi}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Weather Metrics */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
              Weather Metrics
            </p>
            <div className="space-y-3">
              {/* Humidity */}
              <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/20 dark:border-blue-800/20">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Humidity</span>
                </div>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{humidity}%</span>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center justify-between p-3 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200/20 dark:border-cyan-800/20">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Wind</span>
                </div>
                <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{windSpeed} km/h</span>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-3 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200/20 dark:border-purple-800/20">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Visibility</span>
                </div>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{visibility} km</span>
              </div>

              {/* Pressure */}
              <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-200/20 dark:border-amber-800/20">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Pressure</span>
                </div>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{pressure} mb</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
