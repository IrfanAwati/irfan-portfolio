import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const GLYPHS = '01<>/{}[]#$%&*+=?'

/** "Decrypts" its text the first time it scrolls into view. Screen readers get the real text. */
export function Scramble({ text, duration = 900 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [out, setOut] = useState<string | null>(null)

  useEffect(() => {
    if (!inView || reduce) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const solved = Math.floor(p * text.length)
      setOut(
        text
          .split('')
          .map((ch, i) => (i < solved || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (p < 1) raf = requestAnimationFrame(tick)
      else setOut(null)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, text, duration])

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{out ?? text}</span>
    </span>
  )
}
