// Enhance the loading page with premium styling

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-premium"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-premium"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="premium-glass max-w-md w-full mx-auto rounded-2xl p-8 border border-white/20 dark:border-gray-800/20 shadow-2xl relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 animate-shimmer-premium"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Weather icon with animation */}
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-xl animate-pulse-premium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 text-white animate-float-premium"
                >
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
              </div>

              {/* Animated ring */}
              <div
                className="absolute inset-0 border-4 border-white/30 dark:border-white/10 rounded-full animate-pulse-premium"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            Loading Weather Data
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Fetching the latest weather information for your location
          </p>

          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
            <div className="h-full rounded-full animate-shimmer-premium bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-size-200"></div>
          </div>

          {/* Loading indicators */}
          <div className="flex justify-center items-center space-x-2">
            <div
              className="h-2 w-2 rounded-full bg-blue-500 animate-bounce-premium"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce-premium"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-purple-500 animate-bounce-premium"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
