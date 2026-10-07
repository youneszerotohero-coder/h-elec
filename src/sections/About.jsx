import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useI18n } from '../i18n/I18n'
import { ui } from '../i18n/ui'
import { stats } from '../data/content'
import { Eyebrow } from '../components/Section'
import ProductArt, { artTheme } from '../components/ProductArt'
import { Bolt } from '../components/icons'

const InlineArt = ({ type, theme }) => (
  <span
    style={artTheme(theme)}
    className="mx-[0.06em] inline-flex h-[0.82em] w-[1.55em] translate-y-[0.06em] items-center justify-center overflow-hidden rounded-full align-baseline"
  >
    <ProductArt type={type} className="h-[150%] w-auto" />
  </span>
)

const InlineBolt = () => (
  <span className="mx-[0.06em] inline-flex h-[0.82em] w-[0.82em] translate-y-[0.06em] items-center justify-center rounded-full bg-spark align-baseline">
    <Bolt className="h-[58%] w-auto text-white" />
  </span>
)

export default function About() {
  const root = useRef(null)
  const { t, l, num } = useI18n()

  useGSAP(
    () => {
      const statement = root.current.querySelector('[data-statement]')
      const split = SplitText.create(statement, { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 48%', scrub: true },
        },
      )

      gsap.utils.toArray('[data-count]').forEach((el) => {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: Number(el.dataset.count),
          duration: 2.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => (el.textContent = num(Math.round(counter.v))),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative py-[clamp(6rem,13vw,12rem)]">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow index="01">{t('about.eyebrow')}</Eyebrow>
          </div>
          <p data-statement className="display text-statement lg:col-span-9">
            {l(ui['about.statement']).map((part, i) =>
              part === '[art]' ? <InlineArt key={i} type="breaker" theme="volt" /> : part === '[bolt]' ? <InlineBolt key={i} /> : <span key={i}>{part}</span>,
            )}
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-8 lg:grid-cols-12">
          <div data-reveal className="flex items-baseline gap-3 self-start border-t border-neutral-400 pt-5 lg:col-span-3 lg:me-8">
            <span className="eyebrow text-neutral-550">{t('about.since')}</span>
            <span className="display text-[clamp(2.4rem,3.6vw,4rem)] leading-[0.8] tracking-[-0.05em] text-spark">1994</span>
          </div>
          <div className="grid gap-x-10 gap-y-6 text-[clamp(1.05rem,1.15vw,1.3rem)] leading-[1.55] tracking-[-0.01em] text-neutral-600 md:grid-cols-2 lg:col-span-9">
            <p data-reveal className="max-w-[34em] border-t border-neutral-400 pt-5">{t('about.p1')}</p>
            <p data-reveal className="max-w-[34em] border-t border-neutral-400 pt-5">{t('about.p2')}</p>
          </div>
        </div>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} data-reveal className="flex flex-col border-t border-neutral-400 pt-5">
              <p className="eyebrow text-neutral-550">{l(s.label)}</p>
              <p className="display mt-8 text-[clamp(3.2rem,5.6vw,7rem)] leading-[0.9] tracking-[-0.055em] tabular-nums md:mt-12">
                <span data-count={s.value}>0</span>
                <span className="text-spark">{l(s.suffix)}</span>
              </p>
              <p className="mt-4 max-w-[16em] text-neutral-550">{l(s.note)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
