"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GitBranch, Box, Server, Cloud, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { getToolsStatus } from "@/services/devops-service";

type ToolStatus = {
  status: "healthy" | "warning" | "error"
  message: string
  lastUpdated: string
  metrics: {
    [key: string]: number | string
  }
}

type DevOpsToolsData = {
  jenkins: ToolStatus
  github: ToolStatus
  docker: ToolStatus
  kubernetes: ToolStatus
  terraform: ToolStatus
}

export function DevOpsTools() {
  const [toolsData, setToolsData] = useState<DevOpsToolsData>({
    jenkins: {
      status: "healthy",
      message: "All pipelines running normally",
      lastUpdated: new Date().toISOString(),
      metrics: {
        pipelines: 12,
        running: 2,
        success: 8,
        failed: 2,
      },
    },
    github: {
      status: "healthy",
      message: "All repositories accessible",
      lastUpdated: new Date().toISOString(),
      metrics: {
        repositories: 8,
        pullRequests: 5,
        issues: 12,
        contributors: 7,
      },
    },
    docker: {
      status: "warning",
      message: "High resource usage detected",
      lastUpdated: new Date().toISOString(),
      metrics: {
        containers: 24,
        running: 18,
        stopped: 4,
        images: 32,
      },
    },
    kubernetes: {
      status: "error",
      message: "Pod crash loop detected in production namespace",
      lastUpdated: new Date().toISOString(),
      metrics: {
        nodes: 5,
        pods: 48,
        services: 12,
        deployments: 15,
      },
    },
    terraform: {
      status: "healthy",
      message: "Infrastructure up to date",
      lastUpdated: new Date().toISOString(),
      metrics: {
        resources: 120,
        modules: 8,
        providers: 5,
        workspaces: 3,
      },
    },
  })

  useEffect(() => {
    const fetchToolsStatus = async () => {
      try {
        const data = await getToolsStatus()
        setToolsData(data)
      } catch (error) {
        console.error("Failed to fetch tools status", error)
      }
    }

    fetchToolsStatus()
    const interval = setInterval(fetchToolsStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="size-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="size-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="size-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>DevOps Tools Status</CardTitle>
        <CardDescription>Real-time status of integrated DevOps tools</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jenkins">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jenkins" className="flex items-center gap-2">
              <Activity className="size-4" />
              <span className="hidden md:inline">Jenkins</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <GitBranch className="size-4" />
              <span className="hidden md:inline">GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="docker" className="flex items-center gap-2">
              <Box className="size-4" />
              <span className="hidden md:inline">Docker</span>
            </TabsTrigger>
            <TabsTrigger value="kubernetes" className="flex items-center gap-2">
              <Server className="size-4" />
              <span className="hidden md:inline">Kubernetes</span>
            </TabsTrigger>
            <TabsTrigger value="terraform" className="flex items-center gap-2">
              <Cloud className="size-4" />
              <span className="hidden md:inline">Terraform</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(toolsData).map(([tool, data]) => (
            <TabsContent key={tool} value={tool}>
              <Alert className={getStatusColor(data.status)}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.status)}
                  <AlertTitle className="text-lg">{tool.charAt(0).toUpperCase() + tool.slice(1)}</AlertTitle>
                </div>
                <AlertDescription className="mt-2">{data.message}</AlertDescription>
              </Alert>

              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(data.metrics).map(([metric, value]) => (
                  <div key={metric} className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
