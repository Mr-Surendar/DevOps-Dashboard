import { SonarQubeIntegration } from "@/components/sonarqube-integration"

export default function SonarQubePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">SonarQube Integration</h1>
      <SonarQubeIntegration />
    </div>
  )
}
