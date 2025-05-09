const axios = require("axios")
const config = require("../config")

/**
 * Get Jenkins status
 */
exports.getStatus = async () => {
  try {
    // In a real application, you would make API calls to Jenkins
    // For now, we'll return mock data
    return {
      status: Math.random() > 0.8 ? "warning" : "healthy",
      message: "All pipelines running normally",
      lastUpdated: new Date().toISOString(),
      metrics: {
        pipelines: 12,
        running: Math.floor(Math.random() * 3) + 1,
        success: 8,
        failed: Math.floor(Math.random() * 3),
      },
    }
  } catch (error) {
    console.error("Error getting Jenkins status:", error)
    throw error
  }
}

/**
 * Get Jenkins alerts
 */
exports.getAlerts = async () => {
  try {
    // In a real application, you would make API calls to Jenkins
    // For now, we'll return mock data
    return [
      {
        id: "alert-" + Math.random().toString(36).substring(7),
        tool: "jenkins",
        severity: "medium",
        message: "Pipeline build-123 failed on test stage",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]
  } catch (error) {
    console.error("Error getting Jenkins alerts:", error)
    throw error
  }
}

/**
 * Get pipeline status
 */
exports.getPipelineStatus = async () => {
  try {
    // In a real application, you would make API calls to Jenkins
    // For now, we'll return mock data
    return [
      {
        id: "build-" + Math.floor(Math.random() * 1000),
        name: "main-build",
        status: Math.random() > 0.8 ? "failed" : Math.random() > 0.6 ? "running" : "success",
        branch: "main",
        duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
        timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
      },
      {
        id: "deploy-" + Math.floor(Math.random() * 100),
        name: "production-deploy",
        status: Math.random() > 0.7 ? "pending" : Math.random() > 0.5 ? "running" : "success",
        branch: "main",
        duration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
        timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)).toISOString(),
      },
      {
        id: "test-" + Math.floor(Math.random() * 100),
        name: "integration-tests",
        status: Math.random() > 0.7 ? "failed" : "success",
        branch: "feature/auth",
        duration: `${Math.floor(Math.random() * 4) + 2}m ${Math.floor(Math.random() * 60)}s`,
        timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 120)).toISOString(),
      },
    ]
  } catch (error) {
    console.error("Error getting pipeline status:", error)
    throw error
  }
}

/**
 * Get Jenkins data
 */
exports.getJenkinsData = async () => {
  try {
    // In a real application, you would make API calls to Jenkins
    // For now, we'll return mock data
    return [
      generatePipeline("build-123", "main-build", "main"),
      generatePipeline("deploy-45", "production-deploy", "main"),
      generatePipeline("test-67", "integration-tests", "feature/auth"),
    ]
  } catch (error) {
    console.error("Error getting Jenkins data:", error)
    throw error
  }
}

/**
 * Trigger Jenkins build
 */
exports.triggerJenkinsBuild = async (pipelineId) => {
  try {
    // In a real application, you would make API calls to Jenkins
    // For now, we'll just log the action
    console.log(`Triggered build for pipeline: ${pipelineId}`)
    return { success: true, message: `Build triggered for pipeline: ${pipelineId}` }
  } catch (error) {
    console.error(`Error triggering build for pipeline ${pipelineId}:`, error)
    throw error
  }
}

/**
 * Helper function to generate pipeline data
 */
function generatePipeline(id, name, branch) {
  const statuses = ["success", "running", "failed", "pending", "aborted"]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  const stages = []
  const stageCount = Math.floor(Math.random() * 3) + 3

  for (let i = 0; i < stageCount; i++) {
    let stageStatus

    if (i === 0) {
      stageStatus = "success" // First stage is always successful
    } else if (i < stageCount - 1) {
      if (status === "running") {
        stageStatus =
          i < Math.floor(stageCount / 2) ? "success" : i === Math.floor(stageCount / 2) ? "running" : "pending"
      } else if (status === "failed") {
        stageStatus = i < Math.floor(stageCount / 2) ? "success" : "failed"
      } else if (status === "aborted") {
        stageStatus = i < Math.floor(stageCount / 2) ? "success" : "aborted"
      } else {
        stageStatus = status
      }
    } else {
      stageStatus = status
    }

    stages.push({
      name: ["Checkout", "Build", "Test", "Deploy", "Publish"][i % 5],
      status: stageStatus,
      duration: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`,
    })
  }

  return {
    id,
    name,
    status,
    branch,
    duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
    timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
    stages,
  }
}
