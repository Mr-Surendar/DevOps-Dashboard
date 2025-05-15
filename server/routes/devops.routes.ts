import express from "express"
import { getToolsStatus, getDevOpsAlerts } from "../controllers/devops.controller"

const router = express.Router()

router.get("/tools-status", getToolsStatus)
router.get("/alerts", getDevOpsAlerts)

export default router
