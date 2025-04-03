import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function Footer(){
return(
    <footer className="border-t bg-background">
    <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
      <div className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-rose-700" />
          <span className="text-lg font-bold text-rose-800">DeutschDiva</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          Empowering women to master the German language with our comprehensive A1 course.
        </p>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/courses/a1-german" className="text-muted-foreground hover:text-foreground">
                Course
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="container py-4 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} DeutschDiva. All rights reserved.
    </div>
  </footer>   
)
}