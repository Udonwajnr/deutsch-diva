"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookOpen, CheckCircle, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { getCourse, getUserCourseProgress } from "@/lib/course"

export default function ProfilePage() {
  const { user, userData, updateUserData } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [courseProgress, setCourseProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: user?.email || "",
        gender: userData.gender || "",
      })
    }

    async function fetchProgress() {
      if (!user) return

      try {
        // For simplicity, we're assuming there's only one course (A1 German)
        const courseId = "8KAqxrxAOmFhrkqmM8ES"
        const courseData = await getCourse(courseId)
        const progress = await getUserCourseProgress(user.uid, courseId)

        if (courseData && progress) {
          const completedLessons = progress.completedLessons?.length || 0
          const totalLessons = courseData.lessons?.length || 0
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

          setCourseProgress({
            completedLessons,
            totalLessons,
            progressPercentage,
            enrollmentDate: progress.enrolledAt ? new Date(progress.enrolledAt).toLocaleDateString() : "N/A",
            timeSpent: calculateTimeSpent(completedLessons),
          })
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user, userData])

  const calculateTimeSpent = (completedLessons: number) => {
    // Mock calculation - in a real app, you would track actual time
    const avgTimePerLesson = 45 // minutes
    const totalMinutes = completedLessons * avgTimePerLesson

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours} hours ${minutes} minutes`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      setIsEditing(false)
      toast("Profile Updated",{
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast("Error",{        
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar />

        {/* Main Content */}
        <main className="md:ml-16 lg:ml-64 flex-1 p-4 md:p-6 pt-16 md:pt-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-700 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-rose-800">Your Profile</h1>
                <p className="mt-2 text-gray-600">Manage your account information and track your learning progress.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} disabled />
                            <p className="text-xs text-gray-500">Email cannot be changed after registration.</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input id="gender" value={formData.gender} disabled />
                            <p className="text-xs text-gray-500">Gender cannot be changed after registration.</p>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">First Name</p>
                              <p>{formData.firstName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last Name</p>
                              <p>{formData.lastName}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p>{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Gender</p>
                            <p>{formData.gender}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false)
                              setFormData({
                                firstName: userData?.firstName || "",
                                lastName: userData?.lastName || "",
                                email: user?.email || "",
                                gender: userData?.gender || "",
                              })
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSubmit} className="bg-rose-700 hover:bg-rose-800" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-rose-700 hover:bg-rose-800">
                          Edit Profile
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>Manage your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Password</p>
                        <p>••••••••••</p>
                      </div>
                      <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-rose-700" />
                      </div>
                      <h3 className="text-xl font-medium">
                        {formData.firstName} {formData.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{formData.email}</p>
                     
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Learning Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-rose-100 p-2">
                          <BookOpen className="h-4 w-4 text-rose-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Enrolled Course</p>
                          <p className="text-sm text-gray-500">A1 German</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-rose-100 p-2">
                          <Clock className="h-4 w-4 text-rose-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Enrollment Date</p>
                          <p className="text-sm text-gray-500">{courseProgress?.enrollmentDate || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Lessons Completed</p>
                          <p className="text-sm text-gray-500">
                            {courseProgress?.completedLessons || 0} of {courseProgress?.totalLessons || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-rose-100 p-2">
                          <Clock className="h-4 w-4 text-rose-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Time Spent Learning</p>
                          <p className="text-sm text-gray-500">{courseProgress?.timeSpent || "0 hours 0 minutes"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

