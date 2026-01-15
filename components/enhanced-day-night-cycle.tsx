"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sunrise, Sunset, Sun, Moon } from "lucide-react"

interface DayNightCycleProps {
  sunrise: string
  sunset: string
  currentTime?: string
}

export function EnhancedDayNightCycle({ sunrise, sunset, currentTime }: DayNightCycleProps) {
  const [progress, setProgress] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day")
  const [timeLeft, setTimeLeft] = useState("")
  const [earthRotation, setEarthRotation] = useState(0)
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 })
  const [moonPosition, setMoonPosition] = useState({ x: 0, y: 0 })
  const [sunriseTime, setSunriseTime] = useState<Date | null>(null)
  const [sunsetTime, setSunsetTime] = useState<Date | null>(null)

  const earthControls = useAnimation()
  const sunControls = useAnimation()
  const moonControls = useAnimation()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sunrise || !sunset) return

    // Parse times
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Parse sunrise time (format: "06:30 AM")
    const sunriseParts = sunrise.split(" ")[0].split(":")
    let sunriseHour = Number.parseInt(sunriseParts[0])
    const sunriseMinute = Number.parseInt(sunriseParts[1])
    if (sunrise.includes("PM") && sunriseHour !== 12) sunriseHour += 12
    if (sunrise.includes("AM") && sunriseHour === 12) sunriseHour = 0

    // Create sunrise Date object
    const sunriseDate = new Date(now)
    sunriseDate.setHours(sunriseHour, sunriseMinute, 0)
    setSunriseTime(sunriseDate)

    // Parse sunset time (format: "07:45 PM")
    const sunsetParts = sunset.split(" ")[0].split(":")
    let sunsetHour = Number.parseInt(sunsetParts[0])
    const sunsetMinute = Number.parseInt(sunsetParts[1])
    if (sunset.includes("PM") && sunsetHour !== 12) sunsetHour += 12
    if (sunset.includes("AM") && sunsetHour === 12) sunsetHour = 0

    // Create sunset Date object
    const sunsetDate = new Date(now)
    sunsetDate.setHours(sunsetHour, sunsetMinute, 0)
    setSunsetTime(sunsetDate)

    // Calculate total day minutes
    const sunriseMinutes = sunriseHour * 60 + sunriseMinute
    const sunsetMinutes = sunsetHour * 60 + sunsetMinute
    const currentMinutes = currentHour * 60 + currentMinute
    const dayLength = sunsetMinutes - sunriseMinutes

    // Calculate progress (0-100)
    let calculatedProgress = 0

    if (currentMinutes < sunriseMinutes) {
      // Before sunrise (night to morning)
      calculatedProgress = ((currentMinutes + 1440 - sunsetMinutes) / (sunriseMinutes + 1440 - sunsetMinutes)) * 25
      setTimeOfDay("night")
    } else if (currentMinutes < sunriseMinutes + dayLength / 3) {
      // Morning
      calculatedProgress = 25 + ((currentMinutes - sunriseMinutes) / (dayLength / 3)) * 25
      setTimeOfDay("morning")
    } else if (currentMinutes < sunriseMinutes + (dayLength * 2) / 3) {
      // Day
      calculatedProgress = 50 + ((currentMinutes - (sunriseMinutes + dayLength / 3)) / (dayLength / 3)) * 25
      setTimeOfDay("day")
    } else if (currentMinutes < sunsetMinutes) {
      // Evening
      calculatedProgress = 75 + ((currentMinutes - (sunriseMinutes + (dayLength * 2) / 3)) / (dayLength / 3)) * 25
      setTimeOfDay("evening")
    } else {
      // Night
      calculatedProgress = ((currentMinutes - sunsetMinutes) / (sunriseMinutes + 1440 - sunsetMinutes)) * 25
      setTimeOfDay("night")
    }

    setProgress(calculatedProgress)

    // Set Earth rotation (0-360 degrees)
    setEarthRotation(progress * 3.6)

    // Calculate time left until next event
    let nextEventName = ""
    let nextEventTime = 0

    if (currentMinutes < sunriseMinutes) {
      nextEventName = "Sunrise"
      nextEventTime = sunriseMinutes - currentMinutes
    } else if (currentMinutes < sunsetMinutes) {
      nextEventName = "Sunset"
      nextEventTime = sunsetMinutes - currentMinutes
    } else {
      nextEventName = "Sunrise"
      nextEventTime = sunriseMinutes + 1440 - currentMinutes
    }

    const hours = Math.floor(nextEventTime / 60)
    const minutes = nextEventTime % 60
    setTimeLeft(`${nextEventName} in ${hours}h ${minutes}m`)

    // Calculate sun and moon positions
    const angle = (progress / 100) * 2 * Math.PI
    const radius = 120
    const centerX = 150
    const centerY = 150

    // Sun position (opposite of Earth)
    const sunX = centerX + radius * Math.cos(angle - Math.PI / 2 + Math.PI)
    const sunY = centerY + radius * Math.sin(angle - Math.PI / 2 + Math.PI)
    setSunPosition({ x: sunX, y: sunY })

    // Moon position (90 degrees from Earth)
    const moonX = centerX + radius * Math.cos(angle - Math.PI / 2 + Math.PI / 2)
    const moonY = centerY + radius * Math.sin(angle - Math.PI / 2 + Math.PI / 2)
    setMoonPosition({ x: moonX, y: moonY })

    // Animate Earth, Sun, and Moon
    earthControls.start({
      x: earthPosition.x - 20,
      y: earthPosition.y - 20,
      transition: { duration: 1, ease: "easeInOut" },
    })

    sunControls.start({
      x: sunX - 20,
      y: sunY - 20,
      opacity: timeOfDay === "night" ? 0.2 : 1,
      scale: timeOfDay === "night" ? 0.8 : 1,
      transition: { duration: 1, ease: "easeInOut" },
    })

    moonControls.start({
      x: moonX - 18,
      y: moonY - 18,
      opacity: timeOfDay === "night" ? 1 : 0.2,
      scale: timeOfDay === "night" ? 1 : 0.8,
      transition: { duration: 1, ease: "easeInOut" },
    })

    // Update every minute
    const interval = setInterval(() => {
      const newNow = new Date()
      const newCurrentMinutes = newNow.getHours() * 60 + newNow.getMinutes()

      // Recalculate progress
      let newProgress = 0

      if (newCurrentMinutes < sunriseMinutes) {
        newProgress = ((newCurrentMinutes + 1440 - sunsetMinutes) / (sunriseMinutes + 1440 - sunsetMinutes)) * 25
        setTimeOfDay("night")
      } else if (newCurrentMinutes < sunriseMinutes + dayLength / 3) {
        newProgress = 25 + ((newCurrentMinutes - sunriseMinutes) / (dayLength / 3)) * 25
        setTimeOfDay("morning")
      } else if (newCurrentMinutes < sunriseMinutes + (dayLength * 2) / 3) {
        newProgress = 50 + ((newCurrentMinutes - (sunriseMinutes + dayLength / 3)) / (dayLength / 3)) * 25
        setTimeOfDay("day")
      } else if (newCurrentMinutes < sunsetMinutes) {
        newProgress = 75 + ((newCurrentMinutes - (sunriseMinutes + (dayLength * 2) / 3)) / (dayLength / 3)) * 25
        setTimeOfDay("evening")
      } else {
        newProgress = ((newCurrentMinutes - sunsetMinutes) / (sunriseMinutes + 1440 - sunsetMinutes)) * 25
        setTimeOfDay("night")
      }

      setProgress(newProgress)
      setEarthRotation(newProgress * 3.6)

      // Update time left
      let newNextEventName = ""
      let newNextEventTime = 0

      if (newCurrentMinutes < sunriseMinutes) {
        newNextEventName = "Sunrise"
        newNextEventTime = sunriseMinutes - newCurrentMinutes
      } else if (newCurrentMinutes < sunsetMinutes) {
        newNextEventName = "Sunset"
        newNextEventTime = sunsetMinutes - newCurrentMinutes
      } else {
        newNextEventName = "Sunrise"
        newNextEventTime = sunriseMinutes + 1440 - newCurrentMinutes
      }

      const newHours = Math.floor(newNextEventTime / 60)
      const newMinutes = newNextEventTime % 60
      setTimeLeft(`${newNextEventName} in ${newHours}h ${newMinutes}m`)

      // Recalculate positions
      const newAngle = (newProgress / 100) * 2 * Math.PI

      // Earth position
      const newEarthX = centerX + radius * Math.cos(newAngle - Math.PI / 2)
      const newEarthY = centerY + radius * Math.sin(newAngle - Math.PI / 2)

      // Sun position (opposite of Earth)
      const newSunX = centerX + radius * Math.cos(newAngle - Math.PI / 2 + Math.PI)
      const newSunY = centerY + radius * Math.sin(newAngle - Math.PI / 2 + Math.PI)
      setSunPosition({ x: newSunX, y: newSunY })

      // Moon position (90 degrees from Earth)
      const newMoonX = centerX + radius * Math.cos(newAngle - Math.PI / 2 + Math.PI / 2)
      const newMoonY = centerY + radius * Math.sin(newAngle - Math.PI / 2 + Math.PI / 2)
      setMoonPosition({ x: newMoonX, y: newMoonY })

      // Animate positions
      earthControls.start({
        x: newEarthX - 20,
        y: newEarthY - 20,
        transition: { duration: 1, ease: "easeInOut" },
      })

      sunControls.start({
        x: newSunX - 20,
        y: newSunY - 20,
        opacity: timeOfDay === "night" ? 0.2 : 1,
        scale: timeOfDay === "night" ? 0.8 : 1,
        transition: { duration: 1, ease: "easeInOut" },
      })

      moonControls.start({
        x: newMoonX - 18,
        y: newMoonY - 18,
        opacity: timeOfDay === "night" ? 1 : 0.2,
        scale: timeOfDay === "night" ? 1 : 0.8,
        transition: { duration: 1, ease: "easeInOut" },
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [sunrise, sunset, progress, earthControls, sunControls, moonControls])

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

  // Get text color based on time of day
  const getTextColor = () => {
    return timeOfDay === "night" ? "text-white" : "text-gray-900"
  }

  // Calculate Earth position based on progress
  const getEarthPosition = (progress: number) => {
    // Convert progress (0-100) to radians (0-2π)
    const radians = (progress / 100) * 2 * Math.PI

    // Calculate position on a circle
    const radius = 120
    const centerX = 150
    const centerY = 150
    const x = centerX + radius * Math.cos(radians - Math.PI / 2)
    const y = centerY + radius * Math.sin(radians - Math.PI / 2)

    return { x, y }
  }

  const earthPosition = getEarthPosition(progress)

  // Get sun/moon glow color based on time of day
  const getSunGlowColor = () => {
    switch (timeOfDay) {
      case "morning":
        return "rgba(252, 211, 77, 0.6)"
      case "day":
        return "rgba(252, 211, 77, 0.8)"
      case "evening":
        return "rgba(249, 115, 22, 0.7)"
      case "night":
        return "rgba(252, 211, 77, 0.3)"
    }
  }

  const getMoonGlowColor = () => {
    switch (timeOfDay) {
      case "night":
        return "rgba(226, 232, 240, 0.6)"
      default:
        return "rgba(226, 232, 240, 0.2)"
    }
  }

  // Format time for display
  const formatTimeDisplay = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="overflow-hidden border-none shadow-2xl transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)]">
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className={`${getBackgroundGradient()} p-6 relative overflow-hidden transition-colors duration-1000`}
        >
          {/* Stars (visible at night) */}
          <div
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
            style={{ opacity: timeOfDay === "night" ? 0.7 : 0 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse-custom"
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

          {/* Animated clouds */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <motion.div
              className="cloud-1 absolute"
              style={{ top: "20%", left: "-20%" }}
              animate={{ left: "120%" }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div className="relative">
                <div className="w-20 h-10 bg-white rounded-full"></div>
                <div className="w-12 h-12 bg-white rounded-full absolute -top-5 -left-2"></div>
                <div className="w-12 h-12 bg-white rounded-full absolute -top-5 left-10"></div>
              </div>
            </motion.div>

            <motion.div
              className="cloud-2 absolute"
              style={{ top: "40%", left: "-20%" }}
              animate={{ left: "120%" }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 5 }}
            >
              <div className="relative">
                <div className="w-32 h-16 bg-white rounded-full"></div>
                <div className="w-20 h-20 bg-white rounded-full absolute -top-8 -left-4"></div>
                <div className="w-20 h-20 bg-white rounded-full absolute -top-8 left-16"></div>
              </div>
            </motion.div>

            <motion.div
              className="cloud-3 absolute"
              style={{ top: "15%", left: "-20%" }}
              animate={{ left: "120%" }}
              transition={{ duration: 35, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 10 }}
            >
              <div className="relative">
                <div className="w-24 h-12 bg-white rounded-full"></div>
                <div className="w-14 h-14 bg-white rounded-full absolute -top-6 -left-3"></div>
                <div className="w-14 h-14 bg-white rounded-full absolute -top-6 left-12"></div>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className={`flex items-center space-x-2 ${getTextColor()}`}>
                <span className="font-medium">{currentTime || "Current Time"}</span>
              </div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`${getTextColor()} font-medium px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm`}
              >
                {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
              </motion.div>
            </div>

            {/* Day/Night cycle visualization */}
            <div className="relative h-[300px] w-full mb-6">
              {/* Sun and Moon positions */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
                {/* Orbit path with gradient */}
                <div className="absolute top-1/2 left-1/2 w-[240px] h-[240px] rounded-full border-2 border-dashed transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        timeOfDay === "night"
                          ? "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"
                          : "linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))",
                      opacity: 0.5,
                    }}
                  ></div>
                </div>

                {/* Sun with enhanced glow */}
                <motion.div className="absolute" style={{ width: "40px", height: "40px" }} animate={sunControls}>
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 60,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${getSunGlowColor()} 0%, rgba(252, 211, 77, 0) 70%)`,
                        width: "80px",
                        height: "80px",
                        transform: "translate(-50%, -50%)",
                        left: "50%",
                        top: "50%",
                      }}
                    ></div>
                    <Sun size={40} className="text-yellow-400 drop-shadow-lg animate-sun-rays" />
                  </motion.div>
                </motion.div>

                {/* Moon with enhanced glow */}
                <motion.div className="absolute" style={{ width: "36px", height: "36px" }} animate={moonControls}>
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${getMoonGlowColor()} 0%, rgba(226, 232, 240, 0) 70%)`,
                        width: "70px",
                        height: "70px",
                        transform: "translate(-50%, -50%)",
                        left: "50%",
                        top: "50%",
                      }}
                    ></div>
                    <Moon size={36} className="text-gray-100 drop-shadow-lg animate-moon-glow" />
                  </div>
                </motion.div>

                {/* Enhanced Earth with realistic details */}
                <motion.div className="absolute z-20" style={{ width: "40px", height: "40px" }} animate={earthControls}>
                  <motion.div
                    className="relative w-full h-full"
                    animate={{ rotate: earthRotation }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Earth base */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
                      {/* Continents */}
                      <div
                        className="absolute w-[60%] h-[30%] bg-green-600/70 rounded-full"
                        style={{ left: "20%", top: "20%" }}
                      ></div>
                      <div
                        className="absolute w-[40%] h-[20%] bg-green-600/70 rounded-full"
                        style={{ left: "10%", top: "60%" }}
                      ></div>
                      <div
                        className="absolute w-[30%] h-[25%] bg-green-600/70 rounded-full"
                        style={{ left: "60%", top: "50%" }}
                      ></div>

                      {/* Cloud overlay with animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <div
                          className="absolute w-[25%] h-[15%] bg-white/70 rounded-full"
                          style={{ left: "20%", top: "30%" }}
                        ></div>
                        <div
                          className="absolute w-[30%] h-[15%] bg-white/70 rounded-full"
                          style={{ left: "50%", top: "20%" }}
                        ></div>
                        <div
                          className="absolute w-[25%] h-[10%] bg-white/70 rounded-full"
                          style={{ left: "30%", top: "60%" }}
                        ></div>
                        <div
                          className="absolute w-[20%] h-[10%] bg-white/70 rounded-full"
                          style={{ left: "70%", top: "70%" }}
                        ></div>
                      </motion.div>
                    </div>

                    {/* Atmosphere glow */}
                    <div
                      className="absolute rounded-full animate-pulse-glow-enhanced"
                      style={{
                        inset: "-5px",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)",
                      }}
                    ></div>
                  </motion.div>
                </motion.div>

                {/* Enhanced time markers with animations */}
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 flex flex-col items-center"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mb-1">
                    Noon
                  </div>
                  <div className="h-6 w-0.5 bg-white/30"></div>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 flex flex-col items-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="h-6 w-0.5 bg-white/30"></div>
                  <div className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-1">
                    Midnight
                  </div>
                </motion.div>

                <motion.div
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 flex flex-col items-center"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mb-1">
                    Sunrise
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400/30 to-yellow-500/30 rounded-full">
                    <Sunrise size={16} className="text-yellow-300" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 flex flex-col items-center"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mb-1">
                    Sunset
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-400/30 to-red-500/30 rounded-full">
                    <Sunset size={16} className="text-orange-400" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced progress indicator */}
            <div className="relative h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden mb-6">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-size-200"
                style={{ backgroundSize: "200% 100%" }}
                initial={{ width: "0%" }}
                animate={{
                  width: `${progress}%`,
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  width: { duration: 1.5, ease: "easeOut" },
                  backgroundPosition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              ></motion.div>
            </div>

            <div className="flex justify-between text-white">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                  <Sunrise className="h-8 w-8 mb-1 text-yellow-200 drop-shadow-lg" />
                </div>
                <div className="text-sm font-medium">Sunrise</div>
                <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                  {sunrise}
                </div>
                <div className="text-xs text-yellow-200/80 mt-1">
                  {sunriseTime ? formatTimeDisplay(sunriseTime) : ""}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-1 animate-pulse-custom">
                  {timeLeft}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-md"></div>
                  <Sunset className="h-8 w-8 mb-1 text-orange-300 drop-shadow-lg" />
                </div>
                <div className="text-sm font-medium">Sunset</div>
                <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-400">
                  {sunset}
                </div>
                <div className="text-xs text-orange-200/80 mt-1">{sunsetTime ? formatTimeDisplay(sunsetTime) : ""}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
