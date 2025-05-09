// Mock Docker service

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

export async function getDockerData(): Promise<{ containers: DockerContainer[]; images: DockerImage[] }> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const containers: DockerContainer[] = [
        {
          id: "abc123def456",
          name: "api-service",
          image: "api-service:latest",
          status: Math.random() > 0.2 ? "running" : "stopped",
          ports: ["8080:8080", "8081:8081"],
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          cpu: `${(Math.random() * 2).toFixed(1)}%`,
          memory: `${Math.floor(Math.random() * 256) + 64}MB / 512MB`,
        },
        {
          id: "ghi789jkl012",
          name: "database",
          image: "postgres:14",
          status: Math.random() > 0.1 ? "running" : "stopped",
          ports: ["5432:5432"],
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          cpu: `${(Math.random() * 3).toFixed(1)}%`,
          memory: `${Math.floor(Math.random() * 512) + 128}MB / 1GB`,
        },
        {
          id: "mno345pqr678",
          name: "cache",
          image: "redis:alpine",
          status: Math.random() > 0.3 ? "running" : "stopped",
          ports: ["6379:6379"],
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          cpu: `${(Math.random() * 1).toFixed(1)}%`,
          memory: `${Math.floor(Math.random() * 128) + 32}MB / 256MB`,
        },
      ]

      const images: DockerImage[] = [
        {
          id: "sha256:abc123def456",
          repository: "api-service",
          tag: "latest",
          size: "120MB",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
          id: "sha256:ghi789jkl012",
          repository: "postgres",
          tag: "14",
          size: "320MB",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        },
        {
          id: "sha256:mno345pqr678",
          repository: "redis",
          tag: "alpine",
          size: "32MB",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        },
      ]

      resolve({ containers, images })
    }, 500)
  })
}

export async function startContainer(containerId: string): Promise<void> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Started container: ${containerId}`)
      resolve()
    }, 1000)
  })
}

export async function stopContainer(containerId: string): Promise<void> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Stopped container: ${containerId}`)
      resolve()
    }, 1000)
  })
}
