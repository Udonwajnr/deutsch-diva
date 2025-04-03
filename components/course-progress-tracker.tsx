"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { getUserCourseProgress } from "@/lib/course"
import type { Lesson } from "@/lib/course"

interface CourseProgressTrackerProps {
  courseId: string
  lessons: Lesson[]
  currentLessonId?: string
}

export function CourseProgressTracker({ courseId, lessons, currentLessonId }: CourseProgressTrackerProps) {
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

  const calculateProgress = () => {
    if (lessons.length === 0) return 0
    return Math.round((completedLessons.length / lessons.length) * 100)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-20 flex items-center justify-center">
            <div className="spinner" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">Your Progress</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Course Completion</span>
            <span className="text-sm font-medium">{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <p className="text-xs text-gray-500">
            {completedLessons.length} of {lessons.length} lessons completed
          </p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id)
            const isCurrent = lesson.id === currentLessonId

            return (
              <div
                key={lesson.id}
                className={`flex items-start gap-3 p-2 rounded-md transition-colors ${isCurrent ? "bg-rose-50" : ""}`}
              >
                <div className={`rounded-full p-1 ${isCompleted ? "bg-green-100" : "bg-rose-100"}`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-rose-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? "text-rose-800" : ""}`}>{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                    {isCompleted && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                    {isCurrent && !isCompleted && <span className="text-xs text-rose-600">Current</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

