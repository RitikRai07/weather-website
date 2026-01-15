"use client"

import { useEffect, useRef } from "react"

interface AnimatedEarthProps {
  isDay: boolean
}

export function AnimatedEarth({ isDay }: AnimatedEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const size = 60
    canvas.width = size
    canvas.height = size

    // Load earth image
    const earthImage = new Image()
    earthImage.crossOrigin = "anonymous"
    earthImage.src = isDay
      ? "/placeholder.svg?height=60&width=60&text=🌎"
      : "/placeholder.svg?height=60&width=60&text=🌑"

    // Create day and night gradients
    const dayGradient = ctx.createLinearGradient(0, 0, size, size)
    dayGradient.addColorStop(0, "#87CEEB") // Sky blue
    dayGradient.addColorStop(1, "#1E90FF") // Dodger blue

    const nightGradient = ctx.createLinearGradient(0, 0, size, size)
    nightGradient.addColorStop(0, "#191970") // Midnight blue
    nightGradient.addColorStop(1, "#000033") // Dark blue

    let rotation = 0

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw background (day or night)
      ctx.fillStyle = isDay ? dayGradient : nightGradient
      ctx.fillRect(0, 0, size, size)

      // Draw stars at night
      if (!isDay) {
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * size
          const y = Math.random() * size
          const radius = Math.random() * 1 + 0.5
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Save context state
      ctx.save()

      // Move to center of canvas
      ctx.translate(size / 2, size / 2)

      // Rotate
      ctx.rotate(rotation)

      // Draw earth (centered)
      ctx.drawImage(earthImage, -size / 2, -size / 2, size, size)

      // Add glow effect
      const glowColor = isDay ? "rgba(255, 215, 0, 0.3)" : "rgba(100, 149, 237, 0.3)"
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(0, 0, size / 2 - 5, 0, Math.PI * 2)
      ctx.closePath()
      ctx.stroke()
      ctx.shadowBlur = 0

      // Restore context state
      ctx.restore()

      // Update rotation
      rotation += 0.005

      // Request next frame
      requestAnimationFrame(draw)
    }

    // Start animation when image is loaded
    earthImage.onload = () => {
      draw()
    }

    return () => {
      // Clean up
      earthImage.onload = null
    }
  }, [isDay])

  return <canvas ref={canvasRef} className="inline-block align-middle mr-2" width={60} height={60} />
}
