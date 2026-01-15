"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, useTexture, Cloud, Stars, Html, Text, PerspectiveCamera } from "@react-three/drei"
import { type Mesh, Vector3, Color, MathUtils } from "three"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, CloudIcon, CloudRain, CloudSnow, Wind, Thermometer, Droplets } from "lucide-react"

interface Weather3DVisualizationProps {
  weatherData?: any
  location?: string
  temperature?: number
  condition?: string
  humidity?: number
  windSpeed?: number
  precipitation?: number
  timeOfDay?: "day" | "night" | "dawn" | "dusk"
}

export function Weather3DVisualization({
  weatherData,
  location = "Unknown Location",
  temperature = 25,
  condition = "clear",
  humidity = 60,
  windSpeed = 10,
  precipitation = 0,
  timeOfDay = "day",
}: Weather3DVisualizationProps) {
  const [activeView, setActiveView] = useState<"globe" | "scene">("scene")
  const [autoRotate, setAutoRotate] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  // Determine environment preset based on time of day
  const getEnvironmentPreset = () => {
    switch (timeOfDay) {
      case "dawn":
        return "dawn"
      case "dusk":
        return "sunset"
      case "night":
        return "night"
      default:
        return "city"
    }
  }

  // Determine if we should show stars based on time of day
  const shouldShowStars = timeOfDay === "night" || timeOfDay === "dusk"

  // Determine scene background color based on time of day and weather
  const getSceneBackground = () => {
    const conditionLower = condition.toLowerCase()

    if (timeOfDay === "night") {
      return "#0f172a" // dark blue for night
    } else if (timeOfDay === "dawn") {
      return "#fef3c7" // light amber for dawn
    } else if (timeOfDay === "dusk") {
      return "#7e22ce" // purple for dusk
    } else {
      // Day time
      if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
        return "#64748b" // slate for rainy day
      } else if (conditionLower.includes("cloud")) {
        return "#93c5fd" // light blue for cloudy day
      } else {
        return "#0ea5e9" // sky blue for clear day
      }
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader className="p-4 border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              3D Weather Visualization
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView(activeView === "globe" ? "scene" : "globe")}
              className="text-xs rounded-full"
            >
              {activeView === "globe" ? "Weather Scene" : "Earth View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="text-xs rounded-full"
            >
              {autoRotate ? "Stop Rotation" : "Auto Rotate"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)} className="text-xs rounded-full">
              {showInfo ? "Hide Info" : "Show Info"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[500px] relative">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 50 }}>
            <color attach="background" args={[getSceneBackground()]} />
            <fog attach="fog" args={[getSceneBackground(), 10, 50]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={timeOfDay === "night" ? 0.2 : 1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

            {activeView === "globe" ? (
              <WeatherGlobe
                location={location}
                temperature={temperature}
                condition={condition}
                autoRotate={autoRotate}
                timeOfDay={timeOfDay}
              />
            ) : (
              <WeatherScene
                condition={condition}
                temperature={temperature}
                humidity={humidity}
                windSpeed={windSpeed}
                precipitation={precipitation}
                timeOfDay={timeOfDay}
                showInfo={showInfo}
                location={location}
              />
            )}

            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              enableZoom={true}
              enablePan={true}
              minDistance={5}
              maxDistance={50}
            />

            {shouldShowStars && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
            <Environment preset={getEnvironmentPreset()} />
          </Canvas>

          {/* Weather info overlay */}
          {showInfo && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20 dark:border-white/10 pointer-events-auto"
              >
                <div className="flex items-center gap-4 text-white">
                  <div className="text-center">
                    <Thermometer className="h-5 w-5 mx-auto mb-1 text-red-400" />
                    <div className="text-sm font-medium">{temperature}°C</div>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                    <div className="text-sm font-medium">{humidity}%</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-5 w-5 mx-auto mb-1 text-purple-400" />
                    <div className="text-sm font-medium">{windSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    {condition.toLowerCase().includes("rain") ? (
                      <CloudRain className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                    ) : condition.toLowerCase().includes("snow") ? (
                      <CloudSnow className="h-5 w-5 mx-auto mb-1 text-blue-200" />
                    ) : condition.toLowerCase().includes("cloud") ? (
                      <CloudIcon className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                    ) : (
                      <Sun className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                    )}
                    <div className="text-sm font-medium">{condition}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Earth Globe Component
function WeatherGlobe({ location, temperature, condition, autoRotate, timeOfDay }) {
  const earthRef = useRef<Mesh>(null)
  const cloudsRef = useRef<Mesh>(null)
  const atmosphereRef = useRef<Mesh>(null)

  // Load textures
  const [earthTexture, cloudsTexture, normalMap] = useTexture([
    "/assets/3d/texture_earth.jpg",
    "/placeholder.svg?height=1024&width=1024", // Placeholder for clouds
    "/placeholder.svg?height=1024&width=1024", // Placeholder for normal map
  ])

  // Rotate the earth
  useFrame(({ clock }) => {
    if (earthRef.current && autoRotate) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (cloudsRef.current && autoRotate) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07
    }
  })

  // Get atmosphere color based on time of day
  const getAtmosphereColor = () => {
    switch (timeOfDay) {
      case "dawn":
        return new Color("#fef3c7").lerp(new Color("#3b82f6"), 0.3)
      case "dusk":
        return new Color("#7e22ce").lerp(new Color("#3b82f6"), 0.3)
      case "night":
        return new Color("#1e3a8a").lerp(new Color("#3b82f6"), 0.3)
      default:
        return new Color("#3b82f6")
    }
  }

  // Get marker position (simplified for demo)
  const markerPosition = new Vector3(0, 3, 0)

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial map={earthTexture} normalMap={normalMap} metalness={0.1} roughness={0.7} />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef} scale={1.01}>
        <sphereGeometry args={[3.05, 64, 64]} />
        <meshStandardMaterial map={cloudsTexture} transparent={true} opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} scale={1.1}>
        <sphereGeometry args={[3.1, 64, 64]} />
        <meshStandardMaterial color={getAtmosphereColor()} transparent={true} opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Location marker */}
      <group position={markerPosition}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Html position={[0, 0.5, 0]} center distanceFactor={10}>
          <div className="bg-white/80 dark:bg-black/80 px-2 py-1 rounded-lg text-xs whitespace-nowrap">{location}</div>
        </Html>
      </group>

      {/* Temperature display */}
      <Html position={[0, -4, 0]} center>
        <div className="bg-white/80 dark:bg-black/80 px-3 py-2 rounded-lg text-sm">
          <div className="font-bold">{temperature}°C</div>
          <div className="text-xs">{condition}</div>
        </div>
      </Html>
    </group>
  )
}

// Weather Scene Component
function WeatherScene({ condition, temperature, humidity, windSpeed, precipitation, timeOfDay, showInfo, location }) {
  const conditionLower = condition.toLowerCase()
  const [rainCount, setRainCount] = useState(0)
  const [snowCount, setSnowCount] = useState(0)
  const [cloudCount, setCloudCount] = useState(0)

  // Set weather elements based on condition
  useEffect(() => {
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      setRainCount(Math.min(100, precipitation * 10))
      setSnowCount(0)
      setCloudCount(Math.min(20, Math.ceil(humidity / 5)))
    } else if (conditionLower.includes("snow")) {
      setRainCount(0)
      setSnowCount(Math.min(100, precipitation * 10))
      setCloudCount(Math.min(20, Math.ceil(humidity / 5)))
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      setRainCount(0)
      setSnowCount(0)
      setCloudCount(Math.min(20, Math.ceil(humidity / 5)))
    } else {
      // Clear
      setRainCount(0)
      setSnowCount(0)
      setCloudCount(Math.min(5, Math.ceil(humidity / 20)))
    }
  }, [condition, humidity, precipitation, conditionLower])

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={timeOfDay === "night" ? "#1e293b" : "#4ade80"} roughness={1} />
      </mesh>

      {/* Sun or Moon */}
      {timeOfDay === "night" ? (
        <mesh position={[10, 10, -10]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#f1f5f9" />
        </mesh>
      ) : (
        <mesh position={[10, 10, -10]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      )}

      {/* Clouds */}
      {Array.from({ length: cloudCount }).map((_, i) => (
        <Cloud
          key={`cloud-${i}`}
          position={[MathUtils.randFloatSpread(20), MathUtils.randFloat(2, 8), MathUtils.randFloatSpread(20)]}
          scale={MathUtils.randFloat(0.5, 1.5)}
          opacity={MathUtils.randFloat(0.5, 1)}
          speed={MathUtils.randFloat(0.1, 0.5)}
          segments={MathUtils.randInt(10, 20)}
        />
      ))}

      {/* Rain */}
      {rainCount > 0 && <RainEffect count={rainCount} />}

      {/* Snow */}
      {snowCount > 0 && <SnowEffect count={snowCount} />}

      {/* Location text */}
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color={timeOfDay === "night" ? "white" : "black"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Regular.json"
      >
        {location}
      </Text>

      {/* Weather info panel */}
      {showInfo && (
        <Html position={[0, 0, 0]} center>
          <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-white/10 text-white shadow-xl">
            <div className="text-xl font-bold mb-2">{temperature}°C</div>
            <div className="text-sm mb-1">{condition}</div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span>{humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-purple-400" />
                <span>{windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Small house for scale */}
      <group position={[5, -2.5, 5]} scale={0.5}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[1.5, 1, 4]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Trees */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group
          key={`tree-${i}`}
          position={[MathUtils.randFloatSpread(30), -2.5, MathUtils.randFloatSpread(30)]}
          scale={MathUtils.randFloat(0.5, 1)}
        >
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Rain Effect Component
function RainEffect({ count = 50 }) {
  const rainRef = useRef<any>()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  useFrame(() => {
    if (rainRef.current) {
      rainRef.current.rotation.x = 0.1

      // Update each raindrop
      const positions = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        // Move raindrop down
        positions[i + 1] -= 0.2

        // Reset position if below ground
        if (positions[i + 1] < -10) {
          positions[i] = MathUtils.randFloatSpread(50) // x
          positions[i + 1] = MathUtils.randFloat(0, 20) // y
          positions[i + 2] = MathUtils.randFloatSpread(50) // z
        }
      }

      rainRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Create raindrops
  const rainPositions = []
  for (let i = 0; i < count; i++) {
    rainPositions.push(
      MathUtils.randFloatSpread(50), // x
      MathUtils.randFloat(-10, 20), // y
      MathUtils.randFloatSpread(50), // z
    )
  }

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(rainPositions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#93c5fd" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

// Snow Effect Component
function SnowEffect({ count = 50 }) {
  const snowRef = useRef<any>()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  useFrame(() => {
    if (snowRef.current) {
      // Update each snowflake
      const positions = snowRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        // Move snowflake down and slightly to the side
        positions[i] += MathUtils.randFloatSpread(0.1) // x (slight sideways movement)
        positions[i + 1] -= 0.05 // y (slower than rain)
        positions[i + 2] += MathUtils.randFloatSpread(0.1) // z (slight sideways movement)

        // Reset position if below ground
        if (positions[i + 1] < -10) {
          positions[i] = MathUtils.randFloatSpread(50) // x
          positions[i + 1] = MathUtils.randFloat(0, 20) // y
          positions[i + 2] = MathUtils.randFloatSpread(50) // z
        }
      }

      snowRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Create snowflakes
  const snowPositions = []
  for (let i = 0; i < count; i++) {
    snowPositions.push(
      MathUtils.randFloatSpread(50), // x
      MathUtils.randFloat(-10, 20), // y
      MathUtils.randFloatSpread(50), // z
    )
  }

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(snowPositions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="white" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}
