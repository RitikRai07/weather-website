"use client"

interface WeatherIconProps {
  iconUrl: string
  description: string
  size?: "small" | "medium" | "large"
  animated?: boolean
  condition?: string
}

export function WeatherIcon({ iconUrl, description, size = "medium", animated = true, condition }: WeatherIconProps) {
  const sizeClass = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-20 h-20",
  }

  const getIconBackground = () => {
    if (!condition) return ""

    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return "rain-background"
    } else if (conditionLower.includes("snow")) {
      return "snow-background"
    } else if (conditionLower.includes("thunder") || conditionLower.includes("lightning")) {
      return "thunder-background"
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return "cloud-background"
    } else if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      return "sun-background"
    } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
      return "fog-background"
    }

    return ""
  }

  // WeatherAPI.com provides full URLs for icons
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 rounded-full ${animated ? "animate-pulse-slow" : ""} bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 blur-md -z-10`}
      ></div>
      <div className={`relative ${sizeClass[size]} flex items-center justify-center`}>
        <img
          src={iconUrl.replace("//cdn.weatherapi.com", "https://cdn.weatherapi.com") || "/placeholder.svg"}
          alt={description}
          className={`${sizeClass[size]} ${animated ? "weather-icon-animated" : ""} ${getIconBackground()} drop-shadow-lg transition-all duration-300 group-hover:scale-110`}
        />
        {animated && condition && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            {condition.toLowerCase().includes("rain") && <div className="rain-effect"></div>}
            {condition.toLowerCase().includes("snow") && <div className="snow-effect"></div>}
            {condition.toLowerCase().includes("thunder") && <div className="thunder-effect"></div>}
            {condition.toLowerCase().includes("sunny") && <div className="sun-rays-effect"></div>}
          </div>
        )}
      </div>
      <style jsx>{`
        .weather-icon-animated {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .rain-effect {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2));
          animation: rain 1s linear infinite;
        }
        
        .snow-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, white 1px, transparent 1px);
          background-size: 8px 8px;
          animation: snow 3s linear infinite;
        }
        
        .thunder-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(250, 204, 21, 0);
          animation: thunder 2s ease-in-out infinite;
        }
        
        .sun-rays-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 0 0 10px rgba(251, 191, 36, 0.2);
          animation: sun-rays 3s ease-in-out infinite;
        }
        
        @keyframes rain {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes snow {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px) translateX(5px); opacity: 0; }
        }
        
        @keyframes thunder {
          0%, 100% { background: rgba(250, 204, 21, 0); }
          50% { background: rgba(250, 204, 21, 0.3); }
        }
        
        @keyframes sun-rays {
          0%, 100% { box-shadow: 0 0 0 5px rgba(251, 191, 36, 0.2); }
          50% { box-shadow: 0 0 0 15px rgba(251, 191, 36, 0.1); }
        }
      `}</style>
    </div>
  )
}
