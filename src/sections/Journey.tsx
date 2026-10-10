import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Reveal, SectionHead } from '../components/motion'
import { journey } from '../content/journey'

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section className="section" id="journey" aria-labelledby="journey-title">
      <div className="wrap journey">
        <div className="journey-head">
          <SectionHead
            index="02"
            color="#ffc23d"
            label="Career log"
            id="journey-title"
            title={[
              <span key="a">From moving</span>,
              <span key="b">
                parts to <em>pipelines</em>
              </span>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="muted" style={{ maxWidth: '26em', marginTop: 24 }}>
              Robots and smart-parking prototypes came first, then Azure, automation and
              DevSecOps. Each stop is cited to where it’s publicly recorded.
            </p>
            <div className="journey-legend" aria-hidden="true">
              <span>
                <i style={{ background: 'var(--signal)' }} />
                Work
              </span>
              <span>
                <i style={{ background: 'var(--amber)' }} />
                Education
              </span>
              <span>
                <i style={{ background: 'var(--ink-2)' }} />
                Milestone
              </span>
            </div>
          </Reveal>
        </div>

        <div className="timeline">
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-fill" style={{ scaleY: fill }} />
          </div>
          <ol ref={listRef}>
          {journey.map((s) => (
            <Reveal as="li" key={s.id} className="stop" y={40}>
              <span className="stop-dot" aria-hidden="true" data-kind={s.kind} />
              <div className="stop-period">{s.period || 'Dates to confirm'}</div>
              <h3>{s.title}</h3>
              <p className="stop-org">
                {s.org}
                {s.place && <span> · {s.place}</span>}
              </p>
              <p>{s.summary}</p>
              <div className="stop-tags">
                {s.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="stop-src">source: {s.source}</div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
