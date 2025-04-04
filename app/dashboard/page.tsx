"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { CourseViewer } from "../../components/course-viewer"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { CheckCircle, Clock, GraduationCap, User, BookOpen, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getCourse, getUserCourseProgress } from "@/lib/course"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, userData } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lessonId = searchParams.get("lessonId")
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState(tabParam === "overview" ? "overview" : "course")
  const [courseData, setCourseData] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Fetch course and progress data
  useEffect(() => {
    async function fetchData() {
      if (!user) return

      try {
        setLoading(true)
        // For simplicity, we're assuming there's only one course (A1 German)
        const courseId = "8KAqxrxAOmFhrkqmM8ES"
        const course = await getCourse(courseId)
        setCourseData(course)

        // Get user progress
        const progress = await getUserCourseProgress(user.uid, courseId)
        setProgressData(progress)
        setIsEnrolled(progress.enrolledAt !== null)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab === "overview") {
      router.push("/dashboard?tab=overview", { scroll: false })
    } else {
      // Keep lessonId if it exists
      if (lessonId) {
        router.push(`/dashboard?lessonId=${lessonId}`, { scroll: false })
      } else {
        router.push("/dashboard", { scroll: false })
      }
    }
  }, [activeTab, router, lessonId])

  // Calculate progress metrics
  const calculateMetrics = () => {
    if (!courseData || !progressData) {
      return {
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: 0,
        learningTime: "0h 0m",
        lastActivity: null,
        enrollmentDate: null,
      }
    }

    const completedLessons = progressData.completedLessons?.length || 0
    const totalLessons = courseData.lessons?.length || 0
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Calculate estimated learning time (45 min per completed lesson)
    const totalMinutes = completedLessons * 45
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const learningTime = `${hours}h ${minutes}m`

    // Get last activity date
    const lastActivity = progressData.lastAccessedAt ? new Date(progressData.lastAccessedAt) : null

    // Get enrollment date
    const enrollmentDate = progressData.enrolledAt ? new Date(progressData.enrolledAt) : null

    return {
      progressPercentage,
      completedLessons,
      totalLessons,
      learningTime,
      lastActivity,
      enrollmentDate,
    }
  }

  // Get recent activities
  const getRecentActivities = () => {
    if (!courseData || !progressData || !progressData.completedLessons) {
      return []
    }

    const activities = []

    // Add completed lessons as activities (most recent first)
    if (progressData.completedLessons.length > 0) {
      // Get the last 3 completed lessons
      const recentCompletedLessons = [...progressData.completedLessons].slice(-3).reverse()

      recentCompletedLessons.forEach((lessonId) => {
        const lesson = courseData.lessons.find((l:any) => l.id === lessonId)
        if (lesson) {
          activities.push({
            type: "completed",
            title: `Completed lesson`,
            description: lesson.title,
            date: progressData.lastAccessedAt ? new Date(progressData.lastAccessedAt) : new Date(),
            icon: CheckCircle,
          })
        }
      })
    }

    // Add last accessed lesson if it exists and is different from completed lessons
    if (progressData.lastAccessedLesson) {
      const lastAccessedLesson = courseData.lessons.find((l:any) => l.id === progressData.lastAccessedLesson)
      if (lastAccessedLesson && !progressData.completedLessons.includes(lastAccessedLesson.id)) {
        activities.push({
          type: "started",
          title: "Started lesson",
          description: lastAccessedLesson.title,
          date: progressData.lastAccessedAt ? new Date(progressData.lastAccessedAt) : new Date(),
          icon: Clock,
        })
      }
    }

    // Add enrollment activity
    if (progressData.enrolledAt) {
      activities.push({
        type: "enrolled",
        title: "Enrolled in course",
        description: courseData.title || "A1 German Course",
        date: new Date(progressData.enrolledAt),
        icon: GraduationCap,
      })
    }

    // Sort by date (most recent first)
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3)
  }

  // Format date for display
  const formatDate = (date:Date) => {
    if (!date) return "N/A"

    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

    return date.toLocaleDateString()
  }

  const metrics = calculateMetrics()
  const recentActivities = getRecentActivities()

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar />

        {/* Main Content */}
        <main className="md:ml-16 lg:ml-64 flex-1 p-4 md:p-6 pt-16 md:pt-6">
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

            {!isEnrolled ? (
              <Card>
                <CardHeader>
                  <CardTitle>Get Started with Your Learning Journey</CardTitle>
                  <CardDescription>You need to enroll in a course to start learning</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <GraduationCap className="h-16 w-16 mx-auto text-rose-700 mb-4" />
                    <p className="text-gray-600 mb-6">
                      You haven't enrolled in any courses yet. Enroll in our A1 German course to begin your learning
                      journey.
                    </p>
                  </div>
                  <Link href="/courses/a1-german">
                    <Button className="bg-rose-700 hover:bg-rose-800">Browse Available Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                  <TabsTrigger value="course">Continue Learning</TabsTrigger>
                  <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="course" className="space-y-6">
                  <CourseViewer initialLessonId={lessonId} />
                </TabsContent>

                <TabsContent value="overview" className="space-y-6">
                  {loading ? (
                    <>
                      {/* Skeleton loading state */}
                      <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardHeader className="pb-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-24 mt-1" />
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                  <Skeleton className="h-6 w-16" />
                                  <Skeleton className="h-4 w-24 mt-1" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-48 mt-1" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-5 w-32" />
                                  <Skeleton className="h-4 w-48 mt-1" />
                                  <Skeleton className="h-3 w-24 mt-1" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <>
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
                                <p className="text-2xl font-bold">{metrics.progressPercentage}%</p>
                                <p className="text-sm text-gray-500">Overall completion</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Progress value={metrics.progressPercentage} className="h-2" />
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
                                  {metrics.completedLessons}/{metrics.totalLessons}
                                </p>
                                <p className="text-sm text-gray-500">Lessons completed</p>
                              </div>
                            </div>
                            {metrics.enrollmentDate && (
                              <p className="text-xs text-gray-500 mt-3">
                                Enrolled on {metrics.enrollmentDate.toLocaleDateString()}
                              </p>
                            )}
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
                                <p className="text-2xl font-bold">{metrics.learningTime}</p>
                                <p className="text-sm text-gray-500">Total learning time</p>
                              </div>
                            </div>
                            {metrics.lastActivity && (
                              <p className="text-xs text-gray-500 mt-3">
                                Last activity: {formatDate(metrics.lastActivity)}
                              </p>
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
                          {recentActivities.length > 0 ? (
                            <div className="space-y-4">
                              {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                  <div
                                    className={`rounded-full ${
                                      activity.type === "completed"
                                        ? "bg-green-100"
                                        : activity.type === "started"
                                          ? "bg-rose-100"
                                          : "bg-rose-100"
                                    } p-2`}
                                  >
                                    <activity.icon
                                      className={`h-4 w-4 ${
                                        activity.type === "completed"
                                          ? "text-green-600"
                                          : activity.type === "started"
                                            ? "text-rose-700"
                                            : "text-rose-700"
                                      }`}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                    <p className="text-xs text-gray-400">{formatDate(activity.date)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">No activity yet</p>
                              <p className="text-sm text-gray-400 mb-4">Start learning to see your activity here</p>
                              <Button className="bg-rose-700 hover:bg-rose-800" onClick={() => setActiveTab("course")}>
                                Start Learning
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Upcoming Schedule - Optional addition */}
                      {metrics.completedLessons > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Learning Schedule</CardTitle>
                            <CardDescription>Recommended next steps</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="rounded-full bg-rose-100 p-2">
                                  <Calendar className="h-4 w-4 text-rose-700" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Continue your learning</p>
                                  <p className="text-sm text-gray-500">
                                    {metrics.completedLessons < metrics.totalLessons
                                      ? `You're making great progress! Continue to Lesson ${metrics.completedLessons + 1}`
                                      : "Congratulations! You have completed all lessons."}
                                  </p>
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      className="bg-rose-700 hover:bg-rose-800"
                                      onClick={() => setActiveTab("course")}
                                    >
                                      Continue Learning
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

