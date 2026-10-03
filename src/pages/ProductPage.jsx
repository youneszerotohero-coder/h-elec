import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { flyToQuote } from '../lib/flyToQuote'
import { useQuote } from '../context/QuoteContext'
import { TLink } from '../transition/PageTransition'
import { brandBySlug, categoryBySlug } from '../data/content'
import { gammeBySlug } from '../data/gammes'
import { productBySlug, products, specLabels } from '../data/products'
import Page, { Breadcrumbs, SplitWords, useIntro } from '../components/Page'
import { ProductCard, QtyStepper, StockTag } from '../components/Catalog'
import ProductArt, { artTheme } from '../components/ProductArt'
import BrandVisual, { BrandLogo } from '../components/BrandVisual'
import { Badge, Eyebrow } from '../components/Section'
import Button, { ArrowChip } from '../components/Button'
import { Check, External, Plus } from '../components/icons'
import CTA from '../sections/CTA'
import NotFound from './NotFound'
import { useI18n } from '../i18n/I18n'

const pad = (n) => String(n).padStart(2, '0')

/** Spec rows as [label, value] in the current language */
const useSpecs = (product) => {
  const { l } = useI18n()
  return product.specs.map(([label, value]) => [l(specLabels[label] ?? label), l(value)])
}

export default function ProductPage() {
  const { slug } = useParams()
  const { t, l } = useI18n()
  const product = productBySlug(slug)
  if (!product) return <NotFound />
  const brand = brandBySlug(product.brand)
  const category = categoryBySlug(product.category)
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)
  const fromBrand = products.filter((p) => p.brand === product.brand && p.slug !== product.slug && !related.includes(p)).slice(0, 4)

  return (
    <Page title={`${l(product.name)} — ${brand.name}`}>
      <ProductHero product={product} brand={brand} category={category} />
      <Details product={product} brand={brand} category={category} />
      {related.length > 0 && (
        <Shelf
          eyebrow={t('p.related')}
          title={t('p.moreIn', { category: l(category.title).toLowerCase() })}
          to={`/products?category=${category.slug}`}
          cta={t('p.seeAll')}
          items={related}
        />
      )}
      {fromBrand.length > 0 && (
        <Shelf
          eyebrow={brand.name}
          title={t('p.moreFrom', { brand: brand.short ?? brand.name })}
          to={`/brands/${brand.slug}`}
          cta={t('p.about', { brand: brand.short ?? brand.name })}
          items={fromBrand}
        />
      )}
      <BrandBanner brand={brand} />
      <CTA />
    </Page>
  )
}

function ProductHero({ product, brand, category }) {
  const root = useRef(null)
  const { t, l } = useI18n()
  const specs = useSpecs(product)
  useIntro(root, (tl) =>
    tl
      .fromTo(
        '[data-visual]',
        { clipPath: 'inset(14% 14% 14% 14% round 1.25rem)' },
        { clipPath: 'inset(0% 0% 0% 0% round 1.25rem)', duration: 1.4, ease: 'expo.out', clearProps: 'clipPath' },
        0,
      )
      .from('[data-visual-art]', { scale: 0.7, rotate: -8, autoAlpha: 0, duration: 1.6, ease: 'expo.out' }, 0.1),
  )

  const keySpecs = specs.slice(0, 4)

  return (
    <section ref={root} className="pt-[calc(4.625rem+clamp(2rem,7svh,5rem))] pb-[clamp(4rem,9vw,8rem)]">
      <div className="container-x">
        <Breadcrumbs items={[[t('common.catalogue'), '/products'], [l(category.title), `/products?category=${category.slug}`], [l(product.name)]]} />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <Visual product={product} brand={brand} category={category} />
            </div>
          </div>

          <div className="lg:col-span-5 lg:ps-4 xl:ps-8">
            <TLink
              data-intro
              to={`/brands/${brand.slug}`}
              className="group inline-flex h-11 items-center gap-3 rounded-full bg-white ps-4 pe-2 shadow-[0_0_0_1px_rgba(31,29,27,0.08)] transition-shadow hover:shadow-[0_0_0_1px_rgba(31,29,27,0.2)]"
            >
              <BrandLogo brand={brand} className="h-[calc(1.05rem*var(--logo-f))] w-auto max-w-[6.5rem]" />
              <span className="eyebrow text-neutral-500">{l(brand.country)}</span>
              <ArrowChip className="size-7 bg-neutral-200 group-hover:bg-volt" />
            </TLink>

            <h1 className="display mt-6 text-[clamp(2.4rem,4.3vw,4.9rem)] leading-[0.95] tracking-[-0.045em] text-balance">
              <SplitWords text={l(product.name)} />
            </h1>

            <div data-intro className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.78rem] text-neutral-550 uppercase">
              <span>
                {t('p.reference')} <bdi>{product.sku}</bdi>
              </span>
              <StockTag stock={product.stock} className="normal-case" />
              <span>{l(product.pack)}</span>
            </div>

            <p data-intro className="mt-6 text-lead text-neutral-600">
              {l(product.summary)}
            </p>

            <dl data-intro className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[0.9rem] bg-neutral-400/60 shadow-[0_0_0_1px_rgba(31,29,27,0.06)]">
              {keySpecs.map(([label, value]) => (
                <div key={label} className="bg-neutral-100 px-4 py-4">
                  <dt className="eyebrow text-neutral-500">{label}</dt>
                  <dd className="mt-2 text-[1.15rem] leading-tight tracking-[-0.02em]"><bdi>{value}</bdi></dd>
                </div>
              ))}
            </dl>

            <div data-intro className="mt-8">
              <AddToQuote product={product} brand={brand} />
            </div>

            <ul data-intro className="mt-8 flex flex-col gap-2.5 border-t border-neutral-400 pt-6 text-[0.95rem] text-neutral-600">
              {[t('p.genuine', { brand: brand.name }), t('p.warranty'), t('p.delivery')].map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-neutral-800 text-volt">
                    <Check className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Blueprint-style product panel; the drawing tilts in 3D with the cursor. */
function Visual({ product, brand, category }) {
  const card = useRef(null)
  const { t, l } = useI18n()
  const art = useRef(null)

  useGSAP(
    () => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      gsap.set(art.current, { transformPerspective: 1100 })
      const rx = gsap.quickTo(art.current, 'rotationX', { duration: 0.9, ease: 'power3' })
      const ry = gsap.quickTo(art.current, 'rotationY', { duration: 0.9, ease: 'power3' })
      const move = (e) => {
        const r = card.current.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 22)
        rx(-((e.clientY - r.top) / r.height - 0.5) * 16)
      }
      const reset = () => {
        rx(0)
        ry(0)
      }
      card.current.addEventListener('pointermove', move)
      card.current.addEventListener('pointerleave', reset)
      return () => {
        card.current?.removeEventListener('pointermove', move)
        card.current?.removeEventListener('pointerleave', reset)
      }
    },
    { scope: card },
  )

  const corner = 'absolute size-5 border-neutral-800/40'

  return (
    <div
      ref={card}
      data-visual
      style={artTheme('paper', brand.color)}
      className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] shadow-[0_0_0_1px_rgba(31,29,27,0.07)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '5% 6.25%',
        }}
      />
      <span aria-hidden="true" className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(240,168,32,0.22),transparent)]" />
      <span aria-hidden="true" className={`${corner} top-5 left-5 border-t border-l`} />
      <span aria-hidden="true" className={`${corner} top-5 right-5 border-t border-r`} />
      <span aria-hidden="true" className={`${corner} bottom-5 left-5 border-b border-l`} />
      <span aria-hidden="true" className={`${corner} right-5 bottom-5 border-r border-b`} />

      <div ref={art} className="absolute inset-[17%] will-change-transform">
        <ProductArt data-visual-art type={product.art} className="h-full w-full drop-shadow-[0_2rem_2rem_rgba(22,21,19,0.12)]" />
      </div>

      <span className="absolute top-9 start-9 flex h-9 items-center rounded-[0.45rem] bg-white px-3 shadow-[0_0_0_1px_rgba(31,29,27,0.06)]">
        <BrandLogo brand={brand} className="h-[calc(1.05rem*var(--logo-f))] w-auto max-w-[6.5rem]" />
      </span>
      {product.isNew && <Badge className="absolute top-10 end-10">{t('common.new')}</Badge>}
      <span className="absolute bottom-9 start-9 font-mono text-[0.7rem] tracking-wide text-neutral-500 uppercase">{t('p.fig', { sku: product.sku })}</span>
      <span className="absolute end-9 bottom-9 font-mono text-[0.7rem] tracking-wide text-neutral-500 uppercase max-sm:hidden">{l(category.title)}</span>
    </div>
  )
}

function AddToQuote({ product, brand }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(0)
  const note = useRef(null)
  const { addItem, openQuote, items } = useQuote()
  const { t, l } = useI18n()
  const inList = items.find((i) => i.slug === product.slug)?.qty ?? 0

  useGSAP(() => {
    if (added && note.current) gsap.from(note.current, { y: 12, autoAlpha: 0, duration: 0.7, ease: 'expo.out' })
  }, { dependencies: [added] })

  const add = (e) => {
    addItem(product.slug, qty)
    flyToQuote(e.currentTarget, `+${qty}`)
    setAdded((n) => n + 1)
  }

  return (
    <div>
      <div className="flex gap-2">
        <QtyStepper value={qty} onChange={setQty} />
        <button
          type="button"
          onClick={add}
          className="group flex h-12 flex-1 items-center justify-center gap-2.5 rounded-[0.5rem] bg-volt text-[1.05rem] font-medium text-neutral-800 transition-colors duration-200 hover:bg-volt-300"
        >
          <Plus className="size-5 transition-transform duration-500 ease-osmo group-hover:rotate-90" />
          {t('p.addToList')}
        </button>
      </div>
      <button
        type="button"
        onClick={(e) => openQuote({ details: t('q.prefillQuestion', { brand: brand.name, name: l(product.name), sku: product.sku }) }, e.currentTarget)}
        className="mt-2 h-12 w-full rounded-[0.5rem] text-[0.98rem] shadow-[inset_0_0_0_1px_rgba(31,29,27,0.25)] transition-colors hover:bg-neutral-800 hover:text-neutral-100"
      >
        {t('p.ask')}
      </button>
      {added > 0 && (
        <p ref={note} key={added} className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#2fb45a] text-white">
            <Check className="size-3" />
          </span>
          {t('p.inList', { n: inList })}
          <button
            type="button"
            onClick={(e) => openQuote(null, e.currentTarget)}
            className="underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-800"
          >
            {t('p.review')}
          </button>
        </p>
      )}
    </div>
  )
}

function Details({ product, brand, category }) {
  const gamme = gammeBySlug(product.gamme)
  const { t, l } = useI18n()
  const sheet = [
    ...useSpecs(product),
    [t('p.brand'), brand.name],
    ...(gamme ? [[t('p.gamme'), l(gamme.name)]] : []),
    [t('p.category'), l(category.title)],
    [t('p.packaging'), l(product.pack)],
    [t('p.reference'), product.sku],
  ]
  return (
    <section className="border-t border-neutral-400 py-[clamp(4.5rem,10vw,9rem)]">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Eyebrow index="01">{t('p.highlights')}</Eyebrow>
          <h2 data-split className="display mt-6 text-h2">
            {t('p.why')}
          </h2>
          <ol className="mt-10">
            {product.features.map(l).map((f, i) => (
              <li key={f} data-reveal className="flex gap-6 border-t border-neutral-400 py-6">
                <span className="pt-1.5 font-mono text-[0.8rem] text-neutral-500">{pad(i + 1)}</span>
                <span className="text-lead">{f}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow index="02">{t('p.specs')}</Eyebrow>
          <dl className="mt-10">
            {sheet.map(([label, value]) => (
              <div key={label} data-reveal className="flex items-baseline gap-4 border-t border-neutral-400 py-4">
                <dt className="shrink-0 text-neutral-550">{label}</dt>
                <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-neutral-400" />
                <dd className="text-end font-medium tracking-[-0.01em]"><bdi>{value}</bdi></dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="mt-8 flex flex-wrap gap-2">
            <Button variant="dark" href="#" onClick={(e) => e.preventDefault()}>
              {t('p.datasheet')}
            </Button>
            <Button variant="outline" href={brand.website} target="_blank" rel="noreferrer" icon={<External className="size-4" />}>
              {t('p.website', { brand: brand.short ?? brand.name })}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Shelf({ eyebrow, title, to, cta, items }) {
  return (
    <section className="pb-[clamp(4.5rem,10vw,9rem)]">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-neutral-400 pt-10">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 data-split className="display mt-5 text-h2">
              {title}
            </h2>
          </div>
          <Button data-reveal to={to} variant="outline">
            {cta}
          </Button>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} data-reveal />
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandBanner({ brand }) {
  const { t, l } = useI18n()
  return (
    <section className="px-2 pb-2 md:px-3 md:pb-3">
      <TLink
        to={`/brands/${brand.slug}`}
        data-theme-section="dark"
        className="group relative grid items-center gap-8 overflow-hidden rounded-[1.5rem] bg-neutral-800 p-6 text-neutral-100 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-10 lg:p-14"
      >
        <span className="rounded-[1rem] bg-neutral-700 p-2 transition-transform duration-700 ease-osmo group-hover:-rotate-2 group-hover:scale-[1.02]">
          <BrandVisual brand={brand} className="rounded-[0.7rem] text-[1.1rem]" />
        </span>
        <span>
          <span className="eyebrow text-neutral-500">{t('p.partner')}</span>
          <span className="display mt-5 block text-[clamp(2.4rem,5vw,5.5rem)] leading-[0.92] tracking-[-0.05em]">
            {t('p.explore', { brand: brand.name })}
          </span>
          <span className="mt-5 block max-w-[30em] text-neutral-400">{l(brand.description)}</span>
          <span className="mt-8 inline-flex items-center gap-3 text-[1.05rem]">
            <ArrowChip className="bg-volt text-neutral-800" />
            {t('p.view', { brand: brand.short ?? brand.name })}
          </span>
        </span>
      </TLink>
    </section>
  )
}
