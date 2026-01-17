"use client"

import { Calendar } from "@/components/ui/calendar"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MapPin,
  Moon,
  Sun,
  Heart,
  Clock,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Thermometer,
  Wind,
  Droplets,
  Umbrella,
  Compass,
  Menu,
  Settings,
  Play,
  Cloud,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { WeatherIcon } from "@/components/weather-icon"
import { AboutSection } from "@/components/about-section"
// import { LoginPage } from "@/components/login-page" // Removed import
import { WeatherAlerts } from "@/components/weather-alerts"
import { EnhancedLandingPage } from "@/components/enhanced-landing-page"
import { WeatherMap } from "@/components/weather-map"
import { WeatherNewsAlerts } from "@/components/weather-news-alerts"
import { RealTimeClock } from "@/components/real-time-clock"
import { useToast } from "@/hooks/use-toast"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { VisitorCounter } from "@/components/visitor-counter"
import { UserProfile } from "@/components/user-profile"
import { WeatherRadar } from "@/components/weather-radar"
import { WeatherNotification } from "@/components/weather-notification"
import { UserPreferences } from "@/components/user-preferences"
import { PushNotificationManager } from "@/components/push-notification-manager"
import { WeatherVideoModal } from "@/components/weather-video-modal"
import { LocationManager } from "@/components/location-manager"
import { CategoryStats } from "@/components/category-stats"
import { WeatherNews } from "@/components/weather-news"
import { EnhancedDayNightCycle } from "@/components/enhanced-day-night-cycle"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
// Add the new components to the imports at the top of the file
import { TemperatureDisplay } from "@/components/temperature-display"
import { ForecastTimeline } from "@/components/forecast-timeline"
import { EnhancedLocationDisplay } from "@/components/enhanced-location-display"
import { WeatherComparison } from "@/components/weather-comparison"
import { LocationPermission } from "@/components/location-permission"
import { EnhancedClockDisplay } from "@/components/enhanced-clock-display"
// Add the new imports at the top of the file
// These will be added back as proper working versions

// Weather interfaces
interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    localtime: string
    localtime_epoch: number
    lat: number
    lon: number
    tz_id?: string // Added for EnhancedLocationDisplay
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
    wind_mph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number
    air_quality?: {
      co: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      "us-epa-index": number
      "gb-defra-index": number
    }
  }
}

interface ForecastData {
  location: {
    name: string
    region: string
    country: string
    localtime: string
    localtime_epoch: number
    lat: number
    lon: number
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
      code: number
    }
  }
  forecast: {
    forecastday: Array<{
      date: string
      date_epoch: number
      day: {
        maxtemp_c: number
        maxtemp_f: number
        mintemp_c: number
        mintemp_f: number
        avgtemp_c: number
        avgtemp_f: number
        maxwind_mph: number
        maxwind_kph: number
        totalprecip_mm: number
        totalprecip_in: number
        totalsnow_cm: number
        avgvis_km: number
        avgvis_miles: number
        avghumidity: number
        daily_will_it_rain: number
        daily_chance_of_rain: number
        daily_will_it_snow: number
        daily_chance_of_snow: number
        condition: {
          text: string
          icon: string
          code: number
        }
        uv: number
      }
      astro: {
        sunrise: string
        sunset: string
        moonrise: string
        moonset: string
        moon_phase: string
        moon_illumination: string
      }
      hour: Array<{
        time_epoch: number
        time: string
        temp_c: number
        temp_f: number
        condition: {
          text: string
          icon: string
          code: number
        }
        wind_mph: number
        wind_kph: number
        wind_degree: number
        wind_dir: string
        pressure_mb: number
        pressure_in: number
        precip_mm: number
        precip_in: number
        humidity: number
        cloud: number
        feelslike_c: number
        feelslike_f: number
        windchill_c: number
        windchill_f: number
        heatindex_c: number
        heatindex_f: number
        dewpoint_c: number
        dewpoint_f: number
        will_it_rain: number
        chance_of_rain: number
        will_it_snow: number
        chance_of_snow: number
        vis_km: number
        vis_miles: number
        gust_mph: number
        gust_kph: number
        uv: number
      }>
    }>
  }
  alerts?: {
    alert: Array<{
      headline: string
      severity: "moderate" | "severe" | "extreme"
      urgency: string
      areas: string
      category: string
      certainty: string
      event: string
      note: string
      effective: string
      expires: string
      desc: string
      instruction: string
    }>
  }
}

// Search suggestion interface
interface SearchSuggestion {
  id: number
  name: string
  region: string
  country: string
  lat: number
  lon: number
  url: string
}

// Mock weather alerts for demonstration
const mockAlerts = [
  {
    id: "1",
    headline: "Heat Advisory",
    severity: "moderate" as const,
    description:
      "A Heat Advisory means that a period of hot temperatures is expected. The combination of hot temperatures and high humidity will create a situation in which heat illnesses are possible.",
    effective: new Date().toISOString(),
    expires: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
  },
  {
    id: "2",
    headline: "Thunderstorm Warning",
    severity: "severe" as const,
    description:
      "The National Weather Service has issued a Thunderstorm Warning for this area. Seek shelter immediately. Avoid windows and electrical appliances.",
    effective: new Date().toISOString(),
    expires: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
  },
]

// State for saved locations in comparison
interface SavedLocation {
  id: string
  name: string
  country: string
  temp: number
  condition: string
  iconUrl?: string // Added for potential future use
}

export default function WeatherApp() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [weatherDataNew, setWeatherDataNew] = useState<WeatherData | null>(null) // Adjusted type
  const [newsItems, setNewsItems] = useState([])
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLocationLoading, setInitialLocationLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showAbout, setShowAbout] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  // const [showLogin, setShowLogin] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [showProfile, setShowProfile] = useState(false)
  const [showUserPreferences, setShowUserPreferences] = useState<boolean>(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  // Add this state variable inside the WeatherApp component
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  // Add a new state for weather comparison
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonLocations, setComparisonLocations] = useState<SavedLocation[]>([]) // Use SavedLocation type
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]) // State for saved locations
  const [newsData, setNewsData] = useState([]) // State for fetched news data
  const [searchQuery, setSearchQuery] = useState<string>("") // State for the search query

  const searchRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useOnClickOutside(searchRef, () => setShowSuggestions(false))

  // Load favorites, history, and search count from localStorage on component mount
  // and automatically detect user's location
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites")
    const savedHistory = localStorage.getItem("weatherHistory")
    const savedSearchCount = localStorage.getItem("weatherSearchCount")
    const savedUnit = localStorage.getItem("weatherUnit")
    const savedLocations = localStorage.getItem("weatherSavedLocations") // Load saved locations

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }

    if (savedSearchCount) {
      setSearchCount(Number.parseInt(JSON.parse(savedSearchCount)))
    }

    if (savedUnit) {
      setUnit(JSON.parse(savedUnit))
    }

    if (savedLocations) {
      setSavedLocations(JSON.parse(savedLocations)) // Parse and set saved locations
    }

    // Use IP-based location instead of geolocation
    setInitialLocationLoading(true)
    fetchIPBasedLocation(true)
  }, [])

  // Save favorites, history, and search count to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem("weatherSearchCount", JSON.stringify(searchCount))
  }, [searchCount])

  useEffect(() => {
    localStorage.setItem("weatherUnit", JSON.stringify(unit))
  }, [unit])

  useEffect(() => {
    localStorage.setItem("weatherSavedLocations", JSON.stringify(savedLocations)) // Save locations
  }, [savedLocations])

  // Fetch search suggestions when city input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setSearchLoading(true)
      try {
        const apiKey = "68ae5ecd826a46278fd60435252403"
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`)

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (err) {
        console.error("Error fetching suggestions:", err)
      } finally {
        setSearchLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      if (city.trim()) {
        fetchSuggestions()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [city])

  // Function to fetch current weather
  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError("")
    try {
      // Using the WeatherAPI.com endpoint
      const apiKey = "68ae5ecd826a46278fd60435252403" // Using the provided API key
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=yes`)

      if (!response.ok) {
        throw new Error("City not found. Please check the spelling and try again.")
      }

      const data = await response.json()
      setWeather(data)

      // Fetch forecast data with alerts
      const forecastResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=7&aqi=yes&alerts=yes`,
      )

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available")
      }

      const forecastData = await forecastResponse.json()
      setForecast(forecastData)

      // Add to search history if not already in favorites
      if (!favorites.includes(cityName) && cityName.trim() !== "") {
        const newHistory = [cityName, ...searchHistory.filter((item) => item !== cityName)].slice(0, 5)
        setSearchHistory(newHistory)
      }

      // Increment search count
      setSearchCount((prevCount) => prevCount + 1)

      // Set active tab to today
      setActiveTab("today")

      // Hide suggestions
      setShowSuggestions(false)

      // Show extras after successful search
      setShowExtras(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch weather data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setInitialLocationLoading(false)
    }
  }

  // Improve the getUserLocation function for better accuracy
  // Replace the getUserLocation function with this improved version:

  // Get user's location
  const getUserLocation = (isInitialLoad = false) => {
    if (navigator.geolocation) {
      if (isInitialLoad) {
        setInitialLocationLoading(true)
      } else {
        setLoading(true)
        toast({
          title: "Detecting location",
          description: "Please allow location access when prompted",
        })
      }

      const geolocationOptions = {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              const apiKey = "68ae5ecd826a46278fd60435252403"
              const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=yes`,
                {
                  cache: "no-store",
                  headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                  },
                },
              )

              if (!response.ok) {
                throw new Error("Location data not available")
              }

              const data = await response.json()
              setCity(data.location.name)
              setWeather(data)

              // Fetch forecast data with alerts
              const forecastResponse = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=yes&alerts=yes`,
                {
                  cache: "no-store",
                  headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                  },
                },
              )

              if (!forecastResponse.ok) {
                throw new Error("Forecast data not available")
              }

              const forecastData = await forecastResponse.json()
              setForecast(forecastData)

              // Add to search history
              if (!favorites.includes(data.location.name) && data.location.name.trim() !== "") {
                const newHistory = [
                  data.location.name,
                  ...searchHistory.filter((item) => item !== data.location.name),
                ].slice(0, 5)
                setSearchHistory(newHistory)
              }

              // Increment search count if not initial load
              if (!isInitialLoad) {
                setSearchCount((prevCount) => prevCount + 1)
              }

              // Show extras after successful location detection
              setShowExtras(true)

              setLoading(false)
              setInitialLocationLoading(false)

              // Show success toast for location detection
              toast({
                title: "Location detected",
                description: `Showing weather for ${data.location.name}`,
              })
            } catch (err) {
              console.error("Error fetching location data:", err)
              setError(err instanceof Error ? err.message : "Failed to fetch location data")
              if (!isInitialLoad) {
                toast({
                  title: "Error",
                  description: err instanceof Error ? err.message : "Failed to fetch location data",
                  variant: "destructive",
                })
              }
              setLoading(false)
              setInitialLocationLoading(false)

              // Fallback to IP-based location if geolocation fails
              fetchIPBasedLocation(isInitialLoad)
            }
          },
          (error) => {
            console.error("Geolocation error:", error.code, error.message)
            setLoading(false)
            setInitialLocationLoading(false)
            fetchIPBasedLocation(isInitialLoad)
          },
          geolocationOptions,
        )
      } catch (err) {
        console.error("Geolocation API error:", err)
        setLoading(false)
        setInitialLocationLoading(false)
        fetchIPBasedLocation(isInitialLoad)
      }
    } else {
      setInitialLocationLoading(false)
      fetchIPBasedLocation(isInitialLoad)
    }
  }

  // Improve the IP-based location detection
  // Replace the fetchIPBasedLocation function with this improved version:

  const fetchIPBasedLocation = async (isInitialLoad = false) => {
    try {
      if (!isInitialLoad) {
        toast({
          title: "Using IP-based location",
          description: "Detecting your location based on your IP address...",
        })
      }

      // Try multiple IP geolocation services for better reliability
      // First try a more reliable IP geolocation service
      const response = await fetch("https://ipinfo.io/json", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to detect location by IP using ipinfo.io")
      }

      const data = await response.json()

      if (!data || !data.city) {
        throw new Error("Invalid location data received from ipinfo.io")
      }

      const locationName = data.city
      setCity(locationName)
      fetchWeather(locationName)

      if (!isInitialLoad) {
        toast({
          title: "Location detected",
          description: `Showing weather for ${locationName}`,
        })
      }
    } catch (err) {
      console.error("IP location error:", err)

      try {
        // Fallback to WeatherAPI IP endpoint
        const apiKey = "68ae5ecd826a46278fd60435252403"
        const fallbackResponse = await fetch(`https://api.weatherapi.com/v1/ip.json?key=${apiKey}&q=auto:ip`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (!fallbackResponse.ok) {
          throw new Error("Failed to detect location using WeatherAPI")
        }

        const fallbackData = await fallbackResponse.json()

        if (!fallbackData || !fallbackData.city) {
          throw new Error("Invalid location data from WeatherAPI")
        }

        setCity(fallbackData.city)
        fetchWeather(fallbackData.city)

        if (!isInitialLoad) {
          toast({
            title: "Location detected",
            description: `Showing weather for ${fallbackData.city}`,
          })
        }
      } catch (fallbackErr) {
        console.error("Fallback IP location error:", fallbackErr)

        try {
          // Try another fallback service
          const thirdFallbackResponse = await fetch("https://geolocation-db.com/json/", {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          })

          if (!thirdFallbackResponse.ok) {
            throw new Error("Failed to detect location using third fallback service")
          }

          const thirdFallbackData = await thirdFallbackResponse.json()

          if (!thirdFallbackData || !thirdFallbackData.city) {
            throw new Error("Invalid location data from third fallback service")
          }

          setCity(thirdFallbackData.city)
          fetchWeather(thirdFallbackData.city)

          if (!isInitialLoad) {
            toast({
              title: "Location detected",
              description: `Showing weather for ${thirdFallbackData.city}`,
            })
          }
        } catch (thirdFallbackErr) {
          console.error("Third fallback IP location error:", thirdFallbackErr)

          // Final fallback - use a default city
          setError("Failed to detect your location. Showing default location.")
          setCity("New Delhi")
          fetchWeather("New Delhi")

          toast({
            title: "Location detection failed",
            description: "Showing weather for New Delhi. Please search for your city manually.",
            variant: "destructive",
          })

          setLoading(false)
          setInitialLocationLoading(false)
        }
      }
    }
  }

  const fetchWeatherDataNew = async (lat: number, lon: number) => {
    try {
      const apiKey = "68ae5ecd826a46278fd60435252403"
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data: WeatherData = await response.json()
      setWeatherDataNew(data)
    } catch (err) {
      console.error("Error fetching weather data:", err)
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchNewsData = async () => {
    try {
      const response = await fetch(
        "https://api.weatherapi.com/v1/alerts.json?key=68ae5ecd826a46278fd60435252403&q=auto:ip",
      )

      if (!response.ok) {
        throw new Error("Failed to fetch alerts")
      }

      const data = await response.json()
      setNewsData(data.alerts?.alerts || [])
    } catch (err) {
      console.error("Error fetching news data:", err)
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (location) {
      fetchWeatherDataNew(location.lat, location.lon)
    }

    fetchNewsData()
  }, [location]) // Re-fetch news when location changes

  const handleLocationSelected = (coords: { lat: number; lon: number }) => {
    setLocation(coords)
  }

  const handleNotificationPermissionChange = (permission: NotificationPermission) => {
    setNotificationPermission(permission)
  }

  // Handler for granted location
  const handleLocationGranted = (coords: { lat: number; lon: number }) => {
    // Fetch weather for the granted location
    setSearchQuery(`${coords.lat},${coords.lon}`)
    // Trigger weather fetch by setting the city based on coordinates
    const fetchCityFromCoords = async () => {
      try {
        const apiKey = "68ae5ecd826a46278fd60435252403"
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coords.lat},${coords.lon}&aqi=yes`,
        )
        if (!response.ok) {
          throw new Error("Failed to get city name from coordinates")
        }
        const data = await response.json()
        setCity(data.location.name)
        fetchWeather(data.location.name)
      } catch (error) {
        console.error("Error fetching city from coordinates:", error)
        toast({
          title: "Error",
          description: "Could not determine city name from your location.",
          variant: "destructive",
        })
      }
    }
    fetchCityFromCoords()
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setCity(suggestion.name)
    fetchWeather(suggestion.name)
  }

  // Add to favorites
  const addToFavorites = (cityName: string) => {
    if (!favorites.includes(cityName)) {
      const newFavorites = [...favorites, cityName]
      setFavorites(newFavorites)
      localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites))

      toast({
        title: "Added to favorites",
        description: `${cityName} has been added to your favorites.`,
      })
    }
  }

  // Remove from favorites
  const removeFromFavorites = (cityName: string) => {
    const newFavorites = favorites.filter((fav) => fav !== cityName)
    setFavorites(newFavorites)
    localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites))

    toast({
      title: "Removed from favorites",
      description: `${cityName} has been removed from your favorites.`,
    })
  }

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([])
    toast({
      title: "History cleared",
      description: "Your search history has been cleared.",
    })
  }

  // Toggle temperature unit
  const toggleUnit = () => {
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"))
    toast({
      title: `Temperature unit changed`,
      description: `Switched to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`,
    })
  }

  // Get day name from timestamp
  const getDayName = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "long" })
  }

  // Get date from timestamp
  const getDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Get time from timestamp
  const getTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  // Filter forecast data to get one entry per day
  const getDailyForecast = () => {
    if (!forecast || !forecast.forecast) return []
    return forecast.forecast.forecastday
  }

  // Get hourly forecast for today
  const getHourlyForecast = () => {
    if (!forecast || !forecast.forecast || !forecast.forecast.forecastday[0]) return []

    const currentHour = new Date().getHours()
    return forecast.forecast.forecastday[0].hour
      .filter((hour) => {
        const hourTime = new Date(hour.time).getHours()
        return hourTime >= currentHour
      })
      .slice(0, 8)
  }

  // Get weather condition for background
  const getWeatherCondition = () => {
    if (!weather) return "clear"

    const code = weather.current.condition.code

    // WeatherAPI.com condition codes
    if (code === 1000) return "clear" // Sunny/Clear
    if (code >= 1003 && code <= 1030) return "clouds" // Cloudy conditions
    if (code >= 1063 && code <= 1069) return "rain" // Rain
    if (code >= 1114 && code <= 1117) return "snow" // Snow
    if (code >= 1135 && code <= 1147) return "atmosphere" // Fog, mist, etc.
    if (code >= 1150 && code <= 1201) return "rain" // More rain conditions
    if (code >= 1204 && code <= 1237) return "snow" // More snow conditions
    if (code >= 1273 && code <= 1282) return "thunderstorm" // Thunderstorm

    return "clear"
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    toast({
      title: `${theme === "dark" ? "Light" : "Dark"} mode activated`,
      description: `Switched to ${theme === "dark" ? "light" : "dark"} mode.`,
    })
  }

  // Check if city is in favorites
  const isFavorite = (cityName: string) => {
    return favorites.includes(cityName)
  }

  // Add helper function for AQI color and text
  const getAqiColor = (index: number) => {
    switch (index) {
      case 1:
        return "text-green-500"
      case 2:
        return "text-yellow-500"
      case 3:
        return "text-orange-500"
      case 4:
        return "text-red-500"
      case 5:
        return "text-purple-500"
      case 6:
        return "text-rose-800"
      default:
        return "text-gray-500"
    }
  }

  const getAqiText = (index: number) => {
    switch (index) {
      case 1:
        return "Good"
      case 2:
        return "Moderate"
      case 3:
        return "Unhealthy for sensitive groups"
      case 4:
        return "Unhealthy"
      case 5:
        return "Very Unhealthy"
      case 6:
        return "Hazardous"
      default:
        return "Unknown"
    }
  }

  // Get health recommendations based on AQI
  const getAqiRecommendation = (index: number) => {
    switch (index) {
      case 1:
        return "Air quality is considered satisfactory, and air pollution poses little or no risk."
      case 2:
        return "Air quality is acceptable; however, there may be some health concerns for a small number of people who are unusually sensitive to air pollution."
      case 3:
        return "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
      case 4:
        return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
      case 5:
        return "Health warnings of emergency conditions. The entire population is more likely to be affected."
      case 6:
        return "Health alert: everyone may experience more serious health effects. Avoid outdoor activities."
      default:
        return "No data available."
    }
  }

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number) => {
    return (celsius * 9) / 5 + 32
  }

  // Format temperature based on selected unit
  const formatTemperature = (celsius: number) => {
    if (unit === "celsius") {
      return `${Math.round(celsius)}°C`
    } else {
      return `${Math.round(celsiusToFahrenheit(celsius))}°F`
    }
  }

  // Add a function to open the video modal
  const openVideoModal = (videoId: string | null = null) => {
    setSelectedVideoId(videoId)
    setShowVideoModal(true)
  }

  const addLocation = async (query: string) => {
    try {
      const apiKey = "68ae5ecd826a46278fd60435252403"
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)

      if (!response.ok) {
        throw new Error("Failed to search locations")
      }

      const searchResults = await response.json()

      if (searchResults.length === 0) {
        toast({
          title: "Not Found",
          description: "Location not found. Please try another search.",
          variant: "destructive",
        })
        return
      }

      // Fetch weather for the first result
      const location = searchResults[0]
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.lat},${location.lon}&aqi=yes`,
      )

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather")
      }

      const weatherData: WeatherData = await weatherResponse.json()

      const newLocation: SavedLocation = {
        // Use SavedLocation type
        id: `${location.lat}-${location.lon}`,
        name: `${location.name}, ${location.country}`,
        country: location.country,
        temp: Math.round(weatherData.current.temp_c),
        condition: weatherData.current.condition.text,
        iconUrl: weatherData.current.condition.icon, // Store icon URL
      }

      setSavedLocations((prev) => [...prev, newLocation])
      toast({
        title: "Added",
        description: `${newLocation.name} has been added to your saved locations.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add location",
        variant: "destructive",
      })
    }
  }

  // Add a function to remove locations from comparison
  const removeLocationFromComparison = (id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id))
  }

  // Add a function to refresh comparison data
  const refreshComparisonData = async () => {
    const refreshedLocations = await Promise.all(
      savedLocations.map(async (loc) => {
        try {
          const [lat, lon] = loc.id.split("-").map(Number) // Extract lat/lon from id
          const apiKey = "68ae5ecd826a46278fd60435252403"
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`,
            {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            },
          )
          if (!response.ok) throw new Error("Failed to fetch data")
          const data: WeatherData = await response.json()
          return {
            ...loc,
            temp: Math.round(data.current.temp_c),
            condition: data.current.condition.text,
            iconUrl: data.current.condition.icon,
          }
        } catch (error) {
          console.error(`Error refreshing data for ${loc.name}:`, error)
          return loc // Return original location if refresh fails
        }
      }),
    )
    setSavedLocations(refreshedLocations)
  }

  // If we're still loading the initial location, show a loading screen
  if (initialLocationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800/50 transform transition-all">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse-glow-enhanced flex items-center justify-center">
                <Cloud className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Weather App
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">Preparing your personalized weather experience...</p>
          <div className="w-full bg-blue-100 dark:bg-blue-900/30 h-3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-shimmer-enhanced"></div>
          </div>
        </div>
      </div>
    )
  }

  // If no weather data is loaded yet, show the landing page
  if (!weather) {
    return (
      <>
        <LocationPermission onLocationGranted={handleLocationGranted} />

        <EnhancedLandingPage
          onSearch={(cityName) => fetchWeather(cityName)}
          onUseLocation={() => getUserLocation()}
          isLocating={loading}
        />

        {/* Loading state */}
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                  <MapPin className="h-8 w-8 opacity-70" />
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4">Fetching weather data...</h2>
              <p className="text-muted-foreground mt-2">This will only take a moment</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-md text-center">
              <X className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p className="mb-4">{error}</p>
              <p className="text-sm mb-4">Please try another city or check your connection.</p>
              <Button
                onClick={() => setError("")}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* About modal */}
        <AnimatePresence>{showAbout && <AboutSection onClose={() => setShowAbout(false)} />}</AnimatePresence>

        {/* Login modal */}
        {/* <AnimatePresence>
          {showLogin && (
            <LoginPage
              onClose={() => setShowLogin(false)}
              onLogin={() => {
                setIsLoggedIn(true)
                setShowLogin(false)
              }}
            />
          )}
        </AnimatePresence> */}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Weather Forecast
            </h1>
            <div className="hidden md:block transform hover:scale-105 transition-transform">
              <EnhancedClockDisplay showSeconds={true} />
            </div>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUserPreferences(true)}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleUnit}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 bg-transparent"
            >
              <span className="text-xs font-bold">{unit === "celsius" ? "°F" : "°C"}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAbout(true)}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogin(true)}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <User className="h-4 w-4 mr-1" />
              Login
            </Button> */}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <div className="transform hover:scale-105 transition-transform">
              <RealTimeClock />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUserPreferences(true)}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardContent className="p-4">
              <LocationManager onLocationSelected={handleLocationSelected} />
              <div ref={searchRef} className="relative">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
                    <Input
                      type="text"
                      placeholder="Enter city name..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="relative pr-10 h-12 text-lg border-2 border-blue-100 dark:border-blue-900/50 focus-visible:ring-blue-500 pl-12 rounded-xl transition-all shadow-sm group-hover:shadow-md bg-white/90 dark:bg-gray-900/90"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 dark:text-blue-500" />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl h-12 px-6 transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center">
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-white scale-0 group-hover:scale-100 transition-transform origin-center rounded-lg z-0 opacity-10"></span>
                    </Button>
                  </div>
                </form>

                {/* Search suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/50 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between border-b border-blue-50 dark:border-blue-900/20 last:border-0 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{suggestion.name}</span>
                          <span className="text-muted-foreground text-sm ml-2 text-gray-500 dark:text-gray-400">
                            {suggestion.region}, {suggestion.country}
                          </span>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-blue-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Favorites and History toggles */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="text-xs flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-900/30 px-4"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 mr-1.5 ${showFavorites ? "fill-red-500 text-red-500" : "text-red-500"}`}
                    />
                    Favorites
                    {showFavorites ? (
                      <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-900/30 px-4"
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                    History
                    {showHistory ? (
                      <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExtras(!showExtras)}
                    className="text-xs flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-900/30 px-4 ml-auto"
                  >
                    <Compass className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                    {showExtras ? "Hide Extras" : "Show Extras"}
                    {showExtras ? (
                      <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                    )}
                  </Button>
                </div>

                {/* Favorites list */}
                <AnimatePresence>
                  {showFavorites && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50/30 dark:from-blue-900/30 dark:to-purple-900/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30 shadow-inner">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Your Favorite Locations
                          </span>
                        </h3>
                        {favorites.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {favorites.map((fav, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-white/80 dark:bg-gray-800/80 rounded-full px-3 py-1.5 text-sm shadow-sm hover:shadow-md transition-all border border-blue-100/50 dark:border-blue-900/30 group"
                              >
                                <button
                                  onClick={() => {
                                    setCity(fav)
                                    fetchWeather(fav)
                                  }}
                                  className="mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                >
                                  {fav}
                                </button>
                                <button
                                  onClick={() => removeFromFavorites(fav)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              No favorites yet. Add cities to your favorites for quick access.
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                              Click the heart icon next to a city name to add it to your favorites.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search history */}
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/30 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30 shadow-inner">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                              Recent Searches
                            </span>
                          </h3>
                          {searchHistory.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearHistory}
                              className="text-xs h-7 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 rounded-full px-3"
                            >
                              <X className="h-3.5 w-3.5 mr-1.5" />
                              Clear
                            </Button>
                          )}
                        </div>
                        {searchHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {searchHistory.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-white/80 dark:bg-gray-800/80 rounded-full px-4 py-1.5 text-sm shadow-sm hover:shadow-md transition-all border border-blue-100/50 dark:border-blue-900/30 group"
                              >
                                <button
                                  onClick={() => {
                                    setCity(item)
                                    fetchWeather(item)
                                  }}
                                  className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5"
                                >
                                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                                  {item}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              No search history yet. Search for a city to see it here.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Loading state */}
        {loading && (
          <motion.div
            className="flex justify-center my-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/50"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-blue-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
        {/* Weather data */}
        {!loading && weather && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dashboard page */}
            {!loading && weather && forecast && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-blue-100 dark:border-blue-900/50 shadow-lg rounded-xl">
                  <CardContent className="p-0">
                    <EnhancedDashboard
                      weatherData={weather}
                      forecastData={forecast}
                      username={
                        typeof window !== "undefined"
                          ? (() => {
                              const user = JSON.parse(localStorage.getItem("weatherCurrentUser") || "{}")
                              return user.name || "User"
                            })()
                          : "User"
                      }
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Weather Alerts */}
            {forecast?.alerts?.alert && forecast.alerts.alert.length > 0 && (
              <div className="mb-4 flex justify-center">
                <WeatherAlerts
                  location={weather.location.name}
                  alerts={forecast.alerts.alert} // Use actual alerts from forecast
                />
              </div>
            )}

            {/* Current Weather */}
            <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-blue-100 dark:border-blue-900/50 shadow-lg">
              <CardContent className="p-0">
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <h2 className="text-3xl font-bold">
                          {weather.location.name}, {weather.location.country}
                        </h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                          onClick={() =>
                            isFavorite(weather.location.name)
                              ? removeFromFavorites(weather.location.name)
                              : addToFavorites(weather.location.name)
                          }
                        >
                          <Heart
                            className={`h-4 w-4 ${isFavorite(weather.location.name) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                          />
                        </Button>
                      </div>
                      <p className="text-xl">{weather.current.condition.text}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(weather.location.localtime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {" • "}
                        <span className="text-blue-500 dark:text-blue-400">Updated just now</span>
                      </p>
                    </div>
                    <div className="flex items-center bg-white/30 dark:bg-black/20 p-3 rounded-2xl shadow-inner">
                      <WeatherIcon
                        iconUrl={weather.current.condition.icon}
                        description={weather.current.condition.text}
                        size="large"
                      />
                      <div className="text-5xl font-bold ml-2">{formatTemperature(weather.current.temp_c)}</div>
                    </div>
                  </div>
                </div>

                {/* Replace the weather metrics section with this improved version */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/20">
                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-white/90 to-orange-50/80 dark:from-gray-800/90 dark:to-orange-900/20 border border-orange-100 dark:border-orange-900/30 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-orange-200/50 dark:bg-orange-700/20 rounded-full"></div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mr-3">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Feels Like</p>
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {formatTemperature(weather.current.feelslike_c)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-orange-100 dark:bg-orange-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(0, (weather.current.feelslike_c / 50) * 100))}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                          {weather.current.feelslike_c > weather.current.temp_c
                            ? "Feels warmer than actual"
                            : weather.current.feelslike_c < weather.current.temp_c
                              ? "Feels cooler than actual"
                              : "Matches actual temperature"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-white/90 to-blue-50/80 dark:from-gray-800/90 dark:to-blue-900/20 border border-blue-100 dark:border-blue-900/30 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-blue-200/50 dark:bg-blue-700/20 rounded-full"></div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                          <Droplets className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Humidity</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {weather.current.humidity}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                            style={{ width: `${weather.current.humidity}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                          {weather.current.humidity > 70
                            ? "High humidity"
                            : weather.current.humidity < 30
                              ? "Low humidity"
                              : "Moderate humidity"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-white/90 to-purple-50/80 dark:from-gray-800/90 dark:to-purple-900/20 border border-purple-100 dark:border-purple-900/30 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-purple-200/50 dark:bg-purple-700/20 rounded-full"></div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                          <Wind className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Wind</p>
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              {Math.round(weather.current.wind_kph)}
                            </p>
                            <p className="text-xs ml-1 text-purple-500 dark:text-purple-400">km/h</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(0, (weather.current.wind_kph / 100) * 100))}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                          <Compass className="h-3 w-3 mr-1" />
                          <span>
                            {weather.current.wind_dir} ({weather.current.wind_degree}°)
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-white/90 to-green-50/80 dark:from-gray-800/90 dark:to-green-900/20 border border-green-100 dark:border-green-900/30 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-green-200/50 dark:bg-green-700/20 rounded-full"></div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
                          <Sun className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium">UV Index</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">{weather.current.uv}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-amber-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(0, (weather.current.uv / 11) * 100))}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                          {weather.current.uv >= 8
                            ? "Very high - protection needed"
                            : weather.current.uv >= 6
                              ? "High - protection needed"
                              : weather.current.uv >= 3
                                ? "Moderate - protection advised"
                                : "Low - minimal protection needed"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sunrise/Sunset section - will be updated when we have forecast data */}
                {forecast && forecast.forecast && forecast.forecast.forecastday[0] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-blue-100 dark:border-blue-900/50 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <EnhancedDayNightCycle
                      sunrise={forecast.forecast.forecastday[0].astro.sunrise}
                      sunset={forecast.forecast.forecastday[0].astro.sunset}
                      currentTime={weather.location.localtime}
                    />

                    <div className="relative overflow-hidden rounded-xl shadow-lg group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-600/10 group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-blue-500" />
                          <span>Weather Conditions</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                            <div className="text-xl font-bold">{weather.current.humidity}%</div>
                          </div>

                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
                            <div className="text-xl font-bold">{Math.round(weather.current.wind_kph)} km/h</div>
                          </div>

                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Pressure</div>
                            <div className="text-xl font-bold">{Math.round(weather.current.pressure_mb)} mb</div>
                          </div>

                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">UV Index</div>
                            <div className="text-xl font-bold">{weather.current.uv}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add this code to display the enhanced components */}
            {/* After the "Current Weather" Card, add this code to use the TemperatureDisplay component: */}
            {weather && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <TemperatureDisplay
                  current={weather.current.temp_c}
                  feelsLike={weather.current.feelslike_c}
                  unit="celsius"
                  size="medium"
                  showTrend={true}
                  trend={weather.current.temp_c > 20 ? "rising" : "falling"}
                />

                {forecast && forecast.forecast && forecast.forecast.forecastday && forecast.forecast.forecastday[0] && (
                  <TemperatureDisplay
                    current={weather.current.temp_c}
                    min={forecast.forecast.forecastday[0].day.mintemp_c}
                    max={forecast.forecast.forecastday[0].day.maxtemp_c}
                    unit="celsius"
                    size="medium"
                  />
                )}
              </div>
            )}

            {/* Add the EnhancedLocationDisplay component */}
            {weather && (
              <div className="mt-6">
                <EnhancedLocationDisplay
                  location={{
                    name: weather.location.name,
                    region: weather.location.region,
                    country: weather.location.country,
                    lat: weather.location.lat,
                    lon: weather.location.lon,
                    localtime: weather.location.localtime,
                    timezone: weather.location.tz_id, // Use tz_id from weather data
                  }}
                  isFavorite={isFavorite(weather.location.name)}
                  onToggleFavorite={() =>
                    isFavorite(weather.location.name)
                      ? removeFromFavorites(weather.location.name)
                      : addToFavorites(weather.location.name)
                  }
                  onViewMap={() => {
                    // Handle map view
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${weather.location.lat},${weather.location.lon}`,
                        "_blank",
                      )
                    }
                  }}
                  onSearch={() => {
                    // Focus on search input
                    const searchInput = document.querySelector('input[type="text"]')
                    if (searchInput) {
                      searchInput.focus()
                    }
                  }}
                />
              </div>
            )}

            {/* Add the ForecastTimeline component */}
            {forecast && forecast.forecast && (
              <div className="mt-6">
                <ForecastTimeline
                  hourlyForecast={getHourlyForecast().map((hour) => ({
                    time: new Date(hour.time).toLocaleTimeString([], { hour: "2-digit" }),
                    temp: hour.temp_c,
                    condition: hour.condition.text,
                    iconUrl: hour.condition.icon,
                    precipitation: hour.chance_of_rain,
                    wind: hour.wind_kph,
                  }))}
                  dailyForecast={getDailyForecast().map((day) => ({
                    time: new Date(day.date).toLocaleDateString([], { weekday: "short" }),
                    temp: day.day.avgtemp_c,
                    condition: day.day.condition.text,
                    iconUrl: day.day.condition.icon,
                    precipitation: day.day.daily_chance_of_rain,
                    wind: day.day.maxwind_kph,
                  }))}
                  unit="celsius"
                />
              </div>
            )}

            {/* Add a button to toggle weather comparison */}
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setShowComparison(!showComparison)} className="premium-button">
                {showComparison ? "Hide Weather Comparison" : "Compare Weather"}
              </Button>
            </div>

            {/* Add the WeatherComparison component */}
            {showComparison && (
              <div className="mt-6">
                <WeatherComparison
                  locations={savedLocations} // Use savedLocations state
                  onAddLocation={addLocation} // Use the new addLocation function
                  onRemoveLocation={removeLocationFromComparison}
                  onRefresh={refreshComparisonData}
                />
              </div>
            )}

            {/* 3D Weather Visualization */}
            {/* <div className="mt-6">
              <Weather3DVisualization
                location={weather.location.name}
                temperature={weather.current.temp_c}
                condition={weather.current.condition.text}
                humidity={weather.current.humidity}
                windSpeed={weather.current.wind_kph}
                timeOfDay={(() => {
                  const hour = new Date(weather.location.localtime).getHours()
                  if (hour >= 5 && hour < 8) return "dawn"
                  if (hour >= 8 && hour < 18) return "day"
                  if (hour >= 18 && hour < 21) return "dusk"
                  return "night"
                })()}
              />
            </div> */}

            {/* Voice Weather Report */}
            {/* <div className="mt-6">
              <VoiceWeatherReport
                location={weather.location.name}
                temperature={weather.current.temp_c}
                condition={weather.current.condition.text}
                feelsLike={weather.current.feelslike_c}
                humidity={weather.current.humidity}
                windSpeed={weather.current.wind_kph}
                windDirection={weather.current.wind_dir}
                precipitation={weather.current.precip_mm}
                forecast={forecast.forecast.forecastday.map((day) => ({
                  day: new Date(day.date).toLocaleDateString("en-US", { weekday: "long" }),
                  condition: day.day.condition.text,
                  maxTemp: day.day.maxtemp_c,
                  minTemp: day.day.mintemp_c,
                  chanceOfRain: day.day.daily_chance_of_rain,
                }))}
                alerts={
                  forecast.alerts?.alert?.map((alert) => ({
                    title: alert.headline || alert.event,
                    description: alert.desc,
                    severity: alert.severity,
                  })) || []
                }
              />
            </div> */}

            {/* Forecast Tabs */}
            {forecast && forecast.forecast && (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-blue-100 dark:border-blue-900/50 shadow-lg">
                <CardContent className="p-0">
                  <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
                    <div className="p-4 border-b border-blue-100 dark:border-blue-900/50">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="today" className="data-[state=active]:bg-blue-500">
                          <Clock className="h-4 w-4 mr-2" />
                          Today
                        </TabsTrigger>
                        <TabsTrigger value="week" className="data-[state=active]:bg-blue-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          7-Day Forecast
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="today" className="p-4">
                      {/* Add this right before the hourly forecast section title */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-blue-500" />
                          Today's Forecast
                        </h3>
                        <div className="real-time-indicator text-xs text-green-600 dark:text-green-400 font-medium">
                          Real-time updates
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getHourlyForecast()
                          .slice(0, 4)
                          .map((hour, index) => (
                            <motion.div
                              key={index}
                              className="text-center p-4 rounded-xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900/80 shadow-md border border-blue-100 dark:border-blue-900/50 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-1 weather-card"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <div className="mb-2 bg-blue-100 dark:bg-blue-900/50 rounded-full py-1 px-3 text-blue-700 dark:text-blue-300 font-medium text-sm inline-block">
                                {new Date(hour.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}
                              </div>
                              <div className="relative">
                                <WeatherIcon iconUrl={hour.condition.icon} description={hour.condition.text} />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shadow-sm">
                                  {hour.chance_of_rain > 30 ? (
                                    <Umbrella className="h-3 w-3 text-blue-500" />
                                  ) : hour.humidity > 70 ? (
                                    <Droplets className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Sun className="h-3 w-3 text-amber-500" />
                                  )}
                                </div>
                              </div>
                              <p className="text-lg font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                {formatTemperature(hour.temp_c)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                {hour.condition.text}
                              </p>
                              <div className="flex items-center justify-center text-xs text-muted-foreground mt-3 gap-2">
                                <div className="flex items-center bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                                  <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                                  <span>{hour.humidity}%</span>
                                </div>
                                <div className="flex items-center bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                                  <Umbrella className="h-3 w-3 mr-1 text-green-500" />
                                  <span>{hour.chance_of_rain}%</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="week" className="p-4">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        7-Day Forecast
                      </h3>
                      <div className="space-y-3">
                        {getDailyForecast().map((day, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900/80 shadow-md border border-blue-100 dark:border-blue-900/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="w-24">
                              <p className="font-medium text-blue-600 dark:text-blue-400">
                                {index === 0
                                  ? "Today"
                                  : new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <WeatherIcon iconUrl={day.day.condition.icon} description={day.day.condition.text} />
                              <p className="text-sm ml-1">{day.day.condition.text}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                                <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                                <span>{day.day.avghumidity}%</span>
                              </div>
                              <div className="flex items-center bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                                <Umbrella className="h-3 w-3 mr-1 text-green-500" />
                                <span>{day.day.daily_chance_of_rain}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">{formatTemperature(day.day.avgtemp_c)}</p>
                              <p className="text-xs text-muted-foreground">
                                <span className="text-blue-500">
                                  {formatTemperature(day.day.mintemp_c).split("°")[0]}°
                                </span>{" "}
                                /
                                <span className="text-red-500">
                                  {formatTemperature(day.day.maxtemp_c).split("°")[0]}°
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Extra features section */}
            {showExtras && weather && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Weather Map */}
                <WeatherMap
                  latitude={weather.location.lat}
                  longitude={weather.location.lon}
                  city={weather.location.name}
                />
                {/* Weather Video Button */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={() => openVideoModal("forecast-1")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl px-6 py-6 transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Weather Forecast Video
                    </span>
                    <span className="absolute inset-0 w-full h-full bg-white scale-0 group-hover:scale-100 transition-transform origin-center rounded-lg z-0 opacity-10"></span>
                  </Button>
                </div>

                {/* Weather Radar */}
                <WeatherRadar
                  latitude={weather.location.lat}
                  longitude={weather.location.lon}
                  city={weather.location.name}
                />

                {/* Weather News */}
                <WeatherNewsAlerts location={weather.location.name} />
              </motion.div>
            )}
          </motion.div>
        )}
        {weather && forecast && <WeatherNotification weatherData={weather} forecastData={forecast} />}
        {/* About modal */}
        <AnimatePresence>{showAbout && <AboutSection onClose={() => setShowAbout(false)} />}</AnimatePresence>
        {/* Login modal */}
        {/* <AnimatePresence>
          {showLogin && (
            <LoginPage
              onClose={() => setShowLogin(false)}
              onLogin={() => {
                setIsLoggedIn(true)
                setShowLogin(false)
              }}
            />
          )}
        </AnimatePresence> */}
        <AnimatePresence>
          {showProfile && (
            <UserProfile
              onClose={() => setShowProfile(false)}
              onLogout={() => {
                // handleLogout() // Removed call to handleLogout
                setShowProfile(false)
              }}
            />
          )}
        </AnimatePresence>
        {/* User Preferences Modal */}
        <UserPreferences isOpen={showUserPreferences} onClose={() => setShowUserPreferences(false)} />
        {/* Weather Video Modal */}
        <WeatherVideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          location={weather?.location?.name || ""}
          videoId={selectedVideoId}
        />
        {/* Push Notification Manager */}
        <PushNotificationManager onNotificationPermissionChange={handleNotificationPermissionChange} />
        {/* Add the visitor counter here */}
        <div className="mt-8 flex justify-center">
          <VisitorCounter />
        </div>
        {/* Category Stats */}
        <CategoryStats newsItems={newsData} /> {/* Use fetched newsData */}
        {/* Weather News */}
        <WeatherNews newsItems={newsData} /> {/* Use fetched newsData */}
      </div>
    </div>
  )
}
