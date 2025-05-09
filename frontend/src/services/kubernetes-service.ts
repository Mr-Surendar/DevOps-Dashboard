// Mock Kubernetes service

type KubernetesPod = {
  name: string
  namespace: string
  status: "Running" | "Pending" | "Succeeded" | "Failed" | "Unknown"
  restarts: number
  age: string
  cpu: string
  memory: string
  node: string
}

type KubernetesDeployment = {
  name: string
  namespace: string
  replicas: string
  availableReplicas: number
  updatedReplicas: number
  age: string
  strategy: string
}

type KubernetesNode = {
  name: string
  status: "Ready" | "NotReady" | "Unknown"
  roles: string[]
  age: string
  version: string
  cpu: string
  memory: string
  pods: string
}

export async function getKubernetesData(): Promise<{
  pods: KubernetesPod[]
  deployments: KubernetesDeployment[]
  nodes: KubernetesNode[]
}> {
  // In a real application, this would make an API call to your backend
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const statuses = ["Running", "Pending", "Succeeded", "Failed", "Unknown"]
      const namespaces = ["production", "staging", "development", "monitoring"]

      const pods: KubernetesPod[] = Array.from({ length: 4 }, (_, i) => {
        const status = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : "Running"
        const restarts = status === "Failed" ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2)

        return {
          name: `${["api", "web", "db", "cache", "worker"][i % 5]}-pod-${i + 1}`,
          namespace: namespaces[i % namespaces.length],
          status,
          restarts,
          age: `${Math.floor(Math.random() * 10) + 1}d`,
          cpu: `${Math.floor(Math.random() * 500) + 50}m`,
          memory: `${Math.floor(Math.random() * 512) + 128}Mi`,
          node: `worker-${Math.floor(Math.random() * 3) + 1}`,
        }
      })

      const deployments: KubernetesDeployment[] = Array.from({ length: 4 }, (_, i) => {
        const totalReplicas = Math.floor(Math.random() * 3) + 1
        const availableReplicas = Math.floor(Math.random() * (totalReplicas + 1))

        return {
          name: ["api", "web", "db", "cache", "worker"][i % 5],
          namespace: namespaces[i % namespaces.length],
          replicas: `${availableReplicas}/${totalReplicas}`,
          availableReplicas,
          updatedReplicas: availableReplicas,
          age: `${Math.floor(Math.random() * 10) + 1}d`,
          strategy: Math.random() > 0.5 ? "RollingUpdate" : "Recreate",
        }
      })

      const nodes: KubernetesNode[] = [
        {
          name: "master-1",
          status: Math.random() > 0.1 ? "Ready" : "NotReady",
          roles: ["control-plane", "master"],
          age: "30d",
          version: "v1.25.4",
          cpu: `${Math.floor(Math.random() * 3) + 1}/4`,
          memory: `${Math.floor(Math.random() * 4) + 2}Gi/8Gi`,
          pods: `${Math.floor(Math.random() * 50) + 10}/110`,
        },
        {
          name: "worker-1",
          status: Math.random() > 0.1 ? "Ready" : "NotReady",
          roles: ["worker"],
          age: "30d",
          version: "v1.25.4",
          cpu: `${Math.floor(Math.random() * 6) + 2}/8`,
          memory: `${Math.floor(Math.random() * 8) + 4}Gi/16Gi`,
          pods: `${Math.floor(Math.random() * 60) + 20}/110`,
        },
        {
          name: "worker-2",
          status: Math.random() > 0.1 ? "Ready" : "NotReady",
          roles: ["worker"],
          age: "30d",
          version: "v1.25.4",
          cpu: `${Math.floor(Math.random() * 6) + 2}/8`,
          memory: `${Math.floor(Math.random() * 8) + 4}Gi/16Gi`,
          pods: `${Math.floor(Math.random() * 60) + 20}/110`,
        },
        {
          name: "worker-3",
          status: Math.random() > 0.8 ? "Ready" : "NotReady",
          roles: ["worker"],
          age: "30d",
          version: "v1.25.4",
          cpu: `${Math.floor(Math.random() * 6) + 2}/8`,
          memory: `${Math.floor(Math.random() * 8) + 4}Gi/16Gi`,
          pods: `${Math.floor(Math.random() * 60) + 20}/110`,
        },
      ]

      resolve({ pods, deployments, nodes })
    }, 700)
  })
}
