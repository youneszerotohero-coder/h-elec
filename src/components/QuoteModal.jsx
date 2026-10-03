import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { cx } from '../lib/cx'
import { useQuote } from '../context/QuoteContext'
import { brandBySlug, site } from '../data/content'
import { productBySlug } from '../data/products'
import ProductArt, { artTheme } from './ProductArt'
import { QtyStepper } from './Catalog'
import { useI18n } from '../i18n/I18n'
import { ArrowRight, Check, Close, FileIcon, Mail, Phone, Upload, WhatsApp } from './icons'

/*
  The modal is born from the button that opened it:
  1. a pill the size/colour of that button slides to the centre and widens (0.6s)
  2. it grows vertically into the full panel (0.9s @0.3s) while rows rise in
  Closing runs the other way and lands back on the button.
*/

const DARK = 'rgb(31, 29, 27)'
const emptyForm = {
  name: '',
  company: '',
  phone: '',
  email: '',
  details: '',
  files: [],
}

const gutter = () => (window.innerWidth < 768 ? 8 : 24)

function measureFinal(contentEl) {
  const vw = document.documentElement.clientWidth // excludes the scrollbar gutter, like position: fixed
  const vh = window.innerHeight
  const g = gutter()
  const w = Math.min(1120, vw - g * 2)
  contentEl.style.width = `${w}px`
  contentEl.style.height = 'auto'
  const h = Math.min(contentEl.scrollHeight, vh - g * 2)
  contentEl.style.height = `${h}px`
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

function rectFrom(el) {
  if (!el?.isConnected || el.closest('[inert]')) return null
  const r = el.getBoundingClientRect()
  if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) return null
  const cs = getComputedStyle(el)
  const bg = cs.backgroundColor
  return {
    x: r.left,
    y: r.top,
    w: r.width,
    h: r.height,
    radius: Math.min(parseFloat(cs.borderTopLeftRadius) || 6, r.height / 2),
    bg: !bg || bg === 'rgba(0, 0, 0, 0)' ? DARK : bg,
  }
}

function centrePill(box) {
  const w = 180
  const h = 48
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h, radius: 8, bg: DARK, fade: true }
}

function validate(f, hasItems) {
  const e = {}
  // Values are i18n keys, rendered with t()
  if (!f.name.trim()) e.name = 'q.err.name'
  if (!/^[+\d][\d\s().-]{6,}$/.test(f.phone.trim())) e.phone = 'q.err.phone'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'q.err.email'
  if (!hasItems && f.details.trim().length < 8 && !f.files.length) e.details = 'q.err.details'
  return e
}

export default function QuoteModal() {
  const { open, prefill, origin, id, closeQuote, items, count, setQty, removeItem, clearItems } = useQuote()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [reference, setReference] = useState('')
  const panel = useRef(null)
  const content = useRef(null)
  const backdrop = useRef(null)
  const tl = useRef(null)

  // Fresh form (with any prefill) every time the modal opens
  useEffect(() => {
    if (!open) return
    setMounted(true)
    // A brand passed from a brand page is written into the free-text field
    const brandNote = prefill?.brands?.length ? `${prefill.brands.join(', ')} — ` : ''
    setForm({ ...emptyForm, details: prefill?.details ?? brandNote })
    setErrors({})
    setStatus('idle')
  }, [open, id, prefill])

  // OPEN
  useLayoutEffect(() => {
    if (!mounted || !open) return
    lockScroll('quote')
    const to = measureFinal(content.current)
    const from = rectFrom(origin) ?? centrePill(to)
    const items = panel.current.querySelectorAll('[data-q-item]')

    tl.current?.kill()
    gsap.set(panel.current, {
      left: from.x,
      top: from.y,
      width: from.w,
      height: from.h,
      borderRadius: from.radius,
      backgroundColor: from.bg,
      autoAlpha: 1,
    })
    gsap.set(items, { y: '2rem', autoAlpha: 0 })

    tl.current = gsap
      .timeline({ defaults: { ease: 'osmo' }, onComplete: () => panel.current?.focus({ preventScroll: true }) })
      .to(backdrop.current, { autoAlpha: 1, duration: 0.6 }, 0)
      .to(panel.current, { left: to.x, width: to.w, top: to.y + to.h / 2 - from.h / 2, duration: 0.6 }, 0)
      .to(panel.current, { backgroundColor: DARK, duration: 0.35, ease: 'power1.inOut' }, 0.05)
      .to(panel.current, { top: to.y, height: to.h, borderRadius: 16, duration: 0.9 }, 0.3)
      .to(items, { y: 0, duration: 0.9, stagger: 0.06 }, 0.3)
      .to(items, { autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'power1.out' }, 0.38)

    if (prefersReducedMotion()) tl.current.progress(1)
  }, [mounted, open, id, origin])

  // CLOSE
  useLayoutEffect(() => {
    if (!mounted || open) return
    const box = panel.current.getBoundingClientRect()
    const back = rectFrom(origin) ?? rectFrom(document.querySelector('[data-quote-main]')) ?? centrePill({ x: box.left, y: box.top, w: box.width, h: box.height })
    const items = panel.current.querySelectorAll('[data-q-item]')

    tl.current?.kill()
    tl.current = gsap
      .timeline({
        defaults: { ease: 'osmo' },
        onComplete: () => {
          setMounted(false)
          unlockScroll('quote')
          origin?.focus?.({ preventScroll: true })
        },
      })
      .to(items, { y: '2rem', autoAlpha: 0, duration: 0.45, stagger: { each: 0.035, from: 'end' } }, 0)
      .to(panel.current, { top: box.top + box.height / 2 - back.h / 2, height: back.h, borderRadius: back.radius, duration: 0.6 }, 0.1)
      .to(panel.current, { left: back.x, width: back.w, top: back.y, duration: 0.8 }, 0.35)
      .to(panel.current, { backgroundColor: back.bg, duration: 0.3, ease: 'power1.inOut' }, 0.75)
      .to(panel.current, { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, back.fade ? 0.55 : 1.1)
      .to(backdrop.current, { autoAlpha: 0, duration: 0.6 }, 0.3)

    if (prefersReducedMotion()) tl.current.progress(1)
  }, [mounted, open, origin])

  // Keyboard: Esc closes, Tab stays inside
  useEffect(() => {
    if (!mounted || !open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeQuote()
      if (e.key !== 'Tab') return
      const focusables = panel.current.querySelectorAll('button:not([disabled]), input, textarea, select, a[href]')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => {
      tl.current?.progress(1)
      const to = measureFinal(content.current)
      gsap.set(panel.current, { left: to.x, top: to.y, width: to.w, height: to.h })
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [mounted, open, closeQuote])

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }


  const addFiles = (list) => {
    const incoming = Array.from(list).filter((f) => f.size <= 10 * 1024 * 1024)
    set('files', [...form.files, ...incoming].slice(0, 5))
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(form, items.length > 0)
    setErrors(errs)
    const firstError = Object.keys(errs)[0]
    if (firstError) {
      panel.current.querySelector(`[name="${firstError}"]`)?.focus()
      return
    }
    setStatus('sending')
    // TODO: send `form` + `items` (the quote list) to the client's backend / email service (e.g. an API route, Formspree, EmailJS)
    await new Promise((r) => setTimeout(r, 1400))
    setReference(`Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)
    setStatus('sent')
    clearItems()
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <div ref={backdrop} onClick={closeQuote} className="invisible absolute inset-0 bg-neutral-900/55 opacity-0 backdrop-blur-[6px]" />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        tabIndex={-1}
        className="invisible fixed overflow-hidden text-neutral-100 opacity-0 shadow-[0_2rem_5rem_-1.5rem_rgba(0,0,0,0.6)] outline-none"
      >
        <button
          type="button"
          data-q-item
          onClick={closeQuote}
          aria-label={t('common.close')}
          className="group absolute top-3 end-3 z-10 flex size-11 items-center justify-center rounded-full bg-neutral-700 transition-[background-color,border-radius] duration-300 ease-osmo hover:rounded-[0.5rem] hover:bg-neutral-600 md:top-5 md:end-5"
        >
          <Close className="size-5 transition-transform duration-500 ease-osmo group-hover:rotate-90" />
        </button>

        <div
          ref={content}
          data-lenis-prevent
          className="no-scrollbar absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain"
        >
          <div className="grid min-h-full gap-2 p-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] md:gap-6 md:p-6">
            <Aside />
            <div className="flex min-w-0 flex-col px-3 pt-5 pb-4 md:px-2 md:pt-3 md:pe-4">
              {status === 'sent' ? (
                <Success name={form.name} reference={reference} onClose={closeQuote} onAgain={() => { setForm(emptyForm); setStatus('idle') }} />
              ) : (
                <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4">
                  {items.length > 0 && <QuoteList items={items} count={count} setQty={setQty} removeItem={removeItem} clearItems={clearItems} />}
                  <Field item label={t('q.details')}>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                      <Input label={t('q.name')} name="name" required autoComplete="name" value={form.name} error={errors.name} onChange={set} />
                      <Input label={t('q.company')} name="company" autoComplete="organization" value={form.company} onChange={set} placeholder={t('q.optional')} />
                      <Input label={t('q.phone')} name="phone" dir="ltr" type="tel" required autoComplete="tel" value={form.phone} error={errors.phone} onChange={set} />
                      <Input label={t('q.email')} name="email" dir="ltr" type="email" required autoComplete="email" value={form.email} error={errors.email} onChange={set} />
                    </div>
                  </Field>

                  <Details
                    label={items.length ? t('q.anything') : t('q.project')}
                    value={form.details}
                    error={errors.details}
                    onChange={(v) => set('details', v)}
                    files={form.files}
                    onAdd={addFiles}
                    onRemove={(i) => set('files', form.files.filter((_, j) => j !== i))}
                  />

                  <div data-q-item className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-sm text-neutral-500 max-sm:hidden">{t('q.reply')}</p>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group relative flex h-[3.25rem] items-center justify-center gap-3 overflow-hidden rounded-[0.375rem] bg-volt px-7 text-[1.0625rem] font-medium text-neutral-800 transition-colors duration-200 hover:bg-volt-300 disabled:cursor-wait max-sm:w-full"
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-neutral-800 border-t-transparent" />
                          {t('q.sending')}
                        </>
                      ) : (
                        <>
                          {t('q.send')}
                          <ArrowRight className="size-5 transition-transform duration-500 ease-osmo group-hover:translate-x-[calc(var(--dir)*0.25rem)]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function QuoteList({ items, count, setQty, removeItem, clearItems }) {
  const { t, l } = useI18n()
  return (
    <div data-q-item className="flex flex-col">
      <p className="eyebrow mb-2 flex items-center justify-between text-neutral-400 md:pe-14">
        <span>{count === 1 ? t('q.listOne') : t('q.list', { n: count })}</span>
        <button type="button" onClick={clearItems} className="text-neutral-500 normal-case transition-colors hover:text-neutral-200">
          {t('q.clear')}
        </button>
      </p>
      {/* Two rows visible; longer lists scroll inside so the form itself never has to */}
      <ul data-lenis-prevent className="flex max-h-[6.1rem] flex-col gap-1.5 overflow-y-auto pe-1">
        {items.map(({ slug, qty }) => {
          const product = productBySlug(slug)
          if (!product) return null
          const brand = brandBySlug(product.brand)
          return (
            <li key={slug} className="flex shrink-0 items-center gap-2.5 rounded-[0.5rem] bg-neutral-700/60 p-1 pe-1.5">
              <span style={artTheme('paper', brand.color)} className="flex size-9 shrink-0 items-center justify-center rounded-[0.35rem]">
                <ProductArt type={product.art} className="h-[82%] w-auto" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9rem] leading-tight">{l(product.name)}</span>
                <span className="mt-0.5 block truncate font-mono text-[0.64rem] text-neutral-500 uppercase">
                  {brand.name} · {product.sku}
                </span>
              </span>
              <QtyStepper dark small value={qty} onChange={(n) => setQty(slug, n)} />
              <button
                type="button"
                onClick={() => removeItem(slug)}
                aria-label={t('q.remove', { name: l(product.name) })}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-100"
              >
                <Close className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const inputClass =
  'h-11 [@media(max-height:780px)]:h-10 w-full rounded-[0.375rem] border border-neutral-600 bg-neutral-700/50 px-4 text-[1rem] text-neutral-100 outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-neutral-500 hover:border-neutral-500 focus:border-volt focus:bg-neutral-700 focus:shadow-[0_0_0_3px_rgba(240,168,32,0.14)]'
const errorClass = 'border-[#ff7a59]! focus:border-[#ff7a59]! focus:shadow-[0_0_0_3px_rgba(255,122,89,0.18)]!'

// Errors sit at the end of the label row, so showing them never makes the form taller (it must fit without scrolling)
const ErrorText = ({ children }) => (
  <span role="alert" className="-my-[0.35em] min-w-0 truncate py-[0.35em] font-sans text-[0.8rem] leading-[calc(0.75rem)] tracking-normal text-[#ff9b80] normal-case">
    {children}
  </span>
)

function Field({ label, item, children }) {
  return (
    <fieldset data-q-item={item || undefined} className="flex min-w-0 flex-col">
      <legend className="eyebrow mb-2 text-neutral-400">{label}</legend>
      {children}
    </fieldset>
  )
}

function Input({ label, name, value, error, onChange, required, ...rest }) {
  const { t } = useI18n()
  return (
    <label className="flex min-w-0 flex-col">
      <span className="eyebrow mb-1.5 flex items-center justify-between gap-3 text-neutral-400">
        <span className="shrink-0">
          {label}
          {required && <span className="text-volt"> *</span>}
        </span>
        {error && <ErrorText>{t(error)}</ErrorText>}
      </span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={!!error}
        className={cx(inputClass, error && errorClass)}
        {...rest}
      />
    </label>
  )
}

/** Free-text field with an "Attach" button inside it; files can also be dropped anywhere on it. */
function Details({ label, value, error, onChange, files, onAdd, onRemove }) {
  const [drag, setDrag] = useState(false)
  const { t } = useI18n()
  return (
    <div data-q-item className="flex flex-1 flex-col gap-2">
      <label htmlFor="quote-details" className="eyebrow flex items-center justify-between gap-3 text-neutral-400">
        <span className="shrink-0">{label}</span>
        {error ? <ErrorText>{t(error)}</ErrorText> : <span className="text-neutral-500 normal-case max-sm:hidden">{t('q.projectHint')}</span>}
      </label>
      <div
        className="relative flex flex-1 flex-col"
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          onAdd(e.dataTransfer.files)
        }}
      >
        <textarea
          id="quote-details"
          name="details"
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('q.placeholder')}
          aria-invalid={!!error}
          className={cx(
            inputClass,
            'h-auto min-h-[6rem] flex-1 resize-none py-3 pb-12 leading-snug',
            drag && 'border-volt bg-volt/5',
            error && errorClass,
          )}
        />
        <label className="absolute end-2 bottom-2 flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-neutral-600 px-3 text-[0.82rem] transition-colors hover:bg-neutral-500">
          <Upload className="size-3.5" />
          {t('q.attach')}
          <input
            type="file"
            multiple
            accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png,.heic"
            className="sr-only"
            onChange={(e) => {
              onAdd(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
      </div>
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex h-8 items-center gap-2 rounded-full bg-neutral-700 ps-3 pe-1 text-[0.85rem]">
              <FileIcon className="size-3.5 text-volt" />
              <span className="max-w-[12rem] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`Remove ${f.name}`}
                className="flex size-6 items-center justify-center rounded-full hover:bg-neutral-600"
              >
                <Close className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Aside() {
  const { t } = useI18n()
  const perks = [t('q.perk1'), t('q.perk2'), t('q.perk3')]
  const contacts = [
    { icon: Phone, label: site.phone, href: site.phoneHref },
    { icon: WhatsApp, label: t('q.whatsapp'), href: site.whatsappHref },
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  ]
  return (
    <aside data-q-item className="relative flex flex-col overflow-hidden rounded-2xl bg-neutral-700 p-6 pe-16 md:p-9 md:pe-9">
      <p className="eyebrow flex items-center gap-1.5">
        <span className="rounded-[0.1875rem] bg-neutral-800 px-1.5 py-[0.3em]">{t('q.tagRequest')}</span>
        <span className="rounded-[0.1875rem] bg-volt px-1.5 py-[0.3em] text-neutral-800">{t('q.tagQuote')}</span>
      </p>
      <h2 id="quote-title" className="display mt-6 text-[clamp(2rem,3.1vw,3.1rem)] leading-[0.95] tracking-[-0.045em]">
        {t('q.title')}
      </h2>
      <p className="mt-4 max-w-[24em] text-neutral-400">{t('q.text')}</p>
      {/* Reassurances make way on short screens so the whole form fits without scrolling */}
      <div className="[@media(max-height:820px)]:hidden">
        <ul className="mt-8 hidden flex-col gap-3 md:flex">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[0.98rem]">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-volt text-neutral-800">
                <Check className="size-3" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto hidden flex-col gap-1.5 pt-8 md:flex">
        <p className="eyebrow mb-2 text-neutral-500">{t('q.talk')}</p>
        {contacts.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-[0.5rem] bg-neutral-800/70 px-3.5 py-2.5 transition-colors duration-300 hover:bg-neutral-800"
          >
            <Icon className="size-[1.1rem] text-volt" />
            <span dir={href.startsWith('tel:') ? 'ltr' : undefined} className="truncate text-[0.95rem]">{label}</span>
            <ArrowRight className="ms-auto size-4 -translate-x-[calc(var(--dir)*0.25rem)] opacity-0 transition-[translate,opacity] duration-500 ease-osmo group-hover:translate-x-0 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </aside>
  )
}

function Success({ name, reference, onClose, onAgain }) {
  const root = useRef(null)
  const { t } = useI18n()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-s-item]', { y: '1.5rem', autoAlpha: 0, duration: 0.9, ease: 'osmo', stagger: 0.07 })
      gsap.from('[data-s-ring]', { scale: 0.4, autoAlpha: 0, duration: 1, ease: 'expo.out' })
      gsap.fromTo('[data-s-check]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', delay: 0.25 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="flex h-full min-h-[24rem] flex-col items-start justify-center py-6 md:ps-4">
      <span data-s-ring className="flex size-16 items-center justify-center rounded-full bg-volt text-neutral-800">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path data-s-check pathLength="1" strokeDasharray="1" d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h3 data-s-item className="display mt-8 text-[clamp(2rem,3vw,3rem)] leading-[0.95] tracking-[-0.045em]">
        {name.trim() ? t('q.ok.titleName', { name: name.trim().split(' ')[0] }) : t('q.ok.title')}
      </h3>
      <p data-s-item className="mt-4 max-w-[28em] text-neutral-400">
        {t('q.ok.text')}
      </p>
      <p data-s-item className="eyebrow mt-6 rounded-[0.25rem] bg-neutral-700 px-2.5 py-2 text-neutral-300">{t('q.ok.ref', { ref: reference })}</p>
      <div data-s-item className="mt-10 flex flex-wrap gap-2">
        <button type="button" onClick={onClose} className="h-12 rounded-[0.375rem] bg-volt px-6 font-medium text-neutral-800 transition-colors hover:bg-volt-300">
          {t('q.ok.back')}
        </button>
        <button type="button" onClick={onAgain} className="h-12 rounded-[0.375rem] px-5 text-neutral-300 shadow-[inset_0_0_0_1px_var(--color-neutral-600)] transition-colors hover:bg-neutral-700">
          {t('q.ok.again')}
        </button>
      </div>
    </div>
  )
}
