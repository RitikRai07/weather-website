"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { MapPin, Maximize2, Minimize2, Plus, Minus, Layers, RefreshCw, Compass, Search } from "lucide-react"
import { motion } from "framer-motion"

interface WeatherMapProps {
  latitude: number
  longitude: number
  city: string
}

export function WeatherMap({ latitude, longitude, city }: WeatherMapProps) {
  const [mapType, setMapType] = useState<"temperature" | "precipitation" | "wind" | "clouds">("temperature")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [isLoading, setIsLoading] = useState(false)
  const [opacity, setOpacity] = useState(0.7)
  const [showControls, setShowControls] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Generate a unique map ID to avoid conflicts
  const mapId = useRef(`map-${Math.random().toString(36).substring(2, 9)}`)

  // Simulate map loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [mapType])

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Zoom controls
  const zoomIn = () => {
    setZoom(Math.min(zoom + 1, 18))
  }

  const zoomOut = () => {
    setZoom(Math.max(zoom - 1, 3))
  }

  // Refresh map
  const refreshMap = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Get color for the map type button
  const getMapTypeColor = (type: string) => {
    switch (type) {
      case "temperature":
        return "text-orange-500 bg-orange-100 dark:bg-orange-900/30"
      case "precipitation":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
      case "wind":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900/30"
      case "clouds":
        return "text-gray-500 bg-gray-100 dark:bg-gray-700/30"
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-700/30"
    }
  }

  // Get map layer image based on type
  const getMapLayerImage = () => {
    switch (mapType) {
      case "temperature":
        return "/placeholder.svg?height=600&width=800&text=Temperature+Layer"
      case "precipitation":
        return "/placeholder.svg?height=600&width=800&text=Precipitation+Layer"
      case "wind":
        return "/placeholder.svg?height=600&width=800&text=Wind+Layer"
      case "clouds":
        return "/placeholder.svg?height=600&width=800&text=Clouds+Layer"
      default:
        return "/placeholder.svg?height=600&width=800&text=Weather+Map"
    }
  }

  return (
    <Card
      className={`w-full border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 transition-all duration-300 hover:shadow-xl ${isFullscreen ? "fixed inset-4 z-50 m-0 rounded-lg" : ""}`}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Weather Map: {city}
            </span>
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={refreshMap}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" value={mapType} onValueChange={(value) => setMapType(value as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-4 p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TabsTrigger
              value="temperature"
              className="rounded-md data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Temperature
            </TabsTrigger>
            <TabsTrigger
              value="precipitation"
              className="rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Precipitation
            </TabsTrigger>
            <TabsTrigger
              value="wind"
              className="rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Wind
            </TabsTrigger>
            <TabsTrigger
              value="clouds"
              className="rounded-md data-[state=active]:bg-gray-500 data-[state=active]:text-white"
            >
              Clouds
            </TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-blue-500" />
                Layer Opacity
              </p>
              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[opacity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(value) => setOpacity(value[0])}
              className="h-2"
            />
          </div>

          <div
            ref={mapContainerRef}
            className={`relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner ${isFullscreen ? "h-[calc(100vh-12rem)]" : "h-[400px]"} group`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Base map layer */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={`map-${mapType}-${zoom}`}
                className="w-full h-full"
              >
                <img
                  src={`https://tile.openstreetmap.org/${zoom}/0/0.png`}
                  alt="Base map"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Weather layer */}
            <div className="absolute inset-0" style={{ opacity: opacity }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0.5 : 1 }}
                transition={{ duration: 0.5 }}
                key={`layer-${mapType}-${zoom}`}
                className="w-full h-full"
              >
                <img
                  src={getMapLayerImage() || "/placeholder.svg"}
                  alt={`${mapType} layer`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs font-medium shadow-md">
                    {city}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              </div>
            )}

            {/* Map controls */}
            <motion.div
              className="absolute top-4 right-4 flex flex-col gap-2 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: showControls || isFullscreen ? 1 : 0, x: showControls || isFullscreen ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                onClick={zoomIn}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                onClick={zoomOut}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                onClick={() => {}}
              >
                <Compass className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              className="absolute bottom-4 right-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showControls || isFullscreen ? 1 : 0, y: showControls || isFullscreen ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-gray-800 shadow-md">
                <Layers className="h-4 w-4 mr-1" />
                <span>Layers</span>
              </Button>
            </motion.div>

            <motion.div
              className="absolute bottom-4 left-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showControls || isFullscreen ? 1 : 0, y: showControls || isFullscreen ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded shadow-md text-xs">
                <div className="font-medium mb-1">{mapType.charAt(0).toUpperCase() + mapType.slice(1)} Legend</div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${getMapTypeColor(mapType)}`}></div>
                  <span>Low</span>
                  <div className="w-12 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded mx-1"></div>
                  <span>High</span>
                </div>
              </div>
            </motion.div>

            {isFullscreen && (
              <div className="absolute top-4 left-4 z-10 w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full h-9 rounded-md border border-input bg-white dark:bg-gray-800 px-9 text-sm shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg">
            <p>Map data updates every 10 minutes • Zoom level: {zoom}</p>
            <p className="mt-1">Hover over the map to show controls • Click and drag to pan</p>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
