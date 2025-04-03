"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Loader2, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { getCourse } from "@/lib/course"
import type { Course } from "@/lib/course"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"

export default function ViewCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourse() {
      try {
        const courseData = await getCourse(courseId)
        if (!courseData) {
          toast("Error",{
            description: "Course not found.",
          })
          router.push("/admin/courses")
          return
        }
        setCourse(courseData)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast("Error",{
          description: "Failed to load course data. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-700" />
          <p className="mt-2 text-lg">Loading course data...</p>
        </div>
      </div>
    )
  }

  if (!course) return null

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar variant="admin" />

        {/* Main Content */}
        <main className="md:ml-16 lg:ml-64 flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <div className="container py-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link href="/admin/courses">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-rose-800">{course.title}</h1>
              </div>
              <Link href={`/admin/courses/${courseId}/edit`}>
                <Button className="bg-rose-700 hover:bg-rose-800">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{course.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-500">Level</h3>
                        <p className="mt-1">{course.level}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Duration</h3>
                        <p className="mt-1">{course.duration}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Instructor</h3>
                      <p className="mt-1">{course.instructor}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lessons ({course.lessons.length})</CardTitle>
                    <CardDescription>All lessons in this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">
                                Lesson {index + 1}: {lesson.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                              <p className="text-sm text-gray-500 mt-1">Duration: {lesson.duration}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/courses/${course.id}/lessons/${lesson.id}`} target="_blank">
                                <Play className="mr-2 h-4 w-4" />
                                Preview
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Course Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md overflow-hidden">
                      <img
                        src={course.imageUrl || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

