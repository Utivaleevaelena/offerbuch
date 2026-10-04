import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { OfferProvider } from './state/OfferContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OfferProvider>
      <App />
    </OfferProvider>
  </StrictMode>,
)
