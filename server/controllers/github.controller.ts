import type { Request, Response } from "express"
import { asyncHandler } from "../middleware/async.middleware"
import { AppError } from "../utils/appError"
import axios from "axios"

const githubConfig = {
  token: process.env.GITHUB_TOKEN || "YOUR_GITHUB_TOKEN", // Replace with your GitHub token
  owner: process.env.GITHUB_OWNER || "your-username", // Replace with your GitHub username/org
  repo: process.env.GITHUB_REPO || "your-repo-name", // Replace with your repository name
}

// Helper function to make authenticated requests to GitHub API
async function githubRequest(endpoint: string, method = "GET", data = null) {
  try {
    const url = `https://api.github.com${endpoint}`

    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `token ${githubConfig.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    return response.data
  } catch (error) {
    console.error(`GitHub API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    throw error
  }
}

// @desc    Get GitHub data
// @route   GET /api/github/data
// @access  Private
export const getGithubData = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if GitHub credentials are configured
    if (!githubConfig.token || !githubConfig.owner) {
      return res.status(200).json({
        success: true,
        data: { pullRequests: [], repositories: [] },
        message:
          "GitHub token or owner not configured. Please set GITHUB_TOKEN and GITHUB_OWNER in your environment variables.",
      })
    }

    // In a real implementation, you would fetch data from GitHub API
    // Example:
    // const pullRequests = await githubRequest(`/repos/${githubConfig.owner}/${githubConfig.repo}/pulls`)
    // const repositories = await githubRequest(`/users/${githubConfig.owner}/repos`)

    // For now, return empty arrays until GitHub is configured
    const pullRequests: any[] = []
    const repositories: any[] = []

    res.status(200).json({
      success: true,
      data: { pullRequests, repositories },
    })
  } catch (error) {
    throw new AppError(`Error fetching GitHub data: ${error instanceof Error ? error.message : 'Unknown error'}`, 500)
  }
})
