// Mock Terraform service

type TerraformResource = {
  id: string
  name: string
  type: string
  provider: string
  status: "created" | "updated" | "destroyed" | "planned"
  lastModified: string
}

type TerraformModule = {
  name: string
  source: string
  version: string
  resources: number
}

type TerraformWorkspace = {
  name: string
  status: "applied" | "planning" | "error" | "pending"
  lastRun: string
  resources: number
  changes: number
}

export async function getTerraformData(): Promise<{
  resources: TerraformResource[]
  modules: TerraformModule[]
  workspaces: TerraformWorkspace[]
}> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const resources: TerraformResource[] = [
        {
          id: "aws_instance.api_server",
          name: "api_server",
          type: "aws_instance",
          provider: "aws",
          status: "created",
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
          id: "aws_db_instance.database",
          name: "database",
          type: "aws_db_instance",
          provider: "aws",
          status: "updated",
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        },
        {
          id: "aws_s3_bucket.storage",
          name: "storage",
          type: "aws_s3_bucket",
          provider: "aws",
          status: "created",
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
          id: "aws_security_group.api_sg",
          name: "api_sg",
          type: "aws_security_group",
          provider: "aws",
          status: "planned",
          lastModified: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ]

      const modules: TerraformModule[] = [
        {
          name: "vpc",
          source: "terraform-aws-modules/vpc/aws",
          version: "3.14.0",
          resources: 23,
        },
        {
          name: "security-groups",
          source: "terraform-aws-modules/security-group/aws",
          version: "4.9.0",
          resources: 12,
        },
        {
          name: "rds",
          source: "terraform-aws-modules/rds/aws",
          version: "5.1.0",
          resources: 8,
        },
      ]

      const workspaces: TerraformWorkspace[] = [
        {
          name: "production",
          status: "applied",
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          resources: 45,
          changes: 0,
        },
        {
          name: "staging",
          status: Math.random() > 0.5 ? "planning" : "applied",
          lastRun: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          resources: 42,
          changes: Math.floor(Math.random() * 5),
        },
        {
          name: "development",
          status: Math.random() > 0.7 ? "error" : "applied",
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          resources: 38,
          changes: Math.floor(Math.random() * 8),
        },
      ]

      resolve({ resources, modules, workspaces })
    }, 600)
  })
}

export async function applyTerraform(workspace: string): Promise<void> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Applied Terraform changes for workspace: ${workspace}`)
      resolve()
    }, 1500)
  })
}
