import { motion as m } from 'framer-motion'

import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export function GettingStartedPage() {
  return (
    <m.div className="flex flex-col gap-8 p-4" {...DEFAULT_PAGE_ANIMATION}>
      <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
        Начало работы
      </h2>

      <m.div
        className="w-10 h-10 bg-black mb-4"
        initial={{ scale: 0 }}
        animate={{ rotate: 180, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 10,
        }}
      />
    </m.div>
  )
}
