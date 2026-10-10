import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE } from './ease'
import { environments } from '../content/skills'
import { useTheme } from '../theme/palette'
import { ToolIcon } from './ToolIcon'

/**
 * "Where I operate": one secured delivery pipeline fanning out to on-prem,
 * Azure and AWS. Paths are measured in real pixels so packets stay round.
 */
export function HybridMap() {
  const reduce = useReducedMotion()
  const mid = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hot, setHot] = useState<string | null>(null)
  const { palette: P } = useTheme()
  const envColor = (id: string) => (id === 'onprem' ? P.amber : id === 'azure' ? P.signal : P.blue)

  useEffect(() => {
    const el = mid.current!
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const n = environments.length
  const paths = environments.map((_, i) => {
    const ty = (h * (i + 0.5)) / n
    const sy = h / 2
    return `M0 ${sy} C ${w * 0.45} ${sy}, ${w * 0.55} ${ty}, ${w} ${ty}`
  })

  return (
    <div className="hybrid">
      <motion.div
        className="hybrid-hub"
        initial={reduce ? false : { opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span className="mono" style={{ color: 'var(--signal)' }}>
          one pipeline
        </span>
        <strong>Build · Scan · Ship</strong>
        <div className="hub-gates" aria-hidden="true">
          {['secrets', 'sast', 'iac', 'image', 'policy'].map((g) => (
            <i key={g} title={g} />
          ))}
        </div>
        <p>Terraform, containers and CI/CD, with the same security gates whatever the target.</p>
      </motion.div>

      <div className="hybrid-mid" ref={mid} aria-hidden="true">
        {w > 0 && (
          <svg width={w} height={h}>
            {paths.map((d, i) => {
              const id = environments[i].id
              const on = hot === null || hot === id
              return (
                <g key={id}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={envColor(id)}
                    strokeOpacity={on ? 0.45 : 0.08}
                    strokeWidth={on && hot ? 1.6 : 1}
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.15 }}
                    style={{ transition: 'stroke-opacity .4s, stroke-width .4s' }}
                  />
                  {!reduce &&
                    [0, 1, 2].map((k) => (
                      <circle key={k} r={2.6} fill={envColor(id)} opacity={on ? 1 : 0.15}>
                        <animateMotion dur="2.6s" begin={`${k * 0.87 + i * 0.3}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    ))}
                </g>
              )
            })}
          </svg>
        )}
      </div>

      <ul className="hybrid-envs">
        {environments.map((e, i) => (
          <motion.li
            key={e.id}
            className="env"
            style={{ '--env': envColor(e.id) } as React.CSSProperties}
            data-dim={hot !== null && hot !== e.id}
            onMouseEnter={() => setHot(e.id)}
            onMouseLeave={() => setHot(null)}
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.12 }}
          >
            {e.id === 'onprem' ? (
              <span className="env-glyph" aria-hidden="true">
                <EnvGlyph kind={e.id} />
              </span>
            ) : (
              <ToolIcon v={{ icon: e.id, color: envColor(e.id) }} size={44} />
            )}
            <span className="env-body">
              <strong>{e.name}</strong>
              <small>{e.what}</small>
              <span className="env-chips">
                {e.tools.map((t) => (
                  <em key={t}>{t}</em>
                ))}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function EnvGlyph({ kind }: { kind: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (kind === 'onprem')
    return (
      <svg viewBox="0 0 24 24" width={22} height={22} {...common}>
        <rect x="4" y="3" width="16" height="5" rx="1.5" />
        <rect x="4" y="10" width="16" height="5" rx="1.5" />
        <rect x="4" y="17" width="16" height="4" rx="1.5" />
        <path d="M7.5 5.5h.01M7.5 12.5h.01M7.5 19h.01M12 5.5h5M12 12.5h5" />
      </svg>
    )
  if (kind === 'azure')
    return (
      <svg viewBox="0 0 24 24" width={22} height={22} {...common}>
        <path d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.5 4.3 4.3 0 0 0 7 18Z" />
        <path d="M10 14l2-2 2 2" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common}>
      <path d="M7 17h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 8.5 4.3 4.3 0 0 0 7 17Z" />
      <path d="M8 20.5c2.5 1 5.5 1 8 0" />
    </svg>
  )
}
