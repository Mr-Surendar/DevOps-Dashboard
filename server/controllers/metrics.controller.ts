import AWS from "aws-sdk"
import type { Request, Response } from "express"
export const AWS_CONFIG = {
  region: "us-west-2", // Replace with your actual region
  accessKeyId: "YOUR_AWS_ACCESS_KEY_ID", // Replace with your actual key
  secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY", // Replace with your actual secret
  cloudWatchEndpoint: "https://monitoring.us-west-2.amazonaws.com", // Update region if needed
}

export const PROMETHEUS_CONFIG = {
  url: "http://prometheus:9090", // Replace with your actual Prometheus URL
  username: "admin", // Replace if you have authentication
  password: "admin", // Replace if you have authentication
}

export const GRAFANA_CONFIG = {
  url: "http://grafana:3000", // Replace with your actual Grafana URL
  apiKey: "YOUR_GRAFANA_API_KEY", // Replace with your actual API key
}

// Configure AWS
const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export const getSystemMetrics = async (req: Request, res: Response) => {
  try {
    // Fetch real CPU metrics from AWS CloudWatch
    const cpuParams = {
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      StartTime: new Date(Date.now() - 3600000), // 1 hour ago
      EndTime: new Date(),
      Period: 300,
      Statistics: ["Average"],
      Dimensions: [
        {
          Name: "InstanceId",
          Value: "YOUR_INSTANCE_ID", // Replace with your actual instance ID
        },
      ],
    }

    const cpuData = await cloudwatch.getMetricStatistics(cpuParams).promise()
    const latestCpuValue = cpuData.Datapoints?.[cpuData.Datapoints.length - 1]?.Average || 0

    // Fetch memory metrics (you'll need CloudWatch agent installed)
    const memoryParams = {
      MetricName: "MemoryUtilization",
      Namespace: "CWAgent",
      StartTime: new Date(Date.now() - 3600000),
      EndTime: new Date(),
      Period: 300,
      Statistics: ["Average"],
    }

    const memoryData = await cloudwatch.getMetricStatistics(memoryParams).promise()
    const latestMemoryValue = memoryData.Datapoints?.[memoryData.Datapoints.length - 1]?.Average || 0

    // Return real data
    res.status(200).json({
      success: true,
      data: {
        cpu: {
          value: Math.round(latestCpuValue),
          trend: "stable", // You can calculate trend from historical data
          history: cpuData.Datapoints?.map((d) => d.Average) || [],
        },
        memory: {
          value: Math.round(latestMemoryValue),
          trend: "stable",
          history: memoryData.Datapoints?.map((d) => d.Average) || [],
        },
        // Add disk and temperature metrics similarly
      },
    })
  } catch (error) {
    console.error("Error fetching system metrics:", error)
    res.status(500).json({ success: false, error: "Failed to fetch metrics" })
  }
}
