import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"

// SonarQube client configuration
const sonarqubeConfig = {
  baseUrl: process.env.SONARQUBE_URL || "http://sonarqube:9000",
  token: process.env.SONARQUBE_TOKEN || "",
}

// Mock data generator for SonarQube
const generateMockSonarQubeData = () => {
  const projects = [
    {
      id: "proj-1",
      name: "Backend API",
      key: "org.example:backend-api",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 10),
        vulnerabilities: Math.floor(Math.random() * 5),
        codeSmells: Math.floor(Math.random() * 50) + 10,
        coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
        duplications: Math.floor(Math.random() * 10),
        qualityGate: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
    {
      id: "proj-2",
      name: "Frontend App",
      key: "org.example:frontend-app",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 8),
        vulnerabilities: Math.floor(Math.random() * 3),
        codeSmells: Math.floor(Math.random() * 40) + 5,
        coverage: Math.floor(Math.random() * 40) + 50, // 50-90%
        duplications: Math.floor(Math.random() * 15),
        qualityGate: Math.random() > 0.6 ? "warning" : Math.random() > 0.2 ? "passed" : "failed",
      },
    },
    {
      id: "proj-3",
      name: "Infrastructure",
      key: "org.example:infrastructure",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 7),
        codeSmells: Math.floor(Math.random() * 30) + 5,
        coverage: Math.floor(Math.random() * 50) + 40, // 40-90%
        duplications: Math.floor(Math.random() * 8),
        qualityGate: Math.random() > 0.5 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
  ]

  const severities = ["blocker", "critical", "major", "minor", "info"]
  const types = ["bug", "vulnerability", "code_smell"]
  const statuses = ["open", "confirmed", "resolved", "closed"]
  const components = [
    "src/main/java/org/example/api/UserController.java",
    "src/main/java/org/example/service/AuthService.java",
    "src/main/java/org/example/repository/UserRepository.java",
    "src/main/resources/application.properties",
    "src/test/java/org/example/api/UserControllerTest.java",
  ]
  const authors = ["john.doe", "jane.smith", "alex.johnson", "sarah.williams"]

  const issues = Array.from({ length: 15 }, (_, i) => ({
    id: `issue-${i + 1}`,
    message: [
      "Remove this unused method parameter.",
      "Make this a static final constant or non-public and provide accessors.",
      "Add a nested comment explaining why this method is empty.",
      "Replace this use of System.out by a logger.",
      "Refactor this method to reduce its Cognitive Complexity.",
      "Make sure this exception is handled.",
      "Use a logger instead of System.console.",
      "Add the missing @Override annotation.",
      "Remove this unused private field.",
      "This block of commented-out code should be removed.",
    ][Math.floor(Math.random() * 10)],
    component: components[Math.floor(Math.random() * components.length)],
    project: projects[Math.floor(Math.random() * projects.length)].key,
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * Math.floor(Math.random() * 72)).toISOString(),
    line: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 1 : undefined,
    effort: `${Math.floor(Math.random() * 5) + 1}${["min", "h"][Math.floor(Math.random() * 2)]}`,
  }))

  const qualityGates = [
    {
      name: "Default",
      status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      conditions: [
        {
          metric: "new_reliability_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_security_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_maintainability_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_coverage",
          operator: "LESS_THAN",
          value: "80",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "80",
        },
        {
          metric: "new_duplicated_lines_density",
          operator: "GREATER_THAN",
          value: "3",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "3",
        },
      ],
    },
  ]

  return { projects, issues, qualityGates }
}

// @desc    Get SonarQube projects
// @route   GET /api/sonarqube/projects
// @access  Private
export const getSonarQubeProjects = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would use the SonarQube API
    // to get the projects

    // For demonstration, we'll return mock data
    // In production, replace this with actual SonarQube API calls
    const { projects } = generateMockSonarQubeData()

    res.status(200).json({
      success: true,
      data: projects,
    })
  } catch (error) {
    throw new AppError(`Error fetching SonarQube projects: ${error.message}`, 500)
  }
})

// @desc    Get SonarQube issues
// @route   GET /api/sonarqube/issues
// @access  Private
export const getSonarQubeIssues = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would use the SonarQube API
    // to get the issues

    // For demonstration, we'll return mock data
    // In production, replace this with actual SonarQube API calls
    const { issues } = generateMockSonarQubeData()

    res.status(200).json({
      success: true,
      data: issues,
    })
  } catch (error) {
    throw new AppError(`Error fetching SonarQube issues: ${error.message}`, 500)
  }
})

// @desc    Get SonarQube quality gates
// @route   GET /api/sonarqube/quality-gates
// @access  Private
export const getSonarQubeQualityGates = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would use the SonarQube API
    // to get the quality gates

    // For demonstration, we'll return mock data
    // In production, replace this with actual SonarQube API calls
    const { qualityGates } = generateMockSonarQubeData()

    res.status(200).json({
      success: true,
      data: qualityGates,
    })
  } catch (error) {
    throw new AppError(`Error fetching SonarQube quality gates: ${error.message}`, 500)
  }
})

// @desc    Get all SonarQube data
// @route   GET /api/sonarqube/data
// @access  Private
export const getSonarQubeData = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would use the SonarQube API
    // to get all the data

    // For demonstration, we'll return mock data
    // In production, replace this with actual SonarQube API calls
    const data = generateMockSonarQubeData()

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    throw new AppError(`Error fetching SonarQube data: ${error.message}`, 500)
  }
})
