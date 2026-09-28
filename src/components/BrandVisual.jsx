import { useState } from 'react'
import { cx } from '../lib/cx'

// Official logos live in src/assets/brands/<slug>.svg|png — drop a file in and it's picked up.
const files = import.meta.glob('../assets/brands/*.{svg,png,webp}', { eager: true, query: '?url', import: 'default' })

export const logoFor = (slug) =>
  files[`../assets/brands/${slug}.svg`] ?? files[`../assets/brands/${slug}.png`] ?? files[`../assets/brands/${slug}.webp`] ?? null

// Optical balancing: wide wordmarks shrink, compact marks grow, so every logo carries similar visual weight.
// Exposed as --logo-f (≈1 for a 3:1 logo) and measured from the image itself, so any new file just works.
const factors = new Map()
const factorOf = (img) => Math.min(1.25, Math.sqrt(3 / (img.naturalWidth / img.naturalHeight)))

export function BrandLogo({ brand, className = '' }) {
  const src = logoFor(brand.slug)
  const [f, setF] = useState(() => factors.get(src) ?? 1)
  const measure = (img) => {
    if (!img?.naturalWidth) return
    factors.set(src, factorOf(img))
    setF(factors.get(src))
  }
  if (!src) return <span className={cx('font-semibold tracking-[-0.03em] text-neutral-800', className)}>{brand.name}</span>
  return (
    <img
      src={src}
      alt={`${brand.name} logo`}
      draggable="false"
      ref={(img) => img?.complete && measure(img)}
      onLoad={(e) => measure(e.currentTarget)}
      style={{ '--logo-f': f }}
      className={cx('object-contain select-none', className)}
    />
  )
}

/** White tile with the brand's official logo centred on it. */
export default function BrandVisual({ brand, className = '' }) {
  return (
    <span className={cx('relative block aspect-[4/3] overflow-hidden bg-[#fbfaf7] text-neutral-800', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '12.5% 16.666%',
        }}
      />
      <span className="absolute top-[0.85em] end-[0.95em] font-mono text-[0.7em] leading-none opacity-45">{brand.code}</span>
      <span className="absolute inset-x-[11%] top-1/2 flex h-[46%] -translate-y-1/2 items-center justify-center transition-transform duration-700 ease-osmo group-hover:scale-[1.06]">
        <BrandLogo brand={brand} className="h-[calc(72%*var(--logo-f))] max-h-full w-auto max-w-full text-[1.8em]" />
      </span>
    </span>
  )
}
