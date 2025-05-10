import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"
import os from "os"

// @desc    Get system metrics
// @route   GET /api/metrics/system
// @access  Private
export const getSystemMetrics = asyncHandler(async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would use system monitoring libraries
    // to get accurate metrics

    // For demonstration, we'll use Node.js os module for some metrics
    // and generate random data for others

    // CPU usage
    const cpuCount = os.cpus().length
    const loadAvg = os.loadavg()[0] // 1 minute load average
    const cpuUsage = Math.min(Math.round((loadAvg / cpuCount) * 100), 100)

    // Memory usage
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memoryUsage = Math.round((usedMem / totalMem) * 100)

    // Disk usage (mock data)
    const diskUsage = Math.floor(Math.random() * 30) + 50 // 50-80%

    // Temperature (mock data)
    const temperature = Math.floor(Math.random() * 20) + 40 // 40-60°C

    // Generate trend based on previous value (mock)
    const generateTrend = (value: number) => {
      const prevValue = value + (Math.random() > 0.5 ? 5 : -5)
      if (value > prevValue + 5) {
        return "up"
      } else if (value < prevValue - 5) {
        return "down"
      } else {
        return "stable"
      }
    }

    // Generate random history data
    const generateHistory = (min: number, max: number, length = 10) => {
      return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
    }

    const metrics = {
      cpu: {
        value: cpuUsage,
        trend: generateTrend(cpuUsage),
        history: generateHistory(10, 90),
      },
      memory: {
        value: memoryUsage,
        trend: generateTrend(memoryUsage),
        history: generateHistory(20, 85),
      },
      disk: {
        value: diskUsage,
        trend: generateTrend(diskUsage),
        history: generateHistory(30, 95),
      },
      temperature: {
        value: temperature,
        trend: generateTrend(temperature),
        history: generateHistory(40, 80),
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
    // In a real implementation, you would use network monitoring libraries
    // to get accurate metrics

    // For demonstration, we'll return mock data
    // In production, replace this with actual network metrics
    const metrics = {
      incoming: {
        value: Math.floor(Math.random() * 100) + 1,
        trend: Math.random() > 0.5 ? "up" : "down",
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1),
      },
      outgoing: {
        value: Math.floor(Math.random() * 100) + 1,
        trend: Math.random() > 0.5 ? "up" : "down",
        history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1),
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
