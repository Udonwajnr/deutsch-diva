import { Loader2 } from "lucide-react"

export default function ViewCourseLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-700" />
        <p className="mt-2 text-lg">Loading course data...</p>
      </div>
    </div>
  )
}

