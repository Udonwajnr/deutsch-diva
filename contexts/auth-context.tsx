"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  gender?: string
  enrolledCourses?: string[]
  progress?: Record<string, any>
  isAdmin?: boolean | false
  firstName?:string|null
  lastName?:string|null
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string, gender: string,isAdmin: boolean) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<UserData>) => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  console.log(userData)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUserData({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            ...(userDoc.data() as Omit<UserData, "uid" | "email" | "displayName">),
          })
        } else {
          setUserData({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, gender: string,isAdmin:boolean) => {
    try {
      // Verify gender is female
      if (gender.toLowerCase() !== "female") {
        throw new Error("We're sorry, but this platform is currently only available for female users.")
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        gender,
        enrolledCourses: [],
        isAdmin:false,
        createdAt: new Date().toISOString(),
      })

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user document exists
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          gender: "unknown", // We'll need to ask for gender later
          enrolledCourses: [],
          isAdmin:false,
          createdAt: new Date().toISOString(),
        })

        // Redirect to gender verification page if gender is unknown
        router.push("/verify-gender")
      } else {
        // Check if gender is female
        const userData = userDoc.data()
        if (userData.gender.toLowerCase() !== "female") {
          await signOut(auth)
          throw new Error("We're sorry, but this platform is currently only available for female users.")
        }

        router.push("/dashboard")
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return

    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, data, { merge: true })

      // Update local state
      setUserData((prev) => (prev ? { ...prev, ...data } : null))
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

