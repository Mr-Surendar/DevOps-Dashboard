// SonarQube service for code quality analysis

type SonarQubeProject = {
  id: string
  name: string
  key: string
  lastAnalysis: string
  metrics: {
    bugs: number
    vulnerabilities: number
    codeSmells: number
    coverage: number
    duplications: number
    qualityGate: "passed" | "failed" | "warning"
  }
}

type SonarQubeIssue = {
  id: string
  message: string
  component: string
  project: string
  severity: "blocker" | "critical" | "major" | "minor" | "info"
  type: "bug" | "vulnerability" | "code_smell"
  status: "open" | "confirmed" | "resolved" | "closed"
  author: string
  createdAt: string
  line?: number
  effort: string
}

type SonarQubeQualityGate = {
  name: string
  status: "passed" | "failed" | "warning"
  conditions: {
    metric: string
    operator: string
    value: string
    status: "passed" | "failed" | "warning"
    errorThreshold?: string
    warningThreshold?: string
  }[]
}

// Mock data generator for SonarQube
const generateMockSonarQubeData = () => {
  const projects: SonarQubeProject[] = [
    {
      id: "proj-1",
      name: "Backend API",
      key: "org.example:backend-api",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 10),
        vulnerabilities: Math.floor(Math.random() * 5),
        codeSmells: Math.floor(Math.random() * 50) + 10,
        coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
        duplications: Math.floor(Math.random() * 10),
        qualityGate: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
    {
      id: "proj-2",
      name: "Frontend App",
      key: "org.example:frontend-app",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 8),
        vulnerabilities: Math.floor(Math.random() * 3),
        codeSmells: Math.floor(Math.random() * 40) + 5,
        coverage: Math.floor(Math.random() * 40) + 50, // 50-90%
        duplications: Math.floor(Math.random() * 15),
        qualityGate: Math.random() > 0.6 ? "warning" : Math.random() > 0.2 ? "passed" : "failed",
      },
    },
    {
      id: "proj-3",
      name: "Infrastructure",
      key: "org.example:infrastructure",
      lastAnalysis: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      metrics: {
        bugs: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 7),
        codeSmells: Math.floor(Math.random() * 30) + 5,
        coverage: Math.floor(Math.random() * 50) + 40, // 40-90%
        duplications: Math.floor(Math.random() * 8),
        qualityGate: Math.random() > 0.5 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      },
    },
  ]

  const severities = ["blocker", "critical", "major", "minor", "info"]
  const types = ["bug", "vulnerability", "code_smell"]
  const statuses = ["open", "confirmed", "resolved", "closed"]
  const components = [
    "src/main/java/org/example/api/UserController.java",
    "src/main/java/org/example/service/AuthService.java",
    "src/main/java/org/example/repository/UserRepository.java",
    "src/main/resources/application.properties",
    "src/test/java/org/example/api/UserControllerTest.java",
  ]
  const authors = ["john.doe", "jane.smith", "alex.johnson", "sarah.williams"]

  const issues: SonarQubeIssue[] = Array.from({ length: 15 }, (_, i) => ({
    id: `issue-${i + 1}`,
    message: [
      "Remove this unused method parameter.",
      "Make this a static final constant or non-public and provide accessors.",
      "Add a nested comment explaining why this method is empty.",
      "Replace this use of System.out by a logger.",
      "Refactor this method to reduce its Cognitive Complexity.",
      "Make sure this exception is handled.",
      "Use a logger instead of System.console.",
      "Add the missing @Override annotation.",
      "Remove this unused private field.",
      "This block of commented-out code should be removed.",
    ][Math.floor(Math.random() * 10)],
    component: components[Math.floor(Math.random() * components.length)],
    project: projects[Math.floor(Math.random() * projects.length)].key,
    severity: severities[Math.floor(Math.random() * severities.length)] as any,
    type: types[Math.floor(Math.random() * types.length)] as any,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    author: authors[Math.floor(Math.random() * authors.length)],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * Math.floor(Math.random() * 72)).toISOString(),
    line: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 1 : undefined,
    effort: `${Math.floor(Math.random() * 5) + 1}${["min", "h"][Math.floor(Math.random() * 2)]}`,
  }))

  const qualityGates: SonarQubeQualityGate[] = [
    {
      name: "Default",
      status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
      conditions: [
        {
          metric: "new_reliability_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_security_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_maintainability_rating",
          operator: "GREATER_THAN",
          value: "1",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "1",
        },
        {
          metric: "new_coverage",
          operator: "LESS_THAN",
          value: "80",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "80",
        },
        {
          metric: "new_duplicated_lines_density",
          operator: "GREATER_THAN",
          value: "3",
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.3 ? "passed" : "failed",
          errorThreshold: "3",
        },
      ],
    },
  ]

  return { projects, issues, qualityGates }
}

export async function getSonarQubeProjects(): Promise<SonarQubeProject[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { projects } = generateMockSonarQubeData()
      resolve(projects)
    }, 600)
  })
}

export async function getSonarQubeIssues(): Promise<SonarQubeIssue[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { issues } = generateMockSonarQubeData()
      resolve(issues)
    }, 700)
  })
}

export async function getSonarQubeQualityGates(): Promise<SonarQubeQualityGate[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { qualityGates } = generateMockSonarQubeData()
      resolve(qualityGates)
    }, 500)
  })
}

export async function getSonarQubeData(): Promise<{
  projects: SonarQubeProject[]
  issues: SonarQubeIssue[]
  qualityGates: SonarQubeQualityGate[]
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockSonarQubeData())
    }, 800)
  })
}
