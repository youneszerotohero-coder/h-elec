import { Power } from './icons'
import { cx } from '../lib/cx'

// Wordmark with the "O" drawn as a power symbol. Placeholder until the client's logo is ready.
export function Wordmark({ className = '' }) {
  return (
    <span
      dir="ltr" // a Latin wordmark: never mirror its letters in RTL
      className={cx('inline-flex items-center font-[820] leading-none tracking-[-0.045em] [font-stretch:118%]', className)}
      aria-label="Voltis"
    >
      <span aria-hidden="true">V</span>
      <Power aria-hidden="true" className="mx-[0.01em] h-[0.82em] w-[0.82em] -translate-y-[0.01em]" strokeWidth={4.4} />
      <span aria-hidden="true">LTIS</span>
    </span>
  )
}

export function LogoMark({ className = '' }) {
  return <Power className={className} strokeWidth={3.6} aria-hidden="true" />
}
