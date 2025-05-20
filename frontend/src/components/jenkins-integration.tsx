"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getJenkinsData, triggerJenkinsBuild } from "@/services/jenkins-service"

type JenkinsPipeline = {
  id: string
  name: string
  status: "success" | "running" | "failed" | "pending" | "aborted"
  branch: string
  duration: string
  timestamp: string
  stages: {
    name: string
    status: "success" | "running" | "failed" | "pending" | "aborted"
    duration: string
  }[]
}

export function JenkinsIntegration() {
  const [pipelines, setPipelines] = useState<JenkinsPipeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJenkinsData = async () => {
      try {
        setLoading(true)
        const data = await getJenkinsData()
        setPipelines(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch Jenkins data", error)
        setError("Failed to connect to Jenkins. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchJenkinsData()
    const interval = setInterval(fetchJenkinsData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleTriggerBuild = async (pipelineId: string) => {
    try {
      await triggerJenkinsBuild(pipelineId)
      // Refresh data after triggering build
      const data = await getJenkinsData()
      setPipelines(data)
    } catch (error) {
      console.error("Failed to trigger Jenkins build", error)
      setError("Failed to trigger build. Please check your permissions.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="size-5 text-green-500" />
      case "running":
        return <RefreshCw className="size-5 text-blue-500 animate-spin" />
      case "failed":
        return <AlertTriangle className="size-5 text-red-500" />
      case "pending":
        return <Clock className="size-5 text-yellow-500" />
      case "aborted":
        return <Pause className="size-5 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 border-green-500/30"
      case "running":
        return "bg-blue-500/20 border-blue-500/30"
      case "failed":
        return "bg-red-500/20 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/30"
      case "aborted":
        return "bg-gray-500/20 border-gray-500/30"
      default:
        return "bg-gray-500/20 border-gray-500/30"
    }
  }

  if (loading && pipelines.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Jenkins Integration</CardTitle>
          <CardDescription>Loading Jenkins data...</CardDescription>
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
          <CardTitle>Jenkins Integration</CardTitle>
          <CardDescription>Error connecting to Jenkins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 size-4" /> Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No pipelines data available
  if (!loading && pipelines.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Jenkins Integration</CardTitle>
          <CardDescription>Configure Jenkins Integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground mb-4">
              No Jenkins pipelines available. Please configure your Jenkins integration in the server environment.
            </p>
            <div className="text-left mb-4 p-4 bg-muted rounded-md">
              <p className="font-mono text-sm mb-2">Required environment variables:</p>
              <ul className="list-disc pl-5 font-mono text-xs space-y-1">
                <li>JENKINS_URL</li>
                <li>JENKINS_USERNAME</li>
                <li>JENKINS_API_TOKEN</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 size-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Jenkins Integration</CardTitle>
          <CardDescription>CI/CD pipeline management</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => getJenkinsData()}>
          <RefreshCw className="mr-2 size-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pipelines">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
          </TabsList>

          <TabsContent value="pipelines" className="space-y-4">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className={`rounded-lg border p-4 ${getStatusColor(pipeline.status)}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(pipeline.status)}
                    <h3 className="text-lg font-semibold">{pipeline.name}</h3>
                    <Badge variant="outline">{pipeline.branch}</Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleTriggerBuild(pipeline.id)}
                    disabled={pipeline.status === "running"}
                  >
                    <Play className="mr-1 size-3" /> Run
                  </Button>
                </div>

                <div className="mb-4 space-y-3">
                  {pipeline.stages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`size-3 rounded-full ${
                          stage.status === "success"
                            ? "bg-green-500"
                            : stage.status === "running"
                              ? "bg-blue-500"
                              : stage.status === "failed"
                                ? "bg-red-500"
                                : stage.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                        }`}
                      />
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-xs text-muted-foreground">{stage.duration}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Duration: {pipeline.duration}</span>
                  <span>Started: {new Date(pipeline.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="jobs">
            <div className="rounded-lg border p-6 text-center">
              <p className="text-muted-foreground">Job management coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="nodes">
            <div className="rounded-lg border p-6 text-center">
              <p className="text-muted-foreground">Node management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
