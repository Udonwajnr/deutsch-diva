"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export default function VerifyGenderPage() {
  const router = useRouter()
  const { user, userData, updateUserData, logout } = useAuth()
  const [gender, setGender] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if user is not logged in
  if (!user && typeof window !== "undefined") {
    router.push("/login")
    return null
  }

  // Redirect if user already has gender set to female
  if (userData?.gender === "female" && typeof window !== "undefined") {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (gender.toLowerCase() !== "female") {
        await logout()
        toast.error("Registration Error",{
          description: "We're sorry, but this platform is currently only available for female users.",
        })
        router.push("/")
        return
      }

      await updateUserData({ gender })

      toast.success("Gender Verified",{
        description: "Thank you for verifying your gender. You can now access the platform.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Error",{
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-8 w-8 text-rose-700" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-rose-800">Verify Your Gender</h1>
          <p className="text-sm text-muted-foreground">This platform is designed specifically for female users.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-xl">Gender Verification</CardTitle>
              <CardDescription>Please select your gender to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex flex-col gap-2" required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Note: This platform is currently only available for female users.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-rose-700 hover:bg-rose-800" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => logout()} disabled={isLoading}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

