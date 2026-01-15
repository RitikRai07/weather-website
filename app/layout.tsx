import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern Weather Website - Real-time Weather Forecasts",
  description:
    "Get accurate, real-time weather forecasts, radar maps, and weather alerts for your location. Plan your day with our hourly and 7-day forecasts.",
  keywords: "weather, forecast, real-time weather, weather radar, weather alerts, hourly forecast, 7-day forecast",
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Company",
  openGraph: {
    title: "Modern Weather Website - Real-time Weather Forecasts",
    description: "Get accurate, real-time weather forecasts, radar maps, and weather alerts for your location.",
    url: "https://yourdomain.com",
    siteName: "Modern Weather Website",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Modern Weather Website",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Weather Website - Real-time Weather Forecasts",
    description: "Get accurate, real-time weather forecasts, radar maps, and weather alerts for your location.",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
        <script
          async
          data-cfasync="false"
          src="https://pl28487680.effectivegatecpm.com/cf50a5d1fbce9f6fbd13308d425d2c79/invoke.js"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Modern Weather Website",
              url: "https://yourdomain.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://yourdomain.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <div id="container-cf50a5d1fbce9f6fbd13308d425d2c79"></div>
      </body>
    </html>
  )
}
