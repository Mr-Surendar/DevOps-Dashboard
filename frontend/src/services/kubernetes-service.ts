import api from "./api"

export async function getKubernetesData() {
  try {
    const response = await api.get("/kubernetes/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Kubernetes data:", error)
    throw error
  }
}

export async function getPods() {
  try {
    const response = await api.get("/kubernetes/pods")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Kubernetes pods:", error)
    throw error
  }
}

export async function getDeployments() {
  try {
    const response = await api.get("/kubernetes/deployments")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Kubernetes deployments:", error)
    throw error
  }
}

export async function getNodes() {
  try {
    const response = await api.get("/kubernetes/nodes")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Kubernetes nodes:", error)
    throw error
  }
}
