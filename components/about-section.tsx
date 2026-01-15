"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AboutSectionProps {
  onClose: () => void
}

export function AboutSection({ onClose }: AboutSectionProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card text-card-foreground rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">About Weather Forecast</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Welcome to Weather Forecast</h3>
            <p>
              Weather Forecast is a modern, feature-rich weather application designed to provide you with accurate and
              up-to-date weather information for any location around the world.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Real-time weather updates based on city input and geolocation</li>
              <li>Dynamic weather icons for better visualization</li>
              <li>7-day forecast view with temperature trends and conditions</li>
              <li>Hourly forecast for the current day</li>
              <li>Search history & favorites to quickly access frequently searched locations</li>
              <li>Dark mode & theme customization for a better user experience</li>
              <li>Background animations based on weather conditions</li>
              <li>Interactive UI elements with smooth animations and transitions</li>
              <li>Error handling for invalid city names and API failures</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">How to Use</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Enter a city name in the search bar and press Enter or click the search button</li>
              <li>Click the location pin icon to use your current location</li>
              <li>Add cities to your favorites by clicking the heart icon</li>
              <li>Access your search history and favorites using the buttons below the search bar</li>
              <li>Toggle between today's hourly forecast and the 7-day forecast using the tabs</li>
              <li>Switch between light and dark mode using the theme toggle button in the header</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Data Source</h3>
            <p>
              Weather data is provided by the OpenWeather API, which offers accurate and reliable weather information
              for locations worldwide.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>React and Next.js for the frontend framework</li>
              <li>Tailwind CSS for styling</li>
              <li>Framer Motion for animations</li>
              <li>OpenWeather API for weather data</li>
              <li>Local storage for saving favorites and search history</li>
            </ul>
          </section>

          <section className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Created with ❤️ by Weather Forecast Team. This application is for demonstration purposes.
            </p>
          </section>
        </div>
      </motion.div>
    </motion.div>
  )
}
