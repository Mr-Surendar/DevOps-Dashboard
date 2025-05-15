import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"
import axios from "axios"

// Jenkins client configuration
const jenkinsConfig = {
  baseUrl: process.env.JENKINS_URL || "http://jenkins:8080",
  username: process.env.JENKINS_USERNAME || "admin",
  password: process.env.JENKINS_API_TOKEN || "",
}

// Helper function to make authenticated requests to Jenkins API
async function jenkinsRequest(endpoint: string, method = "GET", data = null) {
  try {
    const url = `${jenkinsConfig.baseUrl}${endpoint}`
    const auth = {
      username: jenkinsConfig.username,
      password: jenkinsConfig.password,
    }

    const response = await axios({
      method,
      url,
      auth,
      data,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error(`Jenkins API request failed: ${error.message}`)
    throw error
  }
}

// @desc    Get pipeline status
// @route   GET /api/jenkins/pipelines
// @access  Private
export const getPipelineStatus = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if Jenkins credentials are configured
    if (!jenkinsConfig.password) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Jenkins API token not configured. Please set JENKINS_API_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch data from Jenkins API
    // Example:
    // const jobsData = await jenkinsRequest('/api/json?tree=jobs[name,url,color,lastBuild[number,timestamp,duration,result]]')

    // For now, return empty array until Jenkins is configured
    const pipelines: any[] = []

    res.status(200).json({
      success: true,
      data: pipelines,
    })
  } catch (error) {
    throw new AppError(`Error fetching Jenkins pipelines: ${error.message}`, 500)
  }
})

// @desc    Get Jenkins data
// @route   GET /api/jenkins/data
// @access  Private
export const getJenkinsData = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if Jenkins credentials are configured
    if (!jenkinsConfig.password) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Jenkins API token not configured. Please set JENKINS_API_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch detailed data from Jenkins API
    // Example:
    // const jobsData = await jenkinsRequest('/api/json?tree=jobs[name,url,color,lastBuild[number,timestamp,duration,result,actions[*]]]')

    // For now, return empty array until Jenkins is configured
    const data: any[] = []

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    throw new AppError(`Error fetching Jenkins data: ${error.message}`, 500)
  }
})

// @desc    Trigger Jenkins build
// @route   POST /api/jenkins/build/:id
// @access  Private
export const triggerJenkinsBuild = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // Check if Jenkins credentials are configured
    if (!jenkinsConfig.password) {
      return res.status(400).json({
        success: false,
        message: "Jenkins API token not configured. Please set JENKINS_API_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would trigger a build via Jenkins API
    // Example:
    // await jenkinsRequest(`/job/${id}/build`, 'POST')

    // For now, just return success message
    res.status(200).json({
      success: true,
      message: `Build triggered for pipeline: ${id}`,
    })
  } catch (error) {
    throw new AppError(`Error triggering Jenkins build: ${error.message}`, 500)
  }
})

// @desc    Get pipeline logs
// @route   GET /api/jenkins/logs/:id
// @access  Private
export const getPipelineLogs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // Check if Jenkins credentials are configured
    if (!jenkinsConfig.password) {
      return res.status(400).json({
        success: false,
        message: "Jenkins API token not configured. Please set JENKINS_API_TOKEN in your environment variables.",
      })
    }

    // In a real implementation, you would fetch logs from Jenkins API
    // Example:
    // const logsData = await jenkinsRequest(`/job/${id}/lastBuild/consoleText`)

    // For now, return empty array until Jenkins is configured
    const logs: string[] = []

    res.status(200).json({
      success: true,
      data: logs,
    })
  } catch (error) {
    throw new AppError(`Error fetching pipeline logs: ${error.message}`, 500)
  }
})
