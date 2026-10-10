import { useState } from 'react'
import type { PointerEvent as RPointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { PipelineCanvas } from '../components/PipelineCanvas'
import { ToolMarquee } from '../components/ToolMarquee'
import { ArrowRight, GitHub, LinkedIn } from '../components/icons'
import { EASE } from '../components/ease'
import { about, profile } from '../content/profile'
import { useTheme } from '../theme/palette'

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export function Hero() {
  const reduce = useReducedMotion() ?? false
  const [stats, setStats] = useState({ shipped: 0, blocked: 0 })
  const { palette } = useTheme()
  const { scrollY } = useScroll()

  // scroll: background recedes, portrait drifts slower than the page
  const canvasO = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.2])
  const portraitY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120])
  const nameY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 40])

  // pointer parallax: portrait and name move at different depths
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, (v) => v * 14), { stiffness: 120, damping: 20 })
  const py = useSpring(useTransform(my, (v) => v * 10), { stiffness: 120, damping: 20 })
  const nx = useSpring(useTransform(mx, (v) => v * -22), { stiffness: 120, damping: 20 })
  const onMove = (e: RPointerEvent) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EASE, delay },
  })

  return (
    <section className="hero hero-v2" id="top" aria-labelledby="hero-name" onPointerMove={onMove}>
      <motion.div className="hero-canvas" style={{ opacity: canvasO }}>
        <PipelineCanvas reduced={reduce} onStats={setStats} palette={palette} />
      </motion.div>
      <div className="hero-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hero-vignette" />

      <div className="wrap hero-stage">
        {/* left: role */}
        <motion.div className="hero-left" {...rise(0.5)}>
          <span className="hero-rule" aria-hidden="true" />
          <p className="hero-role2">
            DevOps → DevSecOps
            <br />
            &amp; Cloud Engineer
          </p>
          <p className="hero-meta">
            <span className="dot-live" aria-hidden="true" />
            {profile.location} · Azure · AWS · On-prem
          </p>
          <p className="hero-readout" aria-hidden="true">
            <b>{stats.shipped}</b> deployed · <em>{stats.blocked}</em> stopped at a gate
          </p>
        </motion.div>

        {/* centre: portrait + name */}
        <div className="hero-center">
          <motion.div className="hero-glow" aria-hidden="true" style={{ x: px, y: py }} />
          <motion.div
            className="hero-portrait"
            style={{ x: px, y: portraitY }}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          >
            <img src={about.portrait.src} alt={about.portrait.alt} fetchPriority="high" decoding="async" />
          </motion.div>

          <motion.div className="hero-nameblock" style={{ x: nx, y: nameY }}>
            <motion.span
              className="hero-sur"
              initial={reduce ? false : { opacity: 0, letterSpacing: '1.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
            >
              {profile.lastName}
            </motion.span>
            <h1 className="hero-big" id="hero-name">
              {profile.firstName.split('').map((ch, i) => (
                <span className="line-mask hb-char" key={i} aria-hidden="true">
                  <motion.span
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.35 + i * 0.07 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
              <span className="sr-only">
                {profile.name}, {profile.role}
              </span>
            </h1>
          </motion.div>
        </div>

        {/* right: intro + actions */}
        <motion.div className="hero-right" {...rise(0.65)}>
          <p className="hero-intro2">
            Hi, I’m Irfan. I run infrastructure across <b>Azure</b>, <b>AWS</b> and <b>on-prem</b>, build the
            pipelines that ship to all of them, and wire in security checks so problems get caught before
            production.
          </p>
          <div className="pill-row">
            <a href="#work" className="pill">
              <i>
                <ArrowRight size={14} />
              </i>
              See my work
            </a>
            <a href="#pipeline" className="pill">
              <i>
                <PlayIcon />
              </i>
              Try the pipeline
            </a>
            <a href="#contact" className="pill">
              <i>
                <CheckIcon />
              </i>
              Let’s talk
            </a>
          </div>
          <div className="hero-social">
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedIn size={16} /> LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              <GitHub size={16} /> GitHub
            </a>
            <a href={profile.links.resume} target="_blank" rel="noreferrer" className="cv-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
              </svg>
              Download CV
            </a>
          </div>
        </motion.div>
      </div>

      <ToolMarquee />
    </section>
  )
}
