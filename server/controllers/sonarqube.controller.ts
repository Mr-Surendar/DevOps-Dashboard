import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"
import axios from "axios"

// SonarQube client configuration
const sonarqubeConfig = {
  baseUrl: process.env.SONARQUBE_URL || "http://sonarqube:9000",
  token: process.env.SONARQUBE_TOKEN || "",
}

// Helper function to make authenticated requests to SonarQube API
async function sonarqubeRequest(endpoint: string, method = "GET", data = null) {
  try {
    const url = `${sonarqubeConfig.baseUrl}/api${endpoint}`
    const auth = Buffer.from(`${sonarqubeConfig.token}:`).toString("base64")

    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error(`SonarQube API request failed: ${error.message}`)
    throw error
  }
}

// @desc    Get SonarQube projects
// @route   GET /api/sonarqube/projects
// @access  Private
export const getSonarQubeProjects = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if SonarQube credentials are configured
    if (!sonarqubeConfig.token) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "SonarQube token not configured. Please set SONARQUBE_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch data from SonarQube API
    // Example:
    // const projectsData = await sonarqubeRequest('/projects/search')
    // const projects = projectsData.components.map(project => {
    //   // Fetch metrics for each project
    //   const metricsData = await sonarqubeRequest(`/measures/component?component=${project.key}&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density`)
    //   // ...process metrics data
    // })

    // For now, return empty array until SonarQube is configured
    const projects: any[] = []

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
    // Check if SonarQube credentials are configured
    if (!sonarqubeConfig.token) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "SonarQube token not configured. Please set SONARQUBE_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch data from SonarQube API
    // Example:
    // const issuesData = await sonarqubeRequest('/issues/search')

    // For now, return empty array until SonarQube is configured
    const issues: any[] = []

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
    // Check if SonarQube credentials are configured
    if (!sonarqubeConfig.token) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "SonarQube token not configured. Please set SONARQUBE_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch data from SonarQube API
    // Example:
    // const qualityGatesData = await sonarqubeRequest('/qualitygates/list')

    // For now, return empty array until SonarQube is configured
    const qualityGates: any[] = []

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
    // Check if SonarQube credentials are configured
    if (!sonarqubeConfig.token) {
      return res.status(200).json({
        success: true,
        data: { projects: [], issues: [], qualityGates: [] },
        message: "SonarQube token not configured. Please set SONARQUBE_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch all data from SonarQube API
    // For now, return empty data until SonarQube is configured
    const data = {
      projects: [],
      issues: [],
      qualityGates: [],
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    throw new AppError(`Error fetching SonarQube data: ${error.message}`, 500)
  }
})
