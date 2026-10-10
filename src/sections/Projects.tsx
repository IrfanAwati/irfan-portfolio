import { ProjectDiagram } from '../components/ProjectDiagram'
import { ArrowUpRight, GitHub } from '../components/icons'
import { Reveal, SectionHead } from '../components/motion'
import { useState } from 'react'
import { earlyPhoto, earlyWork, projects } from '../content/projects'
import { toolVisual } from '../content/tools'
import { ToolIcon } from '../components/ToolIcon'
import { Tilt } from '../components/Tilt'

export function Projects() {
  const [showEarlyPhoto, setShowEarlyPhoto] = useState(true)
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="projects-intro">
          <SectionHead
            index="05"
            color="#8b6cff"
            label="Featured work"
            id="work-title"
            title={[
              <span key="a">Case studies</span>,
              <span key="b">
                in <em>shifting left</em>
              </span>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="muted" style={{ maxWidth: '30em', margin: 0 }}>
              Public, inspectable work. Every architecture detail below can be checked against
              the repository it links to.
            </p>
          </Reveal>
        </div>

        {projects.map((p) => (
          <article className="project" key={p.id} aria-labelledby={`p-${p.id}`}>
            <div className="project-aside">
              <Reveal>
                <span className="project-index">{p.index} /</span>
                <h3 id={`p-${p.id}`}>{p.title}</h3>
                <p className="project-tagline">{p.tagline}</p>
                <div className="project-stack">
                  {p.stack.map((s) => {
                    const v = toolVisual(s)
                    return (
                      <span className="stack-chip" key={s} style={{ '--c': v.color } as React.CSSProperties}>
                        <ToolIcon v={v} size={22} />
                        {s}
                      </span>
                    )
                  })}
                </div>
                {p.repo && (
                  <a className="btn btn-ghost" href={p.repo} target="_blank" rel="noreferrer">
                    <GitHub size={16} /> View repository <ArrowUpRight size={16} />
                  </a>
                )}
              </Reveal>
            </div>

            <div>
              <Reveal>
                <Tilt max={4}>
                  <ProjectDiagram kind={p.diagram} />
                </Tilt>
              </Reveal>
              <div className="case">
                <Reveal className="case-block">
                  <h4>The problem</h4>
                  <p>{p.problem}</p>
                </Reveal>
                <Reveal className="case-block" delay={0.06}>
                  <h4>The objective</h4>
                  <p>{p.objective}</p>
                </Reveal>
                <Reveal className="case-block full">
                  <h4>Architecture & workflow</h4>
                  <ul className="case-list">
                    {p.architecture.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal className="case-block full">
                  <h4>Security considerations</h4>
                  <ul className="case-list shield">
                    {p.security.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal className="case-block full">
                  <h4>Outcome</h4>
                  <p className="case-outcome">{p.outcome}</p>
                </Reveal>
                <Reveal className="case-block full">
                  <h4>Lessons</h4>
                  <p>{p.lessons}</p>
                </Reveal>
              </div>
            </div>
          </article>
        ))}

        <Reveal className="early">
          <div className="early-layout">
            {showEarlyPhoto && (
              <Tilt max={6} className="early-photo-tilt">
                <figure className="early-photo">
                  <img
                    src={earlyPhoto.src}
                    alt={earlyPhoto.alt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setShowEarlyPhoto(false)}
                  />
                  <figcaption>{earlyPhoto.caption}</figcaption>
                </figure>
              </Tilt>
            )}
            <div>
              <span className="kicker">
                <b>00</b> Before the cloud
              </span>
              <p className="early-lede">
                Before pipelines and clusters, I built machines: a parking system for smart cities, a guided
                robot and a solar water still. Same instinct, different hardware.
              </p>
              <div className="early-grid">
                {earlyWork.map((e) => (
                  <div key={e.title}>
                    <span className="mono" style={{ color: 'var(--amber)' }}>
                      {e.period}
                    </span>
                    <h4>{e.title}</h4>
                    <p>{e.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
