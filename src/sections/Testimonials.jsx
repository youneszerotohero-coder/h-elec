import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { cx } from '../lib/cx'
import { testimonials } from '../data/content'
import { Eyebrow } from '../components/Section'
import { useI18n } from '../i18n/I18n'

const DURATION = 7 // seconds per quote

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const quote = useRef(null)
  const bars = useRef([])
  const leaving = useRef(false)
  const { t: tr, l, lang } = useI18n()
  const t = testimonials[active]

  const go = (next) => {
    if (next === active || leaving.current) return
    leaving.current = true
    gsap.to(quote.current.querySelectorAll('.q-line, [data-author]'), {
      yPercent: -100,
      autoAlpha: 0,
      duration: 0.45,
      ease: 'osmo',
      stagger: 0.03,
      onComplete: () => {
        leaving.current = false
        setActive(next)
      },
    })
  }

  useGSAP(
    () => {
      const split = SplitText.create(quote.current.querySelector('blockquote'), { type: 'lines', mask: 'lines', linesClass: 'q-line' })
      gsap.from(split.lines, { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.07 })
      gsap.from('[data-author]', { y: 18, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: 0.2 })

      const timer = gsap.fromTo(
        bars.current[active],
        { scaleX: 0 },
        { scaleX: 1, duration: DURATION, ease: 'none', onComplete: () => go((active + 1) % testimonials.length) },
      )
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => timer.paused(!self.isActive),
      })
      timer.paused(!st.isActive)
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="testimonials" className="py-[clamp(6rem,12vw,11rem)]">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-12 lg:col-span-4">
          <div>
            <Eyebrow index="06">{tr('testi.eyebrow')}</Eyebrow>
            <h2 data-split className="display mt-6 text-h2">
              {tr('testi.title')}
            </h2>
          </div>
          <ul className="flex flex-col lg:mt-auto">
            {testimonials.map((item, i) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active}
                  className="group relative flex w-full items-baseline justify-between gap-4 border-t border-neutral-400 py-4 text-start"
                >
                  <span
                    ref={(el) => (bars.current[i] = el)}
                    aria-hidden="true"
                    style={{ transform: 'scaleX(0)' }}
                    className="absolute -top-px start-0 h-[2px] w-full origin-left bg-neutral-800 rtl:origin-right"
                  />
                  <span className={cx('text-[1.1rem] transition-colors duration-300', i === active ? 'text-neutral-800' : 'text-neutral-500 group-hover:text-neutral-800')}>
                    {item.name}
                  </span>
                  <span className="eyebrow text-neutral-500">{item.company}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <figure ref={quote} key={active} className="flex flex-col lg:col-span-7 lg:col-start-6">
          <span aria-hidden="true" className="display h-[0.55em] text-[clamp(6rem,10vw,11rem)] leading-[0.9] text-spark">
            {lang === 'en' ? '“' : '«'}
          </span>
          <blockquote className="display mt-6 text-[clamp(1.6rem,2.7vw,3.3rem)] leading-[1.08] tracking-[-0.035em] lg:min-h-[5.4em]">
            {l(t.quote)}
          </blockquote>
          <figcaption data-author className="mt-10 flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-volt font-semibold text-neutral-800">
              {t.name
                .split(' ')
                .map((p) => p[0])
                .join('')}
            </span>
            <span>
              <span className="block font-medium">{t.name}</span>
              <span className="text-neutral-550">
                {l(t.role)} · {t.company}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
