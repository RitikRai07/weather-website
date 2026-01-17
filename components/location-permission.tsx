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
    // Check if location permission has been asked before
    const hasAskedPermission = localStorage.getItem("weather_location_asked")

    if (!hasAskedPermission) {
      // Only show once
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
          // Store approved location
          localStorage.setItem("user_location_approved", "true")
        },
        (error) => {
          console.error("Geolocation error:", error)
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <MapPin className="text-white" size={24} />
            </div>
            <h3 className="text-white text-xl font-bold">Allow Location Access</h3>
          </div>
          <button onClick={handleDeny} className="text-white/60 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <p className="text-white/90 mb-6">We need your location to provide accurate weather forecasts for your area.</p>

        <div className="flex gap-3">
          <button
            onClick={handleDeny}
            className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition font-medium"
          >
            Not Now
          </button>
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Allow"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
