# Voltis — electrical distributor website

React 19 + Vite + Tailwind CSS v4 + React Router, animated with GSAP (ScrollTrigger, SplitText, Flip, CustomEase) and Lenis smooth scroll.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/brands` | All brands, filterable by product family |
| `/brands/:slug` | Brand page — facts, its range, next-brand link |
| `/products` | Catalogue — category / brand / search filters, kept in the URL (`?category=lighting&brand=philips&q=led`) |
| `/products/:slug` | Product page — specs, add to quote list, related products |

Every internal link goes through `TLink` / `Button to="…"` (or `usePageTransition().go()`), which plays the page transition: the navbar widens and drops into a full-screen curtain showing the destination name, then retracts into the bar to reveal the new page.

## Languages — English, French, Arabic

The switch is in the navbar (`EN ▾`), in the menu and in the footer. The choice is remembered (`localStorage`); on a first visit the browser language decides. Changing language plays the same curtain as a page change, and the page comes back at the same scroll position. Arabic sets `<html dir="rtl">` and the whole layout mirrors.

- **Interface text** lives in `src/i18n/ui.js`: one entry per key, `{ en, fr, ar }`. Use it with `const { t } = useI18n()`, e.g. `t('p.moreFrom', { brand: 'Legrand' })`. A missing key logs a warning in dev.
- **Content** (brands, categories, products, testimonials) keeps its translations right in the data: any field can be `{ en, fr, ar }`, read with `l(field)`. Spec labels are translated once, in `specLabels` (`src/data/products.js`).
- **RTL:** use logical Tailwind classes (`ms-*`, `pe-*`, `start-*`, `end-*`, `text-start`) instead of left/right. Horizontal motion is multiplied by `var(--dir)` (1 or −1), and arrows with `data-flip` mirror automatically.
- Arabic uses Noto Kufi Arabic, a fallback font that only kicks in for Arabic glyphs. In Arabic, letter-spacing is removed and display line-heights are opened up (`src/index.css`, "Arabic typography").
- To add a language, add it to `LANGS` in `src/i18n/I18n.jsx` and add its key next to `en` / `fr` / `ar`. Missing entries fall back to English.

## Where things live

| What | File |
| --- | --- |
| Company details, brands, categories, home copy | `src/data/content.js` |
| Interface text in EN / FR / AR, language provider | `src/i18n/ui.js`, `src/i18n/I18n.jsx` |
| Language switches (navbar dropdown, segmented) | `src/components/LangSwitch.jsx` |
| Product catalogue (sample data) | `src/data/products.js` |
| Colours, fonts, type scale, easing | `src/index.css` (`@theme`) |
| Page transition + `TLink` | `src/transition/PageTransition.jsx` |
| Page shell, scroll reveals, page header | `src/components/Page.jsx` |
| Product / brand cards, filters, qty stepper | `src/components/Catalog.jsx` |
| Quote pop-up + quote list | `src/components/QuoteModal.jsx`, `src/context/QuoteContext.jsx` |
| Navbar + expanding menu | `src/components/Navbar.jsx` |
| Pages / home sections | `src/pages/*`, `src/sections/*` |

## Before going live

- Replace the placeholder name "Voltis", logo (`src/components/Logo.jsx`), phone, email, address and social links.
- **Products are sample data** — swap `src/data/products.js` for the client's real catalogue (or fetch it from an API). The SKUs are placeholder distributor references.
- Confirm the brand list and "official distributor" claims with the client; stats and testimonials are placeholders too.
- Have a native speaker proofread the French and Arabic copy (`src/i18n/ui.js`, and the `fr` / `ar` fields in `src/data/`).
- Connect the quote form: `submit()` in `QuoteModal.jsx` currently simulates a send — post `form` and `items` (the quote list) to a backend or email service.
- Brand logos in `src/assets/brands/` come from Wikimedia Commons; ideally swap them for the official files from each manufacturer's partner portal. Name the file after the brand's `slug` (`legrand.svg`, `chint.png`…) and it is picked up and size-balanced automatically.
- **Hosting:** it's a single-page app, so configure the host to serve `index.html` for every route (Netlify `_redirects`: `/* /index.html 200`, Vercel rewrites, or Nginx `try_files $uri /index.html`).
