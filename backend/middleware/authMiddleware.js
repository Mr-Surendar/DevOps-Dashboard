const jwt = require("jsonwebtoken")
const config = require("../config")

/**
 * Middleware to authenticate JWT token
 */
exports.authenticateToken = (req, res, next) => {
  // For development purposes, skip authentication
  if (process.env.NODE_ENV === "development" && process.env.SKIP_AUTH === "true") {
    return next()
  }

  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" })
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }

    req.user = user
    next()
  })
}

/**
 * Middleware to check admin role
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin privileges required" })
  }

  next()
}
