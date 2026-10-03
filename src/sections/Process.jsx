import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useQuote } from '../context/QuoteContext'
import { useI18n } from '../i18n/I18n'
import { steps } from '../data/content'
import { SectionHead } from '../components/Section'
import Button from '../components/Button'

const pad = (n) => String(n).padStart(2, '0')

// Distance along a left-to-right path at which it reaches `x`
function lengthAtX(path, x) {
  let lo = 0
  let hi = path.getTotalLength()
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (path.getPointAtLength(mid).x < x) lo = mid
    else hi = mid
  }
  return lo
}

export default function Process() {
  const root = useRef(null)
  const track = useRef(null)
  const box = useRef(null)
  const wire = useRef(null)
  const flow = useRef(null)
  const rail = useRef(null)
  const [size, setSize] = useState({ w: 1200, h: 160 })
  const { openQuote } = useQuote()
  const { t, l } = useI18n()

  // Build the cable in real pixels so it never stretches
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width && height) setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const y = h * 0.25
  const sag = h * 0.72
  const xs = [w / 6, w / 2, (5 * w) / 6]
  const k = w * 0.11
  const d = `M0 ${y}L${xs[0]} ${y}C${xs[0] + k} ${sag} ${xs[1] - k} ${sag} ${xs[1]} ${y}C${xs[1] + k} ${sag} ${xs[2] - k} ${sag} ${xs[2]} ${y}L${w} ${y}`

  useGSAP(
    () => {
      const nodes = gsap.utils.toArray('[data-node]')
      const mm = gsap.matchMedia()

      // Desktop: the cable draws across, each terminal lights up as the current reaches it
      mm.add('(min-width: 1024px)', () => {
        const total = wire.current.getTotalLength()
        const stops = xs.map((x) => lengthAtX(wire.current, x) / total)
        gsap.fromTo(
          wire.current,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: track.current, start: 'top 72%', end: 'bottom 62%', scrub: 0.6 },
            onUpdate() {
              const p = this.progress()
              nodes.forEach((n, i) => n.toggleAttribute('data-lit', p >= stops[i] - 0.003))
              flow.current.style.opacity = p > 0.995 ? '1' : '0'
            },
          },
        )
      })

      // Mobile: a vertical rail fills downward
      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          rail.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track.current, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 } },
        )
        nodes.forEach((n) =>
          ScrollTrigger.create({
            trigger: n,
            start: 'top 65%',
            onEnter: () => n.setAttribute('data-lit', ''),
            onLeaveBack: () => n.removeAttribute('data-lit'),
          }),
        )
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [w, h], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="process" className="overflow-hidden pb-[clamp(6rem,12vw,11rem)]">
      <div className="container-x">
        <SectionHead
          index="05"
          eyebrow={t('process.eyebrow')}
          title={t('process.title')}
          aside={
            <>
              <p>{t('process.aside')}</p>
              <Button variant="dark" className="mt-7" onClick={(e) => openQuote(null, e.currentTarget)}>
                {t('process.cta')}
              </Button>
            </>
          }
        />

        <div ref={track} className="relative mt-[clamp(3.5rem,7vw,6rem)] grid lg:grid-cols-3">
          <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 max-lg:hidden">
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="absolute inset-0 overflow-visible rtl:-scale-x-100">
              <path d={d} className="stroke-neutral-400" strokeWidth="1.25" strokeDasharray="3 7" />
              <path ref={wire} d={d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="stroke-neutral-800" strokeWidth="3" strokeLinecap="round" />
              <path
                ref={flow}
                d={d}
                pathLength="1"
                strokeDasharray="0.012 0.048"
                className="animate-flow stroke-volt opacity-0 transition-opacity duration-700"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div aria-hidden="true" className="absolute top-0 bottom-14 start-7 w-px bg-neutral-400 lg:hidden">
            <div ref={rail} className="h-full w-[3px] -translate-x-px origin-top bg-neutral-800" />
          </div>

          {steps.map((s, i) => (
            <div key={i} className="relative pb-14 ps-20 last:pb-0 lg:flex lg:flex-col lg:items-center lg:px-8 lg:pb-0 lg:text-center">
              <span
                data-node
                className="absolute top-0 start-0 z-10 flex size-14 items-center justify-center rounded-full border border-neutral-400 bg-neutral-200 font-mono text-[0.85rem] transition-[background-color,border-color,box-shadow] duration-500 ease-osmo data-[lit]:border-neutral-800 data-[lit]:bg-volt data-[lit]:shadow-[0_0_0_0.5rem_rgba(240,168,32,0.28)] lg:relative lg:mt-3"
              >
                {pad(i + 1)}
              </span>
              <div data-reveal className="pt-2 lg:pt-[5.5rem]">
                <p className="eyebrow text-neutral-550">{t('process.step', { n: pad(i + 1) })}</p>
                <h3 className="display mt-3 text-h3">{l(s.title)}</h3>
                <p className="mt-3 max-w-[22em] text-neutral-550">{l(s.text)}</p>
                <div className="mt-5 flex flex-wrap gap-1.5 lg:justify-center">
                  {s.chips.map((c) => (
                    <span key={typeof c === 'string' ? c : c.en} className="rounded-full bg-neutral-300 px-2.5 py-1 font-mono text-[0.72rem] text-neutral-600 uppercase">
                      {l(c)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
