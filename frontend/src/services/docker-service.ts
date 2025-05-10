// Enhanced Docker service with real-time monitoring

type DockerContainer = {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "exited" | "created"
  ports: string[]
  created: string
  cpu: string
  memory: string
  realTimeStats?: {
    cpuHistory: number[]
    memoryHistory: number[]
    networkRx: number
    networkTx: number
    diskRead: number
    diskWrite: number
    logs: string[]
    restarts: number
    uptime: string
  }
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
          realTimeStats: {
            cpuHistory: Array.from({ length: 20 }, () => Math.random() * 2),
            memoryHistory: Array.from({ length: 20 }, () => Math.floor(Math.random() * 256) + 64),
            networkRx: Math.floor(Math.random() * 1024) + 256, // KB/s
            networkTx: Math.floor(Math.random() * 512) + 128, // KB/s
            diskRead: Math.floor(Math.random() * 100) + 10, // KB/s
            diskWrite: Math.floor(Math.random() * 200) + 20, // KB/s
            logs: [
              "[2023-05-09 15:30:12] Server started on port 8080",
              "[2023-05-09 15:30:13] Connected to database",
              "[2023-05-09 15:31:45] Processed 200 requests",
              "[2023-05-09 15:32:10] Cache hit ratio: 78%",
              "[2023-05-09 15:33:22] API request completed in 120ms",
            ],
            restarts: Math.floor(Math.random() * 3),
            uptime: `${Math.floor(Math.random() * 24) + 1}h ${Math.floor(Math.random() * 60)}m`,
          },
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
          realTimeStats: {
            cpuHistory: Array.from({ length: 20 }, () => Math.random() * 3),
            memoryHistory: Array.from({ length: 20 }, () => Math.floor(Math.random() * 512) + 128),
            networkRx: Math.floor(Math.random() * 512) + 64, // KB/s
            networkTx: Math.floor(Math.random() * 256) + 32, // KB/s
            diskRead: Math.floor(Math.random() * 500) + 100, // KB/s
            diskWrite: Math.floor(Math.random() * 1000) + 200, // KB/s
            logs: [
              "[2023-05-09 14:15:22] PostgreSQL database system is ready to accept connections",
              "[2023-05-09 14:16:33] Database 'production' is now available",
              "[2023-05-09 14:20:45] Autovacuum: processing database 'production'",
              "[2023-05-09 14:25:10] Checkpoint complete: wrote 45 buffers",
              "[2023-05-09 14:30:18] Connection received: host=172.17.0.1 port=48732",
            ],
            restarts: Math.floor(Math.random() * 2),
            uptime: `${Math.floor(Math.random() * 48) + 24}h ${Math.floor(Math.random() * 60)}m`,
          },
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
          realTimeStats: {
            cpuHistory: Array.from({ length: 20 }, () => Math.random() * 1),
            memoryHistory: Array.from({ length: 20 }, () => Math.floor(Math.random() * 128) + 32),
            networkRx: Math.floor(Math.random() * 256) + 32, // KB/s
            networkTx: Math.floor(Math.random() * 128) + 16, // KB/s
            diskRead: Math.floor(Math.random() * 50) + 5, // KB/s
            diskWrite: Math.floor(Math.random() * 100) + 10, // KB/s
            logs: [
              "[2023-05-09 15:10:12] Redis ready to accept connections",
              "[2023-05-09 15:11:45] Connected clients: 5",
              "[2023-05-09 15:15:33] Used memory: 32MB",
              "[2023-05-09 15:20:10] Keyspace hits: 1250, misses: 120",
              "[2023-05-09 15:25:22] Background saving started",
            ],
            restarts: Math.floor(Math.random() * 1),
            uptime: `${Math.floor(Math.random() * 36) + 12}h ${Math.floor(Math.random() * 60)}m`,
          },
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

// Get real-time container logs
export async function getContainerLogs(containerId: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        `[${new Date().toISOString()}] Container ${containerId.substring(0, 8)} started`,
        `[${new Date().toISOString()}] Initializing application...`,
        `[${new Date().toISOString()}] Loading configuration...`,
        `[${new Date().toISOString()}] Starting server on port 8080`,
        `[${new Date().toISOString()}] Connected to database`,
        `[${new Date().toISOString()}] Application ready to serve requests`,
        `[${new Date().toISOString()}] Received request: GET /api/status`,
        `[${new Date().toISOString()}] Request processed in 45ms`,
      ])
    }, 500)
  })
}

// Get real-time container stats
export async function getContainerStats(containerId: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cpu: {
          current: (Math.random() * 5).toFixed(2),
          history: Array.from({ length: 60 }, () => Math.random() * 5),
        },
        memory: {
          current: Math.floor(Math.random() * 512) + 64,
          limit: 1024,
          history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 512) + 64),
        },
        network: {
          rx: {
            current: Math.floor(Math.random() * 1024) + 256,
            history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 1024) + 256),
          },
          tx: {
            current: Math.floor(Math.random() * 512) + 128,
            history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 512) + 128),
          },
        },
        disk: {
          read: {
            current: Math.floor(Math.random() * 200) + 50,
            history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 200) + 50),
          },
          write: {
            current: Math.floor(Math.random() * 400) + 100,
            history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 400) + 100),
          },
        },
        uptime: `${Math.floor(Math.random() * 24) + 1}h ${Math.floor(Math.random() * 60)}m`,
        restarts: Math.floor(Math.random() * 3),
      })
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
