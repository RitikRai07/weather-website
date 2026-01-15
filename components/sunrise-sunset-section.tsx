"use client"

import { useState, useEffect } from "react"
import { Sunrise, Sunset, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface SunriseSunsetProps {
  sunrise: string
  sunset: string
  currentTime?: string
}

export default function SunriseSunsetSection({ sunrise, sunset, currentTime }: SunriseSunsetProps) {
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day")
  const [progress, setProgress] = useState(50)

  useEffect(() => {
    // Determine time of day based on current time
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 5 && hour < 10) {
      setTimeOfDay("morning")
    } else if (hour >= 10 && hour < 17) {
      setTimeOfDay("day")
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay("evening")
    } else {
      setTimeOfDay("night")
    }

    // Calculate sun position progress
    const sunriseTime = new Date()
    const [sunriseHours, sunriseMinutes] = sunrise.split(":").map(Number)
    sunriseTime.setHours(sunriseHours, sunriseMinutes, 0)

    const sunsetTime = new Date()
    const [sunsetHours, sunsetMinutes] = sunset.split(":").map(Number)
    sunsetTime.setHours(sunsetHours, sunsetMinutes, 0)

    const dayDuration = sunsetTime.getTime() - sunriseTime.getTime()
    const timeSinceSunrise = now.getTime() - sunriseTime.getTime()

    let calculatedProgress = 0

    if (now < sunriseTime) {
      calculatedProgress = 0
    } else if (now > sunsetTime) {
      calculatedProgress = 100
    } else {
      calculatedProgress = (timeSinceSunrise / dayDuration) * 100
    }

    setProgress(Math.max(0, Math.min(100, calculatedProgress)))
  }, [sunrise, sunset])

  // Get background gradient based on time of day
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case "morning":
        return "bg-gradient-to-r from-amber-200 via-orange-300 to-yellow-400"
      case "day":
        return "bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300"
      case "evening":
        return "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
      case "night":
        return "bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900"
    }
  }

  // Get sun/moon image based on time of day
  const getCelestialImage = () => {
    switch (timeOfDay) {
      case "morning":
        return "/sunrise.svg?height=80&width=80"
      case "day":
        return "/sun.svg?height=80&width=80"
      case "evening":
        return "/sunset.svg?height=80&width=80"
      case "night":
        return "/moon.svg?height=80&width=80"
    }
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div className={`${getBackgroundGradient()} p-6 relative overflow-hidden`}>
        {/* Animated clouds */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div
            className="cloud-1 absolute w-20 h-10 bg-white rounded-full"
            style={{ top: "20%", left: "10%", animation: "float 30s linear infinite" }}
          ></div>
          <div
            className="cloud-2 absolute w-32 h-16 bg-white rounded-full"
            style={{ top: "40%", left: "60%", animation: "float 25s linear infinite 5s" }}
          ></div>
          <div
            className="cloud-3 absolute w-24 h-12 bg-white rounded-full"
            style={{ top: "15%", left: "80%", animation: "float 35s linear infinite 10s" }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-white" />
              <span className="text-white font-medium">{currentTime || "Current Time"}</span>
            </div>
            <div className="text-white font-medium">{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</div>
          </div>

          <div className="flex justify-center mb-6">
            <motion.img
              src={getCelestialImage()}
              alt={timeOfDay === "night" ? "Moon" : "Sun"}
              className="h-20 w-20 drop-shadow-lg"
              animate={{
                y: [0, -10, 0],
                rotate: timeOfDay === "night" ? 0 : 360,
              }}
              transition={{
                y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              }}
            />
          </div>

          <div className="relative h-2 bg-white/30 rounded-full overflow-hidden mb-6">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            ></motion.div>
          </div>

          <div className="flex justify-between text-white">
            <div className="flex flex-col items-center">
              <Sunrise className="h-6 w-6 mb-1 text-yellow-200" />
              <div className="text-sm font-medium">Sunrise</div>
              <div className="text-lg font-bold">{sunrise}</div>
            </div>

            <div className="flex flex-col items-center">
              <Sunset className="h-6 w-6 mb-1 text-orange-300" />
              <div className="text-sm font-medium">Sunset</div>
              <div className="text-lg font-bold">{sunset}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}
