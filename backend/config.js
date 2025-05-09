// Configuration for the backend application

module.exports = {
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

  // Database configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "devops_dashboard",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  // External services configuration
  services: {
    jenkins: {
      url: process.env.JENKINS_URL || "http://localhost:8080",
      user: process.env.JENKINS_USER || "admin",
      token: process.env.JENKINS_TOKEN,
    },
    github: {
      url: process.env.GITHUB_API_URL || "https://api.github.com",
      token: process.env.GITHUB_TOKEN,
    },
    docker: {
      host: process.env.DOCKER_HOST || "unix:///var/run/docker.sock",
    },
    kubernetes: {
      config: process.env.KUBECONFIG,
    },
    terraform: {
      workspaceDir: process.env.TERRAFORM_WORKSPACE_DIR || "/terraform",
    },
  },

  // Metrics configuration
  metrics: {
    historyLength: Number.parseInt(process.env.METRICS_HISTORY_LENGTH) || 100,
    pollingInterval: Number.parseInt(process.env.METRICS_POLLING_INTERVAL) || 5000,
  },
}
