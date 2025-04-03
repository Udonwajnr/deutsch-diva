import Link from "next/link"
import { BookOpen, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-4 text-center">
      <div className="rounded-full bg-white p-6 shadow-md">
        <BookOpen className="h-16 w-16 text-rose-700" />
      </div>
      <h1 className="mt-8 text-4xl font-bold text-rose-800">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-4 max-w-md text-gray-600">
        The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the
        homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button className="bg-rose-700 hover:bg-rose-800">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/courses/a1-german">
          <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-100">
            <BookOpen className="mr-2 h-4 w-4" />
            Explore Courses
          </Button>
        </Link>
      </div>
    </div>
  )
}

