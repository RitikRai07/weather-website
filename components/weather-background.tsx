"use client"

import { useEffect, useState } from "react"

interface WeatherBackgroundProps {
  condition: string
}

export function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )

  useEffect(() => {
    // Create particles based on weather condition
    const createParticles = () => {
      const newParticles = []
      const count = getParticleCount(condition)

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percentage across screen
          y: Math.random() * 100, // percentage down screen
          size: getParticleSize(condition),
          speed: getParticleSpeed(condition),
        })
      }

      setParticles(newParticles)
    }

    createParticles()

    // Recreate particles when window is resized
    const handleResize = () => {
      createParticles()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [condition])

  // Helper functions for particle properties
  const getParticleCount = (condition: string) => {
    switch (condition) {
      case "rain":
        return 100
      case "snow":
        return 80
      case "clouds":
        return 15
      case "thunderstorm":
        return 50
      default:
        return 0
    }
  }

  const getParticleSize = (condition: string) => {
    switch (condition) {
      case "rain":
        return Math.random() * 2 + 1
      case "snow":
        return Math.random() * 4 + 2
      case "clouds":
        return Math.random() * 50 + 30
      case "thunderstorm":
        return Math.random() * 3 + 1
      default:
        return 0
    }
  }

  const getParticleSpeed = (condition: string) => {
    switch (condition) {
      case "rain":
        return Math.random() * 15 + 15
      case "snow":
        return Math.random() * 5 + 2
      case "clouds":
        return Math.random() * 0.5 + 0.2
      case "thunderstorm":
        return Math.random() * 20 + 10
      default:
        return 0
    }
  }

  // Background color based on weather condition
  const getBackgroundColor = () => {
    switch (condition) {
      case "clear":
        return "from-blue-400 to-blue-600"
      case "clouds":
        return "from-gray-300 to-gray-500"
      case "rain":
        return "from-gray-500 to-gray-700"
      case "thunderstorm":
        return "from-gray-700 to-gray-900"
      case "snow":
        return "from-gray-100 to-gray-300"
      case "atmosphere":
        return "from-gray-400 to-gray-600"
      default:
        return "from-blue-400 to-blue-600"
    }
  }

  // Particle styles based on weather condition
  const getParticleStyles = (particle: { id: number; x: number; y: number; size: number; speed: number }) => {
    switch (condition) {
      case "rain":
        return {
          position: "absolute" as const,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size * 10}px`,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "40%",
          animation: `fall-rain ${particle.speed}s linear infinite`,
        }
      case "snow":
        return {
          position: "absolute" as const,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          animation: `fall-snow ${particle.speed}s linear infinite`,
        }
      case "clouds":
        return {
          position: "absolute" as const,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size * 0.6}px`,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "50%",
          animation: `move-clouds ${particle.speed * 20}s linear infinite`,
        }
      case "thunderstorm":
        return {
          position: "absolute" as const,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size * 15}px`,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "40%",
          animation: `fall-rain ${particle.speed}s linear infinite`,
        }
      default:
        return {}
    }
  }

  // Lightning flash for thunderstorm
  const renderLightning = () => {
    if (condition !== "thunderstorm") return null

    return <div className="absolute inset-0 bg-white opacity-0 animate-lightning pointer-events-none"></div>
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getBackgroundColor()} dark:opacity-30 opacity-10 transition-opacity duration-1000`}
      ></div>

      {/* Sun or moon based on condition */}
      {condition === "clear" && (
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-yellow-300 opacity-20 dark:opacity-10 shadow-lg shadow-yellow-300/50"></div>
      )}

      {/* Weather particles */}
      {particles.map((particle) => (
        <div key={particle.id} style={getParticleStyles(particle)} className="pointer-events-none" />
      ))}

      {/* Lightning effect for thunderstorms */}
      {renderLightning()}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fall-rain {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(20px);
          }
        }
        
        @keyframes fall-snow {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(100px);
          }
        }
        
        @keyframes move-clouds {
          0% {
            transform: translateX(-10vw);
          }
          100% {
            transform: translateX(110vw);
          }
        }
        
        @keyframes lightning {
          0%, 95%, 98% {
            opacity: 0;
          }
          96%, 99% {
            opacity: 0.6;
          }
          97%, 100% {
            opacity: 0;
          }
        }
        
        .animate-lightning {
          animation: lightning 8s infinite;
          animation-delay: calc(Math.random() * 5s);
        }
      `}</style>
    </div>
  )
}
