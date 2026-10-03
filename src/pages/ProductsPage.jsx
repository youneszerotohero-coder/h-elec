import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { cx } from '../lib/cx'
import { useFlipFilter } from '../lib/useFlipFilter'
import { useQuote } from '../context/QuoteContext'
import { brandBySlug, brands, categories, categoryBySlug } from '../data/content'
import { products, specLabels } from '../data/products'
import { gammeBySlug, gammesByBrand } from '../data/gammes'
import Page, { PageHero } from '../components/Page'
import { FilterPills, ProductCard } from '../components/Catalog'
import { BrandLogo } from '../components/BrandVisual'
import Button from '../components/Button'
import { Close, Search } from '../components/icons'
import CTA from '../sections/CTA'
import { useI18n } from '../i18n/I18n'

// Search matches every language at once — a French query finds a product while browsing in English, too
const all = (v) => (v && typeof v === 'object' ? Object.values(v) : [v])
const haystack = (p) =>
  [
    ...all(p.name),
    p.sku,
    ...all(p.summary),
    brandBySlug(p.brand)?.name,
    ...all(gammeBySlug(p.gamme)?.name),
    ...all(categoryBySlug(p.category)?.title),
    ...p.specs.flatMap(([label, value]) => [...all(specLabels[label] ?? label), ...all(value)]),
  ]
    .join(' ')
    .toLowerCase()

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? 'all'
  const brand = params.get('brand') ?? 'all'
  // A range only makes sense inside its own brand (?brand=legrand&gamme=mosaic); anything else is ignored
  const activeGamme = gammeBySlug(params.get('gamme'))
  const gamme = activeGamme && activeGamme.brand === brand ? activeGamme.slug : 'all'
  // The search box keeps its own state (URL updates are async and would drop fast keystrokes)
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const grid = useRef(null)
  const capture = useFlipFilter(grid, [category, brand, gamme, query])
  const { openQuote } = useQuote()
  const { t, l, num } = useI18n()

  const matches = (p, { c = category, b = brand, g = gamme, q = query } = {}) =>
    (c === 'all' || p.category === c) &&
    (b === 'all' || p.brand === b) &&
    (g === 'all' || p.gamme === g) &&
    (!q || haystack(p).includes(q.trim().toLowerCase()))
  const visible = products.filter((p) => matches(p))

  const update = (patch) => {
    capture()
    if ('q' in patch) setQuery(patch.q)
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (!v || v === 'all' ? next.delete(k) : next.set(k, v)))
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const categoryOptions = [
    { value: 'all', label: t('pp.all'), count: products.filter((p) => matches(p, { c: 'all' })).length },
    ...categories.map((c) => ({ value: c.slug, label: l(c.title), count: products.filter((p) => matches(p, { c: c.slug })).length })),
  ]
  const brandGammes = brand === 'all' ? [] : gammesByBrand(brand)
  const gammeOptions = [
    { value: 'all', label: t('pp.allGammes'), count: products.filter((p) => matches(p, { g: 'all' })).length },
    ...brandGammes.map((g) => ({ value: g.slug, label: l(g.name), count: products.filter((p) => matches(p, { g: g.slug })).length })),
  ]
  const activeCategory = categoryBySlug(category)
  const selectedGamme = gamme === 'all' ? null : activeGamme
  const filtered = category !== 'all' || brand !== 'all' || query
  const clearAll = { category: 'all', brand: 'all', gamme: 'all', q: '' }
  const title = selectedGamme
    ? `${brandBySlug(brand).name} ${l(selectedGamme.name)}`
    : activeCategory
      ? l(activeCategory.title)
      : t('common.catalogue')

  return (
    <Page title={title}>
      <PageHero
        index={String(products.length)}
        eyebrow={t('common.catalogue')}
        title={t('pp.title')}
        lead={t('pp.lead')}
        aside={
          <Button size="lg" onClick={(e) => openQuote(null, e.currentTarget)}>
            {t('pp.sendList')}
          </Button>
        }
      />

      <section className="pb-[clamp(5rem,11vw,10rem)]">
        {/* Toolbar — sticks under the navbar */}
        <div className="sticky top-[calc(3.9rem+0.5rem)] z-20 md:top-[calc(3.9rem+1.25rem)]">
          <div className="container-x">
            <div
              data-reveal
              className="flex flex-col gap-2 rounded-[1.1rem] bg-neutral-200/85 p-2 shadow-[0_0_0_1px_rgba(31,29,27,0.06),0_1rem_2rem_-1.5rem_rgba(22,21,19,0.3)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between"
            >
              <FilterPills
                bleed={false}
                options={categoryOptions}
                value={category}
                onChange={(v) => v !== category && update({ category: v })}
                className="min-w-0 flex-1 rounded-full [mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] lg:pe-10 rtl:[mask-image:linear-gradient(to_left,#000_calc(100%-3rem),transparent)]"
              />
              <label className="relative flex h-12 shrink-0 items-center lg:w-[19rem]">
                <Search className="pointer-events-none absolute start-4 size-[1.1rem] text-neutral-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => update({ q: e.target.value })}
                  placeholder={t('pp.search')}
                  aria-label={t('pp.searchAria')}
                  className="h-full w-full rounded-full bg-white ps-11 pe-4 text-[0.98rem] shadow-[0_0_0_1px_rgba(31,29,27,0.1)] outline-none transition-shadow placeholder:text-neutral-500 focus:shadow-[0_0_0_2px_var(--color-neutral-800)]"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="container-x">
          {/* Brand chips */}
          <div data-reveal className="no-scrollbar relative z-10 -mx-[clamp(1rem,3.2vw,2.75rem)] mt-4 overflow-x-auto px-[clamp(1rem,3.2vw,2.75rem)]">
            <div className="flex gap-1.5">
              <BrandChip active={brand === 'all'} onClick={() => update({ brand: 'all', gamme: 'all' })}>
                <span className="px-1 text-[0.92rem]">{t('pp.allBrands')}</span>
              </BrandChip>
              {brands.map((b) => (
                <BrandChip key={b.slug} active={brand === b.slug} onClick={() => update({ brand: brand === b.slug ? 'all' : b.slug, gamme: 'all' })} label={b.name}>
                  <BrandLogo brand={b} className="h-[calc(1rem*var(--logo-f))] w-auto max-w-[5.5rem]" />
                </BrandChip>
              ))}
            </div>
          </div>

          {/* Ranges of the selected brand */}
          {brandGammes.length > 1 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="eyebrow shrink-0 text-neutral-500 max-sm:hidden">{t('pp.gammes')}</span>
              <FilterPills options={gammeOptions} value={gamme} onChange={(v) => v !== gamme && update({ gamme: v })} className="min-w-0 flex-1" />
            </div>
          )}

          <div data-reveal className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-400 pt-4">
            <p className="font-mono text-[0.8rem] text-neutral-550 uppercase" aria-live="polite">
              {t('pp.count', { n: num(visible.length), total: num(products.length) })}
              {activeCategory && <> · {l(activeCategory.title)}</>}
              {brand !== 'all' && <> · {brandBySlug(brand)?.name}</>}
              {selectedGamme && <> · {l(selectedGamme.name)}</>}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => update(clearAll)}
                className="flex items-center gap-1.5 font-mono text-[0.8rem] text-neutral-800 uppercase hover:text-neutral-550"
              >
                <Close className="size-3.5" /> {t('pp.clear')}
              </button>
            )}
          </div>

          <div ref={grid} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} data-reveal hidden={!matches(p)} />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="flex flex-col items-center rounded-[1rem] bg-neutral-300/60 px-6 py-20 text-center">
              <p className="display text-h3">{t('pp.empty.title')}</p>
              <p className="mt-3 max-w-[28em] text-neutral-550">
                {t('pp.empty.text')}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <Button onClick={(e) => openQuote({ details: query ? t('q.prefillLooking', { q: query }) : '' }, e.currentTarget)}>{t('pp.empty.ask')}</Button>
                <Button variant="outline" onClick={() => update(clearAll)}>
                  {t('pp.clear')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <CTA />
    </Page>
  )
}

function BrandChip({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cx(
        'flex h-11 shrink-0 items-center justify-center rounded-[0.6rem] bg-white px-3.5 transition-[box-shadow,opacity] duration-300',
        active ? 'shadow-[0_0_0_2px_var(--color-neutral-800)]' : 'opacity-75 shadow-[0_0_0_1px_rgba(31,29,27,0.08)] hover:opacity-100',
      )}
    >
      {children}
    </button>
  )
}
