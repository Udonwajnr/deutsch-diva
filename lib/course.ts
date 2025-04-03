import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  videoUrl: string
  duration: string
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: string
  instructor: string
  imageUrl: string
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

// Fetch a course by ID
export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const courseDoc = await getDoc(doc(db, "courses", courseId))

    if (!courseDoc.exists()) {
      return null
    }

    const courseData = courseDoc.data() as Omit<Course, "id">

    // Fetch lessons for this course
    const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId))

    const lessonsSnapshot = await getDocs(lessonsQuery)
    const lessons = lessonsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[]

    // Sort lessons by order
    lessons.sort((a, b) => a.order - b.order)

    return {
      id: courseDoc.id,
      ...courseData,
      lessons,
    }
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

// Fetch all courses
export async function getAllCourses(): Promise<Course[]> {
  try {
    const coursesSnapshot = await getDocs(collection(db, "courses"))

    const courses = await Promise.all(
      coursesSnapshot.docs.map(async (doc) => {
        const courseData = doc.data() as Omit<Course, "id" | "lessons">

        // Fetch lessons for this course
        const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", doc.id))

        const lessonsSnapshot = await getDocs(lessonsQuery)
        const lessons = lessonsSnapshot.docs.map((lessonDoc) => ({
          id: lessonDoc.id,
          ...lessonDoc.data(),
        })) as Lesson[]

        // Sort lessons by order
        lessons.sort((a, b) => a.order - b.order)

        return {
          id: doc.id,
          ...courseData,
          lessons,
        }
      }),
    )

    return courses
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

// Create a new course
export async function createCourse(courseData: Omit<Course, "id" | "lessons">): Promise<string> {
  try {
    const courseRef = doc(collection(db, "courses"))
    await setDoc(courseRef, {
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return courseRef.id
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

// Update a course
export async function updateCourse(
  courseId: string,
  courseData: Partial<Omit<Course, "id" | "lessons">>,
): Promise<void> {
  try {
    const courseRef = doc(db, "courses", courseId)
    await updateDoc(courseRef, {
      ...courseData,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

// Add a lesson to a course
export async function addLesson(courseId: string, lessonData: Omit<Lesson, "id">): Promise<string> {
  try {
    const lessonRef = doc(collection(db, "lessons"))
    await setDoc(lessonRef, {
      ...lessonData,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return lessonRef.id
  } catch (error) {
    console.error("Error adding lesson:", error)
    throw error
  }
}

// Update a lesson
export async function updateLesson(lessonId: string, lessonData: Partial<Lesson>): Promise<void> {
  try {
    const lessonRef = doc(db, "lessons", lessonId)
    await updateDoc(lessonRef, {
      ...lessonData,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating lesson:", error)
    throw error
  }
}

// Enroll a user in a course
export async function enrollUserInCourse(userId: string, courseId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const userData = userDoc.data()
    const enrolledCourses = userData.enrolledCourses || []

    // Check if user is already enrolled
    if (enrolledCourses.includes(courseId)) {
      return
    }

    // Add course to user's enrolled courses
    await updateDoc(userRef, {
      enrolledCourses: [...enrolledCourses, courseId],
      [`progress.${courseId}`]: {
        completedLessons: [],
        lastAccessedLesson: null,
        enrolledAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error enrolling user in course:", error)
    throw error
  }
}

// Mark a lesson as completed
export async function markLessonAsCompleted(userId: string, courseId: string, lessonId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const userData = userDoc.data()
    const courseProgress = userData.progress?.[courseId] || {
      completedLessons: [],
      lastAccessedLesson: null,
      enrolledAt: new Date().toISOString(),
    }

    // Check if lesson is already marked as completed
    if (courseProgress.completedLessons.includes(lessonId)) {
      return
    }

    // Add lesson to completed lessons
    await updateDoc(userRef, {
      [`progress.${courseId}.completedLessons`]: [...courseProgress.completedLessons, lessonId],
      [`progress.${courseId}.lastAccessedLesson`]: lessonId,
      [`progress.${courseId}.lastAccessedAt`]: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error marking lesson as completed:", error)
    throw error
  }
}

// Get user progress for a course
export async function getUserCourseProgress(userId: string, courseId: string) {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const userData = userDoc.data()
    return (
      userData.progress?.[courseId] || {
        completedLessons: [],
        lastAccessedLesson: null,
        enrolledAt: null,
      }
    )
  } catch (error) {
    console.error("Error getting user course progress:", error)
    throw error
  }
}

