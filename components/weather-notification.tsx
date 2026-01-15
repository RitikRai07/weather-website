"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Bell, CloudLightning, Umbrella, Thermometer, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherNotificationProps {
  weatherData: any
  forecastData: any
}

export function WeatherNotification({ weatherData, forecastData }: WeatherNotificationProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState<{
    type: "warning" | "alert" | "info"
    title: string
    message: string
    icon: React.ReactNode
  } | null>(null)

  useEffect(() => {
    if (!weatherData || !forecastData) return

    // Check for extreme weather conditions
    const checkWeatherConditions = () => {
      const current = weatherData.current
      const forecast = forecastData.forecast.forecastday[0]

      // Check for extreme temperature
      if (current.temp_c > 35) {
        return {
          type: "warning" as const,
          title: "Extreme Heat Warning",
          message: `Temperature is ${Math.round(current.temp_c)}°C. Stay hydrated and avoid prolonged sun exposure.`,
          icon: <Thermometer className="h-5 w-5 text-red-500" />,
        }
      }

      // Check for heavy rain
      if (current.precip_mm > 10 || forecast.day.daily_chance_of_rain > 80) {
        return {
          type: "alert" as const,
          title: "Heavy Rain Alert",
          message: `High chance of rain (${forecast.day.daily_chance_of_rain}%). Consider bringing an umbrella.`,
          icon: <Umbrella className="h-5 w-5 text-blue-500" />,
        }
      }

      // Check for strong winds
      if (current.wind_kph > 40) {
        return {
          type: "warning" as const,
          title: "Strong Wind Advisory",
          message: `Wind speeds of ${Math.round(current.wind_kph)} km/h. Secure loose objects outdoors.`,
          icon: <Wind className="h-5 w-5 text-amber-500" />,
        }
      }

      // Check for thunderstorms
      if (
        current.condition.text.toLowerCase().includes("thunder") ||
        forecast.day.condition.text.toLowerCase().includes("thunder")
      ) {
        return {
          type: "alert" as const,
          title: "Thunderstorm Alert",
          message: "Thunderstorms expected. Stay indoors and avoid open areas.",
          icon: <CloudLightning className="h-5 w-5 text-purple-500" />,
        }
      }

      // Check for UV index
      if (current.uv >= 8) {
        return {
          type: "info" as const,
          title: "High UV Index",
          message: `UV index is ${current.uv}. Use sunscreen and wear protective clothing.`,
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        }
      }

      return null
    }

    const weatherAlert = checkWeatherConditions()

    if (weatherAlert) {
      setNotification(weatherAlert)

      // Show notification after a short delay
      const timer = setTimeout(() => {
        setShowNotification(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [weatherData, forecastData])

  return (
    <AnimatePresence>
      {showNotification && notification && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div
            className={`
            rounded-lg shadow-lg p-4 pr-10 backdrop-blur-md border
            ${
              notification.type === "warning"
                ? "bg-amber-50/90 border-amber-200 dark:bg-amber-900/80 dark:border-amber-700"
                : notification.type === "alert"
                  ? "bg-red-50/90 border-red-200 dark:bg-red-900/80 dark:border-red-700"
                  : "bg-blue-50/90 border-blue-200 dark:bg-blue-900/80 dark:border-blue-700"
            }
          `}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
              onClick={() => setShowNotification(false)}
            >
              <X className="h-3 w-3" />
            </Button>

            <div className="flex items-start gap-3">
              <div
                className={`
                rounded-full p-2 flex-shrink-0
                ${
                  notification.type === "warning"
                    ? "bg-amber-100 dark:bg-amber-800"
                    : notification.type === "alert"
                      ? "bg-red-100 dark:bg-red-800"
                      : "bg-blue-100 dark:bg-blue-800"
                }
              `}
              >
                {notification.icon}
              </div>

              <div>
                <h3
                  className={`font-medium text-sm mb-1
                  ${
                    notification.type === "warning"
                      ? "text-amber-800 dark:text-amber-300"
                      : notification.type === "alert"
                        ? "text-red-800 dark:text-red-300"
                        : "text-blue-800 dark:text-blue-300"
                  }
                `}
                >
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs h-7 px-2
                  ${
                    notification.type === "warning"
                      ? "text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-800/50"
                      : notification.type === "alert"
                        ? "text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/50"
                        : "text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/50"
                  }
                `}
                onClick={() => setShowNotification(false)}
              >
                <Bell className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
