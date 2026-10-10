import { useReducedMotion } from 'motion/react'
import { useTheme } from '../theme/palette'

/** Small explanatory animations for the Field work cards (SMIL; static when motion is reduced). */
export function FieldVisual({ kind, color }: { kind: 'migrate' | 'replatform' | 'finops' | 'gitops'; color: string }) {
  const reduce = useReducedMotion()
  const { palette: P } = useTheme()
  const mono = { fontFamily: 'Geist Mono, monospace', fontSize: 10, fill: P.ink3 }
  const dot = (path: string, dur: number, begin = 0) =>
    reduce ? null : (
      <circle r={3} fill={color}>
        <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
    )

  if (kind === 'migrate') {
    const path = 'M88 75 C 150 30, 210 30, 272 75'
    return (
      <svg viewBox="0 0 360 140" aria-hidden="true">
        {/* rack */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={36} y={42 + i * 22} width={52} height={17} rx={4} fill={P.bg3} stroke={P.line2} />
            <circle cx={46} cy={50.5 + i * 22} r={2} fill={P.amber} />
            <path d={`M56 ${50.5 + i * 22}h22`} stroke={P.line2} />
          </g>
        ))}
        <text x={62} y={124} textAnchor="middle" {...mono}>
          on-prem
        </text>
        <path d={path} fill="none" stroke={color} strokeOpacity={0.4} strokeDasharray="4 6" />
        {dot(path, 2.4)}
        {dot(path, 2.4, 0.8)}
        {dot(path, 2.4, 1.6)}
        {/* cloud */}
        <path
          d="M282 98h44a17 17 0 0 0 2-34 24 24 0 0 0-46-6 18 18 0 0 0 0 40Z"
          fill={P.bg3}
          stroke={color}
          strokeOpacity={0.7}
        />
        <rect x={292} y={72} width={11} height={9} rx={2} fill={color} opacity={0.8} />
        <rect x={307} y={72} width={11} height={9} rx={2} fill={color} opacity={0.55} />
        <text x={306} y={124} textAnchor="middle" {...mono}>
          cloud vms
        </text>
      </svg>
    )
  }

  if (kind === 'replatform') {
    const pods = [
      [262, 50],
      [298, 50],
      [280, 82],
      [316, 82],
      [244, 82],
    ]
    return (
      <svg viewBox="0 0 360 140" aria-hidden="true">
        <rect x={34} y={46} width={84} height={52} rx={8} fill={P.bg3} stroke={P.line2} />
        <text x={76} y={70} textAnchor="middle" fontSize={11} fill={P.ink}>
          Web App
        </text>
        <text x={76} y={86} textAnchor="middle" {...mono}>
          app service
        </text>
        <path d="M128 72h86" stroke={color} strokeOpacity={0.5} strokeDasharray="4 6" />
        <path d="M208 66l8 6-8 6" fill="none" stroke={color} />
        {dot('M128 72h86', 1.6)}
        {/* AKS hex pods */}
        {pods.map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M${x} ${y - 13}l11 6.5v13L${x} ${y + 13}l-11-6.5v-13Z`}
              fill={P.bg3}
              stroke={color}
              strokeOpacity={0.75}
            >
              {!reduce && (
                <animate attributeName="fill-opacity" values="1;.35;1" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              )}
            </path>
            <circle cx={x} cy={y} r={3} fill={color} />
          </g>
        ))}
        <text x={280} y={124} textAnchor="middle" {...mono}>
          aks pods
        </text>
      </svg>
    )
  }

  if (kind === 'finops') {
    // demand curve, capacity that steps with it, and the reserved baseline under both
    const demand = 'M20 92 C 60 92, 70 50, 110 46 S 160 84, 200 80 S 250 36, 290 40 S 330 76, 344 78'
    const steps = 'M20 86 H70 V52 H120 V40 H150 V74 H210 V70 H240 V34 H300 V64 H344'
    return (
      <svg viewBox="0 0 360 140" aria-hidden="true">
        <rect x={20} y={92} width={324} height={22} rx={4} fill={color} opacity={0.16} />
        <text x={26} y={107} {...mono} fill={P.ink2}>
          3-yr reserved baseline
        </text>
        <path d={steps} fill="none" stroke={P.signal} strokeWidth={1.6} strokeLinejoin="round" />
        <path d={demand} fill="none" stroke={color} strokeWidth={2} strokeDasharray="0" />
        {dot(demand, 4)}
        <text x={344} y={22} textAnchor="end" {...mono}>
          <tspan fill={color}>— demand</tspan>
          <tspan dx={10} fill={P.signal}>
            — scaled capacity
          </tspan>
        </text>
      </svg>
    )
  }

  // gitops: servers pull desired state from git
  const servers = [20, 48, 76, 104].map((y, i) => ({ y, label: `customer ${String.fromCharCode(65 + i)}` }))
  return (
    <svg viewBox="0 0 360 140" aria-hidden="true">
      <g>
        <circle cx={70} cy={72} r={26} fill={P.bg3} stroke={color} strokeOpacity={0.7} />
        <path d="M60 64v16M60 72h20M80 64v16" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
        <circle cx={60} cy={64} r={3.5} fill={color} />
        <circle cx={80} cy={64} r={3.5} fill={color} />
        <circle cx={70} cy={86} r={0} />
        <text x={70} y={118} textAnchor="middle" {...mono}>
          git · source of truth
        </text>
      </g>
      {servers.map((s, i) => {
        const p = `M246 ${s.y} C 180 ${s.y}, 150 72, 98 72`
        return (
          <g key={i}>
            <path d={p} fill="none" stroke={color} strokeOpacity={0.3} />
            {dot(p, 2.2, i * 0.45)}
            <rect x={248} y={s.y - 9} width={96} height={18} rx={5} fill={P.bg3} stroke={P.line2} />
            <circle cx={258} cy={s.y} r={2.5} fill={P.signal} />
            <text x={266} y={s.y + 3.5} fontSize={10} fill={P.ink2} fontFamily="Geist Mono, monospace">
              {s.label}
            </text>
          </g>
        )
      })}
      <text x={296} y={138} textAnchor="middle" {...mono}>
        pull-based · no inbound access
      </text>
    </svg>
  )
}
