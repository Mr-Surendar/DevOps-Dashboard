import api from "./api"

export async function getSonarQubeProjects() {
  try {
    const response = await api.get("/sonarqube/projects")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch SonarQube projects:", error)
    throw error
  }
}

export async function getSonarQubeIssues() {
  try {
    const response = await api.get("/sonarqube/issues")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch SonarQube issues:", error)
    throw error
  }
}

export async function getSonarQubeQualityGates() {
  try {
    const response = await api.get("/sonarqube/quality-gates")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch SonarQube quality gates:", error)
    throw error
  }
}

export async function getSonarQubeData() {
  try {
    const response = await api.get("/sonarqube/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch SonarQube data:", error)
    throw error
  }
}
