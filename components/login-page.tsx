"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, User, Lock, Mail, ArrowLeft, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface LoginPageProps {
  onClose: () => void
  onLogin: () => void
}

export function LoginPage({ onClose, onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { toast } = useToast()

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Simulate login process
    setTimeout(() => {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("weatherCurrentUser", JSON.stringify(user))
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })
        onLogin()
      } else {
        setErrorMessage("Invalid email or password. Please try again.")
      }

      setIsLoading(false)
    }, 1500)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Validate password
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Simulate signup process
    setTimeout(() => {
      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")

      // Check if email already exists
      if (users.some((user: any) => user.email === email)) {
        setErrorMessage("Email already in use. Please use a different email or login.")
        setIsLoading(false)
        return
      }

      // Add new user
      const newUser = { name, email, password, favorites: [] }
      users.push(newUser)
      localStorage.setItem("weatherUsers", JSON.stringify(users))

      setSuccessMessage("Account created successfully! You can now log in.")

      // Auto login
      localStorage.setItem("weatherCurrentUser", JSON.stringify(newUser))

      setTimeout(() => {
        onLogin()
      }, 1500)

      setIsLoading(false)
    }, 1500)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Check if email exists
    const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      setErrorMessage("Email not found. Please check your email or create a new account.")
      setIsLoading(false)
      return
    }

    // Simulate sending OTP
    setTimeout(() => {
      // Generate a 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

      // In a real app, you would send this OTP to the user's email
      // For demo purposes, we'll store it in localStorage
      localStorage.setItem(`otp_${email}`, generatedOtp)

      setSuccessMessage(`OTP sent to ${email}. For demo purposes, the OTP is: ${generatedOtp}`)
      setOtpSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Get stored OTP
    const storedOtp = localStorage.getItem(`otp_${email}`)

    if (otp === storedOtp) {
      setOtpVerified(true)
      setSuccessMessage("OTP verified successfully. Please set a new password.")
    } else {
      setErrorMessage("Invalid OTP. Please try again.")
    }

    setIsLoading(false)
  }

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Validate passwords
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Update user password
    const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]")
    const updatedUsers = users.map((u: any) => (u.email === email ? { ...u, password: newPassword } : u))

    localStorage.setItem("weatherUsers", JSON.stringify(updatedUsers))

    // Clean up OTP
    localStorage.removeItem(`otp_${email}`)

    setSuccessMessage("Password reset successfully! You can now log in with your new password.")

    // Reset form state
    setTimeout(() => {
      setForgotPassword(false)
      setOtpSent(false)
      setOtpVerified(false)
      setOtp("")
      setNewPassword("")
      setConfirmPassword("")
      setActiveTab("login")
    }, 2000)

    setIsLoading(false)
  }

  const handleSkip = () => {
    toast({
      title: "Continuing as guest",
      description: "You can create an account later for personalized features.",
    })
    onLogin()
  }

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <Card className="border-2 border-primary/20 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="relative pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Weather Forecast
            </CardTitle>
            <CardDescription className="text-center">
              {forgotPassword
                ? "Reset your password to regain access to your account"
                : "Sign in to save your favorite locations and get personalized weather alerts"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {forgotPassword ? (
              <div className="space-y-4">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-2 -ml-2"
                  onClick={() => {
                    setForgotPassword(false)
                    setOtpSent(false)
                    setOtpVerified(false)
                    setOtp("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setErrorMessage("")
                    setSuccessMessage("")
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Button>

                {/* Error and success messages */}
                {errorMessage && (
                  <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 animate-in fade-in-50 slide-in-from-top-5">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {!otpSent ? (
                  /* Step 1: Enter email */
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Sending OTP</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Send OTP</>
                      )}
                    </Button>
                  </form>
                ) : !otpVerified ? (
                  /* Step 2: Enter OTP */
                  <form onSubmit={verifyOtp} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          className="pl-10"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          maxLength={6}
                          pattern="\d{6}"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Verifying</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Verify OTP</>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Didn't receive the code?{" "}
                      <button type="button" className="text-primary hover:underline" onClick={handleForgotPassword}>
                        Resend OTP
                      </button>
                    </p>
                  </form>
                ) : (
                  /* Step 3: Set new password */
                  <form onSubmit={resetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="New Password"
                          className="pl-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Resetting Password</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Reset Password</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Error and success messages */}
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4 animate-in fade-in-50 slide-in-from-top-5">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 animate-in fade-in-50 slide-in-from-top-5">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" className="rounded text-primary" />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setForgotPassword(true)}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Logging in</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Login</>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary" required />
                      <span>
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Creating account</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>Create Account</>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {!forgotPassword && (
              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="w-full" onClick={handleSkip}>
                    Continue as Guest
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {!forgotPassword && (
            <CardFooter className="flex justify-center text-sm text-muted-foreground bg-gray-50/50 dark:bg-gray-800/50 py-4">
              <p>
                {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                >
                  {activeTab === "login" ? "Sign up" : "Login"}
                </button>
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
