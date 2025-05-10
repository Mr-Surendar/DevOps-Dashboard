"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSonarQubeProjects } from "@/services/sonarqube-service"
import { CheckCircle, AlertTriangle, Bug, Shield, Code } from "lucide-react"

export function SonarQubeSummary() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBugs: 0,
    totalVulnerabilities: 0,
    totalCodeSmells: 0,
    averageCoverage: 0,
    qualityGatesPassed: 0,
    qualityGatesFailed: 0,
    qualityGatesWarning: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getSonarQubeProjects()
        setProjects(projectsData)

        // Calculate summary statistics
        const totalBugs = projectsData.reduce((sum, project) => sum + project.metrics.bugs, 0)
        const totalVulnerabilities = projectsData.reduce((sum, project) => sum + project.metrics.vulnerabilities, 0)
        const totalCodeSmells = projectsData.reduce((sum, project) => sum + project.metrics.codeSmells, 0)
        const averageCoverage =
          projectsData.reduce((sum, project) => sum + project.metrics.coverage, 0) / projectsData.length

        const qualityGatesPassed = projectsData.filter((project) => project.metrics.qualityGate === "passed").length
        const qualityGatesFailed = projectsData.filter((project) => project.metrics.qualityGate === "failed").length
        const qualityGatesWarning = projectsData.filter((project) => project.metrics.qualityGate === "warning").length

        setStats({
          totalBugs,
          totalVulnerabilities,
          totalCodeSmells,
          averageCoverage,
          qualityGatesPassed,
          qualityGatesFailed,
          qualityGatesWarning,
        })

        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch SonarQube data", error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="gradient-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">SonarQube Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-border bg-card/50 backdrop-blur-sm glow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">SonarQube Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Bug className="size-4 text-red-500" />
            <div>
              <div className="text-sm text-muted-foreground">Bugs</div>
              <div className="text-xl font-bold">{stats.totalBugs}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-orange-500" />
            <div>
              <div className="text-sm text-muted-foreground">Vulnerabilities</div>
              <div className="text-xl font-bold">{stats.totalVulnerabilities}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Code className="size-4 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Code Smells</div>
              <div className="text-xl font-bold">{stats.totalCodeSmells}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 flex items-center justify-center">
              {stats.averageCoverage >= 80 ? (
                <CheckCircle className="size-4 text-green-500" />
              ) : (
                <AlertTriangle className="size-4 text-yellow-500" />
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg. Coverage</div>
              <div className="text-xl font-bold">{stats.averageCoverage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className="bg-green-500">{stats.qualityGatesPassed}</Badge>
            <Badge className="bg-yellow-500">{stats.qualityGatesWarning}</Badge>
            <Badge className="bg-red-500">{stats.qualityGatesFailed}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">Quality Gates</span>
        </div>
      </CardContent>
    </Card>
  )
}
