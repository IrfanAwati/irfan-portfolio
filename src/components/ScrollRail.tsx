import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'

/** Sections shown on the rail (id must exist on the page). */
const SECTIONS = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'arsenal', label: 'Stack' },
  { id: 'field', label: 'Field work' },
  { id: 'work', label: 'Work' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'record', label: 'Record' },
  { id: 'rides', label: 'Rides' },
  { id: 'contact', label: 'Contact' },
]
const LINES = 36

type Mark = { id: string; label: string; at: number }

/**
 * Right-edge scroll tab: progress fill, a "line" every few percent, section
 * markers you can click, and Bit, the DevSecOps buddy, who hops line to line as you scroll.
 */
export function ScrollRail() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 })
  const [idx, setIdx] = useState(0)
  const [label, setLabel] = useState('Intro')
  const [marks, setMarks] = useState<Mark[]>([])
  const [dir, setDir] = useState(1)
  const idxRef = useRef(0)
  const marksRef = useRef<Mark[]>([])

  // section positions as a fraction of total scroll
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const m = SECTIONS.flatMap((s) => {
        const el = document.getElementById(s.id)
        if (!el || max <= 0) return []
        const y = el.getBoundingClientRect().top + scrollY - 72
        return [{ ...s, at: Math.min(1, Math.max(0, y / max)) }]
      })
      marksRef.current = m
      setMarks(m)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.round(v * (LINES - 1))
    if (i !== idxRef.current) {
      setDir(i > idxRef.current ? 1 : -1)
      idxRef.current = i
      setIdx(i)
    }
    // active section = the last one whose top has passed 40% of the viewport
    let current = 'Intro'
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) current = s.label
    }
    if (v > 0.995) current = SECTIONS[SECTIONS.length - 1].label
    setLabel(current)
  })

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const pct = (i: number) => `${(i / (LINES - 1)) * 100}%`

  return (
    <nav className="rail" aria-label="Page sections">
      <div className="rail-track">
        <motion.div className="rail-fill" style={{ scaleY: fill }} aria-hidden="true" />
        {Array.from({ length: LINES }, (_, i) => (
          <i key={i} className="rail-line" data-on={i <= idx} style={{ top: pct(i) }} aria-hidden="true" />
        ))}
        {marks.map((m) => (
          <button
            key={m.id}
            className="rail-mark"
            data-active={label === m.label}
            style={{ top: `${m.at * 100}%` }}
            onClick={() => go(m.id)}
            aria-label={`Go to ${m.label}`}
          >
            <span>{m.label}</span>
          </button>
        ))}

        <motion.div
          className="buddy"
          animate={{ top: pct(idx) }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 30, mass: 0.6 }}
          aria-hidden="true"
        >
          <motion.div
            key={idx}
            className="buddy-hop"
            initial={false}
            animate={
              reduce
                ? undefined
                : { x: [0, -16, 0], scaleY: [1, 1.12, 0.78, 1], scaleX: [1, 0.92, 1.14, 1], rotate: [0, dir * -12, 0, 0] }
            }
            transition={{ duration: 0.46, times: [0, 0.42, 0.78, 1], ease: 'easeOut' }}
          >
            <Bit look={dir} />
          </motion.div>
          <motion.span
            key={label}
            className="buddy-label"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: [0, 1, 1, 0], x: [6, 0, 0, 0] }}
            transition={{ duration: 2.2, times: [0, 0.12, 0.8, 1] }}
          >
            {label}
          </motion.span>
        </motion.div>
      </div>
    </nav>
  )
}

/** Bit: a small shield-bodied bot with a visor, blinking eyes and an antenna. */
function Bit({ look }: { look: number }) {
  return (
    <svg className="bit" viewBox="0 0 40 44" width="34" height="38">
      <defs>
        <linearGradient id="bit-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--bit-a)" />
          <stop offset="100%" stopColor="var(--bit-b)" />
        </linearGradient>
      </defs>
      {/* antenna */}
      <path d="M20 9V4" stroke="var(--bit-b)" strokeWidth="2" strokeLinecap="round" />
      <circle className="bit-led" cx="20" cy="3.5" r="2.6" />
      {/* body: shield */}
      <path d="M20 8c6 0 11 2.6 13 4v11c0 8.5-6.2 14.4-13 17-6.8-2.6-13-8.5-13-17V12c2-1.4 7-4 13-4Z" fill="url(#bit-body)" />
      {/* visor */}
      <rect x="11" y="15" width="18" height="11" rx="5.5" fill="#0b1014" />
      <g className="bit-eyes" style={{ transform: `translateY(${look > 0 ? 1.2 : -1.2}px)` }}>
        <ellipse cx="16.5" cy="20.5" rx="2" ry="2.4" fill="#5cf2a8" />
        <ellipse cx="23.5" cy="20.5" rx="2" ry="2.4" fill="#5cf2a8" />
      </g>
      {/* lock badge */}
      <rect x="17.4" y="29" width="5.2" height="4.2" rx="1" fill="#0b1014" opacity=".55" />
      <path d="M18.4 29v-1.3a1.6 1.6 0 0 1 3.2 0V29" stroke="#0b1014" strokeOpacity=".55" strokeWidth="1.1" fill="none" />
      {/* feet */}
      <rect x="12.5" y="39.5" width="5" height="3.2" rx="1.6" fill="var(--bit-b)" />
      <rect x="22.5" y="39.5" width="5" height="3.2" rx="1.6" fill="var(--bit-b)" />
    </svg>
  )
}
