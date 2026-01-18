"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnalogClockProps {
  showDate?: boolean
}

export function AnalogClock({ showDate = true }: AnalogClockProps) {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [date, setDate] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const now = new Date()
      setTime({
        hours: now.getHours() % 12,
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      })

      if (showDate) {
        setDate(
          now.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        )
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [showDate])

  if (!mounted) return null

  const secondDegrees = (time.seconds / 60) * 360
  const minuteDegrees = (time.minutes / 60) * 360 + (time.seconds / 60) * 6
  const hourDegrees = (time.hours / 12) * 360 + (time.minutes / 60) * 30

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-8"
    >
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">
          Current Time
        </h2>
      </div>

      {/* Clock Container */}
      <div
        className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full bg-gradient-to-br from-blue-900 via-gray-900 to-blue-950 dark:from-blue-950 dark:via-gray-950 dark:to-blue-960 border-8 border-blue-500 dark:border-blue-400 shadow-2xl glow-effect"
        style={{
          boxShadow: "0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 60px rgba(59, 130, 246, 0.1)",
        }}
      >
        {/* Clock face numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
          const angle = (num === 12 ? 0 : num * 30) * (Math.PI / 180)
          const x = Math.sin(angle) * 85
          const y = -Math.cos(angle) * 85

          return (
            null
          )
        })}

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30 * (Math.PI / 180)
          return (
            <div
              key={`marker-${i}`}
              className="absolute w-1 h-4 md:h-5 bg-blue-300 dark:bg-blue-200 rounded-full"
              style={{
                top: "12%",
                left: "50%",
                transform: `translateX(-50%) rotate(${i * 30}deg) translateY(0)`,
              }}
            />
          )
        })}

        {/* Center dot with glow */}
        <div
          className="absolute top-1/2 left-1/2 w-5 h-5 md:w-6 md:h-6 bg-blue-500 dark:bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-2xl"
          style={{
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)",
          }}
        />

        {/* Hour hand */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-3 md:w-4 h-24 md:h-32 bg-gradient-to-t from-blue-600 via-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-300 rounded-full origin-bottom shadow-2xl"
          style={{
            transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
          }}
          animate={{
            transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
          }}
          transition={{ type: "tween", duration: 0.5 }}
        />

        {/* Minute hand */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-2.5 md:w-3 h-32 md:h-40 bg-gradient-to-t from-purple-500 via-purple-400 to-purple-300 dark:from-purple-400 dark:to-purple-200 rounded-full origin-bottom shadow-2xl"
          style={{
            transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.5)",
          }}
          animate={{
            transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
          }}
          transition={{ type: "tween", duration: 0.5 }}
        />

        {/* Second hand */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-1 md:w-1.5 h-36 md:h-44 bg-red-500 dark:bg-red-400 rounded-full origin-bottom shadow-lg"
          style={{
            transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
            boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
          }}
          animate={{
            transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
          }}
          transition={{ type: "tween", duration: 0 }}
        />
      </div>

      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 tracking-wide">{date}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
