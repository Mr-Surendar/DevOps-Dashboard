"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Play, AlertTriangle, CheckCircle, Cloud, Clock } from "lucide-react"
import { getTerraformData, applyTerraform } from "@/services/terraform-service"

type TerraformResource = {
  id: string
  name: string
  type: string
  provider: string
  status: "created" | "updated" | "destroyed" | "planned"
  lastModified: string
}

type TerraformModule = {
  name: string
  source: string
  version: string
  resources: number
}

type TerraformWorkspace = {
  name: string
  status: "applied" | "planning" | "error" | "pending"
  lastRun: string
  resources: number
  changes: number
}

export function TerraformIntegration() {
  const [resources, setResources] = useState<TerraformResource[]>([])
  const [modules, setModules] = useState<TerraformModule[]>([])
  const [workspaces, setWorkspaces] = useState<TerraformWorkspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTerraformData = async () => {
      try {
        setLoading(true)
        const data = await getTerraformData()
        setResources(data.resources || [])
        setModules(data.modules || [])
        setWorkspaces(data.workspaces || [])
        setError(null)
      } catch (error) {
        console.error("Failed to fetch Terraform data", error)
        setError("Failed to connect to Terraform. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchTerraformData()
    const interval = setInterval(fetchTerraformData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleApplyTerraform = async (workspace: string) => {
    try {
      await applyTerraform(workspace)
      // Refresh data after applying
      const data = await getTerraformData()
      setWorkspaces(data.workspaces || [])
    } catch (error) {
      console.error("Failed to apply Terraform changes", error)
      setError("Failed to apply changes. Please check your permissions.")
    }
  }

  const getResourceStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return <Badge className="bg-green-500">Created</Badge>
      case "updated":
        return <Badge className="bg-blue-500">Updated</Badge>
      case "destroyed":
        return <Badge className="bg-red-500">Destroyed</Badge>
      case "planned":
        return <Badge className="bg-yellow-500">Planned</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getWorkspaceStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-green-500">Applied</Badge>
      case "planning":
        return <Badge className="bg-blue-500">Planning</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getWorkspaceStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <CheckCircle className="size-5 text-green-500" />
      case "planning":
        return <Clock className="size-5 text-blue-500" />
      case "error":
        return <AlertTriangle className="size-5 text-red-500" />
      case "pending":
        return <Clock className="size-5 text-yellow-500" />
      default:
        return null
    }
  }

  if (loading && resources.length === 0 && modules.length === 0 && workspaces.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Terraform Integration</CardTitle>
          <CardDescription>Loading Terraform data...</CardDescription>
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
          <CardTitle>Terraform Integration</CardTitle>
          <CardDescription>Error connecting to Terraform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => getTerraformData()}>
              <RefreshCw className="mr-2 size-4" /> Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (resources.length === 0 && modules.length === 0 && workspaces.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Terraform Integration</CardTitle>
          <CardDescription>No Terraform data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">
              No Terraform resources available. Please check your Terraform configuration.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => getTerraformData()}>
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
          <CardTitle>Terraform Integration</CardTitle>
          <CardDescription>Infrastructure as code management</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => getTerraformData()}>
          <RefreshCw className="mr-2 size-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workspaces">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          <TabsContent value="workspaces" className="space-y-4">
            {workspaces.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No workspaces available</p>
              </div>
            ) : (
              workspaces.map((workspace) => (
                <div key={workspace.name} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getWorkspaceStatusIcon(workspace.status)}
                      <h3 className="text-lg font-semibold">{workspace.name}</h3>
                      {getWorkspaceStatusBadge(workspace.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyTerraform(workspace.name)}
                        disabled={workspace.status === "planning" || workspace.changes === 0}
                      >
                        <Play className="mr-1 size-3" /> Apply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Cloud className="mr-1 size-3" /> Plan
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Resources</div>
                      <div className="text-sm font-medium">{workspace.resources}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Pending Changes</div>
                      <div className="text-sm font-medium">{workspace.changes}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Last Run</div>
                      <div className="text-sm font-medium">{new Date(workspace.lastRun).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {resources.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No resources available</p>
              </div>
            ) : (
              resources.map((resource) => (
                <div key={resource.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.type}</p>
                    </div>
                    {getResourceStatusBadge(resource.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Provider</div>
                      <div className="text-sm font-medium">{resource.provider}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Last Modified</div>
                      <div className="text-sm font-medium">{new Date(resource.lastModified).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground truncate">ID: {resource.id}</div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            {modules.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No modules available</p>
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.name} className="rounded-lg border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">{module.name}</h3>
                    <p className="text-sm text-muted-foreground">{module.source}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Version</div>
                      <div className="text-sm font-medium">{module.version}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Resources</div>
                      <div className="text-sm font-medium">{module.resources}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
