"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { VisitorCounter } from "@/components/visitor-counter"

// Remove the onUseLocation prop from the interface
interface LandingPageProps {
  onSearch: (city: string) => void
  isLocating: boolean
}

// Update the function signature to remove onUseLocation
export function LandingPage({ onSearch, isLocating }: LandingPageProps) {
  // Remove the showLocationPrompt state and its related useEffect
  const [city, setCity] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [animationComplete, setAnimationComplete] = useState(false)
  const { theme } = useTheme()

  // Canvas for animated background
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Remove the useEffect that triggers location detection
  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    const particleCount = 100
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      opacity: number
    }[] = []

    const isDark = theme === "dark"

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: isDark
          ? `rgba(${30 + Math.random() * 50}, ${100 + Math.random() * 50}, ${200 + Math.random() * 55}, 1)`
          : `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, ${200 + Math.random() * 55}, 1)`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.5,
      })
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace("1)", `${particle.opacity})`)
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Random opacity changes
        particle.opacity += Math.random() * 0.02 - 0.01
        if (particle.opacity < 0.1) particle.opacity = 0.1
        if (particle.opacity > 0.8) particle.opacity = 0.8
      })

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = isDark
              ? `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`
              : `rgba(100, 150, 255, ${0.05 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [theme])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
        when: "beforeChildren",
        duration: 0.5,
        onComplete: () => setAnimationComplete(true),
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const floatingIconVariants = {
    initial: { y: 0 },
    float: {
      y: [-10, 10],
      transition: { y: { repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 2 } },
    },
  }

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 2,
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 -z-10"></div>

      {/* Animated weather icons */}
      <motion.div
        className="absolute top-20 right-[20%] text-blue-500/30 dark:text-blue-400/20"
        variants={floatingIconVariants}
        initial="initial"
        animate="float"
      >
        <Sun size={64} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-[15%] text-gray-500/30 dark:text-gray-400/20"
        variants={floatingIconVariants}
        initial="initial"
        animate="float"
        transition={{ delay: 0.5 }}
      >
        <Cloud size={72} />
      </motion.div>

      <motion.div
        className="absolute top-40 left-[25%] text-blue-500/30 dark:text-blue-400/20"
        variants={floatingIconVariants}
        initial="initial"
        animate="float"
        transition={{ delay: 1 }}
      >
        <CloudRain size={48} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-[25%] text-gray-500/30 dark:text-gray-400/20"
        variants={floatingIconVariants}
        initial="initial"
        animate="float"
        transition={{ delay: 1.5 }}
      >
        <Wind size={56} />
      </motion.div>

      <motion.div
        className="max-w-3xl w-full px-6 py-12 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Weather Forecast
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Real-time weather updates for any location around the world
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {currentTime} • Get started by searching for a city
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-blue-200 dark:border-blue-800/50 shadow-xl backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl transform transition-all hover:shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pr-10 h-12 text-lg border-2 border-blue-100 dark:border-blue-900/50 focus-visible:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </span>
                    <span className="absolute inset-0 w-full h-full bg-white scale-0 group-hover:scale-100 transition-transform origin-center rounded-lg z-0 opacity-10"></span>
                  </Button>
                </div>
              </form>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 shadow-md border border-amber-100 dark:border-amber-800/30"
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                  transition={{ delay: 0.2 }}
                >
                  <Sun className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm font-medium">Real-time Updates</p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md border border-blue-100 dark:border-blue-800/30"
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                  transition={{ delay: 0.4 }}
                >
                  <CloudRain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">7-Day Forecast</p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 shadow-md border border-green-100 dark:border-green-800/30"
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                  transition={{ delay: 0.6 }}
                >
                  <Wind className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">Air Quality</p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 shadow-md border border-red-100 dark:border-red-800/30"
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                  transition={{ delay: 0.8 }}
                >
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm font-medium">Location Based</p>
                </motion.div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium">Temperature Trends</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track temperature changes with interactive charts and visualizations
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Precipitation Radar</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View real-time precipitation radar and forecast for your area
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Wind Patterns</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Analyze wind direction and speed with detailed wind maps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center">
          <VisitorCounter />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by WeatherAPI.com • Data updates every 10 minutes</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
