"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Labels"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Progress } from "../components/ui/progress"
import { Camera, Edit, Star, Trophy, Smile } from "lucide-react"
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import API from "../service/api.js"
import { useAuthStore } from "../store/useAuthStore"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { authUser } = useAuthStore()
  const { addNotification } = useNotifications()

   // use authUser data instead of hardcoded
  const [profile, setProfile] = useState({
    name: authUser?.username || "John Doe",
    email: authUser?.email || "john.doe@example.com",
    title: authUser?.position || "Senior Developer",
    company: authUser?.company || "Tech Corp",
    bio: authUser?.bio || "Passionate about creating amazing user experiences.",
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
      addNotification({ type: "info", title: "Updating", message: "Please wait..." })

      const formData = new FormData()
      formData.append("username", profile.name)
      formData.append("position", profile.title)
      formData.append("company", profile.company)
      formData.append("bio", profile.bio)
      if (selectedImg) {
        formData.append("file", selectedImg)
      }

      await API.updateProfile(formData)

      addNotification({ type: "success", title: "Success", message: "Profile updated!" })
      setIsEditing(false)
    } catch (err: any) {
      addNotification({ type: "error", title: "Error", message: err?.message || "Update failed" })
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

  const achievements = [
    { id: 1, name: "First Call", icon: "🎉", unlocked: true },
    { id: 2, name: "Happy Caller", icon: "😊", unlocked: true },
    { id: 3, name: "Meeting Master", icon: "👑", unlocked: true },
    { id: 4, name: "Emotion Expert", icon: "🎭", unlocked: false },
    { id: 5, name: "Social Butterfly", icon: "🦋", unlocked: false },
    { id: 6, name: "Tech Guru", icon: "🚀", unlocked: false },
  ]

  const recentEmotions = [
    { emotion: "😊", count: 45, percentage: 35 },
    { emotion: "🤔", count: 32, percentage: 25 },
    { emotion: "👍", count: 28, percentage: 22 },
    { emotion: "😄", count: 23, percentage: 18 },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Profile Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 glow">
                      <AvatarImage src={selectedImg ? URL.createObjectURL(selectedImg) : profile.avatar} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition">
                      <Camera className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                          className="text-xl font-bold"
                        />
                        <Input
                          value={profile.title}
                          onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
                        />
                        <Input
                          value={profile.company}
                          onChange={(e) => setProfile((prev) => ({ ...prev, company: e.target.value }))}
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
                          <Badge variant="outline">Level {Math.floor(stats.totalCalls / 10) + 1}</Badge>
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
                      onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full mt-2 p-3 border rounded-lg resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex justify-end mt-4">
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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

          <TabsContent value="stats" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smile className="w-5 h-5 mr-2" />
                  Emotion Analytics
                </CardTitle>
                <CardDescription>Your most frequent emotions during calls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEmotions.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="text-2xl">{item.emotion}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.count} times</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="flex items-center space-x-3">
                        <span className="w-8 text-sm">{day}</span>
                        <Progress value={Math.random() * 100} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 5) + 1}h</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Call Quality</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20 h-2" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Punctuality</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88} className="w-20 h-2" />
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Engagement</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock achievements by using MediCall features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-primary/20 to-blue-600/20 border-primary/30 glow"
                          : "bg-muted/20 border-muted opacity-50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="mt-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="Add phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input value="UTC-5 (Eastern Time)" readOnly />
                </div>
              </CardContent>
            </Card>
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
