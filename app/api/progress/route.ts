import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Helper function to get the current user ID from Firebase auth
const getCurrentUserId = async (authToken: string): Promise<string | null> => {
  try {
    // In a real implementation, you would verify the Firebase ID token
    // This is a simplified version for demonstration purposes

    // For a production app, use Firebase Admin SDK to verify the token
    // import { auth as adminAuth } from "firebase-admin"
    // const decodedToken = await adminAuth.verifyIdToken(authToken)
    // return decodedToken.uid

    // For now, we'll extract the user ID from the cookie or header
    // This is NOT secure and should be replaced with proper token verification
    return authToken
  } catch (error) {
    console.error("Error verifying auth token:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies or headers
    const authToken =
      request.cookies.get("firebase-auth-token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "") ||
      ""

    // Get user ID from auth token
    const userId = await getCurrentUserId(authToken)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get courseId from query params
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", userId))

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    // Get course progress
    const courseProgress = userData.progress?.[courseId] || {
      completedLessons: [],
      lastAccessedLesson: null,
      lastAccessedAt: null,
      enrolledAt: userData.enrolledCourses?.includes(courseId) ? new Date().toISOString() : null,
    }

    return NextResponse.json(courseProgress)
  } catch (error) {
    console.error("Error getting progress:", error)
    return NextResponse.json({ error: "Failed to get progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies or headers
    const authToken =
      request.cookies.get("firebase-auth-token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "") ||
      ""

    // Get user ID from auth token
    const userId = await getCurrentUserId(authToken)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { courseId, lessonId } = body

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Course ID and Lesson ID are required" }, { status: 400 })
    }

    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", userId))

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update last accessed lesson
    await updateDoc(doc(db, "users", userId), {
      [`progress.${courseId}.lastAccessedLesson`]: lessonId,
      [`progress.${courseId}.lastAccessedAt`]: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}

