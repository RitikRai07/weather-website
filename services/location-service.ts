// Location storage keys
const LOCATION_STORAGE_KEY = "weather_app_location"
const LOCATION_PERMISSION_KEY = "weather_app_location_permission"

// Location interface
export interface SavedLocation {
  lat: number
  lon: number
  city?: string
  country?: string
  timestamp: number
}

// Save location to localStorage
export function saveLocation(location: SavedLocation): void {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location))
  } catch (error) {
    console.error("Error saving location:", error)
  }
}

// Get saved location from localStorage
export function getSavedLocation(): SavedLocation | null {
  try {
    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!savedLocation) return null

    const location = JSON.parse(savedLocation) as SavedLocation

    // Check if location is still valid (less than 24 hours old)
    const now = Date.now()
    const locationAge = now - location.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (locationAge > maxAge) {
      // Location is too old, remove it
      localStorage.removeItem(LOCATION_STORAGE_KEY)
      return null
    }

    return location
  } catch (error) {
    console.error("Error getting saved location:", error)
    return null
  }
}

// Save location permission status
export function saveLocationPermission(status: "granted" | "denied" | "prompt"): void {
  try {
    localStorage.setItem(LOCATION_PERMISSION_KEY, status)
  } catch (error) {
    console.error("Error saving location permission:", error)
  }
}

// Get saved location permission status
export function getSavedLocationPermission(): string | null {
  try {
    return localStorage.getItem(LOCATION_PERMISSION_KEY)
  } catch (error) {
    console.error("Error getting saved location permission:", error)
    return null
  }
}
