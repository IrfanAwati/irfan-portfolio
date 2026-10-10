/**
 * "Field work": real engagements Irfan described (Oct 2026), with outcomes
 * and employers taken from his CV (Irfan_Awati_CV_2026.pdf).
 * `practices` are the best practices applied.
 */

export type FieldWork = {
  id: string
  kicker: string
  title: string
  color: string
  visual: 'migrate' | 'replatform' | 'finops' | 'gitops'
  summary: string
  /** headline result from the CV */
  outcome: string
  org: string
  did: string[]
  practices: string[]
  stack: string[]
}

export const fieldWork: FieldWork[] = [
  {
    id: 'vm-migration',
    kicker: 'Migration',
    title: 'On-prem VMs → Azure',
    outcome: '30+ VMs migrated',
    org: 'Asistex · 2020–22',
    color: '#3b9cff',
    visual: 'migrate',
    summary: 'Moved more than 30 on-premises virtual machines into Azure, improving reliability, scalability and disaster recovery.',
    did: [
      'Migrated 30+ on-prem VM workloads to Azure virtual machines.',
      'Rebuilt the network around them in the cloud: address spaces, subnets and security rules.',
      'Moved managed disks between environments with PowerShell, including across tenants.',
    ],
    practices: [
      'Inventory and dependency-map every VM before moving anything.',
      'Move in waves, with a tested rollback plan for each cutover.',
      'Right-size on arrival instead of copying on-prem specs one for one.',
      'Managed disks, encryption at rest and least-privilege NSG rules from day one.',
    ],
    stack: ['On-prem / hybrid', 'Azure VMs', 'Azure Networking', 'PowerShell / Az module'],
  },
  {
    id: 'webapp-aks',
    kicker: 'Re-platforming',
    title: 'Azure Web Apps → AKS',
    outcome: 'Terraform-led, containerised',
    org: 'Lisec Middle East · 2023–now',
    color: '#22c3e6',
    visual: 'replatform',
    summary: 'Moved applications from Azure App Service (Web Apps) onto Azure Kubernetes Service.',
    did: [
      'Containerised business-critical applications that previously ran on App Service.',
      'Provisioned the target platform with Terraform and moved the workloads onto AKS.',
      'Secured ingress with NGINX, Istio and Traefik controllers, and added Falco for runtime threat detection.',
    ],
    practices: [
      'Immutable, versioned images; never deploy `latest`.',
      'CPU and memory requests and limits, plus liveness and readiness probes, on every container.',
      'Horizontal autoscaling driven by real load.',
      'Secrets from Key Vault, not baked into images or manifests.',
      'Manifests scanned with Checkov before they reach the cluster.',
    ],
    stack: ['App Service', 'AKS', 'Docker', 'Terraform', 'Falco', 'Azure Key Vault'],
  },
  {
    id: 'finops',
    kicker: 'FinOps',
    title: 'Cutting cloud costs',
    outcome: '> €10,000 saved / year',
    org: 'Lisec Middle East · 2023–now',
    color: '#ffc23d',
    visual: 'finops',
    summary:
      'Lowered cloud spend in two ways: capacity that follows demand, and 3-year commitments for the steady baseline.',
    did: [
      'Scaled and scheduled resources to follow actual demand, up when busy and down when quiet.',
      'Bought 3-year reservations and savings plans for always-on workloads to get the deeper discount.',
      'Added granular cost tracking across subscriptions, with Infracost and budget alerts, so month-end bills hold no surprises.',
    ],
    practices: [
      'Commit only the proven baseline; flexible capacity covers the rest.',
      'Switch non-production off out of hours by default.',
      'Tag every resource with owner, environment and cost centre.',
      'Review utilisation before renewing or expanding a commitment.',
    ],
    stack: ['Reservations (3-yr)', 'Infracost', 'Azure VMs', 'PowerShell / Az module'],
  },
  {
    id: 'gitops',
    kicker: 'Delivery',
    title: 'GitOps with Argo CD & Flux',
    outcome: '100% of deployments automated',
    org: 'Lisec Middle East · 2023–now',
    color: '#5cf2a8',
    visual: 'gitops',
    summary:
      'Built a GitOps framework on AKS with Argo CD and Flux, and used the same model to ship our applications to many customer-hosted servers.',
    did: [
      'Defined every environment declaratively in Git, with Kustomize overlays for consistent state.',
      'Automated 100% of deployments; releases are Git changes, not manual installs.',
      'Rolled out to customer servers through the same pull-based workflow.',
    ],
    practices: [
      'Pull-based agents, so customer networks never need inbound access.',
      'One base configuration plus small per-customer overlays.',
      'Every change is a reviewed commit, and rollback is a `git revert`.',
      'Drift detection keeps servers matching what Git says.',
      'Secrets kept out of Git and referenced from a vault.',
    ],
    stack: ['Argo CD / Flux', 'Kustomize', 'AKS', 'Git / GitHub', 'Linux & Windows Server'],
  },
]

/** Headline numbers, all stated in the CV. */
export const impact = [
  { value: 6, suffix: '+', label: 'years in DevOps & cloud', color: '#3b9cff' },
  { value: 30, suffix: '+', label: 'on-prem VMs migrated to Azure', color: '#22c3e6' },
  { value: 10, prefix: '€', suffix: 'k+', label: 'cloud spend saved per year', color: '#ffc23d' },
  { value: 100, suffix: '%', label: 'deployments via GitOps', color: '#5cf2a8' },
  { value: 99.9, suffix: '%', label: 'deployment success rate', color: '#ff6ad5', decimals: 1 },
]
