import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { Close, Menu, Moon, Sun } from './icons'
import { useTheme } from '../theme/palette'
import { EASE } from './ease'
import { NAV } from '../content/nav'


export function BrandMark() {
  // "IA" monogram as a gate: two posts and a signal line passing through.
  return (
    <svg className="brand-mark" viewBox="0 0 34 34" aria-hidden="true">
      <rect x="0.75" y="0.75" width="32.5" height="32.5" rx="9" fill="none" style={{ stroke: 'var(--line-2)' }} />
      <path d="M11 9v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 25 20.5 9 25 25M17.6 19.5h5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M4 17h4" style={{ stroke: 'var(--signal)' }} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button className="theme-btn" onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 16, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -16, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ display: 'grid' }}
        >
          {theme === 'dark' ? <Moon /> : <Sun />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav className="nav" data-solid={solid || open} aria-label="Primary">
        <div className="wrap nav-inner">
          <a href="#top" className="brand" aria-label="Irfan Awati, back to top" onClick={() => setOpen(false)}>
            <BrandMark />
            <span>irfan.awati</span>
          </a>
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
          <ThemeToggle />
          <a href="#contact" className="btn btn-ghost nav-cta">
            Get in touch
          </a>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
          </div>
        </div>
        <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {[...NAV, { id: 'contact', label: 'Contact' }].map((n, i) => (
              <motion.a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.05 }}
              >
                <span>0{i + 1}</span>
                {n.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
