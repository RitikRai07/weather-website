"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Layers } from "lucide-react"
import { motion } from "framer-motion"

interface WeatherRadarProps {
  latitude: number
  longitude: number
  city: string
}

export function WeatherRadar({ latitude, longitude, city }: WeatherRadarProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [totalFrames, setTotalFrames] = useState(12)
  const [radarType, setRadarType] = useState<"precipitation" | "temperature" | "clouds">("precipitation")
  const [zoom, setZoom] = useState(6)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)

  // Simulated radar frames (in a real app, these would be fetched from a weather API)
  const generateRadarFrames = () => {
    const frames = []
    for (let i = 0; i < totalFrames; i++) {
      frames.push({
        timestamp: new Date(Date.now() - (totalFrames - i) * 10 * 60000).toISOString(),
        url: `/placeholder.svg?height=400&width=400&text=Radar+Frame+${i + 1}`,
      })
    }
    return frames
  }

  const radarFrames = generateRadarFrames()

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames)
      }, 500)
    } else if (animationRef.current) {
      clearInterval(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isPlaying, totalFrames])

  // Draw radar on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsLoading(true)

    // Simulate loading the radar image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = radarFrames[currentFrame].url
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw map background (simplified)
      ctx.fillStyle = radarType === "precipitation" ? "#e0f2fe" : radarType === "temperature" ? "#fef2f2" : "#f8fafc"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 0.5
      const gridSize = 40
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw city marker
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw radar data (simulated)
      if (radarType === "precipitation") {
        // Draw random precipitation patterns
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 30 + 10
          const intensity = Math.random()

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          if (intensity < 0.3) {
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.7)")
            gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
          } else if (intensity < 0.7) {
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.7)")
            gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
          } else {
            gradient.addColorStop(0, "rgba(245, 158, 11, 0.7)")
            gradient.addColorStop(1, "rgba(245, 158, 11, 0)")
          }

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (radarType === "temperature") {
        // Draw temperature gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.2)")
        gradient.addColorStop(0.5, "rgba(245, 158, 11, 0.2)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.2)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add temperature contour lines
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)"
        ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(0, (canvas.height / 5) * i + Math.sin(i + currentFrame) * 20)

          for (let x = 0; x < canvas.width; x += 10) {
            ctx.lineTo(x, (canvas.height / 5) * i + Math.sin(x / 30 + i + currentFrame) * 20)
          }

          ctx.stroke()
        }
      } else {
        // Draw cloud cover
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 40 + 20

          ctx.fillStyle = `rgba(148, 163, 184, ${Math.random() * 0.4 + 0.1})`
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw city marker
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw city name
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(city, centerX, centerY + 20)

      // Draw timestamp
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      const timestamp = new Date(radarFrames[currentFrame].timestamp)
      ctx.fillText(timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), 10, canvas.height - 10)

      setIsLoading(false)
    }
  }, [currentFrame, radarType, radarFrames, city])

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-blue-100 dark:border-blue-900/50 shadow-lg">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Weather Radar
            </span>
          </CardTitle>
          <Tabs value={radarType} onValueChange={(value) => setRadarType(value as any)}>
            <TabsList className="h-8 p-1">
              <TabsTrigger value="precipitation" className="text-xs h-6 px-2">
                Precipitation
              </TabsTrigger>
              <TabsTrigger value="temperature" className="text-xs h-6 px-2">
                Temperature
              </TabsTrigger>
              <TabsTrigger value="clouds" className="text-xs h-6 px-2">
                Cloud Cover
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px] object-cover" />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                  onClick={() => setCurrentFrame(0)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                  onClick={() => setZoom(Math.max(1, zoom - 1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                  onClick={() => setZoom(Math.min(10, zoom + 1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white">
                Frame: {currentFrame + 1}/{totalFrames}
              </span>
              <div className="flex-1">
                <Slider
                  value={[currentFrame]}
                  min={0}
                  max={totalFrames - 1}
                  step={1}
                  onValueChange={(value) => setCurrentFrame(value[0])}
                  className="h-1"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400 border-t border-blue-100 dark:border-blue-900/50">
          Radar data for {city} • Last updated:{" "}
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </CardContent>
    </Card>
  )
}
