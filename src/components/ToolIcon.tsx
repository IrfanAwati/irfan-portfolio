import type { CSSProperties } from 'react'
import type { ToolVisual } from '../content/tools'

/** Logo on a light "app icon" tile (keeps dark logos visible in dark mode), or a monogram badge. */
export function ToolIcon({ v, size = 30 }: { v: ToolVisual; size?: number }) {
  const style = { '--c': v.color, width: size, height: size } as CSSProperties
  if (v.icon) {
    return (
      <span className="ticon" style={style} aria-hidden="true">
        <img src={`/icons/${v.icon}.svg`} alt="" loading="lazy" decoding="async" />
      </span>
    )
  }
  return (
    <span className="ticon mono" style={{ ...style, fontSize: size * (v.mono!.length > 2 ? 0.3 : 0.38) }} aria-hidden="true">
      {v.mono}
    </span>
  )
}
