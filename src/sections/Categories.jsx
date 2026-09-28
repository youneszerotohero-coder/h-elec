import { categories } from '../data/content'
import { cx } from '../lib/cx'
import { TLink } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { Badge, SectionHead } from '../components/Section'
import Button, { ArrowChip } from '../components/Button'
import ProductArt, { artTheme } from '../components/ProductArt'

export default function Categories() {
  const { t } = useI18n()
  return (
    <section id="products" className="pb-[clamp(6rem,12vw,11rem)]">
      <div className="container-x">
        <SectionHead
          index="02"
          eyebrow={t('cat.eyebrow')}
          title={t('cat.title')}
          aside={
            <>
              <p>{t('cat.aside')}</p>
              <Button to="/products" variant="dark" className="mt-7">
                {t('cat.browse')}
              </Button>
            </>
          }
        />

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category: c, index, featured }) {
  const { t, l, num } = useI18n()
  return (
    <TLink
      to={`/products?category=${c.slug}`}
      data-reveal
      aria-label={t('cat.browseAria', { title: l(c.title) })}
      style={artTheme(c.theme)}
      className={cx(
        'group relative flex min-h-[24rem] flex-col overflow-hidden rounded-[1rem] p-5 text-start md:p-6',
        featured && 'md:col-span-2 lg:min-h-[30rem]',
      )}
    >
      {/* hover tint + blueprint grid */}
      <span aria-hidden="true" className="absolute inset-0 bg-current opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]" />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]"
        style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '2.5rem 2.5rem',
        }}
      />

      <span className="relative flex items-start justify-between">
        <span className="eyebrow opacity-60">{String(index + 1).padStart(2, '0')}</span>
        <ArrowChip className="bg-current/10 group-hover:bg-volt group-hover:text-neutral-800" />
      </span>

      <ProductArt
        type={c.art}
        className={cx(
          'relative mx-auto my-6 w-[68%] max-w-[15rem] transition-transform duration-700 ease-osmo group-hover:-rotate-3 group-hover:scale-[1.07]',
          featured && 'lg:absolute lg:top-1/2 lg:end-[5%] lg:my-0 lg:w-[48%] lg:max-w-[28rem] lg:-translate-y-1/2',
        )}
      />

      <span className="relative mt-auto block">
        <span className="eyebrow block opacity-60">{t('common.references', { n: num(c.refs) })}</span>
        <span className="display mt-3 flex items-center gap-2.5 text-h3">
          {l(c.title)}
          {c.badge && <Badge>{l(c.badge)}</Badge>}
        </span>
        {featured && <span className="mt-3 block max-w-[22em] opacity-70">{l(c.text)}</span>}
        <span className="mt-5 flex flex-wrap gap-1.5">
          {c.items.map((item) => (
            <span key={item.en} className="rounded-full px-2.5 py-1 text-[0.82rem] shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_24%,transparent)]">
              {l(item)}
            </span>
          ))}
        </span>
      </span>
    </TLink>
  )
}
