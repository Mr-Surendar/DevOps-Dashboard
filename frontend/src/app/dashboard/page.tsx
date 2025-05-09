import { Suspense } from "react"
import { SystemMetrics } from "@/components/system-metrics"
import { DevOpsTools } from "@/components/devops-tools"
import { RecentDeployments } from "@/components/recent-deployments"
import { PipelineStatus } from "@/components/pipeline-status"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SystemMetrics />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PipelineStatus />
          <RecentDeployments />
        </div>
        <DevOpsTools />
      </Suspense>
    </div>
  )
}
