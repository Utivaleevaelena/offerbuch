import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { I18nProvider } from './i18n/I18nContext'
import { OfferProvider } from './state/OfferContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <OfferProvider>
        <App />
      </OfferProvider>
    </I18nProvider>
  </StrictMode>,
)
