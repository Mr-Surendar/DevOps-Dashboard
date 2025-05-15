import api from "./api"

type ToolStatus = {
  status: "healthy" | "warning" | "error"
  message: string
  lastUpdated: string
  metrics: {
    [key: string]: number | string
  }
}

type DevOpsToolsData = {
  jenkins: ToolStatus
  github: ToolStatus
  docker: ToolStatus
  kubernetes: ToolStatus
  terraform: ToolStatus
}

export async function getToolsStatus(): Promise<DevOpsToolsData> {
  try {
    const response = await api.get("/devops/tools-status")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch DevOps tools status:", error)
    throw error
  }
}

export async function getDevOpsAlerts(): Promise<any[]> {
  try {
    const response = await api.get("/devops/alerts")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch DevOps alerts:", error)
    throw error
  }
}
