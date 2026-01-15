"use client"

import { useState, useEffect, useRef } from "react"
import { Users, TrendingUp, ChevronDown, ChevronUp, BarChart, PieChart, Activity, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VisitorCounterProps {
  initialCount?: number
}

export function VisitorCounter({ initialCount = 1000 }: VisitorCounterProps) {
  const [count, setCount] = useState(0)
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("realtime")
  const [visitorStats, setVisitorStats] = useState({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    lastWeek: 0,
    thisMonth: 0,
    lastMonth: 0,
    byCountry: [
      { country: "United States", count: 0, percentage: 0 },
      { country: "India", count: 0, percentage: 0 },
      { country: "United Kingdom", count: 0, percentage: 0 },
      { country: "Germany", count: 0, percentage: 0 },
      { country: "Canada", count: 0, percentage: 0 },
    ],
    byDevice: [
      { device: "Mobile", count: 0, percentage: 0 },
      { device: "Desktop", count: 0, percentage: 0 },
      { device: "Tablet", count: 0, percentage: 0 },
    ],
    byTime: Array(24)
      .fill(0)
      .map((_, i) => ({ hour: i, count: 0 })),
  })

  const [visitorHistory, setVisitorHistory] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInitialized = useRef(false)

  useEffect(() => {
    // Function to get actual visitor count from server
    const fetchVisitorCount = async () => {
      try {
        setLoading(true)

        // In a real implementation, this would be an API call to your backend
        // For now, we'll use localStorage to persist the count between sessions
        const storedCount = localStorage.getItem("weatherRealVisitorCount")

        if (storedCount) {
          // If we have a stored count, use it as the base
          const parsedCount = Number.parseInt(storedCount, 10)
          setCount(parsedCount)
        } else {
          // If no stored count, use the initialCount prop
          setCount(initialCount)
          localStorage.setItem("weatherRealVisitorCount", initialCount.toString())
        }

        // Generate mock visitor stats
        generateMockStats(storedCount ? Number.parseInt(storedCount, 10) : initialCount)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching visitor count:", error)
        setLoading(false)
        // Fallback to initial count if there's an error
        setCount(initialCount)
      }
    }

    fetchVisitorCount()

    // Set up a WebSocket or polling mechanism to get real-time updates
    // This is a simplified version that just increments occasionally
    const realTimeUpdates = setInterval(() => {
      // In a real implementation, this would be a WebSocket message or API poll
      // For now, we'll randomly decide whether to increment
      if (Math.random() > 0.7) {
        // 30% chance of a new visitor
        setCount((prevCount) => {
          const newCount = prevCount + 1
          localStorage.setItem("weatherRealVisitorCount", newCount.toString())

          // Add to visitor history for the chart
          setVisitorHistory((prev) => {
            const newHistory = [...prev, newCount]
            if (newHistory.length > 20) {
              return newHistory.slice(newHistory.length - 20)
            }
            return newHistory
          })

          return newCount
        })
        setIsIncreasing(true)
        setTimeout(() => setIsIncreasing(false), 1000)
      }
    }, 5000) // Check every 5 seconds

    return () => {
      clearInterval(realTimeUpdates)
    }
  }, [initialCount])

  // Generate mock visitor statistics
  const generateMockStats = (baseCount: number) => {
    const today = Math.floor(baseCount * 0.15)
    const yesterday = Math.floor(baseCount * 0.12)
    const thisWeek = Math.floor(baseCount * 0.45)
    const lastWeek = Math.floor(baseCount * 0.4)
    const thisMonth = Math.floor(baseCount * 0.8)
    const lastMonth = Math.floor(baseCount * 0.7)

    // Generate country stats
    const countryStats = [
      { country: "United States", count: Math.floor(baseCount * 0.35), percentage: 35 },
      { country: "India", count: Math.floor(baseCount * 0.2), percentage: 20 },
      { country: "United Kingdom", count: Math.floor(baseCount * 0.15), percentage: 15 },
      { country: "Germany", count: Math.floor(baseCount * 0.1), percentage: 10 },
      { country: "Canada", count: Math.floor(baseCount * 0.05), percentage: 5 },
    ]

    // Generate device stats
    const deviceStats = [
      { device: "Mobile", count: Math.floor(baseCount * 0.6), percentage: 60 },
      { device: "Desktop", count: Math.floor(baseCount * 0.35), percentage: 35 },
      { device: "Tablet", count: Math.floor(baseCount * 0.05), percentage: 5 },
    ]

    // Generate hourly stats
    const hourlyStats = Array(24)
      .fill(0)
      .map((_, i) => {
        // Create a bell curve with peak at 3pm (hour 15)
        const hourFactor = 1 - Math.abs(i - 15) / 24
        return {
          hour: i,
          count: Math.floor(baseCount * 0.05 * hourFactor * (0.8 + Math.random() * 0.4)),
        }
      })

    setVisitorStats({
      today,
      yesterday,
      thisWeek,
      lastWeek,
      thisMonth,
      lastMonth,
      byCountry: countryStats,
      byDevice: deviceStats,
      byTime: hourlyStats,
    })

    // Initialize visitor history for the chart
    const initialHistory = Array(20)
      .fill(0)
      .map((_, i) => {
        return baseCount - Math.floor(Math.random() * 50) + Math.floor(i * 2.5)
      })
    setVisitorHistory(initialHistory)
  }

  // Draw the visitor chart
  useEffect(() => {
    if (!canvasRef.current || visitorHistory.length === 0 || chartInitialized.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    chartInitialized.current = true

    const drawChart = () => {
      if (!canvas || !ctx) return

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const padding = 20
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2

      // Find min and max values
      const minValue = Math.min(...visitorHistory) * 0.95
      const maxValue = Math.max(...visitorHistory) * 1.05
      const valueRange = maxValue - minValue

      // Draw the line
      ctx.beginPath()
      ctx.moveTo(padding, height - padding - ((visitorHistory[0] - minValue) / valueRange) * chartHeight)

      for (let i = 1; i < visitorHistory.length; i++) {
        const x = padding + (i / (visitorHistory.length - 1)) * chartWidth
        const y = height - padding - ((visitorHistory[i] - minValue) / valueRange) * chartHeight
        ctx.lineTo(x, y)
      }

      // Style the line
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill the area under the line
      ctx.lineTo(padding + chartWidth, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()

      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw dots at each data point
      for (let i = 0; i < visitorHistory.length; i++) {
        const x = padding + (i / (visitorHistory.length - 1)) * chartWidth
        const y = height - padding - ((visitorHistory[i] - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    drawChart()

    // Redraw on window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        drawChart()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [visitorHistory, expanded])

  // Update chart when visitor history changes
  useEffect(() => {
    if (!canvasRef.current || visitorHistory.length === 0 || !chartInitialized.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values
    const minValue = Math.min(...visitorHistory) * 0.95
    const maxValue = Math.max(...visitorHistory) * 1.05
    const valueRange = maxValue - minValue

    // Draw the line
    ctx.beginPath()
    ctx.moveTo(padding, height - padding - ((visitorHistory[0] - minValue) / valueRange) * chartHeight)

    for (let i = 1; i < visitorHistory.length; i++) {
      const x = padding + (i / (visitorHistory.length - 1)) * chartWidth
      const y = height - padding - ((visitorHistory[i] - minValue) / valueRange) * chartHeight
      ctx.lineTo(x, y)
    }

    // Style the line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill the area under the line
    ctx.lineTo(padding + chartWidth, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw dots at each data point
    for (let i = 0; i < visitorHistory.length; i++) {
      const x = padding + (i / (visitorHistory.length - 1)) * chartWidth
      const y = height - padding - ((visitorHistory[i] - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [visitorHistory])

  // Format visitor count with commas
  const formattedCount = count.toLocaleString()

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg shadow-lg p-3 flex flex-col gap-3 w-full max-w-xs transition-all duration-300 ${expanded ? "max-w-2xl" : "max-w-xs"}`}
        layout
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded-full p-2">
            <Users size={20} className="text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-wider">Live Visitors</h3>
              <div className="flex items-center text-green-400">
                <TrendingUp size={14} />
                <span className="text-xs ml-1">LIVE</span>
              </div>
            </div>

            <div className="font-mono text-2xl font-bold tabular-nums relative">
              {loading ? (
                <div className="h-8 w-20 bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <>
                  {formattedCount}
                  {isIncreasing && (
                    <span className="absolute -right-4 -top-1 text-green-400 text-xs font-sans animate-fadeOutUp">
                      +1
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="realtime" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Realtime
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="text-xs">
                    <BarChart className="h-3 w-3 mr-1" />
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="text-xs">
                    <PieChart className="h-3 w-3 mr-1" />
                    Demographics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="realtime" className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Visitor Trend</h4>
                    <div className="h-32 w-full">
                      <canvas ref={canvasRef} width={400} height={150} className="w-full h-full"></canvas>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>20 minutes ago</span>
                      <span>Now</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-medium text-gray-400">Today</h4>
                        <span
                          className={`text-xs ${visitorStats.today > visitorStats.yesterday ? "text-green-400" : "text-red-400"}`}
                        >
                          {visitorStats.today > visitorStats.yesterday ? "+" : "-"}
                          {Math.abs(
                            Math.round(((visitorStats.today - visitorStats.yesterday) / visitorStats.yesterday) * 100),
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-lg font-bold">{visitorStats.today.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-medium text-gray-400">This Week</h4>
                        <span
                          className={`text-xs ${visitorStats.thisWeek > visitorStats.lastWeek ? "text-green-400" : "text-red-400"}`}
                        >
                          {visitorStats.thisWeek > visitorStats.lastWeek ? "+" : "-"}
                          {Math.abs(
                            Math.round(((visitorStats.thisWeek - visitorStats.lastWeek) / visitorStats.lastWeek) * 100),
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-lg font-bold">{visitorStats.thisWeek.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Peak Hours</h4>
                    <div className="h-20 flex items-end gap-1">
                      {visitorStats.byTime.map((hour, index) => {
                        const maxCount = Math.max(...visitorStats.byTime.map((h) => h.count))
                        const height = (hour.count / maxCount) * 100

                        return (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex-1 bg-blue-600 hover:bg-blue-500 transition-all rounded-sm cursor-pointer ${index === new Date().getHours() ? "bg-green-500 hover:bg-green-400" : ""}`}
                                  style={{ height: `${Math.max(5, height)}%` }}
                                ></div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                <p>
                                  {hour.hour}:00 - {hour.count.toLocaleString()} visitors
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12 AM</span>
                      <span>12 PM</span>
                      <span>11 PM</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Today</h4>
                      <p className="text-lg font-bold">{visitorStats.today.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">vs yesterday: {visitorStats.yesterday.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">This Week</h4>
                      <p className="text-lg font-bold">{visitorStats.thisWeek.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">vs last week: {visitorStats.lastWeek.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">This Month</h4>
                      <p className="text-lg font-bold">{visitorStats.thisMonth.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">vs last month: {visitorStats.lastMonth.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Avg. Time on Site</h4>
                      <p className="text-lg font-bold">3m 42s</p>
                      <p className="text-xs text-gray-500">+12% from last week</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Popular Pages</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Homepage</span>
                        <span className="text-xs font-medium">42%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "42%" }}></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs">Weather Map</span>
                        <span className="text-xs font-medium">28%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "28%" }}></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs">Forecast</span>
                        <span className="text-xs font-medium">18%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "18%" }}></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs">Radar</span>
                        <span className="text-xs font-medium">12%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="demographics" className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Top Countries</h4>
                    <div className="space-y-2">
                      {visitorStats.byCountry.map((country, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs flex items-center">
                              <Globe className="h-3 w-3 mr-1 text-blue-400" />
                              {country.country}
                            </span>
                            <span className="text-xs font-medium">{country.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${country.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Devices</h4>
                    <div className="flex justify-between items-center h-20">
                      {visitorStats.byDevice.map((device, index) => (
                        <div key={index} className="flex flex-col items-center justify-end h-full flex-1">
                          <div
                            className="w-full bg-blue-600 rounded-t-lg"
                            style={{ height: `${device.percentage}%` }}
                          ></div>
                          <p className="text-xs mt-1">{device.device}</p>
                          <p className="text-xs font-medium">{device.percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Visit Time</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold">3m 42s</p>
                        <p className="text-xs text-gray-400">Avg. Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">2.8</p>
                        <p className="text-xs text-gray-400">Pages/Visit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">32%</p>
                        <p className="text-xs text-gray-400">Bounce Rate</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        People currently checking weather updates
      </div>
    </div>
  )
}
