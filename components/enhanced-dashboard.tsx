"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Droplets,
  Wind,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  MapPin,
  Calendar,
  TrendingUp,
  LineChart,
  AlertTriangle,
  RefreshCw,
  Eye,
  Compass,
  Thermometer,
  CloudRain,
  CloudSnow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { EnhancedRealisticEarth } from "./enhanced-realistic-earth"

interface DashboardProps {
  weatherData?: any
  forecastData?: any
  username?: string
}

export function EnhancedDashboard({ weatherData, forecastData, username = "User" }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [unit, setUnit] = useState("celsius")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Mock weather data if none provided
  const location = weatherData?.location?.name || "New York"
  const temperature = weatherData?.current?.temp_c || 24
  const condition = weatherData?.current?.condition?.text || "Sunny"
  const humidity = weatherData?.current?.humidity || 60
  const windSpeed = weatherData?.current?.wind_kph || 8
  const sunrise = forecastData?.forecast?.forecastday?.[0]?.astro?.sunrise || "06:30 AM"
  const sunset = forecastData?.forecast?.forecastday?.[0]?.astro?.sunset || "07:45 PM"
  const uvIndex = weatherData?.current?.uv || 5
  const pressure = weatherData?.current?.pressure_mb || 1015
  const visibility = weatherData?.current?.vis_km || 10

  // Current hour of day to determine if it's day or night
  const currentHour = currentTime.getHours()
  const isDay = currentHour >= 6 && currentHour < 20

  // Simulated refresh data
  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Mock forecast data
  const mockForecast = [
    { day: "Mon", temp: 24, icon: "sun" },
    { day: "Tue", temp: 22, icon: "cloud" },
    { day: "Wed", temp: 19, icon: "cloud-rain" },
    { day: "Thu", temp: 18, icon: "cloud-rain" },
    { day: "Fri", temp: 20, icon: "cloud" },
    { day: "Sat", temp: 23, icon: "sun" },
    { day: "Sun", temp: 25, icon: "sun" },
  ]

  // Mock hourly data
  const mockHourly = [
    { time: "Now", temp: 24, icon: "sun" },
    { time: "1PM", temp: 25, icon: "sun" },
    { time: "2PM", temp: 25, icon: "sun" },
    { time: "3PM", temp: 24, icon: "cloud" },
    { time: "4PM", temp: 23, icon: "cloud" },
    { time: "5PM", temp: 22, icon: "cloud" },
    { time: "6PM", temp: 21, icon: "cloud" },
    { time: "7PM", temp: 19, icon: "cloud" },
  ]

  // Mock weather alerts
  const mockAlerts = [
    {
      title: "Heat Advisory",
      level: "moderate",
      time: "Today, 2:00 PM - 8:00 PM",
    },
    {
      title: "Air Quality Warning",
      level: "low",
      time: "Today, All Day",
    },
  ]

  // Mock locations
  const mockLocations = [
    { name: "New York", temp: 24, condition: "Sunny" },
    { name: "London", temp: 18, condition: "Cloudy" },
    { name: "Tokyo", temp: 28, condition: "Partly Cloudy" },
    { name: "Sydney", temp: 22, condition: "Clear" },
  ]

  // Weather icon component
  const WeatherIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-6 w-6 text-gray-400" />
      case "cloud-rain":
        return <Umbrella className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  // Alert level color
  const getAlertColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "moderate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "low":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="premium-card p-6 mb-6 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Welcome back, {username || "User"}
                </h1>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center mr-3">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    {location || "Loading location..."}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 text-purple-500" />
                    {formatTime()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800/30 shadow-md">
                <div className="flex items-center">
                  {condition ? (
                    <img
                      src={`https://cdn.weatherapi.com/weather/64x64/day/${condition}.png`}
                      alt={condition}
                      className="h-10 w-10 object-contain drop-shadow-md"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <Cloud className="h-6 w-6 text-blue-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {condition || "Weather data loading..."}
                    </div>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                      {temperature ? `${temperature}°C` : "--°C"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="premium-glass p-3 rounded-xl flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3 shadow-lg">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Feels Like</div>
                <div className="text-lg font-semibold">{temperature ? `${temperature}°C` : "--°C"}</div>
              </div>
            </div>

            <div className="premium-glass p-3 rounded-xl flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-3 shadow-lg">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
                <div className="text-lg font-semibold">{humidity ? `${humidity}%` : "--%"}</div>
              </div>
            </div>

            <div className="premium-glass p-3 rounded-xl flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                <Wind className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Wind Speed</div>
                <div className="text-lg font-semibold">{windSpeed ? `${windSpeed} km/h` : "-- km/h"}</div>
              </div>
            </div>

            <div className="premium-glass p-3 rounded-xl flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-3 shadow-lg">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">UV Index</div>
                <div className="text-lg font-semibold">{uvIndex ? `${uvIndex}` : "--"}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span>Live</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={handleRefreshData}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weather Overview */}
          <Card className="overflow-hidden border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-yellow-300 to-orange-500 dark:from-yellow-600 dark:to-orange-700 animate-pulse-custom"></div>

                  <div className="relative">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                          <span>{location}</span>
                          <div className="relative">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                          </div>
                        </h2>
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground">{condition}</p>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {isDay ? "Day" : "Night"}
                          </span>
                        </div>
                      </div>
                      <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-start">
                        {temperature}°<span className="text-sm mt-1 ml-0.5">{unit === "celsius" ? "C" : "F"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all transform hover:scale-105 border border-blue-100/50 dark:border-blue-900/30">
                        <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Humidity</span>
                        <span className="text-lg font-semibold">{humidity}%</span>
                        <div className="w-full h-1 bg-blue-200/50 dark:bg-blue-800/50 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${humidity}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all transform hover:scale-105 border border-purple-100/50 dark:border-purple-900/30">
                        <Wind className="h-5 w-5 text-purple-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Wind</span>
                        <span className="text-lg font-semibold">{windSpeed} km/h</span>
                        <div className="w-full h-1 bg-purple-200/50 dark:bg-purple-800/50 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${Math.min(100, (windSpeed / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all transform hover:scale-105 border border-green-100/50 dark:border-green-900/30">
                        <Eye className="h-5 w-5 text-green-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Visibility</span>
                        <span className="text-lg font-semibold">{visibility} km</span>
                        <div className="w-full h-1 bg-green-200/50 dark:bg-green-800/50 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${Math.min(100, (visibility / 10) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 p-3 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all transform hover:scale-105 border border-amber-100/50 dark:border-amber-900/30">
                        <Compass className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Pressure</span>
                        <span className="text-lg font-semibold">{pressure} mb</span>
                        <div className="w-full h-1 bg-amber-200/50 dark:bg-amber-800/50 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, ((pressure - 970) / 80) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden flex items-center justify-center border-l border-blue-100 dark:border-blue-900/50">
                  <EnhancedRealisticEarth
                    sunrise={sunrise}
                    sunset={sunset}
                    isDay={isDay}
                    weatherCondition={condition}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Tabs */}
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Weather Forecast
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="mt-2">
                <TabsList className="mb-4 grid w-full grid-cols-2 bg-blue-100/50 dark:bg-blue-900/30 p-1 rounded-lg">
                  <TabsTrigger
                    value="daily"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="hourly"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Hourly
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <div className="grid grid-cols-7 gap-2">
                    {mockForecast.map((day, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex flex-col items-center p-3 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900/80 rounded-xl hover:shadow-md transition-all border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700"
                      >
                        <span className="text-sm font-medium bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded-full text-blue-700 dark:text-blue-300 mb-1">
                          {day.day}
                        </span>
                        <div className="my-2 relative">
                          <WeatherIcon icon={day.icon} />
                          {day.icon === "cloud-rain" && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 dark:bg-blue-900/70 rounded-full flex items-center justify-center">
                              <Umbrella className="h-2.5 w-2.5 text-blue-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                          {day.temp}°
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="hourly">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-700 dark:scrollbar-track-blue-900/30 mask-fade-edges">
                    {mockHourly.map((hour, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900/80 rounded-xl hover:shadow-md transition-all min-w-[100px] border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700"
                      >
                        <span className="text-sm font-medium bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded-full text-blue-700 dark:text-blue-300 mb-1">
                          {hour.time}
                        </span>
                        <div className="my-2 relative">
                          <WeatherIcon icon={hour.icon} />
                          {hour.icon === "cloud-rain" && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 dark:bg-blue-900/70 rounded-full flex items-center justify-center">
                              <Umbrella className="h-2.5 w-2.5 text-blue-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                          {hour.temp}°
                        </span>
                        <div className="flex items-center justify-center text-xs text-muted-foreground mt-3 gap-2">
                          <div className="flex items-center bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                            <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                            <span>{hour.temp > 22 ? "60%" : "45%"}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Weather Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UV Index */}
            <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{uvIndex}</span>
                  <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                    {uvIndex < 3 ? "Low" : uvIndex < 6 ? "Moderate" : uvIndex < 8 ? "High" : "Very High"}
                  </span>
                </div>
                <Progress value={(uvIndex / 11) * 100} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {uvIndex < 3
                    ? "No protection needed"
                    : uvIndex < 6
                      ? "Protection recommended"
                      : uvIndex < 8
                        ? "Protection required"
                        : "Extra protection required"}
                </p>
              </CardContent>
            </Card>

            {/* Sunrise & Sunset */}
            <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {isDay ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-400" />}
                  {isDay ? "Day & Night" : "Night & Day"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sun className="h-6 w-6 text-orange-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Sunrise</span>
                    <div className="text-lg font-bold">{sunrise}</div>
                  </div>

                  <div className="w-1/3 h-[2px] bg-gradient-to-r from-orange-300 via-yellow-300 to-blue-300 dark:from-orange-500 dark:via-yellow-500 dark:to-blue-500"></div>

                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Moon className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Sunset</span>
                    <div className="text-lg font-bold">{sunset}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weather Alerts */}
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
                  Weather Alerts
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {mockAlerts.length > 0 ? (
                <div className="space-y-3">
                  {mockAlerts.map((alert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className={`p-3 rounded-lg ${getAlertColor(alert.level)} hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50`}
                    >
                      <div className="font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {alert.title}
                      </div>
                      <div className="text-xs mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-muted-foreground">No active alerts for this area</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Locations */}
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Saved Locations
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {mockLocations.map((loc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg hover:from-blue-100 hover:to-blue-50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium">{loc.name}</span>
                        <div className="text-xs text-muted-foreground">{loc.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-2 text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        {loc.temp}°
                      </span>
                      {loc.condition.includes("Sun") || loc.condition.includes("Clear") ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Cloud className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Stats */}
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  Weather Trends
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Temperature Trend</span>
                    <span className="text-xs text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2°C
                    </span>
                  </div>
                  <div className="w-full h-10 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-around px-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="w-px h-6 bg-white/30 dark:bg-white/10 rounded-full"></div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[60%]">
                      <svg width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="temp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <path d="M0,30 Q25,10 50,20 T100,10 V40 H0 Z" fill="url(#temp-gradient)" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Precipitation Chance</span>
                    <span className="text-xs text-red-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                      -10%
                    </span>
                  </div>
                  <div className="w-full h-10 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-around px-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="w-px h-6 bg-white/30 dark:bg-white/10 rounded-full"></div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[40%]">
                      <svg width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="rain-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                        <path d="M0,30 Q30,20 60,15 T100,5 V40 H0 Z" fill="url(#rain-gradient)" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Add a new Air Quality section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Air Quality</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      Good
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-300"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Good</span>
                    <span>Moderate</span>
                    <span>Poor</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const Clock = ({ className }: { className?: string }) => {
  return <div className={className}>🕒</div>
}

const Check = ({ className }: { className?: string }) => {
  return <div className={className}>✓</div>
}

function getWeatherIconForCondition(condition: string) {
  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
        <CloudRain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
    )
  } else if (conditionLower.includes("snow")) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
        <CloudSnow className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
    )
  } else if (conditionLower.includes("cloud")) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50 flex items-center justify-center">
        <Cloud className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>
    )
  } else if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 flex items-center justify-center">
        <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      </div>
    )
  } else {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/50 dark:to-gray-800/50 flex items-center justify-center">
        <Cloud className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>
    )
  }
}
