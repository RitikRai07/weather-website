import { AdsTxtManager } from "@/components/ads-txt-manager"

export default function AdsManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ads Management</h1>
      <div className="max-w-md mx-auto">
        <AdsTxtManager />
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-lg font-medium mb-2">How to access your ads.txt file</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your ads.txt file is available at:{" "}
          <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">https://yourdomain.com/ads.txt</code>
        </p>
        <p className="text-sm text-muted-foreground">
          This file is automatically updated with entries from TheMonetizer. You can manually refresh it using the tool
          above.
        </p>
      </div>
    </div>
  )
}
