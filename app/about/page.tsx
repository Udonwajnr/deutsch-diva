import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-rose-800">About DeutschDiva</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Empowering women to master the German language with our comprehensive A1 course.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-rose-800">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At DeutschDiva, we believe that language learning should be accessible, engaging, and effective. Our
              mission is to provide high-quality German language education specifically designed for women, helping them
              build confidence and fluency in a supportive learning environment.
            </p>
            <p className="text-gray-600">
              We focus on practical, real-world language skills that enable our students to communicate effectively in
              German-speaking environments, whether for travel, work, or personal enrichment.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Women learning German"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-rose-800">Why Choose DeutschDiva?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full bg-rose-100 p-3 w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Curriculum</h3>
                <p className="text-gray-600">
                  Our A1 German course covers all essential aspects of the language, from basic vocabulary and grammar
                  to practical conversation skills.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full bg-rose-100 p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Women-Focused Approach</h3>
                <p className="text-gray-600">
                  We create a supportive learning environment specifically designed for women, with content that
                  resonates with their experiences and goals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full bg-rose-100 p-3 w-fit mb-4">
                  <GraduationCap className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Content</h3>
                <p className="text-gray-600">
                  Our course materials are developed by experienced German language instructors with a deep
                  understanding of effective language learning methodologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1 rounded-xl overflow-hidden shadow-lg">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="German language learning"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold mb-4 text-rose-800">Our Approach to Language Learning</h2>
            <p className="text-gray-600 mb-4">
              We believe that effective language learning combines structured lessons with practical application. Our A1
              German course integrates:
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-rose-100 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-rose-700"></div>
                </div>
                <span>Clear, concise explanations of grammar and vocabulary</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-rose-100 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-rose-700"></div>
                </div>
                <span>Engaging video lessons from expert instructors</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-rose-100 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-rose-700"></div>
                </div>
                <span>Interactive exercises to reinforce learning</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-rose-100 p-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-rose-700"></div>
                </div>
                <span>Cultural insights to provide context and deeper understanding</span>
              </li>
            </ul>
            <p className="text-gray-600">
              This comprehensive approach ensures that our students not only learn the language but also develop the
              confidence to use it in real-world situations.
            </p>
          </div>
        </div>

        <div className="bg-rose-800 text-white rounded-xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your German Journey?</h2>
          <p className="mx-auto max-w-[600px] mb-6 text-rose-100">
            Join our community of learners and take the first step towards German fluency today.
          </p>
          <Link href="/signup">
            <Button className="bg-white text-rose-800 hover:bg-rose-100">
              Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

