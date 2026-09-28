import { useMemo, useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/scroll'
import { usePageTransition } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { brands } from '../data/content'
import BrandVisual from './BrandVisual'
import { ArrowUpRight } from './icons'

const SLOTS = 18 // cards around the full circle, 20° apart
const RING = 0.425 // card-centre radius as a fraction of the wheel diameter

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

export default function BrandWheel() {
  const wrap = useRef(null)
  const spin = useRef(null)
  const dial = useRef(null)
  const hovering = useRef(false)
  const { go } = usePageTransition()
  const slots = useMemo(() => Array.from({ length: SLOTS }, (_, i) => brands[i % brands.length]), [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const hero = wrap.current.closest('section')
      const loop = gsap.to(spin.current, { rotation: -360, duration: 90, ease: 'none', repeat: -1 })

      // Scrolling spins the wheel faster (or backwards); hovering a card slows it right down
      let speed = 1
      const tick = () => {
        const velocity = getLenis()?.velocity ?? 0
        const target = hovering.current ? 0.12 : gsap.utils.clamp(-6, 8, 1 + velocity * 0.3)
        speed += (target - speed) * 0.06
        loop.timeScale(speed)
      }
      gsap.ticker.add(tick)

      ScrollTrigger.create({
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => loop.paused(!self.isActive),
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

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
      style={{ width: 'var(--wheel-d)', height: 'calc(var(--wheel-d) / 2)' }}
    >
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(#000_72%,transparent)]">
        <svg
          ref={dial}
          viewBox="0 0 1000 500"
          className="absolute inset-0 h-full w-full origin-bottom text-neutral-400"
          fill="none"
          aria-hidden="true"
        >
          <path d={DIAL} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="500" cy="500" r="493" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".7" />
        </svg>

        <div data-wheel-circle className="absolute top-0 left-0 aspect-square w-full">
          <div ref={spin} className="absolute inset-0 will-change-transform">
            {slots.map((brand, i) => (
              <div
                key={i}
                className="pointer-events-auto absolute top-1/2 left-1/2"
                style={{
                  width: 'var(--card-w)',
                  transform: `translate(-50%, -50%) rotate(${i * (360 / SLOTS)}deg) translateY(calc(var(--wheel-d) * -${RING}))`,
                }}
              >
                <BrandCard
                  brand={brand}
                  onEnter={() => (hovering.current = true)}
                  onLeave={() => (hovering.current = false)}
                  onClick={() => go(`/brands/${brand.slug}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandCard({ brand, onEnter, onLeave, onClick }) {
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
      className="group block w-full rounded-[0.42em] bg-neutral-800 p-[0.5em] pb-0 text-start text-neutral-200 shadow-[0_2em_3em_-1.5em_rgba(22,21,19,0.45)] transition-transform duration-500 ease-osmo hover:-translate-y-[0.6em]"
    >
      <BrandVisual brand={brand} className="rounded-[0.25em]" />
      <span className="flex items-center justify-between gap-[0.6em] py-[0.75em] ps-[0.35em] pe-[0.2em]">
        <span className="flex min-w-0 items-center gap-[0.55em]">
          <span className="size-[0.55em] shrink-0 rounded-full" style={{ backgroundColor: brand.color }} />
          <span className="truncate opacity-80">{l(brand.category)}</span>
        </span>
        <span className="flex size-[1.9em] shrink-0 items-center justify-center rounded-[0.25em] bg-neutral-700 transition-colors duration-300 group-hover:bg-volt group-hover:text-neutral-800">
          <ArrowUpRight className="size-[1.05em]" />
        </span>
      </span>
    </button>
  )
}
