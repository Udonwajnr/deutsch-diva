"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { CourseViewer } from "../../components/course-viewer"

export default function DashboardPage() {
  const { user, userData, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("course")

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-rose-50 p-4 md:flex">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-rose-700" />
            <span className="text-xl font-bold text-rose-800">LinguaLearn</span>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 text-rose-900">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/courses/a1-german"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <BookOpen className="h-5 w-5" />
              My Course
            </Link>
            <Link
              href="/progress"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <CheckCircle className="h-5 w-5" />
              Progress
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
          <div className="mt-auto">
            <Separator className="my-4" />
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-rose-800">Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Welcome, {userData?.firstName || userData?.displayName || user?.email}
                </span>
                <div className="h-8 w-8 rounded-full bg-rose-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-rose-700" />
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                <TabsTrigger value="course">Continue Learning</TabsTrigger>
                <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="course" className="space-y-6">
                <CourseViewer />
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                {/* Progress Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Course Progress</CardTitle>
                      <CardDescription>A1 German Course</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-rose-700" />
                        <div>
                          <p className="text-2xl font-bold">30%</p>
                          <p className="text-sm text-gray-500">Overall completion</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Completed Lessons</CardTitle>
                      <CardDescription>Your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">3/10</p>
                          <p className="text-sm text-gray-500">Lessons completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Learning Time</CardTitle>
                      <CardDescription>Time spent learning</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Clock className="h-8 w-8 text-rose-700" />
                        <div>
                          <p className="text-2xl font-bold">4h 30m</p>
                          <p className="text-sm text-gray-500">Total learning time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Completed lesson</p>
                          <p className="text-sm text-gray-500">Numbers 1-20</p>
                          <p className="text-xs text-gray-400">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-rose-100 p-2">
                          <Clock className="h-4 w-4 text-rose-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Started lesson</p>
                          <p className="text-sm text-gray-500">Common Phrases</p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-rose-100 p-2">
                          <GraduationCap className="h-4 w-4 text-rose-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Enrolled in course</p>
                          <p className="text-sm text-gray-500">A1 German Course</p>
                          <p className="text-xs text-gray-400">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

