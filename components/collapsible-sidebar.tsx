"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface SidebarLink {
  href: string
  icon: React.ElementType
  label: string
  adminOnly?: boolean
}

export function CollapsibleSidebar({ variant = "user" }: { variant?: "user" | "admin" }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, userData, logout } = useAuth()
  const pathname = usePathname()
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`sidebar-collapsed-${variant}`)
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [variant])

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(true)
      return
    }

    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem(`sidebar-collapsed-${variant}`, String(newState))
  }

  const userLinks: SidebarLink[] = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/courses/a1-german",
      icon: BookOpen,
      label: "My Course",
    },
    {
      href: "/progress",
      icon: CheckCircle,
      label: "Progress",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
    // {
    //   href: "/settings",
    //   icon: Settings,
    //   label: "Settings",
    // },
  ]

  const adminLinks: SidebarLink[] = [
    {
      href: "/admin",
      icon: FileText,
      label: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin/courses",
      icon: BookOpen,
      label: "Courses",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  const links = variant === "admin" ? adminLinks : userLinks

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-6 w-6 text-rose-700 shrink-0" />
        {!collapsed && <span className="text-xl font-bold text-rose-800">LinguaLearn</span>}
        {!collapsed && variant === "admin" && (
          <span className="ml-auto text-xs font-medium bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">Admin</span>
        )}
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          if (link.adminOnly && !userData?.isAdmin) return null

          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                isActive ? "bg-rose-100 text-rose-900" : "text-gray-700 hover:bg-rose-100 hover:text-rose-900",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? link.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <Separator className="my-4" />
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Home" : undefined}
          onClick={() => setMobileOpen(false)}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </Link>
        <button
          onClick={() => {
            logout()
            setMobileOpen(false)
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-rose-50">
          <div className="flex h-full flex-col p-4">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-rose-50 transition-all duration-300 ease-in-out z-30 hidden md:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col p-4 overflow-y-auto">
          <SidebarContent />
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-rose-200 text-rose-800 hover:bg-rose-300 shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
    </>
  )
}

