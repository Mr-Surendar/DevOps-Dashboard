import express from "express"
import { register, login, logout, getCurrentUser } from "../controllers/auth.controller"
import { validateToken } from "../middleware/auth.middleware"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", validateToken, getCurrentUser)

export default router
