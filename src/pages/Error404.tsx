import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'

import { RoutePaths } from '@shared/utils/navigation'

export const Error404 = () => (
  <div className="flex justify-center items-center h-screen p-8">
    <Card className="max-w-md mx-auto p-6 shadow-lg border border-83c5be bg-EDF6F9 rounded-3xl text-center">
      <CardHeader>
        <h1 className="text-4xl font-semibold text-006D77">
          404 - Page Not Found
        </h1>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <p className="text-xl text-006D77">
          The page you are looking for does not exist.
        </p>
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
  </div>
)
