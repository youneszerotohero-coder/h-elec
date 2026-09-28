import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { I18nProvider, useI18n } from './i18n/I18n'
import { QuoteProvider } from './context/QuoteContext'
import { TransitionProvider } from './transition/PageTransition'
import Navbar from './components/Navbar'
import QuoteModal from './components/QuoteModal'
import Home from './pages/Home'
import BrandsPage from './pages/BrandsPage'
import BrandPage from './pages/BrandPage'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import NotFound from './pages/NotFound'

function AppRoutes() {
  const location = useLocation()
  const { lang } = useI18n()
  // Keyed by path + language so moving between two brands (or switching language) remounts the page and
  // replays its entrance; query changes (catalogue filters) keep the page mounted.
  return (
    <Routes location={location} key={`${location.pathname}-${lang}`}>
      <Route path="/" element={<Home />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brands/:slug" element={<BrandPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <QuoteProvider>
          <TransitionProvider>
            <Navbar />
            <AppRoutes />
            <QuoteModal />
          </TransitionProvider>
        </QuoteProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
