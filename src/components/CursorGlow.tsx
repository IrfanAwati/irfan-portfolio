import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/** A soft, colour-cycling light that follows the mouse (fine pointers only, dark theme only via CSS). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current!
    let x = innerWidth / 2
    let y = innerHeight / 3
    let cx = x
    let cy = y
    let raf = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      el.style.opacity = ''
    }
    const loop = () => {
      cx += (x - cx) * 0.12
      cy += (y - cy) * 0.12
      el.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" style={{ opacity: 0 }} />
}
