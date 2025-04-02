"use client"

import type React from "react"

import { useState } from "react"
import { BookOpen, CheckCircle, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function ProfilePage() {
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    gender: "Female",
    progress: 30,
    completedLessons: 3,
    totalLessons: 10,
    enrollmentDate: "June 15, 2023",
    timeSpent: "4 hours 30 minutes",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserData((prev) => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    }))
    setIsEditing(false)
    toast("Profile Updated",{
      description: "Your profile information has been updated successfully.",
    })
  }

  return (
    <div className="container py-10">
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
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" value={userData.gender} disabled />
                      <p className="text-xs text-gray-500">Gender cannot be changed after registration.</p>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">First Name</p>
                        <p>{userData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Name</p>
                        <p>{userData.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p>{userData.gender}</p>
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
                          firstName: userData.firstName,
                          lastName: userData.lastName,
                          email: userData.email,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-rose-700 hover:bg-rose-800">
                      Save Changes
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
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <Separator className="my-4" />
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Course Progress</span>
                    <span className="text-sm font-medium">{userData.progress}%</span>
                  </div>
                  <Progress value={userData.progress} className="h-2" />
                </div>
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
                    <p className="text-sm text-gray-500">{userData.enrollmentDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lessons Completed</p>
                    <p className="text-sm text-gray-500">
                      {userData.completedLessons} of {userData.totalLessons}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-rose-100 p-2">
                    <Clock className="h-4 w-4 text-rose-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time Spent Learning</p>
                    <p className="text-sm text-gray-500">{userData.timeSpent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

