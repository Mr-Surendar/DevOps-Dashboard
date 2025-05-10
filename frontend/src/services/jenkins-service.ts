type Pipeline = {
  id: string
  name: string
  status: "success" | "running" | "failed" | "pending"
  branch: string
  duration: string
  timestamp: string
  realTimeData?: {
    progress: number
    logs: string[]
    startTime: string
    estimatedEndTime: string
    metrics: {
      testsPassed: number
      testsFailed: number
      testsSkipped: number
      codeCoverage: number
    }
  }
}

// Enhanced Jenkins service with real-time data
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
          realTimeData: {
            progress: Math.floor(Math.random() * 100),
            logs: [
              "[INFO] Building project...",
              "[INFO] Running tests...",
              "[INFO] 42 tests executed",
              "[INFO] Code coverage: 87%",
              Math.random() > 0.8 ? "[ERROR] Test failures detected" : "[INFO] All tests passed",
            ],
            startTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            estimatedEndTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
            metrics: {
              testsPassed: Math.floor(Math.random() * 40) + 10,
              testsFailed: Math.floor(Math.random() * 5),
              testsSkipped: Math.floor(Math.random() * 3),
              codeCoverage: Math.floor(Math.random() * 20) + 80,
            },
          },
        },
        {
          id: "deploy-" + Math.floor(Math.random() * 100),
          name: "production-deploy",
          status: Math.random() > 0.7 ? "pending" : Math.random() > 0.5 ? "running" : "success",
          branch: "main",
          duration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)).toISOString(),
          realTimeData: {
            progress: Math.floor(Math.random() * 100),
            logs: [
              "[INFO] Preparing deployment...",
              "[INFO] Validating configuration...",
              "[INFO] Deploying to production servers...",
              "[INFO] Running smoke tests...",
              Math.random() > 0.9 ? "[ERROR] Deployment failed" : "[INFO] Deployment successful",
            ],
            startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            estimatedEndTime: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
            metrics: {
              testsPassed: Math.floor(Math.random() * 10) + 5,
              testsFailed: Math.floor(Math.random() * 2),
              testsSkipped: Math.floor(Math.random() * 2),
              codeCoverage: Math.floor(Math.random() * 10) + 90,
            },
          },
        },
        {
          id: "test-" + Math.floor(Math.random() * 100),
          name: "integration-tests",
          status: Math.random() > 0.7 ? "failed" : "success",
          branch: "feature/auth",
          duration: `${Math.floor(Math.random() * 4) + 2}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 120)).toISOString(),
          realTimeData: {
            progress: 100,
            logs: [
              "[INFO] Running integration tests...",
              "[INFO] Testing API endpoints...",
              "[INFO] Testing database interactions...",
              "[INFO] Testing authentication flows...",
              Math.random() > 0.7
                ? "[ERROR] Test failures in authentication module"
                : "[INFO] All integration tests passed",
            ],
            startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            estimatedEndTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            metrics: {
              testsPassed: Math.floor(Math.random() * 30) + 20,
              testsFailed: Math.floor(Math.random() * 8),
              testsSkipped: Math.floor(Math.random() * 5),
              codeCoverage: Math.floor(Math.random() * 15) + 75,
            },
          },
        },
        {
          id: "build-" + Math.floor(Math.random() * 1000),
          name: "feature-build",
          status: Math.random() > 0.6 ? "pending" : "success",
          branch: "feature/dashboard",
          duration: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 20)).toISOString(),
          realTimeData: {
            progress: Math.random() > 0.6 ? 0 : 100,
            logs: ["[INFO] Waiting in queue...", "[INFO] Preparing build environment..."],
            startTime: new Date(Date.now()).toISOString(),
            estimatedEndTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
            metrics: {
              testsPassed: 0,
              testsFailed: 0,
              testsSkipped: 0,
              codeCoverage: 0,
            },
          },
        },
      ])
    }, 500)
  })
}

// Enhanced Jenkins data with real-time information
export async function getJenkinsData(): Promise<any> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Generate random pipeline data with real-time information
      const generatePipeline = (id: string, name: string, branch: string) => {
        const statuses = ["success", "running", "failed", "pending", "aborted"]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const progress =
          status === "running"
            ? Math.floor(Math.random() * 100)
            : status === "success" || status === "failed" || status === "aborted"
              ? 100
              : 0

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
            logs: [
              `[INFO] Starting ${["Checkout", "Build", "Test", "Deploy", "Publish"][i % 5]} stage...`,
              `[INFO] Running ${["git clone", "mvn package", "npm test", "kubectl apply", "docker push"][i % 5]}...`,
              stageStatus === "failed"
                ? `[ERROR] ${["Checkout", "Build", "Test", "Deploy", "Publish"][i % 5]} failed`
                : `[INFO] ${["Checkout", "Build", "Test", "Deploy", "Publish"][i % 5]} completed successfully`,
            ],
            metrics: {
              duration: Math.floor(Math.random() * 120) + 10,
              cpuUsage: Math.floor(Math.random() * 80) + 20,
              memoryUsage: Math.floor(Math.random() * 512) + 128,
            },
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
          realTimeData: {
            progress,
            startTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            estimatedEndTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
            logs: [
              "[INFO] Pipeline started",
              "[INFO] Checking out code from repository",
              "[INFO] Building project",
              status === "failed" ? "[ERROR] Build failed" : "[INFO] Build successful",
              status === "running" ? "[INFO] Running tests..." : status === "success" ? "[INFO] Tests passed" : "",
            ],
            metrics: {
              testsPassed: Math.floor(Math.random() * 50) + 10,
              testsFailed: status === "failed" ? Math.floor(Math.random() * 10) + 1 : 0,
              testsSkipped: Math.floor(Math.random() * 5),
              codeCoverage: Math.floor(Math.random() * 20) + 80,
            },
          },
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

// New function to get real-time pipeline logs
export async function getPipelineLogs(pipelineId: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        `[${new Date().toISOString()}] Pipeline ${pipelineId} started`,
        `[${new Date().toISOString()}] Checking out code from repository`,
        `[${new Date().toISOString()}] Running build step`,
        `[${new Date().toISOString()}] Compiling code`,
        `[${new Date().toISOString()}] Running unit tests`,
        Math.random() > 0.8
          ? `[${new Date().toISOString()}] ERROR: Test failures detected`
          : `[${new Date().toISOString()}] All tests passed successfully`,
        `[${new Date().toISOString()}] Building artifacts`,
        `[${new Date().toISOString()}] Pipeline completed`,
      ])
    }, 500)
  })
}
