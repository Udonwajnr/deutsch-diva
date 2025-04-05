"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Menu, X, LogIn, UserPlus,Github } from "lucide-react"
import { HeaderAuth } from "./header-auth"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import GardenGithubFill12 from "./icons/GardenGithubFill12"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Improved scroll event listener with useEffect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Left Section */}
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-rose-700" />
          <span className="text-xl font-bold text-rose-800">DeutschDiva</span>
        </Link>

        {/* Navigation Links - Center Section */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-rose-700 relative group">
            Home
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link href="/courses/a1-german" className="text-sm font-medium hover:text-rose-700 relative group">
            Course
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-rose-700 relative group">
            About
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-rose-700 relative group">
            Contact
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
        </nav>

        {/* Auth Section - Right Section */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:block">
            <HeaderAuth />
          </div>
          <div className="hidden md:block">
          <Link href="https://github.com/Udonwajnr/deutsch-diva.git" className="flex items-center justify-center   px-3 gap-x-2">
                <GardenGithubFill12 className="h-5 w-5 text-rose-500" />
            </Link>
          </div>

          {/* Mobile Auth & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/signup">
              <Button size="sm" className="bg-rose-700 hover:bg-rose-800 px-3">
                <UserPlus className="h-4 w-4 mr-1" />
                <span>Sign up</span>
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-rose-700 hover:bg-rose-50 focus:outline-none transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="https://github.com/Udonwajnr/deutsch-diva.git" className="flex items-center justify-center   px-3 gap-x-2">
                <GardenGithubFill12 className="h-5 w-5 text-rose-500" />
            </Link>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed h-screen inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen className="h-6 w-6 text-rose-700" />
                <span className="text-xl font-bold text-rose-800">DeutschDiva</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:text-rose-700 hover:bg-rose-50 focus:outline-none transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <nav className="flex flex-col space-y-1 mb-6">
                <Link
                  href="/"
                  className="flex items-center text-base font-medium py-3 px-4 rounded-md text-gray-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/courses/a1-german"
                  className="flex items-center text-base font-medium py-3 px-4 rounded-md text-gray-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Course
                </Link>
                <Link
                  href="/about"
                  className="flex items-center text-base font-medium py-3 px-4 rounded-md text-gray-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center text-base font-medium py-3 px-4 rounded-md text-gray-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-rose-700 hover:bg-rose-800">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign up
                    </Button>
                  </Link>

                  <div className="hidden md:block">
                  <Link href="https://github.com/Udonwajnr/deutsch-diva.git" className="flex items-center justify-center   px-3 gap-x-2">
                    <GardenGithubFill12 className="h-5 w-5 text-rose-500" />
                   </Link>
                </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

