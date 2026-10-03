import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ui } from './ui'

/*
  Three languages. Interface strings live in ./ui.js (t('key')); content fields in src/data are
  written as { en, fr, ar } objects and resolved with l(field). Arabic switches the page to RTL.
*/

export const LANGS = {
  en: { label: 'English', short: 'EN', dir: 'ltr', locale: 'en-US' },
  fr: { label: 'Français', short: 'FR', dir: 'ltr', locale: 'fr-FR' },
  ar: { label: 'العربية', short: 'ع', dir: 'rtl', locale: 'en-US' }, // Western digits, as used across the Maghreb
}

const STORAGE_KEY = 'helec-lang'

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGS[saved]) return saved
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || 'en').slice(0, 2)
  return LANGS[nav] ? nav : 'en'
}

function applyToDocument(lang) {
  document.documentElement.lang = lang
  document.documentElement.dir = LANGS[lang].dir
}

// Resolved once at startup so the very first render is already in the right language/direction
const initial = detect()
applyToDocument(initial)

const pickFrom = (lang) => (value) =>
  value && typeof value === 'object' && !Array.isArray(value) && 'en' in value ? (value[lang] ?? value.en) : value

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initial)

  const setLang = useCallback((next) => {
    if (!LANGS[next]) return
    applyToDocument(next) // before React re-renders, so layout is measured in the new direction
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    setLangState(next)
  }, [])

  const value = useMemo(() => {
    const l = pickFrom(lang)
    const t = (key, vars) => {
      const entry = ui[key]
      if (!entry) {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`)
        return key
      }
      let s = l(entry)
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
      return s
    }
    const nf = new Intl.NumberFormat(LANGS[lang].locale)
    return { lang, dir: LANGS[lang].dir, setLang, t, l, num: (n) => nf.format(n) }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
