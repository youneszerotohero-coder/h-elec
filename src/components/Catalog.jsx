import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { cx } from '../lib/cx'
import { flyToQuote } from '../lib/flyToQuote'
import { useQuote } from '../context/QuoteContext'
import { TLink } from '../transition/PageTransition'
import { brandBySlug, categoryBySlug } from '../data/content'
import { productsByBrand } from '../data/products'
import { useI18n } from '../i18n/I18n'
import ProductArt, { artTheme } from './ProductArt'
import BrandVisual, { BrandLogo } from './BrandVisual'
import { ArrowChip } from './Button'
import { Badge } from './Section'
import { Minus, Plus } from './icons'

const grid = {
  backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
}

export function StockTag({ stock, className = '' }) {
  const { t } = useI18n()
  return (
    <span className={cx('flex items-center gap-1.5', className)}>
      <span
        className={cx(
          'size-1.5 rounded-full',
          stock === 'in' && 'bg-[#2fb45a] shadow-[0_0_0_3px_rgba(47,180,90,0.18)]',
          stock === 'low' && 'bg-[#f0a020] shadow-[0_0_0_3px_rgba(240,160,32,0.2)]',
          stock === 'order' && 'bg-neutral-500',
        )}
      />
      {t(`stock.${stock}`)}
    </span>
  )
}

/** Product tile — the whole card links to the product page; the + button adds it to the quote list. */
export function ProductCard({ product, hidden = false, className = '', ...props }) {
  const brand = brandBySlug(product.brand)
  const category = categoryBySlug(product.category)
  const { addItem } = useQuote()
  const { t, l } = useI18n()

  const add = (e) => {
    e.preventDefault()
    addItem(product.slug, 1)
    flyToQuote(e.currentTarget, '+1')
  }

  return (
    <article
      {...props}
      className={cx(
        'group relative flex flex-col rounded-[1rem] bg-neutral-50 p-2 shadow-[0_0_0_1px_rgba(31,29,27,0.07)] transition-[box-shadow,translate] duration-500 ease-osmo hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(31,29,27,0.07),0_1.75rem_3rem_-1.75rem_rgba(31,29,27,0.4)]',
        hidden && 'hidden',
        className,
      )}
    >
      <div style={artTheme('paper', brand.color)} className="relative aspect-[4/3] overflow-hidden rounded-[0.7rem]">
        <span aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{ ...grid, backgroundSize: '10% 13.333%' }} />
        <ProductArt
          type={product.art}
          className="absolute inset-[15%] m-auto transition-transform duration-700 ease-osmo group-hover:scale-[1.08] group-hover:-rotate-2"
        />
        <span className="absolute top-2.5 start-2.5 flex h-8 items-center rounded-[0.4rem] bg-white px-2.5 shadow-[0_0_0_1px_rgba(31,29,27,0.06)]">
          <BrandLogo brand={brand} className="h-[calc(0.95rem*var(--logo-f))] w-auto max-w-[5.5rem]" />
        </span>
        {product.isNew && <Badge className="absolute top-3 end-3">{t('common.new')}</Badge>}
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-1.5">
        <p className="eyebrow text-neutral-500">{l(category.title)}</p>
        <h3 className="mt-2 text-[1.12rem] leading-[1.18] font-medium tracking-[-0.025em] text-balance">
          <TLink to={`/products/${product.slug}`} className="after:absolute after:inset-0 after:rounded-[1rem] after:content-['']">
            {l(product.name)}
          </TLink>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="flex flex-col gap-1.5 text-[0.8rem] text-neutral-550">
            <span className="font-mono text-[0.7rem] text-neutral-500">{product.sku}</span>
            <StockTag stock={product.stock} />
          </span>
          <button
            type="button"
            onClick={add}
            aria-label={t('common.addToList', { name: l(product.name) })}
            className="relative z-10 flex h-9 items-center gap-1.5 rounded-full bg-neutral-800 ps-2.5 pe-3.5 text-[0.85rem] text-neutral-100 transition-colors duration-300 hover:bg-volt hover:text-neutral-800"
          >
            <Plus className="size-4" />
            {t('common.quoteBtn')}
          </button>
        </div>
      </div>
    </article>
  )
}

/** Brand tile — dark frame around the white logo plate, like the cards on the home wheel. */
export function BrandTile({ brand, hidden = false, className = '', ...props }) {
  const count = productsByBrand(brand.slug).length
  const { t, l } = useI18n()
  return (
    <TLink
      {...props}
      to={`/brands/${brand.slug}`}
      className={cx(
        'group flex flex-col rounded-[1rem] bg-neutral-800 p-2 text-neutral-100 transition-[translate,box-shadow] duration-500 ease-osmo hover:-translate-y-1.5 hover:shadow-[0_2rem_3rem_-1.5rem_rgba(22,21,19,0.55)]',
        hidden && 'hidden',
        className,
      )}
    >
      <BrandVisual brand={brand} className="rounded-[0.65rem] text-[1.05rem]" />
      <span className="flex items-start justify-between gap-4 px-2.5 pt-5">
        <span className="min-w-0">
          <span className="eyebrow flex items-center gap-2 text-neutral-500">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
            {l(brand.country)}
          </span>
          <span className="display mt-3 block text-[1.7rem] leading-none tracking-[-0.04em]">{brand.name}</span>
          <span className="mt-2.5 block text-[0.95rem] leading-snug text-neutral-400">{l(brand.specialty)}</span>
        </span>
        <ArrowChip className="bg-neutral-700 group-hover:bg-volt group-hover:text-neutral-800" />
      </span>
      <span className="mx-2.5 mt-5 mb-1.5 flex justify-between border-t border-neutral-600 pt-3 font-mono text-[0.72rem] text-neutral-500 uppercase">
        <span>{t('bt.since', { year: brand.founded })}</span>
        <span>{count === 1 ? t('bt.product1') : t('bt.products', { n: count })}</span>
      </span>
    </TLink>
  )
}

/** Segmented filter; a dark pill slides to the active option. */
export function FilterPills({ options, value, onChange, bleed = true, className = '' }) {
  const track = useRef(null)
  const pill = useRef(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const place = (animate) => {
      const el = track.current?.querySelector(`[data-value="${value}"]`)
      if (!el) return
      gsap.to(pill.current, { x: el.offsetLeft, width: el.offsetWidth, duration: animate ? 0.6 : 0, ease: 'osmo' })
      // Keep the active option in view on narrow screens (horizontal only — never scroll the page)
      const scroller = track.current.parentElement
      if (animate && scroller.scrollWidth > scroller.clientWidth) {
        // Relative scroll from on-screen positions: correct in both LTR and RTL
        const a = el.getBoundingClientRect()
        const b = scroller.getBoundingClientRect()
        scroller.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: 'smooth' })
      }
    }
    place(!first.current)
    first.current = false
    // Re-place whenever the labels change width (late web fonts, language). In RTL the first tab sits at the far
    // end, so its offset depends on every other label's width.
    let settled = false
    const ro = new ResizeObserver(() => (settled ? place(false) : (settled = true)))
    ro.observe(track.current)
    document.fonts?.ready.then(() => place(false))
    return () => ro.disconnect()
  }, [value])

  return (
    <div
      className={cx(
        'no-scrollbar overflow-x-auto',
        // bleed: scroll edge-to-edge on small screens instead of stopping at the container padding
        bleed && '-mx-[clamp(1rem,3.2vw,2.75rem)] px-[clamp(1rem,3.2vw,2.75rem)]',
        className,
      )}
    >
      <div ref={track} role="tablist" className="relative inline-flex gap-0.5 rounded-full bg-neutral-300/80 p-1">
        <span ref={pill} aria-hidden="true" className="absolute top-1 bottom-1 left-0 rounded-full bg-neutral-800 shadow-[0_0.4rem_1rem_-0.4rem_rgba(22,21,19,0.5)]" />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={value === o.value}
            data-value={o.value}
            onClick={() => onChange(o.value)}
            className={cx(
              'relative z-10 flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.95rem] whitespace-nowrap transition-colors duration-300',
              value === o.value ? 'text-neutral-100' : 'text-neutral-600 hover:text-neutral-900',
            )}
          >
            {o.label}
            {o.count != null && <span className={cx('font-mono text-[0.68rem]', value === o.value ? 'text-volt' : 'text-neutral-500')}>{o.count}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function QtyStepper({ value, onChange, dark = false, small = false }) {
  const { t } = useI18n()
  const btn = cx(
    'flex items-center justify-center rounded-[0.35rem] transition-colors disabled:opacity-35',
    small ? 'size-7' : 'size-10',
    dark ? 'hover:bg-neutral-600' : 'hover:bg-neutral-200',
  )
  return (
    <div className={cx('flex items-center gap-0.5 rounded-[0.5rem] p-1', dark ? 'bg-neutral-800' : 'bg-white shadow-[0_0_0_1px_rgba(31,29,27,0.1)]')}>
      <button type="button" aria-label={t('qty.dec')} className={btn} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="size-3.5" />
      </button>
      <input
        aria-label={t('qty.label')}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(9999, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1)))}
        className={cx('bg-transparent text-center font-mono tabular-nums outline-none', small ? 'w-8 text-[0.8rem]' : 'w-12 text-[0.95rem]')}
      />
      <button type="button" aria-label={t('qty.inc')} className={btn} onClick={() => onChange(value + 1)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
