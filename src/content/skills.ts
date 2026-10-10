/**
 * Technical arsenal. No percentages. Each tool says how it's evidenced:
 *  - 'repo'     → used in a public GitHub repository
 *  - 'profile'  → Irfan's day-to-day stack (stated by Irfan / his profile README)
 *  - 'cert'     → covered by a certification
 *  - 'learning' → on the public DevSecOps roadmap, not yet claimed as production use
 */

export type Evidence = 'repo' | 'profile' | 'cert' | 'learning'

export type Tool = { name: string; evidence: Evidence[]; note?: string }

export type SkillGroup = {
  id: string
  label: string
  /** category accent: used for glows, lines and chips */
  color: string
  blurb: string
  tools: Tool[]
}

export const evidenceLabel: Record<Evidence, string> = {
  repo: 'In a public repo',
  profile: 'Daily stack',
  cert: 'Certified',
  learning: 'On the roadmap',
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'cloud',
    color: '#3b9cff',
    label: 'Azure & Hybrid',
    blurb: 'Primary cloud, plus the on-prem servers it connects to: VMs, apps, clusters, storage, network and cost.',
    tools: [
      { name: 'Microsoft Azure', evidence: ['cert', 'repo', 'profile'], note: 'AZ-104 · AZ-900' },
      { name: 'Azure VMs', evidence: ['profile', 'repo'], note: 'On-prem → cloud migrations' },
      { name: 'App Service', evidence: ['profile', 'repo'], note: 'Web Apps, migrated to AKS' },
      { name: 'AKS', evidence: ['profile'], note: 'Kubernetes workloads' },
      { name: 'Azure Storage', evidence: ['repo'], note: 'TLS / secure-transfer enforced' },
      { name: 'Azure Key Vault', evidence: ['repo', 'learning'] },
      { name: 'Azure Networking', evidence: ['profile', 'repo'], note: 'VNet · subnets · NSG' },
      { name: 'Reservations (3-yr)', evidence: ['profile'], note: 'Committed-use discounts' },
      { name: 'Azure AD B2C', evidence: ['repo'], note: 'Bulk user onboarding' },
      { name: 'On-prem / hybrid', evidence: ['profile'], note: 'Linux & Windows servers' },
    ],
  },
  {
    id: 'aws',
    color: '#ff9900',
    label: 'AWS',
    blurb: 'Second cloud: compute, object storage, a managed Kubernetes cluster, a container registry and networking.',
    tools: [
      { name: 'AWS', evidence: ['profile'] },
      { name: 'Amazon EC2', evidence: ['profile'], note: 'Virtual machines' },
      { name: 'Amazon S3', evidence: ['profile'], note: 'Object storage' },
      { name: 'Amazon EKS', evidence: ['profile'], note: 'Managed Kubernetes' },
      { name: 'Amazon ECR', evidence: ['profile'], note: 'Container registry' },
      { name: 'AWS Networking', evidence: ['profile'], note: 'VPC · subnets · security groups' },
    ],
  },
  {
    id: 'iac',
    color: '#8b6cff',
    label: 'Infrastructure as Code',
    blurb: 'Environments described, reviewed and versioned like application code.',
    tools: [
      { name: 'Terraform', evidence: ['repo', 'profile'], note: 'Workspaces, modules, AKS' },
      { name: 'ARM / Bicep', evidence: ['profile'], note: 'PaaS provisioning with Bicep' },
      { name: 'Ansible', evidence: ['profile'] },
    ],
  },
  {
    id: 'containers',
    color: '#22c3e6',
    label: 'Containers & Orchestration',
    blurb: 'Build once, run on a laptop with Minikube or in production on a managed cluster.',
    tools: [
      { name: 'Docker', evidence: ['profile'] },
      { name: 'Docker Compose', evidence: ['profile'], note: 'Multi-container local stacks' },
      { name: 'Kubernetes', evidence: ['repo', 'profile'], note: 'RBAC, NetworkPolicy, securityContext' },
      { name: 'Minikube', evidence: ['profile'], note: 'Local clusters' },
      { name: 'Argo CD / Flux', evidence: ['profile'], note: 'GitOps · 100% of deploys' },
      { name: 'Kustomize', evidence: ['profile'], note: 'Environment overlays' },
      { name: 'Ingress (NGINX · Istio · Traefik)', evidence: ['profile'], note: 'Securing AKS traffic' },
    ],
  },
  {
    id: 'cicd',
    color: '#ff8a3d',
    label: 'CI/CD & Delivery',
    blurb: 'Pipelines that make shipping boring, in a good way.',
    tools: [
      { name: 'GitHub Actions', evidence: ['repo', 'profile'], note: 'Reusable workflows, SARIF upload' },
      { name: 'Azure Pipelines', evidence: ['profile'], note: 'Multi-stage YAML & Classic' },
      { name: 'Jenkins', evidence: ['profile'], note: 'Shift-left security gates' },
      { name: 'GitLab CI/CD', evidence: ['profile'] },
    ],
  },
  {
    id: 'security',
    color: '#5cf2a8',
    label: 'DevSecOps & Security',
    blurb: 'Gates in the pipeline, policies in the cluster, secrets out of the repo.',
    tools: [
      { name: 'Gitleaks', evidence: ['repo', 'profile'], note: 'Secret detection in CI' },
      { name: 'Trivy', evidence: ['profile'], note: 'CVEs, SCA & SBOM' },
      { name: 'Checkov', evidence: ['repo', 'profile'], note: 'Terraform + Kubernetes' },
      { name: 'Kubesec', evidence: ['profile'], note: 'Manifest risk scoring' },
      { name: 'Falco', evidence: ['profile'], note: 'Runtime detection on AKS' },
      { name: 'Embold', evidence: ['repo', 'profile'], note: 'Quality gate + KPIs' },
      { name: 'SonarQube', evidence: ['profile'], note: '+ SonarCloud' },
      { name: 'Front Door WAF', evidence: ['profile'], note: 'Rate limit · DDoS defence' },
      { name: 'SOC 2 controls', evidence: ['profile'], note: 'Compliance analysis' },
      { name: 'HashiCorp Vault', evidence: ['learning'] },
      { name: 'Kyverno / OPA Gatekeeper', evidence: ['learning'] },
    ],
  },
  {
    id: 'observability',
    color: '#ffc23d',
    label: 'Observability',
    blurb: 'Knowing it works, and finding out quickly when it doesn’t.',
    tools: [
      { name: 'Datadog', evidence: ['profile'], note: 'APM & RUM' },
      { name: 'OpenTelemetry', evidence: ['profile'], note: 'Traces · lower MTTD' },
      { name: 'Azure Monitor', evidence: ['profile'] },
      { name: 'Grafana', evidence: ['profile'] },
      { name: 'Infracost', evidence: ['profile'], note: 'Cost tracking & budgets' },
    ],
  },
  {
    id: 'data',
    color: '#ff5d7a',
    label: 'Data & Messaging',
    blurb: 'Highly available databases with automated backup and recovery, plus the queues and caches between services.',
    tools: [
      { name: 'Azure SQL', evidence: ['profile'], note: 'HA + automated backups' },
      { name: 'PostgreSQL', evidence: ['profile'] },
      { name: 'Service Bus', evidence: ['profile'] },
      { name: 'Event Hubs', evidence: ['profile'] },
      { name: 'Redis Cache', evidence: ['profile'] },
    ],
  },
  {
    id: 'scripting',
    color: '#ff6ad5',
    label: 'Scripting & Systems',
    blurb: 'The glue that turns runbooks into one command.',
    tools: [
      { name: 'PowerShell / Az module', evidence: ['repo', 'cert'], note: '20+ ops scripts' },
      { name: 'Bash', evidence: ['repo', 'profile'] },
      { name: 'Python', evidence: ['profile'] },
      { name: 'Linux & Windows Server', evidence: ['repo', 'profile'], note: 'User lifecycle scripts' },
      { name: 'Git / GitHub', evidence: ['repo', 'profile'] },
      { name: 'Jira & Confluence', evidence: ['profile'], note: 'Agile / Scrum' },
    ],
  },
]

/** "Where I operate": rendered by components/HybridMap.tsx. */
export const environments = [
  {
    id: 'onprem',
    name: 'On-prem',
    what: 'Data-centre servers and VMs',
    color: '#ffb547',
    tools: ['Linux', 'Windows Server', 'Ansible', 'Docker Compose'],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    what: 'Primary cloud · AZ-104 certified',
    color: '#5cf2a8',
    tools: ['VMs', 'App Service', 'AKS', 'Storage', 'Key Vault', 'VNet · NSG', 'Reservations'],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    what: 'Second cloud: compute, storage, Kubernetes',
    color: '#9fb7ff',
    tools: ['EC2', 'S3', 'EKS', 'ECR', 'VPC'],
  },
]
