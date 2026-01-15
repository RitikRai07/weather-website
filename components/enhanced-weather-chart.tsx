"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Scatter,
  ReferenceLine,
  Brush,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Thermometer,
  Droplets,
  Wind,
  Umbrella,
  BarChart2,
  LineChartIcon,
  AreaChartIcon,
  PieChart,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  RadarIcon,
  Share2,
  Info,
  Zap,
  Sun,
} from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

interface WeatherDataPoint {
  time: string
  temp_c: number
  humidity: number
  wind_kph: number
  chance_of_rain: number
  condition: {
    text: string
    icon: string
  }
}

interface EnhancedWeatherChartProps {
  hourlyData: WeatherDataPoint[]
  dailyData?: Array<{
    date: string
    avgtemp_c: number
    mintemp_c: number
    maxtemp_c: number
    avghumidity: number
    daily_chance_of_rain: number
    condition: {
      text: string
      icon: string
    }
  }>
}

export function EnhancedWeatherChart({ hourlyData, dailyData = [] }: EnhancedWeatherChartProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar" | "composed" | "radar">("line")
  const [dataType, setDataType] = useState<"hourly" | "daily">("hourly")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [chartHeight, setChartHeight] = useState(350)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dataUnit, setDataUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [opacity, setOpacity] = useState({
    temperature: 1,
    humidity: 1,
    rainChance: 1,
    windSpeed: 0.8,
    uvIndex: 0.7,
  })
  const [refreshKey, setRefreshKey] = useState(0)
  const [showDataLabels, setShowDataLabels] = useState(false)
  const [animateChart, setAnimateChart] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([0, 24])
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const { toast } = useToast()
  const chartRef = useRef<HTMLDivElement>(null)

  // Set current time for reference line
  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit" }))

    // Adjust chart height based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChartHeight(250)
      } else if (isFullscreen) {
        setChartHeight(500)
      } else {
        setChartHeight(350)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isFullscreen])

  // Format time for display
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: "2-digit" })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { weekday: "short" })
  }

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number) => {
    return (celsius * 9) / 5 + 32
  }

  // Add UV index and feels like data to hourly data
  const enhanceHourlyData = useCallback(() => {
    return hourlyData
      .map((hour, index) => {
        // Generate some mock UV index data based on time of day
        const hourNum = new Date(hour.time).getHours()
        let uvIndex = 0
        if (hourNum >= 8 && hourNum <= 16) {
          uvIndex = 7 - Math.abs(hourNum - 12) * 0.7 // Peak at noon
        }

        // Calculate feels like temperature (simplified version)
        const feelsLike = hour.temp_c + (hour.humidity > 70 ? 2 : 0) - (hour.wind_kph > 20 ? 1 : 0)

        return {
          ...hour,
          time: formatTime(hour.time),
          rawTime: hour.time, // Keep raw time for sorting
          temperature: dataUnit === "celsius" ? hour.temp_c : celsiusToFahrenheit(hour.temp_c),
          humidity: hour.humidity,
          windSpeed: hour.wind_kph,
          rainChance: hour.chance_of_rain,
          condition: hour.condition.text,
          icon: hour.condition.icon,
          uvIndex: Math.round(uvIndex * 10) / 10,
          feelsLike: dataUnit === "celsius" ? feelsLike : celsiusToFahrenheit(feelsLike),
        }
      })
      .sort((a, b) => new Date(a.rawTime).getTime() - new Date(b.rawTime).getTime())
  }, [hourlyData, dataUnit])

  // Prepare daily data for charts
  const enhanceDailyData = useCallback(() => {
    return dailyData
      .map((day) => {
        // Calculate temperature range (max - min)
        const tempRange = day.maxtemp_c - day.mintemp_c

        // Calculate comfort index (mock data - higher is more comfortable)
        const comfortIndex = 10 - tempRange / 2 - day.daily_chance_of_rain / 10

        return {
          date: formatDate(day.date),
          rawDate: day.date, // Keep raw date for sorting
          avgTemp: dataUnit === "celsius" ? day.avgtemp_c : celsiusToFahrenheit(day.avgtemp_c),
          minTemp: dataUnit === "celsius" ? day.mintemp_c : celsiusToFahrenheit(day.mintemp_c),
          maxTemp: dataUnit === "celsius" ? day.maxtemp_c : celsiusToFahrenheit(day.maxtemp_c),
          humidity: day.avghumidity,
          rainChance: day.daily_chance_of_rain,
          condition: day.condition.text,
          icon: day.condition.icon,
          tempRange: dataUnit === "celsius" ? tempRange : tempRange * 1.8,
          comfortIndex: Math.max(0, Math.min(10, Math.round(comfortIndex * 10) / 10)),
        }
      })
      .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
  }, [dailyData, dataUnit])

  // Get formatted data based on selected type
  const formattedHourlyData = enhanceHourlyData()
  const formattedDailyData = enhanceDailyData()

  // Get active data based on selected tab
  const activeData = dataType === "hourly" ? formattedHourlyData : formattedDailyData
  const xAxisKey = dataType === "hourly" ? "time" : "date"

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setChartHeight(isFullscreen ? 350 : 500)
  }

  // Refresh chart
  const refreshChart = () => {
    setIsLoading(true)
    setRefreshKey((prev) => prev + 1)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Chart refreshed",
        description: "Weather data has been updated with the latest information.",
      })
    }, 1000)
  }

  // Toggle data unit
  const toggleDataUnit = () => {
    setDataUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"))
  }

  // Share chart
  const shareChart = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Weather Forecast Chart",
          text: "Check out this weather forecast chart!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      toast({
        title: "Share feature not available",
        description: "Your browser doesn't support the Web Share API.",
      })
    }
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border border-border p-3 rounded-md shadow-md backdrop-blur-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex items-center gap-1 text-sm">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span>
                {entry.name}: {entry.value.toFixed(1)} {entry.unit}
              </span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Get gradient colors based on theme
  const getGradientColors = useCallback(() => {
    const isDark = theme === "dark"
    return {
      temperature: {
        start: isDark ? "#f97316" : "#fdba74",
        end: isDark ? "#9a3412" : "#c2410c",
      },
      humidity: {
        start: isDark ? "#3b82f6" : "#93c5fd",
        end: isDark ? "#1d4ed8" : "#2563eb",
      },
      rainChance: {
        start: isDark ? "#22c55e" : "#86efac",
        end: isDark ? "#15803d" : "#16a34a",
      },
      windSpeed: {
        start: isDark ? "#8b5cf6" : "#c4b5fd",
        end: isDark ? "#5b21b6" : "#7c3aed",
      },
      uvIndex: {
        start: isDark ? "#ec4899" : "#fbcfe8",
        end: isDark ? "#be185d" : "#db2777",
      },
    }
  }, [theme])

  const gradientColors = getGradientColors()

  // Download chart as image
  const downloadChart = () => {
    const chartElement = document.querySelector(".recharts-wrapper svg")
    if (!chartElement) return

    const svgData = new XMLSerializer().serializeToString(chartElement as Node)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      // Download the PNG
      const downloadLink = document.createElement("a")
      downloadLink.download = `weather-chart-${new Date().toISOString().slice(0, 10)}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    img.crossOrigin = "anonymous"
  }

  // Get radar chart data for daily forecast
  const getRadarData = () => {
    if (dataType === "hourly") {
      // For hourly data, use a subset of hours
      return formattedHourlyData
        .filter((_, i) => i % 3 === 0)
        .map((item) => ({
          subject: item.time,
          temperature: item.temperature,
          humidity: item.humidity,
          rainChance: item.rainChance,
          windSpeed: item.windSpeed,
          uvIndex: item.uvIndex * 10, // Scale up for visibility
        }))
    } else {
      // For daily data
      return formattedDailyData.map((item) => ({
        subject: item.date,
        temperature: (item.avgTemp / 40) * 100, // Normalize to 0-100 scale
        humidity: item.humidity,
        rainChance: item.rainChance,
        tempRange: (item.tempRange / 15) * 100, // Normalize to 0-100 scale
        comfortIndex: item.comfortIndex * 10, // Scale up for visibility
      }))
    }
  }

  return (
    <Card
      className={`w-full border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 transition-all duration-300 hover:shadow-xl ${isFullscreen ? "fixed inset-4 z-50 m-0 rounded-lg overflow-auto" : ""}`}
      ref={chartRef}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {dataType === "hourly" ? (
                <Clock className="h-5 w-5 text-blue-500" />
              ) : (
                <Calendar className="h-5 w-5 text-blue-500" />
              )}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Weather Trends
              </span>
            </CardTitle>
            <CardDescription>
              Interactive visualization of {dataType === "hourly" ? "hourly" : "daily"} weather data
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={toggleDataUnit}
              title={`Switch to ${dataUnit === "celsius" ? "Fahrenheit" : "Celsius"}`}
            >
              <span className="text-xs font-bold">{dataUnit === "celsius" ? "°F" : "°C"}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={refreshChart}
              title="Refresh chart"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={downloadChart}
              title="Download chart as image"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={shareChart}
              title="Share chart"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-full ${chartType === "line" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            onClick={() => setChartType("line")}
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            <span>Line</span>
          </Button>
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-full ${chartType === "area" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            onClick={() => setChartType("area")}
          >
            <AreaChartIcon className="h-4 w-4 mr-1" />
            <span>Area</span>
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-full ${chartType === "bar" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            onClick={() => setChartType("bar")}
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            <span>Bar</span>
          </Button>
          <Button
            variant={chartType === "composed" ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-full ${chartType === "composed" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            onClick={() => setChartType("composed")}
          >
            <PieChart className="h-4 w-4 mr-1" />
            <span>Composed</span>
          </Button>
          <Button
            variant={chartType === "radar" ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-full ${chartType === "radar" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            onClick={() => setChartType("radar")}
          >
            <RadarIcon className="h-4 w-4 mr-1" />
            <span>Radar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="hourly"
          value={dataType}
          onValueChange={(value) => setDataType(value as "hourly" | "daily")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="hourly" className="data-[state=active]:bg-blue-500">
              <Clock className="h-4 w-4 mr-2" />
              Hourly Forecast
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-blue-500">
              <Calendar className="h-4 w-4 mr-2" />
              Daily Forecast
            </TabsTrigger>
          </TabsList>

          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1 flex items-center">
                <Thermometer className="h-3 w-3 mr-1 text-orange-500" />
                Temperature Opacity
              </p>
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                value={[opacity.temperature]}
                onValueChange={(value) => setOpacity({ ...opacity, temperature: value[0] })}
                className="py-1"
              />
            </div>
            <div>
              <p className="text-xs mb-1 flex items-center">
                <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                Humidity Opacity
              </p>
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                value={[opacity.humidity]}
                onValueChange={(value) => setOpacity({ ...opacity, humidity: value[0] })}
                className="py-1"
              />
            </div>
            <div>
              <p className="text-xs mb-1 flex items-center">
                <Umbrella className="h-3 w-3 mr-1 text-green-500" />
                Rain Chance Opacity
              </p>
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                value={[opacity.rainChance]}
                onValueChange={(value) => setOpacity({ ...opacity, rainChance: value[0] })}
                className="py-1"
              />
            </div>
          </div>

          {/* Additional controls for enhanced features */}
          <div className="mb-4 flex flex-wrap gap-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium flex items-center">
                <Info className="h-3 w-3 mr-1 text-blue-500" />
                Data Labels
              </label>
              <Button
                variant={showDataLabels ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setShowDataLabels(!showDataLabels)}
              >
                {showDataLabels ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium flex items-center">
                <Zap className="h-3 w-3 mr-1 text-amber-500" />
                Animation
              </label>
              <Button
                variant={animateChart ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setAnimateChart(!animateChart)}
              >
                {animateChart ? "On" : "Off"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium flex items-center">
                <Sun className="h-3 w-3 mr-1 text-purple-500" />
                UV Index
              </label>
              <Button
                variant={opacity.uvIndex > 0 ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setOpacity({ ...opacity, uvIndex: opacity.uvIndex > 0 ? 0 : 0.7 })}
              >
                {opacity.uvIndex > 0 ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium flex items-center">
                <Wind className="h-3 w-3 mr-1 text-cyan-500" />
                Wind Speed
              </label>
              <Button
                variant={opacity.windSpeed > 0 ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setOpacity({ ...opacity, windSpeed: opacity.windSpeed > 0 ? 0 : 0.8 })}
              >
                {opacity.windSpeed > 0 ? "Hide" : "Show"}
              </Button>
            </div>
          </div>

          <TabsContent value="hourly">
            <motion.div
              className={`h-[${chartHeight}px] w-full`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={`${chartType}-hourly-${refreshKey}`}
            >
              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === "line" && (
                  <LineChart data={formattedHourlyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.windSpeed.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.windSpeed.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.uvIndex.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.uvIndex.end} stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                      label={{
                        value: `Temperature (°${dataUnit === "celsius" ? "C" : "F"})`,
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fontSize: "12px", fill: "#888" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                      label={{
                        value: "Percentage (%)",
                        angle: 90,
                        position: "insideRight",
                        style: { textAnchor: "middle", fontSize: "12px", fill: "#888" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    {currentTime && (
                      <ReferenceLine
                        x={currentTime}
                        stroke="#8884d8"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: "Now",
                          position: "insideTopRight",
                          fill: "#8884d8",
                          fontSize: 12,
                        }}
                      />
                    )}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="url(#temperatureGradient)"
                      name="Temperature"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainChance"
                      stroke="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    {opacity.windSpeed > 0 && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="windSpeed"
                        stroke="url(#windGradient)"
                        name="Wind Speed"
                        unit="km/h"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                        opacity={opacity.windSpeed}
                        isAnimationActive={animateChart}
                        label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                      />
                    )}
                    {opacity.uvIndex > 0 && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="uvIndex"
                        stroke="url(#uvGradient)"
                        name="UV Index"
                        unit=""
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                        opacity={opacity.uvIndex}
                        isAnimationActive={animateChart}
                        label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                      />
                    )}
                    <Brush
                      dataKey="time"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(7, formattedHourlyData.length - 1)}
                      fill="rgba(136, 132, 216, 0.1)"
                    />
                  </LineChart>
                )}

                {chartType === "area" && (
                  <AreaChart data={formattedHourlyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.windSpeed.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.windSpeed.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.uvIndex.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.uvIndex.end} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#888" }} axisLine={{ stroke: "#888" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    {currentTime && (
                      <ReferenceLine
                        x={currentTime}
                        stroke="#8884d8"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: "Now",
                          position: "insideTopRight",
                          fill: "#8884d8",
                          fontSize: 12,
                        }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke={gradientColors.temperature.end}
                      fill="url(#temperatureGradient)"
                      name="Temperature"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      fill="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                    />
                    {opacity.windSpeed > 0 && (
                      <Area
                        type="monotone"
                        dataKey="windSpeed"
                        stroke={gradientColors.windSpeed.end}
                        fill="url(#windGradient)"
                        name="Wind Speed"
                        unit="km/h"
                        strokeWidth={2}
                        opacity={opacity.windSpeed}
                        isAnimationActive={animateChart}
                      />
                    )}
                    {opacity.uvIndex > 0 && (
                      <Area
                        type="monotone"
                        dataKey="uvIndex"
                        stroke={gradientColors.uvIndex.end}
                        fill="url(#uvGradient)"
                        name="UV Index"
                        unit=""
                        strokeWidth={2}
                        opacity={opacity.uvIndex}
                        isAnimationActive={animateChart}
                      />
                    )}
                    <Brush
                      dataKey="time"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(7, formattedHourlyData.length - 1)}
                      fill="rgba(136, 132, 216, 0.1)"
                    />
                  </AreaChart>
                )}

                {chartType === "bar" && (
                  <BarChart data={formattedHourlyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.windSpeed.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.windSpeed.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.uvIndex.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.uvIndex.end} stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#888" }} axisLine={{ stroke: "#888" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    {currentTime && (
                      <ReferenceLine
                        x={currentTime}
                        stroke="#8884d8"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: "Now",
                          position: "insideTopRight",
                          fill: "#8884d8",
                          fontSize: 12,
                        }}
                      />
                    )}
                    <Bar
                      dataKey="temperature"
                      fill="url(#temperatureGradient)"
                      name="Temperature"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Bar
                      dataKey="humidity"
                      fill="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Bar
                      dataKey="rainChance"
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    {opacity.windSpeed > 0 && (
                      <Bar
                        dataKey="windSpeed"
                        fill="url(#windGradient)"
                        name="Wind Speed"
                        unit="km/h"
                        radius={[4, 4, 0, 0]}
                        opacity={opacity.windSpeed}
                        isAnimationActive={animateChart}
                        label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                      />
                    )}
                    {opacity.uvIndex > 0 && (
                      <Bar
                        dataKey="uvIndex"
                        fill="url(#uvGradient)"
                        name="UV Index"
                        unit=""
                        radius={[4, 4, 0, 0]}
                        opacity={opacity.uvIndex}
                        isAnimationActive={animateChart}
                        label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                      />
                    )}
                    <Brush
                      dataKey="time"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(7, formattedHourlyData.length - 1)}
                      fill="rgba(136, 132, 216, 0.1)"
                    />
                  </BarChart>
                )}

                {chartType === "composed" && (
                  <ComposedChart data={formattedHourlyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.windSpeed.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.windSpeed.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.uvIndex.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.uvIndex.end} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    {currentTime && (
                      <ReferenceLine
                        x={currentTime}
                        stroke="#8884d8"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: "Now",
                          position: "insideTopRight",
                          fill: "#8884d8",
                          fontSize: 12,
                        }}
                      />
                    )}
                    <Bar
                      yAxisId="left"
                      dataKey="temperature"
                      fill="url(#temperatureGradient)"
                      name="Temperature"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      name="Humidity"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      fillOpacity={0.3}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                    />
                    {opacity.windSpeed > 0 && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="windSpeed"
                        stroke={gradientColors.windSpeed.end}
                        name="Wind Speed"
                        unit="km/h"
                        strokeWidth={2}
                        opacity={opacity.windSpeed}
                        isAnimationActive={animateChart}
                      />
                    )}
                    {opacity.uvIndex > 0 && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="uvIndex"
                        stroke={gradientColors.uvIndex.end}
                        name="UV Index"
                        unit=""
                        strokeWidth={2}
                        opacity={opacity.uvIndex}
                        isAnimationActive={animateChart}
                      />
                    )}
                    <Brush
                      dataKey="time"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(7, formattedHourlyData.length - 1)}
                      fill="rgba(136, 132, 216, 0.1)"
                    />
                  </ComposedChart>
                )}

                {chartType === "radar" && (
                  <RadarChart outerRadius={150} width={730} height={350} data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Temperature"
                      dataKey="temperature"
                      stroke={gradientColors.temperature.end}
                      fill={gradientColors.temperature.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Humidity"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      fill={gradientColors.humidity.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Rain Chance"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill={gradientColors.rainChance.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    {opacity.windSpeed > 0 && (
                      <Radar
                        name="Wind Speed"
                        dataKey="windSpeed"
                        stroke={gradientColors.windSpeed.end}
                        fill={gradientColors.windSpeed.start}
                        fillOpacity={0.6}
                        isAnimationActive={animateChart}
                      />
                    )}
                    {opacity.uvIndex > 0 && dataType === "hourly" && (
                      <Radar
                        name="UV Index"
                        dataKey="uvIndex"
                        stroke={gradientColors.uvIndex.end}
                        fill={gradientColors.uvIndex.start}
                        fillOpacity={0.6}
                        isAnimationActive={animateChart}
                      />
                    )}
                    {dataType === "daily" && (
                      <Radar
                        name="Comfort Index"
                        dataKey="comfortIndex"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                        isAnimationActive={animateChart}
                      />
                    )}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="daily">
            <motion.div
              className={`h-[${chartHeight}px] w-full`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={`${chartType}-daily-${refreshKey}`}
            >
              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === "line" && (
                  <LineChart data={formattedDailyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff5722" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                      label={{
                        value: `Temperature (°${dataUnit === "celsius" ? "C" : "F"})`,
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fontSize: "12px", fill: "#888" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                      label={{
                        value: "Percentage (%)",
                        angle: 90,
                        position: "insideRight",
                        style: { textAnchor: "middle", fontSize: "12px", fill: "#888" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgTemp"
                      stroke="url(#temperatureGradient)"
                      name="Avg Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="minTemp"
                      stroke="#06b6d4"
                      name="Min Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="maxTemp"
                      stroke="#ef4444"
                      name="Max Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainChance"
                      stroke="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="tempRange"
                      stroke="url(#tempRangeGradient)"
                      name="Temp Range"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="comfortIndex"
                      stroke="url(#comfortGradient)"
                      name="Comfort Index"
                      unit="/10"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                  </LineChart>
                )}

                {chartType === "area" && (
                  <AreaChart data={formattedDailyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff5722" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#888" }} axisLine={{ stroke: "#888" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    <Area
                      type="monotone"
                      dataKey="avgTemp"
                      stroke={gradientColors.temperature.end}
                      fill="url(#temperatureGradient)"
                      name="Avg Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      fill="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="tempRange"
                      stroke="#ff9800"
                      fill="url(#tempRangeGradient)"
                      name="Temp Range"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      strokeWidth={2}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      type="monotone"
                      dataKey="comfortIndex"
                      stroke="#4caf50"
                      fill="url(#comfortGradient)"
                      name="Comfort Index"
                      unit="/10"
                      strokeWidth={2}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                  </AreaChart>
                )}

                {chartType === "bar" && (
                  <BarChart data={formattedDailyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff5722" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#888" }} axisLine={{ stroke: "#888" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar
                      dataKey="avgTemp"
                      fill="url(#temperatureGradient)"
                      name="Avg Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Bar
                      dataKey="humidity"
                      fill="url(#humidityGradient)"
                      name="Humidity"
                      unit="%"
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Bar
                      dataKey="rainChance"
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                      label={showDataLabels ? { position: "top", fill: "#666", fontSize: 10 } : false}
                    />
                    <Bar
                      dataKey="tempRange"
                      fill="url(#tempRangeGradient)"
                      name="Temp Range"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      radius={[4, 4, 0, 0]}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                    <Bar
                      dataKey="comfortIndex"
                      fill="url(#comfortGradient)"
                      name="Comfort Index"
                      unit="/10"
                      radius={[4, 4, 0, 0]}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                  </BarChart>
                )}

                {chartType === "composed" && (
                  <ComposedChart data={formattedDailyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.temperature.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.temperature.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.humidity.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.humidity.end} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.rainChance.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.rainChance.end} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff5722" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar
                      yAxisId="left"
                      dataKey="avgTemp"
                      fill="url(#temperatureGradient)"
                      name="Avg Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      radius={[4, 4, 0, 0]}
                      opacity={opacity.temperature}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      name="Humidity"
                      unit="%"
                      strokeWidth={2}
                      opacity={opacity.humidity}
                      isAnimationActive={animateChart}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill="url(#rainGradient)"
                      name="Rain Chance"
                      unit="%"
                      fillOpacity={0.3}
                      opacity={opacity.rainChance}
                      isAnimationActive={animateChart}
                    />
                    <Scatter
                      yAxisId="left"
                      dataKey="minTemp"
                      fill="#06b6d4"
                      name="Min Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      isAnimationActive={animateChart}
                    />
                    <Scatter
                      yAxisId="left"
                      dataKey="maxTemp"
                      fill="#ef4444"
                      name="Max Temp"
                      unit={dataUnit === "celsius" ? "°C" : "°F"}
                      isAnimationActive={animateChart}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="comfortIndex"
                      stroke="#4caf50"
                      name="Comfort Index"
                      unit="/10"
                      strokeWidth={2}
                      opacity={0.7}
                      isAnimationActive={animateChart}
                    />
                  </ComposedChart>
                )}

                {chartType === "radar" && (
                  <RadarChart outerRadius={150} width={730} height={350} data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Temperature"
                      dataKey="temperature"
                      stroke={gradientColors.temperature.end}
                      fill={gradientColors.temperature.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Humidity"
                      dataKey="humidity"
                      stroke={gradientColors.humidity.end}
                      fill={gradientColors.humidity.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Rain Chance"
                      dataKey="rainChance"
                      stroke={gradientColors.rainChance.end}
                      fill={gradientColors.rainChance.start}
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Temp Range"
                      dataKey="tempRange"
                      stroke="#ff9800"
                      fill="#ff9800"
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Radar
                      name="Comfort Index"
                      dataKey="comfortIndex"
                      stroke="#4caf50"
                      fill="#4caf50"
                      fillOpacity={0.6}
                      isAnimationActive={animateChart}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap justify-between mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 p-1 rounded-md bg-blue-50 dark:bg-blue-900/30 mb-1 mr-1">
            <Thermometer className="h-3 w-3 text-orange-500" />
            <span>Temperature</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-md bg-blue-50 dark:bg-blue-900/30 mb-1 mr-1">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>Humidity</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-md bg-blue-50 dark:bg-blue-900/30 mb-1 mr-1">
            <Umbrella className="h-3 w-3 text-green-500" />
            <span>Rain Chance</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-md bg-blue-50 dark:bg-blue-900/30 mb-1">
            <Wind className="h-3 w-3 text-purple-500" />
            <span>Wind Speed</span>
          </div>
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          <p>Drag to zoom in hourly view • Data updates every 10 minutes • Click legend items to toggle visibility</p>
        </div>
      </CardContent>
    </Card>
  )
}
