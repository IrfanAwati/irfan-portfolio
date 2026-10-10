import { ArrowUpRight } from '../components/icons'
import { Reveal, SectionHead } from '../components/motion'
import { certifications, honours, recommendation } from '../content/achievements'
import { profile } from '../content/profile'

export function Record() {
  return (
    <section className="section" id="record" aria-labelledby="record-title">
      <div className="wrap">
        <SectionHead
          index="07"
            color="#22c3e6"
          label="Experience & achievements"
          id="record-title"
          title={[
            <span key="a">On the record</span>,
          ]}
        />
        <div className="ach-grid">
          <div>
            <Reveal>
              <h3 className="kicker" style={{ margin: '0 0 8px' }}>
                Certifications
              </h3>
            </Reveal>
            <div>
              {certifications.map((c, i) => {
                const inner = (
                  <>
                    <span className="cert-code">{c.code}</span>
                    <span className="cert-name">
                      {c.name}
                      <span className="muted" style={{ display: 'block', fontSize: 14, fontWeight: 400 }}>
                        {c.issuer}
                      </span>
                    </span>
                    <span className="cert-meta">
                      {c.status} {c.url && <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: -2 }} />}
                    </span>
                  </>
                )
                return (
                  <Reveal key={c.code} delay={i * 0.06}>
                    {c.url ? (
                      <a className="cert" href={c.url} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div className="cert">{inner}</div>
                    )}
                  </Reveal>
                )
              })}
            </div>

            <Reveal>
              <h3 className="kicker" style={{ margin: '56px 0 0' }}>
                Honours
              </h3>
              <ul className="honours">
                {honours.map((h) => (
                  <li key={h.title}>
                    <span>{h.year}</span>
                    <span>
                      {h.title}
                      <small>{h.by}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <figure className="rec" style={{ margin: 0 }}>
                <blockquote>{recommendation.quote}</blockquote>
                <figcaption>
                  <strong>{recommendation.author}</strong>
                  {recommendation.context}
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="kicker" style={{ margin: '48px 0 0' }}>
                Languages
              </h3>
              <div className="langs">
                {profile.languages.map((l) => (
                  <span className="tag" key={l.name} title={`${l.level} proficiency`}>
                    {l.name} <span style={{ color: 'var(--ink-3)' }}>· {l.level}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
