"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash, Upload } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { createCourse, addLesson } from "@/lib/course"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function NewCoursePage() {
  const router = useRouter()
  const { user, userData } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [courseImage, setCourseImage] = useState<File | null>(null)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    instructor: "",
  })
  const [lessons, setLessons] = useState([
    {
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      duration: "",
      order: 1,
    },
  ])

  // Redirect if user is not logged in or not an admin
  if ((!user || !userData?.isAdmin) && typeof window !== "undefined") {
    router.push("/login")
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
    updatedLessons.splice(index, 1)

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

      if (!courseImage) {
        throw new Error("Please upload a course image.")
      }

      // Validate lessons
      for (const lesson of lessons) {
        if (!lesson.title || !lesson.description || !lesson.content || !lesson.videoUrl || !lesson.duration) {
          throw new Error("Please fill in all lesson fields.")
        }
      }

      // Upload course image
      const storage = getStorage()
      const imageRef = ref(storage, `courses/${Date.now()}_${courseImage.name}`)
      await uploadBytes(imageRef, courseImage)
      const imageUrl = await getDownloadURL(imageRef)

      // Create course
      const courseId = await createCourse({
        ...courseData,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Add lessons
      for (const lesson of lessons) {
        await addLesson(courseId, lesson)
      }

      toast("Course Created",{
        description: "Your course has been successfully created.",
      })

      router.push("/admin")
    } catch (error: any) {
      toast("Error",{
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-rose-800">Add New Course</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Enter the basic information about the course</CardDescription>
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
              <Input id="courseImage" type="file" accept="image/*" onChange={handleImageChange} required />
              {courseImage && <p className="text-sm text-muted-foreground">Selected file: {courseImage.name}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>Add lessons to your course</CardDescription>
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
          <Link href="/admin">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-rose-700 hover:bg-rose-800" disabled={isLoading}>
            {isLoading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

