import type { CSSProperties } from 'react'
import { FieldVisual } from '../components/FieldVisual'
import { Reveal, SectionHead } from '../components/motion'
import { Tilt } from '../components/Tilt'
import { ToolIcon } from '../components/ToolIcon'
import { fieldWork, impact } from '../content/experience'
import { CountUp } from '../components/CountUp'
import { toolVisual } from '../content/tools'

const Check = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

/** Renders `inline code` spans in practice text. */
const rich = (t: string) => t.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

/** Real-world engagements: migrations, re-platforming, FinOps and GitOps delivery. */
export function FieldWork() {
  return (
    <section className="section" id="field" aria-labelledby="field-title">
      <div className="wrap">
        <div className="arsenal-head">
          <SectionHead
            index="04"
            color="#3b9cff"
            label="Field work"
            id="field-title"
            title={[
              <span key="a">Shipped in</span>,
              <span key="b">
                <em>production</em>
              </span>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="muted">
              Six years of real systems and real customers at Asistex, Atlas Systems and Lisec Middle East:
              migrations, re-platforming, cost control and GitOps. Each card lists the outcome, what I did, and
              the practices I hold myself to.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <ul className="impact" aria-label="Impact in numbers">
            {impact.map((m) => (
              <li key={m.label} style={{ '--ic': m.color } as CSSProperties}>
                <strong>
                  {m.prefix}
                  <CountUp value={m.value} decimals={m.decimals ?? 0} />
                  {m.suffix}
                </strong>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="field-grid">
          {fieldWork.map((f, i) => (
            <Reveal key={f.id} delay={(i % 2) * 0.08} y={40}>
              <Tilt max={4} className="field-tilt">
                <article className="field-card" style={{ '--fc': f.color } as CSSProperties} aria-labelledby={`fw-${f.id}`}>
                  <div className="field-visual">
                    <FieldVisual kind={f.visual} color={f.color} />
                  </div>
                  <div className="field-body">
                    <span className="field-kicker">
                      {String(i + 1).padStart(2, '0')} · {f.kicker}
                    </span>
                    <h3 id={`fw-${f.id}`}>{f.title}</h3>
                    <div className="field-outcome">
                      <strong>{f.outcome}</strong>
                      <span>{f.org}</span>
                    </div>
                    <p className="field-summary">{f.summary}</p>

                    <h4>What I did</h4>
                    <ul className="field-did">
                      {f.did.map((d) => (
                        <li key={d}>{rich(d)}</li>
                      ))}
                    </ul>

                    <h4>Best practices</h4>
                    <ul className="field-bp">
                      {f.practices.map((p) => (
                        <li key={p}>
                          <i>
                            <Check />
                          </i>
                          <span>{rich(p)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="field-stack">
                      {f.stack.map((s) => {
                        const v = toolVisual(s)
                        return (
                          <span className="stack-chip" key={s} style={{ '--c': v.color } as CSSProperties}>
                            <ToolIcon v={v} size={22} />
                            {s}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
