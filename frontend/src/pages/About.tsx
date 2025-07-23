import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Video,
  Heart,
  Zap,
  Users,
  Brain,
  Shield,
  Globe,
  Award,
  ArrowLeft,
  Github,
  Twitter,
  Linkedin,
  Mail,
  AlignCenter,
} from "lucide-react"

import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"

import { TailCursor } from "../components/Tail-cursor"

import { NotificationProvider } from "../components/Notification-system"

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Emotion Recognition",
    description: "Advanced machine learning algorithms analyze facial expressions in real-time to detect emotions with 95% accuracy.",
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "HD Video Calling",
    description: "Crystal clear video calls with up to 4K resolution and adaptive bitrate streaming for optimal quality.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Face Swap Technology",
    description: "Fun and engaging face swap filters powered by advanced computer vision and AR technology.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Group Meetings",
    description: "Host meetings with up to 100 participants with real-time emotion analytics for everyone.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "End-to-End Encryption",
    description: "Your conversations are protected with military-grade encryption ensuring complete privacy.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Accessibility",
    description: "Available worldwide with multi-language support and optimized for all devices and platforms.",
  },
]

const team = [
  {
    name: "Mr. Abhay Lodhi",
    role: "Full stack developer",
    avatar: "/profile.jpg",
    bio: "2nd year CSE student at IIT Indore",
  },
  {
    name: "Mr. Pratyush Gupta",
    role: "Ml Engineer and Backend Develper",
    avatar: "/profile.jpg",
    bio: "2nd year MEMS student at IIT Indore",
  },
  {
    name: "Mr. Hemant Yadav",
    role: "Full Stack developer",
    avatar: "/profile.jpg",
    bio: "2nd year MEMS student at IIT Indore",
  },
  
]
const teamContacts = {
  mail: [
    { name: "Mr. Abhay Lodhi", value: "abhaylodhi128135@gmail.com" },
    { name: "Mr. Pratyush Gupta", value: "pratyush1534@gmail.com" },
    { name: "Mr. Hemant Yadav", value: "412006hemantyadav@gmail.com" },
  ],
  twitter: [
    { name: "Mr. Abhay Lodhi", value: "@AbhayLodhi014" },
    { name: "Mr. Pratyush Gupta", value: "@Pratyush_131" },
    { name: "Mr. Hemant Yadav", value: "@_hemant2435" },
  ],
  linkedin: [
    { name: "Mr. Abhay Lodhi", value: "linkedin.com/in/abhay-lodhi-a5a21231a" },
    { name: "Mr. Pratyush Gupta", value: "linkedin.com/in/pratyush-gupta-ba4102331" },
    { name: "Mr. Hemant Yadav", value: "linkedin.com/in/hemant-yadav-a86497327" },
  ],
  github: [
    { name: "Mr. Abhay Lodhi", value: "github.com/abhaylodhi014" },
    { name: "Mr. Pratyush Gupta", value: "github.com/PratyushG434" },
    { name: "Mr. Hemant Yadav", value: "github.com/hemant4106" },
  ],
}



function AboutContent() {
  const navigate = useNavigate();
  const [activeContact, setActiveContact] = useState("mail");
 const location = useLocation()

useEffect(() => {
  setTimeout(() => {
    const id = window.location.hash.replace("#", "")
    if (id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, 100)
}, [])


 useEffect(() => {
  const id = location.hash.replace("#", "")
  if (id) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      const offset = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2)
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      })
    }
  }
}, [location])


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-blue-600/5 relative">
      <TailCursor />


      {/* Header */}
      <section id="top">
      <header className="glass border-b backdrop-blur-sm sticky top-0 z-40">
        <div  className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="glass glow ripple">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center glow">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    MediCall
                  </h1>
                  <p className="text-xs text-muted-foreground">About Us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      </section>

      {/* Body Sections */}
      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Revolutionizing Video Communication
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              MediCall combines cutting-edge AI technology with seamless video calling to create the most emotionally intelligent communication platform ever built.
            </p>
          </div>
          
        </section>

        {/* Mission */}
        <section className="space-y-8 animate-slide-in-left">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To bridge the emotional gap in digital communication by making every video call more human, engaging, and meaningful.
            </p>
          </div>
          <Card className="glass glow max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <Heart className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-xl font-semibold">Emotional Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Understanding and responding to human emotions in real-time</p>
                </div>
                <div className="text-center space-y-3">
                  <Users className="w-12 h-12 text-blue-500 mx-auto" />
                  <h3 className="text-xl font-semibold">Human Connection</h3>
                  <p className="text-sm text-muted-foreground">Bringing people closer together through technology</p>
                </div>
                <div className="text-center space-y-3">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto" />
                  <h3 className="text-xl font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Pushing the boundaries of what's possible in video communication</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section id="features"  className="space-y-8 animate-slide-in-right">
          <div  className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Discover what makes MediCall the future of video communication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass glow hover:scale-105 transition-transform animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
     <section id="contact" className="space-y-8 animate-slide-in-left">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Get In Touch</h2>
        <p className="text-lg text-muted-foreground">
          Have questions or want to learn more? We'd love to hear from you!
        </p>
      </div>
      <Card className="glass glow max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="glass glow ripple h-16 flex-col"
              onClick={() => setActiveContact("mail")}
            >
              <Mail className="w-6 h-6 mb-2" />
              <span className="text-xs">Mail</span>
            </Button>
            <Button
              variant="outline"
              className="glass glow ripple h-16 flex-col"
              onClick={() => setActiveContact("twitter")}
            >
              <Twitter className="w-6 h-6 mb-2" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="glass glow ripple h-16 flex-col"
              onClick={() => setActiveContact("linkedin")}
            >
              <Linkedin className="w-6 h-6 mb-2" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              className="glass glow ripple h-16 flex-col"
              onClick={() => setActiveContact("github")}
            >
              <Github className="w-6 h-6 mb-2" />
              <span className="text-xs">GitHub</span>
            </Button>
          </div>

          <div className="mt-8 text-center space-y-2">
            {["mail", "twitter", "linkedin", "github"].includes(activeContact) &&
              teamContacts[activeContact].map((m, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  <strong>{m.name}:</strong>{" "}
                  <a
                    href={
                      activeContact === "mail"
                        ? `mailto:${m.value}`
                        : activeContact === "github"
                        ? `https://${m.value}`
                        : activeContact === "linkedin"
                        ? `https://${m.value}`
                        : `https://twitter.com/${m.value.replace("@", "")}`
                    }
                    className="underline hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.value}
                  </a>
                </p>
              ))}

            {activeContact === "default" && (
              <>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> hello@medicall.com
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <NotificationProvider>
      <AboutContent />
    </NotificationProvider>
  )
}
