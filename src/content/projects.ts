/**
 * Featured case studies. Everything here is drawn from the public repos at
 * github.com/IrfanAwati. To add a project, append an object; `diagram`
 * picks which animated diagram renders (see components/ProjectDiagram.tsx),
 * or use 'none'.
 */

export type Project = {
  id: string
  index: string
  title: string
  tagline: string
  repo?: string
  diagram: 'gates' | 'toolkit' | 'baseline' | 'none'
  problem: string
  objective: string
  architecture: string[]
  stack: string[]
  security: string[]
  outcome: string
  lessons: string
}

export const projects: Project[] = [
  {
    id: 'security-gates',
    index: '01',
    title: 'Pipeline Security Gates',
    tagline: 'Secret, IaC and code-quality scanning wired into every pull request.',
    repo: 'https://github.com/IrfanAwati/DevSecOps',
    diagram: 'gates',
    problem:
      'Without automated checks, a leaked credential or a public storage account is only caught if a reviewer happens to notice it. Usually that happens after merge, when cleanup is expensive.',
    objective:
      'Make security checks part of the merge path itself, so findings show up in the pull request and in GitHub’s Security tab and don’t depend on someone remembering to look.',
    architecture: [
      'Gitleaks runs on PRs (opened / reopened / synchronize), on pushes to main and on manual dispatch, uploads a SARIF artifact and writes a job summary.',
      'Checkov runs two separate workflows, one for Terraform and one for Kubernetes manifests, emitting both CLI and SARIF output.',
      'SARIF goes to GitHub code scanning via codeql-action/upload-sarif under its own category, so findings are tracked per scanner.',
      'A reusable Embold workflow (workflow_call) takes a repo ID and API secret, enforces a quality gate, then queries Embold’s API to publish the gate status and KPIs as a Markdown table in the job summary.',
    ],
    stack: ['GitHub Actions', 'Gitleaks', 'Checkov', 'Embold', 'SARIF', 'Terraform', 'Kubernetes'],
    security: [
      'Least-privilege job tokens: contents: read, plus security-events: write only where SARIF is uploaded.',
      'Secrets come from the Actions secret store; nothing sensitive is committed.',
      'Quality gate failure exits non-zero, so the merge is blocked, not just warned about.',
      'Snapshot labels include the branch and run number so every scan is traceable.',
    ],
    outcome:
      'A drop-in set of workflows that any repo can call. Findings land in the Security tab with history, and reviewers see a readable summary without opening a separate tool.',
    lessons:
      'Shallow checkout (fetch-depth: 1) is fast but misses secrets in old commits. The repo documents when to switch to full history. A scan is only useful if people read its output, so the job summary matters as much as the scanner.',
  },
  {
    id: 'azure-baseline',
    index: '02',
    title: 'Secure-by-Default Azure Baseline',
    tagline: 'A Terraform module and Kubernetes manifests written to pass Checkov.',
    repo: 'https://github.com/IrfanAwati/DevSecOps/tree/main/checkov',
    diagram: 'baseline',
    problem:
      'Most IaC examples are written to work, not to be secure. They get copied into real projects and bring password logins, open NSGs and unencrypted disks with them.',
    objective:
      'Build a reference Azure environment and workload in which every common Checkov rule passes, and document the bad and good versions of each fix for beginners.',
    architecture: [
      'Terraform azure-base module: resource group, storage account, Key Vault, VNet + subnet, NSG, public IP, NIC, Linux VM and disk encryption set.',
      'Kubernetes deployment bundling a Pod spec, Service, ServiceAccount, Role/RoleBinding and NetworkPolicy, plus a Pod Security Policy.',
      'A NOTES.md remediation guide maps Checkov rule IDs (CKV_AZURE_*, CKV_K8S_*) to the bad and good code for each.',
    ],
    stack: ['Terraform', 'azurerm', 'Key Vault', 'Kubernetes', 'Checkov'],
    security: [
      'SSH-key-only VM access, managed disks and customer-managed-key disk encryption.',
      'HTTPS-only storage with minimum TLS 1.2. Key Vault with RBAC and purge protection.',
      'NSG rules scoped to an allowed SSH CIDR. Variables keep real values in an untracked tfvars.',
      'Pods run as non-root with a read-only root FS, all capabilities dropped, and resource limits and probes set.',
    ],
    outcome:
      'A copyable starting point that passes the scan, plus a guide explaining why each control exists. It doubles as test input for the pipeline gates.',
    lessons:
      'Writing the bad and good examples side by side teaches more than the scanner output alone. PodSecurityPolicy is now deprecated upstream, so Pod Security Admission or Kyverno is the next step.',
  },
  {
    id: 'ps-toolkit',
    index: '03',
    title: 'Azure Operations Toolkit',
    tagline: '20+ PowerShell & Bash scripts for governance, security posture and cost visibility.',
    repo: 'https://github.com/IrfanAwati/Powershell',
    diagram: 'toolkit',
    problem:
      'Day-to-day Azure administration (posture checks, access reviews, cost questions, user lifecycle) takes a lot of portal clicking, and it is easy to get it slightly wrong across many subscriptions.',
    objective:
      'Turn recurring admin tasks into repeatable scripts that work across resource groups, subscriptions and even tenants.',
    architecture: [
      'Security posture: enforce minimum TLS on Storage and Web Apps, require secure transfer, report NSG rules, and flag service principals whose secrets are expiring.',
      'Governance & reporting: subscription access reports, cost per resource group, weekly performance reports, and VMs on dynamic IPs across subscriptions.',
      'Operations: scale resources up or down, copy managed disks to another tenant for VM migration, add diagnostic settings, and bulk-upload blobs.',
      'Identity lifecycle: bulk user onboarding into Azure AD B2C, and orchestrated user removal on Linux (Bash) and Windows hosts.',
    ],
    stack: ['PowerShell', 'Az module', 'Bash', 'Azure Storage', 'Azure AD B2C', 'Azure Monitor'],
    security: [
      'SPN secret-expiry reporting catches credential rot before it causes an outage.',
      'TLS and secure-transfer scripts enforce the controls rather than only reporting them.',
      'User de-provisioning is scripted so it is complete and the same every time.',
    ],
    outcome:
      'A personal runbook library. Each one-off investigation becomes a script the next person can rerun.',
    lessons:
      'The useful scripts are usually the boring ones: reports that answer “who has access?” and “what does this cost?” in a few seconds.',
  },
]

/** Portrait for the "Before the cloud" block. AI-enhanced (lighting and pose) from Irfan's own photo. */
export const earlyPhoto = {
  src: '/about/irfan-early.webp',
  alt: 'Irfan Awati seated on a stool in a white patterned shirt, studio portrait with soft lighting',
  caption: 'Irfan Awati · builder at heart',
}

export const earlyWork = [
  {
    title: 'Smart Parking System',
    period: '2015',
    note: 'Selected by LEAD Deshpande Foundation for Smart City implementation and praised by Anousheh Ansari.',
  },
  {
    title: 'Automated Guided Vehicle',
    period: '2015 – 16',
    note: 'A mobile robot that follows floor markers to move material around a facility. My first automation.',
  },
  {
    title: 'Solar-still desalination',
    period: '2018 – 19',
    note: 'Double-slope, single-basin stills that produce drinking water from brackish sources using only sunlight.',
  },
]
