"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast("Message Sent!",{
        description: "We've received your message and will get back to you soon.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <Navbar/>
      <div className="container py-10">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-rose-800">Contact Us</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Have questions about our A1 German course? We're here to help.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-700" />
                  Email
                </CardTitle>
                <CardDescription>Reach out via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <Link href="mailto:info@DeutschDivagerman.com" className="hover:text-rose-700">
                    info@DeutschDivagerman.com
                  </Link>
                </p>
                <p className="text-sm text-gray-500 mt-2">We aim to respond to all inquiries within 24 hours.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-rose-700" />
                  Phone
                </CardTitle>
                <CardDescription>Call us directly</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <Link href="tel:+1234567890" className="hover:text-rose-700">
                    +1 (234) 567-890
                  </Link>
                </p>
                <p className="text-sm text-gray-500 mt-2">Available Monday-Friday, 9am-5pm CET.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-700" />
                  Location
                </CardTitle>
                <CardDescription>Our office address</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  123 Language Street
                  <br />
                  Berlin, Germany 10115
                </p>
                <p className="text-sm text-gray-500 mt-2">Visit us by appointment only.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mx-auto max-w-[800px]">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Course Inquiry"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full bg-rose-700 hover:bg-rose-800" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

            {/* This would be a Google Map in a real implementation */}
          {/* <div className="rounded-xl overflow-hidden h-[400px] shadow-lg">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Map would be displayed here</p>
            </div>
          </div> */}
        </div>
      </div>
      <Footer/>
    </>
  )
}

