"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: "build-123",
      name: "main-build",
      status: "success",
      branch: "main",
      duration: "2m 34s",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "deploy-45",
      name: "production-deploy",
      status: "running",
      branch: "main",
      duration: "1m 12s",
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    },
    {
      id: "test-67",
      name: "integration-tests",
      status: "failed",
      branch: "feature/auth",
      duration: "3m 45s",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "build-124",
      name: "feature-build",
      status: "pending",
      branch: "feature/dashboard",
      duration: "0s",
      timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    },
  ])

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const data = await getPipelineStatus()
        setPipelines(data)
      } catch (error) {
        console.error("Failed to fetch pipeline status", error)
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
