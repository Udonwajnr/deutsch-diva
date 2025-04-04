"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { VideoPlayer } from "@/components/video-player"
import { CourseProgressTracker } from "@/components/course-progress-tracker"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, markLessonAsCompleted, getUserCourseProgress } from "@/lib/course"
import type { Course, Lesson } from "@/lib/course"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CourseViewerProps {
  initialLessonId?: string | null
}

export function CourseViewer({ initialLessonId = null }: CourseViewerProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    async function fetchCourse() {
      if (!user) return

      try {
        // For simplicity, we're assuming there's only one course (A1 German)
        const courseId = "a1-german"
        const courseData = await getCourse(courseId)

        if (courseData) {
          setCourse(courseData)

          // Get user progress directly from Firebase
          const progress = await getUserCourseProgress(user.uid, courseId)
          setCompletedLessons(progress.completedLessons || [])

          // Set current lesson based on initialLessonId, last accessed, or first lesson
          let lessonToLoad = null

          if (initialLessonId) {
            lessonToLoad = courseData.lessons.find((l) => l.id === initialLessonId)
          }

          if (!lessonToLoad && progress.lastAccessedLesson) {
            lessonToLoad = courseData.lessons.find((l) => l.id === progress.lastAccessedLesson)
          }

          setCurrentLesson(lessonToLoad || courseData.lessons[0])

          // If we loaded a specific lesson from URL, update the last accessed lesson
          if (initialLessonId && lessonToLoad) {
            updateLastAccessedLesson(user.uid, courseId, initialLessonId)
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        toast("Error",{
          description: "Failed to load course. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [user, initialLessonId])

  const updateLastAccessedLesson = async (userId: string, courseId: string, lessonId: string) => {
    try {
      const userDocRef = doc(db, "users", userId)
      await updateDoc(userDocRef, {
        [`progress.${courseId}.lastAccessedLesson`]: lessonId,
        [`progress.${courseId}.lastAccessedAt`]: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error updating last accessed lesson:", error)
    }
  }

  const handleLessonComplete = async () => {
    if (!user || !course || !currentLesson) return

    try {
      if (completedLessons.includes(currentLesson.id)) return

      await markLessonAsCompleted(user.uid, course.id, currentLesson.id)

      setCompletedLessons((prev) => [...prev, currentLesson.id])

      toast("Lesson Completed!",{
        description: `You've completed "${currentLesson.title}"`,
      })
    } catch (error) {
      console.error("Error marking lesson as completed:", error)
      toast("Error",{
        description: "Failed to update progress. Please try again.",
      })
    }
  }

  const navigateToLesson = async (lessonId: string) => {
    if (!course || !user) return

    const lesson = course.lessons.find((l) => l.id === lessonId)
    if (lesson) {
      setCurrentLesson(lesson)

      // Update last accessed lesson in the database
      await updateLastAccessedLesson(user.uid, course.id, lessonId)

      // Update URL with the new lesson ID
      router.push(`/dashboard?lessonId=${lessonId}`, { scroll: false })
    }
  }

  const getNextPrevLessons = () => {
    if (!course || !currentLesson) return { prevLesson: null, nextLesson: null }

    const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id)
    const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

    return { prevLesson, nextLesson }
  }

  const { prevLesson, nextLesson } = getNextPrevLessons()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
      </div>
    )
  }

  if (!course || !currentLesson) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-rose-800 mb-4">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for couldn't be loaded.</p>
        <Button onClick={() => router.refresh()} className="bg-rose-700 hover:bg-rose-800">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-rose-800">{course.title}</h2>
        <Link href="/courses/a1-german">
          <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
            Course Details
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-rose-800">{currentLesson.title}</h3>
              <span className="text-sm text-gray-500">
                Lesson {currentLesson.order} of {course.lessons.length}
              </span>
            </div>

            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
              onComplete={handleLessonComplete}
              isCompleted={completedLessons.includes(currentLesson.id)}
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {prevLesson && (
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={() => navigateToLesson(prevLesson.id)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}

                {nextLesson && (
                  <Button className="bg-rose-700 hover:bg-rose-800" onClick={() => navigateToLesson(nextLesson.id)}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              {!completedLessons.includes(currentLesson.id) && (
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={handleLessonComplete}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Lesson Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="lesson-content" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Additional Resources</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-rose-700" />
                      <a href="#" className="text-rose-700 hover:underline">
                        Lesson Worksheet (PDF)
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-rose-700" />
                      <a href="#" className="text-rose-700 hover:underline">
                        Vocabulary List
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-rose-700" />
                      <a href="#" className="text-rose-700 hover:underline">
                        Practice Exercises
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <CourseProgressTracker
            courseId={course.id}
            lessons={course.lessons}
            currentLessonId={currentLesson.id}
            onLessonSelect={navigateToLesson}
          />
        </div>
      </div>
    </div>
  )
}

