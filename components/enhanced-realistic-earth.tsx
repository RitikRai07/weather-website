"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Compass,
  Sunrise,
  Sunset,
  MapPinIcon,
} from "lucide-react"

interface EnhancedRealisticEarthProps {
  sunrise: string
  sunset: string
  isDay?: boolean
  weatherCondition?: string
  temperature?: number
  humidity?: number
  windSpeed?: number
  location?: string
  latitude?: number
  longitude?: number
}

export function EnhancedRealisticEarth({
  sunrise,
  sunset,
  isDay = true,
  weatherCondition = "clear",
  temperature,
  humidity = 60,
  windSpeed = 10,
  location = "Unknown",
  latitude = 40.7128,
  longitude = -74.006,
}: EnhancedRealisticEarthProps) {
  const [earthRotation, setEarthRotation] = useState(0)
  const [timeProgress, setTimeProgress] = useState(50) // 0-100, representing time of day
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 })
  const [moonPosition, setMoonPosition] = useState({ x: 0, y: 0 })
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<"dawn" | "day" | "dusk" | "night">("day")
  const [showDetails, setShowDetails] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showWeatherInfo, setShowWeatherInfo] = useState(false)
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [earthSize, setEarthSize] = useState(128)

  const earthRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sunControls = useAnimation()
  const moonControls = useAnimation()
  const cloudControls = useAnimation()

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format coordinates
  const formatCoordinates = (lat: number, lon: number) => {
    const latDir = lat >= 0 ? "N" : "S"
    const lonDir = lon >= 0 ? "E" : "W"
    return `${Math.abs(lat).toFixed(2)}° ${lat}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`
  }

  // Calculate day progress
  const calculateDayProgress = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const dayProgress = (totalMinutes / (24 * 60)) * 100
    return dayProgress
  }

  // Set up the animation and positions
  useEffect(() => {
    // Parse sunrise and sunset times
    const parseSunriseSunset = () => {
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

      // Current hour and minute
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Convert all to minutes since midnight
      const sunriseMinutes = sunriseHour * 60 + sunriseMinute
      const sunsetMinutes = sunsetHour * 60 + sunsetMinute
      const currentMinutes = currentHour * 60 + currentMinute

      // Calculate daylight duration
      const daylightDuration = sunsetMinutes - sunriseMinutes

      // Calculate time progress (0-100)
      let progress = 0

      // Determine time of day
      if (currentMinutes >= sunriseMinutes - 30 && currentMinutes < sunriseMinutes + 30) {
        setCurrentTimeOfDay("dawn")
      } else if (currentMinutes >= sunriseMinutes + 30 && currentMinutes < sunsetMinutes - 30) {
        setCurrentTimeOfDay("day")
      } else if (currentMinutes >= sunsetMinutes - 30 && currentMinutes < sunsetMinutes + 30) {
        setCurrentTimeOfDay("dusk")
      } else {
        setCurrentTimeOfDay("night")
      }

      if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
        // Daytime
        progress = ((currentMinutes - sunriseMinutes) / daylightDuration) * 50 + 25
      } else if (currentMinutes > sunsetMinutes) {
        // Evening to midnight
        const nightProgress = (currentMinutes - sunsetMinutes) / (24 * 60 - sunsetMinutes + sunriseMinutes)
        progress = nightProgress * 50 + 75
      } else {
        // Midnight to sunrise
        const nightProgress = currentMinutes / sunriseMinutes
        progress = nightProgress * 25
      }

      return progress
    }

    // Calculate time progress
    const progress = isDay ? 50 : parseSunriseSunset()
    setTimeProgress(progress)

    // Calculate sun and moon positions based on progress
    const calculatePositions = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = containerRef.current.offsetHeight
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2
      const radius = Math.min(containerWidth, containerHeight) * 0.4

      // Convert progress (0-100) to radians (0-2π)
      const sunAngle = (progress / 100) * Math.PI * 2 - Math.PI / 2
      const moonAngle = sunAngle + Math.PI

      // Calculate positions
      const sunX = centerX + radius * Math.cos(sunAngle)
      const sunY = centerY + radius * Math.sin(sunAngle)
      const moonX = centerX + radius * Math.cos(moonAngle)
      const moonY = centerY + radius * Math.sin(moonAngle)

      return { sunX, sunY, moonX, moonY }
    }

    const positions = calculatePositions()
    if (positions) {
      const { sunX, sunY, moonX, moonY } = positions
      setSunPosition({ x: sunX, y: sunY })
      setMoonPosition({ x: moonX, y: moonY })

      // Animate the sun and moon
      sunControls.start({
        x: sunX - 15,
        y: sunY - 15,
        opacity: currentTimeOfDay === "night" ? 0.3 : 1,
        scale: currentTimeOfDay === "night" ? 0.8 : 1,
        transition: { duration: 1.5, ease: "easeInOut" },
      })

      moonControls.start({
        x: moonX - 12,
        y: moonY - 12,
        opacity: currentTimeOfDay === "night" || currentTimeOfDay === "dawn" || currentTimeOfDay === "dusk" ? 1 : 0.3,
        scale: currentTimeOfDay === "night" || currentTimeOfDay === "dawn" || currentTimeOfDay === "dusk" ? 1 : 0.8,
        transition: { duration: 1.5, ease: "easeInOut" },
      })
    }

    // Start Earth rotation
    setEarthRotation(isDay ? 0 : 180)

    // Animate clouds
    cloudControls.start({
      rotate: 360,
      transition: { duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
    })

    // Update position periodically
    const interval = setInterval(() => {
      setEarthRotation((prev) => (prev + 0.5) % 360)
    }, 1000)

    return () => clearInterval(interval)
  }, [sunrise, sunset, isDay, sunControls, moonControls, cloudControls, currentTimeOfDay])

  // Weather condition effects
  const getWeatherOverlay = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-blue-400/50 animate-rain"
              style={{
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 1 + 0.5}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )
    }

    if (condition.includes("snow")) {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/70 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )
    }

    if (condition.includes("thunder") || condition.includes("lightning")) {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-yellow-400/70 animate-lightning"
              style={{
                clipPath: "polygon(50% 0%, 45% 40%, 60% 40%, 40% 100%, 45% 60%, 30% 60%)",
                width: `${Math.random() * 10 + 8}px`,
                height: `${Math.random() * 20 + 15}px`,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      )
    }

    return null
  }

  // Get weather icon based on condition
  const getWeatherIcon = () => {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-6 w-6 text-blue-500 absolute top-5 right-5 drop-shadow-glow" />
    } else if (condition.includes("snow")) {
      return <CloudSnow className="h-6 w-6 text-sky-300 absolute top-5 right-5 drop-shadow-glow" />
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      return <CloudLightning className="h-6 w-6 text-amber-500 absolute top-5 right-5 drop-shadow-glow" />
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return <Cloud className="h-6 w-6 text-slate-400 absolute top-5 right-5 drop-shadow-glow" />
    }

    return null
  }

  // Get background based on time of day
  const getBackgroundGradient = () => {
    switch (currentTimeOfDay) {
      case "dawn":
        return "bg-gradient-to-b from-orange-300 via-pink-200 to-blue-300"
      case "day":
        return "bg-gradient-to-b from-blue-300 to-blue-500"
      case "dusk":
        return "bg-gradient-to-b from-orange-400 via-pink-400 to-purple-500"
      case "night":
        return "bg-gradient-to-b from-indigo-900 to-purple-900"
    }
  }

  // Calculate approximate coordinates display
  const formatCoordinatesOld = () => {
    const latDir = latitude >= 0 ? "N" : "S"
    const lonDir = longitude >= 0 ? "E" : "W"
    return `${Math.abs(latitude).toFixed(2)}° ${latDir}, ${Math.abs(longitude).toFixed(2)}° ${lonDir}`
  }

  const handleEarthClick = () => {
    setShowWeatherInfo(true)
  }

  const timeOfDay = timeProgress / 100

  return (
    <div
      ref={containerRef}
      className="w-full h-60 md:h-full relative overflow-hidden rounded-lg cursor-pointer group"
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Background based on time of day */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${getBackgroundGradient()}`}>
        {/* Stars (visible at night) */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: currentTimeOfDay === "night" ? 0.7 : 0 }}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDuration: Math.random() * 3 + 2 + "s",
                animationDelay: Math.random() * 2 + "s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Weather overlay effects */}
      {getWeatherOverlay()}
      {getWeatherIcon()}

      {/* Digital clock overlay */}
      <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs font-mono">
        {formatTime(currentTime)}
      </div>

      {/* Location indicator */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs font-medium flex items-center gap-1">
        <MapPinIcon className="h-3 w-3" />
        <span>{location}</span>
      </div>

      {/* Sun */}
      <motion.div className="absolute" style={{ width: "30px", height: "30px" }} animate={sunControls}>
        <div className="sun-enhanced">
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-90"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 animate-pulse-custom"></div>
          <div className="absolute -inset-3 rounded-full bg-yellow-400/30 animate-pulse-glow-enhanced"></div>
          <Sun size={30} className="text-yellow-400 drop-shadow-lg relative z-10" />
        </div>
      </motion.div>

      {/* Moon */}
      <motion.div className="absolute" style={{ width: "24px", height: "24px" }} animate={moonControls}>
        <div className="moon-enhanced">
          <div className="absolute inset-0 rounded-full bg-gray-100 opacity-90"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 animate-pulse-custom"></div>
          <div className="absolute -inset-3 rounded-full bg-gray-100/20 animate-pulse-glow-enhanced"></div>
          <Moon size={24} className="text-gray-100 drop-shadow-lg relative z-10" />
        </div>
      </motion.div>

      {/* Earth */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" ref={earthRef}>
        <motion.div
          className="relative w-32 h-32"
          animate={{ rotate: earthRotation }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Earth base */}
          <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] dark:shadow-[0_0_30px_rgba(29,78,216,0.3)]">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-90">
              {/* Land masses with improved textures */}
              <div className="relative w-full h-full">
                {/* Ocean texture */}
                <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-white/10 to-transparent"></div>
                </div>

                {/* North America */}
                <div
                  className="absolute bg-gradient-to-br from-green-700/70 to-green-800/70 rounded-[40%] shadow-inner"
                  style={{ width: "28%", height: "25%", left: "22%", top: "20%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* South America */}
                <div
                  className="absolute bg-gradient-to-br from-green-700/70 to-green-800/70 rounded-[40%] shadow-inner"
                  style={{ width: "15%", height: "22%", left: "30%", top: "48%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* Europe/Africa */}
                <div
                  className="absolute bg-gradient-to-br from-amber-700/70 to-amber-800/70 rounded-[40%] shadow-inner"
                  style={{ width: "25%", height: "38%", left: "45%", top: "25%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* Asia */}
                <div
                  className="absolute bg-gradient-to-br from-green-700/70 to-green-800/70 rounded-[40%] shadow-inner"
                  style={{ width: "30%", height: "28%", left: "58%", top: "22%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* Australia */}
                <div
                  className="absolute bg-gradient-to-br from-amber-700/70 to-amber-800/70 rounded-[40%] shadow-inner"
                  style={{ width: "18%", height: "15%", left: "68%", top: "55%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* Antarctica */}
                <div
                  className="absolute bg-gradient-to-br from-gray-100/70 to-gray-200/70 rounded-[40%] shadow-inner"
                  style={{ width: "25%", height: "12%", left: "38%", top: "75%" }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-30"></div>
                </div>

                {/* Cloud layer with improved clouds */}
                <motion.div className="absolute inset-0 rounded-full overflow-hidden" animate={cloudControls}>
                  <div
                    className="absolute w-[20%] h-[10%] bg-white/40 rounded-full blur-[2px]"
                    style={{ left: "20%", top: "15%" }}
                  ></div>
                  <div
                    className="absolute w-[30%] h-[12%] bg-white/50 rounded-full blur-[2px]"
                    style={{ left: "45%", top: "10%" }}
                  ></div>
                  <div
                    className="absolute w-[25%] h-[8%] bg-white/40 rounded-full blur-[2px]"
                    style={{ left: "35%", top: "35%" }}
                  ></div>
                  <div
                    className="absolute w-[35%] h-[10%] bg-white/50 rounded-full blur-[2px]"
                    style={{ left: "55%", top: "50%" }}
                  ></div>
                  <div
                    className="absolute w-[15%] h-[7%] bg-white/40 rounded-full blur-[2px]"
                    style={{ left: "25%", top: "65%" }}
                  ></div>
                  <div
                    className="absolute w-[22%] h-[9%] bg-white/40 rounded-full blur-[2px]"
                    style={{ left: "10%", top: "40%" }}
                  ></div>
                  <div
                    className="absolute w-[18%] h-[8%] bg-white/50 rounded-full blur-[2px]"
                    style={{ left: "70%", top: "25%" }}
                  ></div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Atmosphere glow */}
          <div
            className="absolute -inset-2 rounded-full animate-pulse-glow-enhanced pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                currentTimeOfDay === "night"
                  ? "rgba(67, 56, 202, 0.5)"
                  : currentTimeOfDay === "dawn" || currentTimeOfDay === "dusk"
                    ? "rgba(249, 115, 22, 0.5)"
                    : "rgba(59, 130, 246, 0.5)"
              } 0%, transparent 70%)`,
            }}
          ></div>

          {/* Day/Night terminator line effect */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(to right, transparent 48%, ${
                currentTimeOfDay === "night"
                  ? "rgba(30, 58, 138, 0.8)"
                  : currentTimeOfDay === "dawn"
                    ? "rgba(249, 115, 22, 0.6)"
                    : currentTimeOfDay === "dusk"
                      ? "rgba(124, 58, 237, 0.6)"
                      : "rgba(30, 58, 138, 0.4)"
              } 50%, transparent 52%)`,
              transform: `rotate(${earthRotation + 90}deg)`,
            }}
          ></div>
        </motion.div>
      </div>

      {/* 3D effect highlight */}
      <div
        className="absolute inset-0 rounded-full opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)",
        }}
      ></div>

      {/* Time of day indicator */}
      <div className="absolute bottom-2 right-2 text-xs font-medium px-2 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white border border-white/20 shadow-lg">
        <div className="flex items-center gap-1.5">
          {currentTimeOfDay === "dawn" && <Sunrise className="h-3 w-3 text-orange-300" />}
          {currentTimeOfDay === "day" && <Sun className="h-3 w-3 text-yellow-300" />}
          {currentTimeOfDay === "dusk" && <Sunset className="h-3 w-3 text-orange-300" />}
          {currentTimeOfDay === "night" && <Moon className="h-3 w-3 text-blue-300" />}
          {currentTimeOfDay.charAt(0).toUpperCase() + currentTimeOfDay.slice(1)}
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white border border-white/20 shadow-lg">
        <div className="flex items-center gap-1.5">
          <Compass className="h-3 w-3 text-blue-300" />
          {formatCoordinatesOld()}
        </div>
      </div>

      {/* Hover overlay with additional information */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <h3 className="font-bold text-lg mb-1">{location}</h3>
          <p className="text-sm mb-2">{formatCoordinatesOld()}</p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {temperature !== undefined && (
              <div className="flex items-center justify-center gap-1 bg-white/10 rounded-lg p-2">
                <Thermometer className="h-4 w-4 text-red-300" />
                <span className="text-sm">{temperature}°C</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-1 bg-white/10 rounded-lg p-2">
              <Droplets className="h-4 w-4 text-blue-300" />
              <span className="text-sm">{humidity}%</span>
            </div>

            <div className="flex items-center justify-center gap-1 bg-white/10 rounded-lg p-2">
              <Wind className="h-4 w-4 text-purple-300" />
              <span className="text-sm">{windSpeed} km/h</span>
            </div>

            <div className="flex items-center justify-center gap-1 bg-white/10 rounded-lg p-2">
              <Compass className="h-4 w-4 text-amber-300" />
              <span className="text-sm">{currentTimeOfDay}</span>
            </div>
          </div>

          <div className="mt-3 text-xs">
            <div className="flex justify-between mb-1">
              <span>Sunrise: {sunrise}</span>
              <span>Sunset: {sunset}</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500"
                style={{ width: `${timeProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed weather information panel */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 z-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: showDetails ? 1 : 0,
          scale: showDetails ? 1 : 0.9,
          pointerEvents: showDetails ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-white text-center max-w-xs">
          <h3 className="font-bold text-xl mb-1">{location}</h3>
          <p className="text-sm mb-4">{formatCoordinatesOld()}</p>

          <div className="flex items-center justify-center gap-2 mb-4">
            {getWeatherIcon()}
            <span className="text-lg">{weatherCondition}</span>
            {temperature !== undefined && <span className="text-2xl font-bold">{temperature}°C</span>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <span className="text-lg font-bold">{humidity}%</span>
              <div className="w-full h-1 bg-white/20 rounded-full mt-1">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${humidity}%` }}></div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Wind</span>
              </div>
              <span className="text-lg font-bold">{windSpeed} km/h</span>
              <div className="w-full h-1 bg-white/20 rounded-full mt-1">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, (windSpeed / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-1">
                <Sun className="h-4 w-4 text-orange-300" />
                <span>{sunrise}</span>
              </div>
              <div className="flex items-center gap-1">
                <Moon className="h-4 w-4 text-blue-300" />
                <span>{sunset}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500"
                style={{ width: `${timeProgress}%` }}
              >
                <div
                  className="h-3 w-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${timeProgress}% - 6px)` }}
                ></div>
              </div>
            </div>
            <div className="text-xs mt-1 text-center">
              {formatTime(currentTime)} - {currentTimeOfDay.charAt(0).toUpperCase() + currentTimeOfDay.slice(1)}
            </div>
          </div>

          <button
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(false)
            }}
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  )
}
