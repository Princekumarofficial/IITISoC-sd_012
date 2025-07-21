"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Labels"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import {
  Card, CardContent, CardHeader, CardTitle
} from "../components/ui/Card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../components/ui/Tabs"
import { Camera, Edit, Star } from "lucide-react"
import { useNotifications } from "../components/Notification-system"
import API from "../service/api"
import { useAuthStore } from "../store/useAuthStore"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { authUser } = useAuthStore()
  const { addNotification } = useNotifications()

  const [profile, setProfile] = useState({
    name: authUser?.username || "",
    email: authUser?.email || "",
    title: authUser?.position || "",
    company: authUser?.company || "",
    bio: authUser?.bio || "",
    avatar: authUser?.photoURL || "/profile.jpg",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedImg, setSelectedImg] = useState<File | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedImg(file)
  }

  const handleSave = async () => {
    try {
      setIsUpdating(true)
      addNotification({
        type: "info",
        title: "Updating",
        message: "Please wait...",
      })

      const formData = new FormData()
      formData.append("username", profile.name)
      formData.append("position", profile.title)
      formData.append("company", profile.company)
      formData.append("bio", profile.bio)
      if (selectedImg) formData.append("file", selectedImg)

      await API.updateProfile(formData)

      addNotification({
        type: "success",
        title: "Success",
        message: "Profile updated!",
      })

      setIsEditing(false)
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Error",
        message: err?.message || "Update failed",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const stats = {
    totalCalls: 156,
    totalHours: 89,
    happinessScore: 92,
    engagementLevel: 88,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Profile Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 glow">
                      <AvatarImage
                        src={selectedImg ? URL.createObjectURL(selectedImg) : profile.avatar}
                        alt="avatar"
                      />
                      <AvatarFallback className="text-2xl">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={profile.name}
                          onChange={(e) =>
                            setProfile((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Name"
                          className="text-xl font-bold"
                        />
                        <Input
                          value={profile.title}
                          onChange={(e) =>
                            setProfile((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="Title"
                        />
                        <Input
                          value={profile.company}
                          onChange={(e) =>
                            setProfile((prev) => ({ ...prev, company: e.target.value }))
                          }
                          placeholder="Company"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-lg text-muted-foreground">{profile.title}</p>
                        <p className="text-sm text-muted-foreground">{profile.company}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-blue-600/20">
                            <Star className="w-3 h-3 mr-1" />
                            Premium User
                          </Badge>
                          <Badge variant="outline">
                            Level {Math.floor(stats.totalCalls / 10) + 1}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      className="w-full mt-2 p-3 border rounded-lg resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-4">
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalCalls}</div>
                  <div className="text-sm text-muted-foreground">Total Calls</div>
                </CardContent>
              </Card>
              <Card className="glass glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
                  <div className="text-sm text-muted-foreground">Call Time</div>
                </CardContent>
              </Card>
              <Card className="glass glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.happinessScore}%</div>
                  <div className="text-sm text-muted-foreground">Happiness</div>
                </CardContent>
              </Card>
              <Card className="glass glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.engagementLevel}%</div>
                  <div className="text-sm text-muted-foreground">Engagement</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
