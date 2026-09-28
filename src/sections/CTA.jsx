import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useQuote } from '../context/QuoteContext'
import { site } from '../data/content'
import { Eyebrow } from '../components/Section'
import Button from '../components/Button'
import { WhatsApp } from '../components/icons'
import { useI18n } from '../i18n/I18n'

// Voltmeter scale: 0 → 400 V across a half circle, centre at (500, 500)
const SCALE = (() => {
  const ticks = []
  const labels = []
  for (let v = 0; v <= 400; v += 10) {
    const a = Math.PI + (v / 400) * Math.PI
    const major = v % 50 === 0
    const [r1, r2] = major ? [398, 440] : [418, 440]
    ticks.push(`M${500 + Math.cos(a) * r1} ${500 + Math.sin(a) * r1}L${500 + Math.cos(a) * r2} ${500 + Math.sin(a) * r2}`)
    if (major) labels.push({ v, x: 500 + Math.cos(a) * 470, y: 500 + Math.sin(a) * 470 })
  }
  return { d: ticks.join(''), labels }
})()

export default function CTA() {
  const root = useRef(null)
  const { openQuote } = useQuote()
  const { t } = useI18n()

  // The needle swings up to 230 V as the section scrolls into view
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-needle]',
        { rotation: -86, svgOrigin: '500 500' },
        {
          rotation: -90 + (230 / 400) * 180,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.8 },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="px-2 py-2 md:px-3 md:py-3">
      <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-volt text-neutral-800">
        <svg
          viewBox="0 -10 1000 530"
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-2%] left-1/2 -z-10 w-[max(120%,64rem)] -translate-x-1/2 text-neutral-800"
          fill="none"
        >
          <path d="M60 500a440 440 0 0 1 880 0" stroke="currentColor" strokeOpacity=".22" strokeWidth="1.5" />
          <path d={SCALE.d} stroke="currentColor" strokeOpacity=".22" strokeWidth="1.5" />
          <g className="max-md:hidden">
            {SCALE.labels.map((l) => (
              <text
                key={l.v}
                x={l.x}
                y={l.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fillOpacity=".35"
                style={{ font: '500 15px "JetBrains Mono Variable", monospace' }}
              >
                {l.v}
              </text>
            ))}
          </g>
          <g opacity=".28">
            <g data-needle>
              <path d="M500 500V120" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle cx="500" cy="500" r="14" fill="currentColor" />
          </g>
        </svg>

        <div className="container-x relative flex flex-col items-center py-[clamp(5.5rem,12vw,11rem)] text-center">
          <Eyebrow index="07">{t('cta.eyebrow')}</Eyebrow>
          <h2 data-split className="display mt-8 text-[clamp(3.1rem,8.4vw,11rem)] leading-[0.88] tracking-[-0.055em]">
            {t('cta.title1')}
            <br />
            {t('cta.title2')}
          </h2>
          <p data-reveal className="mt-8 max-w-[27em] text-lead">
            {t('cta.text')}
          </p>
          <div data-reveal className="mt-10 flex flex-wrap justify-center gap-2">
            <Button variant="dark" size="lg" onClick={(e) => openQuote(null, e.currentTarget)}>
              {t('common.requestQuote')}
            </Button>
            <Button variant="outline" size="lg" href={site.whatsappHref} icon={<WhatsApp className="size-5" />}>
              {t('cta.whatsapp')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
