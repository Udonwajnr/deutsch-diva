import React from 'react'
import Link from 'next/link'
import { HeaderAuth } from './header-auth'
import { BookOpen } from 'lucide-react'
const Navbar = () => {
  return (
     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-rose-700" />
                    <span className="text-xl font-bold text-rose-800">DeutschDiva</span>
                  </Link>
                  <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium hover:text-rose-700">
                      Home
                    </Link>
                    <Link href="/courses/a1-german" className="text-sm font-medium hover:text-rose-700">
                      Course
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-rose-700">
                      About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:text-rose-700">
                      Contact
                    </Link>
                  </nav>
                  <HeaderAuth />
                </div>
              </header>
  )
}

export default Navbar