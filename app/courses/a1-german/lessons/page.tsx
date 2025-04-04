"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, CheckCircle, Clock, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { type Course, type Lesson, getCourse, getUserCourseProgress } from "@/lib/course"
import Navbar from "@/components/Navbar"

export default function LessonsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/courses/a1-german/lessons")
    }
  }, [user, authLoading, router])

  // Fetch course data and user progress
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)
        // Fetch the A1 German course
        const courseData = await getCourse("8KAqxrxAOmFhrkqmM8ES")

        if (!courseData) {
          setError("Course not found")
          setLoading(false)
          return
        }

        setCourse(courseData)
        setLessons(courseData.lessons)

        // Fetch user progress for this course
        const progress = await getUserCourseProgress(user.uid, "8KAqxrxAOmFhrkqmM8ES")
        setCompletedLessonIds(progress.completedLessons || [])
        setIsEnrolled(progress.enrolledAt !== null)
      } catch (err) {
        console.error("Error fetching course data:", err)
        setError("Failed to load course data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Calculate progress
  const completedLessons = completedLessonIds.length
  const progress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  // Handle starting a lesson
  const handleStartLesson = (lessonId: string) => {
    if (!isEnrolled) {
      router.push("/courses/a1-german")
      return
    }

    router.push(`/dashboard?lessonId=${lessonId}`)
  }

  if (authLoading || loading) {
    return <LessonsPageSkeleton />
  }

  if (error) {
    return (
      <>
        <div className="container py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>      
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Navbar/>
        <div className="container py-10">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-amber-700">Course Not Found</h2>
            <p className="text-amber-600">The requested course could not be found.</p>
            <Link href="/courses">
              <Button variant="outline" className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-100">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (!isEnrolled) {
    return (
      <>
        <Navbar/>
        <div className="container py-10">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-rose-700">Enrollment Required</h2>
            <p className="text-rose-600 mb-4">You need to enroll in this course before you can access the lessons.</p>
            <Link href="/courses/a1-german">
              <Button className="bg-rose-700 hover:bg-rose-800">Enroll Now</Button>
            </Link>
          </div>
        </div>   
      </>
    )
  }

  return (
    <>
      <Navbar/>
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-rose-800">{course.title} Lessons</h1>
            <p className="mt-2 text-gray-600">Track your progress through all lessons in the {course.title} course.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Your Progress</span>
              <span className="text-sm font-medium">
                {completedLessons}/{lessons.length} lessons completed ({Math.round(progress)}%)
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {lessons.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id)

              return (
                <Card key={lesson.id} className={isCompleted ? "border-green-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-2 ${isCompleted ? "bg-green-100" : "bg-rose-100"}`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-rose-700" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
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
                        <div className="pt-2">
                          <Button
                            variant={isCompleted ? "outline" : "default"}
                            className={
                              isCompleted
                                ? "border-green-200 text-green-700 hover:bg-green-50"
                                : "bg-rose-700 hover:bg-rose-800"
                            }
                            onClick={() => handleStartLesson(lesson.id)}
                          >
                            {isCompleted ? "Review Lesson" : "Start Lesson"}
                            <Play className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

function LessonsPageSkeleton() {
  return (
    <>
      <Navbar/>
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="mt-2 h-5 w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

