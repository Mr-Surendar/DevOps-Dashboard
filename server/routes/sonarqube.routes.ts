import express from "express"
import {
  getSonarQubeProjects,
  getSonarQubeIssues,
  getSonarQubeQualityGates,
  getSonarQubeData,
} from "../controllers/sonarqube.controller"

const router = express.Router()

router.get("/projects", getSonarQubeProjects)
router.get("/issues", getSonarQubeIssues)
router.get("/quality-gates", getSonarQubeQualityGates)
router.get("/data", getSonarQubeData)

export default router
