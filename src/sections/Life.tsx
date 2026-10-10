import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Close, Glyph } from '../components/icons'
import { Reveal, SectionHead } from '../components/motion'
import { EASE } from '../components/ease'
import { gallery, passions, rideLog } from '../content/life'
import type { GalleryItem } from '../content/life'

/** Photo, or a muted looping clip that only plays while visible (poster otherwise). */
function Media({ item, active = true, eager = false, controls = false }: { item: GalleryItem; active?: boolean; eager?: boolean; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const style = { objectPosition: item.focus ?? '50% 50%' }

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView && active && !reduce) v.play().catch(() => {})
    else if (!controls) v.pause()
  }, [inView, active, reduce, controls])

  if (item.video) {
    return (
      <video
        ref={ref}
        src={item.video}
        poster={item.src}
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        controls={controls}
        aria-label={item.alt}
        style={style}
      />
    )
  }
  return <img src={item.src} alt={item.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} />
}

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const item = gallery[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
      if (e.key === 'Tab') {
        const btns = [...document.querySelectorAll<HTMLElement>('.lightbox button, .lightbox video')]
        const i = btns.indexOf(document.activeElement as HTMLElement)
        e.preventDefault()
        btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length]?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      window.__lenis?.start()
      prev?.focus()
    }
  }, [onClose, onNav])

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.video ? 'Clip' : 'Photo'} ${index + 1} of ${gallery.length}: ${item.caption}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="lb-top">
        <span>
          {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
        </span>
        <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Close gallery">
          <Close />
        </button>
      </div>
      <div className="lb-stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            className="lb-media lb-portrait"
            initial={reduce ? false : { opacity: 0, scale: 0.96, clipPath: 'inset(8% 8% 8% 8% round 14px)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 14px)' }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Media item={{ ...item, focus: '50% 50%' }} eager controls={!!item.video} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="lb-bottom">
        <div>
          <h3>{item.caption}</h3>
          <p>{[item.place, item.date, item.story].filter(Boolean).join(' · ')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn" onClick={() => onNav(-1)} aria-label="Previous">
            <ArrowLeft />
          </button>
          <button className="icon-btn" onClick={() => onNav(1)} aria-label="Next">
            <ArrowRight />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/** Reel-style accordion: the active panel expands, the rest stay as slim strips. */
function Reel({ onOpen }: { onOpen: (i: number) => void }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  // on phones the reel is a swipe row, so every visible clip may play
  const [narrow] = useState(() => window.matchMedia('(max-width: 860px)').matches)

  return (
    <div className="reel" role="list" aria-label="Ride photos and clips">
      {gallery.map((g, i) => (
        <motion.button
          key={g.id}
          role="listitem"
          className="reel-panel"
          data-active={i === active}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => onOpen(i)}
          aria-label={`Open ${g.video ? 'clip' : 'photo'}: ${g.caption}`}
          initial={reduce ? false : { opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.07 }}
        >
          <Media item={g} active={narrow || i === active} />
          <span className="reel-shade" aria-hidden="true" />
          {g.video && (
            <span className="reel-badge" aria-hidden="true">
              <i /> clip
            </span>
          )}
          <span className="reel-vtitle" aria-hidden="true">
            {g.caption}
          </span>
          <span className="reel-cap">
            <small>
              {String(i + 1).padStart(2, '0')} · {g.date}
            </small>
            <strong>{g.caption}</strong>
            {(g.place || g.story) && <em>{g.place ?? g.story}</em>}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

export function Life() {
  const [open, setOpen] = useState<number | null>(null)
  const nav = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + gallery.length) % gallery.length)), [])
  const close = useCallback(() => setOpen(null), [])

  return (
    <section className="section" id="rides" aria-labelledby="rides-title">
      <div className="wrap">
        <div className="arsenal-head">
          <SectionHead
            index="08"
            color="#ff8a3d"
            label="Beyond the terminal"
            id="rides-title"
            title={[
              <span key="a">Life on</span>,
              <span key="b">
                <em>two wheels</em>
              </span>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="muted">
              Away from the terminal I’m usually on my adventure bike: highway miles, monsoon trails, river
              beds and the occasional dune. Curiosity, measured in kilometres.
            </p>
          </Reveal>
        </div>

        <Reveal y={40}>
          <Reel onOpen={setOpen} />
        </Reveal>

        <div className="ridelog">
          <Reveal>
            <span className="kicker">
              <b>↳</b> Ride log
            </span>
          </Reveal>
          <ol>
            {rideLog.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 0.08}>
                <span className="rl-date">{r.date}</span>
                <span className="rl-dot" aria-hidden="true" />
                <span className="rl-body">
                  <strong>{r.title}</strong>
                  <span>{r.note}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        <ul className="passions" aria-label="Things I’m passionate about">
          {passions.map((p, i) => (
            <Reveal as="li" className="passion" key={p.id} delay={i * 0.04}>
              <Glyph name={p.glyph} />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  )
}
