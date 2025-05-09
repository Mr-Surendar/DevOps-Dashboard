"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/services/auth-service"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState({ name: "Admin User", email: "admin@example.com" })
  const [notifications, setNotifications] = useState(3)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user data", error)
      }
    }

    fetchUser()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Add scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <header
      className={`fixed top-0 left-[var(--sidebar-width)] right-0 z-40 flex h-16 items-center justify-between border-b border-border/40 
bg-background/50 px-4 backdrop-blur-md transition-all duration-300 ${scrolled ? "shadow-md" : ""} 
peer-data-[state=collapsed]:left-[var(--sidebar-width-icon)]`}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              {notifications > 0 && (
                <Badge className="absolute -right-1 -top-1 size-5 flex items-center justify-center p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Jenkins Pipeline Failed</p>
                  <p className="text-sm text-muted-foreground">main-build-123 failed on step: test</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">New GitHub Pull Request</p>
                  <p className="text-sm text-muted-foreground">PR #42: Fix authentication bug</p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Kubernetes Pod Crashed</p>
                  <p className="text-sm text-muted-foreground">api-service-pod-3 crashed with OOMKilled</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
