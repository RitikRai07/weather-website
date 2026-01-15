"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Radio, ExternalLink, Youtube, Clock, BarChart3, Video } from "lucide-react"
import { WeatherVideoModal } from "./weather-video-modal"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: string
  title: string
  description: string
  severity: "minor" | "moderate" | "severe"
  time: string
}

interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  url: string
}

interface ForecastUpdate {
  id: string
  title: string
  description: string
  time: string
  type: "update" | "warning" | "info"
}

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  duration: string
  time: string
}

interface WeatherNewsAlertsProps {
  location: string
  alerts?: Alert[]
  news?: NewsItem[]
}

// Sample data for demonstration
const sampleAlerts: Alert[] = [
  {
    id: "a1",
    title: "Heavy Rain Warning",
    description: "Expect heavy rainfall in the next 24 hours with possible flash flooding in low-lying areas.",
    severity: "moderate",
    time: "2 hours ago",
  },
  {
    id: "a2",
    title: "Strong Wind Advisory",
    description: "Wind speeds of 30-40 km/h expected. Secure loose objects outdoors.",
    severity: "minor",
    time: "5 hours ago",
  },
]

const sampleNews: NewsItem[] = [
  {
    id: "n1",
    title: "Record temperatures expected this weekend",
    source: "Weather Network",
    time: "1 hour ago",
    url: "#",
  },
  {
    id: "n2",
    title: "How climate change is affecting seasonal patterns",
    source: "Climate Today",
    time: "3 hours ago",
    url: "#",
  },
  {
    id: "n3",
    title: "New weather monitoring stations installed across the region",
    source: "Local News",
    time: "Yesterday",
    url: "#",
  },
]

const sampleForecasts: ForecastUpdate[] = [
  {
    id: "f1",
    title: "Weekly Forecast Update",
    description: "Temperatures will rise by 5°C over the weekend with clear skies expected.",
    time: "This morning",
    type: "update",
  },
  {
    id: "f2",
    title: "Monthly Outlook",
    description: "Above average temperatures expected for the remainder of the month with occasional precipitation.",
    time: "2 days ago",
    type: "info",
  },
]

const sampleVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Today's Weather Forecast",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Weather+Forecast",
    duration: "3:45",
    time: "2 hours ago",
  },
  {
    id: "v2",
    title: "Storm System Analysis",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Storm+Analysis",
    duration: "5:20",
    time: "Yesterday",
  },
  {
    id: "v3",
    title: "Weekend Weather Preview",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Weekend+Preview",
    duration: "4:10",
    time: "1 day ago",
  },
]

export function WeatherNewsAlerts({ location, alerts = [], news = [] }: WeatherNewsAlertsProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const locationName = location || "your area"
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Use sample data if none provided
  const displayAlerts = alerts.length > 0 ? alerts : sampleAlerts
  const displayNews = news.length > 0 ? news : sampleNews
  const displayForecasts = sampleForecasts
  const displayVideos = sampleVideos

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-800"
      case "moderate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200 border-orange-200 dark:border-orange-800"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
    }
  }

  const getForecastTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
    }
  }

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
    setIsVideoModalOpen(true)
  }

  return (
    <>
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 transform hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold">Weather News & Alerts: {locationName}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock size={14} />
                <span>Last updated: {currentTime}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedVideo(null)
                setIsVideoModalOpen(true)
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors group self-start"
            >
              <div className="relative">
                <Radio size={14} className="animate-pulse" />
                <motion.span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <Youtube size={14} className="mr-1 group-hover:scale-110 transition-transform" />
              <span className="group-hover:font-bold transition-all">Watch Live</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="alerts" className="relative">
                Alerts
                {displayAlerts.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {displayAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Radio size={18} className="mr-2 text-blue-500" />
                  Live Updates
                </h3>
                <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/30">
                  All
                </Badge>
              </div>

              {/* Alerts Section */}
              {displayAlerts.length > 0 && (
                <div className="space-y-3">
                  {displayAlerts.slice(0, 1).map((alert) => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="mr-2 text-amber-500" />
                          <h4 className="font-medium">{alert.title}</h4>
                        </div>
                        <span className="text-xs opacity-75">{alert.time}</span>
                      </div>
                      <p className="text-sm mt-1">{alert.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* News Section */}
              {displayNews.length > 0 && (
                <div className="space-y-3">
                  {displayNews.slice(0, 1).map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{item.title}</h4>
                        <ExternalLink size={14} className="text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.source}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Forecasts Section */}
              {displayForecasts.length > 0 && (
                <div className="space-y-3">
                  {displayForecasts.slice(0, 1).map((forecast, index) => (
                    <motion.div
                      key={forecast.id}
                      className={`p-3 rounded-lg ${getForecastTypeColor(forecast.type)}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <BarChart3 size={16} className="mr-2 text-blue-500" />
                          <h4 className="font-medium">{forecast.title}</h4>
                        </div>
                        <span className="text-xs opacity-75">{forecast.time}</span>
                      </div>
                      <p className="text-sm mt-1">{forecast.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Videos Section */}
              {displayVideos.length > 0 && (
                <div className="space-y-3">
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleVideoClick(displayVideos[0].id)}
                  >
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={displayVideos[0].thumbnail || "/placeholder.svg"}
                        alt={displayVideos[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {displayVideos[0].duration}
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="font-medium">{displayVideos[0].title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Weather Channel</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{displayVideos[0].time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => setActiveTab("alerts")}
                >
                  View all updates
                </button>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-amber-500" />
                  Weather Alerts
                </h3>
                {displayAlerts.length > 0 && (
                  <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-900/30">
                    {displayAlerts.length} Active
                  </Badge>
                )}
              </div>

              {displayAlerts.length > 0 ? (
                <div className="space-y-3">
                  {displayAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className="text-xs opacity-75">{alert.time}</span>
                      </div>
                      <p className="text-sm mt-1">{alert.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-muted-foreground">No active alerts for {locationName}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Radio size={18} className="mr-2 text-blue-500" />
                  Weather News
                </h3>
              </div>

              {displayNews.length > 0 ? (
                <div className="space-y-3">
                  {displayNews.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{item.title}</h4>
                        <ExternalLink size={14} className="text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.source}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-muted-foreground">No recent news for {locationName}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="forecasts" className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart3 size={18} className="mr-2 text-green-500" />
                  Forecast Updates
                </h3>
              </div>

              {displayForecasts.length > 0 ? (
                <div className="space-y-3">
                  {displayForecasts.map((forecast, index) => (
                    <motion.div
                      key={forecast.id}
                      className={`p-3 rounded-lg ${getForecastTypeColor(forecast.type)}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{forecast.title}</h4>
                        <span className="text-xs opacity-75">{forecast.time}</span>
                      </div>
                      <p className="text-sm mt-1">{forecast.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-muted-foreground">No forecast updates available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Video size={18} className="mr-2 text-red-500" />
                  Weather Videos
                </h3>
              </div>

              {displayVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      className="rounded-lg overflow-hidden cursor-pointer group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleVideoClick(video.id)}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Video className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium">{video.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Weather Channel</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{video.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-muted-foreground">No videos available for {locationName}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <WeatherVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        location={locationName}
        videoId={selectedVideo}
      />
    </>
  )
}
