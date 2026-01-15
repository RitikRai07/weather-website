"use client"

import { useState, useEffect } from "react"
import { EnhancedTimeDisplay } from "./enhanced-time-display"
import { EnhancedEarthVisualization } from "./enhanced-earth-visualization"
import { Card } from "@/components/ui/card"

interface WeatherTimeEarthDisplayProps {
  sunrise: string
  sunset: string
  weatherCondition?: string
  temperature?: number
  humidity?: number
  windSpeed?: number
}

export function WeatherTimeEarthDisplay({
  sunrise,
  sunset,
  weatherCondition = "clear",
  temperature,
  humidity = 60,
  windSpeed = 10,
}: WeatherTimeEarthDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <EnhancedTimeDisplay
        weatherCondition={weatherCondition}
        temperature={temperature}
        humidity={humidity}
        windSpeed={windSpeed}
      />

      <Card className="overflow-hidden border-none shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] transition-all duration-500 rounded-2xl">
        <EnhancedEarthVisualization
          sunrise={sunrise}
          sunset={sunset}
          currentTime={formatCurrentTime()}
          weatherCondition={weatherCondition}
          temperature={temperature}
        />
      </Card>
    </div>
  )
}
