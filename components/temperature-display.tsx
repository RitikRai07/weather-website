"use client"

import { motion } from "framer-motion"
import { Thermometer, TrendingUp, TrendingDown } from "lucide-react"

interface TemperatureDisplayProps {
  current: number
  feelsLike?: number
  min?: number
  max?: number
  unit?: "celsius" | "fahrenheit"
  size?: "small" | "medium" | "large"
  showTrend?: boolean
  trend?: "rising" | "falling" | "stable"
}

export function TemperatureDisplay({
  current,
  feelsLike,
  min,
  max,
  unit = "celsius",
  size = "medium",
  showTrend = false,
  trend = "stable",
}: TemperatureDisplayProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return "from-red-600 to-red-400 dark:from-red-500 dark:to-red-300"
    if (temp > 30) return "from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-300"
    if (temp > 25) return "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300"
    if (temp > 20) return "from-yellow-600 to-yellow-400 dark:from-yellow-500 dark:to-yellow-300"
    if (temp > 15) return "from-lime-600 to-lime-400 dark:from-lime-500 dark:to-lime-300"
    if (temp > 10) return "from-green-600 to-green-400 dark:from-green-500 dark:to-green-300"
    if (temp > 5) return "from-teal-600 to-teal-400 dark:from-teal-500 dark:to-teal-300"
    if (temp > 0) return "from-cyan-600 to-cyan-400 dark:from-cyan-500 dark:to-cyan-300"
    if (temp > -5) return "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"
    if (temp > -10) return "from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300"
    return "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300"
  }

  const getTemperatureIcon = (temp: number) => {
    if (temp > 30) return "🔥"
    if (temp > 20) return "☀️"
    if (temp > 10) return "🌤️"
    if (temp > 0) return "❄️"
    return "🧊"
  }

  const getTrendIcon = () => {
    if (trend === "rising") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "falling") return <TrendingDown className="h-4 w-4 text-blue-500" />
    return null
  }

  const sizeClasses = {
    small: {
      container: "p-2",
      main: "text-2xl",
      secondary: "text-xs",
      icon: "h-4 w-4",
    },
    medium: {
      container: "p-3",
      main: "text-4xl",
      secondary: "text-sm",
      icon: "h-5 w-5",
    },
    large: {
      container: "p-4",
      main: "text-6xl",
      secondary: "text-base",
      icon: "h-6 w-6",
    },
  }

  return (
    <div className={`relative group ${sizeClasses[size].container}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl blur-md -z-10 group-hover:from-blue-100/50 group-hover:to-purple-100/50 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-300"></div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100/50 dark:border-blue-900/30 group-hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 bg-gradient-to-r ${getTemperatureColor(current)}`}>
              <Thermometer className={`${sizeClasses[size].icon} text-white`} />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</span>
          </div>

          {showTrend && getTrendIcon()}
        </div>

        <div className="flex items-end gap-2">
          <motion.div
            className={`font-bold ${sizeClasses[size].main} bg-clip-text text-transparent bg-gradient-to-r ${getTemperatureColor(current)}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {current}°{unit === "celsius" ? "C" : "F"}
          </motion.div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{getTemperatureIcon(current)}</div>
        </div>

        {min !== undefined && max !== undefined && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-blue-500" />
              <span className={`${sizeClasses[size].secondary} text-blue-600 dark:text-blue-400 font-medium`}>
                {min}°
              </span>
            </div>

            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span className={`${sizeClasses[size].secondary} text-red-600 dark:text-red-400 font-medium`}>
                {max}°
              </span>
            </div>
          </div>
        )}

        {feelsLike !== undefined && (
          <div className="mt-2 text-center">
            <span className={`${sizeClasses[size].secondary} text-gray-600 dark:text-gray-300`}>
              Feels like <span className="font-medium">{feelsLike}°</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
