import { gsap, prefersReducedMotion } from './gsap'

/** A little "+n" chip arcs from the clicked button into the nav's quote button, which then pulses. */
export function flyToQuote(fromEl, label = '+1') {
  const target = [...document.querySelectorAll('[data-quote-target]')].find((el) => el.getBoundingClientRect().width > 0)
  if (!fromEl || !target || prefersReducedMotion()) return

  const a = fromEl.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const chip = document.createElement('div')
  chip.className =
    'pointer-events-none fixed top-0 left-0 z-[60] flex h-9 min-w-9 items-center justify-center rounded-full bg-volt px-2.5 font-mono text-[0.8rem] font-medium text-neutral-800 shadow-[0_0.75rem_1.5rem_-0.5rem_rgba(22,21,19,0.5)]'
  chip.textContent = label
  document.body.appendChild(chip)

  gsap.set(chip, { x: a.left + a.width / 2, y: a.top + a.height / 2, xPercent: -50, yPercent: -50, scale: 0.3 })
  gsap
    .timeline({
      onComplete: () => {
        chip.remove()
        gsap.fromTo(target, { scale: 1 }, { scale: 1.1, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', clearProps: 'scale' })
      },
    })
    .to(chip, { scale: 1, duration: 0.3, ease: 'back.out(2.2)' })
    .to(chip, { x: b.left + b.width / 2, duration: 0.8, ease: 'power1.inOut' }, 0.12)
    .to(chip, { y: b.top + b.height / 2, duration: 0.8, ease: 'power3.in' }, 0.12)
    .to(chip, { scale: 0.45, duration: 0.25, ease: 'power2.in' }, 0.7)
}
