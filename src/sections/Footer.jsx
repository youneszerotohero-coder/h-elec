import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/scroll'
import { TLink } from '../transition/PageTransition'
import { useI18n } from '../i18n/I18n'
import { LangSegment } from '../components/LangSwitch'
import { useQuote } from '../context/QuoteContext'
import { menu, site, socials } from '../data/content'
import Button from '../components/Button'
import { Wordmark } from '../components/Logo'
import { ArrowUp, Power, SocialIcon } from '../components/icons'

const letters = ['V', 'power', 'L', 'T', 'I', 'S']

export default function Footer() {
  const root = useRef(null)
  const { openQuote } = useQuote()

  // Giant wordmark: letters rise and untwist as the footer scrolls in
  useGSAP(
    () => {
      const els = gsap.utils.toArray('[data-letter]')
      gsap.fromTo(
        els,
        { yPercent: 105, rotate: (i) => [-18, 12, -8, 10, -14, 16][i] },
        {
          yPercent: 0,
          rotate: 0,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-footer-logo]', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
        },
      )
    },
    { scope: root },
  )

  const { t, l } = useI18n()
  const toTop = () => (getLenis() ? getLenis().scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))

  const columns = [
    { title: t('footer.products'), links: [...menu.products, ...menu.productsSmall] },
    { title: t('footer.company'), links: menu.explore },
  ]

  return (
    <footer ref={root} data-theme-section="dark" className="mx-2 mb-2 overflow-hidden rounded-[1.5rem] bg-neutral-800 text-neutral-200 md:mx-3 md:mb-3">
      <div className="container-x pt-[clamp(4rem,8vw,7rem)]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="text-[2.6rem]" />
            <p className="mt-6 max-w-[22em] text-neutral-400">
              {t('footer.blurb')}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Button onClick={(e) => openQuote(null, e.currentTarget)}>{t('nav.getQuote')}</Button>
              <Button variant="gray" pill href={site.phoneHref}>
                {t('footer.callUs')}
              </Button>
            </div>
            <LangSegment className="mt-6" />
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="eyebrow text-neutral-500">{col.title}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <TLink to={link.href} className="text-neutral-300 transition-colors hover:text-white">
                      <span className="link-line">{l(link.label)}</span>
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="eyebrow text-neutral-500">{t('footer.contact')}</p>
            <address className="mt-6 flex flex-col gap-4 text-neutral-300 not-italic">
              <span>
                {site.address.map((line) => (
                  <span key={line.en} className="block">
                    {l(line)}
                  </span>
                ))}
              </span>
              <span className="flex flex-col gap-1">
                <a href={site.phoneHref} className="w-fit hover:text-white">
                  <span dir="ltr" className="link-line">{site.phone}</span>
                </a>
                <a href={`mailto:${site.email}`} className="w-fit hover:text-white">
                  <span className="link-line">{site.email}</span>
                </a>
              </span>
              <span className="text-neutral-500">{l(site.hours)}</span>
            </address>
            <div className="mt-6 flex gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-full bg-neutral-700 transition-[background-color,border-radius] duration-300 ease-osmo hover:rounded-[0.375rem] hover:bg-neutral-600"
                >
                  <SocialIcon name={s.icon} className="size-[1.1rem]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          data-footer-logo
          dir="ltr"
          aria-hidden="true"
          className="mt-[clamp(4rem,9vw,8rem)] flex items-end justify-between overflow-hidden px-[0.03em] text-[min(20vw,20rem)] leading-[0.74] font-[820] tracking-[-0.05em] text-neutral-100 [font-stretch:118%]"
        >
          {letters.map((letter, i) => (
            <span key={i} data-letter className="inline-block origin-bottom pb-[0.02em]">
              {letter === 'power' ? <Power className="h-[0.72em] w-[0.72em] text-volt" strokeWidth={4.4} /> : letter}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral-600 py-6 text-[0.9rem] text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>
            {t('footer.rights', { year: new Date().getFullYear(), name: site.legalName })}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-200">
              {t('footer.legal')}
            </a>
            <a href="#" className="hover:text-neutral-200">
              {t('footer.privacy')}
            </a>
          </div>
          <button type="button" onClick={toTop} className="group flex items-center gap-2 hover:text-neutral-200">
            {t('footer.top')}
            <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-neutral-700">
              <ArrowUp className="size-4 transition-transform duration-500 ease-osmo group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
