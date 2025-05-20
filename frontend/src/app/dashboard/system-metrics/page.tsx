import { SystemMetrics } from "@/components/system-metrics"

export default function SystemMetricsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Metrics</h1>
      <p className="text-muted-foreground">
        Monitor system performance metrics including CPU, memory, disk usage, and temperature.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SystemMetrics />
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operating System:</span>
              <span className="font-medium">Linux</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kernel Version:</span>
              <span className="font-medium">5.15.0-1041-azure</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">x86_64</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hostname:</span>
              <span className="font-medium">devops-server</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">14 days, 3 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Boot:</span>
              <span className="font-medium">2023-05-01 08:23:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
