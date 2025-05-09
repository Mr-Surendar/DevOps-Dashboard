"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: "deploy-789",
      environment: "production",
      status: "success",
      version: "v1.2.3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      deployer: {
        name: "Mr.Surendar",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "deploy-788",
      environment: "staging",
      status: "in-progress",
      version: "v1.2.4",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      deployer: {
        name: "Mr.Surendar",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "deploy-787",
      environment: "production",
      status: "rollback",
      version: "v1.2.2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      deployer: {
        name: "Mr.Surendar",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "deploy-786",
      environment: "development",
      status: "failed",
      version: "v1.2.5-dev",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      deployer: {
        name: "Mr.Surendar",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ])

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const data = await getRecentDeployments()
        setDeployments(data)
      } catch (error) {
        console.error("Failed to fetch recent deployments", error)
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
