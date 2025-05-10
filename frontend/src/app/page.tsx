"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { SplineBackground } from "@/components/spline-background"

export default function LandingPage() {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !showLogin) {
        event.preventDefault()
        setFadeOut(true)

        // Wait for fade out animation to complete
        setTimeout(() => {
          setShowLogin(true)
        }, 800)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showLogin, router])

  useEffect(() => {
    if (showLogin) {
      // Navigate to login page after transition
      setTimeout(() => {
        router.push("/login")
      }, 500)
    }
  }, [showLogin, router])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <SplineBackground />

      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-800 ease-in-out ${
          fadeOut ? "opacity-0 transform translate-y-[-100vh]" : "opacity-100"
        }`}
      >
        <h1 className="text-5xl font-bold tracking-tight mb-8 text-white drop-shadow-lg">Hello Developer</h1>

        <div className="flex flex-col items-center mt-8 animate-bounce">
          <p className="text-white/80 mb-2">Press SPACE to continue</p>
          <ChevronDown className="h-8 w-8 text-white/80" />
          <p className="text-white/80 mt-2 font-semibold">Login</p>
        </div>
      </div>
    </div>
  )
}
