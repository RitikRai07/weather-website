"use client"

import { useState, useEffect } from "react"
import { EnhancedSearchBar } from "@/components/enhanced-search-bar"
import { EnhancedNewsAlertsHeader } from "@/components/enhanced-news-alerts-header"
import { EnhancedTempAQIDisplay } from "@/components/enhanced-temp-aqi-display"
import { EnhancedSunriseSunsetModern } from "@/components/enhanced-sunrise-sunset-modern"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  minTemp: number
  maxTemp: number
  aqi: number
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  sunrise: string
  sunset: string
  condition: string
  alertCount: number
}

// Sample data for demonstration
const DEMO_DATA: WeatherData = {
  location: "Ludhiana",
  temperature: 21.2,
  feelsLike: 21.2,
  minTemp: 8.7,
  maxTemp: 21.5,
  aqi: 45,
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  pressure: 1013,
  sunrise: "06:30",
  sunset: "18:45",
  condition: "Partly Cloudy",
  alertCount: 2,
}

export function LudhianaWeatherShowcase() {
  const [currentLocation, setCurrentLocation] = useState<WeatherData>(DEMO_DATA)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, just update location name
    setCurrentLocation((prev) => ({
      ...prev,
      location: query,
    }))

    setIsSearching(false)
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Weather Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive weather information with modern design
          </p>
        </motion.div>

        {/* Search Bar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <div className="mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Search Weather Information
            </label>
          </div>
          <EnhancedSearchBar
            onSearch={handleSearch}
            placeholder="Search for city or weather information..."
          />
          {isSearching && (
            <motion.p
              className="text-sm text-blue-600 dark:text-blue-400 mt-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              Loading weather data for {currentLocation.location}...
            </motion.p>
          )}
        </motion.div>

        {/* Weather News & Alerts Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedNewsAlertsHeader
            location={currentLocation.location}
            alertCount={currentLocation.alertCount}
          />
        </motion.div>

        {/* Main Weather Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EnhancedTempAQIDisplay
            current={currentLocation.temperature}
            feelsLike={currentLocation.feelsLike}
            min={currentLocation.minTemp}
            max={currentLocation.maxTemp}
            aqi={currentLocation.aqi}
            humidity={currentLocation.humidity}
            windSpeed={currentLocation.windSpeed}
            visibility={currentLocation.visibility}
            pressure={currentLocation.pressure}
            unit="celsius"
          />
        </motion.div>

        {/* Sunrise/Sunset Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EnhancedSunriseSunsetModern
            sunrise={currentLocation.sunrise}
            sunset={currentLocation.sunset}
            currentTime={currentTime}
          />
        </motion.div>

        {/* Weather Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="text-2xl">Weather Insights</CardTitle>
              <CardDescription>Key observations and recommendations for {currentLocation.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Insight 1 */}
                <InsightCard
                  icon="🌡️"
                  title="Temperature Status"
                  description={`Currently ${currentLocation.temperature}°C, feels like ${currentLocation.feelsLike}°C`}
                  delay={0}
                />

                {/* Insight 2 */}
                <InsightCard
                  icon="💨"
                  title="Wind Conditions"
                  description={`Moderate wind at ${currentLocation.windSpeed} km/h. Good for outdoor activities.`}
                  delay={0.1}
                />

                {/* Insight 3 */}
                <InsightCard
                  icon="👁️"
                  title="Visibility"
                  description={`Clear visibility at ${currentLocation.visibility} km. Good for travel.`}
                  delay={0.2}
                />

                {/* Insight 4 */}
                <InsightCard
                  icon="💧"
                  title="Humidity Level"
                  description={`Humidity at ${currentLocation.humidity}%. Moderate moisture levels.`}
                  delay={0.3}
                />

                {/* Insight 5 */}
                <InsightCard
                  icon="🌍"
                  title="Air Quality"
                  description={`AQI at ${currentLocation.aqi}%. Good air quality for outdoor exercise.`}
                  delay={0.4}
                />

                {/* Insight 6 */}
                <InsightCard
                  icon="📊"
                  title="Pressure"
                  description={`Atmospheric pressure at ${currentLocation.pressure} mb. Stable weather expected.`}
                  delay={0.5}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader>
              <CardTitle>Features Implemented</CardTitle>
              <CardDescription>Modern weather dashboard capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureItem
                  title="Enhanced Search"
                  items={["Predictive suggestions", "Search history", "Popular cities", "Search types"]}
                />
                <FeatureItem
                  title="Real-time Data"
                  items={["Live clock", "Auto-updating timestamps", "Alert notifications", "Data refresh"]}
                />
                <FeatureItem
                  title="Temperature Display"
                  items={["Large fonts (7xl)", "Color coding", "Feels like temp", "Trend indicators"]}
                />
                <FeatureItem
                  title="Air Quality"
                  items={["AQI percentage", "Status labels", "Color indicators", "Health insights"]}
                />
                <FeatureItem
                  title="Sunrise/Sunset"
                  items={["SVG arc visualization", "Day progress", "Time of day detection", "Duration calc"]}
                />
                <FeatureItem
                  title="Additional Metrics"
                  items={["Humidity", "Wind speed", "Visibility", "Pressure"]}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400 py-8"
        >
          <p>Modern Weather Dashboard • Designed for clarity, readability, and responsive experience</p>
          <p className="mt-2">All data is for demonstration purposes</p>
        </motion.div>
      </div>
    </div>
  )
}

/* Helper Components */

interface InsightCardProps {
  icon: string
  title: string
  description: string
  delay: number
}

function InsightCard({ icon, title, description, delay }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/20 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

interface FeatureItemProps {
  title: string
  items: string[]
}

function FeatureItem({ title, items }: FeatureItemProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
