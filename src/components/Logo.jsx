import { useId } from 'react'
import { cx } from '../lib/cx'

// H ELEC — redrawn flat from the client's chrome logo: the same big "H", red lightning bolt and the
// cable that loops around it to a plug, minus the bevels and gloss. The "H" takes currentColor, so the
// logo works on the dark navbar/footer and on light backgrounds alike; the red is always --color-spark.

const H = 'M11 7h12v17h18V7h12v48H41V35H23V55H11z'
const BOLT = 'M42 5.5 L24 34.5 L32 33 L21.5 58.5 L40.5 27.5 L32.8 28.8 Z'
const CORD = 'M27 37.5 C10 38 1 43.5 4.8 48 C9.5 53 33 51 49 42.8'

/** Square mark: the "H", the bolt through it and the cable-and-plug swoosh. */
export function LogoMark({ className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cx('overflow-visible', className)}>
      <defs>
        {/* The bolt and cable cut a thin gap into the "H", so they read as passing in front of it */}
        <mask id={`${id}-cut`} maskUnits="userSpaceOnUse" x="-8" y="-8" width="80" height="80">
          <rect x="-8" y="-8" width="80" height="80" fill="#fff" />
          <path d={BOLT} stroke="#000" strokeWidth="5" strokeLinejoin="round" />
          <path d={CORD} fill="none" stroke="#000" strokeWidth="5.6" />
        </mask>
      </defs>
      <path d={H} fill="currentColor" mask={`url(#${id}-cut)`} />
      <g fill="var(--color-spark)">
        <path d={CORD} fill="none" stroke="var(--color-spark)" strokeWidth="2.6" strokeLinecap="round" />
        <g transform="translate(49.3 42.6) rotate(-27)">
          <path d="M-1.5 -1.3 L2.6 -3.4 V3.4 L-1.5 1.3 Z" />
          <rect x="2.2" y="-4.6" width="6.4" height="9.2" rx="1.6" />
          <rect x="8" y="-3.2" width="4.6" height="1.7" rx="0.85" fill="currentColor" />
          <rect x="8" y="1.5" width="4.6" height="1.7" rx="0.85" fill="currentColor" />
        </g>
      </g>
      <path d={BOLT} fill="var(--color-spark)" />
    </svg>
  )
}

/**
 * Full lockup: the mark beside "HELEC" (red "H", in a slanted wide sans like the original).
 * `compact` drops the caption under the name — for tight spots like the navbar. Size it with font-size.
 */
export function Wordmark({ compact = false, className = '' }) {
  return (
    <span
      dir="ltr" // a Latin wordmark: never mirror its letters in RTL
      role="img"
      aria-label="H ELEC"
      className={cx('inline-flex w-max items-center gap-[0.3em] leading-none select-none', className)}
    >
      <LogoMark className="size-[1.5em] shrink-0" />
      <span aria-hidden="true" className="flex flex-col">
        <span className="-skew-x-[9deg] font-[860] tracking-[-0.01em] [font-stretch:125%]">
          <span className="text-spark">H</span>ELEC
        </span>
        {!compact && <span className="mt-[0.34em] font-mono text-[0.26em] font-medium tracking-[0.16em] uppercase opacity-55">Sarl · Est. 1994</span>}
      </span>
    </span>
  )
}
