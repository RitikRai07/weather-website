"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Newspaper,
  AlertTriangle,
  Compass,
  ExternalLink,
  Clock,
  Video,
  ArrowLeft,
  ThumbsUp,
  Sparkles,
  Radio,
  Tv,
  X,
  List,
  Grid,
  Search,
  Thermometer,
  MapPin,
  CalendarClock,
  GraduationCap,
  Microscope,
  BarChart3,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Eye,
  Play,
  Pause,
} from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface WeatherNewsProps {
  location: string
}

// News item interface
interface NewsItem {
  id: number
  title: string
  summary: string
  source: string
  date: string
  category: "alert" | "news" | "forecast" | "video"
  categories: string[] // Add this new field for multiple categories
  url: string
  image?: string
  isNew?: boolean
  isSaved?: boolean
  videoUrl?: string
  author?: string
  authorAvatar?: string
  likes?: number
  views?: number
}

// YouTube video interface
interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channel: string
  channelIcon: string
  views: string
  published: string
  description?: string
  tags?: string[]
}

// Category stats interface
interface CategoryStat {
  id: string
  count: number
  trend: number // Positive for upward trend, negative for downward
  views: number
}

export function WeatherNews({ location }: WeatherNewsProps) {
  const [category, setCategory] = useState<"all" | "alerts" | "news" | "forecasts" | "videos">("all")
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [savedArticles, setSavedArticles] = useState<number[]>([])
  const [showAllNews, setShowAllNews] = useState(false)
  const [allNewsHistory, setAllNewsHistory] = useState<NewsItem[]>([])
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [likedArticles, setLikedArticles] = useState<number[]>([])
  const newsUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [animateNewItem, setAnimateNewItem] = useState<number | null>(null)
  const [showLiveStream, setShowLiveStream] = useState(false)
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const { toast } = useToast()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [showCategoryStats, setShowCategoryStats] = useState(false)
  const [trendingCategories, setTrendingCategories] = useState<string[]>([])

  // Mock YouTube videos related to weather
  const mockYoutubeVideos: YouTubeVideo[] = [
    {
      id: "qVMlTAKIbrM",
      title: `LIVE: Weather Radar & Forecast for ${location} - Real-time Updates`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Weather+Radar+Live",
      channel: "Weather Network Live",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WN",
      views: "1.2K watching",
      published: "Live now",
      description:
        "24/7 live coverage of weather conditions in your area with real-time radar updates and expert analysis.",
      tags: ["live", "radar", "forecast"],
    },
    {
      id: "LlXVikDkyTg",
      title: `${location} Weather Forecast - Weekly Outlook`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Weekly+Forecast",
      channel: "Weather Today",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WT",
      views: "5.4K views",
      published: "2 days ago",
      description:
        "Detailed 7-day forecast for your area with temperature trends, precipitation chances, and wind conditions.",
      tags: ["forecast", "weekly", "outlook"],
    },
    {
      id: "G4H1N_yXBiA",
      title: "Understanding Monsoon Patterns in South Asia",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Monsoon+Patterns",
      channel: "Weather Science",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WS",
      views: "12K views",
      published: "1 week ago",
      description:
        "An educational look at monsoon formation, movement patterns, and their impact on regional climate systems.",
      tags: ["monsoon", "education", "climate"],
    },
    {
      id: "tIXFCqyD5_Q",
      title: `Extreme Weather Alert: What ${location} Residents Need to Know`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Weather+Alert",
      channel: "Weather Watch",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WW",
      views: "8.7K views",
      published: "3 days ago",
      description:
        "Important safety information and preparation tips for upcoming extreme weather conditions in your area.",
      tags: ["alert", "safety", "extreme weather"],
    },
    {
      id: "lmWh9jV_1ac",
      title: "Climate Change Effects on Regional Weather Patterns",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Climate+Change",
      channel: "Climate Science Today",
      channelIcon: "/placeholder.svg?height=40&width=40&text=CS",
      views: "23K views",
      published: "2 weeks ago",
      description:
        "Analysis of how climate change is altering traditional weather patterns and what it means for future forecasts.",
      tags: ["climate change", "research", "trends"],
    },
    {
      id: "dQw4w9WgXcQ",
      title: `${location} Seasonal Weather Trends - Historical Analysis`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Seasonal+Trends",
      channel: "Weather History",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WH",
      views: "7.3K views",
      published: "1 month ago",
      description: "Looking back at historical weather data to identify patterns and predict future seasonal changes.",
      tags: ["history", "trends", "analysis"],
    },
    {
      id: "jNQXAC9IVRw",
      title: "How Weather Satellites Work - Behind the Forecast",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Weather+Satellites",
      channel: "Tech Meteorology",
      channelIcon: "/placeholder.svg?height=40&width=40&text=TM",
      views: "15.2K views",
      published: "3 weeks ago",
      description:
        "A technical look at the satellite technology that powers modern weather forecasting and monitoring systems.",
      tags: ["technology", "satellites", "forecasting"],
    },
    {
      id: "9bZkp7q19f0",
      title: `Storm Chasing in ${location} - Extreme Weather Documentary`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Storm+Chasing",
      channel: "Weather Adventures",
      channelIcon: "/placeholder.svg?height=40&width=40&text=WA",
      views: "32.1K views",
      published: "2 months ago",
      description: "Follow professional storm chasers as they track and document severe weather events in your region.",
      tags: ["storm chasing", "documentary", "extreme"],
    },
    {
      id: "QH2-TGUlwu4",
      title: "Weather Forecasting Techniques - From Models to Predictions",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Forecasting+Techniques",
      channel: "Meteorology Explained",
      channelIcon: "/placeholder.svg?height=40&width=40&text=ME",
      views: "9.8K views",
      published: "5 weeks ago",
      description:
        "An in-depth explanation of how meteorologists create accurate weather forecasts using various models and data.",
      tags: ["forecasting", "models", "meteorology"],
    },
    {
      id: "9bZkp7q19f0",
      title: `${location} Air Quality Monitoring - Daily Report`,
      thumbnail: "/placeholder.svg?height=180&width=320&text=Air+Quality",
      channel: "Environmental Weather",
      channelIcon: "/placeholder.svg?height=40&width=40&text=EW",
      views: "4.5K views",
      published: "1 day ago",
      description:
        "Daily updates on air quality conditions, pollution levels, and health recommendations for sensitive groups.",
      tags: ["air quality", "health", "pollution"],
    },
  ]

  // Define weather news categories
  const newsCategories = [
    {
      id: "severe-weather",
      label: "Severe Weather",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-500 bg-red-100 dark:bg-red-900/30",
    },
    {
      id: "forecast",
      label: "Forecast",
      icon: <Compass className="h-4 w-4" />,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "climate",
      label: "Climate",
      icon: <Thermometer className="h-4 w-4" />,
      color: "text-green-500 bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "science",
      label: "Science",
      icon: <Microscope className="h-4 w-4" />,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: "local",
      label: "Local",
      icon: <MapPin className="h-4 w-4" />,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      id: "seasonal",
      label: "Seasonal",
      icon: <CalendarClock className="h-4 w-4" />,
      color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      id: "video",
      label: "Videos",
      icon: <Video className="h-4 w-4" />,
      color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
    },
  ]

  // Initial mock news data
  const initialMockNews: NewsItem[] = [
    {
      id: 1,
      title: "Heat Wave Expected to Continue Through Weekend",
      summary:
        "Temperatures are expected to remain above average with potential record highs. Residents are advised to stay hydrated and avoid outdoor activities during peak hours.",
      source: "Weather Channel",
      date: "2 hours ago",
      category: "alert",
      categories: ["severe-weather", "forecast", "local"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Heat+Wave",
      author: "Meteorologist Jane Smith",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=JS",
      likes: 24,
      views: 1205,
    },
    {
      id: 2,
      title: "New Study Links Air Quality to Seasonal Weather Patterns",
      summary:
        "Researchers have found correlations between seasonal changes and air pollution levels. The study suggests that certain weather conditions can trap pollutants near the ground.",
      source: "Climate News",
      date: "5 hours ago",
      category: "news",
      categories: ["climate", "science"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Air+Quality",
      author: "Dr. Michael Chen",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=MC",
      likes: 42,
      views: 2310,
    },
    {
      id: 3,
      title: `Monsoon Update for ${location}: Heavy Rainfall Expected`,
      summary: `Meteorologists are tracking monsoon patterns that could bring significant rainfall to ${location} and surrounding areas in the coming days.`,
      source: "Weather Service",
      date: "Yesterday",
      category: "alert",
      categories: ["severe-weather", "local", "seasonal"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Monsoon+Update",
      author: "Weather Center",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=WC",
      likes: 87,
      views: 5642,
    },
    {
      id: 4,
      title: `${location} Implements Water Conservation Measures Amid Dry Spell`,
      summary: `Local authorities in ${location} have announced water usage restrictions due to ongoing drought conditions. Residents are encouraged to limit outdoor watering and conserve water.`,
      source: "Local News",
      date: "2 days ago",
      category: "news",
      categories: ["local", "climate"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Water+Conservation",
      author: "City Council",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=CC",
      likes: 31,
      views: 1876,
    },
    {
      id: 5,
      title: "Pollen Count Expected to Rise This Week",
      summary:
        "Allergy sufferers should prepare for increased pollen levels in the coming days. Experts recommend keeping windows closed and taking allergy medication as needed.",
      source: "Health Weather",
      date: "3 days ago",
      category: "forecast",
      categories: ["forecast", "local"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Pollen+Count",
      author: "Allergy Institute",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=AI",
      likes: 19,
      views: 1432,
    },
    {
      id: 6,
      title: "Understanding Monsoon Formation",
      summary:
        "Learn about how monsoons form and what factors contribute to their intensity. This educational video explains the science behind these seasonal weather patterns.",
      source: "Weather Education",
      date: "1 day ago",
      category: "video",
      categories: ["video", "education", "science", "seasonal"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Monsoon+Video",
      videoUrl: "https://www.youtube.com/embed/LlXVikDkyTg",
      author: "Prof. Sarah Johnson",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=SJ",
      likes: 156,
      views: 8932,
    },
    {
      id: 7,
      title: "Climate Change Impact on Weather Patterns",
      summary:
        "This video explores how climate change is affecting global weather patterns and what we might expect in the future.",
      source: "Climate Science",
      date: "4 days ago",
      category: "video",
      categories: ["video", "climate", "science"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Climate+Video",
      videoUrl: "https://www.youtube.com/embed/G4H1N_yXBiA",
      author: "Climate Research Center",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=CR",
      likes: 203,
      views: 12450,
    },
    {
      id: 8,
      title: "Hurricane Season Preparation Guide",
      summary:
        "Essential tips for preparing your home and family for hurricane season. Learn what supplies to stock and how to create an emergency plan.",
      source: "Emergency Management",
      date: "1 week ago",
      category: "news",
      categories: ["severe-weather", "local", "seasonal"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Hurricane+Prep",
      author: "Emergency Services",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=ES",
      likes: 178,
      views: 9876,
    },
    {
      id: 9,
      title: "Winter Weather Outlook for Coming Season",
      summary:
        "Long-range forecast for the upcoming winter season, including temperature trends and precipitation expectations.",
      source: "Seasonal Forecast Center",
      date: "2 weeks ago",
      category: "forecast",
      categories: ["forecast", "seasonal"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Winter+Outlook",
      author: "Dr. Winter Analyst",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=WA",
      likes: 145,
      views: 7654,
    },
    {
      id: 10,
      title: "How Weather Radar Works",
      summary:
        "An educational video explaining the technology behind weather radar systems and how meteorologists interpret the data.",
      source: "Weather Tech",
      date: "3 weeks ago",
      category: "video",
      categories: ["video", "education", "science"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Weather+Radar",
      videoUrl: "https://www.youtube.com/embed/tIXFCqyD5_Q",
      author: "Tech Education",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=TE",
      likes: 132,
      views: 6543,
    },
  ]

  // Additional news items to add periodically
  const additionalNews: NewsItem[] = [
    {
      id: 101,
      title: `Record Rainfall Recorded in ${location} Region`,
      summary: `Several areas around ${location} have experienced unprecedented rainfall amounts, leading to localized flooding. Emergency services are on high alert.`,
      source: "Weather Network",
      date: "Just now",
      category: "alert",
      categories: ["severe-weather", "local"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Rainfall",
      isNew: true,
      author: "Field Reporter Alex Kim",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=AK",
      likes: 12,
      views: 876,
    },
    {
      id: 102,
      title: "Scientists Develop New Weather Prediction Model",
      summary:
        "A breakthrough in meteorological science promises more accurate long-term forecasts. The model incorporates machine learning algorithms.",
      source: "Science Daily",
      date: "Just now",
      category: "news",
      categories: ["science", "forecast"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Weather+Model",
      isNew: true,
      author: "Tech Science Team",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=TS",
      likes: 45,
      views: 2103,
    },
    {
      id: 103,
      title: `Seasonal Forecast Update for ${location}`,
      summary: `Long-range forecasts suggest changing weather patterns for ${location} in the coming weeks. This could impact seasonal activities and planning.`,
      source: "Climate Center",
      date: "Just now",
      category: "forecast",
      categories: ["forecast", "seasonal", "local"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Seasonal+Forecast",
      isNew: true,
      author: "Seasonal Forecast Team",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=SF",
      likes: 28,
      views: 1567,
    },
    {
      id: 104,
      title: `Air Quality Improves Following Recent Storms in ${location}`,
      summary:
        "Recent precipitation has helped clear pollutants from the air in urban areas. Measurements show significant improvements in air quality indices.",
      source: "Environmental Monitor",
      date: "Just now",
      category: "news",
      categories: ["local", "climate"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Air+Quality",
      isNew: true,
      author: "Environmental Agency",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=EA",
      likes: 33,
      views: 1890,
    },
    {
      id: 105,
      title: `Unusual Weather Patterns Observed in ${location}`,
      summary: `Meteorologists have noted unusual weather patterns in the ${location} region that may be linked to broader climate change impacts. The frequency of such events is expected to increase.`,
      source: "Climate Research",
      date: "Just now",
      category: "news",
      categories: ["climate", "local", "science"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Climate+Change",
      isNew: true,
      author: "Dr. Emily Rodriguez",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=ER",
      likes: 67,
      views: 3421,
    },
    {
      id: 106,
      title: "How Weather Radar Works",
      summary:
        "An educational video explaining the technology behind weather radar systems and how meteorologists use them to track storms.",
      source: "Weather Tech",
      date: "Just now",
      category: "video",
      categories: ["video", "education", "science"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Weather+Radar",
      videoUrl: "https://www.youtube.com/embed/tIXFCqyD5_Q",
      isNew: true,
      author: "Tech Education Channel",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=TE",
      likes: 89,
      views: 5432,
    },
    {
      id: 107,
      title: "Monsoon Formation Explained",
      summary:
        "This video breaks down the atmospheric conditions that lead to monsoon formation and how to stay safe during heavy rainfall periods.",
      source: "Storm Chasers",
      date: "Just now",
      category: "video",
      categories: ["video", "education", "science", "seasonal"],
      url: "#",
      image: "/placeholder.svg?height=200&width=300&text=Monsoon",
      videoUrl: "https://www.youtube.com/embed/lmWh9jV_1ac",
      isNew: true,
      author: "Meteorologist Tom Wilson",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=TW",
      likes: 112,
      views: 7654,
    },
  ]

  // Calculate category statistics
  const calculateCategoryStats = (newsItems: NewsItem[]) => {
    const stats: Record<string, { count: number; views: number; trend: number }> = {}

    // Initialize stats for all categories
    newsCategories.forEach((cat) => {
      stats[cat.id] = { count: 0, views: 0, trend: 0 }
    })

    // Count occurrences and views
    newsItems.forEach((item) => {
      item.categories?.forEach((catId) => {
        if (stats[catId]) {
          stats[catId].count += 1
          stats[catId].views += item.views || 0

          // Simulate trend data - newer items have more impact
          const isNew = item.date === "Just now" || item.date.includes("hour")
          const isRecent = item.date.includes("day") || item.date.includes("week")

          if (isNew) stats[catId].trend += 2
          else if (isRecent) stats[catId].trend += 1
          else stats[catId].trend -= 0.5
        }
      })
    })

    // Convert to array and sort by count
    return Object.entries(stats)
      .map(([id, data]) => ({
        id,
        count: data.count,
        views: data.views,
        trend: data.trend,
      }))
      .sort((a, b) => b.count - a.count)
  }

  // Determine trending categories
  const determineTrendingCategories = (stats: CategoryStat[]) => {
    return stats
      .filter((stat) => stat.trend > 0 && stat.count > 0)
      .sort((a, b) => b.trend - a.trend)
      .slice(0, 3)
      .map((stat) => stat.id)
  }

  // Load initial news and YouTube videos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Customize news items with the location - improved to ensure location is always properly inserted
      const locationName = location || "your area"
      const customizedNews = initialMockNews.map((item) => {
        let title = item.title
        let summary = item.summary

        // Replace location placeholders with actual location
        if (title.includes("${location}")) {
          title = title.replace(/\${location}/g, locationName)
        }
        if (summary.includes("${location}")) {
          summary = summary.replace(/\${location}/g, locationName)
        }

        return {
          ...item,
          title,
          summary,
        }
      })

      setNews(customizedNews)
      setAllNewsHistory([...customizedNews])
      setIsLoading(false)
      setLastUpdateTime(new Date())

      // Calculate initial category stats
      const initialStats = calculateCategoryStats(customizedNews)
      setCategoryStats(initialStats)

      // Set initial trending categories
      setTrendingCategories(determineTrendingCategories(initialStats))

      // Set YouTube videos with proper location
      const customizedVideos = mockYoutubeVideos.map((video) => {
        let title = video.title
        let description = video.description

        if (title.includes("${location}")) {
          title = title.replace(/\${location}/g, locationName)
        }
        if (description && description.includes("${location}")) {
          description = description.replace(/\${location}/g, locationName)
        }

        return {
          ...video,
          title,
          description,
        }
      })

      setYoutubeVideos(customizedVideos)

      // Save location to localStorage
      localStorage.setItem("weatherLocation", locationName)

      // Show a welcome toast with location
      toast({
        title: `Weather news for ${locationName}`,
        description: "Latest updates and forecasts loaded successfully",
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [location, toast])

  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weatherSavedArticles")
    if (saved) {
      setSavedArticles(JSON.parse(saved))
    }

    const liked = localStorage.getItem("weatherLikedArticles")
    if (liked) {
      setLikedArticles(JSON.parse(liked))
    }
  }, [])

  // Save articles to localStorage when changed
  useEffect(() => {
    localStorage.setItem("weatherSavedArticles", JSON.stringify(savedArticles))
  }, [savedArticles])

  useEffect(() => {
    localStorage.setItem("weatherLikedArticles", JSON.stringify(likedArticles))
  }, [likedArticles])

  // Set up periodic news updates
  useEffect(() => {
    if (!liveUpdatesEnabled) return

    // Add a new news item every 30 seconds
    newsUpdateInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * additionalNews.length)
      const newItem = {
        ...additionalNews[randomIndex],
        id: Date.now(), // Ensure unique ID
        isNew: true,
      }

      // Customize news item with location if applicable
      if (newItem.title.includes("${location}")) {
        newItem.title = newItem.title.replace("${location}", location)
      }
      if (newItem.summary.includes("${location}")) {
        newItem.summary = newItem.summary.replace("${location}", location)
      }

      setNews((prev) => {
        const updated = [newItem, ...prev.slice(0, 9)] // Keep only the 10 most recent

        // Update category stats when adding new content
        const newStats = calculateCategoryStats([...updated, ...allNewsHistory])
        setCategoryStats(newStats)
        setTrendingCategories(determineTrendingCategories(newStats))

        return updated
      })

      setAllNewsHistory((prev) => [newItem, ...prev]) // Add to history
      setLastUpdateTime(new Date())
      setAnimateNewItem(newItem.id)

      // Remove "new" badge after 10 seconds
      setTimeout(() => {
        setNews((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, isNew: false } : item)))
        setAllNewsHistory((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, isNew: false } : item)))
        setAnimateNewItem(null)
      }, 10000)
    }, 30000)

    return () => {
      if (newsUpdateInterval.current) {
        clearInterval(newsUpdateInterval.current)
      }
    }
  }, [liveUpdatesEnabled, location])

  // Updated filtering logic to handle multiple categories
  const filterByCategories = (newsItems: NewsItem[]) => {
    if (selectedCategories.length === 0) {
      return category === "all" ? newsItems : newsItems.filter((item) => item.category === category)
    }

    return newsItems.filter((item) => {
      // First filter by main category if not "all"
      if (category !== "all" && item.category !== category) {
        return false
      }

      // Then filter by selected subcategories
      return selectedCategories.some((cat) => item.categories?.includes(cat))
    })
  }

  // Update the filtered news variables
  const filteredNews = filterByCategories(news)
  const filteredAllNews = filterByCategories(allNewsHistory)

  // Filter YouTube videos based on search query
  const filteredVideos = searchQuery
    ? youtubeVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (video.tags && video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    : youtubeVideos

  // Get icon based on news category
  const getNewsIcon = (category: string) => {
    switch (category) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "forecast":
        return <Compass className="h-5 w-5 text-green-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      default:
        return <Newspaper className="h-5 w-5 text-blue-500" />
    }
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "alert":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "forecast":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "video":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refresh with new data
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * additionalNews.length)
      const newItem = {
        ...additionalNews[randomIndex],
        id: Date.now(), // Ensure unique ID
        isNew: true,
      }

      // Customize news item with location if applicable
      if (newItem.title.includes("${location}")) {
        newItem.title = newItem.title.replace("${location}", location)
      }
      if (newItem.summary.includes("${location}")) {
        newItem.summary = newItem.summary.replace("${location}", location)
      }

      setNews((prev) => {
        const updated = [newItem, ...prev.slice(0, 9)]

        // Update category stats when refreshing
        const newStats = calculateCategoryStats([...updated, ...allNewsHistory])
        setCategoryStats(newStats)
        setTrendingCategories(determineTrendingCategories(newStats))

        return updated
      })

      setAllNewsHistory((prev) => [newItem, ...prev]) // Add to history
      setRefreshing(false)
      setLastUpdateTime(new Date())
      setAnimateNewItem(newItem.id)

      // Remove "new" badge after 10 seconds
      setTimeout(() => {
        setNews((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, isNew: false } : item)))
        setAllNewsHistory((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, isNew: false } : item)))
        setAnimateNewItem(null)
      }, 10000)

      toast({
        title: "News refreshed",
        description: "Latest weather news has been loaded",
      })
    }, 1500)
  }

  // Toggle save article
  const toggleSaveArticle = (id: number) => {
    if (savedArticles.includes(id)) {
      setSavedArticles((prev) => prev.filter((articleId) => articleId !== id))
      toast({
        title: "Removed from saved",
        description: "Article has been removed from your saved items",
      })
    } else {
      setSavedArticles((prev) => [...prev, id])
      toast({
        title: "Saved",
        description: "Article has been saved for later reading",
      })
    }
  }

  // Toggle like article
  const toggleLikeArticle = (id: number) => {
    if (likedArticles.includes(id)) {
      setLikedArticles((prev) => prev.filter((articleId) => articleId !== id))

      // Decrease like count
      setNews((prev) => prev.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) - 1 } : item)))

      setAllNewsHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) - 1 } : item)),
      )
    } else {
      setLikedArticles((prev) => [...prev, id])

      // Increase like count
      setNews((prev) => prev.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item)))

      setAllNewsHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item)),
      )

      toast({
        title: "Liked!",
        description: "You liked this article",
      })
    }
  }

  // Share article
  const shareArticle = (title: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Check out this weather news: ${title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback
      navigator.clipboard
        .writeText(`${title} - ${window.location.href}`)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Article link copied to clipboard",
          })
        })
        .catch((err) => console.error("Failed to copy: ", err))
    }
  }

  // Toggle live updates
  const toggleLiveUpdates = () => {
    setLiveUpdatesEnabled((prev) => !prev)

    if (!liveUpdatesEnabled) {
      toast({
        title: "Live updates enabled",
        description: "You will now receive real-time weather news updates",
      })
    } else {
      toast({
        title: "Live updates disabled",
        description: "Real-time updates have been paused",
      })

      // Clear any existing interval
      if (newsUpdateInterval.current) {
        clearInterval(newsUpdateInterval.current)
        newsUpdateInterval.current = null
      }
    }
  }

  // Format last update time
  const formatLastUpdateTime = () => {
    return lastUpdateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Open YouTube live stream
  const openLiveStream = () => {
    setShowLiveStream(true)
    setSelectedVideo(youtubeVideos[0]?.id || null)
  }

  // Render news item
  const renderNewsItem = (item: NewsItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: animateNewItem === item.id ? [1, 1.02, 1] : 1,
        boxShadow:
          animateNewItem === item.id
            ? ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.5)", "0 0 0 rgba(59, 130, 246, 0)"]
            : "none",
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        duration: 0.3,
        scale: { duration: 0.5, repeat: 0 },
        boxShadow: { duration: 1.5, repeat: 0 },
      }}
      className={`rounded-lg border ${
        item.isNew
          ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700"
      } hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all relative overflow-hidden group news-card ${
        item.category
      } transform hover:translate-y-[-3px] hover:shadow-md`}
    >
      {item.isNew && (
        <div className="absolute top-0 right-0 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="default" className="bg-blue-500 text-white text-xs m-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              NEW
            </Badge>
          </motion.div>
        </div>
      )}

      {/* Trending badge */}
      {trendingCategories.some((catId) => item.categories?.includes(catId)) && (
        <div className="absolute top-0 left-0 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="default" className="bg-orange-500 text-white text-xs m-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              TRENDING
            </Badge>
          </motion.div>
        </div>
      )}

      {item.category === "video" ? (
        <div className="space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            {activeVideo === item.id ? (
              <iframe
                src={item.videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <>
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/50 text-white h-16 w-16 group"
                    onClick={() => setActiveVideo(item.id)}
                  >
                    <Video className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-1">
                <Badge
                  variant="outline"
                  className={`${getCategoryColor(item.category)} text-xs flex items-center gap-1`}
                >
                  <Video className="h-3 w-3" />
                  Video
                </Badge>
                {item.categories?.slice(0, 2).map((catId) => {
                  const category = newsCategories.find((c) => c.id === catId)
                  if (!category || catId === "video") return null
                  return (
                    <Badge
                      key={catId}
                      variant="outline"
                      className={`text-xs px-1.5 py-0.5 ${category.color.split(" ")[0]} border-${category.color.split(" ")[0].replace("text-", "")}-200 dark:border-${category.color.split(" ")[0].replace("text-", "")}-900`}
                    >
                      {category.label}
                    </Badge>
                  )
                })}
                {item.categories && item.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    +{item.categories.length - 3}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1 inline" />
                {item.date}
              </span>
            </div>

            <h3 className="font-medium text-base mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.authorAvatar || "/placeholder.svg"} alt={item.author} />
                  <AvatarFallback>
                    {item.author
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{item.author}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 flex items-center gap-1 ${likedArticles.includes(item.id) ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
                  onClick={() => toggleLikeArticle(item.id)}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{item.likes}</span>
                </Button>
                <span className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span>{item.views} views</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row">
          {item.image && (
            <div className="sm:w-1/3">
              <div className="h-40 sm:h-full sm:w-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <div className={`p-4 flex-1 ${!item.image ? "w-full" : "sm:w-2/3"}`}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {getNewsIcon(item.category)}
                <Badge variant="outline" className={`${getCategoryColor(item.category)} text-xs`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Badge>
              </div>
              {item.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.categories.map((catId) => {
                    const category = newsCategories.find((c) => c.id === catId)
                    if (!category) return null
                    return (
                      <Badge
                        key={catId}
                        variant="outline"
                        className={`text-xs px-1.5 py-0.5 ${category.color.split(" ")[0]} border-${category.color.split(" ")[0].replace("text-", "")}-200 dark:border-${category.color.split(" ")[0].replace("text-", "")}-900`}
                      >
                        {category.label}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <h3 className="font-medium text-base mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{item.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.authorAvatar || "/placeholder.svg"} alt={item.author} />
                  <AvatarFallback>
                    {item.author
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{item.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.source} • {item.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 flex items-center gap-1 ${likedArticles.includes(item.id) ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
                  onClick={() => toggleLikeArticle(item.id)}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{item.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 group"
                >
                  <span className="text-xs">Read more</span>
                  <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Highlight animation for new items */}
      {item.isNew && (
        <motion.div
          className="absolute inset-0 bg-blue-500/10 pointer-events-none"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 3 }}
        />
      )}
    </motion.div>
  )

  // Render category stats
  const renderCategoryStats = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-hidden mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
          Category Statistics
        </h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCategoryStats(false)}
          className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-4">
        {categoryStats.slice(0, 5).map((stat) => {
          const category = newsCategories.find((c) => c.id === stat.id)
          if (!category) return null

          return (
            <div key={stat.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={category.color.split(" ")[0]}>{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                  {trendingCategories.includes(stat.id) && (
                    <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Newspaper className="h-3 w-3" />
                    {stat.count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {stat.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    {stat.trend > 0 ? (
                      <ChevronUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-red-500" />
                    )}
                    {Math.abs(stat.trend).toFixed(1)}
                  </span>
                </div>
              </div>
              <Progress value={(stat.count / categoryStats[0].count) * 100} className="h-1.5" />
            </div>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <Card className="w-full border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px]">
      <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {showAllNews ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllNews(false)}
                className="flex items-center gap-1 -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Recent News</span>
              </Button>
            ) : (
              <>
                <div className="relative">
                  <Newspaper className="h-5 w-5 text-blue-500" />
                  {liveUpdatesEnabled && (
                    <motion.div
                      className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span>Weather News & Alerts: {location}</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="flex items-center"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-red-500 dark:text-red-400 flex items-center gap-1"
                            onClick={() => setSelectedVideo(youtubeVideos[0]?.id || null)}
                          >
                            <Radio className="h-3 w-3 animate-pulse" />
                            <span className="underline">Watch Live</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0">
                          <DialogHeader className="p-4 border-b">
                            <div className="flex justify-between items-center">
                              <DialogTitle className="flex items-center gap-2">
                                <Tv className="h-5 w-5 text-red-500" />
                                <span>Live Weather Coverage: {location}</span>
                              </DialogTitle>
                              <DialogClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <X className="h-4 w-4" />
                                </Button>
                              </DialogClose>
                            </div>
                            <DialogDescription>
                              Watch real-time weather updates and forecasts for your area
                            </DialogDescription>
                          </DialogHeader>

                          <div className="p-0">
                            <div className="aspect-video w-full">
                              {selectedVideo && (
                                <iframe
                                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                  className="w-full h-full"
                                  allowFullScreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                              )}
                            </div>

                            <div className="p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">More Weather Videos</h3>
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                      placeholder="Search videos..."
                                      className="pl-8 h-8 w-[200px]"
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex border rounded-md overflow-hidden">
                                    <Button
                                      variant={viewMode === "grid" ? "default" : "ghost"}
                                      size="sm"
                                      className="h-8 rounded-none"
                                      onClick={() => setViewMode("grid")}
                                    >
                                      <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant={viewMode === "list" ? "default" : "ghost"}
                                      size="sm"
                                      className="h-8 rounded-none"
                                      onClick={() => setViewMode("list")}
                                    >
                                      <List className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                                  {filteredVideos.slice(1).map((video) => (
                                    <div
                                      key={video.id}
                                      className="cursor-pointer group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 transform hover:translate-y-[-3px] hover:shadow-lg"
                                      onClick={() => setSelectedVideo(video.id)}
                                    >
                                      <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                        <img
                                          src={video.thumbnail || "/placeholder.svg"}
                                          alt={video.title}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                            <Play className="h-8 w-8 text-white" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-3">
                                        <h4 className="text-sm font-medium line-clamp-1">{video.title}</h4>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Avatar className="h-4 w-4">
                                            <AvatarImage
                                              src={video.channelIcon || "/placeholder.svg"}
                                              alt={video.channel}
                                            />
                                            <AvatarFallback>{video.channel.substring(0, 2)}</AvatarFallback>
                                          </Avatar>
                                          <span>{video.channel}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          <span>{video.views}</span>
                                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                          <span>{video.published}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-3 p-1">
                                  {filteredVideos.slice(1).map((video) => (
                                    <div
                                      key={video.id}
                                      className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300 cursor-pointer"
                                      onClick={() => setSelectedVideo(video.id)}
                                    >
                                      <div className="relative w-32 h-18 aspect-video rounded-lg overflow-hidden">
                                        <img
                                          src={video.thumbnail || "/placeholder.svg"}
                                          alt={video.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                          <Play className="h-6 w-6 text-white" />
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-sm font-medium line-clamp-1">{video.title}</h4>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Avatar className="h-4 w-4">
                                            <AvatarImage
                                              src={video.channelIcon || "/placeholder.svg"}
                                              alt={video.channel}
                                            />
                                            <AvatarFallback>{video.channel.substring(0, 2)}</AvatarFallback>
                                          </Avatar>
                                          <span>{video.channel}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          <span>{video.views}</span>
                                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                          <span>{video.published}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                    <span>
                      Last updated: {formatLastUpdateTime()} ({liveUpdatesEnabled ? "Live" : "Paused"})
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 4a8 8 0 018 8a1 1 0 01-1 1.35a5.04 5.04 0 00-3.65 1.65h0a1 1 0 01-1.41-1.41a7.06 7.06 0 005.06-5.06a1 1 0 011.41 1.41A7 7 0 105.54 18.46a1 1 0 01-1
1.35A8 8 0 1112 4z"
                    />
                  </svg>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <Newspaper className="h-4 w-4" />
                  <span>Refresh News</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCategoryStats(true)}
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Category Stats</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={toggleLiveUpdates} className="flex items-center gap-1">
              {liveUpdatesEnabled ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause Updates</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Resume Updates</span>
                </>
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setShowAllNews(true)} className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span>All News</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {showCategoryStats && renderCategoryStats()}

      {isLoading ? (
        <div className="p-6 flex items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 4a8 8 0 018 8a1 1 0 01-1 1.35a5.04 5.04 0 00-3.65 1.65h0a1 1 0 01-1.41-1.41a7.06 7.06 0 005.06-5.06a1 1 0 011.41 1.41A7 7 0 105.54 18.46a1 1 0 01-1
1.35A8 8 0 1112 4z"
            />
          </svg>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {!showAllNews ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative"
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  >
                    <List className="h-4 w-4 mr-2" />
                    <span>Filter Categories</span>
                    {selectedCategories.length > 0 && (
                      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {selectedCategories.length}
                      </div>
                    )}
                  </Button>

                  {categoryStats.length > 0 && (
                    <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {trendingCategories.length} Trending
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {showCategoryFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-hidden mb-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Filter News Categories</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCategoryFilter(false)}
                      className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {newsCategories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategories.includes(cat.id) ? "default" : "outline"}
                        className="flex items-center gap-2 justify-start text-sm"
                        onClick={() => {
                          if (selectedCategories.includes(cat.id)) {
                            setSelectedCategories((prev) => prev.filter((c) => c !== cat.id))
                          } else {
                            setSelectedCategories((prev) => [...prev, cat.id])
                          }
                        }}
                      >
                        {cat.icon}
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div layout className="space-y-4">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => renderNewsItem(item))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">No news found for selected filters.</div>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div layout className="space-y-4">
              {filteredAllNews.length > 0 ? (
                filteredAllNews.map((item) => renderNewsItem(item))
              ) : (
                <div className="text-center p-4 text-muted-foreground">No news history found.</div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </Card>
  )
}
