"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface PushNotificationManagerProps {
  onNotificationPermissionChange?: (permission: NotificationPermission) => void
}

export function PushNotificationManager({ onNotificationPermissionChange }: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [showBanner, setShowBanner] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    // Get current permission status
    setPermission(Notification.permission)

    // Show banner if permission is not granted and user hasn't dismissed it before
    const hasPrompted = localStorage.getItem("weatherNotificationPrompted")
    if (Notification.permission === "default" && !hasPrompted) {
      // Wait a bit before showing the banner to not overwhelm the user
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Request notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (onNotificationPermissionChange) {
        onNotificationPermissionChange(result)
      }

      if (result === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You will now receive important weather alerts.",
        })

        // Show a test notification
        setTimeout(() => {
          const notification = new Notification("Weather Alerts Enabled", {
            body: "You'll now receive important weather updates and alerts.",
            icon: "/favicon.ico",
          })

          notification.onclick = () => {
            window.focus()
            notification.close()
          }
        }, 1000)
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive weather alerts.",
          variant: "destructive",
        })
      }

      // Mark as prompted
      localStorage.setItem("weatherNotificationPrompted", "true")
      setShowBanner(false)
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Permission error",
        description: "There was an error requesting notification permission.",
        variant: "destructive",
      })
    }
  }

  // Send a test notification
  const sendTestNotification = () => {
    if (Notification.permission !== "granted") {
      toast({
        title: "Permission required",
        description: "Please enable notifications first.",
        variant: "destructive",
      })
      return
    }

    const notification = new Notification("Weather Alert Test", {
      body: "This is a test weather alert notification. In a real scenario, you would receive important weather updates here.",
      icon: "/favicon.ico",
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    toast({
      title: "Test notification sent",
      description: "Check your notification area.",
    })
  }

  // Dismiss the banner
  const dismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem("weatherNotificationPrompted", "true")
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={dismissBanner}
                className="absolute top-2 right-2 h-6 w-6 rounded-full text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                  <Bell className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h3 className="font-medium text-sm mb-1">Stay informed with weather alerts</h3>
                  <p className="text-sm text-white/90 mb-3">
                    Get notified about severe weather conditions, daily forecasts, and more.
                  </p>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={requestPermission} className="bg-white text-blue-600 hover:bg-white/90">
                      <Bell className="h-4 w-4 mr-1" />
                      Enable Notifications
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={dismissBanner}
                      className="text-white/90 hover:text-white hover:bg-white/20"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {permission === "granted" && (
        <div className="fixed bottom-4 left-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestNotification}
            className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all rounded-full"
          >
            <Bell className="h-4 w-4 mr-1 text-blue-500" />
            Test Notification
          </Button>
        </div>
      )}
    </>
  )
}
