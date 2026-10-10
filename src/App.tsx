import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { CursorGlow } from './components/CursorGlow'
import { ScrollRail } from './components/ScrollRail'
import { SmoothScroll } from './components/SmoothScroll'
import { About } from './sections/About'
import { Arsenal } from './sections/Arsenal'
import { Contact } from './sections/Contact'
import { FieldWork } from './sections/FieldWork'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Life } from './sections/Life'
import { Projects } from './sections/Projects'
import { Record } from './sections/Record'
import { Simulator } from './sections/Simulator'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <CursorGlow />
      <ScrollRail />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Arsenal />
        <FieldWork />
        <Projects />
        <Simulator />
        <Record />
        <Life />
        <Contact />
      </main>
    </MotionConfig>
    </ThemeProvider>
  )
}
