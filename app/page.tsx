"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Users,
  Clock,
  Award,
  Globe,
  MessageCircle,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Star,
  Menu,
  X,
  UserPlus,
} from "lucide-react"
import Navbar from "@/components/Navbar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Footer from "@/components/footer"
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Animation on load
    setIsVisible(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <Navbar/>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* SVG Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 text-rose-100 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.4,81.4,26.8,73.6,38.5C65.8,50.2,55.7,60.3,43.7,67.4C31.7,74.4,17.8,78.5,2.9,74.8C-12,71.1,-23.9,59.6,-35.6,49.9C-47.2,40.3,-58.5,32.5,-65.7,21.2C-72.9,9.9,-76,-4.9,-73.2,-18.3C-70.5,-31.7,-61.9,-43.7,-50.4,-51.5C-38.9,-59.2,-24.4,-62.7,-9.8,-67.8C4.9,-72.8,19.8,-79.4,34.6,-79.9C49.5,-80.4,64.3,-74.8,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 text-rose-200 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M39.9,-65.7C54.3,-60,70.2,-53.8,79.7,-42.1C89.2,-30.3,92.3,-13,89.5,3C86.7,19,78,33.8,68.2,47.1C58.3,60.5,47.3,72.4,34,78.1C20.7,83.8,5.2,83.2,-9.7,79.7C-24.7,76.2,-39.1,69.8,-51.5,60.3C-63.9,50.8,-74.3,38.3,-79.4,23.9C-84.5,9.5,-84.3,-6.8,-79.6,-21.2C-74.9,-35.6,-65.8,-48.2,-53.7,-55.1C-41.6,-62,-26.6,-63.3,-12.8,-67.2C1,-71.1,13.7,-77.7,25.5,-76.1C37.3,-74.5,48.2,-65.7,39.9,-65.7Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 text-rose-300 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M47.7,-79.1C62.9,-71.9,77.2,-61.7,83.9,-47.8C90.5,-33.8,89.5,-16.9,86.7,-1.6C83.9,13.7,79.4,27.3,71.5,39.2C63.6,51,52.3,61,39.5,67.8C26.6,74.5,12.3,78,-2.4,81.8C-17.1,85.6,-32.2,89.7,-44.2,84.9C-56.2,80.1,-65.1,66.4,-72.9,52.2C-80.7,38,-87.4,23.3,-88.9,7.8C-90.4,-7.7,-86.7,-24,-78.8,-37.3C-70.9,-50.6,-58.8,-60.8,-45.1,-68.7C-31.4,-76.6,-16.2,-82.2,-0.2,-81.9C15.9,-81.6,32.5,-86.3,47.7,-79.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-rose-100 opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full bg-rose-100 opacity-50"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div
                className={`flex flex-col justify-center space-y-4 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <div className="inline-flex items-center rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-rose-700 mb-4 animate-pulse">
                  <span className="font-medium">Exclusively for women</span>
                </div>
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
                    <Button className="bg-rose-700 hover:bg-rose-800 transition-transform hover:scale-105">
                      Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/courses/a1-german">
                    <Button
                      variant="outline"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 transition-transform hover:scale-105"
                    >
                      Course Details
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-xs font-medium text-rose-700 animate-bounce">
                      JD
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center text-xs font-medium text-rose-700 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    >
                      MC
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-xs font-medium text-rose-700 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      AS
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-xs font-medium text-white animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    >
                      +5
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Join 500+ women learning German</p>
                </div>
              </div>
              <div
                className={`flex items-center justify-center transition-all duration-1000 delay-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl hover:shadow-rose-200/50 transition-all duration-500 hover:scale-105">
                  <img
                    src="/img5.png"
                    alt="German language learning"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-rose-100 p-2">
                        <GraduationCap className="h-4 w-4 text-rose-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-rose-800">A1 German Course</p>
                        <p className="text-xs text-gray-500">12 weeks • 24 lessons • Beginner friendly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Language Elements */}
        <div className="absolute top-1/4 left-10 animate-float opacity-20 text-rose-800 hidden lg:block">
          <div className="text-6xl font-bold">Hallo</div>
        </div>
        <div className="absolute top-1/3 right-10 animate-float-delayed opacity-20 text-rose-800 hidden lg:block">
          <div className="text-5xl font-bold">Guten Tag</div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float-slow opacity-20 text-rose-800 hidden lg:block">
          <div className="text-4xl font-bold">Danke</div>
        </div>

        {/* Stats Section */}
        <section className="w-full py-12 bg-white border-y border-rose-100">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2 transform transition-all duration-500 hover:scale-110">
                <p className="text-3xl font-bold text-rose-700">500+</p>
                <p className="text-sm text-gray-500">Active Students</p>
              </div>
              <div className="space-y-2 transform transition-all duration-500 hover:scale-110">
                <p className="text-3xl font-bold text-rose-700">24</p>
                <p className="text-sm text-gray-500">Comprehensive Lessons</p>
              </div>
              <div className="space-y-2 transform transition-all duration-500 hover:scale-110">
                <p className="text-3xl font-bold text-rose-700">12</p>
                <p className="text-sm text-gray-500">Weeks Program</p>
              </div>
              <div className="space-y-2 transform transition-all duration-500 hover:scale-110">
                <p className="text-3xl font-bold text-rose-700">95%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-700 mb-4">
                <span className="font-medium">Course Features</span>
              </div>
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
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <BookOpen className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Comprehensive Curriculum</h3>
                <p className="text-center text-gray-500">
                  Structured lessons covering all aspects of A1 German proficiency.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <CheckCircle className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Progress Tracking</h3>
                <p className="text-center text-gray-500">
                  Monitor your learning journey with our intuitive progress tracking system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <GraduationCap className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Expert Content</h3>
                <p className="text-center text-gray-500">
                  Learn from carefully curated content and professional instructional videos.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <Clock className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Flexible Learning</h3>
                <p className="text-center text-gray-500">
                  Learn at your own pace with 24/7 access to all course materials.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <MessageCircle className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Community Support</h3>
                <p className="text-center text-gray-500">
                  Connect with fellow learners in our supportive women-only community.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-rose-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-200 hover:-translate-y-1">
                <div className="rounded-full bg-rose-100 p-3">
                  <Award className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Certification</h3>
                <p className="text-center text-gray-500">
                  Receive a certificate of completion when you finish the course.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-rose-50 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-rose-200 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-rose-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-rose-400 rounded-full opacity-10 animate-blob animation-delay-4000"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-1.5 text-sm text-rose-700 mb-4 shadow-sm transform transition-transform hover:scale-105">
              <span className="font-medium">Simple Process</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-800 drop-shadow-sm">
                How Our Course Works
              </h2>
              <p className="max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed mx-auto">
                Start your German language journey in just a few simple steps.
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Progress Line - Desktop */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-rose-200 z-0"></div>

            <div className="grid gap-10 md:gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                {/* Step Number - Desktop */}
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-md transition-all duration-300 group-hover:bg-rose-700 group-hover:text-white group-hover:scale-110">
                  <UserPlus className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    1
                  </div>
                </div>

                <div className="space-y-3 transition-all duration-300 group-hover:transform group-hover:translate-y-[-5px]">
                  <h3 className="text-xl font-bold text-rose-800 group-hover:text-rose-700">Sign Up</h3>
                  <p className="text-gray-600 max-w-[250px] mx-auto">
                    Create your account and complete the verification process designed specifically for women.
                  </p>
                  <div className="pt-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link href="/signup">
                      <Button variant="link" className="text-rose-700 p-0 h-auto font-medium">
                        Create Account <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Mobile connector */}
                <div className="md:hidden absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-1 h-[20px] bg-rose-200"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                {/* Step Number - Desktop */}
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-md transition-all duration-300 group-hover:bg-rose-700 group-hover:text-white group-hover:scale-110">
                  <BookOpen className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    2
                  </div>
                </div>

                <div className="space-y-3 transition-all duration-300 group-hover:transform group-hover:translate-y-[-5px]">
                  <h3 className="text-xl font-bold text-rose-800 group-hover:text-rose-700">Enroll in Course</h3>
                  <p className="text-gray-600 max-w-[250px] mx-auto">
                    Choose the A1 German course and begin your learning journey with our structured curriculum.
                  </p>
                  <div className="pt-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link href="/courses/a1-german">
                      <Button variant="link" className="text-rose-700 p-0 h-auto font-medium">
                        View Course <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Mobile connector */}
                <div className="md:hidden absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-1 h-[20px] bg-rose-200"></div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                {/* Step Number - Desktop */}
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-md transition-all duration-300 group-hover:bg-rose-700 group-hover:text-white group-hover:scale-110">
                  <GraduationCap className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    3
                  </div>
                </div>

                <div className="space-y-3 transition-all duration-300 group-hover:transform group-hover:translate-y-[-5px]">
                  <h3 className="text-xl font-bold text-rose-800 group-hover:text-rose-700">Learn & Progress</h3>
                  <p className="text-gray-600 max-w-[250px] mx-auto">
                    Complete lessons at your own pace and track your progress with our intuitive learning dashboard.
                  </p>
                  <div className="pt-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link href="/dashboard">
                      <Button variant="link" className="text-rose-700 p-0 h-auto font-medium">
                        Start Learning <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <Link href="/signup">
              <Button className="bg-rose-700 hover:bg-rose-800 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



        {/* Course Content Preview */}
        

      

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-700 mb-4">
                <span className="font-medium">Student Success</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-800">
                  What Our Students Say
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from women who have transformed their German language skills with our course.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="space-y-2">
                  <div className="flex text-rose-500 mb-2">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="text-gray-500">
                    "This course has been a game-changer for me. The structured approach made learning German enjoyable
                    and effective. I can now confidently have basic conversations in German!"
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
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="space-y-2">
                  <div className="flex text-rose-500 mb-2">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="text-gray-500">
                    "The video lessons and interactive content made it easy to stay engaged. The community of women
                    learners provided amazing support throughout my journey."
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
              <div className="flex flex-col justify-between space-y-4 rounded-lg border border-rose-100 bg-white p-6 shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
                <div className="space-y-2">
                  <div className="flex text-rose-500 mb-2">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="text-gray-500">
                    "As a beginner, I was worried about learning a new language, but this course made it accessible and
                    fun. The progress tracking kept me motivated. Highly recommend!"
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

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-rose-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-rose-700">
                <span className="font-medium">Common Questions</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-rose-800">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our German language course.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    Is this course suitable for complete beginners?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    Yes, our A1 German course is specifically designed for complete beginners. No prior knowledge of
                    German is required. We start from the very basics and gradually build your skills.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    How long does it take to complete the course?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    The course is designed to be completed in 12 weeks, with approximately 3 hours of study per week.
                    However, you can learn at your own pace and take more or less time depending on your schedule and
                    learning style.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    Why is this course only for women?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    We've created a women-only learning environment to foster a supportive community where women can feel
                    comfortable practicing a new language. Our teaching approach is tailored to create an inclusive and
                    encouraging atmosphere.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    Will I receive a certificate after completing the course?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    Yes, upon successful completion of the course, you will receive a certificate of completion. This
                    certificate demonstrates your achievement in reaching the A1 level of German proficiency.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    Can I access the course on mobile devices?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    Yes, our platform is fully responsive and works on all devices including smartphones, tablets,
                    laptops, and desktop computers. You can learn German wherever you are.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

      

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-rose-600 to-rose-700 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0tMTggMGgtNlYwaDZ2MzB6bTYgMGg2VjBoLTZ2MzB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-400 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* Content - Left side (3 columns on md+) */}
            <div className="md:col-span-3 space-y-6">
              <div className="inline-flex items-center rounded-full border border-rose-200/30 bg-rose-500/30 backdrop-blur-sm px-3 py-1 text-sm text-rose-100">
                <Star className="mr-1 h-3.5 w-3.5 text-rose-100" />
                <span className="font-medium">Limited-time offer: 20% off</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your German Journey?
                </h2>
                <p className="text-rose-100 text-lg md:text-xl max-w-2xl">
                  Join our community of <span className="font-semibold">500+ women</span> and take the first step
                  towards German fluency today. Our structured A1 course is designed specifically for you.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-rose-800 hover:bg-rose-50 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses/a1-german">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40  hover:bg-rose-50 transition-all text-rose-800"
                  >
                    View Course Details
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-2 text-rose-100">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-xs font-medium text-rose-800">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center text-xs font-medium text-rose-800">
                    MC
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-xs font-medium text-rose-800">
                    AS
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Joined by 500+ women</span>
                  <div className="flex items-center mt-0.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current text-yellow-300" />
                      ))}
                    </div>
                    <span className="ml-1 text-xs">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

        {/* Footer */}
        <Footer/>
      </div>
    </>
  )
}

