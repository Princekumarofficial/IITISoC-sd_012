"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/Dialog"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Labels"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Checkbox } from "../components/ui/Checkbox"
import { ScrollArea } from "../components/ui/Scroll-area"
import { Users, Camera, Search } from "lucide-react"

interface Contact {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

interface GroupCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated: (group: any) => void
}

const mockContacts: Contact[] = [
  { id: "1", name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
  { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
  { id: "3", name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
  { id: "4", name: "Diana Prince", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
  { id: "5", name: "Eve Wilson", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
  { id: "6", name: "Frank Miller", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
]

export function GroupCreationModal({ open, onOpenChange, onGroupCreated }: GroupCreationModalProps) {
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedContacts.length === 0) return

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      participants: selectedContacts,
      isGroup: true,
      type: "group" as const,
      lastMessage: "Group created",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
    }

    onGroupCreated(newGroup)
    onOpenChange(false)

    // Reset form
    setGroupName("")
    setGroupDescription("")
    setSelectedContacts([])
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Create Group Chat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="What's this group about?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Add Members</Label>
              <span className="text-sm text-muted-foreground">{selectedContacts.length} selected</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-48 border rounded-lg p-2">
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleContactToggle(contact.id)}
                  >
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleContactToggle(contact.id)}
                    />
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={contact.avatar || "/profile.jpg"} />
                        <AvatarFallback>
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.isOnline ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={!groupName.trim() || selectedContacts.length === 0}>
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
