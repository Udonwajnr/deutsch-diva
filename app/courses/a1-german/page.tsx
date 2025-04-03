"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, CheckCircle, Clock, GraduationCap, Star } from "lucide-react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, enrollUserInCourse, getUserCourseProgress } from "@/lib/course"
import Footer from "@/components/footer"

export default function A1GermanCoursePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // For simplicity, we're assuming there's only one course (A1 German)
        const courseId = "8KAqxrxAOmFhrkqmM8ES"
        const courseData = await getCourse(courseId)

        if (courseData) {
          setCourse(courseData)

          // Check if user is logged in and enrolled
          if (user) {
            const progress = await getUserCourseProgress(user.uid, courseId)
            setUserProgress(progress)
            setIsEnrolled(progress.enrolledAt !== null)
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/login")
      return
    }

    if (!course) return

    setEnrolling(true)

    try {
      await enrollUserInCourse(user.uid, course.id)

      toast("Enrolled Successfully!",{
        description: `You are now enrolled in ${course.title}.`,
      })

      // Update enrollment status
      setIsEnrolled(true)

      // Fetch updated progress
      const progress = await getUserCourseProgress(user.uid, course.id)
      setUserProgress(progress)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      toast("Error",{
        description: error.message || "Failed to enroll in course. Please try again.",
      })
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rose-800">Course Not Found</h1>
          <p className="mt-4">The course you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="mt-6 bg-rose-700 hover:bg-rose-800">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar/>
      <div className="container py-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Course Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-800">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-rose-700" />
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-rose-700" />
                <span className="text-sm">{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-rose-700" />
                <span className="text-sm">{course.level}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">4.8 (124 reviews)</span>
              </div> */}
            </div>

            <div>
              <h2 className="text-xl font-bold text-rose-800">What You&apos;ll Learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Basic German vocabulary and phrases</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Proper German pronunciation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Essential grammar rules</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Numbers, colors, and everyday objects</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Basic conversation skills</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Cultural insights about German-speaking countries</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-rose-800">Course Curriculum</h2>
              <p className="mt-2 text-gray-600">
                Preview the first 5 lessons of our comprehensive 10-lesson A1 German course.
              </p>
              <div className="mt-4 space-y-4">
                {course.lessons?.slice(0, 5).map((lesson: any) => (
                  <Card key={lesson.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            Lesson {lesson.order}: {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500">{lesson.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {lesson.duration}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/courses/a1-german/lessons">
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                    View All Lessons
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-rose-800">About the Instructor</h2>
              <div className="mt-4 flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-rose-700" />
                </div>
                <div>
                  <h3 className="font-medium">{course.instructor}</h3>
                  <p className="text-sm text-gray-500">German Language Instructor</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {course.instructor} is a native German speaker with over 10 years of experience teaching German to
                    beginners. She specializes in making language learning accessible and enjoyable for all students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="md:row-start-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Enroll in this Course</CardTitle>
                <CardDescription>Begin your German language journey today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-rose-100 flex items-center justify-center">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=300&width=500"
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Course Fee</span>
                    <span className="text-xl font-bold text-rose-800">Free</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span>Enrolled Students</span>
                    <span>350+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Course Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Lessons</span>
                    <span>{course.lessons?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Level</span>
                    <span>{course.level}</span>
                  </div>
                  <Separator />
                </div>

                {isEnrolled ? (
                  <Link href="/dashboard">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full bg-rose-700 hover:bg-rose-800" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? "Enrolling..." : "Enroll Now"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                <p className="text-xs text-center text-gray-500">
                  By enrolling, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer/>
    </>

  )
}

