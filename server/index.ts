const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const { connectDB } = require("./config/database")
const authRoutes = require("./routes/auth.routes")
const jenkinsRoutes = require("./routes/jenkins.routes")
const githubRoutes = require("./routes/github.routes")
const dockerRoutes = require("./routes/docker.routes")
const kubernetesRoutes = require("./routes/kubernetes.routes")
const terraformRoutes = require("./routes/terraform.routes")
const sonarqubeRoutes = require("./routes/sonarqube.routes")
const metricsRoutes = require("./routes/metrics.routes")
const { errorHandler } = require("./middleware/error.middleware")
const { validateToken } = require("./middleware/auth.middleware")

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 3001

// Connect to database
connectDB()

// CORS middleware - must come before other middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Hardcode the origin for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Handle preflight requests
app.options("*", cors())

// Configure helmet with CORS in mind
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

app.use(morgan("dev")) // Logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser()) // Parse cookies

// Add explicit CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

// Routes
app.use("/api/auth", authRoutes)

// Protected routes - require authentication
app.use("/api/jenkins", validateToken, jenkinsRoutes)
app.use("/api/github", validateToken, githubRoutes)
app.use("/api/docker", validateToken, dockerRoutes)
app.use("/api/kubernetes", validateToken, kubernetesRoutes)
app.use("/api/terraform", validateToken, terraformRoutes)
app.use("/api/sonarqube", validateToken, sonarqubeRoutes)
app.use("/api/metrics", validateToken, metricsRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
