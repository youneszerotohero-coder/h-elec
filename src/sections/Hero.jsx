import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { intro } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { ui } from '../i18n/ui'
import { site } from '../data/content'
import { cx } from '../lib/cx'
import { ArrowRight, Bolt } from '../components/icons'
import Button from '../components/Button'
import BrandWheel from '../components/BrandWheel'

function Words({ words, accentLast = false, className = '' }) {
  return (
    // Line mask — padded so the tilted words aren't clipped while they rise
    <span aria-hidden="true" className={cx('-mx-[0.08em] -my-[0.12em] flex gap-x-[0.2em] overflow-hidden px-[0.08em] py-[0.12em]', className)}>
      {words.map((w, i) => (
        <span key={w} data-hero-word className={cx('inline-block will-change-transform', accentLast && i === words.length - 1 && 'text-volt')}>
          {w}
        </span>
      ))}
    </span>
  )
}

const Chip = ({ round = false, children }) => (
  <span
    className={cx(
      'mx-[0.04em] my-px inline-block bg-white/[0.12] pt-[0.125em] pb-[0.1875em] leading-[1.1] text-neutral-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
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
        .from('[data-hero-bg]', { scale: 1.18, autoAlpha: 0, duration: 2.4, stagger: 0 }, 0)
        .to(words, { yPercent: 0, rotate: 0 }, 0.1)
        .from('[data-hero-icon]', { yPercent: 100, scale: 0.3, autoAlpha: 0, rotate: -270, transformOrigin: 'center center' }, '<')
        .from('[data-hero-reveal]', { y: '2em', autoAlpha: 0, stagger: 0.08 }, '<')
        .from('[data-wheel-circle]', { rotate: -45, duration: 2 }, '<')

      // The photo drifts slower than the page as the hero scrolls away
      gsap.to('[data-hero-bg]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="top"
      data-theme-section="dark"
      className="relative isolate m-2 flex min-h-[calc(100svh-1rem)] flex-col overflow-clip rounded-[1.5rem] bg-neutral-900 text-neutral-100 md:m-3 md:min-h-[calc(100svh-1.5rem)]"
    >
      {/* Backdrop: the storefront at night, dimmed so the type and cards stay crisp */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <img
          data-hero-bg
          src="/bg.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-x-0 -top-[14%] h-[114%] w-full object-cover object-[50%_42%] will-change-transform"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,21,19,0.94)_0%,rgba(22,21,19,0.8)_30%,rgba(22,21,19,0.72)_52%,rgba(22,21,19,0.82)_74%,rgb(22,21,19)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_32%,transparent_0%,rgba(22,21,19,0.55)_100%)]" />
        {/* A warm glow behind the headline, picking up the red of the shopfront */}
        <div className="absolute top-[18%] left-1/2 h-[42%] w-[min(70rem,90%)] -translate-x-1/2 rounded-full bg-spark/25 blur-[7rem]" />
      </div>

      <div className="h-[calc(3.375rem+max(3rem,9svh))] shrink-0" />

      <div className="container-x flex flex-col items-center text-center">
        <p
          data-hero-reveal
          className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/[0.07] py-2 ps-3 pe-4 text-neutral-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-md"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-spark opacity-60" />
            <span className="relative size-2 rounded-full bg-spark" />
          </span>
          {t('hero.badge')}
        </p>

        <h1 className="display mt-[clamp(1.5rem,2.6vw,2.5rem)] flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-[0.1em] text-hero text-neutral-50">
          <span className="sr-only">{t('hero.sr')}</span>
          <Words words={l(ui['hero.words1'])} className="justify-center max-md:basis-full" />
          <Bolt data-hero-icon className="h-[0.8em] w-auto text-spark" />
          <Words words={l(ui['hero.words2'])} accentLast />
        </h1>

        <p data-hero-reveal className="mt-[clamp(1.5rem,2.6vw,2.5rem)] max-w-[38em] text-lead text-balance text-neutral-300">
          {/* strings are text, ['word'] a chip, ['word', 'round'] a rounded chip */}
          <Description parts={l(ui['hero.desc'])} />
        </p>

        <div data-hero-reveal className="mt-[clamp(1.75rem,3vw,2.75rem)] flex flex-wrap items-center justify-center gap-2">
          <Button to={site.catalogueHref} variant="volt" size="lg" pill icon={<ArrowRight className="size-[1.1em]" />}>
            {t('hero.catalogue')}
          </Button>
          <Button to="/brands" variant="gray" size="lg" pill className="backdrop-blur-md max-sm:hidden">
            {t('hero.brands')}
          </Button>
        </div>
      </div>

      {/* The row is at least as tall as the top card of the wheel plus the controls under it, so neither is clipped */}
      <div
        className="relative mt-[clamp(2rem,4vw,4rem)] min-h-[max(clamp(15rem,36svh,30rem),calc(var(--wheel-d)*0.14+5.5rem))] flex-1"
        style={{
          '--wheel-d': 'clamp(1400px, calc(115vw + 120px), 2500px)',
          '--card-w': 'calc(var(--wheel-d) * 0.118)',
        }}
      >
        <BrandWheel />
      </div>
    </section>
  )
}
