import { useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal } from '../components/motion'
import { EASE } from '../components/ease'
import { BrandMark } from '../components/Nav'
import { Tilt } from '../components/Tilt'
import { about, profile } from '../content/profile'

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n
  const opacity = useTransform(progress, [start * 0.85, start * 0.85 + 0.12], [0.16, 1])
  return (
    <motion.span className="w" style={{ opacity }}>
      {word}
    </motion.span>
  )
}

function Portrait() {
  const [failed, setFailed] = useState(false)
  const reduce = useReducedMotion()
  const { photo: portrait } = about
  return (
    <motion.figure
      className="portrait portrait-photo"
      initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0% round 22px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      {failed ? (
        <div className="portrait-fallback" aria-hidden="true">
          <BrandMark />
        </div>
      ) : (
        <motion.img
          src={portrait.src}
          alt={portrait.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          initial={reduce ? false : { scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        />
      )}
      <span className="portrait-scan" aria-hidden="true" />
      <figcaption>
        <span>{profile.name}</span>
        <span>{profile.location}</span>
      </figcaption>
    </motion.figure>
  )
}

export function About() {
  const ref = useRef<HTMLQuoteElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = profile.philosophyQuote.split(/(\s+)/).filter((w) => w.length)
  const n = words.length

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <Reveal>
          <span className="kicker" id="about-title">
            <b>01</b> {about.kicker}
          </span>
        </Reveal>
        <blockquote className="about-quote" ref={ref}>
          {reduce
            ? profile.philosophyQuote
            : words.map((w, i) => <Word key={i} word={w} i={i} n={n} progress={scrollYProgress} />)}
          <cite>From my DevOps → DevSecOps roadmap</cite>
        </blockquote>

        <div className="about-grid">
          <div className="about-side">
            <Tilt max={9} className="portrait-tilt">
              <Portrait />
            </Tilt>
            <Reveal>
              <p className="lede">{about.lede}</p>
            </Reveal>
          </div>
          <div className="about-body">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p>{p}</p>
              </Reveal>
            ))}
            <ul className="principles" aria-label="Working principles">
              {about.principles.map((p, i) => (
                <Reveal as="li" key={p.k} delay={i * 0.06}>
                  <strong>{p.k}</strong>
                  <span>{p.v}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
