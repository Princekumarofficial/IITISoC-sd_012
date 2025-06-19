"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Switch } from "../components/ui/Switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Label } from "../components/ui/Labels"
import { Smile, Camera, Palette, Bell } from "lucide-react"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    emotionDetection: true,
    emojiOverlay: true,
    faceSwap: false,
    emotionLogging: true,
    animations: true,
    notifications: true,
    emojiStyle: "modern",
    camera: "default",
    microphone: "default",
    theme: "system",
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your MediCall experience and emotion recognition features.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emotion Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Smile className="w-5 h-5 mr-2" />
                Emotion Recognition
              </CardTitle>
              <CardDescription>Configure how emotions are detected and displayed during calls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Emotion Detection</Label>
                  <p className="text-sm text-muted-foreground">Analyze facial expressions in real-time</p>
                </div>
                <Switch
                  checked={settings.emotionDetection}
                  onCheckedChange={(checked) => updateSetting("emotionDetection", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emoji Overlay</Label>
                  <p className="text-sm text-muted-foreground">Show emotion emojis on video tiles</p>
                </div>
                <Switch
                  checked={settings.emojiOverlay}
                  onCheckedChange={(checked) => updateSetting("emojiOverlay", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Face Swap Preview</Label>
                  <p className="text-sm text-muted-foreground">Enable experimental face swap feature</p>
                </div>
                <Switch checked={settings.faceSwap} onCheckedChange={(checked) => updateSetting("faceSwap", checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emotion Logging</Label>
                  <p className="text-sm text-muted-foreground">Save emotion data for meeting analytics</p>
                </div>
                <Switch
                  checked={settings.emotionLogging}
                  onCheckedChange={(checked) => updateSetting("emotionLogging", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Emoji Style</Label>
                <Select value={settings.emojiStyle} onValueChange={(value) => updateSetting("emojiStyle", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern (Default)</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="animated">Animated</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Device Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="w-5 h-5 mr-2" />
                Audio & Video
              </CardTitle>
              <CardDescription>Select your preferred camera and microphone devices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Camera</Label>
                <Select value={settings.camera} onValueChange={(value) => updateSetting("camera", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Camera</SelectItem>
                    <SelectItem value="webcam1">Built-in Camera</SelectItem>
                    <SelectItem value="webcam2">External USB Camera</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Microphone</Label>
                <Select value={settings.microphone} onValueChange={(value) => updateSetting("microphone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    <SelectItem value="mic1">Built-in Microphone</SelectItem>
                    <SelectItem value="mic2">External USB Microphone</SelectItem>
                    <SelectItem value="headset">Bluetooth Headset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => updateSetting("animations", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>Control when and how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Meeting Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about meeting events</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting("notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
