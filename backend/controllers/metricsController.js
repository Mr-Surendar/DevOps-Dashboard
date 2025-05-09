const os = require("os")
const diskusage = require("diskusage")
const { exec } = require("child_process")
const util = require("util")
const execPromise = util.promisify(exec)

// Store historical metrics
const metricsHistory = {
  cpu: [],
  memory: [],
  disk: [],
  temperature: [],
  network: {
    incoming: [],
    outgoing: [],
  },
}

// Maximum history length
const MAX_HISTORY_LENGTH = 100

/**
 * Get system metrics (CPU, memory, disk, temperature)
 */
exports.getSystemMetrics = async (req, res) => {
  try {
    // Get CPU usage
    const cpuUsage = await getCpuUsage()

    // Get memory usage
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const memoryUsage = Math.round(((totalMem - freeMem) / totalMem) * 100)

    // Get disk usage
    const path = os.platform() === "win32" ? "c:" : "/"
    const disk = await diskusage.check(path)
    const diskUsage = Math.round(((disk.total - disk.available) / disk.total) * 100)

    // Get temperature (this is platform-specific and may not work on all systems)
    const temperature = await getTemperature()

    // Determine trends
    const cpuTrend = determineTrend(metricsHistory.cpu, cpuUsage)
    const memoryTrend = determineTrend(metricsHistory.memory, memoryUsage)
    const diskTrend = determineTrend(metricsHistory.disk, diskUsage)
    const temperatureTrend = determineTrend(metricsHistory.temperature, temperature)

    // Update history
    updateHistory(metricsHistory.cpu, cpuUsage)
    updateHistory(metricsHistory.memory, memoryUsage)
    updateHistory(metricsHistory.disk, diskUsage)
    updateHistory(metricsHistory.temperature, temperature)

    const metrics = {
      cpu: {
        value: cpuUsage,
        trend: cpuTrend,
        history: metricsHistory.cpu,
      },
      memory: {
        value: memoryUsage,
        trend: memoryTrend,
        history: metricsHistory.memory,
      },
      disk: {
        value: diskUsage,
        trend: diskTrend,
        history: metricsHistory.disk,
      },
      temperature: {
        value: temperature,
        trend: temperatureTrend,
        history: metricsHistory.temperature,
      },
    }

    res.json(metrics)
  } catch (error) {
    console.error("Error getting system metrics:", error)
    res.status(500).json({ error: "Failed to get system metrics" })
  }
}

/**
 * Get network metrics
 */
exports.getNetworkMetrics = async (req, res) => {
  try {
    // Get network usage (this is platform-specific)
    const networkUsage = await getNetworkUsage()

    // Determine trends
    const incomingTrend = determineTrend(metricsHistory.network.incoming, networkUsage.incoming)
    const outgoingTrend = determineTrend(metricsHistory.network.outgoing, networkUsage.outgoing)

    // Update history
    updateHistory(metricsHistory.network.incoming, networkUsage.incoming)
    updateHistory(metricsHistory.network.outgoing, networkUsage.outgoing)

    const metrics = {
      incoming: {
        value: networkUsage.incoming,
        trend: incomingTrend,
        history: metricsHistory.network.incoming,
      },
      outgoing: {
        value: networkUsage.outgoing,
        trend: outgoingTrend,
        history: metricsHistory.network.outgoing,
      },
    }

    res.json(metrics)
  } catch (error) {
    console.error("Error getting network metrics:", error)
    res.status(500).json({ error: "Failed to get network metrics" })
  }
}

/**
 * Get historical metrics for a specific metric
 */
exports.getMetricHistory = async (req, res) => {
  try {
    const { metric } = req.params

    if (!metricsHistory[metric]) {
      return res.status(404).json({ error: `Metric '${metric}' not found` })
    }

    res.json({
      metric,
      history: metricsHistory[metric],
    })
  } catch (error) {
    console.error(`Error getting ${req.params.metric} history:`, error)
    res.status(500).json({ error: `Failed to get ${req.params.metric} history` })
  }
}

/**
 * Helper function to get CPU usage
 */
async function getCpuUsage() {
  return new Promise((resolve) => {
    const cpus = os.cpus()

    // Calculate CPU usage based on the average of all cores
    let totalIdle = 0
    let totalTick = 0

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type]
      }
      totalIdle += cpu.times.idle
    }

    // Wait a bit to get a more accurate reading
    setTimeout(() => {
      const cpusAfter = os.cpus()
      let totalIdleAfter = 0
      let totalTickAfter = 0

      for (const cpu of cpusAfter) {
        for (const type in cpu.times) {
          totalTickAfter += cpu.times[type]
        }
        totalIdleAfter += cpu.times.idle
      }

      const idleDifference = totalIdleAfter - totalIdle
      const tickDifference = totalTickAfter - totalTick

      const cpuUsage = Math.round(100 - (idleDifference / tickDifference) * 100)
      resolve(cpuUsage)
    }, 100)
  })
}

/**
 * Helper function to get temperature
 * Note: This is platform-specific and may not work on all systems
 */
async function getTemperature() {
  try {
    if (os.platform() === "linux") {
      // Try to get temperature on Linux
      const { stdout } = await execPromise("cat /sys/class/thermal/thermal_zone0/temp")
      return Math.round(Number.parseInt(stdout) / 1000)
    } else if (os.platform() === "darwin") {
      // Try to get temperature on macOS
      const { stdout } = await execPromise("sudo powermetrics --samplers smc -n 1")
      const match = stdout.match(/CPU die temperature: (\d+\.\d+) C/)
      return match ? Math.round(Number.parseFloat(match[1])) : 50
    } else {
      // Default temperature for other platforms
      return 50
    }
  } catch (error) {
    console.error("Error getting temperature:", error)
    return 50 // Default value
  }
}

/**
 * Helper function to get network usage
 * Note: This is platform-specific and may not work on all systems
 */
async function getNetworkUsage() {
  try {
    // This is a simplified implementation
    // In a real application, you would need to track network usage over time
    return {
      incoming: Math.floor(Math.random() * 100) + 1,
      outgoing: Math.floor(Math.random() * 100) + 1,
    }
  } catch (error) {
    console.error("Error getting network usage:", error)
    return {
      incoming: 0,
      outgoing: 0,
    }
  }
}

/**
 * Helper function to determine trend
 */
function determineTrend(history, currentValue) {
  if (history.length < 2) {
    return "stable"
  }

  const previousValue = history[history.length - 1]
  const difference = currentValue - previousValue

  if (difference > 5) {
    return "up"
  } else if (difference < -5) {
    return "down"
  } else {
    return "stable"
  }
}

/**
 * Helper function to update history
 */
function updateHistory(history, value) {
  history.push(value)

  if (history.length > MAX_HISTORY_LENGTH) {
    history.shift()
  }
}
