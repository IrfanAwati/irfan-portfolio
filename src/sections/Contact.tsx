import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from '../components/icons'
import { MaskLines, Reveal } from '../components/motion'
import { EASE } from '../components/ease'
import { profile } from '../content/profile'

const YEAR = new Date().getFullYear()

const LINES = [
  { text: '$ ./connect.sh --to irfan', cls: '' },
  { text: '✓ secrets scan ............ clean', cls: 'ok' },
  { text: '✓ policy check ............ friendly', cls: 'ok' },
  { text: '✓ route ................... LinkedIn · GitHub · email', cls: 'ok' },
  { text: '→ status: ready to talk about DevSecOps, Azure, or the next long ride', cls: 'ok' },
]

function TypedTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const reduce = useReducedMotion()
  const [typed, setShown] = useState(0)
  const shown = reduce && inView ? LINES.length : typed

  useEffect(() => {
    if (!inView || reduce) return
    const ids = LINES.map((_, i) => window.setTimeout(() => setShown(i + 1), 300 + i * 420))
    return () => ids.forEach(clearTimeout)
  }, [inView, reduce])

  return (
    <div className="contact-term" ref={ref} aria-hidden="true">
      {LINES.map((l, i) => (
        <motion.div
          key={i}
          className={l.cls}
          initial={false}
          animate={{ opacity: i < shown ? 1 : 0, x: i < shown ? 0 : -6 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {l.text}
        </motion.div>
      ))}
    </div>
  )
}

export function Contact() {
  const { links } = profile
  const items = [
    { k: 'LinkedIn', v: 'in/irfan-ia', href: links.linkedin, ext: true },
    { k: 'GitHub', v: 'IrfanAwati', href: links.github, ext: true },
    { k: 'Email', v: links.email, href: `mailto:${links.email}`, ext: false },
    ...(links.resume ? [{ k: 'Résumé', v: 'CV · PDF', href: links.resume, ext: true }] : []),
    ...(links.coverLetter ? [{ k: 'Cover letter', v: 'Letter · PDF', href: links.coverLetter, ext: true }] : []),
  ]

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <Reveal>
          <span className="kicker">
            <b>09</b> Contact
          </span>
        </Reveal>
        <h2 className="display contact-title" id="contact-title">
          <MaskLines
            lines={[
              <span key="a">Let’s build</span>,
              <span key="b">
                something <em>secure</em>.
              </span>,
            ]}
          />
        </h2>
        <TypedTerminal />

        <div className="contact-links">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={i * 0.06}>
              <a
                className="contact-link"
                href={it.href}
                {...(it.ext ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <small>{it.k}</small>
                <span>
                  {it.v} <ArrowUpRight size={20} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <footer className="footer">
          <span>© {YEAR} {profile.name}</span>
          <span>Designed & engineered with care · {profile.location}</span>
          <a href="#top" className="link-u">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  )
}
