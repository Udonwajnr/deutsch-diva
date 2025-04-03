import type React from "react"
import { Inter } from "next/font/google"

// import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"
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
              <main className="flex-1">{children}</main>
            </div>
            <Toaster richColors/>
          {/* </ThemeProvider> */}
        </AuthProvider>
      </body>
    </html>
  )
}

