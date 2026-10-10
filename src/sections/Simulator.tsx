import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/motion'
import { EASE } from '../components/ease'
import {
  ArrowRight,
  IcBox,
  IcCode,
  IcCommit,
  IcKey,
  IcLayers,
  IcPulse,
  IcScan,
  IcShield,
  IcShip,
} from '../components/icons'
import { scenarios, stages } from '../content/pipeline'
import type { StageId } from '../content/pipeline'

type St = 'idle' | 'active' | 'pass' | 'blocked' | 'skipped'
type Log = { cls: string; text: string }

const ICON: Record<StageId, ReactNode> = {
  commit: <IcCommit size={22} />,
  secrets: <IcKey size={22} />,
  quality: <IcCode size={22} />,
  iac: <IcLayers size={22} />,
  build: <IcBox size={22} />,
  image: <IcScan size={22} />,
  admit: <IcShield size={22} />,
  deploy: <IcShip size={22} />,
  runtime: <IcPulse size={22} />,
}

const STEP_MS = 480

export function Simulator() {
  const reduce = useReducedMotion()
  const [scenarioId, setScenarioId] = useState('secret')
  const [states, setStates] = useState<St[]>(stages.map(() => 'idle'))
  const [log, setLog] = useState<Log[]>([{ cls: 'dim', text: '# choose a change and run the pipeline' }])
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)
  const [reach, setReach] = useState(0) // 0..1 rail fill
  const timers = useRef<number[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, margin: '-30% 0px' })
  const scenario = scenarios.find((s) => s.id === scenarioId)!

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const run = useCallback(
    (id: string) => {
      clear()
      const sc = scenarios.find((s) => s.id === id)!
      const stopAt = sc.catchAt ? stages.findIndex((s) => s.id === sc.catchAt) : -1
      setDone(false)
      setRunning(true)
      setReach(0)
      setStates(stages.map(() => 'idle'))
      setLog([{ cls: 'dim', text: `$ run pipeline  # ${sc.change}` }])

      const ms = reduce ? 0 : STEP_MS
      const last = stopAt >= 0 ? stopAt : stages.length - 1
      for (let i = 0; i <= last; i++) {
        const at = i * ms
        timers.current.push(
          window.setTimeout(() => {
            setStates((prev) => prev.map((s, j) => (j === i ? 'active' : s)))
            setReach(i / (stages.length - 1))
          }, at),
        )
        timers.current.push(
          window.setTimeout(() => {
            const blocked = i === stopAt
            setStates((prev) =>
              prev.map((s, j) => (j === i ? (blocked ? 'blocked' : 'pass') : blocked && j > i ? 'skipped' : s)),
            )
            const st = stages[i]
            setLog((l) => [
              ...l,
              blocked
                ? { cls: 'warn', text: `✕ [${String(i + 1).padStart(2, '0')}] ${st.tool}: ${sc.finding}` }
                : { cls: 'ok', text: `✓ [${String(i + 1).padStart(2, '0')}] ${st.pass}` },
            ])
            if (i === last) {
              setDone(true)
              setRunning(false)
              setLog((l) => [
                ...l,
                blocked
                  ? { cls: 'warn', text: sc.id === 'runtime' ? '→ alert raised · on-call paged' : '→ pipeline halted · merge blocked' }
                  : { cls: 'ok', text: '→ deployed · monitoring' },
              ])
            }
          }, at + ms * 0.8),
        )
      }
    },
    [reduce],
  )

  // play once when it first scrolls into view
  useEffect(() => {
    if (inView) run(scenarioId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])
  useEffect(() => clear, [])

  const blockedState = states.includes('blocked')

  return (
    <section className="section sim-section" id="pipeline" aria-labelledby="pipeline-title">
      <div className="wrap">
        <SectionHead
          index="06"
            color="#ff6ad5"
          label="DevSecOps in motion"
          id="pipeline-title"
          title={[
            <span key="a">Break it on purpose.</span>,
            <span key="b">
              Watch where it’s <em>caught</em>.
            </span>,
          ]}
        />
        <Reveal delay={0.1}>
          <p className="lede muted" style={{ marginTop: 28 }}>
            Choose a bad change and send it down a secure delivery pipeline. Each stage shows the
            tool that would catch it, and whether I run that stage in production, have built it in a
            public repo, or have it on my roadmap.
          </p>
        </Reveal>

        <Reveal>
          <div className="sim" ref={rootRef}>
            <div className="sim-controls" role="group" aria-label="Choose a change to push">
              <span className="label">Push a change:</span>
              <div className="sim-chips">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  className="scenario"
                  aria-pressed={s.id === scenarioId}
                  onClick={() => {
                    setScenarioId(s.id)
                    run(s.id)
                  }}
                >
                  {s.label}
                </button>
              ))}
              </div>
              <button className="btn btn-primary sim-run" onClick={() => run(scenarioId)} disabled={running}>
                {running ? 'Running…' : done ? 'Run again' : 'Run pipeline'} <ArrowRight size={16} />
              </button>
            </div>

            <div className="sim-track">
              <div className="sim-rail" aria-hidden="true">
                <div
                  className="sim-rail-fill"
                  data-state={blockedState ? 'blocked' : 'ok'}
                  style={{ '--reach': reach } as React.CSSProperties}
                />
              </div>
              <ol className="sim-stages" aria-label="Pipeline stages">
              {stages.map((s, i) => (
                <li className="stage" key={s.id} data-state={states[i]}>
                  <span className="stage-node" aria-hidden="true">
                    {ICON[s.id]}
                  </span>
                  <span className="stage-meta">
                    <span className="stage-name">{s.name}</span>
                    <span className="stage-tool">{s.tool}</span>
                    <span className={`stage-src ${s.source === 'mine' || s.source === 'prod' ? 'mine' : s.source === 'roadmap' ? 'road' : ''}`}>
                      {s.source === 'mine' ? 'built in repo' : s.source === 'prod' ? 'in production' : s.source === 'roadmap' ? 'roadmap' : 'core stack'}
                    </span>
                  </span>
                  <span className="sr-only">: {states[i]}</span>
                </li>
              ))}
              </ol>
            </div>

            <div className="sim-console">
              <div className="sim-log" aria-live="polite">
                {log.map((l, i) => (
                  <div key={i} className={l.cls}>
                    {l.text}
                  </div>
                ))}
              </div>
              <div className="sim-verdict">
                <span className="mono" style={{ color: scenario.catchAt ? 'var(--amber)' : 'var(--signal)' }}>
                  {scenario.catchAt ? `caught at: ${stages.find((s) => s.id === scenario.catchAt)!.name}` : 'all gates passed'}
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scenario.id + String(done)}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: done ? 1 : 0.35, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <h4>{scenario.verdictTitle}</h4>
                    <p>{scenario.verdict}</p>
                    <p>
                      <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Fix: </strong>
                      {scenario.fix}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="sim-note">
          This is an illustrative model of a secure delivery pipeline. It isn’t a diagram of any
          employer’s production system. Stages marked “in production” run in my current role; “built in repo” ones are public in{' '}
          <a className="link-u" href="https://github.com/IrfanAwati/DevSecOps" target="_blank" rel="noreferrer">
            IrfanAwati/DevSecOps
          </a>
          .
        </p>
      </div>
    </section>
  )
}
