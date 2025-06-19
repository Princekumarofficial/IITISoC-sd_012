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
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/api" },
      { label: "Integrations", href: "/integrations" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Status", href: "/status" },
      { label: "Community", href: "/community" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
    ],
  }

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/medicall", label: "Twitter" },
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/medicall", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/medicall", label: "LinkedIn" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@medicall.com", label: "Email" },
  ]

  const features = [
    { icon: <Zap className="w-4 h-4" />, text: "Real-time Emotions" },
    { icon: <Shield className="w-4 h-4" />, text: "End-to-End Encrypted" },
    { icon: <Globe className="w-4 h-4" />, text: "Global Availability" },
  ]

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t glass">
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

            {/* Social Links */}
            <div className="flex items-center space-x-2">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="glass glow ripple hover:scale-110 transition-transform"
                  onClick={() => window.open(social.href, "_blank")}
                  title={social.label}
                >
                  {social.icon}
                </Button>
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
        <div className="bg-muted/30 rounded-lg p-6 mb-8 glass">
          <h4 className="font-semibold mb-4 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Get in Touch
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>hello@medicall.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {currentYear} MediCall. All rights reserved.</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in San Francisco</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>🌟 Trusted by 1M+ users worldwide</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
