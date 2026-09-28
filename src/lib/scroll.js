import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis = null
const locks = new Set()

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export const getLenis = () => lenis

/** Stops page scrolling. Several owners (menu, modal) can hold a lock at once. */
export function lockScroll(key) {
  locks.add(key)
  lenis?.stop()
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll(key) {
  locks.delete(key)
  if (locks.size) return
  lenis?.start()
  document.documentElement.classList.remove('is-locked')
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
