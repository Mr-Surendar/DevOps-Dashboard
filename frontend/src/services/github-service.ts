import api from "./api"

export async function getGithubData() {
  try {
    const response = await api.get("/github/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error)
    throw error
  }
}

export async function getRepositories() {
  try {
    const response = await api.get("/github/repositories")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error)
    throw error
  }
}

export async function getPullRequests() {
  try {
    const response = await api.get("/github/pull-requests")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch GitHub pull requests:", error)
    throw error
  }
}
