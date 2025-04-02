import Link from "next/link"
import { BookOpen, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProgressPage() {
  // Mock user progress data
  const userProgress = {
    completedLessons: 3,
    totalLessons: 10,
    progress: 30,
    lastActivity: "2 days ago",
    timeSpent: "4 hours 30 minutes",
  }

  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: "Introduction to German",
      description: "Learn about the German language and its importance.",
      duration: "45 min",
      completed: true,
      completedDate: "2 weeks ago",
    },
    {
      id: 2,
      title: "Basic Greetings",
      description: "Learn how to greet people in German.",
      duration: "60 min",
      completed: true,
      completedDate: "1 week ago",
    },
    {
      id: 3,
      title: "Numbers 1-20",
      description: "Master counting in German from 1 to 20.",
      duration: "45 min",
      completed: true,
      completedDate: "2 days ago",
    },
    {
      id: 4,
      title: "Common Phrases",
      description: "Learn everyday phrases to help you communicate.",
      duration: "60 min",
      completed: false,
    },
    {
      id: 5,
      title: "Basic Grammar",
      description: "Introduction to German grammar rules.",
      duration: "75 min",
      completed: false,
    },
    {
      id: 6,
      title: "Family Members",
      description: "Learn vocabulary related to family members.",
      duration: "60 min",
      completed: false,
    },
    {
      id: 7,
      title: "Food and Drinks",
      description: "Essential vocabulary for ordering food and drinks.",
      duration: "45 min",
      completed: false,
    },
    {
      id: 8,
      title: "Telling Time",
      description: "Learn how to tell time in German.",
      duration: "60 min",
      completed: false,
    },
    {
      id: 9,
      title: "Days and Months",
      description: "Learn the days of the week and months of the year.",
      duration: "45 min",
      completed: false,
    },
    {
      id: 10,
      title: "Review and Practice",
      description: "Review everything you've learned and practice your skills.",
      duration: "90 min",
      completed: false,
    },
  ]

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-rose-800">Your Learning Progress</h1>
          <p className="mt-2 text-gray-600">Track your progress in the A1 German course.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Course Progress</CardTitle>
              <CardDescription>A1 German Course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Overall Progress</span>
                  <span className="text-sm font-medium">{userProgress.progress}%</span>
                </div>
                <Progress value={userProgress.progress} className="h-2" />
                <div className="pt-2 text-sm text-gray-500">
                  {userProgress.completedLessons} of {userProgress.totalLessons} lessons completed
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Last Activity</CardTitle>
              <CardDescription>Your recent learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-700" />
                  <span className="font-medium">Lesson 3: Numbers 1-20</span>
                </div>
                <p className="text-sm text-gray-500">Completed {userProgress.lastActivity}</p>
                <Link href="/courses/a1-german/lessons/4">
                  <Button className="mt-2 w-full bg-rose-700 hover:bg-rose-800">Continue Learning</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Learning Stats</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-rose-100 p-2">
                    <Clock className="h-4 w-4 text-rose-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time Spent</p>
                    <p className="text-sm text-gray-500">{userProgress.timeSpent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lessons Completed</p>
                    <p className="text-sm text-gray-500">{userProgress.completedLessons} lessons</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Progress</CardTitle>
            <CardDescription>Track your progress through all lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${lesson.completed ? "bg-green-100" : "bg-rose-100"}`}>
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-rose-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        Lesson {lesson.id}: {lesson.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {lesson.duration}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                    {lesson.completed && <p className="text-xs text-green-600">Completed {lesson.completedDate}</p>}
                  </div>
                  <div>
                    <Link href={`/courses/a1-german/lessons/${lesson.id}`}>
                      <Button
                        variant={lesson.completed ? "outline" : "default"}
                        className={
                          lesson.completed
                            ? "border-green-200 text-green-700 hover:bg-green-50"
                            : "bg-rose-700 hover:bg-rose-800"
                        }
                      >
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

