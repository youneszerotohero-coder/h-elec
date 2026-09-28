import { useState } from 'react'
import { useQuote } from '../context/QuoteContext'
import { useI18n } from '../i18n/I18n'
import { sectors } from '../data/content'
import { SectionHead } from '../components/Section'
import Button from '../components/Button'

// Line drawings (200×160). Every path gets pathLength=1 so it can be traced in.
const drawings = {
  house: [
    'M8 150H192',
    'M40 150V82L100 36l60 46v68',
    'M28 90 100 32l72 58',
    'M88 150v-38h24v38',
    'M54 96h24v20H54zM122 96h24v20h-24z',
    'M132 56V38h13v28',
    'M186 150V58m-8 7h16M186 64c-14 6-26 10-40 12',
  ],
  tower: [
    'M8 150H192',
    'M56 150V22h62v128',
    'M87 22V6',
    'M64 38h46M64 54h46M64 70h46M64 86h46M64 102h46M64 118h46M64 134h46',
    'M87 30v112',
    'M118 150V72h48v78',
    'M126 88h32M126 104h32M126 120h32M126 136h32',
  ],
  factory: [
    'M8 150H192',
    'M18 150V84l32-22v22l32-22v22l32-22v22h44v66',
    'M146 84V34h15v50',
    'M154 24c8-8 18-4 22-12M162 16c6-5 12-2 16-7',
    'M38 150v-26h22v26',
    'M78 104h22v16H78zM114 104h22v16h-22zM150 104h14v16h-14z',
  ],
  pylon: [
    'M8 150H192',
    'M70 150 92 18h16l22 132',
    'M58 48h84M66 78h68',
    'M80 126l40-30M120 126 80 96M84 96l32-26M116 96 84 70M88 70l24-20M112 70 88 50',
    'M58 48v9M142 48v9M66 78v9M134 78v9',
    'M0 60c26 7 42 4 58-3M142 57c16 7 32 10 58 3M0 92c26 6 48 3 66-5M134 87c18 8 40 11 66 5',
  ],
}

function Drawing({ type }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-auto w-full">
      <g stroke="currentColor" strokeWidth="1.4" opacity=".28">
        {drawings[type].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {/* Highlight layer traces in when the panel opens */}
      <g className="stroke-volt" strokeWidth="1.8">
        {drawings[type].map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            strokeDasharray="1"
            style={{ '--i': i }}
            className="[stroke-dashoffset:1] [transition:stroke-dashoffset_0.5s_var(--ease-osmo)] group-data-[active=true]/sector:[stroke-dashoffset:0] group-data-[active=true]/sector:[transition:stroke-dashoffset_1.6s_var(--ease-out-expo)_calc(0.25s+var(--i)*0.08s)]"
          />
        ))}
      </g>
    </svg>
  )
}

export default function Sectors() {
  const [active, setActive] = useState(0)
  const { openQuote } = useQuote()
  const { t, l } = useI18n()

  return (
    <section id="solutions" className="py-[clamp(6rem,12vw,11rem)]">
      <div className="container-x">
        <SectionHead
          index="04"
          eyebrow={t('sectors.eyebrow')}
          title={t('sectors.title')}
          aside={t('sectors.aside')}
        />

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] flex flex-col gap-3 lg:h-[clamp(32rem,38vw,40rem)] lg:flex-row">
          {sectors.map((s, i) => (
            <article
              key={s.art}
              data-reveal
              data-active={active === i}
              tabIndex={0}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group/sector relative flex flex-col overflow-hidden rounded-[1rem] bg-neutral-300 p-5 text-neutral-800 outline-offset-4 transition-[flex-grow,background-color,color] duration-700 ease-osmo data-[active=true]:bg-neutral-800 data-[active=true]:text-neutral-100 md:p-6 lg:min-h-0 lg:grow lg:basis-0 lg:data-[active=true]:grow-[2.7]"
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="eyebrow opacity-60">{String(i + 1).padStart(2, '0')}</span>
                <span className="eyebrow hidden opacity-0 transition-opacity duration-500 group-data-[active=true]/sector:opacity-60 lg:block">
                  {t('sectors.types', { n: s.tags.length })}
                </span>
              </div>

              <div className="pointer-events-none relative mt-4 ms-auto w-[62%] max-w-[18rem] transition-[inset-inline-end,width] duration-700 ease-osmo lg:absolute lg:top-14 lg:end-[-12%] lg:mt-0 lg:w-[max(105%,15rem)] lg:max-w-none lg:group-data-[active=true]/sector:end-[3%] lg:group-data-[active=true]/sector:w-[min(52%,25rem)]">
                <Drawing type={s.art} />
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="display text-[clamp(1.35rem,1.65vw,2.3rem)] leading-none tracking-[-0.035em] whitespace-nowrap">{l(s.title)}</h3>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-osmo lg:grid-rows-[0fr] lg:group-data-[active=true]/sector:grid-rows-[1fr]">
                <div className="min-h-0 overflow-hidden">
                <div className="w-full transition-[opacity,translate] duration-500 ease-osmo lg:w-[24rem] lg:translate-y-4 lg:opacity-0 lg:group-data-[active=true]/sector:translate-y-0 lg:group-data-[active=true]/sector:opacity-100 lg:group-data-[active=true]/sector:delay-200">
                  <p className="mt-4 max-w-[26em] opacity-75">{l(s.text)}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag.en} className="rounded-full px-2.5 py-1 text-[0.82rem] shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_26%,transparent)]">
                        {l(tag)}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="mt-6"
                    onClick={(e) => openQuote({ details: t('sectors.prefill', { title: l(s.title) }) }, e.currentTarget)}
                  >
                    {t('sectors.cta')}
                  </Button>
                </div>
                </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
