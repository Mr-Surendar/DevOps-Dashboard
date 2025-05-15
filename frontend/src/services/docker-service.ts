import api from "./api"

export async function getDockerData() {
  try {
    const response = await api.get("/docker/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Docker data:", error)
    throw error
  }
}

export async function getContainerLogs(containerId: string) {
  try {
    const response = await api.get(`/docker/logs/${containerId}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch container logs:", error)
    throw error
  }
}

export async function getContainerStats(containerId: string) {
  try {
    const response = await api.get(`/docker/stats/${containerId}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch container stats:", error)
    throw error
  }
}

export async function startContainer(containerId: string) {
  try {
    const response = await api.post(`/docker/start/${containerId}`)
    return response.data
  } catch (error) {
    console.error("Failed to start container:", error)
    throw error
  }
}

export async function stopContainer(containerId: string) {
  try {
    const response = await api.post(`/docker/stop/${containerId}`)
    return response.data
  } catch (error) {
    console.error("Failed to stop container:", error)
    throw error
  }
}
