const jenkinsService = require("../services/jenkinsService")
const githubService = require("../services/githubService")
const dockerService = require("../services/dockerService")
const kubernetesService = require("../services/kubernetesService")
const terraformService = require("../services/terraformService")

/**
 * Get status of all DevOps tools
 */
exports.getToolsStatus = async (req, res) => {
  try {
    // Get status from all services
    const [jenkins, github, docker, kubernetes, terraform] = await Promise.allSettled([
      jenkinsService.getStatus(),
      githubService.getStatus(),
      dockerService.getStatus(),
      kubernetesService.getStatus(),
      terraformService.getStatus(),
    ])

    // Combine all statuses
    const toolsStatus = {
      jenkins: jenkins.status === "fulfilled" ? jenkins.value : createErrorStatus("Jenkins service unavailable"),
      github: github.status === "fulfilled" ? github.value : createErrorStatus("GitHub service unavailable"),
      docker: docker.status === "fulfilled" ? docker.value : createErrorStatus("Docker service unavailable"),
      kubernetes:
        kubernetes.status === "fulfilled" ? kubernetes.value : createErrorStatus("Kubernetes service unavailable"),
      terraform:
        terraform.status === "fulfilled" ? terraform.value : createErrorStatus("Terraform service unavailable"),
    }

    res.json(toolsStatus)
  } catch (error) {
    console.error("Error getting tools status:", error)
    res.status(500).json({ error: "Failed to get tools status" })
  }
}

/**
 * Get alerts from all DevOps tools
 */
exports.getDevOpsAlerts = async (req, res) => {
  try {
    // Get alerts from all services
    const [jenkinsAlerts, githubAlerts, dockerAlerts, kubernetesAlerts, terraformAlerts] = await Promise.allSettled([
      jenkinsService.getAlerts(),
      githubService.getAlerts(),
      dockerService.getAlerts(),
      kubernetesService.getAlerts(),
      terraformService.getAlerts(),
    ])

    // Combine all alerts
    const alerts = [
      ...(jenkinsAlerts.status === "fulfilled" ? jenkinsAlerts.value : []),
      ...(githubAlerts.status === "fulfilled" ? githubAlerts.value : []),
      ...(dockerAlerts.status === "fulfilled" ? dockerAlerts.value : []),
      ...(kubernetesAlerts.status === "fulfilled" ? kubernetesAlerts.value : []),
      ...(terraformAlerts.status === "fulfilled" ? terraformAlerts.value : []),
    ]

    // Sort alerts by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json(alerts)
  } catch (error) {
    console.error("Error getting DevOps alerts:", error)
    res.status(500).json({ error: "Failed to get DevOps alerts" })
  }
}

/**
 * Get overall system health
 */
exports.getSystemHealth = async (req, res) => {
  try {
    // Get status from all services
    const [jenkins, github, docker, kubernetes, terraform] = await Promise.allSettled([
      jenkinsService.getStatus(),
      githubService.getStatus(),
      dockerService.getStatus(),
      kubernetesService.getStatus(),
      terraformService.getStatus(),
    ])

    // Calculate overall health
    const services = [
      jenkins.status === "fulfilled" ? jenkins.value : { status: "error" },
      github.status === "fulfilled" ? github.value : { status: "error" },
      docker.status === "fulfilled" ? docker.value : { status: "error" },
      kubernetes.status === "fulfilled" ? kubernetes.value : { status: "error" },
      terraform.status === "fulfilled" ? terraform.value : { status: "error" },
    ]

    const errorCount = services.filter((s) => s.status === "error").length
    const warningCount = services.filter((s) => s.status === "warning").length

    let overallStatus
    if (errorCount > 0) {
      overallStatus = "error"
    } else if (warningCount > 0) {
      overallStatus = "warning"
    } else {
      overallStatus = "healthy"
    }

    res.json({
      status: overallStatus,
      services: {
        total: services.length,
        healthy: services.length - errorCount - warningCount,
        warning: warningCount,
        error: errorCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting system health:", error)
    res.status(500).json({ error: "Failed to get system health" })
  }
}

/**
 * Helper function to create error status object
 */
function createErrorStatus(message) {
  return {
    status: "error",
    message: message,
    lastUpdated: new Date().toISOString(),
    metrics: {
      error: "Service unavailable",
    },
  }
}
