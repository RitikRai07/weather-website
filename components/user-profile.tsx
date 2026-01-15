"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  X,
  User,
  Lock,
  Save,
  Camera,
  Bell,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronRight,
  Shield,
  HelpCircle,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

interface UserProfileProps {
  onClose: () => void
  onLogout: () => void
}

export function UserProfile({ onClose, onLogout }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [name, setName] = useState(() => {
    const user = localStorage.getItem("weatherCurrentUser")
    return user ? JSON.parse(user).name : ""
  })
  const [email, setEmail] = useState(() => {
    const user = localStorage.getItem("weatherCurrentUser")
    return user ? JSON.parse(user).email : ""
  })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [alertNotifications, setAlertNotifications] = useState(true)
  const [newsNotifications, setNewsNotifications] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem("weatherCurrentUser") || "{}")
      user.name = name
      localStorage.setItem("weatherCurrentUser", JSON.stringify(user))

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")
      const updatedUsers = users.map((u: any) => (u.email === email ? { ...u, name } : u))
      localStorage.setItem("weatherUsers", JSON.stringify(updatedUsers))

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords
    if (newPassword.length < 6) {
      toast({
        title: "Password error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Check current password
      const user = JSON.parse(localStorage.getItem("weatherCurrentUser") || "{}")
      const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")
      const foundUser = users.find((u: any) => u.email === user.email)

      if (!foundUser || foundUser.password !== currentPassword) {
        toast({
          title: "Password error",
          description: "Current password is incorrect.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Update password
      const updatedUsers = users.map((u: any) => (u.email === user.email ? { ...u, password: newPassword } : u))
      localStorage.setItem("weatherUsers", JSON.stringify(updatedUsers))

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated.",
    })
  }

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-2xl w-full h-[80vh] max-h-[700px]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <Card className="border-2 border-primary/20 shadow-lg h-full overflow-hidden flex flex-col">
          <CardHeader className="relative pb-2 border-b">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">My Account</CardTitle>
            <CardDescription>Manage your profile, preferences, and account settings</CardDescription>
          </CardHeader>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-48 border-r p-4 bg-muted/20">
              <Tabs
                orientation="vertical"
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full flex flex-col"
              >
                <TabsList className="flex flex-col h-auto items-stretch gap-1">
                  <TabsTrigger value="profile" className="justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <div className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </Tabs>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="profile" className="mt-0 h-full">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                        {name ? name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Saving</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0 h-full">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Updating</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Active Sessions</p>
                          <p className="text-sm text-muted-foreground">
                            Manage devices where you're currently logged in
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 h-full">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>

                    <Separator className="my-4" />

                    <h4 className="text-md font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weather Alerts</p>
                          <p className="text-sm text-muted-foreground">Severe weather warnings and alerts</p>
                        </div>
                        <Switch checked={alertNotifications} onCheckedChange={setAlertNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weather News</p>
                          <p className="text-sm text-muted-foreground">Latest weather news and updates</p>
                        </div>
                        <Switch checked={newsNotifications} onCheckedChange={setNewsNotifications} />
                      </div>
                    </div>

                    <Button onClick={handleSaveNotifications}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0 h-full">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">App Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("light")}
                          className="h-8 px-3"
                        >
                          <Sun className="h-4 w-4 mr-1" />
                          Light
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className="h-8 px-3"
                        >
                          <Moon className="h-4 w-4 mr-1" />
                          Dark
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Saved Locations</p>
                          <p className="text-sm text-muted-foreground">Manage your favorite locations</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Help & Support</p>
                          <p className="text-sm text-muted-foreground">Get help with using the app</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Support
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
