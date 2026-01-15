"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  ChevronRight,
  Calendar,
  Clock,
  Compass,
  CloudSnow,
  CloudLightning,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedTimeDisplay } from "./enhanced-time-display"

// Remove the onUseLocation prop from the interface
interface LandingPageProps {
  onSearch: (city: string) => void
  isLocating?: boolean
}

// Update the function signature to remove onUseLocation
export function EnhancedLandingPage({ onSearch, isLocating = false }: LandingPageProps) {
  const [city, setCity] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weatherCondition, setWeatherCondition] = useState("clear")

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Change weather condition based on time of day for demo purposes
  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour >= 6 && hour < 10) {
      setWeatherCondition("clear")
    } else if (hour >= 10 && hour < 14) {
      setWeatherCondition("partly cloudy")
    } else if (hour >= 14 && hour < 18) {
      setWeatherCondition("cloudy")
    } else if (hour >= 18 && hour < 22) {
      setWeatherCondition("rain")
    } else {
      setWeatherCondition("clear")
    }
  }, [currentTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city)
    }
  }

  // Sample weather data for demo
  const featuredCities = [
    { name: "New York", temp: 18, condition: "Cloudy" },
    { name: "London", temp: 12, condition: "Rainy" },
    { name: "Tokyo", temp: 24, condition: "Sunny" },
    { name: "Sydney", temp: 28, condition: "Clear" },
    { name: "Paris", temp: 15, condition: "Partly Cloudy" },
    { name: "Dubai", temp: 35, condition: "Sunny" },
  ]

  // Weather news for demo
  const weatherNews = [
    { title: "Heat Wave Expected Next Week", category: "Alert" },
    { title: "New Climate Study Released", category: "Research" },
    { title: "Hurricane Season Forecast Update", category: "Forecast" },
  ]

  // Weather features for demo
  const weatherFeatures = [
    {
      title: "Real-time Updates",
      description: "Get minute-by-minute weather updates for your location",
      icon: <Clock className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "7-Day Forecast",
      description: "Plan ahead with accurate 7-day weather predictions",
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Weather Maps",
      description: "Interactive radar maps showing precipitation and temperature",
      icon: <Compass className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Weather Alerts",
      description: "Receive timely notifications about severe weather conditions",
      icon: <Info className="h-6 w-6 text-amber-500" />,
    },
  ]

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else if (conditionLower.includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-sky-300" />
    } else if (conditionLower.includes("thunder") || conditionLower.includes("lightning")) {
      return <CloudLightning className="h-8 w-8 text-amber-500" />
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return <Cloud className="h-8 w-8 text-slate-400" />
    } else {
      // Clear or sunny
      return <Sun className="h-8 w-8 text-amber-400" />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-950 z-0">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-300 dark:bg-blue-700 blur-3xl animate-float"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/3 w-72 h-72 rounded-full bg-indigo-300 dark:bg-indigo-700 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-300 dark:bg-purple-700 blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      {/* Weather icons floating animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute text-blue-500/30 dark:text-blue-400/20"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ top: "15%", left: "10%" }}
        >
          <Cloud size={120} />
        </motion.div>

        <motion.div
          className="absolute text-amber-500/30 dark:text-amber-400/20"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          style={{ top: "25%", right: "15%" }}
        >
          <Sun size={150} />
        </motion.div>

        <motion.div
          className="absolute text-blue-600/20 dark:text-blue-500/20"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          style={{ bottom: "20%", left: "20%" }}
        >
          <CloudRain size={100} />
        </motion.div>

        <motion.div
          className="absolute text-purple-500/20 dark:text-purple-400/20"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 3 }}
          style={{ bottom: "30%", right: "20%" }}
        >
          <Wind size={130} />
        </motion.div>

        <motion.div
          className="absolute text-indigo-500/20 dark:text-indigo-400/20"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 4 }}
          style={{ bottom: "15%", right: "30%" }}
        >
          <Cloud size={90} />
        </motion.div>

        <motion.div
          className="absolute text-pink-500/20 dark:text-pink-400/20"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 5 }}
          style={{ top: "40%", left: "10%" }}
        >
          <Sun size={70} />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Weather Forecast
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Get accurate weather forecasts, real-time updates, and detailed information
              </p>
            </motion.div>

            <TabsList className="grid grid-cols-4 w-auto">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="maps">Maps</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-8">
            {/* Enhanced Time Display */}
            <div className="mb-8">
              <EnhancedTimeDisplay weatherCondition={weatherCondition} temperature={22} humidity={65} windSpeed={12} />
            </div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-3xl mx-auto mb-12"
            >
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-2 border-blue-200 dark:border-blue-800/50 transform transition-all hover:translate-y-[-5px]">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      Discover Your Weather
                    </h2>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                      <Input
                        type="text"
                        placeholder="Enter city name..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="relative pl-12 h-14 text-lg border-2 border-blue-200 dark:border-blue-800/50 focus-visible:ring-blue-500 rounded-xl transition-all shadow-md hover:shadow-lg bg-white/90 dark:bg-gray-800/90"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 h-6 w-6" />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl h-14 transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden group text-lg font-medium"
                      >
                        <span className="relative z-10 flex items-center">
                          <Search className="h-5 w-5 mr-2" />
                          Search Weather
                        </span>
                        <span className="absolute inset-0 w-full h-full bg-white scale-0 group-hover:scale-100 transition-transform origin-center rounded-lg z-0 opacity-10"></span>
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Popular Cities</h3>
                    <div className="flex flex-wrap gap-2">
                      {["New York", "London", "Tokyo", "Paris", "Sydney", "Dubai"].map((popularCity) => (
                        <Button
                          key={popularCity}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCity(popularCity)
                            onSearch(popularCity)
                          }}
                          className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                          {popularCity}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Cities */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Compass className="mr-2 h-6 w-6 text-blue-500" />
                Featured Cities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featuredCities.map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="weather-card-enhanced overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">{city.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{city.condition}</p>
                          </div>
                          <div className="flex items-center">
                            {getWeatherIcon(city.condition)}
                            <span className="text-2xl font-bold ml-2">{city.temp}°C</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full flex justify-between items-center text-blue-600 dark:text-blue-400"
                          onClick={() => {
                            setCity(city.name)
                            onSearch(city.name)
                          }}
                        >
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weather Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Info className="mr-2 h-6 w-6 text-blue-500" />
                Weather Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {weatherFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="feature-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weather News */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CloudRain className="mr-2 h-6 w-6 text-blue-500" />
                Weather News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherNews.map((news, index) => (
                  <motion.div
                    key={news.title}
                    className="news-card p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  >
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">{news.category}</div>
                    <h3 className="font-bold mb-2">{news.title}</h3>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Read More
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecast">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Search for a city to see the detailed 7-day weather forecast.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Weather Maps</h2>
                <p className="text-gray-500 dark:text-gray-400">Interactive weather maps will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Weather News & Alerts</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Latest weather news and alerts will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by advanced weather data • Real-time updates • Accurate forecasts
          </p>
        </motion.div>
      </div>
    </div>
  )
}
