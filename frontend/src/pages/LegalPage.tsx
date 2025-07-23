import React, { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { Lock, FileText, Cookie } from "lucide-react"
import { FloatingParticles } from "../components/Floating-particle"
import { Footer } from "../components/Footer"
import { TailCursor } from "../components/Tail-cursor"
import { Navbar } from "../components/Navbar"
import { NotificationProvider } from "../components/Notification-system"

const LegalPage = () => {
  

  const location = useLocation()

  useEffect(() => {
    const id = location.hash.replace("#", "")
    if (id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  return (
    <div>
        <NotificationProvider><Navbar/></NotificationProvider>
        
        <FloatingParticles/>
        <TailCursor/>
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-muted-foreground backdrop-blur-md bg-muted/10 border border-border/30 rounded-2xl shadow-xl space-y-24">

      {/* Privacy Policy */}
      <div  id="privacy" className="scroll-mt-24">
        <div className="flex items-center mb-4 gap-2 text-primary">
          <Lock className="w-5 h-5" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">Effective Date: July 21, 2025</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>We prioritize your privacy and are committed to protecting your personal data.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Data We Collect</h2>
            <ul className="list-disc ml-6">
              <li>Account Info: Email, username</li>
              <li>Media Data: Audio, video (via Mediasoup)</li>
              <li>Facial Data: Face landmarks, emotions</li>
              <li>Cookies: Session and analytics</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
            <ul className="list-disc ml-6">
              <li>Enable secure meetings</li>
              <li>Emotion analysis (not stored)</li>
              <li>Face swap (processed temporarily)</li>
              <li>Enhance UX and security</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">4. Data Sharing</h2>
            <p>We do not sell or share your data. All communication is encrypted.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">5. Your Rights</h2>
            <p>You may request data deletion or access anytime.</p>
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div  id="terms" className="scroll-mt-24">
        <div className="flex items-center mb-4 gap-2 text-primary">
          <FileText className="w-5 h-5" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">Effective Date: July 21, 2025</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance</h2>
            <p>By using MediCall, you agree to these terms.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Services</h2>
            <ul className="list-disc ml-6">
              <li>Real-time meetings (Mediasoup)</li>
              <li>Emotion detection</li>
              <li>Face swapping</li>
              <li>Encrypted chat</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. User Conduct</h2>
            <ul className="list-disc ml-6">
              <li>Use the app lawfully and respectfully</li>
              <li>Do not misuse AI features</li>
              <li>No harmful content in chat or video</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">4. Disclaimer</h2>
            <p>AI features are for informational/entertainment use only.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
            <p>We are not liable for indirect or consequential damages.</p>
          </div>
        </div>
      </div>

      {/* Cookie Policy */}
      <div  id="cookies" className="scroll-mt-24">
        <div className="flex items-center mb-4 gap-2 text-primary">
          <Cookie className="w-5 h-5" />
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">Effective Date: July 21, 2025</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. What Are Cookies?</h2>
            <p>Cookies are small text files used to store session and preference data.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. How We Use Cookies</h2>
            <ul className="list-disc ml-6">
              <li>Maintain login sessions</li>
              <li>Store chat/video preferences</li>
              <li>Enable basic analytics</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. Your Choices</h2>
            <p>You can manage cookies through your browser settings. Disabling them may affect your experience.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

export default LegalPage
