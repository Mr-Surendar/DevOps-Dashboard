const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/authRoutes")
const metricsRoutes = require("./routes/metricsRoutes")
const jenkinsRoutes = require("./routes/jenkinsRoutes")
const githubRoutes = require("./routes/githubRoutes")
const dockerRoutes = require("./routes/dockerRoutes")
const kubernetesRoutes = require("./routes/kubernetesRoutes")
const terraformRoutes = require("./routes/terraformRoutes")
const devopsRoutes = require("./routes/devopsRoutes")
const deploymentRoutes = require("./routes/deploymentRoutes")

// Import middleware
const { authenticateToken } = require("./middleware/authMiddleware")

// Create Express app
const app = express()

// Set up middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies
app.use(morgan("dev")) // HTTP request logging

// Define routes
app.use("/api/auth", authRoutes)
app.use("/api/metrics", metricsRoutes)
app.use("/api/jenkins", jenkinsRoutes)
app.use("/api/github", githubRoutes)
app.use("/api/docker", dockerRoutes)
app.use("/api/kubernetes", kubernetesRoutes)
app.use("/api/terraform", terraformRoutes)
app.use("/api/devops", devopsRoutes)
app.use("/api/deployments", deploymentRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app // Export for testing
