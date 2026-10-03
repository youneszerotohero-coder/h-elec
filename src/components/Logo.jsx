import { cx } from '../lib/cx'

// SARL H ELEC — the client's logo, lightly modernised: same red roof, stacked name and gold underline,
// with a softened roof, a heavy geometric sans for "ELEC" and a rounded bar. Letters take currentColor,
// so the logo works on the dark navbar/footer and on light backgrounds alike.

function Roof({ className = '' }) {
  return (
    <svg viewBox="0 0 120 22" preserveAspectRatio="none" aria-hidden="true" className={cx('block overflow-visible', className)}>
      <path d="M3 20 L60 2.5 L117 20 Z" fill="var(--color-spark)" stroke="var(--color-spark)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

const Bar = ({ className = '' }) => <span aria-hidden="true" className={cx('block rounded-full bg-volt', className)} />

/**
 * Full lockup. `compact` drops "Sarl" and sets "H ELEC" on one line — for tight spots like the navbar.
 * Size it with font-size: "ELEC" is 1em tall-ish.
 */
export function Wordmark({ compact = false, className = '' }) {
  return (
    <span
      dir="ltr" // a Latin wordmark: never mirror its letters in RTL
      role="img"
      aria-label="SARL H ELEC"
      className={cx('inline-flex w-max flex-col items-stretch leading-none select-none', className)}
    >
      <Roof className="-mx-[0.14em] h-[0.34em] w-[calc(100%+0.28em)]" />
      {!compact && (
        <span aria-hidden="true" className="mt-[0.1em] text-center text-[0.34em] font-[640] tracking-[0.04em]">
          Sarl H
        </span>
      )}
      <span aria-hidden="true" className={cx('text-center font-[820] tracking-[-0.03em] [font-stretch:116%]', compact ? 'mt-[0.1em]' : 'mt-[0.02em]')}>
        {compact && <span className="me-[0.18em]">H</span>}
        ELEC
      </span>
      <Bar className="-mx-[0.14em] mt-[0.1em] h-[0.1em] w-[calc(100%+0.28em)]" />
    </span>
  )
}

/** Square mark: the roof, an "H" and the gold bar. Used where the full name doesn't fit. */
export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M3.5 12 L16 4.5 L28.5 12 Z" fill="var(--color-spark)" stroke="var(--color-spark)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 14.5h3.4v4.2h6.2v-4.2h3.4v10h-3.4v-3.1h-6.2v3.1H9.5z" fill="currentColor" />
      <rect x="5" y="26.5" width="22" height="2.6" rx="1.3" fill="var(--color-volt)" />
    </svg>
  )
}
