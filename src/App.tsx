import { Fragment, useId, useState } from 'react'
import { useI18n } from './i18n/I18nContext'
import { Closing, Footer } from './components/Closing'
import { Dialog } from './components/Dialog'
import { Goal } from './components/Goal'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MobileOfferBar } from './components/MobileOfferBar'
import { OfferPanel } from './components/OfferSummary'
import { RecommendedSet } from './components/RecommendedSet'
import { SendOfferDialog } from './components/SendOfferDialog'
import { StageSection } from './components/StageSection'
import { Toast } from './components/Toast'

export default function App() {
  const [sendOpen, setSendOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTitleId = useId()
  const { proposal, t } = useI18n()

  const openSend = () => {
    setDrawerOpen(false)
    setSendOpen(true)
  }

  return (
    <>
      <a href="#oferta" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-ivory">
        {t.skipToConfigurator}
      </a>
      <Header />
      <main>
        <Hero />
        <Goal />

        <div id="oferta" className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:px-8 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
          <div className="min-w-0 divide-y divide-line/80">
            {proposal.stages.map((stage) => (
              <Fragment key={stage.id}>
                <StageSection stage={stage} />
                {proposal.recommended?.afterStage === stage.id && <RecommendedSet />}
              </Fragment>
            ))}
            <Closing onSend={openSend} />
          </div>

          <aside aria-label={t.yourOffer} className="hidden lg:block">
            <div className="sticky top-28 py-16">
              <div className="card max-h-[calc(100dvh-9rem)] overflow-y-auto p-6">
                <OfferPanel onSend={openSend} headingId="offer-panel-title" />
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      <MobileOfferBar onOpen={() => setDrawerOpen(true)} expanded={drawerOpen} />
      <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} labelledBy={drawerTitleId} variant="drawer">
        <div className="p-6 pt-7">
          <OfferPanel onSend={openSend} headingId={drawerTitleId} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </Dialog>

      <SendOfferDialog open={sendOpen} onClose={() => setSendOpen(false)} />
      <Toast />
    </>
  )
}
