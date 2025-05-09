// Mock Jenkins service

type Pipeline = {
  id: string
  name: string
  status: "success" | "running" | "failed" | "pending"
  branch: string
  duration: string
  timestamp: string
}

export async function getPipelineStatus(): Promise<Pipeline[]> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve([
        {
          id: "build-" + Math.floor(Math.random() * 1000),
          name: "main-build",
          status: Math.random() > 0.8 ? "failed" : Math.random() > 0.6 ? "running" : "success",
          branch: "main",
          duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
        },
        {
          id: "deploy-" + Math.floor(Math.random() * 100),
          name: "production-deploy",
          status: Math.random() > 0.7 ? "pending" : Math.random() > 0.5 ? "running" : "success",
          branch: "main",
          duration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)).toISOString(),
        },
        {
          id: "test-" + Math.floor(Math.random() * 100),
          name: "integration-tests",
          status: Math.random() > 0.7 ? "failed" : "success",
          branch: "feature/auth",
          duration: `${Math.floor(Math.random() * 4) + 2}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 120)).toISOString(),
        },
        {
          id: "build-" + Math.floor(Math.random() * 1000),
          name: "feature-build",
          status: Math.random() > 0.6 ? "pending" : "success",
          branch: "feature/dashboard",
          duration: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 20)).toISOString(),
        },
      ])
    }, 500)
  })
}

export async function getJenkinsData(): Promise<any> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Generate random pipeline data
      const generatePipeline = (id: string, name: string, branch: string) => {
        const statuses = ["success", "running", "failed", "pending", "aborted"]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        const stages = []
        const stageCount = Math.floor(Math.random() * 3) + 3

        for (let i = 0; i < stageCount; i++) {
          let stageStatus

          if (i === 0) {
            stageStatus = "success" // First stage is always successful
          } else if (i < stageCount - 1) {
            if (status === "running") {
              stageStatus =
                i < Math.floor(stageCount / 2) ? "success" : i === Math.floor(stageCount / 2) ? "running" : "pending"
            } else if (status === "failed") {
              stageStatus = i < Math.floor(stageCount / 2) ? "success" : "failed"
            } else if (status === "aborted") {
              stageStatus = i < Math.floor(stageCount / 2) ? "success" : "aborted"
            } else {
              stageStatus = status
            }
          } else {
            stageStatus = status
          }

          stages.push({
            name: ["Checkout", "Build", "Test", "Deploy", "Publish"][i % 5],
            status: stageStatus,
            duration: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`,
          })
        }

        return {
          id,
          name,
          status,
          branch,
          duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
          stages,
        }
      }

      resolve([
        generatePipeline("build-123", "main-build", "main"),
        generatePipeline("deploy-45", "production-deploy", "main"),
        generatePipeline("test-67", "integration-tests", "feature/auth"),
      ])
    }, 700)
  })
}

export async function triggerJenkinsBuild(pipelineId: string): Promise<void> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Triggered build for pipeline: ${pipelineId}`)
      resolve()
    }, 1000)
  })
}
