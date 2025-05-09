import { KubernetesIntegration } from "@/components/kubernetes-integration"

export default function KubernetesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Kubernetes Integration</h1>
      <KubernetesIntegration />
    </div>
  )
}
