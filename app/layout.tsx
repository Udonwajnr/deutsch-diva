import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { BookOpen } from "lucide-react"

// import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"
import { HeaderAuth } from "@/components/header-auth"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DeutschDiva - A1 German Course",
  description: "Master A1 German with our comprehensive course designed for women",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
            <div className="flex min-h-screen flex-col">
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
              <main className="flex-1">{children}</main>
              <footer className="border-t bg-background">
                <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
                  <div className="flex-1 space-y-2">
                    <Link href="/" className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-rose-700" />
                      <span className="text-lg font-bold text-rose-800">DeutschDiva</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Empowering women to master the German language with our comprehensive A1 course.
                    </p>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Platform</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/" className="text-muted-foreground hover:text-foreground">
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/a1-german" className="text-muted-foreground hover:text-foreground">
                            Course
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Company</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/about" className="text-muted-foreground hover:text-foreground">
                            About
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                            Contact
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Legal</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                            Terms
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                            Privacy
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="container py-4 text-center text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} DeutschDiva. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster richColors/>
          {/* </ThemeProvider> */}
        </AuthProvider>
      </body>
    </html>
  )
}

