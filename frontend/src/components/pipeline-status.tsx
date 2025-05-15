"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { getPipelineStatus } from "@/services/jenkins-service"

type Pipeline = {
  id: string
  name: string
  status: "success" | "running" | "failed" | "pending"
  branch: string
  duration: string
  timestamp: string
}

export function PipelineStatus() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        setLoading(true)
        const data = await getPipelineStatus()
        setPipelines(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch pipeline status", error)
        setError("Failed to fetch pipeline status. Please check your Jenkins connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchPipelines()
    const interval = setInterval(fetchPipelines, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>
      case "running":
        return <Badge className="bg-blue-500">Running</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return null
    }
  }

  if (loading && pipelines.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
          <CardDescription>Loading pipeline data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
          <CardDescription>Error loading pipeline data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-red-500" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => getPipelineStatus()}>
              <RefreshCw className="mr-2 size-4" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (pipelines.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
          <CardDescription>No pipeline data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">
              No pipeline data available. Please configure your Jenkins integration.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => getPipelineStatus()}>
              <RefreshCw className="mr-2 size-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Pipeline Status</CardTitle>
        <CardDescription>Recent CI/CD pipeline runs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelines.map((pipeline) => (
            <div key={pipeline.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pipeline.name}</span>
                  {getStatusBadge(pipeline.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Branch: {pipeline.branch} | Duration: {pipeline.duration}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(pipeline.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
