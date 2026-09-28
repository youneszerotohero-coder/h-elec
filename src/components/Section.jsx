import { cx } from '../lib/cx'

export function Badge({ children, small = false, className = '' }) {
  return (
    <span
      className={cx(
        'eyebrow inline-flex items-center rounded-[0.1875rem] bg-spark px-1.5 text-white',
        small ? 'h-[1.1rem] text-[0.6rem]' : 'h-[1.35rem] text-[0.7rem]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ index, children, dark = false, className = '' }) {
  return (
    <p className={cx('eyebrow inline-flex items-center gap-2', className)}>
      {index && (
        <span className={cx('rounded-[0.1875rem] px-1.5 py-[0.3em]', dark ? 'bg-volt text-neutral-800' : 'bg-neutral-800 text-neutral-100')}>
          {index}
        </span>
      )}
      <span>{children}</span>
    </p>
  )
}

export function SectionHead({ index, eyebrow, title, aside, dark = false, className = '' }) {
  return (
    <div className={cx('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        <Eyebrow index={index} dark={dark}>
          {eyebrow}
        </Eyebrow>
        <h2 data-split className="display mt-6 max-w-[13em] text-h2 text-balance">
          {title}
        </h2>
      </div>
      {aside && (
        <div data-reveal className={cx('text-lead lg:col-span-4', dark ? 'text-neutral-400' : 'text-neutral-550')}>
          {aside}
        </div>
      )}
    </div>
  )
}
