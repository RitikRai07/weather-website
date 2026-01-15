"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Mic,
  StopCircle,
  SkipForward,
  SkipBack,
  Volume,
} from "lucide-react"

interface VoiceWeatherReportProps {
  weatherData?: any
  location?: string
  temperature?: number
  condition?: string
  feelsLike?: number
  humidity?: number
  windSpeed?: number
  windDirection?: string
  precipitation?: number
  forecast?: any[]
  alerts?: any[]
}

export function VoiceWeatherReport({
  weatherData,
  location = "Unknown Location",
  temperature = 25,
  condition = "clear",
  feelsLike = 25,
  humidity = 60,
  windSpeed = 10,
  windDirection = "North",
  precipitation = 0,
  forecast = [],
  alerts = [],
}: VoiceWeatherReportProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeForecast, setIncludeForecast] = useState(true)
  const [includeAlerts, setIncludeAlerts] = useState(true)
  const [progress, setProgress] = useState(0)
  const [reportText, setReportText] = useState("")

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Get available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setAvailableVoices(voices)
          // Try to find an English voice
          const englishVoice = voices.find((voice) => voice.lang.includes("en") && voice.localService)
          setVoice(englishVoice || voices[0])
        }
      }

      // Chrome needs a timeout for voices to load
      setTimeout(loadVoices, 100)

      // For other browsers that fire the voiceschanged event
      window.speechSynthesis.onvoiceschanged = loadVoices

      // Clean up
      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [])

  // Generate weather report text
  useEffect(() => {
    const generateReportText = () => {
      let text = `Weather report for ${location}. `

      // Current conditions
      text += `Current conditions: ${temperature} degrees Celsius, ${condition}. `

      if (includeDetails) {
        text += `It feels like ${feelsLike} degrees. Humidity is ${humidity} percent. Wind speed is ${windSpeed} kilometers per hour from the ${windDirection}. `

        if (precipitation > 0) {
          text += `There is ${precipitation} millimeters of precipitation. `
        }
      }

      // Forecast
      if (includeForecast && forecast && forecast.length > 0) {
        text += "Here's your forecast: "
        forecast.slice(0, 3).forEach((day, index) => {
          const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : day.day
          text += `${dayName}: ${day.condition} with a high of ${day.maxTemp} and a low of ${day.minTemp} degrees. `
        })
      }

      // Alerts
      if (includeAlerts && alerts && alerts.length > 0) {
        text += "Weather alerts: "
        alerts.forEach((alert) => {
          text += `${alert.title}. ${alert.description} `
        })
      }

      return text
    }

    setReportText(generateReportText())
  }, [
    location,
    temperature,
    condition,
    feelsLike,
    humidity,
    windSpeed,
    windDirection,
    precipitation,
    forecast,
    alerts,
    includeDetails,
    includeForecast,
    includeAlerts,
  ])

  // Play weather report
  const playWeatherReport = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Speech synthesis is not supported in your browser.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(reportText)
      utteranceRef.current = utterance

      // Set voice properties
      if (voice) utterance.voice = voice
      utterance.volume = isMuted ? 0 : volume / 100
      utterance.rate = rate
      utterance.pitch = pitch

      // Set up event handlers
      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
        setIsLoading(false)

        // Start progress tracking
        const startTime = Date.now()
        const totalDuration = (reportText.length / utterance.rate) * 50 // Rough estimate

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }

        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progressValue = Math.min(100, (elapsed / totalDuration) * 100)
          setProgress(progressValue)
        }, 100)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setProgress(100)

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      utterance.onerror = (event) => {
        setError(`An error occurred: ${event.error}`)
        setIsPlaying(false)
        setIsPaused(false)
        setIsLoading(false)

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      // Speak the utterance
      window.speechSynthesis.speak(utterance)
    } catch (err) {
      setError(`Failed to play weather report: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // Pause/resume speech
  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  // Stop speech
  const stopSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)

    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : volume / 100
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume / 100
    }
  }

  // Skip to next section
  const skipForward = () => {
    stopSpeech()
    setCurrentSection((prev) => Math.min(prev + 1, 2))
    setTimeout(playWeatherReport, 100)
  }

  // Skip to previous section
  const skipBackward = () => {
    stopSpeech()
    setCurrentSection((prev) => Math.max(prev - 1, 0))
    setTimeout(playWeatherReport, 100)
  }

  // Refresh report
  const refreshReport = () => {
    stopSpeech()
    setTimeout(playWeatherReport, 100)
  }

  return (
    <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader className="p-4 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Voice Weather Report
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs rounded-full"
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1 block">Voice</Label>
                  <select
                    value={voice?.name || ""}
                    onChange={(e) => {
                      const selectedVoice = availableVoices.find((v) => v.name === e.target.value)
                      if (selectedVoice) setVoice(selectedVoice)
                    }}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">Speed: {rate.toFixed(1)}x</Label>
                  <Slider value={[rate]} min={0.5} max={2} step={0.1} onValueChange={(value) => setRate(value[0])} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">Pitch: {pitch.toFixed(1)}</Label>
                  <Slider value={[pitch]} min={0.5} max={2} step={0.1} onValueChange={(value) => setPitch(value[0])} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-1 block">Report Content</Label>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-details" className="text-sm">
                      Include Weather Details
                    </Label>
                    <Switch id="include-details" checked={includeDetails} onCheckedChange={setIncludeDetails} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-forecast" className="text-sm">
                      Include Forecast
                    </Label>
                    <Switch id="include-forecast" checked={includeForecast} onCheckedChange={setIncludeForecast} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-alerts" className="text-sm">
                      Include Alerts
                    </Label>
                    <Switch id="include-alerts" checked={includeAlerts} onCheckedChange={setIncludeAlerts} />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setShowSettings(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">{location}</div>
                <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Weather Report</div>
                    <div className="text-xs text-muted-foreground">
                      {reportText.length > 50 ? reportText.substring(0, 50) + "..." : reportText}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={skipBackward}
                      disabled={isLoading || currentSection === 0}
                      className="h-8 w-8 rounded-full"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    {isLoading ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50"
                      >
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      </Button>
                    ) : isPlaying ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePause}
                          className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50"
                        >
                          {isPaused ? (
                            <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Pause className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={stopSpeech} className="h-8 w-8 rounded-full">
                          <StopCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playWeatherReport}
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50"
                      >
                        <Play className="h-5 w-5 ml-0.5 text-blue-600 dark:text-blue-400" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={skipForward}
                      disabled={isLoading || currentSection >= 2}
                      className="h-8 w-8 rounded-full"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 rounded-full">
                      {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <div className="relative group">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Volume className="h-4 w-4" />
                      </Button>
                      <div className="absolute left-full top-0 ml-2 hidden group-hover:block bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10">
                        <Slider
                          orientation="vertical"
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          className="h-24"
                          onValueChange={handleVolumeChange}
                        />
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" onClick={refreshReport} className="h-8 w-8 rounded-full">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center">
                Click the settings button to customize the voice and report content
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
