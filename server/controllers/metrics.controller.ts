import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// @desc    Get system metrics
// @route   GET /api/metrics/system
// @access  Private
export const getSystemMetrics = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get CPU usage
    const cpuCount = os.cpus().length
    const loadAvg = os.loadavg()[0] // 1 minute load average
    const cpuUsage = Math.min(Math.round((loadAvg / cpuCount) * 100), 100)

    // Get memory usage
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memoryUsage = Math.round((usedMem / totalMem) * 100)

    // Get disk usage (try to get actual data if possible)
    let diskUsage = 50 // Default value
    try {
      // This works on Linux/macOS
      const { stdout } = await execAsync("df -h / | awk 'NR==2 {print $5}' | sed 's/%//'")
      diskUsage = Number.parseInt(stdout.trim(), 10)
    } catch (error) {
      console.error("Failed to get disk usage:", error)
    }

    // Get temperature (try to get actual data if possible)
    let temperature = 45 // Default value
    try {
      // This works on Linux with lm-sensors
      const { stdout } = await execAsync(
        "sensors | grep 'CPU\\|Package' | awk '{print $4}' | sed 's/+//' | sed 's/°C//' | head -1",
      )
      if (stdout.trim()) {
        temperature = Number.parseFloat(stdout.trim())
      }
    } catch (error) {
      // Ignore error, use default value
    }

    // Generate trend based on previous value
    // In a real implementation, you would store previous values and compare
    const generateTrend = () => {
      return ["up", "down", "stable"][Math.floor(Math.random() * 3)]
    }

    // Generate history data
    // In a real implementation, you would store historical data
    const generateHistory = (value: number, variance = 10, length = 10) => {
      return Array.from({ length }, () => {
        const change = Math.floor(Math.random() * variance * 2) - variance
        return Math.max(0, Math.min(100, value + change))
      })
    }

    const metrics = {
      cpu: {
        value: cpuUsage,
        trend: generateTrend(),
        history: generateHistory(cpuUsage),
      },
      memory: {
        value: memoryUsage,
        trend: generateTrend(),
        history: generateHistory(memoryUsage),
      },
      disk: {
        value: diskUsage,
        trend: generateTrend(),
        history: generateHistory(diskUsage),
      },
      temperature: {
        value: temperature,
        trend: generateTrend(),
        history: generateHistory(temperature, 5),
      },
    }

    res.status(200).json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    throw new AppError(`Error fetching system metrics: ${error.message}`, 500)
  }
})

// @desc    Get network metrics
// @route   GET /api/metrics/network
// @access  Private
export const getNetworkMetrics = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would get actual network metrics
    // For now, we'll return simulated data

    // Generate random values for incoming and outgoing traffic
    const incomingValue = Math.floor(Math.random() * 100) + 1
    const outgoingValue = Math.floor(Math.random() * 100) + 1

    // Generate trend based on previous value
    // In a real implementation, you would store previous values and compare
    const generateTrend = () => {
      return ["up", "down", "stable"][Math.floor(Math.random() * 3)]
    }

    // Generate history data
    // In a real implementation, you would store historical data
    const generateHistory = (value: number, variance = 20, length = 10) => {
      return Array.from({ length }, () => {
        const change = Math.floor(Math.random() * variance * 2) - variance
        return Math.max(0, value + change)
      })
    }

    const metrics = {
      incoming: {
        value: incomingValue,
        trend: generateTrend(),
        history: generateHistory(incomingValue),
      },
      outgoing: {
        value: outgoingValue,
        trend: generateTrend(),
        history: generateHistory(outgoingValue),
      },
    }

    res.status(200).json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    throw new AppError(`Error fetching network metrics: ${error.message}`, 500)
  }
})
