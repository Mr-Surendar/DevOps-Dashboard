import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { asyncHandler } from "./async.middleware"
import { AppError } from "../utils/appError"
import User from "../models/user.model"

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

// Middleware to validate JWT token
export const validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token

  // Get token from cookies or authorization header
  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  // Check if token exists
  if (!token) {
    throw new AppError("Not authorized to access this route", 401)
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devopssecret") as any

    // Add user to request
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    throw new AppError("Not authorized to access this route", 401)
  }
})

// Middleware to restrict access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(`Role (${req.user.role}) is not authorized to access this route`, 403)
    }
    next()
  }
}
