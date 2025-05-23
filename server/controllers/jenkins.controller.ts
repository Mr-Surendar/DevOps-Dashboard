import type { Request, Response } from "express"
import axios from "axios"
const jenkinsConfig = {
  url: process.env.JENKINS_URL || "http://localhost:8080", // Replace with your Jenkins URL
  username: process.env.JENKINS_USERNAME || "admin", // Replace with your username
  apiToken: process.env.JENKINS_API_TOKEN || "YOUR_JENKINS_API_TOKEN", // Replace with your token
}

export const getPipelineStatus = async (req: Request, res: Response) => {
  try {
    const jenkinsUrl = process.env.JENKINS_URL
    const username = process.env.JENKINS_USERNAME
    const apiToken = process.env.JENKINS_API_TOKEN

    // Fetch real Jenkins data
    const response = await axios.get(
      `${jenkinsUrl}/api/json?tree=jobs[name,lastBuild[number,result,duration,timestamp]]`,
      {
        auth: {
          username: username!,
          password: apiToken!,
        },
      },
    )

    const pipelines = response.data.jobs.map((job: any) => ({
      id: job.name,
      name: job.name,
      status: job.lastBuild?.result?.toLowerCase() || "pending",
      branch: "main", // You might need to fetch this separately
      duration: formatDuration(job.lastBuild?.duration || 0),
      timestamp: new Date(job.lastBuild?.timestamp || Date.now()).toISOString(),
    }))

    res.status(200).json({
      success: true,
      data: pipelines,
    })
  } catch (error) {
    console.error("Error fetching Jenkins data:", error)
    res.status(500).json({ success: false, error: "Failed to fetch Jenkins data" })
  }
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}
