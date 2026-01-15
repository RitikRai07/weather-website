"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sun, Moon, Sunrise, Sunset } from "lucide-react"

interface SunriseSunsetProps {
  sunrise: string
  sunset: string
  currentTime?: string
}

export function EnhancedSunriseSunset({ sunrise, sunset, currentTime }: SunriseSunsetProps) {
  const [progress, setProgress] = useState(0)
  const [isDay, setIsDay] = useState(true)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!sunrise || !sunset || !currentTime) return

    const sunriseTime = new Date(sunrise).getTime()
    const sunsetTime = new Date(sunset).getTime()
    const current = new Date(currentTime).getTime() || Date.now()

    // Calculate day length and progress
    const dayLength = sunsetTime - sunriseTime
    const timeElapsed = current - sunriseTime
    const calculatedProgress = Math.max(0, Math.min(100, (timeElapsed / dayLength) * 100))

    setProgress(calculatedProgress)
    setIsDay(current >= sunriseTime && current <= sunsetTime)

    // Calculate time left until next event
    const nextEvent =
      current < sunriseTime
        ? sunriseTime
        : current < sunsetTime
          ? sunsetTime
          : new Date(new Date(sunrise).setDate(new Date(sunrise).getDate() + 1)).getTime()

    const timeLeftMs = nextEvent - current
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))

    setTimeLeft(`${hours}h ${minutes}m`)
  }, [sunrise, sunset, currentTime])

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900 dark:to-amber-900">
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          {/* Sky background with gradient */}
          <div
            className={`absolute inset-0 transition-colors duration-1000 ${
              isDay ? "bg-gradient-to-b from-blue-400 to-blue-200" : "bg-gradient-to-b from-indigo-900 to-purple-700"
            }`}
          />

          {/* Sun/Moon position indicator */}
          <div
            className="absolute bottom-0 w-full h-1/2"
            style={{
              background: `linear-gradient(to top, 
                ${isDay ? "rgba(253, 230, 138, 0.2)" : "rgba(30, 41, 59, 0.4)"} 0%, 
                transparent 100%)`,
            }}
          >
            {/* Sun/Moon path arc */}
            <div className="absolute bottom-0 w-full h-32 border-t-2 border-dashed border-white/30 rounded-full transform -translate-y-8 scale-x-[1.8]" />

            {/* Sun/Moon icon */}
            <div
              className="absolute bottom-8 transition-all duration-1000"
              style={{
                left: `${progress}%`,
                transform: `translateX(-50%) translateY(${isDay ? "0" : "-20px"})`,
              }}
            >
              {isDay ? (
                <div className="sun-glow">
                  <Sun size={32} className="text-yellow-300 animate-pulse" />
                </div>
              ) : (
                <div className="moon-glow">
                  <Moon size={28} className="text-gray-100" />
                </div>
              )}
            </div>
          </div>

          {/* Landscape silhouette */}
          <div className="absolute bottom-0 w-full">
            <svg viewBox="0 0 1440 120" className="w-full">
              <path
                d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,90.7C672,107,768,117,864,112C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                fill={isDay ? "#374151" : "#111827"}
              />
            </svg>
          </div>

          {/* Time indicators */}
          <div className="absolute bottom-0 w-full px-6 pb-4 flex justify-between text-white">
            <div className="flex flex-col items-center">
              <Sunrise size={20} className="text-yellow-300 mb-1" />
              <span className="text-xs font-medium">
                {new Date(sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Sunset size={20} className="text-orange-400 mb-1" />
              <span className="text-xs font-medium">
                {new Date(sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg dark:text-white">{isDay ? "Daylight" : "Night Time"}</h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
              {isDay ? `Sunset in ${timeLeft}` : `Sunrise in ${timeLeft}`}
            </span>
          </div>

          <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: isDay
                  ? "linear-gradient(to right, #fde68a, #f59e0b)"
                  : "linear-gradient(to right, #6366f1, #8b5cf6)",
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2">
                <Sunrise size={16} className="text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
                <p className="font-medium dark:text-white">
                  {new Date(sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-2">
                <Sunset size={16} className="text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
                <p className="font-medium dark:text-white">
                  {new Date(sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
