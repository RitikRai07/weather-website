"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Clock,
  Shield,
  Info,
  MapPin,
  Volume2,
  VolumeX,
  AlertCircle,
  Megaphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface WeatherAlert {
  id: string
  headline: string
  severity: "moderate" | "severe" | "extreme"
  description: string
  effective: string
  expires: string
  source?: string
  areas?: string
  instruction?: string
}

interface WeatherAlertsProps {
  location: string
  alerts?: WeatherAlert[]
}

export function WeatherAlerts({ location, alerts = [] }: WeatherAlertsProps) {
  const [showAlerts, setShowAlerts] = useState(false)
  const [currentAlert, setCurrentAlert] = useState(0)
  const [isNew, setIsNew] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "instructions" | "map">("details")
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [alertsExpanded, setAlertsExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const alertsContainerRef = useRef<HTMLDivElement>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/alert-sound.mp3") // This would be a real sound file in production
    audioRef.current.volume = 0.5

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Simulate new alert notification
  useEffect(() => {
    if (alerts.length > 0) {
      setIsNew(true)

      // Play sound if enabled and hasn't played yet
      if (soundEnabled && !hasPlayed && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setHasPlayed(true))
          .catch((err) => console.error("Error playing alert sound:", err))
      }

      // Show browser notification if enabled
      if (notificationsEnabled && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Weather Alert", {
            body: alerts[0].headline,
            icon: "/weather-alert-icon.png", // This would be a real icon in production
          })
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission()
        }
      }

      const timer = setTimeout(() => {
        setIsNew(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alerts, soundEnabled, notificationsEnabled, hasPlayed])

  // Calculate time remaining for current alert
  useEffect(() => {
    if (alerts.length > 0 && showAlerts) {
      const calculateTimeRemaining = () => {
        const now = new Date().getTime()
        const expiryTime = new Date(alerts[currentAlert].expires).getTime()
        const timeLeft = Math.max(0, expiryTime - now)
        setTimeRemaining(timeLeft)

        // If expired, move to next alert
        if (timeLeft <= 0 && alerts.length > 1) {
          setCurrentAlert((prev) => (prev === alerts.length - 1 ? 0 : prev + 1))
        }
      }

      calculateTimeRemaining()
      intervalRef.current = setInterval(calculateTimeRemaining, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [alerts, currentAlert, showAlerts])

  // Request notification permission
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true)
          toast({
            title: "Notifications enabled",
            description: "You will now receive weather alert notifications",
          })
        }
      })
    }
  }

  // If there are no alerts, don't render anything
  if (alerts.length === 0) return null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "moderate":
        return "bg-yellow-500 dark:bg-yellow-600"
      case "severe":
        return "bg-orange-500 dark:bg-orange-600"
      case "extreme":
        return "bg-red-500 dark:bg-red-600"
      default:
        return "bg-yellow-500 dark:bg-yellow-600"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400"
      case "severe":
        return "text-orange-600 dark:text-orange-400"
      case "extreme":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-yellow-600 dark:text-yellow-400"
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "moderate":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "severe":
        return "bg-orange-500/10 border-orange-500/30"
      case "extreme":
        return "bg-red-500/10 border-red-500/30"
      default:
        return "bg-yellow-500/10 border-yellow-500/30"
    }
  }

  const getSeverityGradient = (severity: string) => {
    switch (severity) {
      case "moderate":
        return "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20"
      case "severe":
        return "from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20"
      case "extreme":
        return "from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20"
      default:
        return "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20"
    }
  }

  const getAlertsIcon = (severity: string) => {
    switch (severity) {
      case "moderate":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "severe":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "extreme":
        return <Megaphone className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getAqiText = (severity: string) => {
    switch (severity) {
      case "moderate":
        return "Moderate"
      case "severe":
        return "Severe"
      case "extreme":
        return "Extreme"
      default:
        return "Unknown"
    }
  }

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired"

    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    } else {
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
      return `${minutes}m ${seconds}s remaining`
    }
  }

  // Calculate progress percentage for expiry
  const calculateProgress = () => {
    if (alerts.length === 0) return 100

    const now = new Date().getTime()
    const startTime = new Date(alerts[currentAlert].effective).getTime()
    const endTime = new Date(alerts[currentAlert].expires).getTime()
    const total = endTime - startTime
    const elapsed = now - startTime

    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  return (
    <>
      <div
        ref={alertsContainerRef}
        className={`fixed bottom-4 right-4 z-40 transition-all duration-500 ${alertsExpanded ? "w-80" : "w-auto"}`}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col gap-2"
        >
          {!alertsExpanded ? (
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1.5 border-2 ${getSeverityBgColor(alerts[0].severity)} ${getSeverityTextColor(alerts[0].severity)} relative overflow-hidden group transition-all duration-300 hover:scale-105 shadow-lg`}
              onClick={() => setAlertsExpanded(true)}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>
                {alerts.length} Weather {alerts.length === 1 ? "Alert" : "Alerts"}
              </span>
              {isNew && (
                <motion.span
                  className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 0.8,
                  }}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          ) : (
            <Card className={`border-2 shadow-lg ${getSeverityBgColor(alerts[currentAlert].severity)}`}>
              <CardHeader
                className={`relative pb-2 bg-gradient-to-r ${getSeverityGradient(alerts[currentAlert].severity)}`}
              >
                <div className="absolute -top-6 -left-6">
                  <div
                    className={`w-12 h-12 rounded-full ${getSeverityColor(alerts[currentAlert].severity)} flex items-center justify-center shadow-lg`}
                  >
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col ml-6">
                    <Badge
                      variant="outline"
                      className={`self-start mb-1 ${getSeverityTextColor(alerts[currentAlert].severity)}`}
                    >
                      {alerts[currentAlert].severity.toUpperCase()} ALERT
                    </Badge>
                    <CardTitle className="text-sm">Weather Alert for {location}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSoundEnabled(!soundEnabled)
                        toast({
                          title: soundEnabled ? "Sound alerts disabled" : "Sound alerts enabled",
                          description: soundEnabled
                            ? "You will no longer hear alert sounds"
                            : "You will now hear alert sounds",
                        })
                      }}
                      title={soundEnabled ? "Mute alerts" : "Enable sound alerts"}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAlertsExpanded(false)}
                      className="h-8 w-8 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Issued: {new Date(alerts[currentAlert].effective).toLocaleString()}
                    </span>
                    <span className="flex items-center font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress()}
                    className="h-1.5"
                    indicatorClassName={`${getSeverityColor(alerts[currentAlert].severity)}`}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-3 max-h-60 overflow-y-auto">
                <h3 className="text-base font-bold mb-2">{alerts[currentAlert].headline}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{alerts[currentAlert].description}</p>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-2 p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium">Safety Instructions</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alerts[currentAlert].instruction || "Follow local authority instructions and stay informed."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <div className="text-sm">
                      <p className="font-medium">Affected Areas</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alerts[currentAlert].areas || `${location} and surrounding areas`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2 pb-3 border-t">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                    <span>
                      Alert {currentAlert + 1} of {alerts.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notification-mode"
                        checked={notificationsEnabled}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            requestNotificationPermission()
                          } else {
                            setNotificationsEnabled(false)
                            toast({
                              title: "Notifications disabled",
                              description: "You will no longer receive weather alert notifications",
                            })
                          }
                        }}
                      />
                      <Label htmlFor="notification-mode" className="text-xs">
                        Notifications
                      </Label>
                    </div>
                  </div>
                </div>

                {alerts.length > 1 && (
                  <div className="flex gap-2 w-full justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentAlert((prev) => (prev === 0 ? alerts.length - 1 : prev - 1))}
                      className="group rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentAlert((prev) => (prev === alerts.length - 1 ? 0 : prev + 1))}
                      className="group rounded-full"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAlerts && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowAlerts(false)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <Card className={`border-2 shadow-lg ${getSeverityBgColor(alerts[currentAlert].severity)}`}>
                <CardHeader
                  className={`relative pb-2 bg-gradient-to-r ${getSeverityGradient(alerts[currentAlert].severity)}`}
                >
                  <div className="absolute -top-6 -left-6">
                    <div
                      className={`w-12 h-12 rounded-full ${getSeverityColor(alerts[currentAlert].severity)} flex items-center justify-center shadow-lg`}
                    >
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col ml-6">
                      <Badge
                        variant="outline"
                        className={`self-start mb-1 ${getSeverityTextColor(alerts[currentAlert].severity)}`}
                      >
                        {alerts[currentAlert].severity.toUpperCase()} ALERT
                      </Badge>
                      <CardTitle className="text-lg">Weather Alert for {location}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSoundEnabled(!soundEnabled)
                        }}
                        title={soundEnabled ? "Mute alerts" : "Enable sound alerts"}
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setShowAlerts(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued: {new Date(alerts[currentAlert].effective).toLocaleString()}
                      </span>
                      <span className="flex items-center font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeRemaining(timeRemaining)}
                      </span>
                    </div>
                    <Progress value={calculateProgress()} className="h-1.5" />
                  </div>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <div className="px-4 pt-2 border-b">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="details"
                        className={`data-[state=active]:${getSeverityTextColor(alerts[currentAlert].severity)}`}
                      >
                        <Info className="h-3.5 w-3.5 mr-1.5" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="instructions"
                        className={`data-[state=active]:${getSeverityTextColor(alerts[currentAlert].severity)}`}
                      >
                        <Shield className="h-3.5 w-3.5 mr-1.5" />
                        Safety
                      </TabsTrigger>
                      <TabsTrigger
                        value="map"
                        className={`data-[state=active]:${getSeverityTextColor(alerts[currentAlert].severity)}`}
                      >
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        Areas
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <CardContent className="p-4">
                    <TabsContent value="details" className="mt-0">
                      <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm shadow-inner">
                        <h3 className="text-xl font-bold mb-3">{alerts[currentAlert].headline}</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {alerts[currentAlert].description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-4">
                          <div className="bg-background/50 p-2 rounded">
                            <span className="block font-medium mb-1">Effective</span>
                            <span>{new Date(alerts[currentAlert].effective).toLocaleString()}</span>
                          </div>
                          <div className="bg-background/50 p-2 rounded">
                            <span className="block font-medium mb-1">Expires</span>
                            <span>{new Date(alerts[currentAlert].expires).toLocaleString()}</span>
                          </div>
                        </div>

                        {alerts[currentAlert].source && (
                          <div className="mt-4 text-xs text-right">
                            <span className="text-muted-foreground">Source: {alerts[currentAlert].source}</span>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="instructions" className="mt-0">
                      <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm shadow-inner">
                        <h3 className="text-lg font-bold mb-3">Safety Instructions</h3>
                        {alerts[currentAlert].instruction ? (
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {alerts[currentAlert].instruction}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {alerts[currentAlert].severity === "moderate" &&
                                "Stay informed about changing weather conditions. Consider adjusting your plans if they involve outdoor activities."}
                              {alerts[currentAlert].severity === "severe" &&
                                "Take precautions now. Prepare for potential impacts to your safety and property. Follow instructions from local officials."}
                              {alerts[currentAlert].severity === "extreme" &&
                                "Take action immediately to protect your life and property. Follow evacuation orders if issued. Seek shelter in a safe location."}
                            </p>
                            <div className="bg-background/70 p-3 rounded-lg border border-border">
                              <h4 className="font-medium text-sm mb-2">General Safety Tips:</h4>
                              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                                <li>Stay tuned to local news and weather updates</li>
                                <li>Keep emergency supplies and important documents ready</li>
                                <li>Charge your mobile devices in case of power outages</li>
                                <li>Check on vulnerable family members and neighbors</li>
                                <li>Follow all instructions from emergency officials</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-center">
                          <Button variant="outline" size="sm" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            More safety information
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="map" className="mt-0">
                      <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm shadow-inner">
                        <h3 className="text-lg font-bold mb-3">Affected Areas</h3>
                        {alerts[currentAlert].areas ? (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{alerts[currentAlert].areas}</p>
                            <div className="aspect-video rounded-lg overflow-hidden border border-border">
                              <img
                                src={`/placeholder.svg?height=300&width=600&text=Alert+Map+for+${encodeURIComponent(location)}`}
                                alt="Alert area map"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              This alert affects {location} and surrounding areas.
                            </p>
                            <div className="aspect-video rounded-lg overflow-hidden border border-border">
                              <img
                                src={`/placeholder.svg?height=300&width=600&text=Alert+Map+for+${encodeURIComponent(location)}`}
                                alt="Alert area map"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>

                <CardFooter className="flex flex-col gap-3 pt-2 pb-4 border-t">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bell className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        Alert {currentAlert + 1} of {alerts.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="notification-mode"
                          checked={notificationsEnabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              requestNotificationPermission()
                            } else {
                              setNotificationsEnabled(false)
                            }
                          }}
                        />
                        <Label htmlFor="notification-mode" className="text-xs">
                          Notifications
                        </Label>
                      </div>
                    </div>
                  </div>

                  {alerts.length > 1 && (
                    <div className="flex gap-2 w-full justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentAlert((prev) => (prev === 0 ? alerts.length - 1 : prev - 1))}
                        className="group"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentAlert((prev) => (prev === alerts.length - 1 ? 0 : prev + 1))}
                        className="group"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
