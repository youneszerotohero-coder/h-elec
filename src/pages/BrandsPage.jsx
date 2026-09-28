import { useRef, useState } from 'react'
import { useFlipFilter } from '../lib/useFlipFilter'
import { brands, categories } from '../data/content'
import { products } from '../data/products'
import Page, { PageHero } from '../components/Page'
import { BrandTile, FilterPills } from '../components/Catalog'
import CTA from '../sections/CTA'
import { useI18n } from '../i18n/I18n'

const brandHas = (brand, category) => products.some((p) => p.brand === brand.slug && p.category === category)

export default function BrandsPage() {
  const [filter, setFilter] = useState('all')
  const grid = useRef(null)
  const capture = useFlipFilter(grid, [filter])
  const { t, l, num } = useI18n()

  const options = [
    { value: 'all', label: t('bp.all'), count: brands.length },
    ...categories
      .map((c) => ({ value: c.slug, label: l(c.title), count: brands.filter((b) => brandHas(b, c.slug)).length }))
      .filter((o) => o.count > 0),
  ]

  const choose = (value) => {
    if (value === filter) return
    capture()
    setFilter(value)
  }

  return (
    <Page title={t('common.brands')}>
      <PageHero
        index={String(brands.length)}
        eyebrow={t('common.brands')}
        title={t('bp.title')}
        lead={t('bp.lead')}
        aside={
          <dl className="grid grid-cols-3 gap-6 text-start">
            {[
              [num(brands.length), t('bp.stat.brands')],
              [num(new Set(brands.map((b) => b.country.en)).size), t('bp.stat.countries')],
              [`${num(40)}+`, t('bp.stat.request')],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-neutral-400 pt-3">
                <dt className="eyebrow text-neutral-500">{label}</dt>
                <dd className="display mt-3 text-[clamp(2rem,3vw,3.25rem)] leading-none tracking-[-0.05em]">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section className="pb-[clamp(5rem,11vw,10rem)]">
        <div className="container-x">
          <div data-reveal>
            <FilterPills options={options} value={filter} onChange={choose} />
          </div>
          <div ref={grid} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((b) => (
              <BrandTile key={b.slug} brand={b} data-reveal hidden={filter !== 'all' && !brandHas(b, filter)} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </Page>
  )
}
