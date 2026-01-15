"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertCircle, Check, Loader2, Globe } from "lucide-react"
import { motion } from "framer-motion"
import {
  saveLocation,
  getSavedLocation,
  saveLocationPermission,
  getSavedLocationPermission,
  type SavedLocation,
} from "../services/location-service"

interface LocationManagerProps {
  onLocationSelected: (location: { lat: number; lon: number }) => void
}

export function LocationManager({ onLocationSelected }: LocationManagerProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Check for saved location
    const location = getSavedLocation()
    if (location) {
      setSavedLocation(location)
      onLocationSelected({ lat: location.lat, lon: location.lon })
      setStatus("success")
    }

    // Check for saved permission status
    const permission = getSavedLocationPermission()
    setPermissionStatus(permission)
  }, [onLocationSelected])

  const requestLocation = () => {
    setStatus("loading")
    setShowAnimation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Save location
          const locationData: SavedLocation = {
            lat: latitude,
            lon: longitude,
            timestamp: Date.now(),
          }

          saveLocation(locationData)
          setSavedLocation(locationData)

          // Save permission status
          saveLocationPermission("granted")
          setPermissionStatus("granted")

          // Notify parent component
          onLocationSelected({ lat: latitude, lon: longitude })

          setStatus("success")

          // Keep animation visible for a moment before hiding
          setTimeout(() => {
            setShowAnimation(false)
          }, 1500)
        },
        (error) => {
          console.error("Error getting location:", error)
          saveLocationPermission("denied")
          setPermissionStatus("denied")
          setStatus("error")
          setShowAnimation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setStatus("error")
      setShowAnimation(false)
    }
  }

  const clearSavedLocation = () => {
    localStorage.removeItem("weather_app_location")
    localStorage.removeItem("weather_app_location_permission")
    setSavedLocation(null)
    setPermissionStatus(null)
    setStatus("idle")
  }

  if (status === "success" && savedLocation) {
    return (
      <Card className="mb-6 border-none shadow-xl backdrop-blur-sm bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-2xl transition-all duration-500 transform hover:translate-y-[-3px]">
        <CardHeader className="pb-2 bg-gradient-to-r from-green-400/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-500/20">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-green-500" />
            Location Set
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">Using your saved location</p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                Weather data will be automatically loaded
              </p>
            </div>
          </div>
          {savedLocation.city && (
            <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">{savedLocation.city}</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">{savedLocation.country}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSavedLocation}
            className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 group transition-all duration-300"
          >
            <span className="relative">
              Clear Saved Location
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (status === "error" || permissionStatus === "denied") {
    return (
      <Card className="mb-6 border-none shadow-xl backdrop-blur-sm bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-900/30 dark:to-rose-900/30 hover:shadow-2xl transition-all duration-500 transform hover:translate-y-[-3px]">
        <CardHeader className="pb-2 bg-gradient-to-r from-red-400/10 to-rose-400/10 dark:from-red-500/20 dark:to-rose-500/20">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            Location Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">We couldn't access your location</p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">
                Please enable location services in your browser settings to get personalized weather information.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={requestLocation}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-none shadow-xl backdrop-blur-sm bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/30 dark:to-indigo-900/30 hover:shadow-2xl transition-all duration-500 transform hover:translate-y-[-3px]">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 dark:from-blue-500/20 dark:to-indigo-500/20">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-blue-500" />
          Location Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 overflow-hidden">
            {showAnimation ? (
              <motion.div
                className="absolute inset-0 bg-blue-500/20"
                animate={{
                  scale: [1, 1.5, 2, 2.5, 3],
                  opacity: [1, 0.8, 0.6, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            ) : null}
            <Globe className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">Share your location</p>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
              Get personalized weather information for your exact location
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            Allow access to your location to get personalized weather information. Your location will be saved to avoid
            asking for permission every time.
          </p>
          <div className="flex items-center text-xs text-blue-600/80 dark:text-blue-400/80">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            <span>Accurate local forecasts</span>
          </div>
          <div className="flex items-center text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            <span>Precise weather alerts</span>
          </div>
          <div className="flex items-center text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            <span>Saved for 24 hours only</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={requestLocation}
          disabled={status === "loading"}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Share My Location
              </>
            )}
          </span>
          <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Button>
      </CardFooter>
    </Card>
  )
}
