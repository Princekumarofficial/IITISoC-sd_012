"use client"

import { useEffect, useState } from "react"

export function FloatingParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      left: number
      delay: number
      size: number
      duration: number
      color: string
    }>
  >([])

  useEffect(() => {
    const colors = [
      "linear-gradient(45deg, #667eea, #764ba2)",
      "linear-gradient(45deg, #f093fb, #f5576c)",
      "linear-gradient(45deg, #4facfe, #00f2fe)",
      "linear-gradient(45deg, #43e97b, #38f9d7)",
      "linear-gradient(45deg, #fa709a, #fee140)",
      "linear-gradient(45deg, #a8edea, #fed6e3)",
    ]

    const newParticles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 8 + 3,
      duration: Math.random() * 6 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle breathe"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(102, 126, 234, 0.4)`,
            filter: `blur(${particle.size * 0.1}px)`,
          }}
        />
      ))}
    </div>
  )
}
