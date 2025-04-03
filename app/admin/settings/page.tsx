"use client"

import type React from "react"

import { useState } from "react"
import { Globe, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "LinguaLearn",
    siteDescription: "Master A1 German with our comprehensive course designed for women",
    contactEmail: "info@lingualearngerman.com",
    allowRegistration: true,
  })

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: "noreply@lingualearngerman.com",
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "smtp_username",
    smtpPassword: "••••••••••••",
    enableEmailNotifications: true,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    requireEmailVerification: true,
    passwordMinLength: "8",
    sessionTimeout: "30",
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name: string, checked: boolean, settingsType: "general" | "email" | "security") => {
    if (settingsType === "general") {
      setGeneralSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (settingsType === "email") {
      setEmailSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (settingsType === "security") {
      setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleSaveSettings = () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      toast("Settings Saved",{
        description: "Your settings have been saved successfully.",
      })
      setSaving(false)
    }, 1000)
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <CollapsibleSidebar variant="admin" />

        {/* Main Content */}
        <main className="md:ml-16 lg:ml-64 flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-rose-800">Admin Settings</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
                <TabsTrigger value="general">
                  <Globe className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your platform's general settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        name="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        name="siteDescription"
                        value={generalSettings.siteDescription}
                        onChange={handleGeneralChange}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralChange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowRegistration">Allow User Registration</Label>
                        <p className="text-sm text-muted-foreground">Enable or disable new user registrations</p>
                      </div>
                      <Switch
                        id="allowRegistration"
                        checked={generalSettings.allowRegistration}
                        onCheckedChange={(checked) => handleToggleChange("allowRegistration", checked, "general")}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings} disabled={saving} className="bg-rose-700 hover:bg-rose-800">
                      {saving ? "Saving..." : "Save Settings"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>Configure email server and notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        name="fromEmail"
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input
                        id="smtpServer"
                        name="smtpServer"
                        value={emailSettings.smtpServer}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          name="smtpPort"
                          value={emailSettings.smtpPort}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input
                          id="smtpUsername"
                          name="smtpUsername"
                          value={emailSettings.smtpUsername}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        name="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                      </div>
                      <Switch
                        id="enableEmailNotifications"
                        checked={emailSettings.enableEmailNotifications}
                        onCheckedChange={(checked) => handleToggleChange("enableEmailNotifications", checked, "email")}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings} disabled={saving} className="bg-rose-700 hover:bg-rose-800">
                      {saving ? "Saving..." : "Save Settings"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security and authentication settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require two-factor authentication for all users</p>
                      </div>
                      <Switch
                        id="enableTwoFactor"
                        checked={securitySettings.enableTwoFactor}
                        onCheckedChange={(checked) => handleToggleChange("enableTwoFactor", checked, "security")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireEmailVerification">Email Verification</Label>
                        <p className="text-sm text-muted-foreground">
                          Require email verification before account activation
                        </p>
                      </div>
                      <Switch
                        id="requireEmailVerification"
                        checked={securitySettings.requireEmailVerification}
                        onCheckedChange={(checked) =>
                          handleToggleChange("requireEmailVerification", checked, "security")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        name="passwordMinLength"
                        type="number"
                        min="6"
                        max="32"
                        value={securitySettings.passwordMinLength}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        name="sessionTimeout"
                        type="number"
                        min="5"
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecurityChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings} disabled={saving} className="bg-rose-700 hover:bg-rose-800">
                      {saving ? "Saving..." : "Save Settings"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

