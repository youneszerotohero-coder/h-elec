import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useFlipFilter } from '../lib/useFlipFilter'
import { scrollToTarget } from '../lib/scroll'
import { useQuote } from '../context/QuoteContext'
import { TLink } from '../transition/PageTransition'
import { brandBySlug, brands, categories } from '../data/content'
import { productsByBrand } from '../data/products'
import Page, { Breadcrumbs, SplitWords, useIntro } from '../components/Page'
import { FilterPills, ProductCard } from '../components/Catalog'
import BrandVisual from '../components/BrandVisual'
import { Eyebrow } from '../components/Section'
import Button from '../components/Button'
import { ArrowDown, External } from '../components/icons'
import CTA from '../sections/CTA'
import NotFound from './NotFound'
import { useI18n } from '../i18n/I18n'

export default function BrandPage() {
  const { slug } = useParams()
  const brand = brandBySlug(slug)
  if (!brand) return <NotFound />
  const next = brands[(brands.indexOf(brand) + 1) % brands.length]

  return (
    <Page title={brand.name}>
      <BrandHero brand={brand} />
      <Range brand={brand} />
      <Perks brand={brand} />
      <NextBrand brand={next} />
      <CTA />
    </Page>
  )
}

function BrandHero({ brand }) {
  const root = useRef(null)
  const { openQuote } = useQuote()
  const count = productsByBrand(brand.slug).length
  const { t, l, num } = useI18n()

  // The logo card is "placed" on the page: it drops in with a slight twist
  useIntro(root, (tl) =>
    tl.from('[data-brand-card]', { y: '6rem', rotate: 5, scale: 0.92, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.1),
  )

  const facts = [
    [t('b.founded'), brand.founded],
    [t('b.hq'), l(brand.hq)],
    [t('b.speciality'), l(brand.category)],
    [t('b.inCatalogue'), count === 1 ? t('bt.product1') : t('bt.products', { n: num(count) })],
  ]

  return (
    <section ref={root} className="pt-[calc(4.625rem+clamp(2.5rem,9svh,6.5rem))] pb-[clamp(4rem,9vw,8rem)]">
      <div className="container-x">
        <Breadcrumbs items={[[t('common.brands'), '/brands'], [brand.name]]} />

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <p data-intro className="eyebrow flex items-center gap-2 text-neutral-550">
              <span className="size-2 rounded-full" style={{ backgroundColor: brand.color }} />
              {t('b.partner', { country: l(brand.country) })}
            </p>
            <h1 className="display mt-6 text-[clamp(3.2rem,8.2vw,10.5rem)] leading-[0.88] tracking-[-0.055em]">
              <SplitWords text={brand.name} />
            </h1>
            <p data-intro className="mt-8 max-w-[32em] text-lead text-neutral-550">
              {l(brand.description)}
            </p>
            <div data-intro className="mt-9 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => scrollToTarget('#range')} icon={<ArrowDown className="size-5" />}>
                {t('b.browse', { n: num(count) })}
              </Button>
              <Button size="lg" variant="outline" onClick={(e) => openQuote({ brands: [brand.name] }, e.currentTarget)}>
                {t('common.requestQuote')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div data-brand-card className="rounded-[1.25rem] bg-neutral-800 p-2.5 text-neutral-100 shadow-[0_3rem_5rem_-2.5rem_rgba(22,21,19,0.6)]">
              <BrandVisual brand={brand} className="rounded-[0.8rem] text-[1.1rem]" />
              <dl className="grid grid-cols-2">
                {facts.map(([label, value], i) => (
                  <div key={label} className={`px-4 pt-5 pb-4 ${i % 2 ? 'border-s border-neutral-600' : ''} ${i > 1 ? 'border-t border-neutral-600' : ''}`}>
                    <dt className="eyebrow text-neutral-500">{label}</dt>
                    <dd className="mt-2.5 text-[1.05rem] leading-snug tracking-[-0.02em]"><bdi>{value}</bdi></dd>
                  </div>
                ))}
              </dl>
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-[0.6rem] bg-neutral-700 px-4 py-3.5 text-[0.95rem] transition-colors hover:bg-neutral-600"
              >
                {t('b.website')}
                <External className="size-4 transition-transform duration-500 ease-osmo group-hover:-translate-y-0.5 group-hover:translate-x-[calc(var(--dir)*0.125rem)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Range({ brand }) {
  const list = productsByBrand(brand.slug)
  const [filter, setFilter] = useState('all')
  const grid = useRef(null)
  const capture = useFlipFilter(grid, [filter])
  const { t, l, num } = useI18n()
  const used = categories.filter((c) => list.some((p) => p.category === c.slug))
  const options = [
    { value: 'all', label: t('b.all'), count: list.length },
    ...used.map((c) => ({ value: c.slug, label: l(c.title), count: list.filter((p) => p.category === c.slug).length })),
  ]

  return (
    <section id="range" className="scroll-mt-24 pb-[clamp(5rem,11vw,10rem)]">
      <div className="container-x">
        <div className="grid gap-8 border-t border-neutral-400 pt-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="01">{t('b.inStock')}</Eyebrow>
            <h2 data-split className="display mt-6 text-h2">
              {t('b.range', { name: brand.short ?? brand.name })}
            </h2>
          </div>
          <div data-reveal className="lg:col-span-5 lg:justify-self-end">
            {used.length > 1 && (
              <FilterPills
                options={options}
                value={filter}
                onChange={(v) => {
                  if (v === filter) return
                  capture()
                  setFilter(v)
                }}
              />
            )}
          </div>
        </div>

        <div ref={grid} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} data-reveal hidden={filter !== 'all' && p.category !== filter} />
          ))}
        </div>

        <p data-reveal className="mt-8 text-neutral-550">
          {t('b.selection', { name: brand.name })}{' '}
          <TLink to={`/products?brand=${brand.slug}`} className="text-neutral-800 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-800">
            {t('b.seeCatalogue')}
          </TLink>
        </p>
      </div>
    </section>
  )
}

function Perks({ brand }) {
  const { t } = useI18n()
  const perks = [1, 2, 3].map((i) => [t(`b.perk${i}.title`), t(`b.perk${i}.text`, { name: i === 3 ? (brand.short ?? brand.name) : brand.name })])
  return (
    <section className="pb-[clamp(5rem,11vw,10rem)]">
      <div className="container-x grid gap-3 md:grid-cols-3">
        {perks.map(([title, text], i) => (
          <div key={title} data-reveal className="flex min-h-[15rem] flex-col rounded-[1rem] bg-neutral-300/70 p-6 md:p-7">
            <span className="font-mono text-[0.8rem] text-neutral-500">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display mt-auto text-h3">{title}</h3>
            <p className="mt-3 max-w-[26em] text-neutral-550">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function NextBrand({ brand }) {
  const { t } = useI18n()
  return (
    <TLink to={`/brands/${brand.slug}`} className="group relative block overflow-hidden border-y border-neutral-400">
      <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-neutral-800 transition-transform duration-700 ease-osmo group-hover:scale-y-100" />
      <span className="container-x relative flex items-center justify-between gap-8 py-[clamp(3rem,8vw,7rem)] transition-colors duration-500 group-hover:text-neutral-100">
        <span className="min-w-0">
          <span className="eyebrow block text-neutral-500">{t('b.next')}</span>
          <span className="display mt-5 block truncate text-[clamp(2.8rem,8.5vw,10.5rem)] leading-[0.9] tracking-[-0.055em] transition-transform duration-700 ease-osmo group-hover:translate-x-[calc(var(--dir)*0.75rem)]">
            <bdi>{brand.name}</bdi>
          </span>
        </span>
        <span className="w-[clamp(7rem,17vw,16rem)] shrink-0 rotate-3 rounded-[0.9rem] bg-neutral-800 p-1.5 shadow-[0_2rem_3rem_-1.5rem_rgba(22,21,19,0.5)] transition-transform duration-700 ease-osmo group-hover:-rotate-3 group-hover:scale-105 max-sm:hidden">
          <BrandVisual brand={brand} className="rounded-[0.6rem]" />
        </span>
      </span>
    </TLink>
  )
}
