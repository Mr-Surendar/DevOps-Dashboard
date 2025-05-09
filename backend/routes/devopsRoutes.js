const express = require("express")
const router = express.Router()
const devopsController = require("../controllers/devopsController")
const { authenticateToken } = require("../middleware/authMiddleware")

// Get status of all DevOps tools
router.get("/tools-status", authenticateToken, devopsController.getToolsStatus)

// Get alerts from all DevOps tools
router.get("/alerts", authenticateToken, devopsController.getDevOpsAlerts)

// Get overall system health
router.get("/health", authenticateToken, devopsController.getSystemHealth)

module.exports = router
