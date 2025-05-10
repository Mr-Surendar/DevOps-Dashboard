import api from "./api"

export async function getPipelineStatus() {
  try {
    const response = await api.get("/jenkins/pipelines")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch pipeline status:", error)
    // Return mock data as fallback
    return [
      {
        id: "build-123",
        name: "main-build",
        status: "success",
        branch: "main",
        duration: "2m 34s",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: "deploy-45",
        name: "production-deploy",
        status: "running",
        branch: "main",
        duration: "1m 12s",
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
      {
        id: "test-67",
        name: "integration-tests",
        status: "failed",
        branch: "feature/auth",
        duration: "3m 45s",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "build-124",
        name: "feature-build",
        status: "pending",
        branch: "feature/dashboard",
        duration: "0s",
        timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
      },
    ]
  }
}

export async function getJenkinsData() {
  try {
    const response = await api.get("/jenkins/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Jenkins data:", error)
    // Return mock data as fallback
    return [
      {
        id: "build-123",
        name: "main-build",
        status: "success",
        branch: "main",
        duration: "2m 34s",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        stages: [
          { name: "Checkout", status: "success", duration: "5s" },
          { name: "Build", status: "success", duration: "1m 20s" },
          { name: "Test", status: "success", duration: "45s" },
          { name: "Deploy", status: "success", duration: "24s" },
        ],
      },
      {
        id: "deploy-45",
        name: "production-deploy",
        status: "running",
        branch: "main",
        duration: "1m 12s",
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        stages: [
          { name: "Checkout", status: "success", duration: "4s" },
          { name: "Build", status: "success", duration: "1m 5s" },
          { name: "Test", status: "running", duration: "3s" },
          { name: "Deploy", status: "pending", duration: "0s" },
        ],
      },
      {
        id: "test-67",
        name: "integration-tests",
        status: "failed",
        branch: "feature/auth",
        duration: "3m 45s",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        stages: [
          { name: "Checkout", status: "success", duration: "6s" },
          { name: "Build", status: "success", duration: "1m 30s" },
          { name: "Test", status: "failed", duration: "2m 9s" },
          { name: "Deploy", status: "aborted", duration: "0s" },
        ],
      },
    ]
  }
}

export async function triggerJenkinsBuild(pipelineId: string) {
  try {
    const response = await api.post(`/jenkins/build/${pipelineId}`)
    return response.data
  } catch (error) {
    console.error("Failed to trigger Jenkins build:", error)
    throw new Error("Failed to trigger build")
  }
}

export async function getPipelineLogs(pipelineId: string) {
  try {
    const response = await api.get(`/jenkins/logs/${pipelineId}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch pipeline logs:", error)
    return []
  }
}
