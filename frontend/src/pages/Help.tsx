"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/Accordion"
import { TailCursor } from "../components/Tail-cursor"
import { FloatingParticles } from "../components/Floating-particle"
import { NotificationProvider, useNotifications } from "../components/Notification-system"
import {
  ArrowLeft,
  Search,
  Video,
  Book,
  MessageSquare,
  Settings,
  Users,
  Camera,
  Phone,
  HelpCircle,
  Play,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Globe,
  Heart,
  Smile,
  Download,
  ExternalLink,
} from "lucide-react"

const faqs = [
  {
    id: "1",
    question: "How do I start a video call?",
    answer:
      "Click the 'New Meeting' button on your dashboard, or use the 'Join Meeting' option to enter an existing meeting ID. You can also start calls directly from the chat interface by clicking the video call button.",
    category: "Getting Started",
  },
  {
    id: "2",
    question: "How does emotion recognition work?",
    answer:
      "Our AI analyzes facial expressions in real-time using advanced computer vision algorithms. The system detects micro-expressions and maps them to emotions with 95% accuracy while maintaining complete privacy. All processing happens locally on your device.",
    category: "Features",
  },
  {
    id: "3",
    question: "Is my data secure and private?",
    answer:
      "Yes! All video calls are encrypted end-to-end, and emotion data is processed locally on your device. We never store or share your personal information or biometric data. Your privacy is our top priority.",
    category: "Security",
  },
  {
    id: "4",
    question: "Can I use face swap during meetings?",
    answer:
      "Enable face swap from the meeting controls to add fun filters and effects. This feature uses AR technology to overlay digital masks while maintaining emotion recognition capabilities.",
    category: "Features",
  },
  {
    id: "5",
    question: "How many people can join a meeting?",
    answer:
      "Free accounts support up to 10 participants, while Pro accounts can host meetings with up to 100 participants. Enterprise plans support even larger meetings with advanced analytics.",
    category: "Plans",
  },
  {
    id: "6",
    question: "What devices are supported?",
    answer:
      "MediCall works on all modern browsers (Chrome, Firefox, Safari, Edge) on Windows, Mac, iOS, and Android. No downloads required - just open your browser and start calling!",
    category: "Technical",
  },
  {
    id: "7",
    question: "How do I troubleshoot camera/microphone issues?",
    answer:
      "Use our built-in Camera Test feature from the dashboard. Make sure to allow camera/microphone permissions in your browser, and check that no other applications are using your devices.",
    category: "Troubleshooting",
  },
  {
    id: "8",
    question: "Can I record meetings?",
    answer:
      "Yes! Pro and Enterprise users can record meetings with full emotion analytics. Recordings include video, audio, chat history, and emotion insights for later review.",
    category: "Features",
  },
  {
    id: "9",
    question: "How accurate is the emotion detection?",
    answer:
      "Our emotion recognition system achieves 95% accuracy using state-of-the-art machine learning models. The system continuously learns and improves while respecting your privacy.",
    category: "Features",
  },
  {
    id: "10",
    question: "What browsers are recommended?",
    answer:
      "We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for the best experience. These browsers provide optimal support for WebRTC and our advanced features.",
    category: "Technical",
  },
]

const tutorials = [
  {
    id: "1",
    title: "Getting Started with MediCall",
    description: "Learn the basics of video calling with emotion recognition",
    duration: "5 min",
    category: "Beginner",
    difficulty: "Easy",
    views: "12.5k",
  },
  {
    id: "2",
    title: "Advanced Emotion Analytics",
    description: "Deep dive into emotion insights and meeting analytics",
    duration: "8 min",
    category: "Advanced",
    difficulty: "Intermediate",
    views: "8.2k",
  },
  {
    id: "3",
    title: "Face Swap and Fun Features",
    description: "How to use face swap and other entertaining features",
    duration: "4 min",
    category: "Features",
    difficulty: "Easy",
    views: "15.1k",
  },
  {
    id: "4",
    title: "Group Meeting Best Practices",
    description: "Tips for hosting effective group meetings",
    duration: "6 min",
    category: "Tips",
    difficulty: "Beginner",
    views: "9.8k",
  },
  {
    id: "5",
    title: "Troubleshooting Common Issues",
    description: "Solve camera, audio, and connection problems",
    duration: "7 min",
    category: "Support",
    difficulty: "Intermediate",
    views: "6.4k",
  },
  {
    id: "6",
    title: "Privacy and Security Settings",
    description: "Configure your privacy and security preferences",
    duration: "5 min",
    category: "Security",
    difficulty: "Beginner",
    views: "11.2k",
  },
]

const quickLinks = [
  {
    icon: <Video className="w-5 h-5" />,
    title: "Start a Meeting",
    description: "Begin a new video call",
    action: "start-meeting",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Join Meeting",
    description: "Enter an existing meeting",
    action: "join-meeting",
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Test Camera",
    description: "Check your camera and mic",
    action: "test-camera",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Settings",
    description: "Configure your preferences",
    action: "settings",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Chat Support",
    description: "Get instant help",
    action: "chat-support",
  },
  {
    icon: <Book className="w-5 h-5" />,
    title: "User Guide",
    description: "Complete documentation",
    action: "user-guide",
  },
]

const categories = ["All", "Getting Started", "Features", "Security", "Technical", "Troubleshooting", "Plans"]

function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [selectedCategory, setSelectedCategory] = useState("All")
 const navigate = useNavigate();
  const { addNotification } = useNotifications()

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "start-meeting":
        addNotification({
          type: "success",
          title: "Starting Meeting",
          message: "Creating a new meeting room...",
        })
        setTimeout(() => navigate("/meeting/new"), 1000)
        break
      case "join-meeting":
        addNotification({
          type: "info",
          title: "Join Meeting",
          message: "Enter meeting ID to join...",
        })
        break
      case "test-camera":
        navigate("/dashboard")
        break
      case "settings":
        addNotification({
          type: "info",
          title: "Settings",
          message: "Opening settings panel...",
        })
        break
      case "chat-support":
        addNotification({
          type: "success",
          title: "Chat Support",
          message: "Connecting you with our support team...",
        })
        break
      case "user-guide":
        addNotification({
          type: "info",
          title: "User Guide",
          message: "Opening comprehensive user guide...",
        })
        break
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen animated-bg color-wave relative">
      <TailCursor />
      <FloatingParticles />

      {/* Header */}
      <header className="glass backdrop-blur-md border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="glass glow ripple">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center glow breathe">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Help Center
                  </h1>
                  <p className="text-xs text-muted-foreground">Get help and learn about MediCall</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
            How can we help you?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to your questions, learn new features, and get the most out of MediCall
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg glass glow"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 animate-slide-in-up">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="glass glow cursor-pointer hover:scale-105 transition-transform ripple breathe"
              onClick={() => handleQuickAction(link.action)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 glow">
                  <div className="text-white">{link.icon}</div>
                </div>
                <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-in-left">
          <TabsList className="grid w-full grid-cols-4 glass glow">
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials">
              <Play className="w-4 h-4 mr-2" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="guides">
              <Book className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="glass glow ripple"
                >
                  {category}
                </Button>
              ))}
            </div>

            <Card className="glass glow breathe">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-6 h-6 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions about MediCall</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 text-muted-foreground">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or category filter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <Card className="glass glow breathe">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-6 h-6 mr-2" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>Step-by-step video guides to help you master MediCall</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="glass hover:glow transition-all cursor-pointer ripple">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
                          <Play className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {tutorial.category}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(tutorial.difficulty)}`}>
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{tutorial.title}</h3>
                          <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{tutorial.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{tutorial.views} views</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>Get up and running with MediCall in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Create Your Account</h4>
                      <p className="text-sm text-muted-foreground">Sign up with Google or email</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Test Your Camera</h4>
                      <p className="text-sm text-muted-foreground">Ensure your camera and mic work properly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Start Your First Call</h4>
                      <p className="text-sm text-muted-foreground">Create a meeting or join an existing one</p>
                    </div>
                  </div>
                  <Button className="w-full glass glow ripple">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Learn how we protect your data and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Local emotion processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">No data storage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">GDPR compliant</span>
                  </div>
                  <Button variant="outline" className="w-full glass glow ripple">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smile className="w-5 h-5 mr-2" />
                    Emotion Features
                  </CardTitle>
                  <CardDescription>Master our AI-powered emotion recognition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Real-time Detection</h4>
                    <p className="text-xs text-muted-foreground">See emotions as they happen during calls</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Emotion Analytics</h4>
                    <p className="text-xs text-muted-foreground">Get insights after your meetings</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Privacy Controls</h4>
                    <p className="text-xs text-muted-foreground">Turn features on/off as needed</p>
                  </div>
                  <Button variant="outline" className="w-full glass glow ripple">
                    <Smile className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    System Requirements
                  </CardTitle>
                  <CardDescription>Ensure optimal performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Supported Browsers</h4>
                    <p className="text-xs text-muted-foreground">Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Internet Speed</h4>
                    <p className="text-xs text-muted-foreground">Minimum 1 Mbps, recommended 5+ Mbps</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Hardware</h4>
                    <p className="text-xs text-muted-foreground">Camera, microphone, modern CPU</p>
                  </div>
                  <Button variant="outline" className="w-full glass glow ripple">
                    <Download className="w-4 h-4 mr-2" />
                    Test Your System
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Live Chat Support
                  </CardTitle>
                  <CardDescription>Get instant help from our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Available now</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our support team is online and ready to help you with any questions or issues.
                  </p>
                  <Button className="w-full glass glow ripple" onClick={() => handleQuickAction("chat-support")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass glow breathe">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>Speak directly with our experts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Monday - Friday: 9 AM - 6 PM PST</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Call us for urgent issues or complex technical problems.
                  </p>
                  <Button variant="outline" className="w-full glass glow ripple">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass glow breathe md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Community & Resources
                  </CardTitle>
                  <CardDescription>Connect with other users and find additional resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold text-sm mb-1">Community Forum</h4>
                      <p className="text-xs text-muted-foreground mb-3">Connect with other MediCall users</p>
                      <Button size="sm" variant="outline" className="glass">
                        Join Forum
                      </Button>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <Book className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold text-sm mb-1">Documentation</h4>
                      <p className="text-xs text-muted-foreground mb-3">Complete technical documentation</p>
                      <Button size="sm" variant="outline" className="glass">
                        View Docs
                      </Button>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold text-sm mb-1">Video Library</h4>
                      <p className="text-xs text-muted-foreground mb-3">Watch detailed tutorials</p>
                      <Button size="sm" variant="outline" className="glass">
                        Watch Videos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function HelpPage() {
  return (
    <NotificationProvider>
      <HelpContent />
    </NotificationProvider>
  )
}
