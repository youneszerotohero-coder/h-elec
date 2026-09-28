import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { TLink } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { brands } from '../data/content'
import { SectionHead } from '../components/Section'
import Button, { ArrowChip } from '../components/Button'
import BrandVisual from '../components/BrandVisual'

const pad = (n) => String(n).padStart(2, '0')

export default function Brands() {
  const root = useRef(null)
  const preview = useRef(null)
  const reel = useRef(null)
  const [active, setActive] = useState(0)
  const { t, l } = useI18n()

  // Floating preview that trails the cursor and tilts with horizontal speed
  useGSAP(
    () => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return
      const list = root.current.querySelector('[data-brand-list]')
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0.6 })
      const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' })
      const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' })
      const rTo = gsap.quickTo(preview.current, 'rotation', { duration: 0.9, ease: 'power3' })
      let lastX = 0
      let settle

      const move = (e) => {
        xTo(e.clientX)
        yTo(e.clientY)
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.8))
        lastX = e.clientX
        settle?.kill()
        settle = gsap.delayedCall(0.12, () => rTo(0))
      }
      const enter = (e) => {
        lastX = e.clientX
        gsap.set(preview.current, { x: e.clientX, y: e.clientY })
        gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'osmo', overwrite: 'auto' })
      }
      const leave = () => gsap.to(preview.current, { autoAlpha: 0, scale: 0.6, duration: 0.45, ease: 'osmo', overwrite: 'auto' })

      list.addEventListener('pointermove', move)
      list.addEventListener('pointerenter', enter)
      list.addEventListener('pointerleave', leave)
      return () => {
        list.removeEventListener('pointermove', move)
        list.removeEventListener('pointerenter', enter)
        list.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root },
  )

  useGSAP(() => gsap.to(reel.current, { yPercent: (-100 / brands.length) * active, duration: 0.75, ease: 'osmo' }), {
    dependencies: [active],
    scope: root,
  })

  return (
    <section
      ref={root}
      id="brands"
      data-theme-section="dark"
      className="relative mx-2 rounded-[1.5rem] bg-neutral-800 py-[clamp(5rem,11vw,10rem)] text-neutral-200 md:mx-3"
    >
      <div className="container-x">
        <SectionHead
          dark
          index="03"
          eyebrow={t('brandsHome.eyebrow')}
          title={t('brandsHome.title')}
          aside={
            <>
              <p>{t('brandsHome.aside')}</p>
              <Button to="/brands" variant="light" className="mt-7">
                {t('brandsHome.all')}
              </Button>
            </>
          }
        />

        <div className="mt-[clamp(3rem,6vw,5.5rem)]">
          <div className="eyebrow hidden grid-cols-[3.5rem_minmax(0,1.35fr)_minmax(0,1.25fr)_minmax(0,0.55fr)_10rem] gap-x-4 pb-4 text-neutral-500 md:grid">
            <span>#</span>
            <span>{t('brandsHome.col.brand')}</span>
            <span>{t('brandsHome.col.speciality')}</span>
            <span>{t('brandsHome.col.origin')}</span>
            <span className="text-end">{t('brandsHome.col.explore')}</span>
          </div>

          <ul data-brand-list className="border-t border-neutral-600">
            {brands.map((b, i) => (
              <li key={b.name} data-reveal className="border-b border-neutral-600">
                <TLink
                  to={`/brands/${b.slug}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 py-5 text-start md:grid-cols-[3.5rem_minmax(0,1.35fr)_minmax(0,1.25fr)_minmax(0,0.55fr)_10rem] md:py-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-[-1px] -right-3 -left-3 origin-bottom scale-y-0 rounded-[0.5rem] bg-neutral-700 transition-transform duration-500 ease-osmo group-hover:scale-y-100 md:-right-5 md:-left-5"
                  />
                  <span className="relative font-mono text-[0.8rem] text-neutral-500">{pad(i + 1)}</span>
                  <span className="display relative flex items-center gap-[0.35em] text-[clamp(1.6rem,3.1vw,3.4rem)] leading-none tracking-[-0.045em] transition-transform duration-500 ease-osmo md:group-hover:translate-x-[calc(var(--dir)*0.75rem)]">
                    <span className="size-[0.26em] shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="truncate">{b.name}</span>
                  </span>
                  <span className="relative hidden text-neutral-400 md:block">{l(b.specialty)}</span>
                  <span className="relative hidden font-mono text-[0.8rem] text-neutral-400 uppercase md:block">{l(b.country)}</span>
                  <span className="relative flex items-center justify-end gap-3">
                    <span className="hidden -translate-x-[calc(var(--dir)*0.5rem)] text-[0.95rem] opacity-0 transition-[opacity,translate] duration-500 ease-osmo group-hover:translate-x-0 group-hover:opacity-100 lg:inline">
                      {t('common.viewBrand')}
                    </span>
                    <ArrowChip className="bg-neutral-700 group-hover:bg-volt group-hover:text-neutral-800" />
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cursor preview */}
      <div ref={preview} aria-hidden="true" className="pointer-events-none invisible fixed top-0 left-0 z-30 w-[clamp(15rem,19vw,21rem)] opacity-0">
        <div className="rounded-[0.6rem] bg-neutral-600 p-[0.45rem] shadow-[0_2rem_4rem_-1rem_rgba(0,0,0,0.6)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem]">
            <div ref={reel} className="absolute inset-x-0 top-0" style={{ height: `${brands.length * 100}%` }}>
              {brands.map((b) => (
                <div key={b.name} style={{ height: `${100 / brands.length}%` }} className="text-[0.95rem]">
                  <BrandVisual brand={b} className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-1.5 pt-2.5 pb-1.5 text-[0.85rem] text-neutral-100">
            <span>{l(brands[active].category)}</span>
            <span className="eyebrow text-neutral-400">{t('common.viewBrand')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
