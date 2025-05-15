"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { getRecentDeployments } from "@/services/deployment-service"

type Deployment = {
  id: string
  environment: "production" | "staging" | "development"
  status: "success" | "failed" | "in-progress" | "rollback"
  version: string
  timestamp: string
  deployer: {
    name: string
    avatar: string
  }
}

export function RecentDeployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true)
        const data = await getRecentDeployments()
        setDeployments(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch recent deployments", error)
        setError("Failed to fetch deployment data. Please check your deployment service connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchDeployments()
    const interval = setInterval(fetchDeployments, 60000)
    return () => clearInterval(interval)
  }, [])

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case "production":
        return <Badge className="bg-purple-500">Production</Badge>
      case "staging":
        return <Badge className="bg-blue-500">Staging</Badge>
      case "development":
        return <Badge className="bg-green-500">Development</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "rollback":
        return <Badge className="bg-yellow-500">Rollback</Badge>
      default:
        return null
    }
  }

  if (loading && deployments.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>Loading deployment data...</CardDescription>
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
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>Error loading deployment data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-red-500" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => getRecentDeployments()}>
              <RefreshCw className="mr-2 size-4" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (deployments.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>No deployment data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">
              No deployment data available. Please configure your deployment service.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => getRecentDeployments()}>
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
        <CardTitle>Recent Deployments</CardTitle>
        <CardDescription>Latest deployments across environments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={deployment.deployer.avatar || "/placeholder.svg"} alt={deployment.deployer.name} />
                  <AvatarFallback>{deployment.deployer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{deployment.version}</span>
                    {getEnvironmentBadge(deployment.environment)}
                    {getStatusBadge(deployment.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">By {deployment.deployer.name}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(deployment.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
