import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/noto-kufi-arabic'
import 'lenis/dist/lenis.css'
import './index.css'
import { initSmoothScroll } from './lib/scroll'
import App from './App.jsx'

// Page transitions handle scroll position themselves
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
initSmoothScroll()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
