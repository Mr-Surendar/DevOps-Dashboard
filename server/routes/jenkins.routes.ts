import express from "express"
import {
  getPipelineStatus,
  getJenkinsData,
  triggerJenkinsBuild,
  getPipelineLogs,
} from "../controllers/jenkins.controller"

const router = express.Router()

router.get("/pipelines", getPipelineStatus)
router.get("/data", getJenkinsData)
router.post("/build/:id", triggerJenkinsBuild)
router.get("/logs/:id", getPipelineLogs)

export default router
