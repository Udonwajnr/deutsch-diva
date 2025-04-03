"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Edit, Plus, Search, Trash } from "lucide-react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { db } from "@/lib/firebase"
import { getAllCourses } from "@/lib/course"
import type { Course } from "@/lib/course"

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getAllCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast.error( "Error",{
          description: "Failed to load courses. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    setIsDeleting(true)
    try {
      // Delete course from Firestore
      await deleteDoc(doc(db, "courses", courseToDelete))

      // Delete associated lessons
      const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseToDelete))
      const lessonsSnapshot = await getDocs(lessonsQuery)

      const deletePromises = lessonsSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Update local state
      setCourses(courses.filter((course) => course.id !== courseToDelete))

      toast.success("Success",{
        description: "Course has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast("Error",{
        description: "Failed to delete course. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setCourseToDelete(null)
    }
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar variant="admin" />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-rose-800">Course Management</h1>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Link href="/admin/courses/new">
                  <Button className="bg-rose-700 hover:bg-rose-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <div key={course.id} className="rounded-lg border overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4 p-4">
                              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={course.imageUrl || "/placeholder.svg?height=64&width=64"}
                                  alt={course.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">{course.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {course.level} • {course.duration} • {course.lessons?.length || 0} lessons
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-4 sm:pr-4">
                              <Link href={`/admin/courses/${course.id}/edit`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-rose-200 text-rose-700 hover:bg-rose-50"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              </Link>
                              <Link href={`/admin/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => setCourseToDelete(course.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No courses found</h3>
                        <p className="mt-1 text-gray-500">
                          {searchTerm ? "Try a different search term" : "Get started by creating a new course"}
                        </p>
                        {!searchTerm && (
                          <Link href="/admin/courses/new" className="mt-4 inline-block">
                            <Button className="bg-rose-700 hover:bg-rose-800">
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Course
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Course Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course and all associated lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}

