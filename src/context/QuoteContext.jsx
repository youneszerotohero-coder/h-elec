import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const QuoteContext = createContext(null)
const STORAGE_KEY = 'helec-quote-list'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function QuoteProvider({ children }) {
  const [state, setState] = useState({ open: false, prefill: null, origin: null, id: 0 })
  // The quote list: products collected from the catalogue, sent along with the request
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable (private mode) — the list just won't persist */
    }
  }, [items])

  // `origin` is the element that was clicked — the modal grows out of it and shrinks back into it.
  const openQuote = useCallback((prefill = null, origin = null) => {
    setState((s) => ({ open: true, prefill, origin, id: s.id + 1 }))
  }, [])

  const closeQuote = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const addItem = useCallback((slug, qty = 1) => {
    setItems((list) => {
      const found = list.find((i) => i.slug === slug)
      return found ? list.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i)) : [...list, { slug, qty }]
    })
  }, [])
  const setQty = useCallback((slug, qty) => setItems((list) => list.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))), [])
  const removeItem = useCallback((slug) => setItems((list) => list.filter((i) => i.slug !== slug)), [])
  const clearItems = useCallback(() => setItems([]), [])

  const count = items.reduce((n, i) => n + i.qty, 0)

  const value = useMemo(
    () => ({ ...state, openQuote, closeQuote, items, count, addItem, setQty, removeItem, clearItems }),
    [state, openQuote, closeQuote, items, count, addItem, setQty, removeItem, clearItems],
  )

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export const useQuote = () => useContext(QuoteContext)
