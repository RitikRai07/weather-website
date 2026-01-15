"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Download,
  Heart,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface WeatherVideoModalProps {
  isOpen: boolean
  onClose: () => void
  location: string
  videoId?: string | null
}

export function WeatherVideoModal({ isOpen, onClose, location, videoId }: WeatherVideoModalProps) {
  const [muted, setMuted] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const [showControls, setShowControls] = useState(true)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [liked, setLiked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState("720p")
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [buffering, setBuffering] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Video sources based on videoId
  const getVideoSources = () => {
    if (!videoId) return []

    // In a real implementation, you would map videoId to actual video sources
    return [
      { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", quality: "720p" },
      {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        quality: "480p",
      },
      { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", quality: "360p" },
    ]
  }

  // Get current video source based on selected quality
  const getCurrentVideoSource = () => {
    const sources = getVideoSources()
    return sources.find((source) => source.quality === quality)?.src || sources[0]?.src
  }

  useEffect(() => {
    if (isOpen) {
      // Reset loading state when modal opens
      setLoading(true)
      setError(null)
      setCurrentTime(0)
      setDuration(0)
      setPlaying(false)
      setBuffering(false)

      // Simulate video loading
      const timer = setTimeout(() => {
        setLoading(false)
        // Auto-play after loading
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setPlaying(true)
            })
            .catch((err) => {
              console.error("Video playback error:", err)
              setError("Video playback failed. Please try again.")
            })
        }
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, videoId, quality])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const onDurationChange = () => {
      setDuration(video.duration)
    }

    const onEnded = () => {
      setPlaying(false)
    }

    const onWaiting = () => {
      setBuffering(true)
    }

    const onPlaying = () => {
      setBuffering(false)
    }

    const onError = () => {
      setError("An error occurred while playing the video.")
      setLoading(false)
      setBuffering(false)
    }

    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("durationchange", onDurationChange)
    video.addEventListener("ended", onEnded)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("playing", onPlaying)
    video.addEventListener("error", onError)

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("durationchange", onDurationChange)
      video.removeEventListener("ended", onEnded)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("playing", onPlaying)
      video.removeEventListener("error", onError)
    }
  }, [])

  // Handle volume change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100
      setMuted(volume === 0)
    }
  }, [volume])

  // Handle playback speed change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // Auto-hide controls after inactivity
  useEffect(() => {
    const hideControls = () => {
      if (playing) {
        setShowControls(false)
      }
    }

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (showControls) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, playing])

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(50)
    } else {
      setVolume(0)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return

    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current
        .play()
        .then(() => {
          setPlaying(true)
        })
        .catch((err) => {
          console.error("Video playback error:", err)
          setError("Video playback failed. Please try again.")
        })
    }
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const skipForward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
  }

  const skipBackward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
  }

  // Get video title based on videoId
  const getVideoTitle = () => {
    if (!videoId) {
      return `Live Weather Updates for ${location}`
    }

    // In a real implementation, you would map videoId to actual video titles
    return `Weather Forecast for ${location} - ${new Date().toLocaleDateString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`sm:max-w-[800px] p-0 overflow-hidden ${fullscreen ? "fixed inset-0 w-screen h-screen max-w-none rounded-none" : ""}`}
      >
        <DialogHeader className="p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-900/90 to-indigo-900/90 text-white">
          <DialogTitle className="text-white">{getVideoTitle()}</DialogTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                    className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{liked ? "Unlike" : "Like"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative aspect-video bg-black"
          onMouseMove={() => {
            setShowControls(true)
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current)
              controlsTimeoutRef.current = setTimeout(() => {
                if (playing) setShowControls(false)
              }, 3000)
            }
          }}
          onClick={togglePlay}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-white text-sm">Loading video...</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="flex flex-col items-center text-center p-6">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-white text-lg font-medium mb-2">Video Error</p>
                <p className="text-gray-300 text-sm mb-4">{error}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setError(null)
                    setLoading(true)
                    setTimeout(() => {
                      setLoading(false)
                      if (videoRef.current) {
                        videoRef.current.load()
                        videoRef.current
                          .play()
                          .then(() => setPlaying(true))
                          .catch(() => setError("Video playback failed again. Please try later."))
                      }
                    }, 1000)
                  }}
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={getCurrentVideoSource()} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Big play button in the center when paused */}
              {!playing && !buffering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-blue-600/80 flex items-center justify-center"
                    onClick={togglePlay}
                  >
                    <Play className="h-10 w-10 text-white ml-1" />
                  </motion.button>
                </div>
              )}

              {/* Buffering indicator */}
              {buffering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                </div>
              )}

              {/* Video controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-16"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Progress bar */}
                    <div className="mb-4">
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-blue-500/30 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-blue-500 [&>span:first-child_span]:bg-blue-500"
                      />
                      <div className="flex justify-between text-xs text-white/80 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={skipBackward}
                                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                              >
                                <SkipBack className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">10s Back</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglePlay}
                                className="h-10 w-10 rounded-full text-white hover:bg-white/20"
                              >
                                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">{playing ? "Pause" : "Play"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={skipForward}
                                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                              >
                                <SkipForward className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">10s Forward</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="relative ml-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={toggleMute}
                                  onMouseEnter={() => setShowVolumeSlider(true)}
                                  className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                                >
                                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">{muted ? "Unmute" : "Mute"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AnimatePresence>
                            {showVolumeSlider && (
                              <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 100 }}
                                exit={{ opacity: 0, width: 0 }}
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black/80 rounded-full px-3 py-2"
                                onMouseLeave={() => setShowVolumeSlider(false)}
                              >
                                <Slider
                                  value={[volume]}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onValueChange={handleVolumeChange}
                                  className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-blue-500 [&>span:first-child_span]:bg-blue-500"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 px-2 py-1 rounded-md flex items-center mr-2">
                          <span className="animate-pulse mr-1 h-2 w-2 bg-white rounded-full"></span>
                          <span className="text-white text-xs font-medium">LIVE</span>
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSettings(!showSettings)}
                                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                              >
                                <Settings className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Settings</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // In a real implementation, this would download the video
                                  alert("Download started")
                                }}
                                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                              >
                                <Download className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullscreen}
                                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
                              >
                                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Settings panel */}
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-4 w-56"
                        >
                          <h4 className="text-white text-sm font-medium mb-3">Settings</h4>

                          <div className="space-y-4">
                            <div>
                              <p className="text-white/80 text-xs mb-2">Quality</p>
                              <div className="grid grid-cols-3 gap-1">
                                {["360p", "480p", "720p"].map((q) => (
                                  <button
                                    key={q}
                                    onClick={() => setQuality(q)}
                                    className={`text-xs py-1 px-2 rounded ${
                                      quality === q
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/10 text-white/80 hover:bg-white/20"
                                    }`}
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-white/80 text-xs mb-2">Playback Speed</p>
                              <div className="grid grid-cols-4 gap-1">
                                {[0.5, 1, 1.5, 2].map((speed) => (
                                  <button
                                    key={speed}
                                    onClick={() => setPlaybackSpeed(speed)}
                                    className={`text-xs py-1 px-2 rounded ${
                                      playbackSpeed === speed
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/10 text-white/80 hover:bg-white/20"
                                    }`}
                                  >
                                    {speed}x
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
