import { motion, useReducedMotion } from 'motion/react'
import { EASE } from './ease'
import { useTheme } from '../theme/palette'

/** Theme-aware diagram colours. */
function useC() {
  const { palette: P } = useTheme()
  return { INK: P.ink, DIM: P.line2, SIG: P.signal, AMB: P.amber, BG3: P.bg3, INK2: P.ink2, INK3: P.ink3, BLUE: P.blue }
}
const MONO = 'Geist Mono, ui-monospace, monospace'

function useDraw() {
  const reduce = useReducedMotion()
  return (delay = 0, dur = 1.1) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '-15% 0px' },
    transition: { duration: dur, ease: EASE, delay },
  })
}
function useAppear() {
  const reduce = useReducedMotion()
  return (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-15% 0px' },
    transition: { duration: 0.8, ease: EASE, delay },
  })
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent,
  delay = 0,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  accent?: string
  delay?: number
}) {
  const appear = useAppear()
  const C = useC()
  const stroke = accent ?? C.INK
  return (
    <motion.g {...appear(delay)}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.BG3} stroke={stroke} strokeOpacity={0.55} />
      <text x={x + 14} y={y + (sub ? 20 : h / 2 + 5)} fill={C.INK} fontSize={13} fontWeight={500}>
        {label}
      </text>
      {sub && (
        <text x={x + 14} y={y + 36} fill={C.INK3} fontSize={10.5} fontFamily={MONO}>
          {sub}
        </text>
      )}
    </motion.g>
  )
}

/** Travelling packet along a path (SMIL, disabled for reduced motion). */
function Flow({ d, color, dur = 3, begin = 0 }: { d: string; color?: string; dur?: number; begin?: number }) {
  const reduce = useReducedMotion()
  const C = useC()
  if (reduce) return null
  return (
    <circle r={3} fill={color ?? C.SIG}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
    </circle>
  )
}

function GatesDiagram() {
  const C = useC()
  const draw = useDraw()
  const appear = useAppear()
  const src = { x: 24, y: 160 }
  const lanes = [
    { y: 40, label: 'Gitleaks', sub: 'secrets · PR + push', to: 'sarif' },
    { y: 116, label: 'Checkov · Terraform', sub: 'iac · azurerm', to: 'sarif' },
    { y: 192, label: 'Checkov · Kubernetes', sub: 'iac · manifests', to: 'sarif' },
    { y: 268, label: 'Embold', sub: 'quality gate · KPIs', to: 'summary' },
  ]
  const fan = (y: number) => `M${src.x + 104} ${src.y + 22} C 160 ${src.y + 22}, 150 ${y + 22}, 196 ${y + 22}`
  const out = (y: number, to: string) =>
    to === 'sarif' ? `M372 ${y + 22} C 404 ${y + 22}, 394 116, 420 116` : `M372 ${y + 22} C 400 ${y + 22}, 396 290, 420 290`
  return (
    <svg viewBox="0 0 680 340" role="img" aria-label="Diagram: a pull request fans out to Gitleaks, Checkov for Terraform, Checkov for Kubernetes and Embold; results flow to GitHub code scanning via SARIF and to the job summary, and both feed the merge decision.">
      <Box x={src.x} y={src.y} w={104} h={44} label="pull_request" accent={C.INK} />
      {lanes.map((l, i) => (
        <g key={l.label}>
          <motion.path d={fan(l.y)} stroke={C.DIM} fill="none" {...draw(0.1 + i * 0.08)} />
          <Flow d={fan(l.y) + ' ' + out(l.y, l.to).replace('M', 'L')} dur={3.2} begin={i * 0.7} color={l.to === 'summary' ? C.AMB : C.SIG} />
          <Box x={196} y={l.y} w={176} h={44} label={l.label} sub={l.sub} accent={C.SIG} delay={0.25 + i * 0.08} />
          <motion.path d={out(l.y, l.to)} stroke={C.DIM} fill="none" {...draw(0.6 + i * 0.06)} />
        </g>
      ))}
      <Box x={420} y={94} w={150} h={44} label="SARIF → Security" sub="code scanning, per category" accent={C.SIG} delay={0.8} />
      <Box x={420} y={268} w={150} h={44} label="Job summary" sub="gate status + KPI table" accent={C.AMB} delay={0.9} />
      <motion.path d="M570 116 C 610 116, 600 160, 628 182" stroke={C.DIM} fill="none" {...draw(1.05)} />
      <motion.path d="M570 290 C 610 290, 600 204, 628 182" stroke={C.DIM} fill="none" {...draw(1.05)} />
      <motion.g {...appear(1.2)}>
        <rect x={616} y={170} width={24} height={24} rx={4} transform="rotate(45 628 182)" fill={C.BG3} stroke={C.SIG} />
        <text x={628} y={226} textAnchor="middle" fill={C.INK} fontSize={11} fontFamily={MONO}>
          merge
        </text>
        <text x={628} y={240} textAnchor="middle" fill={C.INK3} fontSize={10} fontFamily={MONO}>
          gate
        </text>
      </motion.g>
    </svg>
  )
}

function BaselineDiagram() {
  const C = useC()
  const draw = useDraw()
  const appear = useAppear()
  const checks = [
    'SSH keys only',
    'Managed + CMK-encrypted disks',
    'HTTPS-only storage · TLS 1.2',
    'Key Vault: RBAC + purge protection',
    'NSG scoped to allowed CIDR',
    'Pods non-root · read-only FS',
  ]
  return (
    <svg viewBox="0 0 680 360" role="img" aria-label="Diagram: a resource group containing a virtual network, subnet with NSG and a Linux VM, alongside Key Vault, storage and a disk encryption set, with a checklist of passing Checkov controls.">
      <motion.rect x={20} y={20} width={410} height={320} rx={14} fill="none" stroke={C.DIM} strokeDasharray="4 6" {...draw(0)} />
      <motion.text x={36} y={44} fill={C.INK3} fontSize={11} fontFamily={MONO} {...appear(0.2)}>
        resource group · azure-base
      </motion.text>
      <motion.rect x={40} y={62} width={240} height={258} rx={12} fill="none" stroke={C.SIG} strokeOpacity={0.4} {...draw(0.2)} />
      <motion.text x={56} y={86} fill={C.SIG} fontSize={11} fontFamily={MONO} {...appear(0.4)}>
        vnet
      </motion.text>
      <motion.rect x={58} y={100} width={204} height={200} rx={10} fill="none" stroke={C.SIG} strokeOpacity={0.28} {...draw(0.35)} />
      <motion.text x={74} y={122} fill={C.INK2} fontSize={11} fontFamily={MONO} {...appear(0.5)}>
        subnet · nsg
      </motion.text>
      <Box x={76} y={140} w={168} h={48} label="Linux VM" sub="ssh-key · managed disk" accent={C.SIG} delay={0.6} />
      <Box x={76} y={204} w={168} h={48} label="NIC + Public IP" sub="ssh from allowed_cidr" accent={C.INK} delay={0.7} />
      <Box x={298} y={70} w={116} h={48} label="Key Vault" sub="rbac · purge-prot" accent={C.SIG} delay={0.75} />
      <Box x={298} y={134} w={116} h={48} label="Storage" sub="https · tls1_2" accent={C.SIG} delay={0.85} />
      <Box x={298} y={198} w={116} h={48} label="Disk Enc. Set" sub="cmk from kv" accent={C.SIG} delay={0.95} />
      <motion.path d="M356 118 L356 134 M356 182 L356 198 M298 222 C 270 222, 270 164, 244 164" stroke={C.DIM} fill="none" {...draw(1)} />

      <motion.text x={456} y={44} fill={C.INK3} fontSize={11} fontFamily={MONO} {...appear(0.9)}>
        checkov --framework terraform,kubernetes
      </motion.text>
      {checks.map((c, i) => (
        <motion.g key={c} {...appear(1.1 + i * 0.12)}>
          <rect x={456} y={66 + i * 44} width={20} height={20} rx={5} fill={C.SIG} fillOpacity={0.14} stroke={C.SIG} />
          <path d={`M461 ${76 + i * 44} l3.5 3.5 6-7`} stroke={C.SIG} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <text x={486} y={80 + i * 44} fill={C.INK} fontSize={12.5}>
            {c}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

const TREE: { cat: string; color: 'SIG' | 'AMB' | 'INK' | 'BLUE'; files: string[] }[] = [
  {
    cat: 'security posture',
    color: 'SIG',
    files: [
      'Set Minimum TLS version for Storage account.ps1',
      'List Minimum TLS version of WebApp in RG.ps1',
      'set secure transfer required in storage.ps1',
      'get SPN details with secret expiry.ps1',
      'get nsg details.ps1',
    ],
  },
  {
    cat: 'governance & cost',
    color: 'AMB',
    files: [
      'get access report of subscriptions.ps1',
      'get azure resource group wise cost.ps1',
      'get weekly performance report.ps1',
      'get VM name which has dynamic IP from multiple subscription.ps1',
    ],
  },
  {
    cat: 'operations',
    color: 'INK',
    files: [
      'autoscale resources/scale up the resources.ps1',
      'VM migration disk copy script/move azure disk to another tenant.ps1',
      'add-diagnostic-settings-storageaccount/…',
      'upload multiple files into blob storage.ps1',
    ],
  },
  {
    cat: 'identity lifecycle',
    color: 'BLUE',
    files: [
      'upload bulk users in azure b2c tenant.ps1',
      'delete-linux-users/deletelinuxuser.sh',
      'delete-windows-users/deletewindowsusers.ps1',
    ],
  },
]

function ToolkitDiagram() {
  const C = useC()
  const reduce = useReducedMotion()
  let n = 0
  return (
    <div className="toolkit" role="img" aria-label="A file tree of the PowerShell repository, grouped into security posture, governance and cost, operations, and identity lifecycle scripts.">
      <div className="toolkit-prompt">
        <span style={{ color: C.SIG }}>~/IrfanAwati/Powershell $</span> tree --by-purpose
      </div>
      {TREE.map((g) => (
        <div key={g.cat} className="toolkit-group">
          <motion.div
            className="toolkit-cat"
            style={{ color: C[g.color] }}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: n++ * 0.04 }}
          >
            ▸ {g.cat} <span>({g.files.length})</span>
          </motion.div>
          {g.files.map((f) => (
            <motion.div
              key={f}
              className="toolkit-file"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: n++ * 0.04 }}
            >
              <i style={{ background: C[g.color] }} />
              {f}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function ProjectDiagram({ kind }: { kind: 'gates' | 'toolkit' | 'baseline' | 'none' }) {
  if (kind === 'none') return null
  const caption = {
    gates: ['.github/workflows', 'live flow'],
    baseline: ['checkov/terraform-dummy · kubernetes-dummy', 'all checks pass'],
    toolkit: ['IrfanAwati/Powershell', 'from the repo'],
  }[kind]
  return (
    <div className="diagram-frame">
      <div className="diagram-cap">
        <span>{caption[0]}</span>
        <i>● {caption[1]}</i>
      </div>
      <div style={{ padding: kind === 'toolkit' ? 0 : '18px 14px' }}>
        {kind === 'gates' && <GatesDiagram />}
        {kind === 'baseline' && <BaselineDiagram />}
        {kind === 'toolkit' && <ToolkitDiagram />}
      </div>
    </div>
  )
}
