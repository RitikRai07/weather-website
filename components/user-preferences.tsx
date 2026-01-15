"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Save, X, Bell, Palette, Globe, Thermometer, Eye, Clock, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserPreferencesProps {
  isOpen: boolean
  onClose: () => void
}

export function UserPreferences({ isOpen, onClose }: UserPreferencesProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [preferences, setPreferences] = useState({
    general: {
      theme: "system",
      language: "en",
      autoRefresh: true,
      refreshInterval: 15,
      saveSearchHistory: true,
      defaultLocation: "",
    },
    notifications: {
      enableNotifications: false,
      weatherAlerts: true,
      dailyForecast: false,
      extremeWeather: true,
      notificationSound: true,
      notificationVolume: 70,
    },
    display: {
      temperatureUnit: "celsius",
      windSpeedUnit: "kph",
      timeFormat: "12h",
      dateFormat: "short",
      showSeconds: true,
      colorScheme: "default",
      animationLevel: "full",
      mapStyle: "standard",
    },
    privacy: {
      shareLocation: true,
      collectAnalytics: true,
      personalization: true,
    },
  })

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("weatherUserPreferences")
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error("Error parsing saved preferences:", error)
      }
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = () => {
    localStorage.setItem("weatherUserPreferences", JSON.stringify(preferences))

    // Apply some preferences immediately
    if (preferences.display.temperatureUnit) {
      localStorage.setItem("weatherUnit", JSON.stringify(preferences.display.temperatureUnit))
    }

    if (preferences.display.timeFormat) {
      localStorage.setItem("clockFormat", preferences.display.timeFormat === "24h" ? "24h" : "12h")
    }

    if (preferences.display.showSeconds !== undefined) {
      localStorage.setItem("showSeconds", preferences.display.showSeconds.toString())
    }

    toast({
      title: "Preferences saved",
      description: "Your preferences have been updated successfully.",
    })

    onClose()
  }

  // Update a specific preference
  const updatePreference = (category: keyof typeof preferences, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      })
      return
    }

    try {
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        updatePreference("notifications", "enableNotifications", true)
        toast({
          title: "Notifications enabled",
          description: "You will now receive weather notifications.",
        })

        // Show a test notification
        new Notification("Weather App Notification", {
          body: "You have successfully enabled notifications!",
          icon: "/favicon.ico",
        })
      } else {
        updatePreference("notifications", "enableNotifications", false)
        toast({
          title: "Notifications disabled",
          description: "You won't receive weather notifications.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Permission error",
        description: "There was an error requesting notification permission.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            User Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="display" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Display</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.general.theme}
                    onValueChange={(value) => updatePreference("general", "theme", value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.general.language}
                    onValueChange={(value) => updatePreference("general", "language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-refresh" className="flex-1">
                    Auto-refresh weather data
                  </Label>
                  <Switch
                    id="auto-refresh"
                    checked={preferences.general.autoRefresh}
                    onCheckedChange={(checked) => updatePreference("general", "autoRefresh", checked)}
                  />
                </div>

                {preferences.general.autoRefresh && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="refresh-interval">
                        Refresh interval: {preferences.general.refreshInterval} minutes
                      </Label>
                    </div>
                    <Slider
                      id="refresh-interval"
                      value={[preferences.general.refreshInterval]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={(value) => updatePreference("general", "refreshInterval", value[0])}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="save-history" className="flex-1">
                    Save search history
                  </Label>
                  <Switch
                    id="save-history"
                    checked={preferences.general.saveSearchHistory}
                    onCheckedChange={(checked) => updatePreference("general", "saveSearchHistory", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-location">Default location</Label>
                  <Input
                    id="default-location"
                    placeholder="Enter a city name"
                    value={preferences.general.defaultLocation}
                    onChange={(e) => updatePreference("general", "defaultLocation", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This location will be used when geolocation is not available
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-notifications" className="flex-1 block mb-1">
                      Enable notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive important weather alerts and updates</p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={preferences.notifications.enableNotifications}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestNotificationPermission()
                      } else {
                        updatePreference("notifications", "enableNotifications", false)
                      }
                    }}
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-3">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weather-alerts" className="flex-1">
                        Weather alerts
                      </Label>
                      <Switch
                        id="weather-alerts"
                        checked={preferences.notifications.weatherAlerts}
                        onCheckedChange={(checked) => updatePreference("notifications", "weatherAlerts", checked)}
                        disabled={!preferences.notifications.enableNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="daily-forecast" className="flex-1">
                        Daily forecast
                      </Label>
                      <Switch
                        id="daily-forecast"
                        checked={preferences.notifications.dailyForecast}
                        onCheckedChange={(checked) => updatePreference("notifications", "dailyForecast", checked)}
                        disabled={!preferences.notifications.enableNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="extreme-weather" className="flex-1">
                        Extreme weather
                      </Label>
                      <Switch
                        id="extreme-weather"
                        checked={preferences.notifications.extremeWeather}
                        onCheckedChange={(checked) => updatePreference("notifications", "extremeWeather", checked)}
                        disabled={!preferences.notifications.enableNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-3">Sound Settings</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-sound" className="flex-1">
                        Notification sound
                      </Label>
                      <Switch
                        id="notification-sound"
                        checked={preferences.notifications.notificationSound}
                        onCheckedChange={(checked) => updatePreference("notifications", "notificationSound", checked)}
                        disabled={!preferences.notifications.enableNotifications}
                      />
                    </div>

                    {preferences.notifications.notificationSound && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="notification-volume" className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            Volume: {preferences.notifications.notificationVolume}%
                          </Label>
                        </div>
                        <Slider
                          id="notification-volume"
                          value={[preferences.notifications.notificationVolume]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => updatePreference("notifications", "notificationVolume", value[0])}
                          disabled={
                            !preferences.notifications.enableNotifications ||
                            !preferences.notifications.notificationSound
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <Bell className="h-4 w-4 inline-block mr-1" />
                    Test your notification settings by clicking the button below
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
                    onClick={() => {
                      if (Notification.permission === "granted") {
                        new Notification("Weather Alert Test", {
                          body: "This is a test notification from the Weather App",
                          icon: "/favicon.ico",
                        })

                        toast({
                          title: "Test notification sent",
                          description: "Check your notification area",
                        })
                      } else {
                        toast({
                          title: "Notifications not enabled",
                          description: "Please enable notifications first",
                          variant: "destructive",
                        })
                      }
                    }}
                    disabled={!preferences.notifications.enableNotifications}
                  >
                    Send Test Notification
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="display" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Temperature Unit</Label>
                  <RadioGroup
                    value={preferences.display.temperatureUnit}
                    onValueChange={(value) => updatePreference("display", "temperatureUnit", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="celsius" id="celsius" />
                      <Label htmlFor="celsius" className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4" />
                        Celsius (°C)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                      <Label htmlFor="fahrenheit" className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4" />
                        Fahrenheit (°F)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Wind Speed Unit</Label>
                  <RadioGroup
                    value={preferences.display.windSpeedUnit}
                    onValueChange={(value) => updatePreference("display", "windSpeedUnit", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kph" id="kph" />
                      <Label htmlFor="kph">km/h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mph" id="mph" />
                      <Label htmlFor="mph">mph</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ms" id="ms" />
                      <Label htmlFor="ms">m/s</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <RadioGroup
                    value={preferences.display.timeFormat}
                    onValueChange={(value) => updatePreference("display", "timeFormat", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12h" id="12h" />
                      <Label htmlFor="12h" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        12-hour (AM/PM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24h" id="24h" />
                      <Label htmlFor="24h" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        24-hour
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-seconds" className="flex-1">
                    Show seconds in clock
                  </Label>
                  <Switch
                    id="show-seconds"
                    checked={preferences.display.showSeconds}
                    onCheckedChange={(checked) => updatePreference("display", "showSeconds", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <RadioGroup
                    value={preferences.display.dateFormat}
                    onValueChange={(value) => updatePreference("display", "dateFormat", value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="date-short" />
                      <Label htmlFor="date-short">Short (Jan 1)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="date-medium" />
                      <Label htmlFor="date-medium">Medium (Jan 1, 2023)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="date-long" />
                      <Label htmlFor="date-long">Long (January 1, 2023)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-scheme">Color Scheme</Label>
                  <Select
                    value={preferences.display.colorScheme}
                    onValueChange={(value) => updatePreference("display", "colorScheme", value)}
                  >
                    <SelectTrigger id="color-scheme">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Blue)</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="amber">Amber</SelectItem>
                      <SelectItem value="rose">Rose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animation-level">Animation Level</Label>
                  <Select
                    value={preferences.display.animationLevel}
                    onValueChange={(value) => updatePreference("display", "animationLevel", value)}
                  >
                    <SelectTrigger id="animation-level">
                      <SelectValue placeholder="Select animation level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Reduced motion)</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="map-style">Map Style</Label>
                  <Select
                    value={preferences.display.mapStyle}
                    onValueChange={(value) => updatePreference("display", "mapStyle", value)}
                  >
                    <SelectTrigger id="map-style">
                      <SelectValue placeholder="Select map style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-location" className="flex-1 block mb-1">
                      Share location
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow the app to access your location for accurate weather data
                    </p>
                  </div>
                  <Switch
                    id="share-location"
                    checked={preferences.privacy.shareLocation}
                    onCheckedChange={(checked) => updatePreference("privacy", "shareLocation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="collect-analytics" className="flex-1 block mb-1">
                      Collect analytics
                    </Label>
                    <p className="text-xs text-muted-foreground">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    id="collect-analytics"
                    checked={preferences.privacy.collectAnalytics}
                    onCheckedChange={(checked) => updatePreference("privacy", "collectAnalytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="personalization" className="flex-1 block mb-1">
                      Personalization
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow us to personalize your experience based on your usage
                    </p>
                  </div>
                  <Switch
                    id="personalization"
                    checked={preferences.privacy.personalization}
                    onCheckedChange={(checked) => updatePreference("privacy", "personalization", checked)}
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg mt-4">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Your privacy is important to us. We only collect data that helps us provide better service. You can
                    request deletion of your data at any time.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800"
                    onClick={() => {
                      toast({
                        title: "Data deletion requested",
                        description: "Your request has been submitted. We'll process it within 30 days.",
                      })
                    }}
                  >
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50 dark:bg-gray-950">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={savePreferences} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
