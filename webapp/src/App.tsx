import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

import { ResponsiveApp, ThemedApp } from './components/app'
import { AppContainer } from './components/app/AppContainer'
import { AppLanguage } from './components/app/AppLanguage'
import { GlobalStyles } from './components/styles/GlobalStyles'
import { LoadingContext } from './contexts/LoadingContext'
import { ServiceWorker } from './contexts/ServiceWorkerContext'
import { ToastsContext } from './contexts/ToastsContext'
import { i18n } from './i18n/i18n'
import { AccountContext } from './wallet/AccountContext'
import { ConnectedWallet } from './wallet/ConnectedWalletContext'
import { SignerContext } from './wallet/SignerContext'

function App() {
  console.log('window.history', window.history)
  return (
    <div className="App">
      <ServiceWorker>
        <I18nextProvider i18n={i18n}>
          <AppLanguage>
            <ThemedApp>
              <ToastsContext>
                <LoadingContext>
                  <ConnectedWallet>
                    <SignerContext>
                      <AccountContext>
                        <GlobalStyles />
                        <ResponsiveApp>
                          <BrowserRouter>
                            <AppContainer></AppContainer>
                          </BrowserRouter>
                        </ResponsiveApp>
                      </AccountContext>
                    </SignerContext>
                  </ConnectedWallet>
                </LoadingContext>
              </ToastsContext>
            </ThemedApp>
          </AppLanguage>
        </I18nextProvider>
      </ServiceWorker>
    </div>
  )
}

export default App
