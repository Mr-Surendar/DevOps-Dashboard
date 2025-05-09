// Mock DevOps service

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

export async function getToolsStatus(): Promise<DevOpsToolsData> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        jenkins: {
          status: Math.random() > 0.8 ? "warning" : "healthy",
          message: "All pipelines running normally",
          lastUpdated: new Date().toISOString(),
          metrics: {
            pipelines: 12,
            running: Math.floor(Math.random() * 3) + 1,
            success: 8,
            failed: Math.floor(Math.random() * 3),
          },
        },
        github: {
          status: "healthy",
          message: "All repositories accessible",
          lastUpdated: new Date().toISOString(),
          metrics: {
            repositories: 8,
            pullRequests: Math.floor(Math.random() * 6) + 2,
            issues: Math.floor(Math.random() * 10) + 5,
            contributors: 7,
          },
        },
        docker: {
          status: Math.random() > 0.7 ? "warning" : "healthy",
          message: Math.random() > 0.7 ? "High resource usage detected" : "All containers running normally",
          lastUpdated: new Date().toISOString(),
          metrics: {
            containers: 24,
            running: Math.floor(Math.random() * 6) + 15,
            stopped: Math.floor(Math.random() * 5),
            images: 32,
          },
        },
        kubernetes: {
          status: Math.random() > 0.85 ? "error" : Math.random() > 0.6 ? "warning" : "healthy",
          message:
            Math.random() > 0.85 ? "Pod crash loop detected in production namespace" : "All pods running normally",
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
    }, 600)
  })
}

export async function getDevOpsAlerts(): Promise<any[]> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve([
        {
          id: "alert-1",
          tool: "kubernetes",
          severity: "high",
          message: "Pod crash loop detected in production namespace",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "alert-2",
          tool: "jenkins",
          severity: "medium",
          message: "Pipeline build-123 failed on test stage",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          id: "alert-3",
          tool: "docker",
          severity: "low",
          message: "Container api-service using high CPU",
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        },
      ])
    }, 500)
  })
}
