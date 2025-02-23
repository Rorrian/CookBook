import { Outlet } from 'react-router-dom'

import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'

export const Layout = () => (
  <div className="relative flex flex-col min-h-screen">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-[-1]"
      style={{ backgroundImage: "url('/bg-dark.webp')" }}
    />

    <div className="relative flex-1">
      <Header className="relative top-[18px] left-[50%] transform -translate-x-[50%] w-[85%]" />
      <main
        className="relative left-[50%] transform -translate-x-[50%] w-[85%] min-h-[80vh] bg-cover bg-left-top bg-no-repeat p-[10px_40px] border-2 border-[#595050] shadow-lg"
        style={{
          backgroundImage: "url('/book2_.webp')",
          // FIXME: на разных страницах клетки фона разного размера
          backgroundSize: '100% 100%',
        }}
      >
        <Outlet />
      </main>
    </div>

    <Footer />
  </div>
)
