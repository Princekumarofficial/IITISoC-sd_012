"use client"
import React from "react"

import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Camera, Mail, User, Briefcase, Building2, Phone, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Navbar } from "../components/Navbar"
import { TailCursor } from "../components/Tail-cursor"
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import API from "../service/api.js"

const ProfilePageContent: React.FC = () => {
  const { addNotification } = useNotifications()
  const { authUser } = useAuthStore()
  
  const [editMode, setEditMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedImg, setSelectedImg] = useState<File | null>(null)

  const [profileData, setProfileData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    position: authUser?.position || "",
    company: authUser?.company || "",
    bio: authUser?.bio || "",
    phone: authUser?.phone || "",
    photoURL: authUser?.photoURL || "/profile.jpg",
  })

  // handle selecting new image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedImg(file)
  }

  // handle saving updated profile
  const handleSave = async () => {
    try {
      setIsUpdating(true)
      addNotification({ type: "info", title: "Updating", message: "Please wait..." })

      const formData = new FormData()
      formData.append("username", profileData.username)
      formData.append("position", profileData.position)
      formData.append("company", profileData.company)
      formData.append("bio", profileData.bio)
      formData.append("phone", profileData.phone.toString())
      if (selectedImg) {
        formData.append("file", selectedImg)
      }

      const res = await API.updateProfile(formData)

      addNotification({ type: "success", title: "Success", message: "Profile updated!" })
      
      // optionally update UI / reload
      setEditMode(false)
    } catch (err: any) {
      addNotification({ type: "error", title: "Error", message: err?.message || "Update failed" })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <TailCursor />
      <Navbar />
      <div className="h-full pt-20 pb-10 px-4 max-w-3xl mx-auto space-y-6 animated-bg color-wave">

        <Card className="glass glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Your Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-28 h-28 glow">
                <AvatarImage src={selectedImg ? URL.createObjectURL(selectedImg) : profileData.photoURL} />
                <AvatarFallback>
                  {authUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:scale-105 transition">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <Badge variant="secondary">Active</Badge>
            <Badge variant="outline">Since: {authUser?.createdAt?.split("T")[0]}</Badge>
          </CardContent>
        </Card>

        <Card className="glass glow">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Basic Information</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field icon={<User className="w-4 h-4" />} label="Username" value={profileData.username} editable={editMode} onChange={v => setProfileData({ ...profileData, username: v })} />
            <Field icon={<Mail className="w-4 h-4" />} label="Email" value={profileData.email} editable={false} />
            <Field icon={<Briefcase className="w-4 h-4" />} label="Position" value={profileData.position} editable={editMode} onChange={v => setProfileData({ ...profileData, position: v })} />
            <Field icon={<Building2 className="w-4 h-4" />} label="Company" value={profileData.company} editable={editMode} onChange={v => setProfileData({ ...profileData, company: v })} />
            <Field icon={<Phone className="w-4 h-4" />} label="Phone" value={profileData.phone} editable={editMode} onChange={v => setProfileData({ ...profileData, phone: v })} />
            <Field icon={<Info className="w-4 h-4" />} label="Bio" value={profileData.bio} editable={editMode} onChange={v => setProfileData({ ...profileData, bio: v })} multiline />

            {editMode && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save"}</Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  )
}

const Field = ({ icon, label, value, editable, onChange, multiline = false }: {
  icon: React.ReactNode, label: string, value: any, editable?: boolean, onChange?: (v: string) => void, multiline?: boolean
}) => (
  <div>
    <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">{icon}{label}</div>
    {editable && onChange ? (
      multiline ? (
        <textarea className="w-full px-4 py-2.5 bg-muted rounded-lg border resize-none" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input className="bg-muted" value={value} onChange={(e) => onChange(e.target.value)} />
      )
    ) : (
      <p className="px-4 py-2.5 bg-muted rounded-lg border">{value || "-"}</p>
    )}
  </div>
)

const ProfilePage: React.FC = () => (
  <NotificationProvider>
    <ProfilePageContent />
  </NotificationProvider>
)

export default ProfilePage
