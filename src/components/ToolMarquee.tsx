import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE } from './ease'
import { ToolIcon } from './ToolIcon'
import { allTools } from '../content/tools'
import { skillGroups } from '../content/skills'

/**
 * Hero band: every tool, visible in the first screen. Two rows drift in
 * opposite directions; hover pauses and lights a chip in its brand colour.
 */
export function ToolMarquee() {
  const reduce = useReducedMotion()
  const half = Math.ceil(allTools.length / 2)
  const rows = [allTools.slice(0, half), allTools.slice(half)]

  return (
    <motion.div
      className="marquee"
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.35 }}
    >
      <div className="wrap mq-head">
        <span className="mq-live">
          <i /> toolchain · {allTools.length} tools · {skillGroups.length} domains
        </span>
        <ul className="mq-legend" aria-label="Tool categories">
          {skillGroups.map((g) => (
            <li key={g.id} style={{ '--g': g.color } as CSSProperties}>
              {g.label}
            </li>
          ))}
        </ul>
      </div>

      <ul className="sr-only" aria-label="Tools I work with">
        {allTools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      {rows.map((row, r) => (
        <div className="mq-row" data-rev={r === 1} key={r} aria-hidden="true">
          <div className="mq-track" style={{ animationDuration: `${row.length * 3.2}s` }}>
            {[...row, ...row].map((t, i) => (
              <span className="mq-chip" key={i} style={{ '--c': t.color, '--g': t.groupColor } as CSSProperties}>
                <ToolIcon v={t} size={28} />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
