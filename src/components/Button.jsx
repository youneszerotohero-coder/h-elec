import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { cx } from '../lib/cx'
import { ArrowUpRight } from './icons'
import { TLink } from '../transition/PageTransition'

const variants = {
  volt: 'bg-volt text-neutral-800 hover:bg-volt-300',
  dark: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700',
  gray: 'bg-white/[0.11] text-neutral-100 hover:bg-white/[0.17]',
  light: 'bg-neutral-100 text-neutral-800 hover:bg-white',
  outline: 'text-current shadow-[inset_0_0_0_1px_currentColor] hover:bg-current/[0.06]',
}

const sizes = {
  sm: 'h-9 px-3.5 text-[0.95rem]',
  md: 'h-10 px-4 text-[1.0625rem]',
  lg: 'h-14 px-6 text-[1.125rem]',
}

const ROLL = 40 // degrees the label wheel turns per hover

/**
 * Button whose label swings away on a wide arc while a copy swings in —
 * the rotating-label hover used on osmo.supply.
 */
export default function Button({ href, to, variant = 'volt', size = 'md', pill = false, icon, children, className, onPointerEnter, ...props }) {
  const wheel = useRef(null)
  const busy = useRef(false)
  const length = typeof children === 'string' ? children.length : 10
  const origin = `50% ${100 + 30 * (12 + 6 * length)}%`

  const handleEnter = (e) => {
    onPointerEnter?.(e)
    if (e.pointerType === 'touch' || busy.current || !wheel.current) return
    busy.current = true
    const dir = document.documentElement.dir === 'rtl' ? -1 : 1 // swing with the reading direction
    gsap.fromTo(
      wheel.current,
      { rotation: 0 },
      {
        rotation: ROLL * dir,
        duration: 0.6,
        ease: 'osmo',
        onComplete: () => {
          gsap.set(wheel.current, { rotation: 0 })
          busy.current = false
        },
      },
    )
  }

  // `to` = internal page (plays the page transition), `href` = plain link, neither = button
  const Comp = to ? TLink : href ? 'a' : 'button'

  return (
    <Comp
      to={to}
      href={href}
      type={to || href ? undefined : props.type || 'button'}
      onPointerEnter={handleEnter}
      className={cx(
        'relative inline-flex shrink-0 select-none items-center justify-center gap-2 overflow-hidden font-medium whitespace-nowrap tracking-[-0.02em] transition-colors duration-200',
        pill ? 'rounded-full' : 'rounded-[0.25rem]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span ref={wheel} className="relative block" style={{ transformOrigin: origin }}>
        <span className="block">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block" style={{ transformOrigin: origin, rotate: `calc(var(--dir) * ${-ROLL}deg)` }}>
          {children}
        </span>
      </span>
      {icon}
    </Comp>
  )
}

/** Round arrow badge; the arrow exits top-right and re-enters on parent `group` hover. */
export function ArrowChip({ className = '' }) {
  return (
    // data-flip: the whole chip mirrors in RTL, arrow motion included
    <span data-flip className={cx('relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-300', className)}>
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-osmo group-hover:translate-x-[190%] group-hover:-translate-y-[190%]" />
      <ArrowUpRight className="absolute size-4 -translate-x-[190%] translate-y-[190%] transition-transform duration-500 ease-osmo group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  )
}
