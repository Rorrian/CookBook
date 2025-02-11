import { ToastContainer } from "react-toastify"

import { Navigation } from "@components/index"
import { useAuthListener } from "@hooks/useAuthListener"

export function App() {
  useAuthListener()

  return (
    <>
      <Navigation />
      <ToastContainer />
    </>
  )
}
