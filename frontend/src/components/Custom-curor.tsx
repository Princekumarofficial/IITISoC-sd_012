"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setPosition(newPos)

      // Add trail effect
      setTrail((prev) => {
        const newTrail = [...prev, { ...newPos, id: Date.now() }]
        return newTrail.slice(-8) // Keep only last 8 trail points
      })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.matches('button, a, input, [role="button"], .cursor-pointer, .ripple')
      setIsHovering(isInteractive)
    }

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleMouseOver)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.filter((point) => Date.now() - point.id < 500))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Trail effect */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9998] rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            width: "8px",
            height: "8px",
            background: `rgba(139, 92, 246, ${0.1 + (index / trail.length) * 0.3})`,
            transform: `scale(${0.3 + (index / trail.length) * 0.7})`,
            transition: "all 0.1s ease-out",
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-75 ease-out ${
          isClicking ? "scale-75" : isHovering ? "scale-150" : "scale-100"
        }`}
        style={{
          left: position.x - 12,
          top: position.y - 12,
          width: "24px",
          height: "24px",
          background: isClicking
            ? "radial-gradient(circle, #ef4444 0%, #f59e0b 50%, #8b5cf6 100%)"
            : isHovering
              ? "radial-gradient(circle, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)"
              : "radial-gradient(circle, #8b5cf6 0%, #06b6d4 50%, #f59e0b 100%)",
          boxShadow: isClicking
            ? "0 0 30px rgba(239, 68, 68, 0.8), 0 0 50px rgba(245, 158, 11, 0.6)"
            : isHovering
              ? "0 0 25px rgba(16, 185, 129, 0.7), 0 0 45px rgba(6, 182, 212, 0.5)"
              : "0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)",
        }}
      />
    </>
  )
}
