import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'
import { AppProviders } from '../shared/providers/AppProviders'
import './index.css'
import '../libs/supabase'

function initApp() {
  const container = document.getElementById('root') as HTMLElement | null

  if (!container) {
    throw new Error(
      "Root element with ID 'root' was not found in the document.",
    )
  }

  const root = createRoot(container)

  root.render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  )
}

initApp()
