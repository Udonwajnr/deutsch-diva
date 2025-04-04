"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { getUserCourseProgress } from "@/lib/course"
import type { Lesson } from "@/lib/course"

interface CourseProgressTrackerProps {
  courseId: string
  lessons: Lesson[]
  currentLessonId: string
  onLessonSelect?: (lessonId: string) => void
}

export function CourseProgressTracker({
  courseId,
  lessons,
  currentLessonId,
  onLessonSelect,
}: CourseProgressTrackerProps) {
  const { user } = useAuth()
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return

      try {
        const progress = await getUserCourseProgress(user.uid, courseId)
        setCompletedLessons(progress.completedLessons || [])
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user, courseId])

  // Calculate progress percentage
  const progressPercentage = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0

  const handleLessonClick = (lessonId: string) => {
    if (onLessonSelect) {
      onLessonSelect(lessonId)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Your Progress</span>
            <span className="text-sm font-medium">
              {completedLessons.length}/{lessons.length} lessons completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id)
            const isCurrent = lesson.id === currentLessonId
            const isAvailable = isCompleted || isCurrent || completedLessons.length >= lesson.order - 2

            return (
              <div
                key={lesson.id}
                className={`flex items-center gap-2 rounded-md p-2 ${
                  isCurrent ? "bg-rose-50 border border-rose-200" : ""
                } ${isAvailable ? "cursor-pointer hover:bg-gray-50" : "opacity-70"}`}
                onClick={() => isAvailable && handleLessonClick(lesson.id)}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-green-100"
                      : isCurrent
                        ? "bg-rose-100"
                        : isAvailable
                          ? "bg-gray-100"
                          : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 text-rose-700" />
                  ) : !isAvailable ? (
                    <Lock className="h-3 w-3 text-gray-400" />
                  ) : (
                    <span className="text-xs font-medium text-gray-500">{lesson.order}</span>
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className={`${isCurrent ? "font-medium text-rose-800" : "font-normal text-gray-700"}`}>
                    {lesson.title}
                  </p>
                </div>
                <div className="text-xs text-gray-500">{lesson.duration}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

