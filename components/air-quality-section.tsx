"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Wind, Info, TreesIcon as Lungs, Leaf, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface AirQualityData {
  co: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  "us-epa-index": number
  "gb-defra-index"?: number
}

interface AirQualitySectionProps {
  airQuality: AirQualityData
  location: string
}

export function AirQualitySection({ airQuality, location }: AirQualitySectionProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "health">("overview")
  const [showMore, setShowMore] = useState(false)

  // Get AQI color and text
  const getAqiColor = (index: number) => {
    switch (index) {
      case 1:
        return "text-green-500"
      case 2:
        return "text-yellow-500"
      case 3:
        return "text-orange-500"
      case 4:
        return "text-red-500"
      case 5:
        return "text-purple-500"
      case 6:
        return "text-rose-800"
      default:
        return "text-gray-500"
    }
  }

  const getAqiBgColor = (index: number) => {
    switch (index) {
      case 1:
        return "bg-green-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-orange-500"
      case 4:
        return "bg-red-500"
      case 5:
        return "bg-purple-500"
      case 6:
        return "bg-rose-800"
      default:
        return "bg-gray-500"
    }
  }

  const getAqiGradient = (index: number) => {
    switch (index) {
      case 1:
        return "from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20"
      case 2:
        return "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20"
      case 3:
        return "from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20"
      case 4:
        return "from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20"
      case 5:
        return "from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20"
      case 6:
        return "from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-800/20"
      default:
        return "from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/20"
    }
  }

  const getAqiText = (index: number) => {
    switch (index) {
      case 1:
        return "Good"
      case 2:
        return "Moderate"
      case 3:
        return "Unhealthy for Sensitive Groups"
      case 4:
        return "Unhealthy"
      case 5:
        return "Very Unhealthy"
      case 6:
        return "Hazardous"
      default:
        return "Unknown"
    }
  }

  // Get health recommendations based on AQI
  const getAqiRecommendation = (index: number) => {
    switch (index) {
      case 1:
        return "Air quality is considered satisfactory, and air pollution poses little or no risk."
      case 2:
        return "Air quality is acceptable; however, there may be some health concerns for a small number of people who are unusually sensitive to air pollution."
      case 3:
        return "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
      case 4:
        return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
      case 5:
        return "Health warnings of emergency conditions. The entire population is more likely to be affected."
      case 6:
        return "Health alert: everyone may experience more serious health effects. Avoid outdoor activities."
      default:
        return "No data available."
    }
  }

  // Get health actions based on AQI
  const getHealthActions = (index: number) => {
    switch (index) {
      case 1:
        return ["Enjoy outdoor activities", "Keep windows open for fresh air", "No restrictions needed"]
      case 2:
        return [
          "Consider reducing prolonged outdoor exertion for sensitive groups",
          "Keep windows closed during peak traffic hours",
          "Monitor symptoms if you have respiratory issues",
        ]
      case 3:
        return [
          "People with respiratory or heart disease should limit outdoor exertion",
          "Children and older adults should limit prolonged outdoor exposure",
          "Consider wearing a mask if you have respiratory conditions",
        ]
      case 4:
        return [
          "Avoid prolonged or heavy exertion outdoors",
          "Keep windows closed and use air purifiers if available",
          "Wear masks outdoors, especially if you have health conditions",
        ]
      case 5:
        return [
          "Avoid all outdoor physical activities",
          "Stay indoors with windows closed and air purifiers running",
          "Wear N95 masks if you must go outside",
        ]
      case 6:
        return [
          "Stay indoors with windows and doors closed",
          "Run air purifiers continuously",
          "Avoid any outdoor activity and wear proper protection if you must go outside",
        ]
      default:
        return ["No specific actions recommended"]
    }
  }

  // Calculate percentage for pollutant levels
  const calculatePollutantPercentage = (value: number, pollutant: string) => {
    // Define thresholds for 100% based on EPA standards
    const thresholds: Record<string, number> = {
      pm2_5: 35,
      pm10: 150,
      o3: 0.1,
      no2: 0.1,
      so2: 0.075,
      co: 9,
    }

    return Math.min(100, Math.round((value / thresholds[pollutant]) * 100))
  }

  // Get color for pollutant level
  const getPollutantColor = (percentage: number) => {
    if (percentage < 33) return "bg-green-500"
    if (percentage < 66) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900/50 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader
        className={`pb-2 bg-gradient-to-r ${getAqiGradient(airQuality["us-epa-index"])} border-b border-blue-100/50 dark:border-blue-900/30`}
      >
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Air Quality Index
              </span>
            </CardTitle>
            <CardDescription>Current air quality in {location}</CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${getAqiBgColor(airQuality["us-epa-index"])} text-white font-bold text-sm flex items-center gap-1.5 shadow-md`}
          >
            <span>{airQuality["us-epa-index"]}</span>
            <span>AQI</span>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <div className="px-4 pt-2 border-b">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <Wind className="h-3.5 w-3.5 mr-1.5" />
              Pollutants
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
            >
              <Lungs className="h-3.5 w-3.5 mr-1.5" />
              Health
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-4">
          <TabsContent value="overview" className="mt-0">
            <div className="flex flex-col items-center text-center p-4 space-y-4">
              <div
                className={`h-24 w-24 rounded-full flex items-center justify-center ${getAqiBgColor(airQuality["us-epa-index"])} text-white shadow-lg transition-transform hover:scale-105 duration-300`}
              >
                <span className="text-3xl font-bold">{airQuality["us-epa-index"]}</span>
              </div>

              <div>
                <h3 className={`text-xl font-bold ${getAqiColor(airQuality["us-epa-index"])}`}>
                  {getAqiText(airQuality["us-epa-index"])}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">US EPA Air Quality Index</p>
              </div>

              <div className="w-full max-w-md mt-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: "16.66%" }}></div>
                  <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: "16.66%" }}></div>
                  <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: "16.66%" }}></div>
                  <div className="h-full bg-red-500 transition-all duration-500" style={{ width: "16.66%" }}></div>
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: "16.66%" }}></div>
                  <div className="h-full bg-rose-800 transition-all duration-500" style={{ width: "16.66%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1 px-1">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                  <span>Hazardous</span>
                </div>

                <div
                  className="w-4 h-4 transform rotate-45 border-t-2 border-r-2 border-gray-500 dark:border-gray-400 absolute transition-all duration-500"
                  style={{
                    left: `calc(${(airQuality["us-epa-index"] - 0.5) * 16.66}% + 1rem)`,
                    marginTop: "-10px",
                  }}
                ></div>
              </div>

              <p className="text-sm text-center max-w-lg mt-2 p-4 bg-background/50 rounded-lg border border-border shadow-sm">
                {getAqiRecommendation(airQuality["us-epa-index"])}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">PM2.5</span>
                    <span className="text-sm">{airQuality.pm2_5.toFixed(1)} µg/m³</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.pm2_5, "pm2_5")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.pm2_5, "pm2_5"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Fine particulate matter</p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">PM10</span>
                    <span className="text-sm">{airQuality.pm10.toFixed(1)} µg/m³</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.pm10, "pm10")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.pm10, "pm10"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Coarse particulate matter</p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">O₃</span>
                    <span className="text-sm">{airQuality.o3.toFixed(3)} ppm</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.o3, "o3")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.o3, "o3"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ozone</p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">NO₂</span>
                    <span className="text-sm">{airQuality.no2.toFixed(3)} ppm</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.no2, "no2")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.no2, "no2"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Nitrogen dioxide</p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">SO₂</span>
                    <span className="text-sm">{airQuality.so2.toFixed(3)} ppm</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.so2, "so2")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.so2, "so2"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Sulfur dioxide</p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">CO</span>
                    <span className="text-sm">{airQuality.co.toFixed(1)} ppm</span>
                  </div>
                  <Progress
                    value={calculatePollutantPercentage(airQuality.co, "co")}
                    className={`h-2 ${getPollutantColor(calculatePollutantPercentage(airQuality.co, "co"))}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Carbon monoxide</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">About Air Pollutants</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      These values show the concentration of major air pollutants. PM2.5 and PM10 are particulate
                      matter, measured in micrograms per cubic meter (µg/m³). Gases like O₃, NO₂, SO₂, and CO are
                      measured in parts per million (ppm).
                    </p>

                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-blue-500 mt-1"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show less" : "Learn more about pollutants"}
                      {showMore ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    <AnimatePresence>
                      {showMore && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-2 text-xs">
                            <p>
                              <strong>PM2.5:</strong> Fine particles that can penetrate deep into lungs and bloodstream.
                            </p>
                            <p>
                              <strong>PM10:</strong> Larger inhalable particles that can irritate eyes, nose, and
                              throat.
                            </p>
                            <p>
                              <strong>O₃ (Ozone):</strong> Can trigger respiratory issues like asthma and reduce lung
                              function.
                            </p>
                            <p>
                              <strong>NO₂:</strong> Contributes to respiratory problems and formation of particulate
                              matter.
                            </p>
                            <p>
                              <strong>SO₂:</strong> Can harm respiratory system and contribute to acid rain.
                            </p>
                            <p>
                              <strong>CO:</strong> Reduces oxygen delivery to organs and can cause headaches and
                              dizziness.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health" className="mt-0">
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg bg-opacity-10 dark:bg-opacity-20 border shadow-sm`}
                style={{
                  backgroundColor: `${getAqiBgColor(airQuality["us-epa-index"])}20`,
                  borderColor: `${getAqiBgColor(airQuality["us-epa-index"])}30`,
                }}
              >
                <div className="flex items-start gap-3">
                  {airQuality["us-epa-index"] <= 2 ? (
                    <Leaf className={`h-5 w-5 ${getAqiColor(airQuality["us-epa-index"])}`} />
                  ) : (
                    <AlertTriangle className={`h-5 w-5 ${getAqiColor(airQuality["us-epa-index"])}`} />
                  )}
                  <div>
                    <h3 className={`font-medium ${getAqiColor(airQuality["us-epa-index"])}`}>
                      {getAqiText(airQuality["us-epa-index"])} Air Quality
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getAqiRecommendation(airQuality["us-epa-index"])}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Lungs className="h-4 w-4 text-blue-500" />
                  Recommended Actions
                </h4>

                <ul className="space-y-2">
                  {getHealthActions(airQuality["us-epa-index"]).map((action, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm p-2 bg-background/50 rounded-lg border border-border/50 shadow-sm"
                    >
                      <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5 shadow-sm">
                        {index + 1}
                      </div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all hover:scale-105"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  More health information
                </Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="p-3 border-t border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 text-xs text-center text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>Data updated every hour</span>
          <span>Source: US EPA Air Quality Index</span>
        </div>
      </CardFooter>
    </Card>
  )
}
