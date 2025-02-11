import { useState } from 'react'
import { Button, Input, Card, CardBody, CardFooter } from '@nextui-org/react'
import { MdOutlineMail } from 'react-icons/md'

import { AuthCredentials } from '@/src/types'

interface AuthFormProps {
  title: string
  handleClick: (credentials: AuthCredentials) => void
}

export const AuthForm = ({ title, handleClick }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Card className="w-96 shadow-lg bg-white rounded-3xl">
      <CardBody className="flex flex-col gap-4">
        <Input
          fullWidth
          isClearable
          label="Email"
          placeholder="Введите ваш email"
          type="email"
          value={email}
          variant="bordered"
          startContent={
            <MdOutlineMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          onChange={e => setEmail(e.target.value)}
          onClear={() => setEmail('')}
        />

        <Input
          fullWidth
          isClearable
          label="Пароль"
          placeholder="Введите ваш пароль"
          type="password"
          value={password}
          variant="bordered"
          onChange={e => setPassword(e.target.value)}
          onClear={() => setEmail('')}
        />

        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            autoFocus
            onPress={() => handleClick({ email, password })}
            className="w-full py-2 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
          >
            {title}
          </Button>
        </CardFooter>
      </CardBody>
    </Card>
  )
}
