// Copies the tool logos the site uses into public/icons/ (run: node scripts/extract-icons.mjs).
// Sources: devicon (MIT) and simple-icons (CC0). Tools with no published icon get a
// monogram badge in the UI instead (see src/content/tools.ts).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public', 'icons')
fs.mkdirSync(out, { recursive: true })

const dev = (n, v = 'original') => path.join(root, 'node_modules/devicon/icons', n, `${n}-${v}.svg`)
const si = (n) => path.join(root, 'node_modules/simple-icons/icons', `${n}.svg`)

/** slug -> [source file, optional brand fill for single-colour simple-icons] */
const MAP = {
  azure: [dev('azure')],
  aws: [dev('amazonwebservices', 'plain-wordmark')],
  kubernetes: [dev('kubernetes', 'plain')],
  docker: [dev('docker')],
  terraform: [dev('terraform')],
  ansible: [dev('ansible')],
  jenkins: [dev('jenkins')],
  gitlab: [dev('gitlab')],
  github: [dev('github')],
  githubactions: [dev('githubactions')],
  git: [dev('git')],
  linux: [si('linux'), '#1a1a1a'],
  bash: [dev('bash')],
  powershell: [dev('powershell')],
  python: [dev('python')],
  grafana: [dev('grafana')],
  argocd: [dev('argocd')],
  azuredevops: [dev('azuredevops')],
  sonarqube: [dev('sonarqube')],
  vault: [si('vault'), '#FFD814'],
  windows: [dev('windows11')],
  ubuntu: [dev('ubuntu')],
  datadog: [dev('datadog')],
  helm: [dev('helm')],
  trivy: [si('trivy'), '#1904DA'],
  falco: [si('falco'), '#00AEC7'],
  flux: [si('flux'), '#5468FF'],
  postgresql: [dev('postgresql')],
  redis: [dev('redis')],
  jira: [dev('jira')],
  confluence: [dev('confluence')],
  opentelemetry: [dev('opentelemetry')],
  nginx: [dev('nginx')],
  infracost: [si('infracost'), '#DB44B8'],
}

for (const [slug, [src, fill]] of Object.entries(MAP)) {
  let svg = fs.readFileSync(src, 'utf8')
  if (fill) svg = svg.replace('<svg ', `<svg fill="${fill}" `)
  fs.writeFileSync(path.join(out, `${slug}.svg`), svg)
}
console.log(`wrote ${Object.keys(MAP).length} icons to public/icons`)
