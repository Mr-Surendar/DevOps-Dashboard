const express = require("express")
const router = express.Router()
const metricsController = require("../controllers/metricsController")
const { authenticateToken } = require("../middleware/authMiddleware")

// Get system metrics (CPU, memory, disk, temperature)
router.get("/system", authenticateToken, metricsController.getSystemMetrics)

// Get network metrics
router.get("/network", authenticateToken, metricsController.getNetworkMetrics)

// Get historical metrics
router.get("/history/:metric", authenticateToken, metricsController.getMetricHistory)

module.exports = router
