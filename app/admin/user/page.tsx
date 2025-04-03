"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, Search, Trash, UserCog } from "lucide-react"
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users
        const usersQuery = query(collection(db, "users"), where("gender", "==", "female"))
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)

        // Fetch courses for progress calculation
        const coursesData = await getAllCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast("Error",{
          description: "Failed to load users. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, "users", userToDelete))

      // Update local state
      setUsers(users.filter((user) => user.id !== userToDelete))

      toast.success("Success",{
        description: "User has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast("Error",{
        description: "Failed to delete user. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  const calculateUserProgress = (user: any) => {
    if (!user.progress || courses.length === 0) return 0

    let totalProgress = 0
    let courseCount = 0

    Object.entries(user.progress).forEach(([courseId, courseProgress]: [string, any]) => {
      const course = courses.find((c) => c.id === courseId)
      if (!course || !course.lessons || course.lessons.length === 0) return

      const lessonProgress = (courseProgress.completedLessons?.length / course.lessons.length) * 100 || 0
      totalProgress += lessonProgress
      courseCount++
    })

    return courseCount > 0 ? Math.round(totalProgress / courseCount) : 0
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
              <h1 className="text-2xl font-bold text-rose-800">User Management</h1>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">Name</th>
                          <th className="h-12 px-4 text-left font-medium">Email</th>
                          <th className="h-12 px-4 text-left font-medium">Progress</th>
                          <th className="h-12 px-4 text-left font-medium">Enrollment Date</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => {
                            const progress = calculateUserProgress(user)

                            return (
                              <tr key={user.id} className="border-b">
                                <td className="p-4 align-middle">
                                  {user.firstName} {user.lastName}
                                </td>
                                <td className="p-4 align-middle">{user.email}</td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center gap-2">
                                    <Progress value={progress} className="h-2 w-20" />
                                    <span>{progress}%</span>
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center gap-2">
                                    <Link href={`/admin/users/${user.id}`}>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <UserCog className="h-4 w-4" />
                                        <span className="sr-only">View User</span>
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                      onClick={() => setUserToDelete(user.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">Delete User</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                <Download className="mr-2 h-4 w-4" />
                Export User Data
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}

