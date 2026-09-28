import { Fragment, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { intro, TLink } from '../transition/PageTransition'
import { site } from '../data/content'
import { cx } from '../lib/cx'
import Footer from '../sections/Footer'
import { Eyebrow } from './Section'
import { useI18n } from '../i18n/I18n'

/**
 * Every route renders inside <Page>. It sets the document title, wires the site-wide scroll reveals
 * ([data-split] headings rise line by line, [data-reveal] blocks fade up) and appends the footer.
 * Anything already on screen when the page mounts waits for the transition curtain to lift.
 */
export default function Page({ title, children }) {
  const root = useRef(null)
  const { l } = useI18n()

  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${l(site.tagline)}`
  }, [title, l])

  useGSAP(
    (context) => {
      const born = performance.now()
      const startDelay = intro.delay
      const remaining = () => Math.max(0, startDelay - (performance.now() - born) / 1000)
      const q = gsap.utils.selector(root)
      let alive = true

      const blocks = q('[data-reveal]')
      gsap.set(blocks, { y: '2.5rem', autoAlpha: 0 })
      ScrollTrigger.batch(blocks, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          // After a jump (anchor link, restored scroll) everything above the fold fires at once:
          // show what's already off-screen instantly and only animate what's actually visible.
          const onScreen = batch.filter((el) => el.getBoundingClientRect().bottom > 0)
          gsap.set(batch.filter((el) => !onScreen.includes(el)), { y: 0, autoAlpha: 1 })
          gsap.to(onScreen, {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'expo.out',
            stagger: Math.min(0.07, 0.6 / onScreen.length),
            delay: remaining(),
            overwrite: true,
          })
        },
      })

      // Split once fonts are in so the line breaks are final; unsplit afterwards so text reflows on resize
      document.fonts.ready.then(() => {
        if (!alive) return
        context.add(() => {
          q('[data-split]').forEach((el) => {
            const split = SplitText.create(el, { type: 'lines', mask: 'lines' })
            gsap.set(el, { visibility: 'visible' })
            gsap.set(split.lines, { yPercent: 110 })
            ScrollTrigger.create({
              trigger: el,
              start: 'top 88%',
              once: true,
              onEnter: () =>
                gsap.to(split.lines, {
                  yPercent: 0,
                  duration: 1.2,
                  ease: 'expo.out',
                  stagger: 0.08,
                  delay: remaining(),
                  onComplete: () => split.revert(),
                }),
            })
          })
        })
      })

      return () => {
        alive = false
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} data-page>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

const LATIN = /^[^֐-ࣿ]*[A-Za-z0-9][^֐-ࣿ]*$/

/**
 * Words wrapped in masks so they can rise into place ([data-intro-word]).
 * Each mask is an inline-block, which the bidi algorithm treats as a neutral object — in RTL a run of
 * Latin words ("Legrand Mosaic", "iC60N 2P 16A") would come out reversed, so such runs get an LTR island.
 */
export function SplitWords({ text, className = '' }) {
  const { dir } = useI18n()
  const words = text.split(' ')

  const runs = []
  words.forEach((w, i) => {
    const latin = dir === 'rtl' && LATIN.test(w)
    const last = runs[runs.length - 1]
    if (latin && last?.latin) last.words.push([w, i])
    else runs.push({ latin, words: [[w, i]] })
  })

  const word = ([w, i]) => (
    <Fragment key={`${w}-${i}`}>
      <span className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
        <span data-intro-word className="inline-block will-change-transform">
          {w}
        </span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  )

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {runs.map((run, r) =>
          run.latin && run.words.length > 1 ? (
            <span key={r} dir="ltr">
              {run.words.map(word)}
            </span>
          ) : (
            run.words.map(word)
          ),
        )}
      </span>
    </>
  )
}

/** Entrance for a page header: words rise with a tilt, then [data-intro] blocks follow. */
export function useIntro(scope, extra) {
  useGSAP(
    () => {
      const words = gsap.utils.toArray('[data-intro-word]')
      const rtl = document.documentElement.dir === 'rtl'
      gsap.set(words, { yPercent: 115, rotate: rtl ? -8 : 8, transformOrigin: rtl ? 'bottom right' : 'bottom left' })
      const tl = gsap
        .timeline({ delay: intro.delay, defaults: { ease: 'expo.out', duration: 1.2 } })
        .to(words, { yPercent: 0, rotate: 0, stagger: 0.045 })
        .from('[data-intro]', { y: '2rem', autoAlpha: 0, stagger: 0.07 }, '<0.12')
      extra?.(tl)
    },
    { scope },
  )
}

export function Breadcrumbs({ items, className = '' }) {
  const { t } = useI18n()
  return (
    <nav aria-label={t('common.breadcrumb')} data-intro className={cx('eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-500', className)}>
      <TLink to="/" className="transition-colors hover:text-neutral-800">
        {t('common.home')}
      </TLink>
      {items.map(([label, to]) => (
        <Fragment key={label}>
          <span aria-hidden="true">/</span>
          {to ? (
            <TLink to={to} className="transition-colors hover:text-neutral-800">
              {label}
            </TLink>
          ) : (
            <span aria-current="page" className="text-neutral-800">
              {label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

export function PageHero({ index, eyebrow, title, lead, aside, children }) {
  const root = useRef(null)
  useIntro(root)
  return (
    <section ref={root} className="relative pt-[calc(4.625rem+clamp(3rem,11svh,7.5rem))] pb-[clamp(2.5rem,6vw,5rem)]">
      <div className="container-x">
        <div data-intro>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </div>
        <h1 className="display mt-7 max-w-[12em] text-[clamp(3rem,7.6vw,10rem)] leading-[0.9] tracking-[-0.055em] text-balance">
          <SplitWords text={title} />
        </h1>
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <p data-intro className="text-lead text-neutral-550 lg:col-span-6">
            {lead}
          </p>
          {aside && (
            <div data-intro className="lg:col-span-5 lg:col-start-8 lg:justify-self-end">
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
