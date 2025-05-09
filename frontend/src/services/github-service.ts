// Mock GitHub service

type PullRequest = {
  id: number
  title: string
  number: number
  status: "open" | "merged" | "closed"
  author: {
    name: string
    avatar: string
  }
  branch: string
  created: string
  updated: string
  comments: number
  commits: number
}

type Repository = {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  issues: number
  pullRequests: number
  lastActivity: string
}

export async function getGithubData(): Promise<{ pullRequests: PullRequest[]; repositories: Repository[] }> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const pullRequests: PullRequest[] = [
        {
          id: 1,
          title: "Add authentication feature",
          number: 42,
          status: "open",
          author: {
            name: "johndoe",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          branch: "feature/auth",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          updated: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          comments: 5,
          commits: 8,
        },
        {
          id: 2,
          title: "Fix dashboard layout issues",
          number: 41,
          status: "merged",
          author: {
            name: "janesmith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          branch: "fix/dashboard-layout",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          updated: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          comments: 3,
          commits: 2,
        },
        {
          id: 3,
          title: "Update dependencies to latest versions",
          number: 40,
          status: "closed",
          author: {
            name: "alexjohnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          branch: "chore/update-deps",
          created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          comments: 2,
          commits: 1,
        },
      ]

      const repositories: Repository[] = [
        {
          id: 1,
          name: "devops-dashboard",
          description: "Modern DevOps dashboard with real-time metrics",
          stars: 42,
          forks: 12,
          issues: 5,
          pullRequests: 3,
          lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 2,
          name: "api-service",
          description: "RESTful API service for the DevOps platform",
          stars: 28,
          forks: 8,
          issues: 7,
          pullRequests: 2,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: 3,
          name: "infrastructure",
          description: "Infrastructure as code for the DevOps platform",
          stars: 15,
          forks: 5,
          issues: 3,
          pullRequests: 1,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
      ]

      resolve({ pullRequests, repositories })
    }, 600)
  })
}
