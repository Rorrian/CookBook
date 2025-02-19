import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import { motion as m } from 'framer-motion'

import { RoutePaths } from '@shared/utils/navigation'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export const Error404 = () => (
  <m.div
    className="flex justify-center items-center h-screen p-8"
    {...DEFAULT_PAGE_ANIMATION}
  >
    <Card className="max-w-md mx-auto p-6 shadow-lg border border-83c5be bg-edf6f9 rounded-3xl text-center">
      <CardHeader>
        <h2 className="text-4xl font-semibold text-006d77">
          404 - Page Not Found
        </h2>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <div className="w-full mt-8 text-2xl text-center text-gray-800">
          <img alt="" className="mx-auto mb-4 w-36 h-auto" src="/error.gif" />
          The page you are looking for does not exist.
        </div>

        <div>
          <Button
            as={Link}
            to={RoutePaths.HOME}
            color="primary"
            className="w-full py-3 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
          >
            Go to Home
          </Button>
        </div>
      </CardBody>
    </Card>
  </m.div>
)
