// Mock metrics service

type Metric = {
  value: number
  trend: "up" | "down" | "stable"
  history: number[]
}

type SystemMetricsData = {
  cpu: Metric
  memory: Metric
  disk: Metric
  temperature: Metric
}

export async function getSystemMetrics(): Promise<SystemMetricsData> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Generate random metrics for demo purposes
      const generateMetric = (min: number, max: number): Metric => {
        const value = Math.floor(Math.random() * (max - min + 1)) + min
        const prevValue = Math.floor(Math.random() * (max - min + 1)) + min

        let trend: "up" | "down" | "stable"
        if (value > prevValue + 5) {
          trend = "up"
        } else if (value < prevValue - 5) {
          trend = "down"
        } else {
          trend = "stable"
        }

        // Generate random history data
        const history = Array.from({ length: 10 }, () => Math.floor(Math.random() * (max - min + 1)) + min)

        return { value, trend, history }
      }

      resolve({
        cpu: generateMetric(10, 90),
        memory: generateMetric(20, 85),
        disk: generateMetric(30, 95),
        temperature: generateMetric(40, 80),
      })
    }, 500)
  })
}

export async function getNetworkMetrics(): Promise<any> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
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
      })
    }, 500)
  })
}
