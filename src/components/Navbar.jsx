import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useLocation } from 'react-router'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { usePageTransition } from '../transition/PageTransition'
import { cx } from '../lib/cx'
import { useQuote } from '../context/QuoteContext'
import { menu, site, socials } from '../data/content'
import Button from './Button'
import { Badge } from './Section'
import ProductArt, { artTheme } from './ProductArt'
import { Wordmark, LogoMark } from './Logo'
import { SocialIcon } from './icons'
import { LangDropdown, LangSegment } from './LangSwitch'
import { useI18n } from '../i18n/I18n'

/*
  Choreography (mirrors osmo.supply, ease cubic-bezier(.625,.05,0,1)):
  OPEN   width 0.6s → height 0.9s @0.3s → columns rise 2rem, 0.9s @0.3/0.375/0.45s
  CLOSE  height 0.6s → width 0.9s @0.2s → columns drop, 0.6s @0/0.075/0.15s
  Everything is CSS transitions keyed off data attributes on <header>.
*/

const PROBE_Y = 46 // px — vertical centre of the bar, used to detect dark sections underneath

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')
  const { openQuote, open: quoteOpen, count } = useQuote()
  const { go: transitionTo } = usePageTransition()
  const { t, l } = useI18n()
  const location = useLocation()
  const root = useRef(null)
  const updateTheme = useRef(() => {})

  // Scroll state + which section theme sits under the bar
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 50)
      let next = 'light'
      document.querySelectorAll('[data-theme-section]').forEach((section) => {
        const r = section.getBoundingClientRect()
        if (r.top <= PROBE_Y && r.bottom >= PROBE_Y) next = section.dataset.themeSection
      })
      setTheme(next)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    updateTheme.current = schedule
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  // A new page can start on a different section theme
  useEffect(() => updateTheme.current(), [location.key])

  useEffect(() => {
    if (!open) return
    lockScroll('menu')
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll('menu')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (quoteOpen) setOpen(false)
  }, [quoteOpen])

  // Entrance: the bar drops in
  useGSAP(() => gsap.from('[data-nav-intro]', { yPercent: -140, duration: 1.2, ease: 'expo.out', delay: 0.15 }), { scope: root })

  const go = (e, href) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    setOpen(false)
    unlockScroll('menu')
    transitionTo(href)
  }

  const quote = (e) => {
    // Buttons inside the menu become inert as it closes, so grow the modal from the bar's quote button instead
    const origin = e.currentTarget.closest('#site-menu') ? root.current.querySelector('[data-quote-main]') : e.currentTarget
    setOpen(false)
    openQuote(null, origin)
  }

  return (
    <header
      ref={root}
      data-nav-open={open}
      data-scrolled={scrolled && !open}
      data-nav-theme={open ? 'light' : theme}
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* Page dim */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="pointer-events-auto invisible fixed inset-0 bg-neutral-900/40 opacity-0 transition-[opacity,visibility] duration-600 ease-osmo nav-open:visible nav-open:opacity-100"
      />

      <div data-nav-intro className="relative mx-auto flex max-w-[1760px] justify-center px-2 pt-2 md:px-5 md:pt-5">
        <nav
          aria-label="Main"
          className="pointer-events-auto relative w-full max-w-[42rem] text-neutral-200 transition-[max-width] delay-200 duration-900 ease-osmo nav-open:max-w-full nav-open:delay-0 nav-open:duration-600"
        >
          {/* Background */}
          <div aria-hidden="true" className="absolute inset-0 transition-[inset] duration-600 ease-osmo scrolled:inset-[0.1875rem]">
            <div className="absolute -inset-px rounded-[0.4375rem] bg-neutral-200 opacity-[0.08] transition-opacity duration-200 nav-dark:opacity-25" />
            <div data-nav-bg className="absolute inset-0 rounded-[0.375rem] bg-neutral-800 shadow-[0_1rem_2.5rem_-1rem_rgba(22,21,19,0.5)] transition-colors duration-200 nav-dark:bg-neutral-600" />
          </div>

          {/* Top bar */}
          <div className="relative flex h-[3.375rem] items-center p-[0.4375rem]">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
              className="flex h-10 items-center gap-[0.625rem] rounded-[0.1875rem] ps-[0.625rem] pe-4 transition-[background-color,gap] duration-600 ease-osmo hover:bg-white/[0.06] nav-open:gap-[0.1875rem]"
            >
              <span className="relative flex h-[0.4375rem] w-[1.375rem] items-center justify-center">
                <span className="absolute h-px w-full translate-y-[0.1875rem] bg-current transition-transform duration-600 ease-osmo nav-open:translate-y-0 nav-open:-rotate-45 nav-open:scale-x-75" />
                <span className="absolute h-px w-full -translate-y-[0.1875rem] bg-current transition-transform duration-600 ease-osmo nav-open:translate-y-0 nav-open:rotate-45 nav-open:scale-x-75" />
              </span>
              <span className="text-[1.125rem] leading-none font-medium tracking-[-0.02em]">{t('nav.menu')}</span>
            </button>
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/10 max-sm:hidden" />
            <LangDropdown className="max-sm:hidden" onBeforeChange={() => setOpen(false)} />

            <a
              href="/"
              onClick={(e) => go(e, '/')}
              aria-label={t('nav.home', { name: site.name })}
              className="absolute top-1/2 left-1/2 flex h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center px-2"
            >
              <span className="block text-[1.7rem] [transition:translate_0.6s_var(--ease-osmo),opacity_0.3s_var(--ease-osmo)_0.15s] scrolled:translate-y-3 scrolled:opacity-0">
                <Wordmark />
              </span>
              <span className="absolute inset-0 flex -translate-y-3 items-center justify-center text-volt opacity-0 [transition:translate_0.6s_var(--ease-osmo),opacity_0.3s_var(--ease-osmo)_0.15s] scrolled:translate-y-0 scrolled:opacity-100">
                <LogoMark className="size-7" />
              </span>
            </a>

            <div className="ms-auto flex h-10 items-center gap-[0.1875rem]">
              <Button href={site.catalogueHref} onClick={(e) => go(e, site.catalogueHref)} variant="gray" pill className="max-sm:hidden">
                {t('nav.catalogue')}
              </Button>
              <span className="relative flex max-sm:hidden">
                <Button data-quote-main data-quote-target onClick={quote} variant="volt">
                  {t('nav.quoteBar')}
                </Button>
                <CountBadge count={count} />
              </span>
              <span className="relative flex sm:hidden">
                <Button data-quote-target onClick={quote} variant="volt">
                  {t('nav.quote')}
                </Button>
                <CountBadge count={count} />
              </span>
            </div>

            <div aria-hidden="true" className="absolute inset-x-4 bottom-0 h-px bg-neutral-600 opacity-0 transition-all duration-600 ease-osmo nav-open:inset-x-0 nav-open:opacity-100 nav-open:delay-200" />
          </div>

          {/* Menu panel */}
          <div
            id="site-menu"
            inert={!open}
            className="grid -translate-y-2.5 grid-rows-[0fr] [transition:grid-template-rows_0.6s_var(--ease-osmo),translate_0.6s_var(--ease-osmo)] nav-open:translate-y-0 nav-open:grid-rows-[1fr] nav-open:[transition:grid-template-rows_0.9s_var(--ease-osmo)_0.3s,translate_0.6s_var(--ease-osmo)_0.3s]"
          >
            <div className="relative min-h-0 overflow-hidden">
              <div data-lenis-prevent className="no-scrollbar max-h-[calc(100dvh-4.5rem)] overflow-y-auto p-2 md:max-h-[calc(100dvh-6.5rem)] md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                  <MenuColumn order={0} className="rounded-2xl bg-neutral-700">
                    <div className="flex h-full flex-col gap-4 p-6 md:gap-[1.375rem] md:p-10">
                      <p className="eyebrow text-neutral-400">{t('nav.ourProducts')}</p>
                      <BigLinks links={menu.products} onNavigate={go} />
                      <ul className="mt-auto flex flex-wrap gap-x-10 gap-y-2 pt-4 text-[1.0625rem] tracking-[-0.02em]">
                        {menu.productsSmall.map((item) => (
                          <li key={item.href}>
                            <a href={item.href} onClick={(e) => go(e, item.href)} className="flex items-center gap-2 py-1">
                              <span className="link-line">{l(item.label)}</span>
                              {item.badge && <Badge small>{l(item.badge)}</Badge>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </MenuColumn>

                  <MenuColumn order={1}>
                    <div className="flex h-full flex-col gap-4 p-6 md:gap-[1.375rem] md:p-10">
                      <p className="eyebrow text-neutral-400">{t('nav.explore')}</p>
                      <BigLinks links={menu.explore} onNavigate={go} />
                      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
                        <div className="flex gap-1">
                        {socials.map((s) => (
                          <a
                            key={s.label}
                            href={s.href}
                            aria-label={s.label}
                            className="flex size-12 items-center justify-center rounded-full bg-neutral-700 transition-[background-color,border-radius] duration-300 ease-osmo hover:rounded-[0.375rem] hover:bg-neutral-600"
                          >
                            <SocialIcon name={s.icon} className="size-5" />
                          </a>
                        ))}
                        </div>
                        <LangSegment onBeforeChange={() => setOpen(false)} />
                      </div>
                      <div className="flex gap-2 pt-2 sm:hidden">
                        <Button href={site.catalogueHref} onClick={(e) => go(e, site.catalogueHref)} variant="gray" pill className="flex-1">
                          {t('nav.catalogue')}
                        </Button>
                        <Button onClick={quote} className="flex-1">
                          {t('nav.getQuote')}
                        </Button>
                      </div>
                    </div>
                  </MenuColumn>

                  <MenuColumn order={2} className="max-lg:hidden">
                    <QuotePromo onQuote={quote} />
                  </MenuColumn>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

function CountBadge({ count }) {
  const ref = useRef(null)
  const { t } = useI18n()
  useGSAP(() => {
    if (ref.current) gsap.fromTo(ref.current, { scale: 0.2 }, { scale: 1, duration: 0.7, ease: 'back.out(3)' })
  }, { dependencies: [count] })
  if (!count) return null
  return (
    <span
      ref={ref}
      aria-label={t('nav.items', { n: count })}
      className="pointer-events-none absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-spark px-1 font-mono text-[0.65rem] leading-none text-white ring-2 ring-neutral-800"
    >
      {count}
    </span>
  )
}

function MenuColumn({ order, className, children }) {
  return (
    <div
      style={{ '--d-close': `${order * 0.075}s`, '--d-open': `${0.3 + order * 0.075}s` }}
      className={cx(
        'flex w-full translate-y-8 flex-col [transition:translate_0.6s_var(--ease-osmo)_var(--d-close)] nav-open:translate-y-0 nav-open:[transition:translate_0.9s_var(--ease-osmo)_var(--d-open)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function BigLinks({ links, onNavigate }) {
  const { l } = useI18n()
  return (
    <ul className="flex flex-col">
      {links.map((item) => (
        <li key={item.href} className="border-b border-neutral-600 last:border-b-0">
          <a
            href={item.href}
            onClick={(e) => onNavigate(e, item.href)}
            className="flex w-full items-center pt-[0.9rem] pb-[0.95rem] text-[1.3rem] leading-none font-[430] tracking-[-0.03em] md:pt-[1.0625rem] md:pb-[1.125rem] md:text-[1.5rem]"
          >
            <span className="link-line">{l(item.label)}</span>
            {item.count && <sup className="-mt-3 ms-1 text-[0.75rem] text-neutral-500">{item.count}</sup>}
            {item.badge && <Badge className="ms-3">{l(item.badge)}</Badge>}
          </a>
        </li>
      ))}
    </ul>
  )
}

function QuotePromo({ onQuote }) {
  const { t } = useI18n()
  const cards = [
    { art: 'breaker', theme: 'light', rot: -9, x: '-38%' },
    { art: 'bulb', theme: 'blue', rot: 7, x: '38%' },
    { art: 'socket', theme: 'volt', rot: -1, x: '0%' },
  ]
  return (
    <div className="group relative flex h-full min-h-[26rem] w-full flex-col items-center overflow-hidden rounded-2xl bg-neutral-700 px-8 pt-10 pb-8 text-center">
      <p className="eyebrow flex items-center gap-1.5">
        <span className="rounded-[0.1875rem] bg-neutral-800 px-1.5 py-[0.3em]">{t('nav.promo.fast')}</span>
        <span className="rounded-[0.1875rem] bg-spark px-1.5 py-[0.3em] text-white">{t('nav.promo.quote')}</span>
      </p>
      <p className="display mt-7 text-[2.6rem] leading-[0.95] tracking-[-0.045em]">
        {t('nav.promo.line1')}
        <br />
        {t('nav.promo.line2')}
      </p>
      <div className="relative my-auto flex h-36 w-full items-center justify-center">
        <div className="absolute aspect-square h-[150%] rounded-full bg-neutral-800/70" />
        {cards.map((c) => (
          <div
            key={c.art}
            style={{ ...artTheme(c.theme), '--x': c.x, '--r': `${c.rot}deg` }}
            className="absolute aspect-[4/3] w-[42%] translate-x-(--x) rotate-(--r) rounded-[0.375rem] shadow-[0_1rem_2rem_-0.5rem_rgba(0,0,0,0.45)] transition-[translate,rotate] duration-700 ease-osmo group-hover:translate-x-[calc(var(--x)*1.25)] group-hover:rotate-[calc(var(--r)*1.6)]"
          >
            <ProductArt type={c.art} className="h-full w-full p-[8%]" />
          </div>
        ))}
      </div>
      <Button variant="light" onClick={onQuote}>
        {t('common.requestQuote')}
      </Button>
    </div>
  )
}
