"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertTriangle, CheckCircle, Bug, Shield, Code, FileCode } from "lucide-react"
import { getSonarQubeData } from "@/services/sonarqube-service"

type SonarQubeProject = {
  id: string
  name: string
  key: string
  lastAnalysis: string
  metrics: {
    bugs: number
    vulnerabilities: number
    codeSmells: number
    coverage: number
    duplications: number
    qualityGate: "passed" | "failed" | "warning"
  }
}

type SonarQubeIssue = {
  id: string
  message: string
  component: string
  project: string
  severity: "blocker" | "critical" | "major" | "minor" | "info"
  type: "bug" | "vulnerability" | "code_smell"
  status: "open" | "confirmed" | "resolved" | "closed"
  author: string
  createdAt: string
  line?: number
  effort: string
}

type SonarQubeQualityGate = {
  name: string
  status: "passed" | "failed" | "warning"
  conditions: {
    metric: string
    operator: string
    value: string
    status: "passed" | "failed" | "warning"
    errorThreshold?: string
    warningThreshold?: string
  }[]
}

export function SonarQubeIntegration() {
  const [projects, setProjects] = useState<SonarQubeProject[]>([])
  const [issues, setIssues] = useState<SonarQubeIssue[]>([])
  const [qualityGates, setQualityGates] = useState<SonarQubeQualityGate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("projects")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  useEffect(() => {
    const fetchSonarQubeData = async () => {
      try {
        setLoading(true)
        const data = await getSonarQubeData()
        setProjects(data.projects || [])
        setIssues(data.issues || [])
        setQualityGates(data.qualityGates || [])
        setLastRefreshed(new Date())
        setError(null)
      } catch (error) {
        console.error("Failed to fetch SonarQube data", error)
        setError("Failed to connect to SonarQube. Please check your connection settings.")
      } finally {
        setLoading(false)
      }
    }

    fetchSonarQubeData()
    const interval = setInterval(fetchSonarQubeData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const data = await getSonarQubeData()
      setProjects(data.projects || [])
      setIssues(data.issues || [])
      setQualityGates(data.qualityGates || [])
      setLastRefreshed(new Date())
      setError(null)
    } catch (error) {
      console.error("Failed to fetch SonarQube data", error)
      setError("Failed to connect to SonarQube. Please check your connection settings.")
    } finally {
      setLoading(false)
    }
  }

  const getQualityGateIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="size-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="size-5 text-yellow-500" />
      case "failed":
        return <AlertTriangle className="size-5 text-red-500" />
      default:
        return null
    }
  }

  const getQualityGateBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500">Passed</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "blocker":
        return <Badge className="bg-red-600">Blocker</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      case "major":
        return <Badge className="bg-orange-500">Major</Badge>
      case "minor":
        return <Badge className="bg-yellow-500">Minor</Badge>
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "bug":
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <Bug className="size-3" /> Bug
          </Badge>
        )
      case "vulnerability":
        return (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <Shield className="size-3" /> Vulnerability
          </Badge>
        )
      case "code_smell":
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <Code className="size-3" /> Code Smell
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Open
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-orange-500 border-orange-500">
            Confirmed
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Closed
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading && projects.length === 0 && issues.length === 0 && qualityGates.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>SonarQube Integration</CardTitle>
          <CardDescription>Loading SonarQube data...</CardDescription>
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
          <CardTitle>SonarQube Integration</CardTitle>
          <CardDescription>Error connecting to SonarQube</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 size-8 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
              <RefreshCw className="mr-2 size-4" /> Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (projects.length === 0 && issues.length === 0 && qualityGates.length === 0) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>SonarQube Integration</CardTitle>
          <CardDescription>No SonarQube data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">
              No SonarQube data available. Please check your SonarQube configuration.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
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
          <CardTitle>SonarQube Integration</CardTitle>
          <CardDescription>Code quality analysis and quality gates</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last updated: {lastRefreshed.toLocaleTimeString()}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="quality-gates">Quality Gates</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No projects available</p>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getQualityGateIcon(project.metrics.qualityGate)}
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getQualityGateBadge(project.metrics.qualityGate)}
                      <Button size="sm" variant="outline">
                        <FileCode className="mr-1 size-3" /> View Report
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Bugs</div>
                      <div className="text-xl font-bold text-red-500">{project.metrics.bugs}</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                      <div className="text-xl font-bold text-orange-500">{project.metrics.vulnerabilities}</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Code Smells</div>
                      <div className="text-xl font-bold text-blue-500">{project.metrics.codeSmells}</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Coverage</div>
                      <div className="text-xl font-bold">{project.metrics.coverage}%</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Duplications</div>
                      <div className="text-xl font-bold">{project.metrics.duplications}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Coverage</span>
                      <span>{project.metrics.coverage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${
                          project.metrics.coverage >= 80
                            ? "bg-green-500"
                            : project.metrics.coverage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${project.metrics.coverage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    Last analysis: {new Date(project.lastAnalysis).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {issues.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No issues available</p>
              </div>
            ) : (
              <>
                {issues
                  .filter((issue) => issue.status === "open" || issue.status === "confirmed")
                  .slice(0, 5)
                  .map((issue) => (
                    <div key={issue.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        {getTypeBadge(issue.type)}
                        {getStatusBadge(issue.status)}
                      </div>
                      <h3 className="mb-2 text-base font-medium">{issue.message}</h3>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">File:</span> {issue.component}
                        {issue.line && <span className="ml-2">Line: {issue.line}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>Author: {issue.author}</span>
                        <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                        <span>Effort: {issue.effort}</span>
                      </div>
                    </div>
                  ))}
                <Button variant="outline" className="w-full">
                  View All Issues
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="quality-gates" className="space-y-4">
            {qualityGates.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No quality gates available</p>
              </div>
            ) : (
              qualityGates.map((gate) => (
                <div key={gate.name} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getQualityGateIcon(gate.status)}
                      <h3 className="text-lg font-semibold">{gate.name}</h3>
                    </div>
                    {getQualityGateBadge(gate.status)}
                  </div>

                  <div className="space-y-3">
                    {gate.conditions.map((condition, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getQualityGateIcon(condition.status)}
                            <span className="font-medium">
                              {condition.metric.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                          {getQualityGateBadge(condition.status)}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {condition.operator === "GREATER_THAN" ? ">" : "<"} {condition.errorThreshold}
                          {condition.warningThreshold && ` (Warning: ${condition.warningThreshold})`}
                        </div>
                      </div>
                    ))}
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
