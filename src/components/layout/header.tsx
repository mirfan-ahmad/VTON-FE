"use client"

import { Button } from "@/components/ui/button"
import supabase from "@/lib/supabase"
import { MenuIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Handle dropdown menu
  const [userName, setUserName] = useState<string>("") // Store user's name
  const [userAvatar, setUserAvatar] = useState<string | null>(null) // Store user's avatar URL
  const navigate = useNavigate()

  // Check user authentication status when the component mounts
  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession() // Get current session using getSession()

      if (session) {
        setIsLoggedIn(true)
        setUserName(session.user?.email ?? "User") // Set username or fallback to 'User'

        // Check for user metadata to get profile picture
        const { user } = session
        if (user?.user_metadata?.avatar_url) {
          setUserAvatar(user.user_metadata.avatar_url)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    checkUserSession()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut() // Sign out using Supabase
    setIsLoggedIn(false)
     setIsMenuOpen(!isMenuOpen)
    navigate("/") // Redirect to the homepage after logout
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.png" style={{ maxWidth: "35%", height: "auto" }} alt="VirtualTryOn Logo" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/pricing" className="transition-colors hover:text-blue-600">
              Pricing
            </Link>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/try-room" className="transition-colors hover:text-blue-600">
              Try Room
            </Link>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/contact" className="transition-colors hover:text-blue-600">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            // If logged in, show the avatar, name, and dropdown
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userAvatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName.charAt(0).toUpperCase()}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-800">{userName}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                  <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/try-room" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Try Room
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button className="ml-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-4 p-4">
          <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/try-room" className="transition-colors hover:text-blue-600">
              Try Room
            </Link>
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/pricing" className="transition-colors hover:text-blue-600">
              Pricing
            </Link>
            <Link  onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
           
           
            <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/contact" className="transition-colors hover:text-blue-600">
              Contact
            </Link>
            {!isLoggedIn ? (
              <>
                <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/login" className="transition-colors hover:text-blue-600">
                  Login
                </Link>
                <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  to="/signup" className="transition-colors hover:text-blue-600">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 py-2">
                  {userAvatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={userAvatar || "/placeholder.svg"}
                        alt={userName.charAt(0).toUpperCase()}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-800">{userName}</span>
                </div>
                <Link to="/" onClick={handleLogout} className="transition-colors hover:text-blue-600">
                  Logout
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
