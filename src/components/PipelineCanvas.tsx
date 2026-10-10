import { useEffect, useRef } from 'react'
import type { Palette } from '../theme/palette'

/**
 * Hero visual: commits stream in from the left, converge into one delivery
 * lane, pass through five security gates and deploy into a small cluster.
 * Roughly one in eight is stopped at a gate and falls away in amber.
 * The whole thing is a single 2D canvas with no dependencies. It pauses when
 * offscreen or the tab is hidden, and renders one still frame for reduced motion.
 */

type Packet = {
  x: number
  y: number
  y0: number
  vx: number
  vy: number
  failAt: number // gate index or -1
  state: 'flow' | 'blocked' | 'deploy' | 'done'
  life: number
  target: number
  t: number // deploy progress 0..1
  sx: number
  sy: number
  hue: number
}

type Node = { x: number; y: number; r: number; pulse: number; born: number }

type Stats = { shipped: number; blocked: number }

const GATES = ['secrets', 'sast', 'iac', 'image', 'policy']

const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3)

export function PipelineCanvas({
  onStats,
  reduced,
  palette,
}: {
  onStats?: (s: Stats) => void
  reduced?: boolean
  palette: Palette
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const statsCb = useRef(onStats)
  useEffect(() => {
    statsCb.current = onStats
  }, [onStats])

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const { signal: SIGNAL, amber: AMBER, ink: INK } = palette.rgb
    const nodeFill = palette.bg2
    let w = 0
    let h = 0
    let dpr = 1
    let laneY = 0
    let gateX: number[] = []
    const gateFlash: { v: number; bad: boolean }[] = GATES.map(() => ({ v: 0, bad: false }))
    let nodes: Node[] = []
    let cx = 0
    let cy = 0
    let compact = false
    const packets: Packet[] = []
    const stats: Stats = { shipped: 0, blocked: 0 }
    const heart: number[] = []
    let spawnAcc = 0
    let time = 0
    let raf = 0
    let running = false
    let lastStats = 0
    const mouse = { x: -9999, y: -9999, sx: 0, sy: 0, tx: 0, ty: 0 }

    function layout() {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // < 960px the hero stacks (portrait on top), so the pipeline becomes a quiet backdrop.
      // Wide screens: a band across the top: gates on the left, flowing behind the
      // portrait's head into the cluster on the right.
      compact = w < 960
      laneY = compact ? h * 0.305 : Math.max(150, h * 0.17)
      const g0 = compact ? 0.2 : 0.045
      const g1 = compact ? 0.62 : 0.27
      gateX = GATES.map((_, i) => w * (g0 + ((g1 - g0) * i) / (GATES.length - 1)))
      cx = compact ? w * 0.84 : w * 0.79
      cy = laneY
      const R = compact ? 34 : Math.min(52, w * 0.036)
      const ring = [
        [0, 0],
        [1, 0],
        [0.5, 0.866],
        [-0.5, 0.866],
        [-1, 0],
        [-0.5, -0.866],
        [0.5, -0.866],
      ]
      nodes = ring.map(([a, b], i) => ({
        x: cx + a * R,
        y: cy + b * R,
        r: i === 0 ? (compact ? 6 : 8) : compact ? 4 : 5.5,
        pulse: 0,
        born: 1.4 + i * 0.08,
      }))
    }

    function spawn(initialX?: number) {
      const spread = h * (compact ? 0.16 : 0.22)
      const y0 = laneY + (Math.random() * 2 - 1) * spread
      const fail = Math.random() < 0.13 ? Math.floor(Math.random() * GATES.length) : -1
      packets.push({
        x: initialX ?? -20,
        y: y0,
        y0,
        vx: (compact ? 70 : 110) + Math.random() * 70,
        vy: 0,
        failAt: fail,
        state: 'flow',
        life: 1,
        target: Math.floor(Math.random() * nodes.length),
        t: 0,
        sx: 0,
        sy: 0,
        hue: Math.random(),
      })
    }

    function step(dt: number) {
      time += dt
      // spawn rate ramps up during the intro
      const rate = (compact ? 2.2 : 3.4) * smooth(time / 1.6)
      spawnAcc += dt * rate
      while (spawnAcc > 1) {
        spawnAcc -= 1
        spawn()
      }

      for (const p of packets) {
        if (p.state === 'flow') {
          p.x += p.vx * dt
          const k = smooth(p.x / gateX[0])
          p.y = p.y0 + (laneY - p.y0) * k
          // gate checks
          for (let g = 0; g < gateX.length; g++) {
            if (p.x >= gateX[g] && p.x - p.vx * dt < gateX[g]) {
              if (g === p.failAt) {
                p.state = 'blocked'
                p.vy = -30 - Math.random() * 30
                p.vx *= 0.25
                gateFlash[g] = { v: 1, bad: true }
                stats.blocked++
              } else if (!gateFlash[g].bad || gateFlash[g].v < 0.3) {
                gateFlash[g] = { v: Math.max(gateFlash[g].v, 0.55), bad: false }
              }
            }
          }
          if (p.state === 'flow' && p.x > gateX[gateX.length - 1] + 40) {
            p.state = 'deploy'
            p.sx = p.x
            p.sy = p.y
            p.t = 0
          }
        } else if (p.state === 'blocked') {
          p.vy += 260 * dt
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.life -= dt * 0.9
          if (p.life <= 0) p.state = 'done'
        } else if (p.state === 'deploy') {
          const n = nodes[p.target]
          p.t += dt * 1.6
          const e = easeOut(p.t)
          // gentle arc into the node
          const mx = (p.sx + n.x) / 2
          const my = Math.min(p.sy, n.y) - 26
          const a = 1 - e
          p.x = a * a * p.sx + 2 * a * e * mx + e * e * n.x
          p.y = a * a * p.sy + 2 * a * e * my + e * e * n.y
          if (p.t >= 1) {
            p.state = 'done'
            n.pulse = 1
            nodes[0].pulse = Math.max(nodes[0].pulse, 0.5)
            stats.shipped++
            heart.push(1)
          }
        }
      }
      for (let i = packets.length - 1; i >= 0; i--) if (packets[i].state === 'done') packets.splice(i, 1)
      for (const f of gateFlash) f.v = Math.max(0, f.v - dt * 1.6)
      for (const n of nodes) n.pulse = Math.max(0, n.pulse - dt * 1.4)

      // heartbeat buffer: one sample per frame-ish
      heart.push(0)
      const maxLen = compact ? 70 : 120
      while (heart.length > maxLen) heart.shift()

      mouse.sx += (mouse.tx - mouse.sx) * Math.min(1, dt * 3)
      mouse.sy += (mouse.ty - mouse.sy) * Math.min(1, dt * 3)
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)

      // ---- dot field with gentle parallax + cursor spotlight
      const gap = compact ? 24 : 30
      const ox = (mouse.sx * 10) % gap
      const oy = (mouse.sy * 10) % gap
      for (let y = -gap + oy; y < h + gap; y += gap) {
        for (let x = -gap + ox; x < w + gap; x += gap) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d = dx * dx + dy * dy
          const near = d < 32000 ? 1 - d / 32000 : 0
          const a = 0.07 + near * 0.32
          ctx.fillStyle = near > 0 ? rgba(SIGNAL, a) : rgba(INK, a)
          ctx.fillRect(x, y, 1.2, 1.2)
        }
      }

      const intro = easeOut(time / 1.2)

      // ---- lane
      const laneStart = gateX[0] - 30
      const laneEnd = cx - 20
      ctx.strokeStyle = rgba(INK, 0.1)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(laneStart, laneY)
      ctx.lineTo(laneStart + (laneEnd - laneStart) * intro, laneY)
      ctx.stroke()

      // ---- gates
      const gh = compact ? 26 : 44
      ctx.font = `${compact ? 9 : 10.5}px "Geist Mono", ui-monospace, monospace`
      ctx.textAlign = 'center'
      GATES.forEach((label, i) => {
        const gi = easeOut((time - 0.2 - i * 0.12) / 0.8)
        if (gi <= 0) return
        const x = gateX[i]
        const f = gateFlash[i]
        const col = f.bad ? AMBER : SIGNAL
        const hh = gh * gi
        // frame brackets
        ctx.strokeStyle = rgba(INK, 0.22 + f.v * 0.3)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - 5, laneY - hh)
        ctx.lineTo(x, laneY - hh)
        ctx.lineTo(x, laneY + hh)
        ctx.lineTo(x - 5, laneY + hh)
        ctx.stroke()
        if (f.v > 0) {
          const grad = ctx.createLinearGradient(x, laneY - hh, x, laneY + hh)
          grad.addColorStop(0, rgba(col, 0))
          grad.addColorStop(0.5, rgba(col, 0.85 * f.v))
          grad.addColorStop(1, rgba(col, 0))
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x, laneY - hh)
          ctx.lineTo(x, laneY + hh)
          ctx.stroke()
          ctx.fillStyle = rgba(col, 0.06 * f.v)
          ctx.fillRect(x - 22, laneY - hh, 22, hh * 2)
        }
        ctx.fillStyle = rgba(f.bad && f.v > 0.1 ? AMBER : INK, 0.4 + f.v * 0.5)
        ctx.fillText(label, x, laneY - gh - 12)
        if (!compact) {
          ctx.fillStyle = rgba(INK, 0.22)
          ctx.fillText(String(i + 1).padStart(2, '0'), x, laneY + gh + 18)
        }
      })

      // ---- cluster edges
      ctx.lineWidth = 1
      for (let i = 1; i < nodes.length; i++) {
        const a = nodes[i]
        const b = nodes[i === nodes.length - 1 ? 1 : i + 1]
        const vis = easeOut((time - a.born) / 0.6)
        if (vis <= 0) continue
        ctx.strokeStyle = rgba(INK, 0.1 * vis + a.pulse * 0.25)
        ctx.beginPath()
        ctx.moveTo(nodes[0].x, nodes[0].y)
        ctx.lineTo(nodes[0].x + (a.x - nodes[0].x) * vis, nodes[0].y + (a.y - nodes[0].y) * vis)
        ctx.stroke()
        ctx.strokeStyle = rgba(INK, 0.07 * vis)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(a.x + (b.x - a.x) * vis, a.y + (b.y - a.y) * vis)
        ctx.stroke()
      }

      // ---- packets
      for (const p of packets) {
        const blocked = p.state === 'blocked'
        const col = blocked ? AMBER : SIGNAL
        const alpha = blocked ? p.life : p.state === 'deploy' ? 1 : Math.min(1, (p.x + 20) / 80)
        if (p.state === 'flow') {
          const tail = Math.min(46, p.vx * 0.32)
          const grad = ctx.createLinearGradient(p.x - tail, p.y, p.x, p.y)
          grad.addColorStop(0, rgba(col, 0))
          grad.addColorStop(1, rgba(col, 0.55 * alpha))
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(p.x - tail, p.y)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
        ctx.fillStyle = rgba(blocked ? AMBER : p.x < gateX[0] ? INK : col, alpha * 0.95)
        ctx.beginPath()
        ctx.arc(p.x, p.y, blocked ? 2.4 : 1.9, 0, Math.PI * 2)
        ctx.fill()
        if (blocked) {
          ctx.strokeStyle = rgba(AMBER, p.life * 0.5)
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5 + (1 - p.life) * 10, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // ---- cluster nodes
      for (const n of nodes) {
        const vis = easeOut((time - n.born) / 0.6)
        if (vis <= 0) continue
        if (n.pulse > 0) {
          ctx.strokeStyle = rgba(SIGNAL, n.pulse * 0.6)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r + (1 - n.pulse) * 18, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.fillStyle = nodeFill
        ctx.strokeStyle = rgba(SIGNAL, 0.45 + n.pulse * 0.55)
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * vis, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = rgba(SIGNAL, 0.5 + n.pulse * 0.5)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 0.38 * vis, 0, Math.PI * 2)
        ctx.fill()
      }
      const R = Math.abs(nodes[1].x - nodes[0].x)
      ctx.fillStyle = rgba(INK, 0.4 * easeOut((time - 1.6) / 0.6))
      ctx.fillText('cluster · prod', cx, cy + R + (compact ? 22 : 30))

      // ---- heartbeat (monitoring) under the cluster
      if (!compact) {
        const hx = cx - R - 10
        const hw = R * 2 + 20
        const hy = cy + R + 52
        ctx.strokeStyle = rgba(SIGNAL, 0.55 * easeOut((time - 1.8) / 0.6))
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (let i = 0; i < heart.length; i++) {
          const x = hx + (i / (heart.length - 1)) * hw
          let y = hy
          // draw a spike spanning a few samples after each event
          for (let k = 0; k < 4; k++) {
            const v = heart[i - k]
            if (v) y = hy + [-10, 7, -3, 1][k]
          }
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.fillStyle = rgba(INK, 0.28)
        ctx.fillText('monitor', cx, hy + 24)
      }
    }

    let last = performance.now()
    function loop(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      step(dt)
      draw()
      if (now - lastStats > 250) {
        lastStats = now
        statsCb.current?.({ ...stats })
      }
      raf = requestAnimationFrame(loop)
    }
    function start() {
      if (running || reduced) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    layout()
    if (reduced) {
      // one representative still frame
      for (let i = 0; i < 260; i++) step(1 / 60)
      draw()
      statsCb.current?.({ ...stats })
    } else {
      // seed a few packets so the first frame isn't empty
      for (let i = 0; i < 6; i++) spawn(Math.random() * gateX[0])
    }

    const ro = new ResizeObserver(() => {
      layout()
      if (reduced) draw()
    })
    ro.observe(canvas)

    let visible = true
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !document.hidden) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden || !visible ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.tx = (mouse.x / r.width - 0.5) * 2
      mouse.ty = (mouse.y / r.height - 0.5) * 2
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const host = canvas.parentElement?.parentElement ?? canvas
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, palette])

  return <canvas ref={ref} aria-hidden="true" />
}
