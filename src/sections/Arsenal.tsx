import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/motion'
import { EASE } from '../components/ease'
import { HybridMap } from '../components/HybridMap'
import { useTheme } from '../theme/palette'
import { toolVisual } from '../content/tools'
import { ToolIcon } from '../components/ToolIcon'
import { evidenceLabel, skillGroups } from '../content/skills'
import type { Evidence, Tool } from '../content/skills'

const W = 880
const H = 500
const CX = W / 2
const CY = H / 2

function primaryEvidence(t: Tool): Evidence {
  if (t.evidence.includes('repo')) return 'repo'
  if (t.evidence.includes('cert')) return 'cert'
  if (t.evidence.includes('learning') && t.evidence.length === 1) return 'learning'
  if (t.evidence.includes('profile')) return 'profile'
  return 'learning'
}

/** Places tools on an ellipse around the category core; label anchor faces outward. */
function layout(n: number) {
  const rx = n > 6 ? 240 : 220
  const ry = n > 6 ? 175 : 165
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (n % 2 ? 0 : Math.PI / n)
    const x = CX + Math.cos(a) * rx
    const y = CY + Math.sin(a) * ry
    const c = Math.cos(a)
    return { x, y, anchor: c > 0.25 ? 'start' : c < -0.25 ? 'end' : 'middle', dy: Math.abs(c) <= 0.25 ? (Math.sin(a) < 0 ? -42 : 40) : 4, dx: c > 0.25 ? 28 : c < -0.25 ? -28 : 0 } as const
  })
}

export function Arsenal() {
  const [active, setActive] = useState(skillGroups[0].id)
  const reduce = useReducedMotion()
  const { palette: P } = useTheme()
  const group = skillGroups.find((g) => g.id === active)!
  const pts = useMemo(() => layout(group.tools.length), [group])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = skillGroups.length
    let j = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % n
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + n) % n
    if (j >= 0) {
      e.preventDefault()
      setActive(skillGroups[j].id)
      document.getElementById(`tab-${skillGroups[j].id}`)?.focus()
    }
  }

  return (
    <section className="section" id="arsenal" aria-labelledby="arsenal-title">
      <div className="wrap">
        <div className="arsenal-head">
          <SectionHead
            index="03"
            color="#3b9cff"
            label="Technical arsenal"
            id="arsenal-title"
            title={[
              <span key="a">The toolchain,</span>,
              <span key="b">
                <em>with receipts</em>
              </span>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="muted">
              Hybrid by default: on-prem servers, Azure and AWS, run with the same IaC,
              containers and pipelines. No skill bars. Each tool is marked as used in a public
              repo, certified, part of my daily stack, or on my roadmap.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="hybrid-head">
            <span className="kicker">
              <b>↳</b> Where I operate
            </span>
            <span className="mono muted">on-prem + cloud, one way of working</span>
          </div>
        </Reveal>
        <HybridMap />

        <div className="arsenal">
          <ul className="group-tabs" role="tablist" aria-label="Skill categories" aria-orientation="vertical">
            {skillGroups.map((g, i) => (
              <li key={g.id} role="presentation">
                <button
                  id={`tab-${g.id}`}
                  role="tab"
                  className="group-tab"
                  aria-selected={g.id === active}
                  aria-controls="arsenal-panel"
                  tabIndex={g.id === active ? 0 : -1}
                  onClick={() => setActive(g.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className="gt-label">{g.label}</span>
                  <span className="gt-count" style={g.id === active ? { color: g.color } : undefined}>
                    <i className="gt-dot" style={{ background: g.color }} />
                    {String(g.tools.length).padStart(2, '0')}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <Reveal>
            <div className="orbit-panel" id="arsenal-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
              <svg className="orbit-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
                {/* faint orbit rings */}
                {[1, 0.66, 0.33].map((s) => (
                  <ellipse
                    key={s}
                    cx={CX}
                    cy={CY}
                    rx={240 * s}
                    ry={175 * s}
                    fill="none"
                    stroke={P.line}
                    strokeDasharray={s === 1 ? '2 6' : undefined}
                  />
                ))}
                <AnimatePresence mode="popLayout">
                  <motion.g key={group.id}>
                    {group.tools.map((t, i) => {
                      const p = pts[i]
                      const ev = primaryEvidence(t)
                      const delay = reduce ? 0 : 0.05 + i * 0.045
                      return (
                        <g key={t.name}>
                          <motion.line
                            x1={CX}
                            y1={CY}
                            x2={p.x}
                            y2={p.y}
                            stroke={ev === 'learning' ? P.amber : group.color}
                            strokeOpacity={0.55}
                            strokeDasharray={ev === 'learning' ? '3 5' : undefined}
                            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.7, ease: EASE, delay }}
                          />
                          <motion.g
                            initial={reduce ? false : { opacity: 0, x: (CX - p.x) * 0.4, y: (CY - p.y) * 0.4 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.8, ease: EASE, delay: delay + 0.1 }}
                          >
                            {(() => {
                              const v = toolVisual(t.name)
                              const evFill = ev === 'repo' ? P.signal : ev === 'cert' ? P.ink : P.bg2
                              const evStroke = ev === 'learning' ? P.amber : ev === 'profile' ? P.ink2 : P.bg2
                              return (
                                <g className="orbit-node">
                                  <circle cx={p.x} cy={p.y} r={30} fill={`url(#halo-${i})`} />
                                  <radialGradient id={`halo-${i}`}>
                                    <stop offset="0%" stopColor={v.color} stopOpacity={0.55} />
                                    <stop offset="100%" stopColor={v.color} stopOpacity={0} />
                                  </radialGradient>
                                  <rect
                                    x={p.x - 18}
                                    y={p.y - 18}
                                    width={36}
                                    height={36}
                                    rx={10}
                                    fill={v.icon ? '#fbfaf7' : v.color}
                                    stroke={v.color}
                                    strokeOpacity={0.6}
                                  />
                                  {v.icon ? (
                                    <image href={`/icons/${v.icon}.svg`} x={p.x - 12} y={p.y - 12} width={24} height={24} />
                                  ) : (
                                    <text
                                      x={p.x}
                                      y={p.y + 4.5}
                                      textAnchor="middle"
                                      fill="#fff"
                                      fontSize={v.mono!.length > 2 ? 10.5 : 13}
                                      fontWeight={600}
                                      fontFamily="Geist Mono, monospace"
                                    >
                                      {v.mono}
                                    </text>
                                  )}
                                  <circle
                                    cx={p.x + 17}
                                    cy={p.y - 17}
                                    r={5}
                                    fill={evFill}
                                    stroke={evStroke}
                                    strokeWidth={1.5}
                                    strokeDasharray={ev === 'learning' ? '2 2' : undefined}
                                  />
                                </g>
                              )
                            })()}
                            <text
                              x={p.x + p.dx}
                              y={p.y + p.dy}
                              textAnchor={p.anchor}
                              fill={P.ink}
                              fontSize={14}
                              fontWeight={500}
                            >
                              {t.name}
                            </text>
                            {t.note && (
                              <text
                                x={p.x + p.dx}
                                y={p.y + p.dy + 16}
                                textAnchor={p.anchor}
                                fill={P.ink3}
                                fontSize={11}
                                fontFamily="Geist Mono, monospace"
                              >
                                {t.note}
                              </text>
                            )}
                          </motion.g>
                        </g>
                      )
                    })}
                    <motion.g
                      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      style={{ transformOrigin: `${CX}px ${CY}px` }}
                    >
                      <radialGradient id="core">
                        <stop offset="0%" stopColor={group.color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={group.color} stopOpacity={0.04} />
                      </radialGradient>
                      {!reduce && (
                        <motion.circle
                          cx={CX}
                          cy={CY}
                          fill="none"
                          stroke={group.color}
                          initial={{ r: 46, opacity: 0.6 }}
                          animate={{ r: 92, opacity: 0 }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      <circle cx={CX} cy={CY} r={46} fill={P.bg3} />
                      <circle cx={CX} cy={CY} r={46} fill="url(#core)" stroke={group.color} strokeOpacity={0.8} />
                      <text x={CX} y={CY + 5} textAnchor="middle" fill={P.ink} fontSize={13} fontFamily="Geist Mono, monospace">
                        {group.id}
                      </text>
                    </motion.g>
                  </motion.g>
                </AnimatePresence>
              </svg>

              <div className="orbit-foot">
                <p>{group.blurb}</p>
                <div className="evidence-legend">
                  {(Object.keys(evidenceLabel) as Evidence[]).map((e) => (
                    <span key={e}>
                      <i className={`ev ev-${e}`} />
                      {evidenceLabel[e]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accessible + mobile-friendly list of the same data */}
              <ul className="tool-list">
                {group.tools.map((t) => (
                  <li key={t.name}>
                    <span className="tool-name">
                      <ToolIcon v={toolVisual(t.name)} size={24} />
                      {t.name}
                    </span>
                    <span className="tool-ev">
                      {t.evidence.map((e) => (
                        <i key={e} className={`ev ev-${e}`} title={evidenceLabel[e]} />
                      ))}
                      <span className="sr-only">{t.evidence.map((e) => evidenceLabel[e]).join(', ')}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
