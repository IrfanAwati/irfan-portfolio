/**
 * Tool logos + colours. `icon` is a file in public/icons/ (from devicon / simple-icons,
 * extracted by scripts/extract-icons.mjs). Tools with no published logo get a
 * monogram badge (`mono`) in their brand colour instead of an invented logo.
 */
import { skillGroups } from './skills'

export type ToolVisual = { icon?: string; mono?: string; color: string }

const V: Record<string, ToolVisual> = {
  'Microsoft Azure': { icon: 'azure', color: '#0089d6' },
  AWS: { icon: 'aws', color: '#ff9900' },
  'On-prem / hybrid': { mono: 'DC', color: '#ffb547' },
  'Azure Key Vault': { mono: 'KV', color: '#0078d4' },
  'Azure Storage': { mono: 'St', color: '#0078d4' },
  'Azure Monitor': { mono: 'AM', color: '#0078d4' },
  'Azure AD B2C': { mono: 'B2C', color: '#0078d4' },
  'Azure DevOps': { icon: 'azuredevops', color: '#0078d7' },
  Terraform: { icon: 'terraform', color: '#7b42bc' },
  'ARM / Bicep': { mono: 'Bi', color: '#3b9cff' },
  Ansible: { icon: 'ansible', color: '#ee0000' },
  Docker: { icon: 'docker', color: '#2496ed' },
  'Docker Compose': { icon: 'docker', color: '#2496ed' },
  Kubernetes: { icon: 'kubernetes', color: '#326ce5' },
  AKS: { icon: 'kubernetes', color: '#326ce5' },
  Minikube: { mono: 'mk', color: '#2bbbad' },
  'Argo CD / Flux': { icon: 'argocd', color: '#ef7b4d' },
  'GitHub Actions': { icon: 'githubactions', color: '#2088ff' },
  'Azure Pipelines': { icon: 'azuredevops', color: '#0078d7' },
  Jenkins: { icon: 'jenkins', color: '#d24939' },
  'GitLab CI/CD': { icon: 'gitlab', color: '#fc6d26' },
  Gitleaks: { mono: 'GL', color: '#e5484d' },
  Checkov: { mono: 'Ck', color: '#7c5cff' },
  Embold: { mono: 'Eb', color: '#ff7b00' },
  SonarQube: { icon: 'sonarqube', color: '#4e9bcd' },
  Trivy: { icon: 'trivy', color: '#1904da' },
  'Kubescape / kube-score': { mono: 'Ks', color: '#00b4d8' },
  'HashiCorp Vault': { icon: 'vault', color: '#ffd814' },
  Falco: { icon: 'falco', color: '#00aec7' },
  'Kyverno / OPA Gatekeeper': { mono: 'Ky', color: '#ff6b35' },
  Grafana: { icon: 'grafana', color: '#f46800' },
  Datadog: { icon: 'datadog', color: '#632ca6' },
  'PowerShell / Az module': { icon: 'powershell', color: '#5391fe' },
  Bash: { icon: 'bash', color: '#4eaa25' },
  Python: { icon: 'python', color: '#3776ab' },
  'Linux & Windows Server': { icon: 'linux', color: '#fcc624' },
  'Git / GitHub': { icon: 'git', color: '#f05032' },
  'Azure VMs': { mono: 'VM', color: '#0078d4' },
  'App Service': { mono: 'App', color: '#0078d4' },
  'Azure Networking': { mono: 'Net', color: '#0078d4' },
  'Reservations (3-yr)': { mono: '3y', color: '#ffb900' },
  'Amazon EC2': { mono: 'EC2', color: '#ff9900' },
  'Amazon S3': { mono: 'S3', color: '#3f8624' },
  'Amazon EKS': { mono: 'EKS', color: '#ff9900' },
  'Amazon ECR': { mono: 'ECR', color: '#ff9900' },
  'AWS Networking': { mono: 'VPC', color: '#8c4fff' },
  GitOps: { mono: 'Ops', color: '#5cf2a8' },
  Kustomize: { mono: 'Kz', color: '#326ce5' },
  'Ingress (NGINX · Istio · Traefik)': { icon: 'nginx', color: '#009639' },
  Kubesec: { mono: 'Ksc', color: '#e5484d' },
  'Front Door WAF': { mono: 'WAF', color: '#0078d4' },
  'SOC 2 controls': { mono: 'SOC', color: '#6c5ce7' },
  OpenTelemetry: { icon: 'opentelemetry', color: '#f5a800' },
  Infracost: { icon: 'infracost', color: '#db44b8' },
  'Azure SQL': { mono: 'SQL', color: '#0078d4' },
  PostgreSQL: { icon: 'postgresql', color: '#336791' },
  'Service Bus': { mono: 'SB', color: '#0078d4' },
  'Event Hubs': { mono: 'EH', color: '#0078d4' },
  'Redis Cache': { icon: 'redis', color: '#dc382d' },
  'Jira & Confluence': { icon: 'jira', color: '#2684ff' },
  // aliases used by project stacks
  'Key Vault': { mono: 'KV', color: '#0078d4' },
  PowerShell: { icon: 'powershell', color: '#5391fe' },
  'Az module': { icon: 'azure', color: '#0089d6' },
  azurerm: { icon: 'terraform', color: '#7b42bc' },
  SARIF: { mono: '{}', color: '#8b949e' },
}

export const toolVisual = (name: string): ToolVisual => V[name] ?? { mono: name.slice(0, 2), color: '#5cf2a8' }

/** Short display names for the hero marquee. */
const SHORT: Record<string, string> = {
  'On-prem / hybrid': 'On-prem',
  'PowerShell / Az module': 'PowerShell',
  'Linux & Windows Server': 'Linux',
  'Git / GitHub': 'Git',
  'Kubescape / kube-score': 'Kubescape',
  'Kyverno / OPA Gatekeeper': 'Kyverno · OPA',
  'Reservations (3-yr)': '3-yr Reservations',
  'Azure Networking': 'Azure VNet',
  'AWS Networking': 'AWS VPC',
  'Ingress (NGINX · Istio · Traefik)': 'NGINX · Istio · Traefik',
  'Jira & Confluence': 'Jira & Confluence',
  'SOC 2 controls': 'SOC 2',
  'Argo CD / Flux': 'Argo CD',
  'ARM / Bicep': 'Bicep',
  'GitLab CI/CD': 'GitLab CI',
}

export type MarqueeTool = { name: string; label: string; group: string; groupColor: string } & ToolVisual

/** Every tool once, in category order, plus a few extra logos for the band. */
export const allTools: MarqueeTool[] = (() => {
  const seen = new Set<string>()
  const out: MarqueeTool[] = []
  for (const g of skillGroups) {
    for (const t of g.tools) {
      if (seen.has(t.name)) continue
      seen.add(t.name)
      out.push({ name: t.name, label: SHORT[t.name] ?? t.name, group: g.label, groupColor: g.color, ...toolVisual(t.name) })
    }
  }
  const extra: MarqueeTool[] = [
    { name: 'Windows Server', label: 'Windows Server', group: 'Scripting & Systems', groupColor: '#ff6ad5', icon: 'windows', color: '#0078d4' },
    { name: 'GitHub', label: 'GitHub', group: 'Scripting & Systems', groupColor: '#ff6ad5', icon: 'github', color: '#8b949e' },
  ]
  return [...out, ...extra]
})()
