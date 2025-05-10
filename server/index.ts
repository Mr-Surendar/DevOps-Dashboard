import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connectDB } from "./config/database"
import authRoutes from "./routes/auth.routes"
import jenkinsRoutes from "./routes/jenkins.routes"
import githubRoutes from "./routes/github.routes"
import dockerRoutes from "./routes/docker.routes"
import kubernetesRoutes from "./routes/kubernetes.routes"
import terraformRoutes from "./routes/terraform.routes"
import sonarqubeRoutes from "./routes/sonarqube.routes"
import metricsRoutes from "./routes/metrics.routes"
import { errorHandler } from "./middleware/error.middleware"
import { validateToken } from "./middleware/auth.middleware"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(helmet()) // Security headers
app.use(morgan("dev")) // Logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser()) // Parse cookies

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

export default app
