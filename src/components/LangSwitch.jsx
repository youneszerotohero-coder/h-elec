import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/cx'
import { LANGS, useI18n } from '../i18n/I18n'
import { usePageTransition } from '../transition/PageTransition'

const codes = Object.keys(LANGS)

/** Compact dropdown for the nav bar: "EN ▾" opening a small panel (grows in like the menu). */
export function LangDropdown({ onBeforeChange, className = '' }) {
  const { lang, t } = useI18n()
  const { changeLang } = usePageTransition()
  const [open, setOpen] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (code) => {
    setOpen(false)
    onBeforeChange?.()
    changeLang(code)
  }

  return (
    <div ref={root} className={cx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.label')}
        className="flex h-10 items-center gap-1.5 rounded-[0.1875rem] px-3 font-mono text-[0.8rem] tracking-wide transition-colors hover:bg-white/[0.06]"
      >
        {LANGS[lang].short}
        <svg viewBox="0 0 10 6" className={cx('h-1.5 w-2.5 transition-transform duration-500 ease-osmo', open && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div
        data-open={open}
        className="invisible absolute top-[calc(100%+0.6rem)] start-0 grid w-max grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,visibility] duration-500 ease-osmo data-[open=true]:visible data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100"
      >
        <ul role="listbox" aria-label={t('lang.label')} className="min-h-0 overflow-hidden rounded-[0.5rem] bg-neutral-800 shadow-[0_1.5rem_3rem_-1rem_rgba(22,21,19,0.6),0_0_0_1px_rgba(241,240,236,0.08)]">
          {codes.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                lang={code}
                onClick={() => pick(code)}
                className="flex w-44 items-center justify-between gap-4 px-4 py-3 text-start text-[0.98rem] text-neutral-200 transition-colors hover:bg-neutral-700"
              >
                <span>{LANGS[code].label}</span>
                {code === lang ? (
                  <span className="size-1.5 rounded-full bg-volt shadow-[0_0_0_3px_rgba(240,168,32,0.2)]" />
                ) : (
                  <span className="font-mono text-[0.7rem] text-neutral-500">{LANGS[code].short}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Segmented control (menu, footer): every language visible, the current one highlighted. */
export function LangSegment({ onBeforeChange, className = '' }) {
  const { lang, t } = useI18n()
  const { changeLang } = usePageTransition()
  return (
    <div role="group" aria-label={t('lang.label')} className={cx('inline-flex gap-0.5 rounded-full bg-white/[0.06] p-1', className)}>
      {codes.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === lang}
          onClick={() => {
            if (code === lang) return
            onBeforeChange?.()
            changeLang(code)
          }}
          className={cx(
            'h-9 rounded-full px-3.5 text-[0.9rem] transition-colors duration-300',
            code === lang ? 'bg-volt text-neutral-800' : 'text-neutral-300 hover:bg-white/[0.08] hover:text-white',
          )}
        >
          {LANGS[code].label}
        </button>
      ))}
    </div>
  )
}
