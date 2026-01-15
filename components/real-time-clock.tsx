"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function RealTimeClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Split time into parts for animation
  const timeParts = formatTime().split(":")
  const hours = timeParts[0]
  const minutes = timeParts[1]
  const seconds = timeParts[2]

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
        <motion.div
          className="text-sm font-mono font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          key={hours}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {hours}
        </motion.div>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="mx-0.5 text-blue-500 dark:text-blue-400"
        >
          :
        </motion.span>
        <motion.div
          className="text-sm font-mono font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          key={minutes}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {minutes}
        </motion.div>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="mx-0.5 text-blue-500 dark:text-blue-400"
        >
          :
        </motion.span>
        <motion.div
          className="text-sm font-mono font-semibold text-blue-500 dark:text-blue-400"
          key={seconds}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {seconds}
        </motion.div>
      </div>
    </div>
  )
}
