/**
 * Career + education timeline, from Irfan's CV (Irfan_Awati_CV_2026.pdf) and LinkedIn.
 */

export type JourneyStop = {
  id: string
  period: string
  title: string
  org: string
  place?: string
  kind: 'education' | 'work' | 'milestone'
  summary: string
  tags: string[]
  source: string
}

export const journey: JourneyStop[] = [
  {
    id: 'diploma',
    period: '2013 – 2016',
    title: 'Diploma, Mechanical Engineering',
    org: 'Raibag Polytechnic',
    place: 'Belgaum, Karnataka',
    kind: 'education',
    summary:
      'Built a Smart Parking System that LEAD Deshpande Foundation selected for Smart City implementation, and an automated guided vehicle. Won first place at a national paper presentation on “Smart Automobiles”.',
    tags: ['Smart Parking', 'AGV', 'Paper presentations'],
    source: 'CV · LinkedIn: Projects, Honors',
  },
  {
    id: 'dsatm',
    period: '2016 – 2019',
    title: 'B.E., Mechanical Engineering',
    org: 'Dayananda Sagar Academy of Technology & Management',
    place: 'Bengaluru',
    kind: 'education',
    summary:
      'Final-year research on water desalination with double-slope, single-basin solar stills: clean water from brackish sources using only the sun.',
    tags: ['Research', 'Renewables'],
    source: 'CV · LinkedIn',
  },
  {
    id: 'asistex',
    period: 'Jun 2020 – Aug 2022',
    title: 'Azure DevOps Engineer',
    org: 'Asistex',
    place: 'Pune',
    kind: 'work',
    summary:
      'Migrated 30+ on-premises VMs to Azure. Built modular Terraform with workspaces and reusable modules, and ran multi-stage CI/CD for .NET and Java apps. Also provisioned AWS EC2, S3 and VPC networking, and added SonarQube quality gates.',
    tags: ['Azure', 'Terraform', 'AWS', 'SonarQube', 'PowerShell'],
    source: 'CV',
  },
  {
    id: 'atlas',
    period: 'Oct 2022 – Aug 2023',
    title: 'Azure DevOps Engineer',
    org: 'Atlas Systems',
    place: 'Bengaluru · clients: Knipper Health, Himalaya, IDT',
    kind: 'work',
    summary:
      'Provisioned PaaS (App Services, Service Bus, Redis, Event Hubs) with Bicep. Released through Dev → QA → SIT → UAT → Prod at a 99.9% deployment success rate. Ran SOC 2 controls analysis and set up SonarCloud gates.',
    tags: ['Bicep', 'Azure Pipelines', 'SonarCloud', 'SOC 2'],
    source: 'CV · recommendation from Doug Srofe (Knipper)',
  },
  {
    id: 'certs',
    period: '2023 – 2024',
    title: 'Azure certification track',
    org: 'Microsoft · Udemy',
    kind: 'milestone',
    summary:
      'Azure Fundamentals (Jan 2023), Automating Administration with Windows PowerShell (Feb 2023), then Microsoft Certified: Azure Administrator Associate (Jul 2024).',
    tags: ['AZ-900', 'AZ-104', 'PowerShell'],
    source: 'LinkedIn · CV',
  },
  {
    id: 'lisec',
    period: 'Aug 2023 – Present',
    title: 'DevOps Engineer',
    org: 'Lisec Middle East',
    place: 'Dubai',
    kind: 'work',
    summary:
      'GitOps on AKS with Argo CD and Flux (100% of deployments). Shift-left gates with Gitleaks, Trivy, Checkov, Kubesec and Embold/SonarCloud, plus Falco at runtime. Web Apps → AKS migration, Front Door WAF rate limiting, Key Vault, Datadog/OpenTelemetry, and FinOps saving over €10k a year.',
    tags: ['AKS', 'Argo CD', 'Flux', 'Trivy', 'Falco', 'FinOps'],
    source: 'CV',
  },
  {
    id: 'roadmap',
    period: '2026',
    title: 'Public DevOps → DevSecOps roadmap',
    org: 'Learning in public',
    kind: 'milestone',
    summary:
      'A 12-month plan to go deeper, from detecting problems to enforcing fixes: policy-as-code (Kyverno / OPA), Vault and runtime security, shared month by month.',
    tags: ['OWASP', 'Kyverno', 'Vault', 'Falco'],
    source: 'LinkedIn post',
  },
]
