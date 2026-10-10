import { useMemo } from 'react'
import type { GalleryItem } from '../content/life'

/**
 * Renders a real photo when `item.src` is set; otherwise a clearly labelled
 * placeholder made of procedural contour lines (a "map", not a fake photo).
 */
export function PhotoSlot({ item, eager = false }: { item: GalleryItem; eager?: boolean }) {
  if (item.src) {
    return <img src={item.src} alt={item.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  }
  return <Contours seed={item.id} />
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function makeRng(seed: number) {
  let r = seed
  return () => {
    r = Math.imul(r ^ (r >>> 15), 2246822507) >>> 0
    return (r % 10000) / 10000
  }
}

export function Contours({ seed }: { seed: string }) {
  const paths = useMemo(() => {
    const rnd = makeRng(hash(seed))
    const a1 = rnd() * 6
    const a2 = rnd() * 6
    const f1 = 1.5 + rnd() * 2
    const f2 = 3 + rnd() * 3
    const out: string[] = []
    for (let k = 0; k < 22; k++) {
      const base = 6 + k * 4.4
      let d = ''
      for (let x = -2; x <= 102; x += 2) {
        const y =
          base +
          Math.sin((x / 100) * Math.PI * f1 + a1 + k * 0.18) * (6 + k * 0.25) +
          Math.sin((x / 100) * Math.PI * f2 + a2) * 2.2
        d += `${x === -2 ? 'M' : 'L'}${x} ${y.toFixed(2)} `
      }
      out.push(d)
    }
    // the "road": one bold sweeping line
    const roadY = 40 + rnd() * 30
    const road = `M-5 ${roadY + 20} C 30 ${roadY - 10}, 60 ${roadY + 30}, 105 ${roadY - 15}`
    return { out, road }
  }, [seed])

  return (
    <svg className="ph" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="100" height="100" style={{ fill: 'var(--bg-2)' }} />
      {paths.out.map((d, i) => (
        <path key={i} d={d} fill="none" style={{ stroke: 'var(--ink)' }} strokeOpacity={0.05 + (i % 5 === 0 ? 0.06 : 0)} strokeWidth={0.25} />
      ))}
      <path d={paths.road} fill="none" style={{ stroke: 'var(--amber)' }} strokeOpacity={0.55} strokeWidth={0.6} strokeDasharray="2 1.6" className="road-dash" />
    </svg>
  )
}
