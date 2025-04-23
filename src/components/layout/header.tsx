import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase';
import { GithubIcon, MenuIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Handle dropdown menu
  const [userName, setUserName] = useState<string>(''); // Store user's name
  const navigate = useNavigate();

  // Check user authentication status when the component mounts
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: {session} } = await supabase.auth.getSession(); // Get current session using getSession()
      console.log(session )
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.user?.email ?? 'User'); // Set username or fallback to 'User'
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUserSession();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out using Supabase
    setIsLoggedIn(false);
    navigate('/'); // Redirect to the homepage after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <a href='/'><img src='/logo.png' style={{maxWidth: "35%", height:"auto"}}></img></a>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
            <Link to="/pricing" className="transition-colors hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/try-room" className="transition-colors hover:text-blue-600">
              Try Room
            </Link>
            <Link to="/contact" className="transition-colors hover:text-blue-600">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
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
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {/* Avatar Placeholder */}
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800">{userName}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className="ml-4 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-4 p-4">
            <Link to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
            <Link to="/pricing" className="transition-colors hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/try-room" className="transition-colors hover:text-blue-600">
              Try Room
            </Link>
            <Link to="/contact" className="transition-colors hover:text-blue-600">
              Contact
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="transition-colors hover:text-blue-600">
                  Login
                </Link>
                <Link to="/signup" className="transition-colors hover:text-blue-600">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link to="/" onClick={handleLogout} className="transition-colors hover:text-blue-600">
                Logout
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
