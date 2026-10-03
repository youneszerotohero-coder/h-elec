import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { getLenis, lockScroll, scrollToTarget, unlockScroll } from '../lib/scroll'
import { LANGS, useI18n } from '../i18n/I18n'
import { ui } from '../i18n/ui'
import { brandBySlug, categoryBySlug, site } from '../data/content'
import { productBySlug } from '../data/products'
import { LogoMark } from '../components/Logo'

/*
  Page transition — the navbar becomes the curtain:
  LEAVE  a panel starts exactly on the nav bar, widens (0.5s) then drops to cover the screen (0.65s @0.15s),
         the destination name rises in the middle, and the route (or language) swaps while covered.
  ENTER  the name lifts away, the panel retracts upward into the bar (height, then width) and the
         new page glides up underneath. Same ease and width→height rhythm as the menu and quote modal.
*/

const DARK = 'rgb(31, 29, 27)'

// Pages read this to time their entrance: longer right after a transition so it plays as the curtain lifts
export const intro = { delay: 0.25 }

const TransitionContext = createContext(null)
export const usePageTransition = () => useContext(TransitionContext)

function navRect() {
  const bg = document.querySelector('[data-nav-bg]')
  const r = bg.getBoundingClientRect()
  const cs = getComputedStyle(bg)
  return { x: r.left, y: r.top, w: r.width, h: r.height, radius: parseFloat(cs.borderTopLeftRadius) || 6, bg: cs.backgroundColor }
}

const jumpTo = (y) => {
  getLenis()?.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const { t, l, lang, setLang } = useI18n()
  const panel = useRef(null)
  const label = useRef(null)
  const busy = useRef(false)
  const pending = useRef(null) // { url } after a navigation, { y } after a language switch
  const [text, setText] = useState({ eyebrow: '', title: '' })

  const describe = useCallback(
    (url) => {
      const [section, slug] = url.pathname.split('/').filter(Boolean)
      if (!section) return { eyebrow: t('tr.welcome'), title: site.name }
      if (section === 'brands') {
        const brand = brandBySlug(slug)
        return brand ? { eyebrow: t('tr.brand'), title: brand.name } : { eyebrow: t('tr.partners'), title: t('common.brands') }
      }
      if (section === 'products') {
        const product = productBySlug(slug)
        if (product) return { eyebrow: brandBySlug(product.brand)?.name, title: l(product.name) }
        const category = categoryBySlug(url.searchParams.get('category'))
        return { eyebrow: t('tr.catalogue'), title: category ? l(category.title) : t('tr.allProducts') }
      }
      return { eyebrow: t('tr.oops'), title: t('tr.notFound') }
    },
    [t, l],
  )

  // Drops the curtain from the nav bar, shows `words`, then calls `onCovered` once the screen is hidden
  const cover = useCallback((words, onCovered) => {
    flushSync(() => setText(words))
    const from = navRect()
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const titleWords = label.current.querySelectorAll('[data-t-word]')
    lockScroll('transition')

    gsap.set(panel.current, { display: 'block', autoAlpha: 1, left: from.x, top: from.y, width: from.w, height: from.h, borderRadius: from.radius, backgroundColor: from.bg })
    gsap.set(label.current, { autoAlpha: 1 })
    gsap.set(titleWords, { yPercent: 115, rotate: 8 })
    gsap.set('[data-t-icon]', { scale: 0.3, rotate: -180, autoAlpha: 0 })

    gsap
      .timeline({ defaults: { ease: 'osmo' } })
      .to('[data-page]', { y: '-4rem', duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(panel.current, { left: 0, width: vw, duration: 0.5 }, 0)
      .to(panel.current, { backgroundColor: DARK, duration: 0.3, ease: 'power1.out' }, 0)
      .to(panel.current, { top: 0, height: vh, borderRadius: 0, duration: 0.65 }, 0.15)
      .to('[data-t-icon]', { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' }, 0.35)
      .to(titleWords, { yPercent: 0, rotate: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 }, 0.35)
      .call(
        () => {
          unlockScroll('transition')
          intro.delay = 0.45
          onCovered()
        },
        null,
        0.82,
      )
  }, [])

  const go = useCallback(
    (to) => {
      const url = new URL(to, window.location.href)
      if (url.origin !== window.location.origin) {
        window.location.href = to
        return
      }
      const here = window.location
      const path = url.pathname + url.search + url.hash

      // Same page: filters change in place, anchors scroll smoothly
      if (url.pathname === here.pathname) {
        if (url.search !== here.search) navigate(path, { preventScrollReset: true })
        if (url.hash) scrollToTarget(url.hash)
        else if (getLenis()) getLenis().scrollTo(0, { duration: 1.2 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (busy.current) return
      busy.current = true

      const swap = () => {
        // Reset scroll while covered, so the new page mounts at the top and measures itself correctly
        jumpTo(0)
        pending.current = { url }
        navigate(path)
      }
      if (prefersReducedMotion()) return swap()
      cover(describe(url), swap)
    },
    [navigate, cover, describe],
  )

  // Language switch: same curtain, labelled with the language's own name; the page keeps its scroll position
  const changeLang = useCallback(
    (next) => {
      if (next === lang || !LANGS[next] || busy.current) return
      busy.current = true
      const swap = () => {
        pending.current = { y: window.scrollY }
        setLang(next)
      }
      if (prefersReducedMotion()) return swap()
      cover({ eyebrow: ui['lang.label'][next], title: LANGS[next].label }, swap)
    },
    [lang, setLang, cover],
  )

  // ENTER — runs after the new route / language has rendered (children's layout effects have already run)
  useLayoutEffect(() => {
    const p = pending.current
    if (!p) {
      // Back/forward: no curtain, just start the new page at the top
      if (navType === 'POP') jumpTo(0)
      return
    }
    pending.current = null
    unlockScroll('transition')
    const target = p.url?.hash && document.querySelector(p.url.hash)
    if (target) jumpTo(target.getBoundingClientRect().top + window.scrollY - 24)
    if (p.y != null) jumpTo(p.y)

    const done = () => {
      gsap.set(panel.current, { display: 'none' })
      gsap.set(label.current, { autoAlpha: 0 })
      busy.current = false
      intro.delay = 0.25
      getLenis()?.resize()
      ScrollTrigger.refresh()
    }
    if (prefersReducedMotion()) return done()

    const titleWords = label.current.querySelectorAll('[data-t-word]')
    gsap
      .timeline({ defaults: { ease: 'osmo' }, delay: 0.15, onComplete: done })
      .to(titleWords, { yPercent: -115, duration: 0.4, ease: 'power3.in', stagger: 0.03 }, 0)
      .to('[data-t-icon]', { scale: 0.4, autoAlpha: 0, duration: 0.3, ease: 'power3.in' }, 0)
      .fromTo('[data-page]', { y: '14vh' }, { y: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' }, 0.2)
      .to(panel.current, { top: () => navRect().y, height: () => navRect().h, borderRadius: () => navRect().radius, duration: 0.75 }, 0.2)
      .to(panel.current, { left: () => navRect().x, width: () => navRect().w, duration: 0.6 }, 0.62)
      .to(panel.current, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, 1.15)
  }, [location.key, lang, navType])

  return (
    <TransitionContext.Provider value={{ go, changeLang }}>
      {children}
      <div ref={panel} aria-hidden="true" className="fixed z-40 hidden" />
      <div
        ref={label}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-40 flex flex-col items-center justify-center px-6 text-center text-neutral-100 opacity-0"
      >
        <span data-t-icon className="mb-6 flex items-center gap-2.5">
          <LogoMark className="size-6" />
          <span className="eyebrow text-neutral-400">{text.eyebrow}</span>
        </span>
        <span className="display flex max-w-[14em] flex-wrap justify-center gap-x-[0.24em] text-[clamp(2.6rem,6.4vw,7.5rem)] leading-[0.95] tracking-[-0.05em]">
          {text.title.split(' ').map((w, i) => (
            <span key={`${w}-${i}`} className="-my-[0.1em] overflow-hidden py-[0.1em]">
              <span data-t-word className="inline-block">
                {w}
              </span>
            </span>
          ))}
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

/** Internal link that plays the page transition. Modifier-clicks still open a new tab. */
export function TLink({ to, onClick, children, href: _ignored, ...props }) {
  const { go } = usePageTransition()
  return (
    <a
      {...props}
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        go(to)
      }}
    >
      {children}
    </a>
  )
}
