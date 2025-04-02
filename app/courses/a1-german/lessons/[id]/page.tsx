"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, getUserCourseProgress, markLessonAsCompleted } from "@/lib/course"

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const lessonId = params.id as string

  const [course, setCourse] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          // For simplicity, we're assuming there's only one course (A1 German)
          const courseId = "a1-german"
          const courseData = await getCourse(courseId)

          if (courseData) {
            setCourse(courseData)

            // Get user progress for this course
            const progress = await getUserCourseProgress(user.uid, courseId)
            setUserProgress(progress)

            // Find the current lesson
            const lesson = courseData.lessons.find((l: any) => l.id === lessonId)
            if (lesson) {
              setCurrentLesson(lesson)

              // Check if lesson is already completed
              setCompleted(progress.completedLessons?.includes(lessonId) || false)
            } else {
              // Lesson not found, redirect to lessons page
              router.push("/courses/a1-german/lessons")
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error)
          toast("Error",{
            description: "Failed to load lesson. Please try again.",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user, lessonId, router])

  // Determine previous and next lesson IDs
  const getPrevNextLessons = () => {
    if (!course || !currentLesson) return { prevLessonId: null, nextLessonId: null }

    const currentIndex = course.lessons.findIndex((l: any) => l.id === lessonId)
    const prevLessonId = currentIndex > 0 ? course.lessons[currentIndex - 1].id : null
    const nextLessonId = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1].id : null

    return { prevLessonId, nextLessonId }
  }

  const handleMarkComplete = async () => {
    if (!user || !course || !currentLesson) return

    try {
      await markLessonAsCompleted(user.uid, course.id, lessonId)
      setCompleted(true)

      toast("Lesson Completed!",{
        description: `You've completed Lesson: ${currentLesson.title}`,
      })

      // Update user progress
      const updatedProgress = await getUserCourseProgress(user.uid, course.id)
      setUserProgress(updatedProgress)
    } catch (error) {
      console.error("Error marking lesson as completed:", error)
      toast("Error",{
        description: "Failed to mark lesson as completed. Please try again.",
      })
    }
  }

  const { prevLessonId, nextLessonId } = getPrevNextLessons()

  if (loading) {
    return (
      <AuthGuard>
        <div className="container py-10">
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!currentLesson) {
    return (
      <AuthGuard>
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-rose-800">Lesson Not Found</h1>
            <p className="mt-4">The lesson you're looking for doesn't exist.</p>
            <Link href="/courses/a1-german/lessons">
              <Button className="mt-6 bg-rose-700 hover:bg-rose-800">Back to Lessons</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link href="/courses/a1-german/lessons">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <span className="text-sm text-gray-500">
                  Lesson {currentLesson.order} of {course?.lessons?.length || 0}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-rose-800">{currentLesson.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {prevLessonId && (
                <Link href={`/courses/a1-german/lessons/${prevLessonId}`}>
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                </Link>
              )}
              {nextLessonId && (
                <Link href={`/courses/a1-german/lessons/${nextLessonId}`}>
                  <Button className="bg-rose-700 hover:bg-rose-800">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentLesson.duration}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Lesson {currentLesson.order}
            </div>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }}></div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {prevLessonId && (
                <Link href={`/courses/a1-german/lessons/${prevLessonId}`}>
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous Lesson
                  </Button>
                </Link>
              )}
              {nextLessonId && (
                <Link href={`/courses/a1-german/lessons/${nextLessonId}`}>
                  <Button className="bg-rose-700 hover:bg-rose-800">
                    Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            <Button
              onClick={handleMarkComplete}
              disabled={completed}
              className={completed ? "bg-green-600 hover:bg-green-700" : "bg-rose-700 hover:bg-rose-800"}
            >
              {completed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Completed
                </>
              ) : (
                "Mark as Completed"
              )}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Continue Learning</h3>
                  <p className="text-sm text-gray-500">Track your progress in the A1 German course</p>
                </div>
                <Link href="/courses/a1-german/lessons">
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                    View All Lessons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

