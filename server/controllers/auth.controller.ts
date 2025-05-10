import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new AppError("User already exists", 400)
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  })

  // Generate token
  const token = generateToken(user._id)

  // Set token in cookie
  setTokenCookie(res, token)

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if email and password are provided
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400)
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    throw new AppError("Invalid credentials", 401)
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401)
  }

  // Generate token
  const token = generateToken(user._id)

  // Set token in cookie
  setTokenCookie(res, token)

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// Helper function to generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "devopssecret", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// Helper function to set token in cookie
const setTokenCookie = (res: Response, token: string) => {
  const options = {
    expires: new Date(Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRE || "30") * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  res.cookie("token", token, options)
}
