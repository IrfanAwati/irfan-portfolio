import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

/** 3D tilt toward the pointer with a moving glare. Mouse/pen only; no-op for touch and reduced motion. */
export function Tilt({ children, max = 7, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === 'touch') return
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg)`
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
    el.dataset.active = 'true'
  }
  const onLeave = () => {
    const el = ref.current!
    el.style.transform = ''
    el.dataset.active = 'false'
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  )
}
