import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SplineBackground } from "@/components/spline-background"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-background/10 overflow-hidden">
        <SplineBackground />
        <div className="relative z-10 flex">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <DashboardHeader />
            <main className="flex-1 p-1 md:p-3 flex flex-col items-center justify-center mt-64">
              <div className="w-full max-w-6xl mx-auto bg-background/10 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300 mt-48">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
