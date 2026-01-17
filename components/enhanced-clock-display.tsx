"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"
import { AnalogClock } from "@/components/analog-clock"

interface EnhancedClockDisplayProps {
  showSeconds?: boolean
  compact?: boolean
}

export function EnhancedClockDisplay({ showSeconds = true, compact = false }: EnhancedClockDisplayProps) {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")

      if (showSeconds) {
        setTime(`${hours}:${minutes}:${seconds}`)
      } else {
        setTime(`${hours}:${minutes}`)
      }

      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [showSeconds])

  if (!mounted) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono">
        <Clock size={16} className="text-blue-500" />
        <span className="text-gray-600 dark:text-gray-300">Analog Clock</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Current Time
        </span>
      </div>
      <AnalogClock showDate={true} />
    </motion.div>
  )
}
