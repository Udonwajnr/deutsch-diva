import Link from "next/link"
import { BookOpen, CheckCircle, Clock, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function LessonsPage() {
  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: "Introduction to German",
      description: "Learn about the German language and its importance.",
      duration: "45 min",
      completed: true,
    },
    {
      id: 2,
      title: "Basic Greetings",
      description: "Learn how to greet people in German.",
      duration: "60 min",
      completed: true,
    },
    {
      id: 3,
      title: "Numbers 1-20",
      description: "Master counting in German from 1 to 20.",
      duration: "45 min",
      completed: true,
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

  // Calculate progress
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const progress = (completedLessons / lessons.length) * 100

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-rose-800">A1 German Course Lessons</h1>
          <p className="mt-2 text-gray-600">Track your progress through all lessons in the A1 German course.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Your Progress</span>
            <span className="text-sm font-medium">
              {completedLessons}/{lessons.length} lessons completed ({Math.round(progress)}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className={lesson.completed ? "border-green-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${lesson.completed ? "bg-green-100" : "bg-rose-100"}`}>
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-rose-700" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
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
                    <div className="pt-2">
                      <Link href={`/courses/a1-german/lessons/${lesson.id}`}>
                        <Button
                          variant={lesson.completed ? "outline" : "default"}
                          className={
                            lesson.completed
                              ? "border-green-200 text-green-700 hover:bg-green-50"
                              : "bg-rose-700 hover:bg-rose-800"
                          }
                        >
                          {lesson.completed ? "Review Lesson" : "Start Lesson"}
                          <Play className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

