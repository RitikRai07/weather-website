"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface EnhancedSunriseSunsetProps {
  sunrise: string
  sunset: string
  currentTime?: string
}

export function EnhancedSunriseSunsetModern({ sunrise, sunset, currentTime }: EnhancedSunriseSunsetProps) {
  const [dayProgress, setDayProgress] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day")

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date()
      const hour = now.getHours()

      // Determine time of day
      if (hour >= 5 && hour < 10) {
        setTimeOfDay("morning")
      } else if (hour >= 10 && hour < 17) {
        setTimeOfDay("day")
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay("evening")
      } else {
        setTimeOfDay("night")
      }

      // Calculate progress
      const [sunriseHours, sunriseMinutes] = sunrise.split(":").map(Number)
      const [sunsetHours, sunsetMinutes] = sunset.split(":").map(Number)

      const sunriseTime = new Date()
      sunriseTime.setHours(sunriseHours, sunriseMinutes, 0)

      const sunsetTime = new Date()
      sunsetTime.setHours(sunsetHours, sunsetMinutes, 0)

      const dayDuration = sunsetTime.getTime() - sunriseTime.getTime()
      const timeSinceSunrise = now.getTime() - sunriseTime.getTime()

      let progress = 0
      if (now < sunriseTime) {
        progress = 0
      } else if (now > sunsetTime) {
        progress = 100
      } else {
        progress = (timeSinceSunrise / dayDuration) * 100
      }

      setDayProgress(Math.max(0, Math.min(100, progress)))
    }

    updateProgress()
    const interval = setInterval(updateProgress, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [sunrise, sunset])

  const getGradientClass = () => {
    switch (timeOfDay) {
      case "morning":
        return "from-amber-400 via-orange-300 to-yellow-200"
      case "day":
        return "from-sky-400 via-blue-300 to-cyan-200"
      case "evening":
        return "from-orange-600 via-pink-500 to-purple-600"
      case "night":
        return "from-slate-900 via-indigo-900 to-slate-800"
    }
  }

  const getSunIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return "🌅"
      case "day":
        return "☀️"
      case "evening":
        return "🌇"
      case "night":
        return "🌙"
    }
  }

  const getTimeOfDayText = () => {
    return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl">
      <CardContent className="p-0">
        {/* Main gradient background */}
        <div className={`relative bg-gradient-to-r ${getGradientClass()} p-8 overflow-hidden`}>
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.h3
                  className="text-lg font-bold text-white mb-1 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-2xl">{getSunIcon()}</span>
                  Day Progress
                </motion.h3>
                <p className="text-sm text-white/80">{getTimeOfDayText()}</p>
              </div>
              {currentTime && (
                <div className="text-right">
                  <p className="text-sm text-white/80">Current Time</p>
                  <p className="text-xl font-bold text-white font-mono">{currentTime}</p>
                </div>
              )}
            </div>

            {/* Arc Progress Visualization */}
            <div className="relative h-40 mb-8 flex items-center justify-center">
              <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Background arc */}
                <path
                  d="M 30 150 A 120 120 0 0 1 270 150"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Progress arc */}
                <motion.path
                  d="M 30 150 A 120 120 0 0 1 270 150"
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 565", opacity: 0 }}
                  animate={{
                    strokeDasharray: `${(dayProgress / 100) * 565} 565`,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
                  }}
                />

                {/* Sun/Moon position */}
                <motion.circle
                  cx={30 + (240 * dayProgress) / 100}
                  cy={150 - Math.sin((Math.PI * dayProgress) / 100) * 120}
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  animate={{
                    boxShadow: "0 0 20px rgba(255,255,255,0.6)",
                  }}
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(255,255,255,0.8))",
                  }}
                />

                {/* Labels */}
                <text x="20" y="155" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="bold">
                  5:00
                </text>
                <text x="260" y="155" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="bold">
                  18:00
                </text>

                {/* Percentage */}
                <text
                  x="150"
                  y="50"
                  textAnchor="middle"
                  fontSize="24"
                  fill="rgba(255,255,255,0.9)"
                  fontWeight="bold"
                >
                  {Math.round(dayProgress)}%
                </text>
              </svg>
            </div>

            {/* Sunrise and Sunset Times */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sunrise Card */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🌅
                  </motion.div>
                  <p className="text-xs text-white/70 uppercase font-semibold tracking-wider mb-1">Sunrise</p>
                  <p className="text-2xl font-bold text-white font-mono">{sunrise}</p>
                  <p className="text-xs text-white/60 mt-1">Morning light begins</p>
                </div>
              </motion.div>

              {/* Sunset Card */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🌇
                  </motion.div>
                  <p className="text-xs text-white/70 uppercase font-semibold tracking-wider mb-1">Sunset</p>
                  <p className="text-2xl font-bold text-white font-mono">{sunset}</p>
                  <p className="text-xs text-white/60 mt-1">Evening begins</p>
                </div>
              </motion.div>
            </div>

            {/* Day Length */}
            <motion.div
              className="mt-6 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-white/70 uppercase font-semibold tracking-wider mb-1">Daylight Duration</p>
              <motion.p
                className="text-lg font-bold text-white"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {Math.floor((parseInt(sunset.split(":")[0]) - parseInt(sunrise.split(":")[0]) + 
                  (parseInt(sunset.split(":")[1]) - parseInt(sunrise.split(":")[1])) / 60))} hours{" "}
                {Math.round((parseInt(sunset.split(":")[1]) - parseInt(sunrise.split(":")[1])) % 60)} minutes
              </motion.p>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
