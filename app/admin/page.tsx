"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ChevronDown, Download, FileText, Home, LogOut, Search, Settings, Upload, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"
import { getAllCourses } from "@/lib/course"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth" // Import useAuth hook

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const auth = useAuth() // Initialize useAuth hook

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch courses
        const coursesData = await getAllCourses()
        setCourses(coursesData)

        // Fetch users
        const usersQuery = query(collection(db, "users"), where("gender", "==", "female"))
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  const calculateStats = () => {
    const totalUsers = users.length
    const enrolledUsers = users.filter((user) => user.enrolledCourses?.length > 0).length
    const completedUsers = users.filter((user) => {
      if (!user.progress) return false

      // Check if any course has all lessons completed
      return Object.values(user.progress).some((courseProgress: any) => {
        const course = courses.find((c) => c.id === courseProgress.courseId)
        if (!course) return false

        return courseProgress.completedLessons?.length === course.lessons?.length
      })
    }).length

    // Calculate average progress
    let totalProgress = 0
    let progressCount = 0

    users.forEach((user) => {
      if (!user.progress) return

      Object.values(user.progress).forEach((courseProgress: any) => {
        const course = courses.find((c) => c.id === courseProgress.courseId)
        if (!course) return

        const progress =
          course.lessons?.length > 0 ? (courseProgress.completedLessons?.length / course.lessons?.length) * 100 : 0

        totalProgress += progress
        progressCount++
      })
    })

    const averageProgress = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0

    return {
      totalUsers,
      enrolledUsers,
      completedUsers,
      averageProgress,
    }
  }

  const stats = calculateStats()

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-rose-50 p-4 md:flex">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-rose-700" />
            <span className="text-xl font-bold text-rose-800">DeutschDiva</span>
            <span className="ml-auto text-xs font-medium bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 text-rose-900">
              <FileText className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
            <Link
              href="/admin/courses"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <BookOpen className="h-5 w-5" />
              Courses
            </Link>
            <Link
              href="/admin/settings"
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
              onClick={() => auth.logout()}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-900"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-rose-800">Admin Dashboard</h1>
                <Link href="/admin/courses/new">
                  <Button className="bg-rose-700 hover:bg-rose-800">
                    <Upload className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </Link>
              </div>

              {/* Overview Cards */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Users</CardTitle>
                    <CardDescription>Enrolled in Platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-gray-500">Female users only</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Enrolled Users</CardTitle>
                    <CardDescription>In any course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.enrolledUsers}</div>
                    <p className="text-xs text-gray-500">
                      {stats.totalUsers > 0
                        ? `${Math.round((stats.enrolledUsers / stats.totalUsers) * 100)}% of total users`
                        : "No users yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Completed Course</CardTitle>
                    <CardDescription>Users who finished</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.completedUsers}</div>
                    <p className="text-xs text-gray-500">
                      {stats.enrolledUsers > 0
                        ? `${Math.round((stats.completedUsers / stats.enrolledUsers) * 100)}% completion rate`
                        : "No enrolled users yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Progress</CardTitle>
                    <CardDescription>Across all users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.averageProgress}%</div>
                    <Progress value={stats.averageProgress} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="users">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                  <TabsTrigger value="users">Enrolled Users</TabsTrigger>
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Enrolled Users</h2>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-12 px-4 text-left font-medium">Name</th>
                              <th className="h-12 px-4 text-left font-medium">Email</th>
                              <th className="h-12 px-4 text-left font-medium">Progress</th>
                              <th className="h-12 px-4 text-left font-medium">Enrollment Date</th>
                              <th className="h-12 px-4 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map((user) => {
                                // Calculate user progress
                                let progress = 0
                                if (user.progress && courses.length > 0) {
                                  const courseProgress = user.progress[courses[0].id]
                                  if (courseProgress && courses[0].lessons?.length > 0) {
                                    progress = Math.round(
                                      (courseProgress.completedLessons?.length / courses[0].lessons.length) * 100,
                                    )
                                  }
                                }

                                return (
                                  <tr key={user.id} className="border-b">
                                    <td className="p-4 align-middle">
                                      {user.firstName} {user.lastName}
                                    </td>
                                    <td className="p-4 align-middle">{user.email}</td>
                                    <td className="p-4 align-middle">
                                      <div className="flex items-center gap-2">
                                        <Progress value={progress} className="h-2 w-20" />
                                        <span>{progress}%</span>
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="p-4 align-middle">
                                      <Button variant="ghost" size="sm">
                                        View
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              })
                            ) : (
                              <tr>
                                <td colSpan={5} className="p-4 text-center">
                                  No users found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                      <Download className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="content" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Course Content Management</h2>
                    <Link href="/admin/courses/new">
                      <Button className="bg-rose-700 hover:bg-rose-800">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Course
                      </Button>
                    </Link>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Courses</CardTitle>
                      <CardDescription>Manage your course content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <div key={course.id} className="rounded-lg border">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-rose-700" />
                                <div>
                                  <h3 className="font-medium">{course.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {course.lessons?.length || 0} lessons • {course.level}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No courses available</p>
                          <p className="text-sm text-gray-400 mt-1">Add a new course to get started</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

