import api from "./api"

export async function getPipelineStatus() {
  try {
    const response = await api.get("/jenkins/pipelines")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch pipeline status:", error)
    throw error
  }
}

export async function getJenkinsData() {
  try {
    const response = await api.get("/jenkins/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Jenkins data:", error)
    throw error
  }
}

export async function triggerJenkinsBuild(pipelineId: string) {
  try {
    const response = await api.post(`/jenkins/build/${pipelineId}`)
    return response.data
  } catch (error) {
    console.error("Failed to trigger Jenkins build:", error)
    throw error
  }
}

export async function getPipelineLogs(pipelineId: string) {
  try {
    const response = await api.get(`/jenkins/logs/${pipelineId}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch pipeline logs:", error)
    throw error
  }
}
