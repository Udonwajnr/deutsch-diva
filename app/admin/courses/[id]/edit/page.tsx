"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Trash, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, updateCourse, updateLesson, addLesson } from "@/lib/course"
import type { Lesson } from "@/lib/course"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const { user, userData } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [courseImage, setCourseImage] = useState<File | null>(null)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    instructor: "",
    imageUrl: "",
  })
  const [lessons, setLessons] = useState<(Omit<Lesson, "id"> & { id?: string })[]>([])
  const [deletedLessons, setDeletedLessons] = useState<string[]>([])
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if ((!user || !userData?.isAdmin) && typeof window !== "undefined") {
      setShouldRedirect(true)
    } else {
      setShouldRedirect(false)
    }
  }, [user, userData])

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login")
    }
  }, [shouldRedirect, router])

  useEffect(() => {
    async function fetchCourse() {
      try {
        const course = await getCourse(courseId)
        if (!course) {
          toast("Error",{
            description: "Course not found.",
          })
          router.push("/admin/courses")
          return
        }

        setCourseData({
          title: course.title,
          description: course.description,
          level: course.level,
          duration: course.duration,
          instructor: course.instructor,
          imageUrl: course.imageUrl,
        })

        // Map lessons to the format we need
        const formattedLessons = course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
        }))

        setLessons(formattedLessons)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast("Error",{
          description: "Failed to load course data. Please try again.",
        })
      } finally {
        setIsFetching(false)
      }
    }

    if (!shouldRedirect) {
      fetchCourse()
    }
  }, [courseId, router, shouldRedirect])

  if (shouldRedirect) {
    return null
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLessonChange = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons]
    updatedLessons[index] = { ...updatedLessons[index], [field]: value }
    setLessons(updatedLessons)
  }

  const addNewLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        duration: "",
        order: lessons.length + 1,
      },
    ])
  }

  const removeLesson = (index: number) => {
    if (lessons.length === 1) {
      toast("Error",{
        description: "You must have at least one lesson.",
      })
      return
    }

    const updatedLessons = [...lessons]
    const removedLesson = updatedLessons.splice(index, 1)[0]

    // If the lesson has an ID, add it to deletedLessons
    if (removedLesson.id) {
      setDeletedLessons([...deletedLessons, removedLesson.id])
    }

    // Update order for remaining lessons
    updatedLessons.forEach((lesson, idx) => {
      lesson.order = idx + 1
    })

    setLessons(updatedLessons)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (
        !courseData.title ||
        !courseData.description ||
        !courseData.level ||
        !courseData.duration ||
        !courseData.instructor
      ) {
        throw new Error("Please fill in all course fields.")
      }

      // Validate lessons
      for (const lesson of lessons) {
        if (!lesson.title || !lesson.description || !lesson.content || !lesson.videoUrl || !lesson.duration) {
          throw new Error("Please fill in all lesson fields.")
        }
      }

      // Handle image upload if a new image was selected
      let imageUrl = courseData.imageUrl
      if (courseImage) {
        const storage = getStorage()
        const imageRef = ref(storage, `courses/${Date.now()}_${courseImage.name}`)
        await uploadBytes(imageRef, courseImage)
        imageUrl = await getDownloadURL(imageRef)
      }

      // Update course
      await updateCourse(courseId, {
        ...courseData,
        imageUrl,
      })

      // Handle lessons
      for (const lesson of lessons) {
        if (lesson.id) {
          // Update existing lesson
          await updateLesson(lesson.id, {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
          })
        } else {
          // Add new lesson
          await addLesson(courseId, {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
          })
        }
      }

      // Delete removed lessons
      for (const lessonId of deletedLessons) {
        await deleteDoc(doc(db, "lessons", lessonId))
      }

      toast("Course Updated",{
        description: "Your course has been successfully updated.",
      })

      router.push("/admin/courses")
    } catch (error: any) {
      toast("Error",{
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-700" />
          <p className="mt-2 text-lg">Loading course data...</p>
        </div>
      </div>
    )
  }

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
                <h1 className="text-2xl font-bold text-rose-800">Edit Course</h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>Update the basic information about the course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={courseData.title}
                      onChange={handleCourseChange}
                      placeholder="e.g. A1 German Course"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={courseData.description}
                      onChange={handleCourseChange}
                      placeholder="Enter a detailed description of the course"
                      className="min-h-32"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Course Level</Label>
                      <Input
                        id="level"
                        name="level"
                        value={courseData.level}
                        onChange={handleCourseChange}
                        placeholder="e.g. A1, B1, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Estimated Duration (e.g. 10 weeks)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={courseData.duration}
                        onChange={handleCourseChange}
                        placeholder="e.g. 10 weeks"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor Name</Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={courseData.instructor}
                      onChange={handleCourseChange}
                      placeholder="e.g. Maria Schmidt"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseImage">Course Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={courseData.imageUrl || "/placeholder.svg"}
                          alt="Current course image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Input id="courseImage" type="file" accept="image/*" onChange={handleImageChange} />
                        {courseImage && (
                          <p className="text-sm text-muted-foreground mt-1">Selected new file: {courseImage.name}</p>
                        )}
                        {!courseImage && (
                          <p className="text-sm text-muted-foreground mt-1">Leave empty to keep current image</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>Update, add, or remove lessons from your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Lesson {index + 1}</h3>
                        {lessons.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLesson(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-title-${index}`}>Lesson Title</Label>
                        <Input
                          id={`lesson-title-${index}`}
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                          placeholder="e.g. Basic Conversation"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-description-${index}`}>Lesson Description</Label>
                        <Input
                          id={`lesson-description-${index}`}
                          value={lesson.description}
                          onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                          placeholder="e.g. Learn basic German conversation phrases"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-content-${index}`}>Lesson Content (HTML)</Label>
                        <Textarea
                          id={`lesson-content-${index}`}
                          value={lesson.content}
                          onChange={(e) => handleLessonChange(index, "content", e.target.value)}
                          placeholder="Enter the lesson content in HTML format"
                          className="min-h-32"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-video-${index}`}>Video URL (YouTube Embed URL)</Label>
                        <Input
                          id={`lesson-video-${index}`}
                          value={lesson.videoUrl}
                          onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)}
                          placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-duration-${index}`}>Lesson Duration</Label>
                        <Input
                          id={`lesson-duration-${index}`}
                          value={lesson.duration}
                          onChange={(e) => handleLessonChange(index, "duration", e.target.value)}
                          placeholder="e.g. 45 min"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addNewLesson} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Lesson
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Link href="/admin/courses">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-rose-700 hover:bg-rose-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Course...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Update Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

