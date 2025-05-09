const express = require("express")
const router = express.Router()
const jenkinsController = require("../controllers/jenkinsController")
const { authenticateToken } = require("../middleware/authMiddleware")

// Get all pipelines
router.get("/pipelines", authenticateToken, jenkinsController.getPipelineStatus)

// Get detailed Jenkins data
router.get("/data", authenticateToken, jenkinsController.getJenkinsData)

// Trigger a Jenkins build
router.post("/trigger/:pipelineId", authenticateToken, jenkinsController.triggerJenkinsBuild)

// Get Jenkins jobs
router.get("/jobs", authenticateToken, jenkinsController.getJenkinsJobs)

// Get Jenkins nodes
router.get("/nodes", authenticateToken, jenkinsController.getJenkinsNodes)

module.exports = router
