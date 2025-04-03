import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Users } from "lucide-react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-rose-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-rose-800">
                    Master A1 German Language
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Begin your journey to fluency with our comprehensive A1 German course designed specifically for women.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="bg-rose-700 hover:bg-rose-800">
                      Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/courses/a1-german">
                    <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                      Course Details
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/img.jpg"
                    alt="German language learning"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-800">
                  Why Choose Our A1 German Course?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our course is designed to provide you with a solid foundation in German language skills.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <BookOpen className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Comprehensive Curriculum</h3>
                <p className="text-center text-gray-500">
                  Structured lessons covering all aspects of A1 German proficiency.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <CheckCircle className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Progress Tracking</h3>
                <p className="text-center text-gray-500">
                  Monitor your learning journey with our intuitive progress tracking system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <GraduationCap className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Expert Content</h3>
                <p className="text-center text-gray-500">
                  Learn from carefully curated content and professional instructional videos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 bg-rose-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-800">
                  What Our Students Say
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-gray-500">
                    "This course has been a game-changer for me. The structured approach made learning German enjoyable
                    and effective."
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-rose-100 p-1">
                    <Users className="h-4 w-4 text-rose-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Completed A1 German</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-gray-500">
                    "The video lessons and interactive content made it easy to stay engaged. I can now confidently have
                    basic conversations in German!"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-rose-100 p-1">
                    <Users className="h-4 w-4 text-rose-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Emily Chen</p>
                    <p className="text-xs text-gray-500">Completed A1 German</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-gray-500">
                    "As a beginner, I was worried about learning a new language, but this course made it accessible and
                    fun. Highly recommend!"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-rose-100 p-1">
                    <Users className="h-4 w-4 text-rose-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maria Rodriguez</p>
                    <p className="text-xs text-gray-500">Completed A1 German</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-rose-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your German Journey?
                </h2>
                <p className="max-w-[900px] text-rose-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community of learners and take the first step towards German fluency today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button className="bg-white text-rose-800 hover:bg-rose-100">
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

