import api from "./api"

export async function getSystemMetrics() {
  try {
    const response = await api.get("/metrics/system")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch system metrics:", error)
    // Return mock data as fallback
    return {
      cpu: {
        value: Math.floor(Math.random() * 80) + 10,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10),
      },
      memory: {
        value: Math.floor(Math.random() * 65) + 20,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 65) + 20),
      },
      disk: {
        value: Math.floor(Math.random() * 65) + 30,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 65) + 30),
      },
      temperature: {
        value: Math.floor(Math.random() * 40) + 40,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 40) + 40),
      },
    }
  }
}

export async function getNetworkMetrics() {
  try {
    const response = await api.get("/metrics/network")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch network metrics:", error)
    // Return mock data as fallback
    return {
      incoming: {
        value: Math.floor(Math.random() * 100) + 1,
        trend: "up",
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1),
      },
      outgoing: {
        value: Math.floor(Math.random() * 100) + 1,
        trend: "down",
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1),
      },
    }
  }
}
