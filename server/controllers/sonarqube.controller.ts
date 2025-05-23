import axios from "axios"
import type { Request, Response } from "express"

const sonarqubeConfig = {
  url: process.env.SONARQUBE_URL || "http://localhost:9000", // Replace with your SonarQube URL
  token: process.env.SONARQUBE_TOKEN || "YOUR_SONARQUBE_TOKEN", // Replace with your token
  projectKey: process.env.SONARQUBE_PROJECT_KEY || "your-project-key", // Replace with your project key
}

export const SONARQUBE_CONFIG = {
  url: "http://sonarqube:9000", // Replace with your actual SonarQube URL
  token: "YOUR_SONARQUBE_TOKEN", // Replace with your actual token
}

export const getSonarQubeData = async (req: Request, res: Response) => {
  try {
    const sonarUrl = process.env.SONARQUBE_URL
    const token = process.env.SONARQUBE_TOKEN

    // Fetch projects
    const projectsResponse = await axios.get(`${sonarUrl}/api/projects/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Fetch metrics for each project
    const projects = await Promise.all(
      projectsResponse.data.components.map(async (project: any) => {
        const metricsResponse = await axios.get(
          `${sonarUrl}/api/measures/component?component=${project.key}&metricKeys=bugs,vulnerabilities,code_smells,coverage,alert_status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const measures = metricsResponse.data.component.measures
        const getMetricValue = (key: string) => {
          const measure = measures.find((m: any) => m.metric === key)
          return measure ? (key === "alert_status" ? measure.value : Number.parseFloat(measure.value)) : 0
        }

        return {
          id: project.key,
          name: project.name,
          key: project.key,
          metrics: {
            bugs: getMetricValue("bugs"),
            vulnerabilities: getMetricValue("vulnerabilities"),
            codeSmells: getMetricValue("code_smells"),
            coverage: getMetricValue("coverage"),
            qualityGate: getMetricValue("alert_status") === "OK" ? "passed" : "failed",
          },
        }
      }),
    )

    res.status(200).json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("Error fetching SonarQube data:", error)
    res.status(500).json({ success: false, error: "Failed to fetch SonarQube data" })
  }
}
