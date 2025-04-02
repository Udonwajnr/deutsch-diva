"use client"

import { useEffect, useState } from "react"
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

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, getUserCourseProgress } from "@/lib/course"

export default function DashboardPage() {
  const { user, userData, logout } = useAuth()
  const [courseData, setCourseData] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          // For simplicity, we're assuming there's only one course (A1 German)
          const courseId = "a1-german"
          const course = await getCourse(courseId)

          if (course) {
            setCourseData(course)

            // Get user progress for this course
            const progress = await getUserCourseProgress(user.uid, courseId)
            setUserProgress(progress)
          }
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!courseData || !userProgress) return 0

    const completedLessons = userProgress.completedLessons?.length || 0
    const totalLessons = courseData.lessons?.length || 0

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  // Get recent activity
  const getRecentActivity = () => {
    if (!courseData || !userProgress) return []

    // This would normally come from a more detailed activity log
    // For now, we'll create some mock activity based on completed lessons
    const recentActivity = []

    if (userProgress.completedLessons?.length > 0) {
      const lastCompletedLessonId = userProgress.completedLessons[userProgress.completedLessons.length - 1]
      const lastCompletedLesson = courseData.lessons.find((l: any) => l.id === lastCompletedLessonId)

      if (lastCompletedLesson) {
        recentActivity.push({
          id: 1,
          action: "Completed lesson",
          lesson: lastCompletedLesson.title,
          date: "2 days ago",
        })
      }
    }

    if (userProgress.lastAccessedLesson) {
      const lastAccessedLesson = courseData.lessons.find((l: any) => l.id === userProgress.lastAccessedLesson)

      if (
        lastAccessedLesson &&
        lastAccessedLesson.id !== userProgress.completedLessons?.[userProgress.completedLessons.length - 1]
      ) {
        recentActivity.push({
          id: 2,
          action: "Started lesson",
          lesson: lastAccessedLesson.title,
          date: "3 days ago",
        })
      }
    }

    if (userProgress.enrolledAt) {
      recentActivity.push({
        id: 3,
        action: "Enrolled in course",
        lesson: courseData.title,
        date: "1 week ago",
      })
    }

    return recentActivity
  }

  // Get next lesson
  const getNextLesson = () => {
    if (!courseData || !userProgress) return null

    const completedLessons = userProgress.completedLessons || []

    // Find the first lesson that hasn't been completed
    return courseData.lessons.find((lesson: any) => !completedLessons.includes(lesson.id)) || null
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-rose-50 p-4 md:flex">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-rose-700" />
            <span className="text-xl font-bold text-rose-800">DeutschDiva</span>
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
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
            </div>
          ) : (
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

              {/* Progress Overview */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                    <CardDescription>A1 German Course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Overall Progress</span>
                        <span className="text-sm font-medium">{calculateProgress()}%</span>
                      </div>
                      <Progress value={calculateProgress()} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {userProgress?.completedLessons?.length || 0} of {courseData?.lessons?.length || 0} lessons
                        completed
                      </p>
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
                        <p className="text-2xl font-bold">
                          {userProgress?.completedLessons?.length || 0}/{courseData?.lessons?.length || 0}
                        </p>
                        <p className="text-sm text-gray-500">Lessons completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Next Lesson</CardTitle>
                    <CardDescription>Continue your learning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getNextLesson() ? (
                      <>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-rose-700" />
                          <span className="font-medium">{getNextLesson()?.title}</span>
                        </div>
                        <Link href={`/courses/a1-german/lessons/${getNextLesson()?.id}`}>
                          <Button className="w-full bg-rose-700 hover:bg-rose-800">Continue Learning</Button>
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <p className="font-medium text-green-600">All lessons completed!</p>
                        <p className="text-sm text-gray-500 mt-1">Congratulations on finishing the course.</p>
                      </div>
                    )}
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
                    {getRecentActivity().map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="rounded-full bg-rose-100 p-2">
                          {activity.action.includes("Completed") ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : activity.action.includes("Started") ? (
                            <Clock className="h-4 w-4 text-rose-700" />
                          ) : (
                            <GraduationCap className="h-4 w-4 text-rose-700" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.lesson}</p>
                          <p className="text-xs text-gray-400">{activity.date}</p>
                        </div>
                      </div>
                    ))}

                    {getRecentActivity().length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No recent activity yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Start learning to see your activity here.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Course Overview */}
              {courseData && (
                <Card>
                  <CardHeader>
                    <CardTitle>{courseData.title}</CardTitle>
                    <CardDescription>Your enrolled course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-rose-700" />
                        <span className="font-medium">{courseData.title}</span>
                      </div>
                      <Link href="/courses/a1-german">
                        <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                          View Course
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Course Progress</span>
                        <span className="text-sm font-medium">{calculateProgress()}%</span>
                      </div>
                      <Progress value={calculateProgress()} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="rounded-lg border border-rose-100 p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-rose-700" />
                          <span className="text-sm font-medium">{courseData.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500">Course duration</p>
                      </div>
                      <div className="rounded-lg border border-rose-100 p-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-rose-700" />
                          <span className="text-sm font-medium">{courseData.lessons?.length || 0} lessons</span>
                        </div>
                        <p className="text-xs text-gray-500">Total lessons</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

