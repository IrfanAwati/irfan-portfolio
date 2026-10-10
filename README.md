# Irfan Awati: portfolio

A single-page portfolio for a DevOps → DevSecOps engineer.
Built with Vite, React 19, TypeScript and Motion for React. The hero is a hand-written 2D canvas, and the diagrams are animated SVG.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle in dist/
npm run preview    # serve dist/ locally
npm run lint       # oxlint
```

## Deploy

The output is a static site, so any static host works.

- **Azure Static Web Apps:** app location `/portfolio`, output location `dist`, build command `npm run build`.
- **Vercel / Netlify:** set the root directory to `portfolio`, build with `npm run build`, publish `dist`.
- **GitHub Pages:** run `npm run build`, then publish `dist/`. If it's served from a sub-path, set `base` in `vite.config.ts`.

After deploying, change the `og:image` / `twitter:image` URLs in `index.html` to absolute URLs on your domain. Some social networks require absolute URLs.

There are no secrets, API keys or environment variables in this project.

## Editing content (no component changes needed)

All copy lives in `src/content/`:

| What | File |
| --- | --- |
| Name, headline, intro, links, email, résumé path, languages | `src/content/profile.ts` |
| About / philosophy / principles | `src/content/profile.ts` → `about` |
| Career timeline | `src/content/journey.ts` (empty `period` shows "Dates to confirm") |
| Skills and evidence markers | `src/content/skills.ts` |
| Project case studies | `src/content/projects.ts` |
| Pipeline simulator stages and scenarios | `src/content/pipeline.ts` |
| Certifications, honours, recommendation | `src/content/achievements.ts` |
| Ride gallery, route stops, passions | `src/content/life.ts` |
| Nav items | `src/content/nav.ts` |

### Add your ride photos

1. Put images in `public/gallery/` (JPG/WebP, around 2000px on the long edge).
2. In `src/content/life.ts`, set `src: '/gallery/your-file.jpg'`, update `alt`, `caption`, `place`, `date` and `story`, and **delete `placeholder: true`**.
3. `shape` controls the editorial grid: `'wide'` (2/3 width), `'tall'` (two rows) or `'square'`. The first item is the full-width cinematic opener.

### Portrait (About section)

`public/about/irfan-portrait.webp` is a transparent cutout, so it works in both themes. To replace it:
1. Generate the illustration from your own photo (Gemini works well).
2. Remove the background. The current one was cut out locally with the free `isnet-anime` ONNX model from rembg, but any background remover works.
3. Save it as a transparent WebP or PNG about 900px wide, and update `about.portrait` in `profile.ts` if the name changes.

### Tool logos and colours

- Logos come from **devicon** (MIT) and **simple-icons** (CC0). They're copied into `public/icons/` by `node scripts/extract-icons.mjs`; add a slug to the `MAP` there to include another one.
- `src/content/tools.ts` maps each tool name to its logo (or a monogram badge, for tools with no published logo) and its brand colour. The hero toolchain band lists every tool from `skills.ts` automatically.
- Each skill category has its own accent colour (`color` in `skills.ts`), used for the orbit, tabs and chips.

### Scrolling, scroll tab and Bit

- Smooth scrolling uses **Lenis** (`src/components/SmoothScroll.tsx`). It's off for visitors with reduced motion, and it publishes `--skew` so headings lean slightly with scroll speed.
- The side scroll tab and Bit, the buddy who hops line to line, live in `src/components/ScrollRail.tsx`. Edit `SECTIONS` there to change the markers, or `LINES` to change how often Bit hops. It's hidden below 1100px.
- Hero layout styles, the tab, Bit and the scrollbar are in `src/styles/experience.css`.

### Light / dark theme

The site follows the visitor's OS setting until they press the sun/moon button in the nav; after that their choice is remembered.
Colours live in two places that must stay in sync: the CSS tokens at the top of `src/index.css` (`:root` and `:root[data-theme='light']`), and `src/theme/palette.ts`, which feeds the canvas and SVG diagrams.

### Add a project

Append an object to `projects` in `src/content/projects.ts`. Set `diagram: 'none'`, or add a new diagram to `src/components/ProjectDiagram.tsx`.

### Add a résumé

Put the PDF in `public/resume/` and set `links.resume` in `profile.ts`. A "Résumé" link then appears in Contact.

## Structure

```
src/
  content/      ← all editable data
  components/   ← PipelineCanvas (hero), ProjectDiagram, PhotoSlot, Nav, motion primitives, icons
  sections/     ← one file per page section
  index.css     ← design tokens + all styles
public/         ← favicon, og.png, apple-touch-icon, gallery/
scripts/        ← og.html / icon.html (sources for the social image and touch icon)
```

To regenerate `public/og.png` after changing your name or headline, render `scripts/og.html` at 1200×630 with any headless browser, e.g.
`chrome --headless=new --window-size=1200,630 --screenshot=public/og.png scripts/og.html`.

See `CONTENT-INVENTORY.md` for where each fact came from and the open questions.
