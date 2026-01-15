"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Cloud, CloudRain, CloudSnow, CloudSun, Sun, Moon, CloudLightning, Wind } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface WeatherTimeDisplayProps {
  weatherCondition?: string
  temperature?: number
  sunrise?: string
  sunset?: string
}

export function WeatherTimeDisplay({
  weatherCondition = "clear",
  temperature,
  sunrise,
  sunset,
}: WeatherTimeDisplayProps) {
  const [time, setTime] = useState(new Date())
  const [isDay, setIsDay] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [hourAngle, setHourAngle] = useState(0)
  const [minuteAngle, setMinuteAngle] = useState(0)
  const [secondAngle, setSecondAngle] = useState(0)

  // Parse sunrise and sunset times if provided
  useEffect(() => {
    if (sunrise && sunset) {
      const now = new Date()

      // Parse sunrise time (format: "06:30 AM")
      const sunriseParts = sunrise.split(" ")[0].split(":")
      let sunriseHour = Number.parseInt(sunriseParts[0])
      const sunriseMinute = Number.parseInt(sunriseParts[1])
      if (sunrise.includes("PM") && sunriseHour !== 12) sunriseHour += 12
      if (sunrise.includes("AM") && sunriseHour === 12) sunriseHour = 0

      // Parse sunset time (format: "07:45 PM")
      const sunsetParts = sunset.split(" ")[0].split(":")
      let sunsetHour = Number.parseInt(sunsetParts[0])
      const sunsetMinute = Number.parseInt(sunsetParts[1])
      if (sunset.includes("PM") && sunsetHour !== 12) sunsetHour += 12
      if (sunset.includes("AM") && sunsetHour === 12) sunsetHour = 0

      // Create Date objects for sunrise and sunset
      const sunriseDate = new Date(now)
      sunriseDate.setHours(sunriseHour, sunriseMinute, 0)

      const sunsetDate = new Date(now)
      sunsetDate.setHours(sunsetHour, sunsetMinute, 0)

      // Check if current time is between sunrise and sunset
      setIsDay(now >= sunriseDate && now <= sunsetDate)
    } else {
      // Fallback if sunrise/sunset not provided
      const hours = time.getHours()
      setIsDay(hours >= 6 && hours < 18)
    }
  }, [time, sunrise, sunset])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now)
      setSeconds(now.getSeconds())

      // Calculate clock hand angles
      const hours = now.getHours() % 12
      const minutes = now.getMinutes()
      const secs = now.getSeconds()

      setHourAngle(hours * 30 + minutes * 0.5) // 30 degrees per hour + 0.5 degrees per minute
      setMinuteAngle(minutes * 6) // 6 degrees per minute
      setSecondAngle(secs * 6) // 6 degrees per second
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get weather icon based on condition and time of day
  const getWeatherIcon = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-500 animate-weather-pulse" />
    } else if (condition.includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-sky-300 animate-weather-pulse" />
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      return <CloudLightning className="h-8 w-8 text-amber-500 animate-weather-pulse" />
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return isDay ? (
        <CloudSun className="h-8 w-8 text-amber-400 animate-weather-pulse" />
      ) : (
        <Cloud className="h-8 w-8 text-slate-400 animate-weather-pulse" />
      )
    } else if (condition.includes("fog") || condition.includes("mist")) {
      return <Wind className="h-8 w-8 text-slate-400 animate-weather-pulse" />
    } else {
      // Clear
      return isDay ? (
        <Sun className="h-8 w-8 text-amber-400 animate-weather-pulse" />
      ) : (
        <Moon className="h-8 w-8 text-slate-300 animate-weather-pulse" />
      )
    }
  }

  // Get background gradient based on weather and time of day
  const getBackgroundGradient = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return isDay
        ? "bg-gradient-to-br from-slate-300 via-blue-200 to-slate-300"
        : "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800"
    } else if (condition.includes("snow")) {
      return isDay
        ? "bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200"
        : "bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900"
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      return isDay
        ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600"
        : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return isDay
        ? "bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300"
        : "bg-gradient-to-br from-slate-800 via-blue-950 to-slate-700"
    } else if (condition.includes("fog") || condition.includes("mist")) {
      return isDay
        ? "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300"
        : "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800"
    } else {
      // Clear
      return isDay
        ? "bg-gradient-to-br from-blue-300 via-sky-200 to-blue-100"
        : "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
    }
  }

  // Get text color based on time of day and weather
  const getTextColor = () => {
    const condition = weatherCondition.toLowerCase()

    if (!isDay && (condition.includes("clear") || condition.includes("cloud"))) {
      return "text-white"
    }

    return isDay ? "text-slate-800" : "text-slate-100"
  }

  // Get temperature color
  const getTemperatureColor = () => {
    if (!temperature) return "text-slate-600 dark:text-slate-300"

    if (temperature > 30) return "text-red-600 dark:text-red-400"
    if (temperature > 20) return "text-orange-600 dark:text-orange-400"
    if (temperature > 10) return "text-yellow-600 dark:text-yellow-400"
    if (temperature > 0) return "text-blue-600 dark:text-blue-400"
    return "text-cyan-600 dark:text-cyan-400"
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-2xl transition-all duration-500 transform hover:translate-y-[-3px]">
      <CardContent className="p-0">
        <div className={`${getBackgroundGradient()} p-6 relative overflow-hidden transition-colors duration-1000`}>
          {/* Weather-specific background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {weatherCondition.toLowerCase().includes("rain") && (
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
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
                {Array.from({ length: 30 }).map((_, i) => (
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
              <div className="absolute inset-0 opacity-30">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white/80 dark:bg-white/40 rounded-full blur-md animate-float-slow"
                    style={{
                      width: `${Math.random() * 100 + 50}px`,
                      height: `${Math.random() * 60 + 30}px`,
                      left: `${Math.random() * 80}%`,
                      top: `${Math.random() * 80}%`,
                      animationDuration: `${Math.random() * 10 + 10}s`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {(weatherCondition.toLowerCase().includes("thunder") ||
              weatherCondition.toLowerCase().includes("lightning")) && (
              <div className="absolute inset-0">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-yellow-400/30 animate-lightning"
                    style={{
                      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      width: `${Math.random() * 20 + 10}px`,
                      height: `${Math.random() * 30 + 20}px`,
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 50}%`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              {/* Analog clock */}
              <div className="relative w-24 h-24 rounded-full border-2 border-slate-300/50 dark:border-slate-600/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm shadow-inner flex items-center justify-center">
                {/* Clock center */}
                <div className="absolute w-2 h-2 bg-slate-700 dark:bg-slate-300 rounded-full z-20"></div>

                {/* Hour markers */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 ${i % 3 === 0 ? "h-3" : "h-2"} bg-slate-600 dark:bg-slate-400`}
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-10px)`,
                      transformOrigin: "center calc(100% - 2px)",
                      left: "calc(50% - 0.5px)",
                    }}
                  ></div>
                ))}

                {/* Hour hand */}
                <motion.div
                  className="absolute w-1.5 h-7 rounded-full z-10"
                  style={{
                    background: "linear-gradient(to top, #475569, #94a3b8)",
                    transformOrigin: "bottom center",
                    rotate: hourAngle,
                    bottom: "50%",
                    left: "calc(50% - 0.75px)",
                  }}
                  animate={{ rotate: hourAngle }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                ></motion.div>

                {/* Minute hand */}
                <motion.div
                  className="absolute w-1 h-10 rounded-full z-10"
                  style={{
                    background: "linear-gradient(to top, #334155, #64748b)",
                    transformOrigin: "bottom center",
                    rotate: minuteAngle,
                    bottom: "50%",
                    left: "calc(50% - 0.5px)",
                  }}
                  animate={{ rotate: minuteAngle }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                ></motion.div>

                {/* Second hand */}
                <motion.div
                  className="absolute w-0.5 h-11 bg-red-500 rounded-full z-10"
                  style={{
                    transformOrigin: "bottom center",
                    rotate: secondAngle,
                    bottom: "50%",
                    left: "calc(50% - 0.25px)",
                  }}
                  animate={{ rotate: secondAngle }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                ></motion.div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 mb-1">
                  {getWeatherIcon()}

                  {temperature !== undefined && (
                    <span className={`text-2xl font-bold ${getTemperatureColor()}`}>{temperature}°C</span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={formatTime(time)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="flex items-end">
                      <div className="relative">
                        <div className="text-5xl font-bold font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 animate-gradient-shift bg-size-200">
                          {formatTime(time).split(":").slice(0, 2).join(":")}
                        </div>
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                      </div>
                      <div className="ml-2 mb-1.5">
                        <span className="text-xl font-mono font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-lg shadow-md">
                          {formatTime(time).split(":")[2]}
                        </span>
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg animate-pulse-premium">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-2 text-sm mt-3 font-date premium-glass px-3 py-1.5 rounded-full shadow-md">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{formatDate(time)}</span>
                </div>
              </div>
            </div>

            {/* Animated seconds indicator */}
            <div className="w-full h-1.5 bg-slate-300/30 dark:bg-slate-700/30 backdrop-blur-sm rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shimmer-enhanced"
                animate={{ width: `${(seconds / 60) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 backdrop-blur-sm ${
                isDay
                  ? "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                  : "bg-blue-900/20 text-blue-700 dark:bg-blue-800/20 dark:text-blue-300"
              }`}
            >
              {isDay ? (
                <>
                  <Sun className="h-5 w-5 text-amber-500 animate-sun-rays" />
                  <span className="font-weather">Daytime</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-slate-300 animate-moon-glow" />
                  <span className="font-weather">Nighttime</span>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
;<style jsx>{`
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}

.bg-size-200 {
  background-size: 200% 200%;
}

@keyframes pulse-premium {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.animate-pulse-premium {
  animation: pulse-premium 2s ease-in-out infinite;
}

.premium-glass {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
`}</style>
