import { Outlet } from 'react-router-dom'

import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'

export const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 p-4 container mx-auto">
      <Outlet />
    </main>
    <Footer />
  </div>
)
