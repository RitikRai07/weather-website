"use client"

import { useEffect, useState } from "react"
import { MapPin, X } from "lucide-react"
import { motion } from "framer-motion"

interface LocationPermissionProps {
  onLocationGranted?: (coords: { lat: number; lon: number }) => void
}

export function LocationPermission({ onLocationGranted }: LocationPermissionProps) {
  const [showPermission, setShowPermission] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hasAskedPermission = localStorage.getItem("weather_location_asked")
    if (!hasAskedPermission) {
      setShowPermission(true)
      localStorage.setItem("weather_location_asked", "true")
    }
  }, [])

  const handleAllowLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationGranted?.({ lat: latitude, lon: longitude })
          setShowPermission(false)
          setLoading(false)
          localStorage.setItem("user_location_approved", "true")
        },
        () => {
          setLoading(false)
          setShowPermission(false)
        },
      )
    }
  }

  const handleDeny = () => {
    setShowPermission(false)
    localStorage.setItem("user_location_approved", "false")
  }

  if (!showPermission) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <MapPin className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share your location</h3>
            </div>
          </div>
          <button onClick={handleDeny} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Get personalized weather information for your exact location
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Accurate local forecasts</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Precise weather alerts</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Saved for 24 hours only</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Allow access to your location to get personalized weather information. Your location will be saved to avoid
            asking for permission every time.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDeny}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
          >
            Not Now
          </button>
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Allow"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
