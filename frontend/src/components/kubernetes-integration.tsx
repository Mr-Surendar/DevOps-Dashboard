"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Square, Trash2, AlertTriangle, Server } from "lucide-react"
import { getKubernetesData } from "@/services/kubernetes-service"

type KubernetesPod = {
  name: string
  namespace: string
  status: "Running" | "Pending" | "Succeeded" | "Failed" | "Unknown"
  restarts: number
  age: string
  cpu: string
  memory: string
  node: string
}

type KubernetesDeployment = {
  name: string
  namespace: string
  replicas: string
  availableReplicas: number
  updatedReplicas: number
  age: string
  strategy: string
}

type KubernetesNode = {
  name: string
  status: "Ready" | "NotReady" | "Unknown"
  roles: string[]
  age: string
  version: string
  cpu: string
  memory: string
  pods: string
}

export function KubernetesIntegration() {
  const [pods, setPods] = useState<KubernetesPod[]>([])
  const [deployments, setDeployments] = useState<KubernetesDeployment[]>([])
  const [nodes, setNodes] = useState<KubernetesNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKubernetesData = async () => {
      try {
        setLoading(true)
        const data = await getKubernetesData()
        setPods(data.pods)
        setDeployments(data.deployments)
        setNodes(data.nodes)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch Kubernetes data", error)
        setError("Failed to connect to Kubernetes. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchKubernetesData()
    const interval = setInterval(fetchKubernetesData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Mock data for demonstration
  const mockPods: KubernetesPod[] = [
    {
      name: "api-service-pod-1",
      namespace: "production",
      status: "Running",
      restarts: 0,
      age: "3d",
      cpu: "120m",
      memory: "256Mi",
      node: "worker-1",
    },
    {
      name: "database-pod-1",
      namespace: "production",
      status: "Running",
      restarts: 2,
      age: "5d",
      cpu: "500m",
      memory: "1Gi",
      node: "worker-2",
    },
    {
      name: "cache-pod-1",
      namespace: "production",
      status: "Failed",
      restarts: 5,
      age: "1d",
      cpu: "100m",
      memory: "128Mi",
      node: "worker-1",
    },
    {
      name: "frontend-pod-1",
      namespace: "staging",
      status: "Pending",
      restarts: 0,
      age: "2h",
      cpu: "50m",
      memory: "128Mi",
      node: "worker-3",
    },
  ]

  const mockDeployments: KubernetesDeployment[] = [
    {
      name: "api-service",
      namespace: "production",
      replicas: "3/3",
      availableReplicas: 3,
      updatedReplicas: 3,
      age: "3d",
      strategy: "RollingUpdate",
    },
    {
      name: "database",
      namespace: "production",
      replicas: "1/1",
      availableReplicas: 1,
      updatedReplicas: 1,
      age: "5d",
      strategy: "Recreate",
    },
    {
      name: "cache",
      namespace: "production",
      replicas: "0/2",
      availableReplicas: 0,
      updatedReplicas: 0,
      age: "1d",
      strategy: "RollingUpdate",
    },
    {
      name: "frontend",
      namespace: "staging",
      replicas: "2/3",
      availableReplicas: 2,
      updatedReplicas: 2,
      age: "2h",
      strategy: "RollingUpdate",
    },
  ]

  const mockNodes: KubernetesNode[] = [
    {
      name: "master-1",
      status: "Ready",
      roles: ["control-plane", "master"],
      age: "30d",
      version: "v1.25.4",
      cpu: "2/4",
      memory: "4Gi/8Gi",
      pods: "12/110",
    },
    {
      name: "worker-1",
      status: "Ready",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: "3/8",
      memory: "12Gi/16Gi",
      pods: "28/110",
    },
    {
      name: "worker-2",
      status: "Ready",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: "6/8",
      memory: "14Gi/16Gi",
      pods: "32/110",
    },
    {
      name: "worker-3",
      status: "NotReady",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: "0/8",
      memory: "0Gi/16Gi",
      pods: "0/110",
    },
  ]

  const displayPods = pods.length > 0 ? pods : mockPods
  const displayDeployments = deployments.length > 0 ? deployments : mockDeployments
  const displayNodes = nodes.length > 0 ? nodes : mockNodes

  const getPodStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return <Badge className="bg-green-500">Running</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "Succeeded":
        return <Badge className="bg-blue-500">Succeeded</Badge>
      case "Failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "Unknown":
        return <Badge className="bg-gray-500">Unknown</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getNodeStatusBadge = (status: string) => {
    switch (status) {
      case "Ready":
        return <Badge className="bg-green-500">Ready</Badge>
      case "NotReady":
        return <Badge className="bg-red-500">Not Ready</Badge>
      case "Unknown":
        return <Badge className="bg-gray-500">Unknown</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (loading && pods.length === 0 && deployments.length === 0 && nodes.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Kubernetes Integration</CardTitle>
          <CardDescription>Loading Kubernetes data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && pods.length === 0 && deployments.length === 0 && nodes.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Kubernetes Integration</CardTitle>
          <CardDescription>Error connecting to Kubernetes</CardDescription>
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

  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Kubernetes Integration</CardTitle>
          <CardDescription>Cluster, deployment, and pod management</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 size-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pods">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="pods">Pods</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
          </TabsList>

          <TabsContent value="pods" className="space-y-4">
            {displayPods.map((pod) => (
              <div key={pod.name} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{pod.name}</h3>
                    <p className="text-sm text-muted-foreground">Namespace: {pod.namespace}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPodStatusBadge(pod.status)}
                    <Button size="sm" variant="outline" className="text-red-500">
                      <Trash2 className="mr-1 size-3" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Restarts</div>
                    <div className="text-sm font-medium">{pod.restarts}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Age</div>
                    <div className="text-sm font-medium">{pod.age}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">CPU</div>
                    <div className="text-sm font-medium">{pod.cpu}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="text-sm font-medium">{pod.memory}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">Node: {pod.node}</div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="deployments" className="space-y-4">
            {displayDeployments.map((deployment) => (
              <div key={deployment.name} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{deployment.name}</h3>
                    <p className="text-sm text-muted-foreground">Namespace: {deployment.namespace}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={deployment.availableReplicas === 0 ? "bg-red-500" : "bg-green-500"}>
                      {deployment.replicas}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="mr-1 size-3" /> Restart
                    </Button>
                    <Button size="sm" variant="outline">
                      <Square className="mr-1 size-3" /> Scale
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Available</div>
                    <div className="text-sm font-medium">{deployment.availableReplicas}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Updated</div>
                    <div className="text-sm font-medium">{deployment.updatedReplicas}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Age</div>
                    <div className="text-sm font-medium">{deployment.age}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Strategy</div>
                    <div className="text-sm font-medium">{deployment.strategy}</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4">
            {displayNodes.map((node) => (
              <div key={node.name} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{node.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {node.roles.map((role, index) => (
                        <Badge key={index} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getNodeStatusBadge(node.status)}
                    <Button size="sm" variant="outline">
                      <Server className="mr-1 size-3" /> Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Version</div>
                    <div className="text-sm font-medium">{node.version}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">CPU</div>
                    <div className="text-sm font-medium">{node.cpu}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="text-sm font-medium">{node.memory}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">Pods</div>
                    <div className="text-sm font-medium">{node.pods}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">Age: {node.age}</div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
