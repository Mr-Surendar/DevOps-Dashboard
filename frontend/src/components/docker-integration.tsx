"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Play, Square, Trash2, AlertTriangle } from "lucide-react"
import { getDockerData, startContainer, stopContainer } from "@/services/docker-service"

type DockerContainer = {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "exited" | "created"
  ports: string[]
  created: string
  cpu: string
  memory: string
}

type DockerImage = {
  id: string
  repository: string
  tag: string
  size: string
  created: string
}

export function DockerIntegration() {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [images, setImages] = useState<DockerImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDockerData = async () => {
      try {
        setLoading(true)
        const data = await getDockerData()
        setContainers(data.containers || [])
        setImages(data.images || [])
        setError(null)
      } catch (error) {
        console.error("Failed to fetch Docker data", error)
        setError("Failed to connect to Docker. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchDockerData()
    const interval = setInterval(fetchDockerData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleStartContainer = async (containerId: string) => {
    try {
      await startContainer(containerId)
      // Refresh data after starting container
      const data = await getDockerData()
      setContainers(data.containers || [])
    } catch (error) {
      console.error("Failed to start Docker container", error)
      setError("Failed to start container. Please check your permissions.")
    }
  }

  const handleStopContainer = async (containerId: string) => {
    try {
      await stopContainer(containerId)
      // Refresh data after stopping container
      const data = await getDockerData()
      setContainers(data.containers || [])
    } catch (error) {
      console.error("Failed to stop Docker container", error)
      setError("Failed to stop container. Please check your permissions.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500">Running</Badge>
      case "stopped":
      case "exited":
        return <Badge className="bg-yellow-500">Stopped</Badge>
      case "created":
        return <Badge className="bg-blue-500">Created</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (loading && containers.length === 0 && images.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Docker Integration</CardTitle>
          <CardDescription>Loading Docker data...</CardDescription>
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
          <CardTitle>Docker Integration</CardTitle>
          <CardDescription>Error connecting to Docker</CardDescription>
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

  // No Docker data available
  if (!loading && containers.length === 0 && images.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Docker Integration</CardTitle>
          <CardDescription>Configure Docker Integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground mb-4">
              No Docker containers or images available. Please configure your Docker integration in the server
              environment.
            </p>
            <div className="text-left mb-4 p-4 bg-muted rounded-md">
              <p className="font-mono text-sm mb-2">Required environment variables:</p>
              <ul className="list-disc pl-5 font-mono text-xs space-y-1">
                <li>DOCKER_HOST</li>
                <li>DOCKER_API_VERSION</li>
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
          <CardTitle>Docker Integration</CardTitle>
          <CardDescription>Container and image management</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => getDockerData()}>
          <RefreshCw className="mr-2 size-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="containers">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="volumes">Volumes</TabsTrigger>
          </TabsList>

          <TabsContent value="containers" className="space-y-4">
            {containers.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No containers available</p>
              </div>
            ) : (
              containers.map((container) => (
                <div key={container.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{container.name}</h3>
                      <p className="text-sm text-muted-foreground">{container.image}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(container.status)}
                      {container.status === "running" ? (
                        <Button size="sm" variant="outline" onClick={() => handleStopContainer(container.id)}>
                          <Square className="mr-1 size-3" /> Stop
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleStartContainer(container.id)}>
                          <Play className="mr-1 size-3" /> Start
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-500">
                        <Trash2 className="mr-1 size-3" /> Remove
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {container.ports.map((port, index) => (
                      <Badge key={index} variant="outline">
                        {port}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">CPU Usage</div>
                      <div className="text-sm font-medium">{container.cpu}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Memory Usage</div>
                      <div className="text-sm font-medium">{container.memory}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="text-sm font-medium">{new Date(container.created).toLocaleDateString()}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Container ID</div>
                      <div className="text-sm font-medium truncate">{container.id}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            {images.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No images available</p>
              </div>
            ) : (
              images.map((image) => (
                <div key={image.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {image.repository}:{image.tag}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{image.id}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-500">
                      <Trash2 className="mr-1 size-3" /> Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="text-sm font-medium">{image.size}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="text-sm font-medium">{new Date(image.created).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="volumes">
            <div className="rounded-lg border p-6 text-center">
              <p className="text-muted-foreground">Volume management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
