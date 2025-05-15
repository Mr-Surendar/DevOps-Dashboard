"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Thermometer, RefreshCw, AlertTriangle } from "lucide-react"
import { getSystemMetrics } from "@/services/metrics-service"

type Metric = {
  value: number
  trend: "up" | "down" | "stable"
  history: number[]
}

type SystemMetricsData = {
  cpu: Metric
  memory: Metric
  disk: Metric
  temperature: Metric
}

// Move these functions outside of the SystemMetrics component
const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up":
      return "text-red-500"
    case "down":
      return "text-green-500"
    default:
      return "text-blue-500"
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return "↑"
    case "down":
      return "↓"
    default:
      return "→"
  }
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetricsData>({
    cpu: { value: 0, trend: "stable", history: [] },
    memory: { value: 0, trend: "stable", history: [] },
    disk: { value: 0, trend: "stable", history: [] },
    temperature: { value: 0, trend: "stable", history: [] },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const data = await getSystemMetrics()
        setMetrics(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch system metrics:", error)
        setError("Failed to fetch system metrics. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const getProgressColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading && Object.values(metrics).every((metric) => metric.value === 0)) {
    return (
      <>
        <MetricCardSkeleton title="CPU Usage" icon={<Cpu className="size-5" />} />
        <MetricCardSkeleton title="Memory Usage" icon={<Memory className="size-5" />} />
        <MetricCardSkeleton title="Disk Usage" icon={<HardDrive className="size-5" />} />
        <MetricCardSkeleton title="Temperature" icon={<Thermometer className="size-5" />} />
      </>
    )
  }

  if (error) {
    return (
      <Card className="col-span-4 gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="size-10 text-red-500 mb-2" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => getSystemMetrics()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center"
            >
              <RefreshCw className="mr-2 size-4" /> Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <MetricCard
        title="CPU Usage"
        value={metrics.cpu.value}
        trend={metrics.cpu.trend}
        icon={<Cpu className="size-5" />}
        progressColor={getProgressColor(metrics.cpu.value)}
      />
      <MetricCard
        title="Memory Usage"
        value={metrics.memory.value}
        trend={metrics.memory.trend}
        icon={<Memory className="size-5" />}
        progressColor={getProgressColor(metrics.memory.value)}
      />
      <MetricCard
        title="Disk Usage"
        value={metrics.disk.value}
        trend={metrics.disk.trend}
        icon={<HardDrive className="size-5" />}
        progressColor={getProgressColor(metrics.disk.value)}
      />
      <MetricCard
        title="Temperature"
        value={metrics.temperature.value}
        trend={metrics.temperature.trend}
        icon={<Thermometer className="size-5" />}
        progressColor={getProgressColor(metrics.temperature.value)}
        unit="°C"
      />
    </>
  )
}

function MetricCard({
  title,
  value,
  trend,
  icon,
  progressColor,
  unit = "%",
}: {
  title: string
  value: number
  trend: string
  icon: React.ReactNode
  progressColor: string
  unit?: string
}) {
  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm glow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit}
          <span className={`ml-2 text-sm ${getTrendColor(trend)}`}>{getTrendIcon(trend)}</span>
        </div>
        <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${progressColor}`} style={{ width: `${value}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton({
  title,
  icon,
}: {
  title: string
  icon: React.ReactNode
}) {
  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
        <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  )
}
