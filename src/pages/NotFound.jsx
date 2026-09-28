import { useRef } from 'react'
import Page, { useIntro } from '../components/Page'
import Button from '../components/Button'
import { Power } from '../components/icons'
import { useI18n } from '../i18n/I18n'

export default function NotFound() {
  const root = useRef(null)
  const { t } = useI18n()
  useIntro(root, (tl) => tl.from('[data-404]', { yPercent: 100, rotate: (i) => [-12, 180, 12][i], autoAlpha: 0, stagger: 0.08, duration: 1.4 }, 0))

  return (
    <Page title={t('tr.notFound')}>
      <section ref={root} className="container-x flex min-h-[92svh] flex-col items-center justify-center pt-[calc(4.625rem+2rem)] pb-20 text-center">
        <p data-intro className="eyebrow text-neutral-550">
          {t('nf.eyebrow')}
        </p>
        <h1 aria-label="404" dir="ltr" className="mt-6 flex items-center text-[clamp(6rem,22vw,20rem)] leading-[0.85] font-[820] tracking-[-0.05em] [font-stretch:118%]">
          <span data-404 className="inline-block">4</span>
          <span data-404 className="inline-block text-spark">
            <Power className="h-[0.74em] w-[0.74em]" strokeWidth={4.4} />
          </span>
          <span data-404 className="inline-block">4</span>
        </h1>
        <p data-intro className="mt-8 max-w-[26em] text-lead text-neutral-550">
          {t('nf.text')}
        </p>
        <div data-intro className="mt-9 flex flex-wrap justify-center gap-2">
          <Button size="lg" to="/">
            {t('nf.home')}
          </Button>
          <Button size="lg" variant="outline" to="/products">
            {t('nf.catalogue')}
          </Button>
        </div>
      </section>
    </Page>
  )
}
