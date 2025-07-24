"use client"

import { Button } from "../components/ui/Button"
import { Separator } from "../components/ui/Separator"
import {
  Video,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  Globe,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: "Features", href: "/about#features" },
       { label: "About Us", href: "/about#top" },
      //  { label: "Contact", href: "/about#contact" },
       {label : "CountactUs" , href: "/contactus"}
    ],
    
    legal: [
      { label: "Privacy Policy", href: "/legal#privacy" },
      { label: "Terms of Service", href: "/legal#terms" },
      { label: "Cookie Policy", href: "/legal#cookies" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
     
    
    ],
  }

  

  const features = [
    { icon: <Zap className="w-4 h-4" />, text: "Real-time Emotions" },
    { icon: <Shield className="w-4 h-4" />, text: "End-to-End Encrypted" }
  ]

  return (
    
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t glass">
       <Separator className="mb-6" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center glow">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  MediCall
                </h3>
                <p className="text-xs text-muted-foreground">Emotion-Powered Video Calls</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-sm">
              Revolutionizing video communication with AI-powered emotion recognition, making every call more human and engaging.
            </p>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="text-primary">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

          
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([section, links], idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-semibold text-sm capitalize">{section}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-sm text-muted-foreground hover:text-primary justify-start"
                      onClick={() => navigate(link.href)}
                    >
                      {link.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div onClick={()=>(navigate("/about#contact"))} className="bg-muted/30 rounded-lg p-6 mb-8 glass">
          <h4 className="font-semibold mb-4 bg-[#925ef0] w-fit p-2 rounded-md flex items-center">
            <Phone  className="w-4 h-4 mr-2" />
            Get in Touch
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Indore, India</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        
      </div>
    </footer>
  )
}
