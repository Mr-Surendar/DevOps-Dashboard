import express from "express"
import { getSystemMetrics, getNetworkMetrics } from "../controllers/metrics.controller"

const router = express.Router()

router.get("/system", getSystemMetrics)
router.get("/network", getNetworkMetrics)

export default router
