/**
 * "DevSecOps in motion" simulator data. An illustrative model of a secure
 * delivery pipeline, not a claim about any employer's production system.
 * `source: 'mine'` stages are implemented in Irfan's public DevSecOps repo;
 * 'prod' stages run in production at Lisec (per his CV); 'roadmap' stages are on his learning roadmap.
 */

export type StageId = 'commit' | 'secrets' | 'quality' | 'iac' | 'build' | 'image' | 'admit' | 'deploy' | 'runtime'

export type Stage = {
  id: StageId
  name: string
  tool: string
  source: 'mine' | 'prod' | 'roadmap' | 'stack'
  pass: string
}

export const stages: Stage[] = [
  { id: 'commit', name: 'Pull request', tool: 'git push', source: 'stack', pass: 'PR #42 opened against main' },
  { id: 'secrets', name: 'Secret scan', tool: 'Gitleaks', source: 'mine', pass: 'gitleaks: no leaks found' },
  { id: 'quality', name: 'Code quality', tool: 'Embold · Sonar', source: 'mine', pass: 'quality gate: PASSED' },
  { id: 'iac', name: 'IaC scan', tool: 'Checkov', source: 'mine', pass: 'checkov: terraform + k8s, 0 failed' },
  { id: 'build', name: 'Build', tool: 'Docker', source: 'stack', pass: 'image built and tagged with commit sha' },
  { id: 'image', name: 'Image scan', tool: 'Trivy', source: 'prod', pass: 'trivy: 0 CRITICAL, 0 HIGH' },
  { id: 'admit', name: 'Admission', tool: 'Kyverno / OPA', source: 'roadmap', pass: 'policies: 6/6 satisfied' },
  { id: 'deploy', name: 'Deploy', tool: 'AKS · Argo CD / Flux', source: 'prod', pass: 'rollout complete, 3/3 ready' },
  { id: 'runtime', name: 'Runtime + monitor', tool: 'Falco · Datadog', source: 'prod', pass: 'no anomalies · SLOs green' },
]

export type Scenario = {
  id: string
  label: string
  change: string
  catchAt: StageId | null
  finding: string
  verdictTitle: string
  verdict: string
  fix: string
}

export const scenarios: Scenario[] = [
  {
    id: 'clean',
    label: 'Clean feature',
    change: 'feat: add health endpoint',
    catchAt: null,
    finding: '',
    verdictTitle: 'Shipped, and watched.',
    verdict:
      'Every gate passed, so the change deployed without anyone stepping in. Security added no friction for good code.',
    fix: 'Nothing to fix. Monitoring keeps checking after release.',
  },
  {
    id: 'secret',
    label: 'Leaked API key',
    change: 'chore: update app config',
    catchAt: 'secrets',
    finding: 'generic-api-key  config/app.env:12',
    verdictTitle: 'Stopped before merge.',
    verdict:
      'Gitleaks matched a credential pattern in the PR diff. The SARIF report is uploaded, the job summary flags it, and the PR cannot merge.',
    fix: 'Rotate the key, move it to Key Vault or Actions secrets, and scan full history (fetch-depth: 0) if it was ever pushed.',
  },
  {
    id: 'quality',
    label: 'Failing quality gate',
    change: 'refactor: payment module',
    catchAt: 'quality',
    finding: 'qualityGateStatus = FAILED  (new critical issues)',
    verdictTitle: 'Blocked by the quality gate.',
    verdict:
      'Embold scanned the snapshot and the gate failed. The workflow writes the KPI table to the job summary and exits non-zero.',
    fix: 'Open the linked Embold report, fix the new critical issues, and push again. The gate re-evaluates automatically.',
  },
  {
    id: 'iac',
    label: 'Insecure storage (Terraform)',
    change: 'infra: add storage account',
    catchAt: 'iac',
    finding: 'CKV_AZURE_3 secure transfer · CKV_AZURE_44 min TLS 1.2',
    verdictTitle: 'Misconfiguration caught in review.',
    verdict:
      'Checkov flagged the storage account for allowing HTTP and an old TLS version. Findings appear in GitHub’s Security tab under the checkov-terraform category.',
    fix: 'Set https-only and min_tls_version = "TLS1_2", exactly as the hardened azure-base module does.',
  },
  {
    id: 'cve',
    label: 'Vulnerable base image',
    change: 'build: bump base image',
    catchAt: 'image',
    finding: 'CRITICAL CVE in openssl (base layer)',
    verdictTitle: 'Image never reaches the registry.',
    verdict:
      'The code and IaC were fine, but the container pulled in a critical CVE. Trivy fails the build on CRITICAL severity.',
    fix: 'Rebase onto a patched or distroless image and rebuild. Trivy also produces an SBOM for every image.',
  },
  {
    id: 'registry',
    label: 'Untrusted registry',
    change: 'deploy: hotfix from personal registry',
    catchAt: 'admit',
    finding: 'policy require-trusted-registry: denied',
    verdictTitle: 'Rejected by the cluster.',
    verdict:
      'A manifest referenced an image outside the approved registry. The admission controller refused it, even though everything upstream passed.',
    fix: 'Push through the pipeline to the approved registry. Policy-as-code is the “enforce” phase of my roadmap.',
  },
  {
    id: 'runtime',
    label: 'Shell in a running pod',
    change: '(post-deploy event)',
    catchAt: 'runtime',
    finding: 'Falco: Terminal shell in container',
    verdictTitle: 'Detected at runtime.',
    verdict:
      'No static check can see this. Runtime detection noticed an interactive shell in a production pod and alerted on-call.',
    fix: 'Investigate, isolate the pod, and tighten RBAC on exec. This is defence in depth, not a replacement for the earlier gates.',
  },
]
