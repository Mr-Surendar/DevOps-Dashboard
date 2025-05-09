"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Thermometer } from "lucide-react"
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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getSystemMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch system metrics", error)
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
