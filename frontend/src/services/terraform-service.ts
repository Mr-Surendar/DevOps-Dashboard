import api from "./api"

export async function getTerraformData() {
  try {
    const response = await api.get("/terraform/data")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Terraform data:", error)
    throw error
  }
}

export async function getWorkspaces() {
  try {
    const response = await api.get("/terraform/workspaces")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch Terraform workspaces:", error)
    throw error
  }
}

export async function applyTerraform(workspace: string) {
  try {
    const response = await api.post(`/terraform/apply/${workspace}`)
    return response.data
  } catch (error) {
    console.error("Failed to apply Terraform changes:", error)
    throw error
  }
}
