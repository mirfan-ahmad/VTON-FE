"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import supabase from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  CheckCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User,
  AlertCircle,
  Shirt,
  Eye,
  EyeOff,
  ChevronRight,
  LogIn,
} from "lucide-react"

// Feature list for the value proposition
const features = [
  {
    icon: <Shirt className="h-5 w-5 text-blue-600" />,
    title: "Virtual Try-On",
    description: "See how clothes look on you without physically wearing them",
  },
  {
    icon: <Zap className="h-5 w-5 text-blue-600" />,
    title: "Instant Results",
    description: "Get realistic previews in seconds with our advanced AI",
  },
  {
    icon: <Smartphone className="h-5 w-5 text-blue-600" />,
    title: "Mobile Friendly",
    description: "Try on clothes anywhere, anytime from any device",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-blue-600" />,
    title: "Secure & Private",
    description: "Your images and data are always protected and private",
  },
]

export function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("email")
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsLoggedIn(true)
        setUser(session.user)
      }
    }

    checkUserSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Redirect the user to the login page or home page after successful signup
      navigate("/login")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !fullName) {
      setError("Please enter your name")
      return
    }
    if (step === 2 && !email) {
      setError("Please enter your email")
      return
    }
    setError("")
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
    setError("")
  }

  const getUserInitials = () => {
    if (!user || !user.user_metadata || !user.user_metadata.full_name) {
      return user?.email?.charAt(0).toUpperCase() || "U"
    }

    const nameParts = user.user_metadata.full_name.split(" ")
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
    }
    return nameParts[0].charAt(0).toUpperCase()
  }

  // If user is already logged in, show a different UI
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* 3D-style header for logged-in users */}
            <div className="relative mb-16 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || "there"}!</h1>
                  <p className="mt-2 max-w-md text-blue-100">
                    You're already signed in. Continue exploring our virtual try-on experience.
                  </p>
                </div>
                <Avatar className="h-16 w-16 border-2 border-white">
                  {user?.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg"} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-blue-800 text-xl">{getUserInitials()}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/try-room")}
                >
                  Go to Try Room
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/account")}
                >
                  My Account
                </Button>
              </div>

              {/* 3D elements */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rotate-45 rounded-xl bg-white/5 backdrop-blur-md"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 -rotate-12 rounded-xl bg-white/5 backdrop-blur-md"></div>
            </div>

            {/* Feature highlights for logged-in users */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl bg-white p-6 shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-medium">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* 3D-style header */}
          <div className="relative mb-16 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600">
                  <Shirt className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold">VirtualTryOn</span>
                <Badge className="bg-white/20 text-white hover:bg-white/30">Beta</Badge>
              </div>

              <div className="mt-8 max-w-xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Try Before You Buy, <span className="text-blue-200">Virtually</span>
                </h1>
                <p className="mt-4 text-lg text-blue-100">
                  Experience clothes shopping like never before with our AI-powered virtual try-on technology.
                </p>
              </div>

              {/* 3D elements */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rotate-45 rounded-xl bg-white/5 backdrop-blur-md"></div>
              <div className="absolute top-20 right-20 h-16 w-16 rotate-12 rounded-xl bg-white/5 backdrop-blur-md"></div>
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Left column: Value proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-8"
            >
              {/* Feature list */}
              <div className="grid gap-6 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Showcase image */}
              <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <img
                  src="https://humanaigc.github.io/outfit-anyone/content/teaser/t1.gif"
                  alt="Virtual Try-On Demo"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/80 p-4 backdrop-blur-sm">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jane Doe</p>
                    <p className="text-sm text-gray-500">Fashion Enthusiast</p>
                  </div>
                </div>
                <p className="mt-4 italic text-gray-700">
                  "This app has completely changed how I shop for clothes online. I can see exactly how items will look
                  on me before purchasing!"
                </p>
              </div>
            </motion.div>

            {/* Right column: Sign up form */}
            <div>
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                    <div className="border-b px-6 pt-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Get Started</h2>
                        <div className="text-sm text-gray-500">Step {step} of 3</div>
                      </div>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email"
                          className={`rounded-xl ${activeTab === "email" ? "bg-blue-200" : ""}`}

                        >Email  </TabsTrigger>
                        <TabsTrigger value="google"
                          className={`rounded-xl ${activeTab === "google" ? "bg-blue-200" : ""}`}

                        >Google</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="email" className="m-0 p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                            <div className="flex">
                              <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
                              {error}
                            </div>
                          </div>
                        )}

                        {/* Step 1: Name */}
                        {step === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                What should we call you?
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder="Enter your full name"
                                  className="pl-10"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                />
                              </div>
                            </div>
                            <Button type="button" onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700">
                              Continue
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}

                        {/* Step 2: Email */}
                        {step === 2 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                                What's your email address?
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="you@example.com"
                                  className="pl-10"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">We'll send you a confirmation email.</p>
                            </div>
                            <div className="flex gap-3">
                              <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                                Back
                              </Button>
                              <Button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Password */}
                        {step === 3 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                Create a password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a secure password"
                                  className="pl-10 pr-10"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                                Confirm password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  className="pl-10 pr-10"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                                Back
                              </Button>
                              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                  </>
                                ) : (
                                  <>
                                    Create account
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Progress indicator */}
                        <div className="mt-6">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span className={step >= 1 ? "font-medium text-blue-600" : ""}>Personal</span>
                            <span className={step >= 2 ? "font-medium text-blue-600" : ""}>Contact</span>
                            <span className={step >= 3 ? "font-medium text-blue-600" : ""}>Security</span>
                          </div>
                          <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                            <div
                              className="h-1 rounded-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="google" className="m-0 space-y-4 p-6">
                      <div className="text-center text-sm text-gray-500">Sign up quickly using your Google account</div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-gray-300 bg-white text-gray-800 hover:bg-gray-50 shadow-sm"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        )}
                        Continue with Google
                      </Button>

                   
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  <span className="flex items-center justify-center gap-1">
                    Sign in <LogIn className="h-3 w-3" />
                  </span>
                </Link>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                        <span>No credit card required</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start for free, no payment information needed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                        <span>Cancel anytime</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>No long-term commitments or contracts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
