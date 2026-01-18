"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Radio, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnhancedNewsAlertsHeaderProps {
  location: string
  alertCount?: number
}

export function EnhancedNewsAlertsHeader({ location, alertCount = 0 }: EnhancedNewsAlertsHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const getTimeSinceUpdate = () => {
    const now = new Date()
    const diffMs = now.getTime() - lastUpdated.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins === 0) return "just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    return "yesterday"
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow-lg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
          style={{ top: "-10%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-white rounded-full"
          animate={{
            x: [0, -80, 80, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          style={{ bottom: "-5%", right: "-5%" }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            {/* Title */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="h-6 w-6 text-yellow-300" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Weather News & Alerts: <span className="text-yellow-200">{location}</span>
              </h2>
            </div>

            {/* Subtitle with dynamic time */}
            <div className="flex items-center gap-4 text-blue-100 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Current time: <span className="font-mono font-bold text-white">{currentTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 gap-2"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Number.POSITIVE_INFINITY : 0 }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {alertCount > 0 && (
              <motion.div
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <AlertTriangle className="h-4 w-4" />
                </motion.div>
                <span>{alertCount} Alert{alertCount !== 1 ? "s" : ""}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Last Updated Section */}
        <motion.div
          className="flex items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Radio className="h-4 w-4 text-green-300" />
          </motion.div>

          <div className="flex-1">
            <p className="text-xs text-blue-100 uppercase font-semibold tracking-wider">Last Updated</p>
            <p className="text-sm md:text-base text-white font-medium">
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
              <span className="text-blue-100">{getTimeSinceUpdate()}</span>
            </p>
          </div>

          <div className="text-right">
            <motion.div
              className="inline-block"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-200 rounded-full font-semibold border border-green-400/30">
                Live
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
