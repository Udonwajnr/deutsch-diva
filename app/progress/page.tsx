"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, getUserCourseProgress } from "@/lib/course"
import type { Course, Lesson } from "@/lib/course"

export default function ProgressPage() {
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState("0 hours 0 minutes")

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      try {
        // For simplicity, we're assuming there's only one course (A1 German)
        const courseId = "a1-german"
        const courseData = await getCourse(courseId)

        if (courseData) {
          setCourse(courseData)

          // Get user progress
          const progress = await getUserCourseProgress(user.uid, courseId)
          setUserProgress(progress)

          // Calculate time spent (mock data for now)
          // In a real app, you would track actual time spent on lessons
          const completedLessonsCount = progress.completedLessons?.length || 0
          const avgTimePerLesson = 45 // minutes
          const totalMinutes = completedLessonsCount * avgTimePerLesson

          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60
          setTimeSpent(`${hours} hours ${minutes} minutes`)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const calculateProgress = () => {
    if (!course || !userProgress) return 0

    const completedLessons = userProgress.completedLessons?.length || 0
    const totalLessons = course.lessons?.length || 0

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const getLastCompletedLesson = () => {
    if (!course || !userProgress || !userProgress.completedLessons || userProgress.completedLessons.length === 0) {
      return null
    }

    // Get the last completed lesson ID
    const lastCompletedLessonId = userProgress.completedLessons[userProgress.completedLessons.length - 1]

    // Find the lesson in the course
    return course.lessons.find((lesson) => lesson.id === lastCompletedLessonId)
  }

  const getNextLesson = () => {
    if (!course || !userProgress || !userProgress.completedLessons) {
      return course?.lessons[0] || null
    }

    // Find the first lesson that is not completed
    return course.lessons.find((lesson) => !userProgress.completedLessons.includes(lesson.id)) || null
  }

  const lastCompletedLesson = getLastCompletedLesson()
  const nextLesson = getNextLesson()
  const progressPercentage = calculateProgress()

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar />

        {/* Main Content */}
        <main className="md:ml-16 lg:ml-64 flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-800">Your Learning Progress</h1>
              <p className="mt-2 text-gray-600">Track your progress in the A1 German course.</p>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
              </div>
            ) : (
              <>
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
                          <span className="text-sm font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="pt-2 text-sm text-gray-500">
                          {userProgress?.completedLessons?.length || 0} of {course?.lessons?.length || 0} lessons
                          completed
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Last Activity</CardTitle>
                      <CardDescription>Your recent learning</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {lastCompletedLesson ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">
                                Lesson {lastCompletedLesson.order}: {lastCompletedLesson.title}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Completed{" "}
                              {userProgress?.lastAccessedAt
                                ? new Date(userProgress.lastAccessedAt).toLocaleDateString()
                                : "recently"}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No lessons completed yet</p>
                        )}

                        {nextLesson && (
                          <Link href={`/courses/a1-german/lessons/${nextLesson.id}`}>
                            <Button className="mt-2 w-full bg-rose-700 hover:bg-rose-800">Continue Learning</Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Learning Stats</CardTitle>
                      <CardDescription>Your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-rose-100 p-2">
                            <Clock className="h-4 w-4 text-rose-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Time Spent</p>
                            <p className="text-sm text-gray-500">{timeSpent}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 p-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Lessons Completed</p>
                            <p className="text-sm text-gray-500">
                              {userProgress?.completedLessons?.length || 0} lessons
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Progress</CardTitle>
                    <CardDescription>Track your progress through all lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course?.lessons?.map((lesson: Lesson) => {
                        const isCompleted = userProgress?.completedLessons?.includes(lesson.id) || false

                        return (
                          <div key={lesson.id} className="flex items-start gap-4">
                            <div className={`rounded-full p-2 ${isCompleted ? "bg-green-100" : "bg-rose-100"}`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-rose-700" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  Lesson {lesson.order}: {lesson.title}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {lesson.duration}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{lesson.description}</p>
                              {isCompleted && (
                                <p className="text-xs text-green-600">
                                  Completed{" "}
                                  {userProgress?.lastAccessedAt
                                    ? new Date(userProgress.lastAccessedAt).toLocaleDateString()
                                    : ""}
                                </p>
                              )}
                            </div>
                            <div>
                              <Link href={`/courses/a1-german/lessons/${lesson.id}`}>
                                <Button
                                  variant={isCompleted ? "outline" : "default"}
                                  className={
                                    isCompleted
                                      ? "border-green-200 text-green-700 hover:bg-green-50"
                                      : "bg-rose-700 hover:bg-rose-800"
                                  }
                                >
                                  {isCompleted ? "Review" : "Start"}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

