import api from "./api"

export async function getSystemMetrics() {
  try {
    // Make a real API call to your metrics endpoint
    const response = await api.get("/metrics/system")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch system metrics:", error)
    throw error
  }
}

export async function getNetworkMetrics() {
  try {
    // Make a real API call to your network metrics endpoint
    const response = await api.get("/metrics/network")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch network metrics:", error)
    throw error
  }
}
