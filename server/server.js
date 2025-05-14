const express = require("express")
const cors = require('cors');
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 3001

console.log('Server starting...')
console.log('Environment:', process.env.NODE_ENV || 'development')
console.log('Port:', PORT)

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }),
)

// Add request debugging middleware
app.use((req, res, next) => {
  console.log('\n=== New Request ===')
  console.log('Time:', new Date().toISOString())
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Query:', JSON.stringify(req.query, null, 2))
  console.log('===================\n')
  next();
});

// Add explicit CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devops-dashboard")
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing passwords:')
  console.log('Candidate password:', candidatePassword)
  console.log('Stored password hash:', this.password)
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)

// Authentication middleware
const protect = async (req, res, next) => {
  let token

  // Get token from cookies or authorization header
  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devopssecret")

    // Add user to request
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    })
  }
}

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "devopssecret", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// Helper function to set token in cookie
const setTokenCookie = (res, token) => {
  const options = {
    expires: new Date(Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRE || "30") * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  res.cookie("token", token, options)
}

// Auth Routes
// @route   POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generate token
    const token = generateToken(user._id)

    // Set token in cookie
    setTokenCookie(res, token)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// @route   POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  console.log("Login attempt started")
  try {
    const { email, password } = req.body
    console.log("Login attempt for email:", email)
    
    // Check if email and password are provided
    if (!email || !password) {
      console.log("Missing email or password")
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      })
    }

    // Check if user exists
    console.log("Searching for user in database")
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      console.log("User not found:", email)
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }
    console.log("User found:", user.email)

    // Check if password matches
    console.log("Comparing passwords")
    const isMatch = await user.comparePassword(password)
    console.log("Password match result:", isMatch)
    
    if (!isMatch) {
      console.log("Password does not match")
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Generate token
    console.log("Generating JWT token")
    const token = generateToken(user._id)
    console.log("Token generated successfully")

    // Set token in cookie
    console.log("Setting token cookie")
    setTokenCookie(res, token)

    console.log("Login successful for user:", email)
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// @route   POST /api/auth/logout
app.post("/api/auth/logout", (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
})

// @route   GET /api/auth/me
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Jenkins Routes
app.get("/api/jenkins/pipelines", protect, (req, res) => {
  // Mock data for Jenkins pipelines
  const pipelines = [
    {
      id: `build-${Math.floor(Math.random() * 1000)}`,
      name: "main-build",
      status: Math.random() > 0.8 ? "failed" : Math.random() > 0.6 ? "running" : "success",
      branch: "main",
      duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
      timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
    },
    {
      id: `deploy-${Math.floor(Math.random() * 100)}`,
      name: "production-deploy",
      status: Math.random() > 0.7 ? "pending" : Math.random() > 0.5 ? "running" : "success",
      branch: "main",
      duration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
      timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)).toISOString(),
    },
    {
      id: `test-${Math.floor(Math.random() * 100)}`,
      name: "integration-tests",
      status: Math.random() > 0.7 ? "failed" : "success",
      branch: "feature/auth",
      duration: `${Math.floor(Math.random() * 4) + 2}m ${Math.floor(Math.random() * 60)}s`,
      timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 120)).toISOString(),
    },
  ]

  res.status(200).json({
    success: true,
    data: pipelines,
  })
})

app.get("/api/jenkins/data", protect, (req, res) => {
  // Generate random pipeline data with real-time information
  const generatePipeline = (id, name, branch) => {
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

  const data = [
    generatePipeline("build-123", "main-build", "main"),
    generatePipeline("deploy-45", "production-deploy", "main"),
    generatePipeline("test-67", "integration-tests", "feature/auth"),
  ]

  res.status(200).json({
    success: true,
    data,
  })
})

app.post("/api/jenkins/build/:id", protect, (req, res) => {
  const { id } = req.params

  // Mock triggering a Jenkins build
  console.log(`Triggered build for pipeline: ${id}`)

  res.status(200).json({
    success: true,
    message: `Build triggered for pipeline: ${id}`,
  })
})

// Docker Routes
app.get("/api/docker/data", protect, (req, res) => {
  // Mock data for Docker containers and images
  const containers = [
    {
      id: "abc123def456",
      name: "api-service",
      image: "api-service:latest",
      status: Math.random() > 0.2 ? "running" : "stopped",
      ports: ["8080:8080", "8081:8081"],
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      cpu: `${(Math.random() * 2).toFixed(1)}%`,
      memory: `${Math.floor(Math.random() * 256) + 64}MB / 512MB`,
    },
    {
      id: "ghi789jkl012",
      name: "database",
      image: "postgres:14",
      status: Math.random() > 0.1 ? "running" : "stopped",
      ports: ["5432:5432"],
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      cpu: `${(Math.random() * 3).toFixed(1)}%`,
      memory: `${Math.floor(Math.random() * 512) + 128}MB / 1GB`,
    },
    {
      id: "mno345pqr678",
      name: "cache",
      image: "redis:alpine",
      status: Math.random() > 0.8 ? "running" : "stopped",
      ports: ["6379:6379"],
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      cpu: Math.random() > 0.8 ? `${(Math.random() * 1).toFixed(1)}%` : "0%",
      memory: Math.random() > 0.8 ? `${Math.floor(Math.random() * 128) + 32}MB / 256MB` : "0MB / 256MB",
    },
  ]

  const images = [
    {
      id: "sha256:abc123def456",
      repository: "api-service",
      tag: "latest",
      size: "120MB",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "sha256:ghi789jkl012",
      repository: "postgres",
      tag: "14",
      size: "320MB",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
      id: "sha256:mno345pqr678",
      repository: "redis",
      tag: "alpine",
      size: "32MB",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    },
  ]

  res.status(200).json({
    success: true,
    data: { containers, images },
  })
})

app.post("/api/docker/start/:id", protect, (req, res) => {
  const { id } = req.params

  // Mock starting a Docker container
  console.log(`Started container: ${id}`)

  res.status(200).json({
    success: true,
    message: `Container ${id} started successfully`,
  })
})

app.post("/api/docker/stop/:id", protect, (req, res) => {
  const { id } = req.params

  // Mock stopping a Docker container
  console.log(`Stopped container: ${id}`)

  res.status(200).json({
    success: true,
    message: `Container ${id} stopped successfully`,
  })
})

// GitHub Routes
app.get("/api/github/data", protect, (req, res) => {
  // Mock data for GitHub
  const pullRequests = [
    {
      id: 1,
      title: "Add authentication feature",
      number: 42,
      status: "open",
      author: {
        name: "johndoe",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      branch: "feature/auth",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updated: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      comments: 5,
      commits: 8,
    },
    {
      id: 2,
      title: "Fix dashboard layout issues",
      number: 41,
      status: "merged",
      author: {
        name: "janesmith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      branch: "fix/dashboard-layout",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updated: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      comments: 3,
      commits: 2,
    },
    {
      id: 3,
      title: "Update dependencies to latest versions",
      number: 40,
      status: "closed",
      author: {
        name: "alexjohnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      branch: "chore/update-deps",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      comments: 2,
      commits: 1,
    },
  ]

  const repositories = [
    {
      id: 1,
      name: "devops-dashboard",
      description: "Modern DevOps dashboard with real-time metrics",
      stars: 42,
      forks: 12,
      issues: 5,
      pullRequests: 3,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 2,
      name: "api-service",
      description: "RESTful API service for the DevOps platform",
      stars: 28,
      forks: 8,
      issues: 7,
      pullRequests: 2,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 3,
      name: "infrastructure",
      description: "Infrastructure as code for the DevOps platform",
      stars: 15,
      forks: 5,
      issues: 3,
      pullRequests: 1,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ]

  res.status(200).json({
    success: true,
    data: { pullRequests, repositories },
  })
})

// Kubernetes Routes
app.get("/api/kubernetes/data", protect, (req, res) => {
  // Mock data for Kubernetes
  const pods = [
    {
      name: "api-service-pod-1",
      namespace: "production",
      status: "Running",
      restarts: 0,
      age: "3d",
      cpu: "120m",
      memory: "256Mi",
      node: "worker-1",
    },
    {
      name: "database-pod-1",
      namespace: "production",
      status: "Running",
      restarts: 2,
      age: "5d",
      cpu: "500m",
      memory: "1Gi",
      node: "worker-2",
    },
    {
      name: "cache-pod-1",
      namespace: "production",
      status: "Failed",
      restarts: 5,
      age: "1d",
      cpu: "100m",
      memory: "128Mi",
      node: "worker-1",
    },
    {
      name: "frontend-pod-1",
      namespace: "staging",
      status: "Pending",
      restarts: 0,
      age: "2h",
      cpu: "50m",
      memory: "128Mi",
      node: "worker-3",
    },
  ]

  const deployments = [
    {
      name: "api-service",
      namespace: "production",
      replicas: "3/3",
      availableReplicas: 3,
      updatedReplicas: 3,
      age: "3d",
      strategy: "RollingUpdate",
    },
    {
      name: "database",
      namespace: "production",
      replicas: "1/1",
      availableReplicas: 1,
      updatedReplicas: 1,
      age: "5d",
      strategy: "Recreate",
    },
    {
      name: "cache",
      namespace: "production",
      replicas: "0/2",
      availableReplicas: 0,
      updatedReplicas: 0,
      age: "1d",
      strategy: "RollingUpdate",
    },
    {
      name: "frontend",
      namespace: "staging",
      replicas: "2/3",
      availableReplicas: 2,
      updatedReplicas: 2,
      age: "2h",
      strategy: "RollingUpdate",
    },
  ]

  const nodes = [
    {
      name: "master-1",
      status: "Ready",
      roles: ["control-plane", "master"],
      age: "30d",
      version: "v1.25.4",
      cpu: "2/4",
      memory: "4Gi/8Gi",
      pods: "12/110",
    },
    {
      name: "worker-1",
      status: "Ready",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: "3/8",
      memory: "12Gi/16Gi",
      pods: "28/110",
    },
    {
      name: "worker-2",
      status: "Ready",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: "6/8",
      memory: "14Gi/16Gi",
      pods: "32/110",
    },
    {
      name: "worker-3",
      status: Math.random() > 0.8 ? "Ready" : "NotReady",
      roles: ["worker"],
      age: "30d",
      version: "v1.25.4",
      cpu: Math.random() > 0.8 ? "4/8" : "0/8",
      memory: Math.random() > 0.8 ? "10Gi/16Gi" : "0Gi/16Gi",
      pods: Math.random() > 0.8 ? "25/110" : "0/110",
    },
  ]

  res.status(200).json({
    success: true,
    data: { pods, deployments, nodes },
  })
})

// Terraform Routes
app.get("/api/terraform/data", protect, (req, res) => {
  // Mock data for Terraform
  const resources = [
    {
      id: "aws_instance.api_server",
      name: "api_server",
      type: "aws_instance",
      provider: "aws",
      status: "created",
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "aws_db_instance.database",
      name: "database",
      type: "aws_db_instance",
      provider: "aws",
      status: "updated",
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
      id: "aws_s3_bucket.storage",
      name: "storage",
      type: "aws_s3_bucket",
      provider: "aws",
      status: "created",
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: "aws_security_group.api_sg",
      name: "api_sg",
      type: "aws_security_group",
      provider: "aws",
      status: "planned",
      lastModified: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ]

  const modules = [
    {
      name: "vpc",
      source: "terraform-aws-modules/vpc/aws",
      version: "3.14.0",
      resources: 23,
    },
    {
      name: "security-groups",
      source: "terraform-aws-modules/security-group/aws",
      version: "4.9.0",
      resources: 12,
    },
    {
      name: "rds",
      source: "terraform-aws-modules/rds/aws",
      version: "5.1.0",
      resources: 8,
    },
  ]

  const workspaces = [
    {
      name: "production",
      status: "applied",
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      resources: 45,
      changes: 0,
    },
    {
      name: "staging",
      status: Math.random() > 0.5 ? "planning" : "applied",
      lastRun: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      resources: 42,
      changes: Math.floor(Math.random() * 5),
    },
    {
      name: "development",
      status: Math.random() > 0.7 ? "error" : "applied",
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      resources: 38,
      changes: Math.floor(Math.random() * 8),
    },
  ]

  res.status(200).json({
    success: true,
    data: { resources, modules, workspaces },
  })
})

app.post("/api/terraform/apply/:workspace", protect, (req, res) => {
  const { workspace } = req.params

  // Mock applying Terraform changes
  console.log(`Applied Terraform changes for workspace: ${workspace}`)

  res.status(200).json({
    success: true,
    message: `Applied Terraform changes for workspace: ${workspace}`,
  })
})

// SonarQube Routes
app.get("/api/sonarqube/data", protect, (req, res) => {
  // Mock data for SonarQube
  const generateMockSonarQubeData = () => {
    const projects = [
      {
        id: "proj-1",
        name: "Backend API",
        key: "org.example:backend-api",
        lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        metrics: {
          bugs: Math.floor(Math.random() * 10),
          vulnerabilities: Math.floor(Math.random() * 5),
          codeSmells: Math.floor(Math.random() * 50) + 10,
          coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
          duplications: Math.floor(Math.random() * 10),
          qualityGate: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
        },
      },
      {
        id: "proj-2",
        name: "Frontend App",
        key: "org.example:frontend-app",
        lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        metrics: {
          bugs: Math.floor(Math.random() * 8),
          vulnerabilities: Math.floor(Math.random() * 3),
          codeSmells: Math.floor(Math.random() * 40) + 5,
          coverage: Math.floor(Math.random() * 40) + 50, // 50-90%
          duplications: Math.floor(Math.random() * 15),
          qualityGate: Math.random() > 0.6 ? "warning" : Math.random() > 0.2 ? "passed" : "failed",
        },
      },
      {
        id: "proj-3",
        name: "Infrastructure",
        key: "org.example:infrastructure",
        lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        metrics: {
          bugs: Math.floor(Math.random() * 5),
          vulnerabilities: Math.floor(Math.random() * 7),
          codeSmells: Math.floor(Math.random() * 30) + 5,
          coverage: Math.floor(Math.random() * 50) + 40, // 40-90%
          duplications: Math.floor(Math.random() * 8),
          qualityGate: Math.random() > 0.5 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
        },
      },
    ]

    const severities = ["blocker", "critical", "major", "minor", "info"]
    const types = ["bug", "vulnerability", "code_smell"]
    const statuses = ["open", "confirmed", "resolved", "closed"]
    const components = [
      "src/main/java/org/example/api/UserController.java",
      "src/main/java/org/example/service/AuthService.java",
      "src/main/java/org/example/repository/UserRepository.java",
      "src/main/resources/application.properties",
      "src/test/java/org/example/api/UserControllerTest.java",
    ]
    const authors = ["john.doe", "jane.smith", "alex.johnson", "sarah.williams"]

    const issues = Array.from({ length: 15 }, (_, i) => ({
      id: `issue-${i + 1}`,
      message: [
        "Remove this unused method parameter.",
        "Make this a static final constant or non-public and provide accessors.",
        "Add a nested comment explaining why this method is empty.",
        "Replace this use of System.out by a logger.",
        "Refactor this method to reduce its Cognitive Complexity.",
        "Make sure this exception is handled.",
        "Use a logger instead of System.console.",
        "Add the missing @Override annotation.",
        "Remove this unused private field.",
        "This block of commented-out code should be removed.",
      ][Math.floor(Math.random() * 10)],
      component: components[Math.floor(Math.random() * components.length)],
      project: projects[Math.floor(Math.random() * projects.length)].key,
      severity: severities[Math.floor(Math.random() * severities.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * Math.floor(Math.random() * 72)).toISOString(),
      line: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 1 : undefined,
      effort: `${Math.floor(Math.random() * 5) + 1}${["min", "h"][Math.floor(Math.random() * 2)]}`,
    }))

    const qualityGates = [
      {
        name: "Default",
        status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
        conditions: [
          {
            metric: "new_reliability_rating",
            operator: "GREATER_THAN",
            value: "1",
            status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
            errorThreshold: "1",
          },
          {
            metric: "new_security_rating",
            operator: "GREATER_THAN",
            value: "1",
            status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
            errorThreshold: "1",
          },
          {
            metric: "new_maintainability_rating",
            operator: "GREATER_THAN",
            value: "1",
            status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
            errorThreshold: "1",
          },
          {
            metric: "new_coverage",
            operator: "LESS_THAN",
            value: "80",
            status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
            errorThreshold: "80",
          },
          {
            metric: "new_duplicated_lines_density",
            operator: "GREATER_THAN",
            value: "3",
            status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
            errorThreshold: "3",
          },
        ],
      },
    ]

    return { projects, issues, qualityGates }
  }

  const data = generateMockSonarQubeData()

  res.status(200).json({
    success: true,
    data,
  })
})

app.get("/api/sonarqube/projects", protect, (req, res) => {
  // Mock data for SonarQube projects
  const projects = [
    {
      id: "proj-1",
      name: "Backend API",
      key: "org.example:backend-api",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 10),
        vulnerabilities: Math.floor(Math.random() * 5),
        codeSmells: Math.floor(Math.random() * 50) + 10,
        coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
        duplications: Math.floor(Math.random() * 10),
        qualityGate: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
    {
      id: "proj-2",
      name: "Frontend App",
      key: "org.example:frontend-app",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 8),
        vulnerabilities: Math.floor(Math.random() * 3),
        codeSmells: Math.floor(Math.random() * 40) + 5,
        coverage: Math.floor(Math.random() * 40) + 50, // 50-90%
        duplications: Math.floor(Math.random() * 15),
        qualityGate: Math.random() > 0.6 ? "warning" : Math.random() > 0.2 ? "passed" : "failed",
      },
    },
    {
      id: "proj-3",
      name: "Infrastructure",
      key: "org.example:infrastructure",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 7),
        codeSmells: Math.floor(Math.random() * 30) + 5,
        coverage: Math.floor(Math.random() * 50) + 40, // 40-90%
        duplications: Math.floor(Math.random() * 8),
        qualityGate: Math.random() > 0.5 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
  ]

  res.status(200).json({
    success: true,
    data: projects,
  })
})

// System Metrics Routes
app.get("/api/metrics/system", protect, (req, res) => {
  // Mock data for system metrics
  const generateTrend = () => {
    return ["up", "down", "stable"][Math.floor(Math.random() * 3)]
  }

  const generateHistory = (min, max, length = 10) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const cpuUsage = Math.floor(Math.random() * 80) + 10
  const memoryUsage = Math.floor(Math.random() * 65) + 20
  const diskUsage = Math.floor(Math.random() * 30) + 50
  const temperature = Math.floor(Math.random() * 20) + 40

  const metrics = {
    cpu: {
      value: cpuUsage,
      trend: generateTrend(),
      history: generateHistory(10, 90),
    },
    memory: {
      value: memoryUsage,
      trend: generateTrend(),
      history: generateHistory(20, 85),
    },
    disk: {
      value: diskUsage,
      trend: generateTrend(),
      history: generateHistory(30, 95),
    },
    temperature: {
      value: temperature,
      trend: generateTrend(),
      history: generateHistory(40, 80),
    },
  }

  res.status(200).json({
    success: true,
    data: metrics,
  })
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Create admin user script
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminEmail = "devopsdeveloper@example.com"
    const existingUser = await User.findOne({ email: adminEmail })

    if (existingUser) {
      console.log("Admin user already exists")
      return
    }

    // Create new admin user
    const user = await User.create({
      name: "DevOps Administrator",
      email: adminEmail,
      password: "Devopinator@",
      role: "admin",
    })

    console.log(`Admin user created: ${user.email}`)
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`)
  }
}

// Connect to database and start server
connectDB().then(() => {
  // Create admin user if it doesn't exist
  createAdminUser()

  // Start server
  const server = app.listen(PORT, '0.0.0.0', (error) => {
    if (error) {
      console.error('Error starting server:', error);
      process.exit(1);
    }
    console.log(`\n=== Server Started ===`)
    console.log(`Server running on port ${PORT}`)
    console.log(`Local URL: http://localhost:${PORT}`)
    console.log(`Network URL: http://0.0.0.0:${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
    console.log(`=====================\n`)
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });

}).catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
