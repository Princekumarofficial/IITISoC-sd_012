"use client"

import { useEffect, useState } from "react"

interface TailPoint {
  x: number
  y: number
  id: number
  timestamp: number
}

export function TailCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [tailPoints, setTailPoints] = useState<TailPoint[]>([])

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setPosition(newPos)

      const newPoint: TailPoint = {
        x: newPos.x,
        y: newPos.y,
        id: Date.now() + Math.random(), // ensure uniqueness
        timestamp: Date.now(),
      }

      setTailPoints((prev) => {
        const newTail = [...prev, newPoint]
        return newTail.slice(-25)
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setTailPoints((prev) => prev.filter((point) => now - point.timestamp < 800))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Tail Trail */}
      {tailPoints.map((point, index) => {
        const age = Date.now() - point.timestamp
        const opacity = Math.max(0, 1 - age / 800)
        const scale = 0.2 + (index / tailPoints.length) * 0.8
        const size = 3 + (index / tailPoints.length) * 8

        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: `${size}px`,
              height: `${size}px`,
              background: isClicking
                ? `radial-gradient(circle, rgba(239, 68, 68, ${opacity}) 0%, rgba(245, 158, 11, ${opacity * 0.8}) 40%, rgba(139, 92, 246, ${opacity * 0.6}) 100%)`
                : isHovering
                  ? `radial-gradient(circle, rgba(16, 185, 129, ${opacity}) 0%, rgba(6, 182, 212, ${opacity * 0.8}) 40%, rgba(139, 92, 246, ${opacity * 0.6}) 100%)`
                  : `radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, rgba(6, 182, 212, ${opacity * 0.8}) 40%, rgba(245, 158, 11, ${opacity * 0.6}) 100%)`,
              transform: `scale(${scale})`,
              boxShadow: `0 0 ${size * 2}px rgba(139, 92, 246, ${opacity * 0.15})`,
              filter: `blur(0.5px)`,
              transition: "all 0.2s ease-out",
            }}
          />
        )
      })}

      {/* Main Cursor Dot */}
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isClicking ? "scale-75" : isHovering ? "scale-125" : "scale-100"
        }`}
        style={{
          left: position.x - 8,
          top: position.y - 8,
          width: "16px",
          height: "16px",
          background: isClicking
            ? "radial-gradient(circle, #ef4444 0%, #f59e0b 100%)"
            : isHovering
              ? "radial-gradient(circle, #10b981 0%, #06b6d4 100%)"
              : "radial-gradient(circle, #8b5cf6 0%, #06b6d4 100%)",
          boxShadow: isClicking
            ? "0 0 30px rgba(239, 68, 68, 0.6), 0 0 40px rgba(245, 158, 11, 0.4)"
            : isHovering
              ? "0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(6, 182, 212, 0.3)"
              : "0 0 16px rgba(139, 92, 246, 0.4), 0 0 26px rgba(6, 182, 212, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      />

      {/* Ripple on Click */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9997] rounded-full animate-ping"
          style={{
            left: position.x - 25,
            top: position.y - 25,
            width: "50px",
            height: "50px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            border: "2px solid rgba(139, 92, 246, 0.5)",
            animation: "ping 0.8s cubic-bezier(0, 0, 0.2, 1)",
          }}
        />
      )}
    </>
  )
}
