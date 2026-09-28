import { useLayoutEffect, useRef } from 'react'
import { gsap, Flip } from './gsap'

/**
 * Animated filtering for a grid whose children toggle a `hidden` class.
 * Call the returned `capture()` right before changing the filter: remaining items glide to their
 * new spots while the others scale in/out. Changes made elsewhere (e.g. from the menu) fade the grid up.
 */
export function useFlipFilter(gridRef, deps) {
  const state = useRef(null)
  const lastKey = useRef(null)

  useLayoutEffect(() => {
    const items = [...gridRef.current.children]
    // Only animate real filter changes (not the first render, nor StrictMode's effect re-run)
    const key = JSON.stringify(deps)
    const changed = lastKey.current !== null && lastKey.current !== key
    lastKey.current = key
    if (!changed) return
    if (state.current) {
      Flip.from(state.current, {
        targets: items,
        duration: 0.75,
        ease: 'osmo',
        absolute: true,
        scale: true,
        stagger: 0.012,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.86, y: 0 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'osmo', delay: 0.18 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.86, duration: 0.4, ease: 'osmo' }),
      })
      state.current = null
    } else {
      const shown = items.filter((el) => !el.classList.contains('hidden'))
      gsap.fromTo(shown, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.035, overwrite: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return () => {
    state.current = Flip.getState(gridRef.current.children)
  }
}
