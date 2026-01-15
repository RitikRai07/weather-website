"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, FileText, Check, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdsTxtManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const refreshAdsTxt = async () => {
    setIsLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/ads-txt")

      if (response.ok) {
        setStatus("success")
        toast({
          title: "ads.txt updated successfully",
          description: "Your ads.txt file has been refreshed with the latest entries.",
        })
      } else {
        setStatus("error")
        toast({
          title: "Failed to update ads.txt",
          description: "There was an error updating your ads.txt file. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setStatus("error")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <span>ads.txt Manager</span>
        </CardTitle>
        <CardDescription>Manage your ads.txt file for TheMonetizer integration</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This tool helps you maintain your ads.txt file by automatically merging entries from TheMonetizer with your
          existing ads.txt content.
        </p>

        {status === "success" && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300 mb-4">
            <Check className="h-4 w-4" />
            <span>ads.txt has been successfully updated</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to update ads.txt. Please try again.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={refreshAdsTxt} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating ads.txt...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh ads.txt
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
