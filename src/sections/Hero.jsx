import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { intro } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { ui } from '../i18n/ui'
import { cx } from '../lib/cx'
import { Bolt } from '../components/icons'
import BrandWheel from '../components/BrandWheel'

function Words({ words, className = '' }) {
  return (
    // Line mask — padded so the tilted words aren't clipped while they rise
    <span aria-hidden="true" className={cx('-mx-[0.08em] -my-[0.12em] flex gap-x-[0.2em] overflow-hidden px-[0.08em] py-[0.12em]', className)}>
      {words.map((w) => (
        <span key={w} data-hero-word className="inline-block will-change-transform">
          {w}
        </span>
      ))}
    </span>
  )
}

const Chip = ({ round = false, children }) => (
  <span
    className={cx(
      'mx-[0.04em] my-px inline-block bg-neutral-300 pt-[0.125em] pb-[0.1875em] leading-[1.1]',
      round ? 'rounded-full px-[0.5em]' : 'rounded-[0.1875rem] px-[0.35em]',
    )}
  >
    {children}
  </span>
)

/**
 * A chip is an inline-block, so the browser may break right after it and strand the comma on the next line.
 * Punctuation that follows a chip (", ") and a letter written against it (Arabic "و") travel with the chip.
 */
function Description({ parts }) {
  const cut = parts.map((part, i) => {
    if (Array.isArray(part)) return null
    const lead = Array.isArray(parts[i - 1]) ? (part.match(/^\S+/)?.[0] ?? '') : ''
    const rest = part.slice(lead.length)
    const trail = Array.isArray(parts[i + 1]) ? (rest.match(/\S+$/)?.[0] ?? '') : ''
    return { lead, trail, middle: rest.slice(0, rest.length - trail.length) }
  })
  return parts.map((part, i) =>
    Array.isArray(part) ? (
      <span key={i} className="whitespace-nowrap">
        {cut[i - 1]?.trail}
        <Chip round={part[1] === 'round'}>{part[0]}</Chip>
        {cut[i + 1]?.lead}
      </span>
    ) : (
      cut[i].middle && <span key={i}>{cut[i].middle}</span>
    ),
  )
}

export default function Hero() {
  const root = useRef(null)
  const { t, l } = useI18n()

  useGSAP(
    () => {
      const words = gsap.utils.toArray('[data-hero-word]')
      gsap.set(words, { yPercent: 110, rotate: 10, transformOrigin: 'bottom left' })

      gsap
        .timeline({ defaults: { duration: 1.2, ease: 'expo.out', stagger: 0.05 }, delay: intro.delay })
        .to(words, { yPercent: 0, rotate: 0 })
        .from('[data-hero-icon]', { yPercent: 100, scale: 0.3, autoAlpha: 0, rotate: -270, transformOrigin: 'center center' }, '<')
        .from('[data-hero-reveal]', { y: '2em', autoAlpha: 0 }, '<')
        .from('[data-wheel-circle]', { rotate: -45, duration: 2 }, '<')
        .from('[data-hero-line]', { scaleY: 0, transformOrigin: 'top center', duration: 1.6 }, '<')
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" data-theme-section="light" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div data-hero-line aria-hidden="true" className="absolute inset-y-0 left-1/2 -z-10 w-px bg-neutral-400/80" />

      <div className="h-[calc(3.375rem+max(6.5rem,19svh))] shrink-0" />

      <div className="container-x flex flex-col items-center text-center">
        <h1 className="display flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-[0.1em] text-hero">
          <span className="sr-only">{t('hero.sr')}</span>
          <Words words={l(ui['hero.words1'])} className="justify-center max-md:basis-full" />
          <Bolt data-hero-icon className="h-[0.8em] w-auto text-spark" />
          <Words words={l(ui['hero.words2'])} />
        </h1>

        <p data-hero-reveal className="mt-[clamp(1.75rem,3.2vw,3rem)] max-w-[30em] text-lead text-balance">
          {/* strings are text, ['word'] a chip, ['word', 'round'] a rounded chip */}
          <Description parts={l(ui['hero.desc'])} />
        </p>
      </div>

      {/* The row is at least as tall as the top card of the wheel, so that card is never clipped */}
      <div
        className="relative mt-[clamp(2.5rem,5vw,4.5rem)] min-h-[max(clamp(15rem,38svh,30rem),calc(var(--wheel-d)*0.145))] flex-1"
        style={{
          '--wheel-d': 'clamp(1500px, calc(150vw + 100px), 2900px)',
          '--card-w': 'calc(var(--wheel-d) * 0.118)',
        }}
      >
        <BrandWheel />
      </div>
    </section>
  )
}
