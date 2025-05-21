"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, GitBranch, Box, Server, Cloud, Settings, LogOut, Activity, Cpu, Code } from "lucide-react"
import { logoutUser } from "@/services/auth-service"
import { useEffect, useState } from "react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Track sidebar state changes
  useEffect(() => {
    setIsCollapsed(state === "collapsed")
  }, [state])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Jenkins",
      icon: Activity,
      path: "/dashboard/jenkins",
    },
    {
      title: "GitHub",
      icon: GitBranch,
      path: "/dashboard/github",
    },
    {
      title: "Docker",
      icon: Box,
      path: "/dashboard/docker",
    },
    {
      title: "Kubernetes",
      icon: Server,
      path: "/dashboard/kubernetes",
    },
    {
      title: "Terraform",
      icon: Cloud,
      path: "/dashboard/terraform",
    },
    {
      title: "SonarQube",
      icon: Code,
      path: "/dashboard/sonarqube",
    },
    {
      title: "System Metrics",
      icon: Cpu,
      path: "/dashboard/metrics",
    },
  ]

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="bg-opacity-30 backdrop-blur-sm border-none p-0 shadow-lg rounded-r-xl transition-all duration-300 peer fixed h-screen"
    >
      <SidebarHeader className="flex items-center justify-between p-2 bg-transparent">
        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
          <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Cpu className="size-4 text-white" />
          </div>
          <span
            className={`font-bold text-lg glow-text transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute" : "opacity-100"}`}
          >
            DevOps
          </span>
        </div>
        <SidebarTrigger className="absolute right-2 top-4"/>
      </SidebarHeader>
      <SidebarContent className="bg-transparent p-0">
        <SidebarMenu className="gap-0">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(item.path)}>
                  <item.icon className="mr-2 size-4" />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-transparent p-0">
        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
