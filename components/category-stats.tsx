"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUp, ArrowDown, Flame, BarChart2 } from "lucide-react"

interface CategoryStat {
  name: string
  count: number
  trend: "up" | "down" | "stable"
  percentage: number
}

interface CategoryStatsProps {
  newsItems?: any[]
}

export function CategoryStats({ newsItems = [] }: CategoryStatsProps) {
  const [stats, setStats] = useState<CategoryStat[]>([])
  const [trendingCategories, setTrendingCategories] = useState<CategoryStat[]>([])

  useEffect(() => {
    if (newsItems.length === 0) return

    // Calculate category statistics
    const categoryMap = new Map<string, number>()

    newsItems.forEach((item) => {
      if (!item.categories) return

      const categories = Array.isArray(item.categories) ? item.categories : [item.categories]

      categories.forEach((category) => {
        const currentCount = categoryMap.get(category) || 0
        categoryMap.set(category, currentCount + 1)
      })
    })

    // Convert to array and calculate percentages
    const totalItems = newsItems.length
    const categoryStats: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([name, count]) => {
        // Simulate trend data (in a real app, this would come from historical data)
        const trendOptions: ("up" | "down" | "stable")[] = ["up", "down", "stable"]
        const trend = trendOptions[Math.floor(Math.random() * trendOptions.length)]

        return {
          name,
          count,
          trend,
          percentage: Math.round((count / totalItems) * 100),
        }
      })
      .sort((a, b) => b.count - a.count)

    setStats(categoryStats)

    // Set trending categories (those with 'up' trend and highest counts)
    const trending = categoryStats.filter((stat) => stat.trend === "up").slice(0, 3)

    setTrendingCategories(trending)
  }, [newsItems])

  if (stats.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px]">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          <CardTitle className="text-lg flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.slice(0, 5).map((stat) => (
              <div key={stat.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                    >
                      {stat.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{stat.count} articles</span>
                  </div>
                  <div>
                    {stat.trend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                    {stat.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <Progress value={stat.percentage} className="h-2 bg-blue-100 dark:bg-blue-900/30">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                </Progress>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-orange-100 dark:border-orange-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px]">
        <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30">
          <CardTitle className="text-lg flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-500" />
            Trending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingCategories.length > 0 ? (
            <div className="space-y-4">
              {trendingCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-md border border-orange-100 dark:border-orange-900/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 mr-2 border-none">
                      {category.name}
                    </Badge>
                    <span className="text-sm">{category.count} articles</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-500">Trending</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-md border border-orange-100 dark:border-orange-900/30">
              <Flame className="h-12 w-12 mx-auto mb-2 text-orange-300 dark:text-orange-700" />
              <p className="text-muted-foreground">No trending categories at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
