import api from "./api"

export async function getSystemMetrics() {
  try {
    // Make a real API call to your metrics endpoint
    const response = await api.get("/metrics/system")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch system metrics:", error)
    // Return empty metrics structure instead of throwing
    return {
      cpu: { value: 0, trend: "stable", history: [] },
      memory: { value: 0, trend: "stable", history: [] },
      disk: { value: 0, trend: "stable", history: [] },
      temperature: { value: 0, trend: "stable", history: [] },
    }
  }
}

export async function getNetworkMetrics() {
  try {
    // Make a real API call to your network metrics endpoint
    const response = await api.get("/metrics/network")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch network metrics:", error)
    // Return empty metrics structure instead of throwing
    return {
      incoming: { value: 0, trend: "stable", history: [] },
      outgoing: { value: 0, trend: "stable", history: [] },
    }
  }
}
