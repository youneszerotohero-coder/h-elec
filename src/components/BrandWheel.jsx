import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/scroll'
import { usePageTransition } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { brands } from '../data/content'
import { cx } from '../lib/cx'
import BrandVisual from './BrandVisual'
import { ArrowRight, ArrowUpRight } from './icons'

const SLOTS = 18 // cards around the full circle, 20° apart
const STEP = 360 / SLOTS
const RING = 0.425 // card-centre radius as a fraction of the wheel diameter
const DRIFT = 4 // °/s the wheel turns on its own (a full turn every 90s)
const HOLD = 4500 // ms the wheel stays put after a manual step before it starts turning again
const OMEGA = 8.5 // stiffness of the spring that carries manual steps (critically damped, settles in ~0.7s)

// Gauge ticks, drawn in a 1000×500 box whose bottom-centre is the wheel centre
const DIAL = (() => {
  let d = ''
  for (let a = -90; a <= 90; a += 2) {
    const major = a % 10 === 0
    const rad = ((a - 90) * Math.PI) / 180
    const [r1, r2] = major ? [424, 450] : [434, 446]
    d += `M${(500 + Math.cos(rad) * r1).toFixed(2)} ${(500 + Math.sin(rad) * r1).toFixed(2)}L${(500 + Math.cos(rad) * r2).toFixed(2)} ${(500 + Math.sin(rad) * r2).toFixed(2)}`
  }
  return d
})()

const mod = (n, m) => ((n % m) + m) % m
const pad = (n) => String(n).padStart(2, '0')

/*
  Motion model — everything runs in one ticker callback, outside React:
  angle = auto (slow drift, sped up by scrolling) + x (manual layer).
  A step sets an absolute `goal` angle; while the wheel is held, x is pulled toward `goal − auto` by a
  critically damped spring, so it eases in and out, never overshoots, and rapid clicks just move the
  goal further — the wheel keeps its momentum instead of restarting a tween.
  React only re-renders the small readout; the 18 cards render once.
*/
export default function BrandWheel() {
  const wrap = useRef(null)
  const spin = useRef(null)
  const dial = useRef(null)
  const cards = useRef([])
  const hovering = useRef(false)
  const announce = useRef(null) // the readout's state setter
  const motion = useRef({ goal: null, heldUntil: 0, auto: 0, x: 0 })
  const { go } = usePageTransition()
  const { dir } = useI18n()
  const dirRef = useRef(dir)
  dirRef.current = dir

  useGSAP(
    () => {
      const reduced = prefersReducedMotion()
      const hero = wrap.current.closest('section')
      const circle = wrap.current.querySelector('[data-wheel-circle]')
      const setRotation = gsap.quickSetter(spin.current, 'rotation', 'deg')
      const m = motion.current
      let v = 0 // spring velocity, °/s
      let target = 0 // where x is heading
      let speed = 1 // multiplier on the drift
      let inView = true
      let current = -1

      const tick = (time, deltaTime) => {
        if (!inView) return
        const dt = Math.min(deltaTime / 1000, 0.05) // after a stall, don't leap
        const now = performance.now()
        const held = hovering.current || now < m.heldUntil

        // Drift: scrolling spins the wheel faster (or backwards); hovering a card or stepping stops it
        if (!reduced) {
          const velocity = getLenis()?.velocity ?? 0
          const want = held ? 0 : gsap.utils.clamp(-6, 8, 1 + velocity * 0.3)
          speed += (want - speed) * (1 - Math.exp(-dt * (held ? 12 : 2.5)))
          m.auto -= DRIFT * speed * dt
        }

        // Manual layer: aim so the wheel lands exactly on the goal slot, whatever the drift did meanwhile
        if (m.goal !== null) {
          target = m.goal - m.auto
          if (!held) m.goal = null // let go: keep the current spot and resume drifting from there
        }
        if (reduced) {
          m.x = target
          v = 0
        } else {
          // Semi-implicit Euler in small sub-steps keeps the spring stable at any frame rate
          for (let left = dt; left > 0; left -= 1 / 240) {
            const h = Math.min(left, 1 / 240)
            v += (OMEGA * OMEGA * (target - m.x) - 2 * OMEGA * v) * h
            m.x += v * h
          }
          if (Math.abs(target - m.x) < 0.001 && Math.abs(v) < 0.001) {
            m.x = target
            v = 0
          }
        }
        setRotation(m.auto + m.x)

        // Whichever slot sits at 12 o'clock is the active brand
        const angle = gsap.getProperty(circle, 'rotation') + m.auto + m.x
        const slot = mod(Math.round(-angle / STEP), SLOTS)
        if (slot !== current) {
          cards.current[current]?.removeAttribute('data-active')
          cards.current[slot]?.setAttribute('data-active', '')
          current = slot
          announce.current?.(slot % brands.length)
        }
      }
      gsap.ticker.add(tick)

      ScrollTrigger.create({
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (inView = self.isActive),
      })

      gsap.to(dial.current, {
        rotation: -7,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })

      return () => gsap.ticker.remove(tick)
    },
    { scope: wrap },
  )

  // +1 brings the next card to the top, -1 the previous one. Clicks stack onto the pending goal.
  const step = (n) => {
    const m = motion.current
    m.heldUntil = performance.now() + HOLD
    const turn = n * (dirRef.current === 'rtl' ? -1 : 1) // "next" follows the reading direction
    m.goal = (Math.round((m.goal ?? m.auto + m.x) / STEP) - turn) * STEP
  }

  // Rendered once: nothing in the wheel depends on render-time state, so React never touches it while it turns
  const ring = useMemo(
    () =>
      Array.from({ length: SLOTS }, (_, i) => {
        const brand = brands[i % brands.length]
        return (
          <div
            key={i}
            ref={(el) => (cards.current[i] = el)}
            className="group/slot pointer-events-auto absolute top-1/2 left-1/2"
            style={{
              width: 'var(--card-w)',
              transform: `translate(-50%, -50%) rotate(${i * STEP}deg) translateY(calc(var(--wheel-d) * -${RING}))`,
            }}
          >
            <BrandCard
              brand={brand}
              onEnter={() => (hovering.current = true)}
              onLeave={() => (hovering.current = false)}
              onClick={() => go(`/brands/${brand.slug}`)}
            />
          </div>
        )
      }),
    [go],
  )

  return (
    <>
      <div
        ref={wrap}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: 'var(--wheel-d)', height: 'calc(var(--wheel-d) / 2)' }}
      >
        <div className="absolute inset-0 overflow-clip [mask-image:linear-gradient(#000_72%,transparent)]">
          <svg
            ref={dial}
            viewBox="0 0 1000 500"
            className="absolute inset-0 h-full w-full origin-bottom text-white/25"
            fill="none"
            aria-hidden="true"
          >
            <path d={DIAL} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx="500" cy="500" r="493" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".7" />
          </svg>

          <div data-wheel-circle className="absolute top-0 left-0 aspect-square w-full">
            <div ref={spin} className="absolute inset-0 will-change-transform">
              {ring}
            </div>
          </div>
        </div>
      </div>

      {/* Controls: step the wheel one card at a time; the middle names the card at the top and links to it.
          Pinned just under the top card (not to the hero bottom), so they stay with the wheel on tall screens. */}
      <div className="absolute inset-x-0 top-[calc(var(--wheel-d)*0.14+0.25rem)] z-10 flex justify-center px-4">
        <Controls announce={announce} onStep={step} onOpen={(brand) => go(`/brands/${brand.slug}`)} />
      </div>
    </>
  )
}

/** The pill under the wheel. Holds the active brand itself, so a new card at the top only re-renders this. */
function Controls({ announce, onStep, onOpen }) {
  const [active, setActive] = useState(0)
  const { t, l } = useI18n()
  useEffect(() => {
    announce.current = setActive
    return () => (announce.current = null)
  }, [announce])
  const brand = brands[active]

  return (
    <div
      data-hero-reveal
      className="flex items-center gap-1 rounded-full bg-neutral-900/60 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_1.5rem_3rem_-1rem_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      <StepButton label={t('hero.prev')} onClick={() => onStep(-1)}>
        <ArrowRight className="size-5 rotate-180" />
      </StepButton>

      <button
        type="button"
        onClick={() => onOpen(brand)}
        aria-label={t('common.discover', { name: brand.name })}
        className="group flex h-11 w-[min(15rem,calc(100vw-9.5rem))] items-center gap-3 rounded-full px-3 text-start transition-colors duration-300 hover:bg-white/[0.06]"
      >
        <span className="font-mono text-[0.75rem] leading-none text-white/45 tabular-nums" dir="ltr">
          <span className="text-volt">{pad(active + 1)}</span>/{pad(brands.length)}
        </span>
        <span className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
          <span key={brand.slug} className="block animate-[ticker-in_0.45s_var(--ease-out-expo)]">
            <span className="block truncate text-[1rem] leading-tight font-medium tracking-[-0.02em] text-neutral-50">{brand.name}</span>
            <span className="block truncate text-[0.78rem] leading-tight text-white/50">{l(brand.category)}</span>
          </span>
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-white/50 transition-[color,translate] duration-300 group-hover:translate-x-[calc(var(--dir)*0.15rem)] group-hover:-translate-y-0.5 group-hover:text-volt" />
      </button>

      <StepButton label={t('hero.next')} onClick={() => onStep(1)} primary>
        <ArrowRight className="size-5" />
      </StepButton>
    </div>
  )
}

function StepButton({ label, onClick, primary = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full transition-[background-color,color,scale] duration-300 ease-osmo active:scale-90',
        primary ? 'bg-volt text-neutral-800 hover:bg-volt-300' : 'bg-white/[0.1] text-neutral-100 hover:bg-white/[0.18]',
      )}
    >
      {children}
    </button>
  )
}

// Memoised: the wheel's cards only re-render when the language changes
const BrandCard = memo(function BrandCard({ brand, onEnter, onLeave, onClick }) {
  const { t, l } = useI18n()
  return (
    <button
      type="button"
      tabIndex={-1}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onClick}
      aria-label={t('common.discover', { name: brand.name })}
      style={{ fontSize: 'max(7px, calc(var(--card-w) * 0.052))' }}
      // Own layer, and only transform/opacity animate — the active card lifts without repainting the whole wheel
      className="group relative block w-full rounded-[0.42em] bg-neutral-800 p-[0.5em] pb-0 text-start text-neutral-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_2em_3em_-1.5em_rgba(0,0,0,0.7)] transition-[translate] duration-700 ease-osmo [will-change:translate] hover:-translate-y-[0.6em] group-data-active/slot:-translate-y-[0.6em]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--color-volt)] opacity-0 transition-opacity duration-500 group-data-active/slot:opacity-100"
      />
      <BrandVisual brand={brand} className="rounded-[0.25em]" />
      <span className="flex items-center justify-between gap-[0.6em] py-[0.75em] ps-[0.35em] pe-[0.2em]">
        <span className="flex min-w-0 items-center gap-[0.55em]">
          <span className="size-[0.55em] shrink-0 rounded-full" style={{ backgroundColor: brand.color }} />
          <span className="truncate opacity-80">{l(brand.category)}</span>
        </span>
        <span className="relative flex size-[1.9em] shrink-0 items-center justify-center overflow-hidden rounded-[0.25em] bg-neutral-700 transition-colors duration-300 group-hover:text-neutral-800 group-data-active/slot:text-neutral-800">
          <span className="absolute inset-0 bg-volt opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-active/slot:opacity-100" />
          <ArrowUpRight className="relative size-[1.05em]" />
        </span>
      </span>
    </button>
  )
})
