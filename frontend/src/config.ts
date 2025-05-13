export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Authentication settings
export const AUTH_CONFIG = {
  tokenKey: "auth_token",
  userKey: "user",
  expiryTime: 24 * 60 * 60 * 1000, // 24 hours
}

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  systemMetrics: 5000,
  devopsTools: 30000,
  pipelines: 10000,
  deployments: 60000,
}

// Feature flags
export const FEATURES = {
  enableRealTimeUpdates: true,
  enableNotifications: true,
  enableDarkMode: true,
}
