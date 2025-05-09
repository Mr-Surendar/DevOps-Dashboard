"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, GitPullRequest, GitMerge, GitBranch, AlertTriangle } from "lucide-react"
import { getGithubData } from "@/services/github-service"

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

export function GithubIntegration() {
  const [activeTab, setActiveTab] = useState("pull-requests")
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([])
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        setLoading(true)
        const data = await getGithubData()
        setPullRequests(data.pullRequests)
        setRepositories(data.repositories)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch GitHub data", error)
        setError("Failed to connect to GitHub. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchGithubData()
    const interval = setInterval(fetchGithubData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Mock data for demonstration
  const mockPullRequests: PullRequest[] = [
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

  const mockRepositories: Repository[] = [
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

  const displayPullRequests = pullRequests.length > 0 ? pullRequests : mockPullRequests
  const displayRepositories = repositories.length > 0 ? repositories : mockRepositories

  const getPRStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <GitPullRequest className="size-5 text-blue-500" />
      case "merged":
        return <GitMerge className="size-5 text-purple-500" />
      case "closed":
        return <AlertTriangle className="size-5 text-red-500" />
      default:
        return null
    }
  }

  const getPRStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>
      case "merged":
        return <Badge className="bg-purple-500">Merged</Badge>
      case "closed":
        return <Badge className="bg-red-500">Closed</Badge>
      default:
        return null
    }
  }

  if (loading && pullRequests.length === 0 && repositories.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Loading GitHub data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && pullRequests.length === 0 && repositories.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Error connecting to GitHub</CardDescription>
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
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Repository and pull request management</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 size-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pull-requests" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="pull-requests" className="space-y-4">
            {displayPullRequests.map((pr) => (
              <div key={pr.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPRStatusIcon(pr.status)}
                    <h3 className="text-lg font-semibold">
                      #{pr.number} {pr.title}
                    </h3>
                  </div>
                  {getPRStatusBadge(pr.status)}
                </div>

                <div className="mb-3 flex items-center gap-3">
                  <Avatar className="size-6">
                    <AvatarImage src={pr.author.avatar || "/placeholder.svg"} alt={pr.author.name} />
                    <AvatarFallback>{pr.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{pr.author.name}</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GitBranch className="size-3" /> {pr.branch}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Created: {new Date(pr.created).toLocaleDateString()}</span>
                  <span>Updated: {new Date(pr.updated).toLocaleDateString()}</span>
                  <span>Comments: {pr.comments}</span>
                  <span>Commits: {pr.commits}</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="repositories" className="space-y-4">
            {displayRepositories.map((repo) => (
              <div key={repo.id} className="rounded-lg border p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{repo.name}</h3>
                  <p className="text-sm text-muted-foreground">{repo.description}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                    </svg>
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    </svg>
                    {repo.forks}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      <path
                        fillRule="evenodd"
                        d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                      />
                    </svg>
                    {repo.issues}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitPullRequest className="size-4" />
                    {repo.pullRequests}
                  </span>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Last activity: {new Date(repo.lastActivity).toLocaleString()}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="issues">
            <div className="rounded-lg border p-6 text-center">
              <p className="text-muted-foreground">Issue management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
