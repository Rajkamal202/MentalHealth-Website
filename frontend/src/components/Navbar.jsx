import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { Bell, Home, BarChart2,  BookOpen, Calendar, MessageSquare, Settings, Menu, LayoutDashboardIcon, BookUser } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', icon:Home, label: 'Home' },
    { href: '/dashboard', icon:LayoutDashboardIcon, label: 'Dashboard' },
    { href: '/check-in', icon: BookOpen, label: 'Check-in' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/reports', icon: BarChart2, label: 'Reports' },
    { href: '/onboarding', icon: BookUser, label: 'Personlize-Feedback' },
    { href: '/profile', icon: Settings, label: 'Profile' },
  ]

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Announcement Banner */}
      <div className="bg-primary px-4 py-2 text-primary-foreground">
        <div className="container mx-auto text-center text-sm font-medium">
          Take care of your mental health today
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-16 w-20 bg-white flex items-center justify-center">
              <img
                src="/Mind.png"
                alt="Mental Health Logo"
                className="relative z-10 w-full h-auto"
                width={50}
                height={50}
              />
              </div>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <Bell className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button 
                    onClick={logout}
                    variant="ghost"
                    className="hidden md:inline-flex hover:bg-primary/10"
                  >
                    Logout
                  </Button>
                  <Button
                    className="md:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && user && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex flex-col p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="my-4" />
              <Button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start px-4"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}








