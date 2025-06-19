import type React from "react"

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

export function Avatar({ className = "", children }: AvatarProps) {
  return (
    <span className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</span>
  )
}

export function AvatarImage({ src, alt, className = "" }: { src?: string; alt?: string; className?: string }) {
  if (!src) return null

  return (
    <img className={`aspect-square h-full w-full ${className}`} src={src || "/profile.jpg"} alt={alt || "Avatar"} />
  )
}

export function AvatarFallback({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
      {children}
    </span>
  )
}
