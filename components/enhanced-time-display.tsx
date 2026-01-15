"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  MapPin,
  Globe,
  Compass,
  RefreshCw,
} from "lucide-react"

interface EnhancedTimeDisplayProps {
  weatherCondition?: string
  temperature?: number
  humidity?: number
  windSpeed?: number
  location?: string
}

export function EnhancedTimeDisplay({
  weatherCondition = "clear",
  temperature,
  humidity = 60,
  windSpeed = 10,
  location = "Unknown",
}: EnhancedTimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day")
  const [animateSeconds, setAnimateSeconds] = useState(false)
  const [currentDate, setCurrentDate] = useState<string>("")
  const [isDay, setIsDay] = useState<boolean>(true)
  const [timezone, setTimezone] = useState<string>("Loading timezone...")
  const [ampm, setAmPm] = useState<string>("AM")
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("Just now")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setAnimateSeconds(true)

      setTimeout(() => {
        setAnimateSeconds(false)
      }, 500)

      // Determine time of day
      const hour = now.getHours()
      if (hour >= 5 && hour < 12) {
        setTimeOfDay("morning")
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay("day")
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay("evening")
      } else {
        setTimeOfDay("night")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setCurrentDate(currentTime.toLocaleDateString(undefined, dateOptions))

    setIsDay(timeOfDay === "day" || timeOfDay === "morning")

    const hour = currentTime.getHours()
    setAmPm(hour >= 12 ? "PM" : "AM")
  }, [currentTime, timeOfDay])

  // Format time for display
  const formatTime = () => {
    let hours = currentTime.getHours()
    const minutes = currentTime.getMinutes().toString().padStart(2, "0")
    const seconds = currentTime.getSeconds().toString().padStart(2, "0")

    // Convert to 12-hour format
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return { hours: hours.toString().padStart(2, "0"), minutes, seconds }
  }

  // Format date for display
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return currentTime.toLocaleDateString(undefined, options)
  }

  // Get background gradient based on time of day and weather
  const getBackgroundGradient = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      switch (timeOfDay) {
        case "morning":
          return "bg-gradient-to-br from-slate-400 via-blue-300 to-slate-400"
        case "day":
          return "bg-gradient-to-br from-slate-400 via-blue-300 to-slate-400"
        case "evening":
          return "bg-gradient-to-br from-slate-500 via-blue-400 to-orange-300"
        case "night":
          return "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      }
    } else if (condition.includes("snow")) {
      switch (timeOfDay) {
        case "morning":
          return "bg-gradient-to-br from-slate-300 via-blue-200 to-pink-200"
        case "day":
          return "bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100"
        case "evening":
          return "bg-gradient-to-br from-slate-300 via-blue-200 to-pink-200"
        case "night":
          return "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-700"
      }
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      switch (timeOfDay) {
        case "morning":
          return "bg-gradient-to-br from-slate-500 via-purple-400 to-slate-600"
        case "day":
          return "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-600"
        case "evening":
          return "bg-gradient-to-br from-slate-600 via-purple-500 to-slate-700"
        case "night":
          return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      }
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      switch (timeOfDay) {
        case "morning":
          return "bg-gradient-to-br from-slate-300 via-pink-200 to-blue-300"
        case "day":
          return "bg-gradient-to-br from-slate-300 via-blue-200 to-slate-300"
        case "evening":
          return "bg-gradient-to-br from-slate-400 via-orange-300 to-blue-300"
        case "night":
          return "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-700"
      }
    } else {
      // Clear
      switch (timeOfDay) {
        case "morning":
          return "bg-gradient-to-br from-blue-300 via-sky-200 to-blue-100"
        case "day":
          return "bg-gradient-to-br from-sky-300 via-blue-200 to-sky-300"
        case "evening":
          return "bg-gradient-to-br from-orange-400 via-amber-300 to-blue-300"
        case "night":
          return "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
      }
    }
  }

  // Get text color based on time of day and weather
  const getTextColor = () => {
    if (timeOfDay === "night") {
      return "text-white"
    }
    return "text-gray-900"
  }

  // Get weather icon based on condition
  const getWeatherIcon = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-10 w-10 text-blue-500 drop-shadow-glow" />
    } else if (condition.includes("snow")) {
      return <CloudSnow className="h-10 w-10 text-sky-300 drop-shadow-glow" />
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      return <CloudLightning className="h-10 w-10 text-amber-500 drop-shadow-glow" />
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return <Cloud className="h-10 w-10 text-slate-400 drop-shadow-glow" />
    } else {
      // Clear
      return timeOfDay === "night" ? (
        <Moon className="h-10 w-10 text-slate-300 drop-shadow-glow" />
      ) : (
        <Sun className="h-10 w-10 text-amber-400 drop-shadow-glow" />
      )
    }
  }

  const { hours, minutes, seconds } = formatTime()

  const refreshWeather = () => {
    setLastUpdated("Updating...")
    setTimeout(() => {
      setLastUpdated("Just now")
    }, 1500)
  }

  return (
    <Card className="overflow-hidden border-none shadow-2xl transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] rounded-2xl">
      <CardContent className="p-0">
        <div
          className={`${getBackgroundGradient()} p-6 relative overflow-hidden transition-colors duration-1000 rounded-2xl`}
        >
          {/* Weather-specific background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {weatherCondition.toLowerCase().includes("rain") && (
              <div className="absolute inset-0">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-blue-400/30 dark:bg-blue-500/30 animate-rain"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 1 + 0.5}s`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {weatherCondition.toLowerCase().includes("snow") && (
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/70 dark:bg-white/50 animate-snow"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {weatherCondition.toLowerCase().includes("cloud") && (
              <div className="absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white/20 rounded-full blur-xl animate-float-slow"
                    style={{
                      width: `${Math.random() * 100 + 50}px`,
                      height: `${Math.random() * 60 + 30}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 50}%`,
                      animationDuration: `${Math.random() * 10 + 15}s`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {(weatherCondition.toLowerCase().includes("clear") || weatherCondition.toLowerCase().includes("sun")) &&
              timeOfDay === "day" && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              )}

            {timeOfDay === "night" && (
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/70 animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          <div className="premium-card overflow-hidden">
            <div className="relative p-6 overflow-hidden">
              {/* Background elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

              {/* Location and date header */}
              <div className="relative z-10 flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      {location || "Loading location..."}
                    </h2>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1.5 text-purple-500" />
                    <span>{currentDate}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isDay ? (
                    <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800/30 shadow-md">
                      <Sun className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Day</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800/30 shadow-md">
                      <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Night</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital clock */}
              <div className="relative z-10 mb-8">
                <div className="premium-glass rounded-2xl p-6 border border-white/20 dark:border-gray-800/20 shadow-lg">
                  <div className="flex justify-center items-end space-x-2 mb-2">
                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold tabular-nums relative">
                        {hours}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">HOURS</div>
                    </div>

                    <div className="text-4xl font-mono font-bold text-gray-400 dark:text-gray-600 mb-1 animate-pulse">
                      :
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold tabular-nums relative">
                        {minutes}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">MINUTES</div>
                    </div>

                    <div className="text-4xl font-mono font-bold text-gray-400 dark:text-gray-600 mb-1 animate-pulse">
                      :
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold tabular-nums relative">
                        {seconds}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">SECONDS</div>
                    </div>

                    <div className="text-center ml-2 mb-1">
                      <div className="text-xl font-mono font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg">
                        {ampm}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                      <span>Real-time clock</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Globe className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                      <span>{timezone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather metrics */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="premium-glass p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2 shadow-lg">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="text-2xl font-bold mt-1">{temperature ? `${temperature}°C` : "--°C"}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Feels like: {temperature ? `${temperature}°C` : "--°C"}
                  </div>
                </div>

                <div className="premium-glass p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-2 shadow-lg">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="text-2xl font-bold mt-1">{humidity ? `${humidity}%` : "--%"}</div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${humidity || 0}%` }}></div>
                  </div>
                </div>

                <div className="premium-glass p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-2 shadow-lg">
                    <Wind className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">Wind Speed</div>
                  <div className="text-2xl font-bold mt-1">{windSpeed ? `${windSpeed} km/h` : "-- km/h"}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <Compass className="h-3.5 w-3.5 mr-1" />
                    Direction: {windSpeed ? "--" : "--"}
                  </div>
                </div>

                <div className="premium-glass p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-2 shadow-lg">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium">UV Index</div>
                  <div className="text-2xl font-bold mt-1">--</div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
                      style={{ width: `${0 * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="relative z-10 mt-6 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  <span>Last updated: {lastUpdated || "Just now"}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                    <span>Live</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={refreshWeather}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
