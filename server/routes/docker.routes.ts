import express from "express"
import {
  getDockerData,
  getContainerLogs,
  getContainerStats,
  startContainer,
  stopContainer,
} from "../controllers/docker.controller"

const router = express.Router()

router.get("/data", getDockerData)
router.get("/logs/:id", getContainerLogs)
router.get("/stats/:id", getContainerStats)
router.post("/start/:id", startContainer)
router.post("/stop/:id", stopContainer)

export default router
