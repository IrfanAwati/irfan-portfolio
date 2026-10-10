import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { EASE } from './ease'
import { Scramble } from './Scramble'

/** Fade + rise when scrolled into view. Used for most body content. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'p' | 'section' | 'figure'
}) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Masked line reveal for display type: each line slides up from behind a clip. */
export function MaskLines({
  lines,
  className,
  delay = 0,
  stagger = 0.09,
  inView = true,
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
  stagger?: number
  inView?: boolean
}) {
  const reduce = useReducedMotion()
  // The trigger lives on the (unclipped) parent: a line translated below its
  // own overflow mask never intersects the viewport, so it can't observe itself.
  return (
    <motion.span
      className={className}
      style={{ display: 'block' }}
      initial={reduce ? false : 'hidden'}
      {...(inView
        ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
        : { animate: 'show' })}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Consistent section header: mono index + serif title. */
export function SectionHead({
  index,
  label,
  title,
  id,
  color,
}: {
  index: string
  label: string
  title: ReactNode[]
  id: string
  color?: string
}) {
  return (
    <header>
      <Reveal>
        <span className="kicker">
          {color && <i className="kdot" style={{ background: color, color }} aria-hidden="true" />}
          <b>{index}</b> <Scramble text={label} />
        </span>
      </Reveal>
      <h2 className="display h-section" id={id}>
        <MaskLines lines={title} />
      </h2>
    </header>
  )
}
