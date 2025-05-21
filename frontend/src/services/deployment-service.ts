// Mock Deployment service

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

export async function getRecentDeployments(): Promise<Deployment[]> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const environments: ("production" | "staging" | "development")[] = ["production", "staging", "development"]
      const statuses: ("success" | "failed" | "in-progress" | "rollback")[] = [
        "success",
        "failed",
        "in-progress",
        "rollback",
      ]
      const deployers = [
        { name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Sarah Williams", avatar: "/placeholder.svg?height=32&width=32" },
      ]

      const deployments: Deployment[] = Array.from({ length: 4 }, (_, i) => {
        // NOSONAR: Using Math.random() for non-security-critical mock data generation
        const environment = environments[Math.floor(Math.random() * environments.length)]
        // NOSONAR: Using Math.random() for non-security-critical mock data generation
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        // NOSONAR: Using Math.random() for non-security-critical mock data generation
        const deployer = deployers[Math.floor(Math.random() * deployers.length)]

        // NOSONAR: Using Math.random() for non-security-critical mock data generation
        const version = `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}${environment === "development" ? "-dev" : ""}`
        // NOSONAR: Using Math.random() for non-security-critical mock data generation
        const timestamp = new Date(Date.now() - 1000 * 60 * 60 * (Math.floor(Math.random() * 24) + 1)).toISOString()

        return {
          id: `deploy-${789 - i}`,
          environment,
          status,
          version,
          timestamp,
          deployer,
        }
      })

      resolve(deployments)
    }, 500)
  })
}
