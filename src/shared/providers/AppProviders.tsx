import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '@shared/store/store'

export const AppProviders = ({ children }: PropsWithChildren) => (
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider>
          <ToastProvider
            toastProps={{
              timeout: 1000,
            }}
          />
          {children}
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
